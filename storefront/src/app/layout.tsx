import { getBaseURL } from "@lib/util/env"
import AgeGate from "@modules/common/components/age-gate"
import { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${outfit.variable}`}>
      <body className="skeuo-page text-skeuo-ink font-sans antialiased">
        <main className="relative">{props.children}</main>
        <AgeGate />
      </body>
    </html>
  )
}
