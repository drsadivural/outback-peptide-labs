import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

/**
 * Home-page "Research Peptides" showcase. The catalogue is organised by
 * category (not collection), so rather than per-collection rails we surface a
 * flat grid of products under a single heading — matching the storefront's
 * shop section. Links through to the full /store listing.
 */
export default async function ResearchPeptides({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <section className="content-container py-16 small:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-[0.02em] text-outback-amber-light small:text-4xl">
          Research Peptides
        </h2>
        <p className="mt-3 text-outback-muted-light">
          Supplied for laboratory research use only. Select a dosage to see
          pricing — all prices in AUD.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-8 small:grid-cols-3 medium:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>

      <div className="mt-12 flex justify-center">
        <LocalizedClientLink
          href="/store"
          className="skeuo-btn skeuo-btn-amber inline-flex items-center justify-center px-8 py-3.5 text-base"
        >
          View all products
        </LocalizedClientLink>
      </div>
    </section>
  )
}
