import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  return (
    <footer className="w-full bg-outback-black text-outback-muted-light border-t border-outback-line">
      <div className="content-container flex flex-col w-full">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 py-16">
          {/* Brand blurb */}
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="font-display text-lg font-semibold uppercase tracking-[0.05em] text-outback-cream"
            >
              <span className="text-outback-rust">Outback</span> Peptide Labs
            </LocalizedClientLink>
            <p className="text-sm leading-relaxed">
              Outback Peptide Labs — Australian-owned supplier of research-grade
              peptides. ABN 00 000 000 000 (placeholder).
            </p>
            <p className="text-sm leading-relaxed">
              📧 support@outbackpeptidelabs.example
              <span className="mx-1">•</span> Sydney, NSW
            </p>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-y-3">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.05em] text-outback-cream">
              Shop
            </span>
            <ul className="flex flex-col gap-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="hover:text-outback-amber transition-colors"
                >
                  All Peptides
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/categories/bulk-kits"
                  className="hover:text-outback-amber transition-colors"
                >
                  Bulk Kits
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="hover:text-outback-amber transition-colors"
                >
                  Lab Reports
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-y-3">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.05em] text-outback-cream">
              Support
            </span>
            <ul className="flex flex-col gap-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/account"
                  className="hover:text-outback-amber transition-colors"
                >
                  My Account
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/shipping"
                  className="hover:text-outback-amber transition-colors"
                >
                  Shipping Info
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href="mailto:support@outbackpeptidelabs.example"
                  className="hover:text-outback-amber transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-y-3">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.05em] text-outback-cream">
              Legal
            </span>
            <ul className="flex flex-col gap-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/legal/terms"
                  className="hover:text-outback-amber transition-colors"
                >
                  Terms &amp; Conditions
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/privacy"
                  className="hover:text-outback-amber transition-colors"
                >
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/refunds"
                  className="hover:text-outback-amber transition-colors"
                >
                  Refund Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/shipping"
                  className="hover:text-outback-amber transition-colors"
                >
                  Shipping Policy
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="border-t border-outback-line py-8 flex flex-col gap-y-4 text-xs leading-relaxed text-outback-muted-light">
          <p>
            <strong className="text-outback-cream">Disclaimer:</strong> All
            products supplied by Outback Peptide Labs are intended for laboratory
            research use only and are not for human consumption. These products
            are not therapeutic goods within the meaning of the Therapeutic Goods
            Act 1989 (Cth) and have not been evaluated by the Therapeutic Goods
            Administration. Nothing on this website constitutes medical advice.
            This website is restricted to persons 18 years of age or older.
          </p>
          <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between">
            <Text className="text-xs text-outback-muted-light">
              © {new Date().getFullYear()} Outback Peptide Labs. All prices in AUD
              inc. GST.
            </Text>
            <MedusaCTA />
          </div>
        </div>
      </div>
    </footer>
  )
}
