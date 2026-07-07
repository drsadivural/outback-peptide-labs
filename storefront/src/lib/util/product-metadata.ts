import { HttpTypes } from "@medusajs/types"

/**
 * Product metadata set at seed time. Read defensively because Medusa types
 * metadata as `Record<string, unknown> | null`.
 */
export type ProductMetadata = {
  badge: string | null
  color: string | null
  no_coa: boolean
  coa_url: string | null
  optionLabel: string | null
}

export const getProductMetadata = (
  product: Pick<HttpTypes.StoreProduct, "metadata">
): ProductMetadata => {
  const meta = (product.metadata ?? {}) as Record<string, unknown>

  const asString = (v: unknown): string | null =>
    typeof v === "string" && v.trim().length > 0 ? v : null

  return {
    badge: asString(meta.badge),
    color: asString(meta.color),
    no_coa: meta.no_coa === true || meta.no_coa === "true",
    coa_url: asString(meta.coa_url),
    optionLabel: asString(meta.optionLabel),
  }
}
