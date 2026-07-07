import { assertPurchaserEligible } from "../purchaser-eligibility"

// Fixed reference "now" so age math is deterministic.
const NOW = new Date("2024-06-15T00:00:00.000Z")

describe("assertPurchaserEligible", () => {
  it("throws when date_of_birth is missing", () => {
    expect(() =>
      assertPurchaserEligible({ age_attested: true }, NOW)
    ).toThrow(/date of birth/i)
  })

  it("throws when date_of_birth is an empty/blank string", () => {
    expect(() =>
      assertPurchaserEligible({ date_of_birth: "   ", age_attested: true }, NOW)
    ).toThrow(/date of birth/i)
  })

  it("throws when metadata is null", () => {
    expect(() => assertPurchaserEligible(null, NOW)).toThrow(/date of birth/i)
  })

  it("throws when date_of_birth is present but age is not attested", () => {
    expect(() =>
      assertPurchaserEligible({ date_of_birth: "1990-01-01" }, NOW)
    ).toThrow(/18\+|authorised/i)
  })

  it("throws when attested is a truthy non-boolean (must be strictly true)", () => {
    expect(() =>
      assertPurchaserEligible(
        { date_of_birth: "1990-01-01", age_attested: "true" },
        NOW
      )
    ).toThrow(/18\+|authorised/i)
  })

  it("throws when attested but the purchaser is under 18", () => {
    // Born 2010-01-01, evaluated at 2024-06-15 -> 14 years old.
    expect(() =>
      assertPurchaserEligible(
        { date_of_birth: "2010-01-01", age_attested: true },
        NOW
      )
    ).toThrow(/18 years/i)
  })

  it("does NOT throw for an attested adult", () => {
    expect(() =>
      assertPurchaserEligible(
        { date_of_birth: "1990-01-01", age_attested: true },
        NOW
      )
    ).not.toThrow()
  })

  it("does NOT throw for someone who is exactly 18 today", () => {
    expect(() =>
      assertPurchaserEligible(
        { date_of_birth: "2006-06-15", age_attested: true },
        NOW
      )
    ).not.toThrow()
  })
})
