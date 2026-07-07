import { PRODUCTS, KITS, CATEGORIES } from "../catalogue"

describe("catalogue data", () => {
  it("has the full product + kit counts", () => {
    expect(PRODUCTS.length).toBe(32)
    expect(KITS.length).toBe(4)
  })

  it("exposes the five categories in order", () => {
    expect(CATEGORIES).toEqual([
      "Tissue Repair & Regenerative Support",
      "Hormonal Balance & Metabolic Regulation",
      "Resilience & Healthy Aging",
      "Neuro-Enhancement & Specialty Protocols",
      "Lab Supplies",
    ])
  })

  it("has unique handles across products and kits", () => {
    const handles = [...PRODUCTS, ...KITS].map((p) => p.handle)
    expect(new Set(handles).size).toBe(handles.length)
  })

  it("every variant has a positive price and a dose label", () => {
    for (const p of [...PRODUCTS, ...KITS]) {
      expect(p.variants.length).toBeGreaterThan(0)
      for (const v of p.variants) {
        expect(v.price).toBeGreaterThan(0)
        expect(v.dose.trim().length).toBeGreaterThan(0)
      }
    }
  })
})
