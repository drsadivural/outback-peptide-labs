import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

export default async function Footer() {
  return (
    <footer className="skeuo-leather skeuo-stitch w-full text-[#cdb994]">
      <div className="content-container flex flex-col w-full">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 py-16">
          {/* Brand blurb */}
          <div className="flex flex-col gap-y-4">
            <LocalizedClientLink
              href="/"
              className="font-display text-lg font-bold tracking-[-0.01em] text-skeuo-cream skeuo-emboss-dark"
            >
              <span className="text-skeuo-amberLight">Outback</span> Peptide Labs
            </LocalizedClientLink>
            <p className="text-sm leading-relaxed">
              Outback Peptide Labs — Australian-owned supplier of research-grade
              peptides. ABN 00 000 000 000 (placeholder).
            </p>
            <p className="text-sm leading-relaxed">
              <span>📧 support@outbackpeptidelabs.example</span>
              <span className="mx-1">•</span>
              <span>Sydney, NSW</span>
            </p>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-y-3">
            <span className="font-display text-sm font-bold tracking-[-0.01em] text-skeuo-cream skeuo-emboss-dark">
              Shop
            </span>
            <ul className="flex flex-col gap-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  All Peptides
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/categories/bulk-kits"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Bulk Kits
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/store"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Lab Reports
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-y-3">
            <span className="font-display text-sm font-bold tracking-[-0.01em] text-skeuo-cream skeuo-emboss-dark">
              Support
            </span>
            <ul className="flex flex-col gap-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/account"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  My Account
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/shipping"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Shipping Info
                </LocalizedClientLink>
              </li>
              <li>
                <a
                  href="mailto:support@outbackpeptidelabs.example"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-y-3">
            <span className="font-display text-sm font-bold tracking-[-0.01em] text-skeuo-cream skeuo-emboss-dark">
              Legal
            </span>
            <ul className="flex flex-col gap-y-2 text-sm">
              <li>
                <LocalizedClientLink
                  href="/legal/terms"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Terms &amp; Conditions
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/privacy"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Privacy Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/refunds"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Refund Policy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/legal/shipping"
                  className="transition-colors hover:text-skeuo-amberLight"
                >
                  Shipping Policy
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="border-t border-[#4a3721] py-8 flex flex-col gap-y-4 text-xs leading-relaxed text-[#bda789]">
          <p>
            <strong className="text-skeuo-cream">Disclaimer:</strong> All
            products supplied by Outback Peptide Labs are intended for laboratory
            research use only and are not for human consumption. These products
            are not therapeutic goods within the meaning of the Therapeutic Goods
            Act 1989 (Cth) and have not been evaluated by the Therapeutic Goods
            Administration. Nothing on this website constitutes medical advice.
            This website is restricted to persons 18 years of age or older.
          </p>
          <div className="flex flex-col gap-y-2 sm:flex-row sm:items-center sm:justify-between">
            <Text className="text-xs text-[#bda789]">
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
