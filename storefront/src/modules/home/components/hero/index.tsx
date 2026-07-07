import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-outback-page">
      <div className="content-container relative z-10 flex flex-col-reverse gap-10 py-16 small:flex-row small:items-center small:py-24">
        {/* Copy */}
        <div className="flex-1">
          <h1 className="font-display text-4xl small:text-5xl font-semibold uppercase leading-[1.1] tracking-[0.02em] text-outback-cream">
            Outback Peptide Labs,
            <br />
            Delivered Australia-Wide
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-outback-muted-light">
            Independently batch-tested research compounds with published
            certificates of analysis. Dispatched same day from our Australian
            facility via Australia Post Express.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <LocalizedClientLink
              href="/store"
              className="inline-flex items-center justify-center rounded-[10px] bg-outback-rust px-7 py-3 text-base font-bold text-outback-cream transition-colors hover:bg-outback-rust-hover"
            >
              Shop Peptides
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/categories/bulk-kits"
              className="inline-flex items-center justify-center rounded-[10px] bg-outback-rust px-7 py-3 text-base font-bold text-outback-cream transition-colors hover:bg-outback-rust-hover"
            >
              Bulk Kits
            </LocalizedClientLink>
            <a
              href="#quality"
              className="inline-flex items-center justify-center rounded-[10px] border-2 border-outback-cream/50 px-7 py-3 text-base font-bold text-outback-cream transition-colors hover:border-outback-cream"
            >
              Our Testing Process
            </a>
          </div>
        </div>

        {/* Art */}
        <div className="flex flex-1 flex-col items-center gap-6">
          <Image
            src="/logo-kangaroo.webp"
            alt="Outback Peptide Labs badge"
            width={640}
            height={724}
            priority
            className="h-auto w-56 small:w-72 drop-shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-outback-line bg-outback-surface px-4 py-2 text-sm font-semibold text-outback-amber">
            🇦🇺 Australian Owned &amp; Operated
          </span>
        </div>
      </div>

      {/* Dunes */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-[70px] w-full small:h-[110px]"
        >
          <path
            fill="#3a2417"
            d="M0,55 C240,95 480,15 720,45 C960,75 1200,30 1440,60 L1440,110 L0,110 Z"
          />
          <path
            fill="#171210"
            d="M0,85 C300,110 600,55 900,78 C1120,94 1300,72 1440,88 L1440,110 L0,110 Z"
          />
        </svg>
      </div>
    </section>
  )
}

export default Hero
