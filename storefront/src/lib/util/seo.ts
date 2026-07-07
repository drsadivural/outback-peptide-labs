/**
 * Shared SEO constants and helpers.
 *
 * The storefront is a single-region AU store; canonical/OG URLs use the `/au`
 * country prefix that the routing layer expects. `BASE_URL` comes from
 * `NEXT_PUBLIC_BASE_URL` (set in `.env.local`), falling back to the local dev
 * origin so builds never crash on a missing env var.
 */
export const BRAND_NAME = "Outback Peptide Labs"

export const DEFAULT_COUNTRY_CODE = "au"

export const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"
).replace(/\/$/, "")

/** Absolute URL for a storefront path. `path` should start with `/`. */
export const absoluteUrl = (path: string): string =>
  `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`

/** Absolute canonical URL for a product handle. */
export const productUrl = (handle: string): string =>
  absoluteUrl(`/${DEFAULT_COUNTRY_CODE}/products/${handle}`)

/** Absolute canonical URL for a category handle. */
export const categoryUrl = (handle: string): string =>
  absoluteUrl(`/${DEFAULT_COUNTRY_CODE}/categories/${handle}`)

/** Trim/normalise a description string for meta tags (single-line, capped). */
export const trimDescription = (
  input: string | null | undefined,
  max = 160
): string => {
  if (!input) {
    return ""
  }
  const text = input.replace(/\s+/g, " ").trim()
  if (text.length <= max) {
    return text
  }
  return `${text.slice(0, max - 1).trimEnd()}…`
}
