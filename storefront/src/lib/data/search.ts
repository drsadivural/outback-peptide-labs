"use server"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "./products"

export type SearchSuggestion = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  price: string | null
}

/**
 * Lightweight autocomplete for the header/mobile search. Returns up to 6 slim
 * product results for a query, each carrying just what the dropdown needs:
 * id, title, handle, thumbnail and a formatted (cheapest-variant) price.
 *
 * Returns an empty list for empty/short queries (< 2 chars) so the caller can
 * cheaply short-circuit without hitting the Store API.
 */
export async function getSearchSuggestions(
  query: string,
  countryCode: string
): Promise<SearchSuggestion[]> {
  const q = (query || "").trim()

  if (q.length < 2 || !countryCode) {
    return []
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      q,
      limit: 6,
      fields: "id,title,handle,thumbnail,*variants.calculated_price",
    } as HttpTypes.StoreProductListParams,
  })

  return products.map((product) => {
    const cheapest = (product.variants || [])
      .filter((v: any) => !!v?.calculated_price?.calculated_amount)
      .sort(
        (a: any, b: any) =>
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
      )[0] as any

    const price = cheapest?.calculated_price
      ? convertToLocale({
          amount: cheapest.calculated_price.calculated_amount,
          currency_code: cheapest.calculated_price.currency_code,
        })
      : null

    return {
      id: product.id,
      title: product.title ?? "",
      handle: product.handle ?? "",
      thumbnail: product.thumbnail ?? null,
      price,
    }
  })
}
