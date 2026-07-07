import { MedusaError } from "@medusajs/framework/utils"
import { isAdult } from "./age"

/**
 * Asserts that a purchaser (identified by cart/order metadata) is eligible to
 * complete a purchase from this store.
 *
 * Eligibility requires all of:
 *  - a `date_of_birth` (ISO date string) present in metadata,
 *  - `age_attested` strictly equal to boolean `true`,
 *  - the resolved age being 18 years or older.
 *
 * Throws a {@link MedusaError} of type `NOT_ALLOWED` when any condition fails.
 * This is intended to be called from the `completeCartWorkflow` validate hook
 * so that under-18 / unverified checkouts are blocked server-side.
 */
export function assertPurchaserEligible(
  metadata: Record<string, unknown> | null | undefined,
  now?: Date
): void {
  const dob = metadata?.date_of_birth
  const attested = metadata?.age_attested === true

  if (typeof dob !== "string" || dob.trim() === "") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "A date of birth is required to complete this order."
    )
  }
  if (!attested) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must confirm you are 18+ and an authorised purchaser."
    )
  }
  if (!isAdult(dob, now)) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must be 18 years or older to purchase from this store."
    )
  }
}
