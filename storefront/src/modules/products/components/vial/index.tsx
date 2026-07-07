import React from "react"

type VialProps = {
  /** Hex tint for the liquid inside the vial (from product metadata.color). */
  color?: string | null
  /** Rendered height in px. Defaults to 140 to match the reference design. */
  size?: number
  className?: string
}

/**
 * Drawn peptide-vial SVG used as a media fallback for products that have no
 * uploaded image. Ported from reference/app.js `vialSVG`. The liquid is tinted
 * with the product's `metadata.color`.
 */
const Vial: React.FC<VialProps> = ({ color, size = 140, className }) => {
  const tint = color || "#a84e1c"

  return (
    <svg
      viewBox="0 0 120 150"
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect x="40" y="6" width="40" height="16" rx="4" fill="#c9a44a" />
      <rect x="45" y="22" width="30" height="9" fill="#9fb3c8" opacity=".6" />
      <path
        d="M36 31 h48 v88 a24 24 0 0 1 -24 24 a24 24 0 0 1 -24 -24 Z"
        fill="#ffffff"
        opacity=".5"
        stroke="#9fb3c8"
        strokeWidth="2.5"
      />
      <path
        d="M40 78 h40 v40 a20 20 0 0 1 -20 20 a20 20 0 0 1 -20 -20 Z"
        fill={tint}
        opacity=".85"
      />
      <rect x="44" y="56" width="32" height="34" rx="3" fill="#fff" opacity=".95" />
      <rect x="48" y="61" width="24" height="4" rx="2" fill="#12263a" />
      <rect x="48" y="69" width="16" height="3.4" rx="1.7" fill="#5b7a99" />
      <rect x="48" y="76" width="20" height="3.4" rx="1.7" fill="#5b7a99" />
    </svg>
  )
}

export default Vial
