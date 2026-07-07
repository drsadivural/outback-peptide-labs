import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import {
  DEFAULT_COUNTRY_CODE,
  absoluteUrl,
  categoryUrl,
  productUrl,
} from "@lib/util/seo"

// Revalidate the sitemap hourly so newly added products/categories surface
// without a full rebuild.
export const revalidate = 3600

const cc = DEFAULT_COUNTRY_CODE

/**
 * Fetch every product handle for the store, paging through the Store API.
 * Returns an empty list (never throws) so an unreachable backend at build
 * time degrades to a static-only sitemap instead of failing the build.
 */
async function getProductHandles(): Promise<string[]> {
  const handles: string[] = []
  const limit = 100

  try {
    let page = 1
    // Guard against runaway loops on unexpected pagination responses.
    for (let i = 0; i < 100; i++) {
      const { response, nextPage } = await listProducts({
        pageParam: page,
        countryCode: cc,
        queryParams: { limit, fields: "handle" },
      })

      for (const product of response.products) {
        if (product.handle) {
          handles.push(product.handle)
        }
      }

      if (!nextPage) {
        break
      }
      page = nextPage
    }
  } catch (error) {
    console.error(
      `sitemap: failed to load product handles: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  }

  return handles
}

async function getCategoryHandles(): Promise<string[]> {
  try {
    const categories = await listCategories({ fields: "handle" })
    return (categories ?? [])
      .map((c) => c.handle)
      .filter((h): h is string => Boolean(h))
  } catch (error) {
    console.error(
      `sitemap: failed to load category handles: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl(`/${cc}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl(`/${cc}/store`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  const [productHandles, categoryHandles] = await Promise.all([
    getProductHandles(),
    getCategoryHandles(),
  ])

  const categoryEntries: MetadataRoute.Sitemap = categoryHandles.map(
    (handle) => ({
      url: categoryUrl(handle),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  )

  const productEntries: MetadataRoute.Sitemap = productHandles.map((handle) => ({
    url: productUrl(handle),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [...staticEntries, ...categoryEntries, ...productEntries]
}
