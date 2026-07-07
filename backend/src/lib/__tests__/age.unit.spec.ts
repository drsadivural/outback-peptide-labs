import { calculateAge, isAdult } from "../age"

const NOW = new Date("2026-07-07T00:00:00Z")

describe("age", () => {
  it("computes age from a DOB", () => {
    expect(calculateAge("2000-07-07", NOW)).toBe(26)
  })
  it("does not count a birthday that has not occurred yet this year", () => {
    expect(calculateAge("2008-07-08", NOW)).toBe(17)
  })
  it("treats exactly-18-today as adult", () => {
    expect(isAdult("2008-07-07", NOW)).toBe(true)
  })
  it("treats 17 as not adult", () => {
    expect(isAdult("2009-01-01", NOW)).toBe(false)
  })
  it("rejects invalid/empty input as not adult", () => {
    expect(isAdult("", NOW)).toBe(false)
    expect(isAdult("not-a-date", NOW)).toBe(false)
  })
})
