import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import JsonLd from "@modules/common/components/json-ld"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { BASE_URL, BRAND_NAME, absoluteUrl } from "@lib/util/seo"

export const metadata: Metadata = {
  title: `${BRAND_NAME} — Research-Grade Peptides, Delivered Australia-Wide`,
  description:
    "Independently batch-tested research peptides with published certificates of analysis. Same-day dispatch from our Australian facility. All prices in AUD inc. GST.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    title: `${BRAND_NAME} — Research-Grade Peptides`,
    description:
      "Independently batch-tested research peptides with published certificates of analysis. Same-day dispatch from our Australian facility.",
    url: BASE_URL,
    siteName: BRAND_NAME,
    images: [absoluteUrl("/logo-horizontal.webp")],
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: BASE_URL,
    logo: absoluteUrl("/logo-horizontal.webp"),
  }

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Hero />
      <TrustBar />
      <div id="quality" className="py-12 scroll-mt-24">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
