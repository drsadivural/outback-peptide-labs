"use client"

import { Checkbox, Label, Text } from "@medusajs/ui"
import { isAdult } from "@lib/util/age"

export type AgeVerificationState = {
  dateOfBirth: string
  attested: boolean
}

/**
 * Validates the age-verification inputs for the checkout 18+ gate.
 * Returns null when valid, or an inline error message describing the problem.
 */
export function validateAgeVerification(
  state: AgeVerificationState
): string | null {
  if (!state.dateOfBirth) {
    return "Please enter your date of birth."
  }
  if (!isAdult(state.dateOfBirth)) {
    return "You must be 18 years or older to purchase from this store."
  }
  if (!state.attested) {
    return "You must confirm you are 18+ and an authorised purchaser."
  }
  return null
}

type AgeVerificationProps = {
  value: AgeVerificationState
  onChange: (next: AgeVerificationState) => void
  error?: string | null
}

const AgeVerification: React.FC<AgeVerificationProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="mb-6 rounded-rounded border border-ui-border-base bg-ui-bg-subtle p-4">
      <Text className="txt-medium-plus text-ui-fg-base mb-3">
        Age verification (18+)
      </Text>

      <div className="mb-4">
        <Label
          htmlFor="date_of_birth"
          className="txt-medium text-ui-fg-subtle mb-1 block"
        >
          Date of birth
        </Label>
        <input
          id="date_of_birth"
          name="date_of_birth"
          type="date"
          required
          value={value.dateOfBirth}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) =>
            onChange({ ...value, dateOfBirth: e.target.value })
          }
          className="w-full rounded-base border border-ui-border-base bg-ui-bg-field px-3 py-2 text-ui-fg-base focus:outline-none focus:ring-2 focus:ring-ui-border-interactive"
          data-testid="date-of-birth-input"
        />
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="age_attested"
          role="checkbox"
          type="button"
          checked={value.attested}
          aria-checked={value.attested}
          onClick={() => onChange({ ...value, attested: !value.attested })}
          data-testid="age-attestation-checkbox"
        />
        <Label
          htmlFor="age_attested"
          className="!transform-none !txt-medium"
          size="large"
        >
          I confirm that I am 18 years or older and an authorised purchaser.
        </Label>
      </div>

      {error && (
        <Text
          className="txt-medium text-rose-500 mt-3"
          data-testid="age-verification-error"
        >
          {error}
        </Text>
      )}
    </div>
  )
}

export default AgeVerification
