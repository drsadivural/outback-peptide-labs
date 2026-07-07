"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { useState } from "react"

import PaymentButton from "../payment-button"
import AgeVerification, {
  AgeVerificationState,
  validateAgeVerification,
} from "../age-verification"
import { useSearchParams } from "next/navigation"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  // Seed from any age fields already written to the cart metadata (e.g. if the
  // customer returns to the review step after a failed order attempt).
  const [ageState, setAgeState] = useState<AgeVerificationState>({
    dateOfBirth:
      typeof cart?.metadata?.date_of_birth === "string"
        ? cart.metadata.date_of_birth
        : "",
    attested: cart?.metadata?.age_attested === true,
  })

  const ageError = validateAgeVerification(ageState)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          Review
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read Medusa
                Store&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <AgeVerification
            value={ageState}
            onChange={setAgeState}
            error={ageError}
          />
          <PaymentButton
            cart={cart}
            data-testid="submit-order-button"
            ageState={ageState}
            ageError={ageError}
          />
        </>
      )}
    </div>
  )
}

export default Review
