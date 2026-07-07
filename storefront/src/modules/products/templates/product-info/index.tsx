import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CoaLink from "@modules/products/components/coa-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-outback-muted-light hover:text-outback-amber"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="font-display text-3xl leading-10 text-outback-cream"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-medium text-outback-ink-light/90 whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>

        <CoaLink product={product} />
      </div>
    </div>
  )
}

export default ProductInfo
