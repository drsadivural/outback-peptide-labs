import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-[76px] mx-auto border-b-[3px] border-outback-rust bg-outback-cream/95 backdrop-blur-sm text-outback-ink-dark">
        <nav className="content-container flex items-center justify-between w-full h-full text-small-regular">
          {/* Left: mobile/side menu */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>

          {/* Center: wordmark */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="font-display text-lg sm:text-xl font-semibold uppercase tracking-[0.05em] whitespace-nowrap text-outback-ink-dark"
              data-testid="nav-store-link"
              aria-label="Outback Peptide Labs — home"
            >
              <span className="text-outback-rust">Outback</span> Peptide Labs
            </LocalizedClientLink>
          </div>

          {/* Right: nav links + account + cart */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full font-semibold text-sm">
              <LocalizedClientLink
                className="hover:text-outback-rust"
                href="/store"
                data-testid="nav-shop-link"
              >
                Shop
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-outback-rust"
                href="/categories/bulk-kits"
                data-testid="nav-bulk-link"
              >
                Bulk Kits
              </LocalizedClientLink>
              <LocalizedClientLink
                className="hover:text-outback-rust"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-outback-rust flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
