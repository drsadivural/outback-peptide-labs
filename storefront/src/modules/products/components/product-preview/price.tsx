import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex flex-col items-start gap-1">
      {price.price_type === "sale" && (
        <span
          className="text-sm text-skeuo-muted line-through"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clx(
          "skeuo-price-plate skeuo-engrave px-2.5 py-1 font-display text-lg font-bold tracking-[-0.01em] text-skeuo-ink",
          {
            "!text-skeuo-brass": price.price_type === "sale",
          }
        )}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
      <span className="text-[0.68rem] font-semibold uppercase tracking-wide text-skeuo-muted">
        AUD inc. GST
      </span>
    </div>
  )
}
