import { getProductPrice } from "@lib/util/get-product-price"
import { getProductMetadata } from "@lib/util/product-metadata"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import Vial from "../vial"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const { badge, color } = getProductMetadata(product)
  const image = product.thumbnail || product.images?.[0]?.url

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-sm transition-all duration-150 ease-in-out group-hover:-translate-y-1 group-hover:border-brand-blue group-hover:shadow-[0_16px_40px_-16px_rgba(15,23,41,0.25)]"
      >
        {/* Media */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-brand-surface2">
          {badge && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-blue px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-white">
              {badge}
            </span>
          )}
          <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-brand-greenSoft px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-brand-green">
            In Stock
          </span>
          {image ? (
            <Image
              src={image}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
              draggable={false}
              quality={50}
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              fill
            />
          ) : (
            <Vial color={color} size={140} />
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-y-2 p-4">
          <h3
            className="font-display text-base font-semibold tracking-[-0.01em] text-brand-ink"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {product.description && (
            <p className="line-clamp-2 flex-1 text-sm text-brand-body">
              {product.description}
            </p>
          )}
          {cheapestPrice && (
            <div className="mt-2">
              <PreviewPrice price={cheapestPrice} />
            </div>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
