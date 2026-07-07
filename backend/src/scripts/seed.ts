import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createPromotionsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { PRODUCTS, KITS, CATEGORIES, CatalogueItem } from "../data/catalogue"

/**
 * Seeds the Outback Peptide Labs commerce foundation:
 *  - Store currency AUD, tax-inclusive
 *  - Australia region (AUD, country au) with Stripe enabled
 *  - 10% GST tax region
 *  - Sales channel + stock location + default shipping profile
 *  - Fulfillment set / service zone (au) + Australia Post Express flat option (A$14.95)
 *  - Publishable API key wired to the sales channel
 *  - 5 catalogue categories + a "Bulk Kits" category
 *  - Full catalogue (products + kits), idempotent on handle
 *  - FREESHIP300 automatic promotion (100% off shipping when item_total >= A$300)
 *
 * Re-running is safe: existing products, categories, region, tax region, shipping
 * option, api key and promotion are detected and skipped.
 */
export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const storeModule = container.resolve(Modules.STORE)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  const CURRENCY = "aud"
  const COUNTRY = "au"

  logger.info("Seeding Outback Peptide Labs catalogue…")

  // 1. Store: AUD, tax-inclusive ---------------------------------------------
  const [store] = await storeModule.listStores()
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: CURRENCY, is_default: true, is_tax_inclusive: true },
        ],
      },
    },
  })
  logger.info("Store currency set to AUD (tax-inclusive).")

  // 2. Sales channel ----------------------------------------------------------
  const { data: existingChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  let salesChannelId = existingChannels[0]?.id
  if (!salesChannelId) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Outback Storefront" }] },
    })
    salesChannelId = result[0].id
    logger.info("Created sales channel 'Outback Storefront'.")
  }

  // 3. Stock location ---------------------------------------------------------
  const { data: existingLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  let stockLocationId = existingLocations[0]?.id
  if (!stockLocationId) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: "Sydney Facility",
            address: {
              address_1: "1 Research Way",
              city: "Sydney",
              country_code: COUNTRY,
              postal_code: "2000",
            },
          },
        ],
      },
    })
    stockLocationId = result[0].id
    logger.info("Created stock location 'Sydney Facility'.")
  }

  // Link stock location <-> sales channel (idempotent; dismiss existing first)
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocationId,
      add: [salesChannelId],
    },
  })

  // Link the manual fulfillment provider to the stock location.
  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocationId },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  // 4. Region (AU / AUD) with Stripe enabled ---------------------------------
  // Attach Stripe when it is registered (see Task 5). If Stripe is not yet
  // configured, fall back to the system default provider so the seed still runs;
  // re-running after Stripe is enabled will pick it up on a fresh DB.
  const { data: enabledProviders } = await query.graph({
    entity: "payment_provider",
    fields: ["id", "is_enabled"],
  })
  const enabledProviderIds = enabledProviders
    .filter((p: { is_enabled?: boolean }) => p.is_enabled !== false)
    .map((p: { id: string }) => p.id)
  const regionPaymentProviders = enabledProviderIds.includes("pp_stripe_stripe")
    ? ["pp_stripe_stripe"]
    : enabledProviderIds

  const { data: existingRegions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
  })
  if (!existingRegions.some((r) => r.name === "Australia")) {
    await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Australia",
            currency_code: CURRENCY,
            countries: [COUNTRY],
            payment_providers: regionPaymentProviders,
          },
        ],
      },
    })
    logger.info(
      `Created region 'Australia' (AUD) with payment providers: ${
        regionPaymentProviders.join(", ") || "none"
      }.`
    )
    if (!regionPaymentProviders.includes("pp_stripe_stripe")) {
      logger.warn(
        "Stripe (pp_stripe_stripe) is not enabled yet — configure it in Task 5, then re-seed on a fresh DB to attach it to the Australia region."
      )
    }
  }

  // 5. Tax region: 10% GST ----------------------------------------------------
  const { data: existingTaxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })
  if (!existingTaxRegions.some((t) => t.country_code === COUNTRY)) {
    await createTaxRegionsWorkflow(container).run({
      // `default_tax_rate` is accepted by the workflow at runtime (see the admin
      // tax-regions route validator) though it is absent from the exported type.
      input: [
        {
          country_code: COUNTRY,
          // The tax region MUST have a tax provider, otherwise automatic tax
          // calculation on cart operations (add-to-cart, etc.) fails with
          // "Unable to retrieve the tax provider with id: null". `tp_system`
          // is Medusa's built-in default tax provider.
          provider_id: "tp_system",
          default_tax_rate: { name: "GST", code: "GST", rate: 10 },
        } as any,
      ],
    })
    logger.info("Created tax region AU with 10% GST.")
  }

  // 6. Shipping profile -------------------------------------------------------
  const { data: existingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id", "name"],
  })
  let shippingProfileId = existingProfiles.find((p) => p.name === "Default")?.id
  if (!shippingProfileId) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default", type: "default" }] },
    })
    shippingProfileId = result[0].id
    logger.info("Created default shipping profile.")
  }

  // 7. Fulfillment set + service zone (au) -----------------------------------
  // A fresh stock location does not auto-create a fulfillment set, so create one
  // and link it to the stock location. Idempotent: reuse an existing zone if present.
  const { data: existingSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "name", "service_zones.id", "service_zones.name"],
  })
  let serviceZoneId = existingSets
    .flatMap((s) => s.service_zones ?? [])
    .find((z: { id: string }) => !!z?.id)?.id

  if (!serviceZoneId) {
    const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
      name: "Australia Delivery",
      type: "shipping",
      service_zones: [
        {
          name: "Australia",
          geo_zones: [{ country_code: COUNTRY, type: "country" }],
        },
      ],
    })
    serviceZoneId = fulfillmentSet.service_zones[0].id

    // Link the fulfillment set to the stock location.
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocationId },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
    logger.info("Created fulfillment set + service zone for Australia.")
  }

  // 8. Shipping option: Australia Post Express (flat A$14.95) -----------------
  const { data: existingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"],
  })
  if (!existingOptions.some((o) => o.name === "Australia Post Express")) {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Australia Post Express",
          service_zone_id: serviceZoneId!,
          shipping_profile_id: shippingProfileId!,
          provider_id: "manual_manual",
          price_type: "flat",
          type: {
            label: "Express",
            description: "Australia Post Express",
            code: "express",
          },
          prices: [{ currency_code: CURRENCY, amount: 14.95 }],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })
    logger.info("Created 'Australia Post Express' shipping option (A$14.95).")
  }

  // 9. Publishable API key wired to the sales channel -------------------------
  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "token", "type"],
  })
  let publishableKey: { id: string; token: string } | undefined =
    existingKeys.find((k) => k.type === "publishable")
  if (!publishableKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Storefront",
            type: "publishable",
            created_by: "seed",
          },
        ],
      },
    })
    publishableKey = { id: result[0].id, token: result[0].token }
    logger.info("Created publishable API key.")
  }
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableKey.id,
      add: [salesChannelId],
    },
  })

  // 10. Categories ------------------------------------------------------------
  const allCategoryNames = [...CATEGORIES, "Bulk Kits"]
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })
  const existingCatNames = new Set(existingCategories.map((c) => c.name))
  const catByName = new Map<string, string>(
    existingCategories.map((c) => [c.name, c.id])
  )
  const categoriesToCreate = allCategoryNames.filter(
    (name) => !existingCatNames.has(name)
  )
  if (categoriesToCreate.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: categoriesToCreate.map((name) => ({
          name,
          is_active: true,
        })),
      },
    })
    for (const c of result) {
      catByName.set(c.name, c.id)
    }
    logger.info(`Created ${result.length} categories.`)
  }
  const kitCategoryId = catByName.get("Bulk Kits")

  // 11. Products + kits (idempotent on handle) --------------------------------
  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["handle"],
  })
  const existingHandles = new Set(existing.map((p) => p.handle))

  const toProductInput = (item: CatalogueItem, categoryId?: string) => {
    const optionName = item.optionLabel || "Dosage"
    return {
      title: item.name,
      handle: item.handle,
      description: item.desc,
      status: "published" as const,
      category_ids: categoryId ? [categoryId] : [],
      sales_channels: [{ id: salesChannelId }],
      shipping_profile_id: shippingProfileId!,
      metadata: {
        badge: item.badge ?? null,
        color: item.color,
        no_coa: item.noCoa ?? false,
      },
      options: [{ title: optionName, values: item.variants.map((v) => v.dose) }],
      variants: item.variants.map((v) => ({
        title: v.dose,
        options: { [optionName]: v.dose },
        manage_inventory: false,
        prices: [{ amount: v.price, currency_code: CURRENCY }],
      })),
    }
  }

  const productInputs = PRODUCTS.filter(
    (p) => !existingHandles.has(p.handle)
  ).map((p) => toProductInput(p, p.category ? catByName.get(p.category) : undefined))

  const kitInputs = KITS.filter((k) => !existingHandles.has(k.handle)).map((k) =>
    toProductInput(k, kitCategoryId)
  )

  const allInputs = [...productInputs, ...kitInputs]
  if (allInputs.length) {
    await createProductsWorkflow(container).run({
      input: { products: allInputs },
    })
  }

  // 12. FREESHIP300 automatic promotion (100% off shipping over A$300) --------
  const { data: promos } = await query.graph({
    entity: "promotion",
    fields: ["id", "code"],
  })
  if (!promos.some((p) => p.code === "FREESHIP300")) {
    await createPromotionsWorkflow(container).run({
      input: {
        promotionsData: [
          {
            code: "FREESHIP300",
            is_automatic: true,
            type: "standard",
            status: "active",
            application_method: {
              type: "percentage",
              target_type: "shipping_methods",
              allocation: "across",
              value: 100,
              currency_code: CURRENCY,
            },
            rules: [
              {
                attribute: "item_total",
                operator: "gte",
                values: ["300"],
              },
            ],
          },
        ],
      },
    })
    logger.info("Created automatic promotion FREESHIP300 (free shipping over A$300).")
  }

  logger.info(
    `Seed complete: ${productInputs.length} products, ${kitInputs.length} kits created (existing skipped).`
  )
  logger.info(`Publishable API key: ${publishableKey.token}`)
}
