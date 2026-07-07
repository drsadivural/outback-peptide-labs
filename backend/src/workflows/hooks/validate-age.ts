import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { assertPurchaserEligible } from "../../lib/purchaser-eligibility"

/**
 * Enforce the 18+ / authorised-purchaser gate at cart completion.
 *
 * The `completeCartWorkflow` exposes a `validate` hook whose data payload is
 * `{ input, cart }` (see `@medusajs/core-flows` complete-cart workflow, where
 * the hook is created with `createHook("validate", { input, cart })`). The
 * `cart` is already the fully-hydrated cart (queried with `completeCartFields`,
 * which includes `metadata`), so we validate against it directly rather than
 * issuing a second query.
 *
 * `assertPurchaserEligible` throws a `MedusaError` (NOT_ALLOWED) when the cart
 * has no `date_of_birth`, has not attested (`age_attested !== true`), or the
 * resolved age is under 18 — which stops the workflow and blocks checkout
 * server-side.
 */
completeCartWorkflow.hooks.validate(async ({ cart }) => {
  assertPurchaserEligible(
    (cart?.metadata ?? undefined) as Record<string, unknown> | undefined
  )
})
