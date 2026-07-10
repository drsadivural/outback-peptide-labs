import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Search — Outback Peptide Labs",
  description: "Search research peptides and lab supplies.",
  robots: { index: false },
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const { q } = await searchParams
  const query = (q || "").trim()

  const region = await getRegion(countryCode)

  let products: HttpTypes.StoreProduct[] = []
  if (query && region) {
    const { response } = await listProducts({
      countryCode,
      queryParams: {
        q: query,
        limit: 24,
      } as HttpTypes.StoreProductListParams,
    })
    products = response.products
  }

  return (
    <div className="content-container py-12" data-testid="search-page">
      <h1 className="font-display text-3xl font-bold tracking-[-0.01em] text-skeuo-ink skeuo-emboss">
        Search
      </h1>
      <p className="mt-2 mb-8 text-skeuo-body">
        {query ? (
          <>
            {products.length} result{products.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-skeuo-ink">“{query}”</span>
          </>
        ) : (
          "Type a term in the search box above to find products."
        )}
      </p>

      {query && products.length === 0 ? (
        <div className="skeuo-panel rounded-2xl p-10 text-center text-skeuo-body">
          No products matched <span className="font-semibold">“{query}”</span>.
          Try a different term — e.g. a peptide name like “BPC”, “retatrutide”,
          or “NAD”.
        </div>
      ) : (
        <ul
          className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-8"
          data-testid="search-results"
        >
          {products.map((p) => (
            <li key={p.id}>
              <ProductPreview product={p} region={region!} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
