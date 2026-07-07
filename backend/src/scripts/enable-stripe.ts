import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

const STRIPE_PROVIDER_ID = "pp_stripe_stripe"
const REGION_NAME = "Australia"

/**
 * Enables the Stripe payment provider on the existing "Australia" region.
 *
 * The Australia region is created by the seed before the Stripe payment
 * module is registered, so it starts with only the system default provider.
 * This script attaches `pp_stripe_stripe` to that region.
 *
 * Idempotent: if Stripe is already enabled on the region, it is a no-op.
 *
 * Run with: `npm run enable:stripe` (from backend/) or
 * `pnpm --filter backend enable:stripe` (from repo root).
 */
export default async function enableStripe({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "payment_providers.id"],
    filters: { name: REGION_NAME },
  })

  const region = regions[0]

  if (!region) {
    logger.error(
      `Region "${REGION_NAME}" not found. Run the seed first (npm run seed).`
    )
    return
  }

  const currentProviderIds: string[] = (region.payment_providers ?? [])
    .map((p) => p?.id)
    .filter((id): id is string => Boolean(id))

  if (currentProviderIds.includes(STRIPE_PROVIDER_ID)) {
    logger.info(
      `Stripe (${STRIPE_PROVIDER_ID}) is already enabled on the "${REGION_NAME}" region. Nothing to do.`
    )
    return
  }

  const nextProviderIds = Array.from(
    new Set([...currentProviderIds, STRIPE_PROVIDER_ID])
  )

  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: region.id },
      update: { payment_providers: nextProviderIds },
    },
  })

  logger.info(
    `Enabled Stripe (${STRIPE_PROVIDER_ID}) on the "${REGION_NAME}" region. ` +
      `Payment providers: ${nextProviderIds.join(", ")}`
  )
}
