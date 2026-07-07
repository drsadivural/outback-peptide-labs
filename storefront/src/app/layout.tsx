import { getBaseURL } from "@lib/util/env"
import AgeGate from "@modules/common/components/age-gate"
import { Metadata } from "next"
import { Inter, Oswald } from "next/font/google"
import "styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en-AU"
      data-mode="dark"
      className={`${inter.variable} ${oswald.variable}`}
    >
      <body className="bg-outback-page text-outback-ink-light font-sans antialiased">
        <main className="relative">{props.children}</main>
        <AgeGate />
      </body>
    </html>
  )
}
