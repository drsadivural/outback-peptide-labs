import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f2e3c8_0%,#edc99a_34%,#e0954c_62%,#a84e1c_100%)] text-outback-ink-dark">
      <div className="content-container relative z-10 grid grid-cols-1 items-center gap-10 px-6 pb-32 pt-14 small:grid-cols-[1.4fr_1fr] small:pb-36 small:pt-20">
        {/* Copy */}
        <div className="order-2 small:order-1">
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.08] tracking-[0.01em] text-outback-ink-dark small:text-6xl">
            Outback Peptide Labs,
            <br />
            Delivered Australia-Wide
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-[#3d2a18] small:text-lg">
            Independently batch-tested research compounds with published
            certificates of analysis. Dispatched same day from our Australian
            facility via Australia Post Express.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <LocalizedClientLink
              href="/store"
              className="skeuo-btn skeuo-btn-neutral inline-flex items-center justify-center px-7 py-3.5 text-base"
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
              className="inline-flex items-center justify-center rounded-[10px] border-2 border-[rgba(26,18,11,0.55)] px-6 py-3.5 text-base font-bold text-outback-ink-dark transition-colors hover:border-outback-ink-dark hover:bg-[rgba(26,18,11,0.08)]"
            >
              Our Testing Process
            </a>
          </div>
        </div>

        {/* Art — circular outback badge */}
        <div className="order-1 flex flex-col items-center gap-4 small:order-2">
          <Image
            src="/logo-kangaroo.webp"
            alt="Outback Peptide Labs badge"
            width={640}
            height={724}
            priority
            className="h-auto w-52 drop-shadow-[0_24px_44px_rgba(20,8,0,0.45)] small:w-72"
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(26,18,11,0.9)] bg-[rgba(26,18,11,0.82)] px-3.5 py-1.5 text-sm font-semibold text-outback-cream">
            🇦🇺 Australian Owned &amp; Operated
          </span>
        </div>
      </div>

      {/* Dune silhouettes at the base of the hero */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px z-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block h-[90px] w-full small:h-[110px]"
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
