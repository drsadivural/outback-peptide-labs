# Outback Peptide Labs — Storefront (Next.js)

Customer-facing storefront for Outback Peptide Labs, built on Medusa's official Next.js
starter and Outback-branded. Server-rendered (App Router) for SEO, talks to the Medusa
backend over the Store API.

- **Next.js** 15 (App Router) · **React** 19 · **Tailwind** · **Medusa JS SDK** (v2)

## Prerequisites

- Node 20+ and pnpm
- The **backend** (Medusa v2, see `../backend`) running on `http://localhost:9000`, seeded,
  with Postgres up. The seed prints a **publishable API key** (`pk_...`) — you need it below.

## Setup

1. `cp .env.template .env.local` and fill:
   ```
   MEDUSA_BACKEND_URL=http://localhost:9000
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<pk_ from the backend seed log>
   NEXT_PUBLIC_DEFAULT_REGION=au
   NEXT_PUBLIC_BASE_URL=http://localhost:8000
   REVALIDATE_SECRET=dev-revalidate-secret
   ```
2. Install from the repo root: `pnpm install`
3. Run: `npm run dev` → storefront on **http://localhost:8000** (routes are country-prefixed, e.g. `/au`).

> **Node 25 note:** the `dev`/`build`/`start` scripts include `NODE_OPTIONS=--no-experimental-webstorage`.
> Node 25 exposes a broken experimental `localStorage` global that crashes SSR; this flag disables it.
> Do not remove it while on Node 25.

## Routes

- `/au` — home (hero, trust bar, featured products)
- `/au/store` — full catalogue
- `/au/categories/<handle>` — category pages (incl. `bulk-kits`)
- `/au/products/<handle>` — product detail (variant/dosage selector, AUD inc. GST, COA link)
- `/au/legal/{terms,privacy,refunds,shipping}` — policy pages (draft, `noindex`)
- `/sitemap.xml`, `/robots.txt`

## Where things live

| Concern | Location |
|---|---|
| Brand tokens (palette, Oswald/Inter) | `tailwind.config.js`, `src/app/layout.tsx` |
| Disclaimer ribbon / header / footer | `src/modules/layout/templates/{ribbon,nav,footer}` |
| Hero + trust bar | `src/modules/home/components/{hero,trust-bar}` |
| Product card + vial fallback | `src/modules/products/components/{product-preview,vial}` |
| Product metadata helper | `src/lib/util/product-metadata.ts` |
| COA "Lab Report" link | `src/modules/products/components/coa-link` |
| 18+ entry gate | `src/modules/common/components/age-gate` (mounted in root layout) |
| Checkout DOB + attestation | `src/modules/checkout/components/age-verification` + `review` + `payment-button` |
| Writes DOB to cart metadata | `src/lib/data/cart.ts` → `setAgeVerification` |
| Client age math | `src/lib/util/age.ts` |
| SEO helpers / JSON-LD | `src/lib/util/seo.ts`, `src/modules/common/components/json-ld` |
| sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Legal pages | `src/app/[countryCode]/(main)/legal/*` |

## The 18+ gate (two layers)

1. **Entry gate** — a cosmetic localStorage modal on first visit (`apl_age_verified`).
2. **Checkout DOB gate** — a required date-of-birth + attestation at checkout. On place-order the
   storefront writes `metadata.date_of_birth` + `metadata.age_attested` to the cart; the **backend**
   `completeCartWorkflow` hook validates server-side and blocks under-18/unattested orders. The
   backend is the enforceable control; the storefront collects and forwards the data.

## Verify

```bash
npm run build          # production build (do NOT use `npm run lint` — starter lint is broken)
```
Verified working end-to-end against the backend: catalogue renders in AUD inc. GST, add-to-cart
succeeds (cart count increments), product pages carry unique metadata + `Product` JSON-LD with
`priceCurrency: AUD`, `/sitemap.xml` + `/robots.txt` serve, legal pages render.

## Notes

- **Full Stripe checkout needs real test keys.** Only placeholders exist (backend `sk_test`,
  storefront needs `pk_test`). The flow works up to the payment step; add real Stripe test keys to
  complete an order. Swap Stripe for the production high-risk gateway later (backend concern).
- Legal pages carry the original DRAFT/`[placeholder]` text and are `noindex` — a lawyer finalizes
  the wording, then flip them to indexable.
- Never commit `.env.local`.
