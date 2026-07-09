"use client"

import { HttpTypes } from "@medusajs/types"
import { getProductMetadata } from "@lib/util/product-metadata"

type CoaLinkProps = {
  product: Pick<HttpTypes.StoreProduct, "metadata">
}

/**
 * "Lab Report" (Certificate of Analysis) link shown on the product detail page.
 * Hidden entirely when the product's metadata flags `no_coa`. When a real
 * `coa_url` is present it is used as the href; otherwise a non-navigating
 * placeholder link is rendered (matching the reference behaviour) rather than
 * fabricating a document.
 */
const CoaLink = ({ product }: CoaLinkProps) => {
  const { no_coa, coa_url } = getProductMetadata(product)

  if (no_coa) {
    return null
  }

  const className =
    "skeuo-btn skeuo-btn-neutral inline-flex w-fit items-center gap-x-1 px-4 py-2 text-sm !text-skeuo-brass"

  if (coa_url) {
    return (
      <a
        href={coa_url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        data-testid="coa-link"
      >
        Lab Report ↗
      </a>
    )
  }

  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={className}
      data-testid="coa-link"
    >
      Lab Report ↗
    </a>
  )
}

export default CoaLink
