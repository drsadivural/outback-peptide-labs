import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Image from "next/image"
import Vial from "@modules/products/components/vial"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  /** Tint used for the drawn-vial fallback when the product has no images. */
  vialColor?: string | null
}

const ImageGallery = ({ images, vialColor }: ImageGalleryProps) => {
  if (!images.length) {
    return (
      <div className="flex items-start relative">
        <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
          <Container className="relative flex aspect-[29/34] w-full items-center justify-center overflow-hidden rounded-rounded bg-outback-raised">
            <Vial color={vialColor} size={320} />
          </Container>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 small:mx-16 gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0 rounded-rounded"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
