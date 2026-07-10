import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import SearchBar from "@modules/layout/components/search-bar"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  const primaryLinks = (
    <>
      <LocalizedClientLink
        className="transition-colors hover:text-skeuo-brass"
        href="/store"
        data-testid="nav-shop-link"
      >
        Shop
      </LocalizedClientLink>
      <LocalizedClientLink
        className="transition-colors hover:text-skeuo-brass"
        href="/categories/bulk-kits"
        data-testid="nav-bulk-link"
      >
        Bulk Kits
      </LocalizedClientLink>
      <LocalizedClientLink
        className="transition-colors hover:text-skeuo-brass"
        href="/account"
        data-testid="nav-account-link"
      >
        Account
      </LocalizedClientLink>
    </>
  )

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="skeuo-brushed relative mx-auto backdrop-blur-md text-skeuo-ink">
        {/* Primary bar */}
        <nav className="content-container flex items-center justify-between w-full h-[64px] small:h-[72px] gap-x-2 text-small-regular">
          {/* Left: mobile/side menu */}
          <div className="flex-1 basis-0 h-full flex items-center min-w-0">
            <div className="h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
          </div>

          {/* Center: wordmark */}
          <div className="flex items-center h-full min-w-0">
            <LocalizedClientLink
              href="/"
              className="font-display text-base small:text-xl font-bold tracking-[-0.01em] whitespace-nowrap text-skeuo-ink skeuo-emboss"
              data-testid="nav-store-link"
              aria-label="Outback Peptide Labs — home"
            >
              <span className="text-skeuo-brass">Outback</span> Peptide Labs
            </LocalizedClientLink>
          </div>

          {/* Right: nav links (desktop) + search + cart */}
          <div className="flex items-center gap-x-3 small:gap-x-6 h-full flex-1 basis-0 justify-end min-w-0">
            <div className="hidden small:flex items-center gap-x-7 h-full font-semibold text-sm text-skeuo-body skeuo-emboss">
              {primaryLinks}
            </div>
            <SearchBar />
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="skeuo-btn skeuo-btn-amber inline-flex items-center justify-center px-3 small:px-4 py-2 text-sm whitespace-nowrap"
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

        {/* Secondary strip: always-visible primary links on mobile/tablet */}
        <nav
          className="small:hidden border-t border-skeuo-line/70"
          aria-label="Primary"
        >
          <div className="content-container flex items-center justify-center gap-x-6 overflow-x-auto whitespace-nowrap py-2.5 text-sm font-semibold text-skeuo-body skeuo-emboss">
            {primaryLinks}
          </div>
        </nav>
      </header>
    </div>
  )
}
