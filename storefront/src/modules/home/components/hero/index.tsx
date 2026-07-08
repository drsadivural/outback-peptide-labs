import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-brand-line bg-gradient-to-b from-brand-blueSoft/60 via-white to-white">
      <div className="content-container relative z-10 flex flex-col-reverse gap-12 py-16 small:flex-row small:items-center small:py-24">
        {/* Copy */}
        <div className="flex-1">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-3.5 py-1.5 text-xs font-semibold text-brand-blue shadow-[0_1px_3px_rgba(15,23,41,0.06)]">
            Australian Owned &amp; Operated
          </span>
          <h1 className="mt-5 font-display text-4xl small:text-6xl font-bold leading-[1.05] tracking-[-0.02em] text-brand-ink">
            Research-grade peptides,
            <br />
            <span className="text-brand-blue">delivered Australia-wide</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-body">
            Independently batch-tested research compounds with published
            certificates of analysis. Dispatched same day from our Australian
            facility via Australia Post Express.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center rounded-[14px] bg-brand-navy px-7 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-navyHover"
            >
              Shop Peptides
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/bulk-kits"
              className="inline-flex items-center justify-center rounded-[14px] border border-brand-line bg-white px-7 py-3.5 text-base font-semibold text-brand-ink shadow-sm transition-colors hover:border-brand-blue hover:text-brand-blue"
            >
              Bulk Kits
            </LocalizedClientLink>
            <a
              href="#quality"
              className="inline-flex items-center justify-center rounded-[14px] px-5 py-3.5 text-base font-semibold text-brand-body transition-colors hover:text-brand-blue"
            >
              Our Testing Process →
            </a>
          </div>
        </div>

        {/* Art */}
        <div className="flex flex-1 flex-col items-center gap-6">
          <div className="relative flex w-full max-w-sm items-center justify-center rounded-[28px] border border-brand-line bg-white p-10 shadow-[0_20px_60px_-20px_rgba(15,23,41,0.25)]">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-brand-blueSoft/70 to-transparent" />
            <Image
              src="/logo-kangaroo.webp"
              alt="Outback Peptide Labs badge"
              width={640}
              height={724}
              priority
              className="relative z-10 h-auto w-52 small:w-64"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
