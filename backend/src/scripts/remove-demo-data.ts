import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  deleteProductsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteRegionsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Removes the default demo data that `create-medusa-app` seeds, so the store
 * contains only the Outback Peptide Labs catalogue. Idempotent: only deletes
 * items that still exist. Run once after scaffolding + seeding a fresh DB:
 *   npx medusa exec ./src/scripts/remove-demo-data.ts
 */
const DEMO_PRODUCT_HANDLES = ["t-shirt", "sweatshirt", "sweatpants", "shorts"]
const DEMO_CATEGORY_NAMES = ["Shirts", "Sweatshirts", "Pants", "Merch"]
const DEMO_REGION_NAMES = ["Europe", "United States"]

export default async function removeDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
    filters: { handle: DEMO_PRODUCT_HANDLES },
  })
  if (products.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: products.map((p) => p.id) },
    })
    logger.info(`Removed ${products.length} demo products.`)
  }

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
    filters: { name: DEMO_CATEGORY_NAMES },
  })
  if (categories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: categories.map((c) => c.id),
    })
    logger.info(`Removed ${categories.length} demo categories.`)
  }

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
    filters: { name: DEMO_REGION_NAMES },
  })
  if (regions.length) {
    await deleteRegionsWorkflow(container).run({
      input: { ids: regions.map((r) => r.id) },
    })
    logger.info(`Removed ${regions.length} demo regions.`)
  }

  logger.info("Demo data cleanup complete.")
}
