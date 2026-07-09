import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden border-b border-skeuo-line">
      {/* soft radial vignette on the parchment */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_-10%,rgba(255,250,240,0.75),transparent_60%)]" />
      <div className="content-container relative z-10 flex flex-col-reverse gap-12 py-16 small:flex-row small:items-center small:py-24">
        {/* Copy */}
        <div className="flex-1">
          <span className="skeuo-pin inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-skeuo-amberLight to-skeuo-amber px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[#40270a]">
            Australian Owned &amp; Operated
          </span>
          <h1 className="mt-5 font-display text-4xl small:text-6xl font-bold leading-[1.05] tracking-[-0.02em] text-skeuo-ink skeuo-emboss">
            Research-grade peptides,
            <br />
            <span className="text-skeuo-brass">delivered Australia-wide</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-skeuo-body">
            Independently batch-tested research compounds with published
            certificates of analysis. Dispatched same day from our Australian
            facility via Australia Post Express.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <LocalizedClientLink
              href="/store"
              className="skeuo-btn skeuo-btn-amber inline-flex items-center justify-center px-7 py-3.5 text-base"
            >
              Shop Peptides
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/bulk-kits"
              className="skeuo-btn skeuo-btn-neutral inline-flex items-center justify-center px-7 py-3.5 text-base"
            >
              Bulk Kits
            </LocalizedClientLink>
            <a
              href="#quality"
              className="inline-flex items-center justify-center rounded-[14px] px-5 py-3.5 text-base font-semibold text-skeuo-body transition-colors hover:text-skeuo-brass"
            >
              Our Testing Process →
            </a>
          </div>
        </div>

        {/* Art — glass display case on a shelf */}
        <div className="flex flex-1 flex-col items-center gap-6">
          <div className="skeuo-panel skeuo-sheen relative flex w-full max-w-sm items-center justify-center rounded-[28px] p-10">
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(90%_70%_at_50%_20%,rgba(224,169,78,0.18),transparent_65%)]" />
            <Image
              src="/logo-kangaroo.webp"
              alt="Outback Peptide Labs badge"
              width={640}
              height={724}
              priority
              className="relative z-10 h-auto w-52 small:w-64 drop-shadow-[0_10px_16px_rgba(52,37,20,0.35)]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
