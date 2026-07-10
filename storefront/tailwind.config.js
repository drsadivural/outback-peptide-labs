const path = require("path")

module.exports = {
  darkMode: "class",
  presets: [require("@medusajs/ui-preset")],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/modules/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        width: "width margin",
        height: "height",
        bg: "background-color",
        display: "display opacity",
        visibility: "visibility",
        padding: "padding-top padding-right padding-bottom padding-left",
      },
      colors: {
        grey: {
          0: "#FFFFFF",
          5: "#F9FAFB",
          10: "#F3F4F6",
          20: "#E5E7EB",
          30: "#D1D5DB",
          40: "#9CA3AF",
          50: "#6B7280",
          60: "#4B5563",
          70: "#374151",
          80: "#1F2937",
          90: "#111827",
        },
        // Modern light e-commerce brand palette (peptide.business-inspired)
        brand: {
          navy: "#163269", // primary / CTA buttons
          navyDeep: "#0f2147", // footer / deep navy surfaces
          navyHover: "#1d3f82", // CTA hover (slightly lighter navy)
          blue: "#2563eb", // bright accent (links, highlights)
          blueHover: "#1d4ed8",
          blueSoft: "#eff4ff", // soft blue tint background
          ink: "#0f1729", // primary text / headings (near-black navy)
          body: "#475569", // body text (slate-600)
          muted: "#64748b", // muted text (slate-500)
          line: "#e2e8f0", // borders (slate-200)
          surface: "#ffffff", // card surface (white)
          surface2: "#f8fafc", // alternating section bg (slate-50)
          green: "#16a34a", // success / in-stock
          greenSoft: "#dcfce7",
        },
        // Outback theme tokens. Retained under the `skeuo` key so existing
        // `text-skeuo-*` / `border-skeuo-*` utilities across components resolve
        // to the desert-sunset palette on the new dark surfaces (light text on
        // dark). Values mirror the original static styles.css :root.
        skeuo: {
          parchment: "#2a211b", // raised dark surface
          parchment2: "#201915", // card dark surface
          cream: "#f7eeda", // cream heading/text on dark
          ink: "#f7eeda", // primary heading/name text on dark
          body: "#cbb89b", // body copy on dark
          muted: "#a08d6f", // muted labels on dark
          line: "#3a2d23", // hairline borders on dark
          brass: "#e9a96b", // amber accent / links on dark
          brassDark: "#a84e1c", // rust
          amber: "#e0954c",
          amberLight: "#e9a96b",
          green: "#3f5233", // in-stock badge green
          greenLight: "#4a6b3d",
          greenDark: "#163d2c",
          wood: "#3a2b1c",
          leather: "#0e0b08", // footer black
        },
        // Outback Peptide Labs brand palette (ported from reference/styles.css :root)
        outback: {
          black: "#0e0b08", // silhouette black
          page: "#171210", // page background
          surface: "#201915", // card surface
          raised: "#2a211b", // raised surface
          line: "#3a2d23", // borders on dark
          dune: "#3a2417", // dune fill
          rust: "#a84e1c", // primary brand orange
          "rust-hover": "#c2601f", // rust hover
          amber: "#e0954c", // accent amber
          "amber-light": "#e9a96b",
          cream: "#f7eeda", // cream heading/text on dark
          "cream-2": "#f2e3c8",
          "ink-dark": "#1a120b", // text on cream
          "ink-light": "#f2e6d4", // text on dark
          "muted-dark": "#6b5a44", // muted on cream
          "muted-light": "#bfa88e", // muted on dark
          danger: "#c0392b",
        },
      },
      borderRadius: {
        none: "0px",
        soft: "2px",
        base: "4px",
        rounded: "8px",
        large: "16px",
        circle: "9999px",
      },
      maxWidth: {
        "8xl": "100rem",
      },
      screens: {
        "2xsmall": "320px",
        xsmall: "512px",
        small: "1024px",
        medium: "1280px",
        large: "1440px",
        xlarge: "1680px",
        "2xlarge": "1920px",
      },
      fontSize: {
        "3xl": "2rem",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Ubuntu",
          "sans-serif",
        ],
        display: [
          "var(--font-oswald)",
          "var(--font-inter)",
          "Inter",
          "sans-serif",
        ],
      },
      keyframes: {
        ring: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "fade-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "fade-in-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-out-top": {
          "0%": {
            height: "100%",
          },
          "99%": {
            height: "0",
          },
          "100%": {
            visibility: "hidden",
          },
        },
        "accordion-slide-up": {
          "0%": {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          "100%": {
            height: "0",
            opacity: "0",
          },
        },
        "accordion-slide-down": {
          "0%": {
            "min-height": "0",
            "max-height": "0",
            opacity: "0",
          },
          "100%": {
            "min-height": "var(--radix-accordion-content-height)",
            "max-height": "none",
            opacity: "1",
          },
        },
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        ring: "ring 2.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
        "fade-in-right":
          "fade-in-right 0.3s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-in-top": "fade-in-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "fade-out-top":
          "fade-out-top 0.2s cubic-bezier(0.5, 0, 0.5, 1) forwards",
        "accordion-open":
          "accordion-slide-down 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        "accordion-close":
          "accordion-slide-up 300ms cubic-bezier(0.87, 0, 0.13, 1) forwards",
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
      },
    },
  },
  plugins: [require("tailwindcss-radix")()],
}
