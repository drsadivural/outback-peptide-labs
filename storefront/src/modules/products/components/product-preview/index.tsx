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
        className="flex flex-col overflow-hidden rounded-large border border-outback-line bg-outback-surface transition-all duration-150 ease-in-out group-hover:-translate-y-1 group-hover:border-outback-rust group-hover:shadow-lg"
      >
        {/* Media */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-outback-raised">
          {badge && (
            <span className="absolute left-3 top-3 z-10 rounded-circle bg-outback-rust px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-outback-cream">
              {badge}
            </span>
          )}
          <span className="absolute right-3 top-3 z-10 rounded-circle bg-[#3f5233] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-[#d9ecc8]">
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
            className="font-display text-base uppercase tracking-wide text-outback-cream"
            data-testid="product-title"
          >
            {product.title}
          </h3>
          {product.description && (
            <p className="line-clamp-2 flex-1 text-sm text-outback-muted-light">
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
