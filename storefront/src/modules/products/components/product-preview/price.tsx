import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex flex-col">
      {price.price_type === "sale" && (
        <span
          className="text-sm text-brand-muted line-through"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clx(
          "font-display text-lg font-bold tracking-[-0.01em] text-brand-ink",
          {
            "text-brand-blue": price.price_type === "sale",
          }
        )}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
      <span className="text-[0.68rem] font-semibold uppercase tracking-wide text-brand-muted">
        AUD inc. GST
      </span>
    </div>
  )
}
