import { clx } from "@medusajs/ui"

import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return (
      <div className="block w-32 h-9 rounded bg-slate-100 animate-pulse" />
    )
  }

  const onSale = selectedPrice.price_type === "sale"

  return (
    <div className="flex flex-col">
      <span
        className={clx(
          "font-display text-3xl font-semibold leading-none",
          onSale ? "text-brand-blue" : "text-brand-ink"
        )}
      >
        {!variant && (
          <span className="text-base font-normal text-brand-muted">
            From{" "}
          </span>
        )}
        <span
          data-testid="product-price"
          data-value={selectedPrice.calculated_price_number}
        >
          {selectedPrice.calculated_price}
        </span>
      </span>
      <span className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-brand-muted">
        AUD inc. GST
      </span>
      {onSale && (
        <p className="mt-1 text-sm text-brand-muted">
          <span>Original: </span>
          <span
            className="line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
          <span className="ml-2 font-semibold text-brand-blue">
            -{selectedPrice.percentage_diff}%
          </span>
        </p>
      )}
    </div>
  )
}
