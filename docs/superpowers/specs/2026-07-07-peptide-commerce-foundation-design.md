# Outback Peptide Labs — Commerce Foundation (Design Spec)

**Date:** 2026-07-07
**Status:** Approved (design) — pending implementation plan
**Scope:** Foundation build only. Later phases are listed in §11 and each gets its own spec.

---

## 0. Context & starting point

The repository currently contains a **static HTML/CSS/JS demo** (`index.html`, `app.js`,
`styles.css`, `legal/*.html`, `images/`) for an Australian research-peptide storefront,
"Outback Peptide Labs". The demo has a working client-side cart but **no backend, no real
checkout, no payments, and no server-side pricing**. Prices live in the client and in
`localStorage`, which is unacceptable for real commerce.

The customer wants a commercial, revenue-capable store with payments, marketing, and SEO.

### Compliance note (recorded, not re-litigated)
The catalogue is composed largely of Schedule 4 (prescription-only) substances under the
Australian Poisons Standard. Mainstream payment processors prohibit this category, and
advertising prescription substances to the public is regulated. **The customer has confirmed
that legal/TGA compliance and a high-risk merchant account are handled on their side.** This
spec proceeds on that basis and does not provide legal advice. Stripe is used as a stand-in
gateway for development; the production gateway is a later phase (§11).

---

## 1. Locked decisions

| Area | Decision |
|---|---|
| Commerce engine | **Medusa v2** (headless, Node + Postgres + Redis) |
| Storefront | **Next.js 15 (App Router)**, server-rendered, Outback-styled |
| Payments (dev) | **Stripe** via official `@medusajs/payment-stripe` (test mode); provider kept swappable |
| Backend host | **Railway** (Medusa service + managed Postgres + Redis) |
| Storefront host | **Vercel** |
| Email | **Resend** via Medusa Notification module (swappable) |
| Currency / tax | Single region **Australia**, **AUD**, **10% GST inclusive** pricing |
| Age verification | Entry gate (cosmetic) + **checkout DOB gate** validated server-side (not vendor ID) |

---

## 2. Architecture & repo layout

Monorepo (pnpm workspace), two independently-deployable apps:

```
peptide/
├── backend/      Medusa v2 — admin, Store API, catalogue, orders, payments   → Railway
├── storefront/   Next.js 15 (App Router) — customer site, SSR/SSG, SEO        → Vercel
├── reference/    current index.html / app.js / styles.css — design reference only
├── docs/         specs, plans
└── (root)        pnpm-workspace.yaml, README, shared tooling
```

- Railway runs the Medusa Node service with managed Postgres + Redis.
- Vercel runs the Next.js storefront, talking to Medusa's **Store API** with a publishable
  API key.
- The existing static site is moved to `reference/` and is **not shipped** — it is the visual
  source of truth for porting the brand.

### Design-for-isolation
- **backend** and **storefront** communicate only through the Store API (well-defined interface).
- Custom backend logic lives in **Medusa modules/workflows** (age-gate validation, seed),
  each independently testable.
- Storefront is organized by route segment; shared UI (brand system) in a `components/` +
  `styles/` layer.

---

## 3. Data model — catalogue migration

The `PRODUCTS` and `KITS` arrays in `reference/app.js` become an **idempotent seed script**
in the backend that populates Medusa's native models. This moves pricing, cart math, and tax
entirely server-side.

| `app.js` field | Medusa concept |
|---|---|
| product `id` | product `handle` (slug → `/products/bpc-157`) |
| `name`, `desc` | title, description |
| `category` (5 values) | product **categories** (storefront filters + SEO landing pages) |
| `variants[]` (dose + price) | product **variants** + **prices** (AUD) |
| `optionLabel` ("Dosage"/"Size"/"Pack") | variant **option** title (default "Dosage") |
| `badge` | product metadata `badge` |
| `color` | product metadata `color` (drawn-vial fallback tint) |
| `noCoa` | product metadata `no_coa` (hides Lab Report link) |
| COA link | product metadata `coa_url` (nullable) |
| `image` | product image / thumbnail |
| `KITS` | products in a **"Bulk Kits"** collection |

### Categories (preserved order)
1. Tissue Repair & Regenerative Support
2. Hormonal Balance & Metabolic Regulation
3. Resilience & Healthy Aging
4. Neuro-Enhancement & Specialty Protocols
5. Lab Supplies

### Region / tax / shipping
- Region **Australia**, currency **AUD**.
- Tax: **10% GST**, prices **tax-inclusive** (keeps the "inc. GST" labels accurate).
- Shipping: standard Australia Post Express option; **free** when cart total ≥ **$300 AUD**.

---

## 4. Checkout & payments

- Standard Medusa cart → checkout flow.
- **`@medusajs/payment-stripe`** in **test mode**. All totals computed server-side; the
  storefront never sets or trusts prices.
- Payment provider abstraction preserved: swapping to the production high-risk gateway later
  is a **new Medusa payment module**, not a storefront rewrite.
- Dev/QA uses Stripe test cards to complete real end-to-end orders.

---

## 5. Age verification (foundation level)

Two layers, each honest about what it is:

1. **Entry gate** — the existing 18+ modal, ported to the storefront. Cosmetic, `localStorage`
   flag. Not verification.
2. **Checkout DOB gate** — a **required** date-of-birth field + an 18+/authorised-purchaser
   attestation checkbox on checkout. Validated **server-side** in a Medusa workflow hook that
   rejects orders where DOB implies age < 18. DOB + attestation timestamp are stored on the
   **order metadata** for record-keeping.

**Not** third-party ID verification — that (Onfido / Stripe Identity / Yoti) is a named later
phase (§11).

---

## 6. SEO

- **Server-rendered per-product pages** at `/products/[handle]` using `generateMetadata`
  (unique title, description, canonical URL, Open Graph + Twitter tags).
- **JSON-LD structured data**: `Product` + `Offer` (price, `AUD`, availability) per product;
  `Organization` on the home page; `BreadcrumbList` on category pages.
- Auto-generated **`sitemap.xml`** and **`robots.txt`**.
- **`next/image`** for all imagery — regenerate optimized WebP/AVIF brand assets to fix the
  current ~1.1 MB logo PNGs (Core Web Vitals).
- Category pages built as indexable landing pages.
- Marketing/meta copy kept factual (advertising-code sensitivity noted; final wording is the
  customer's/lawyer's call).

---

## 7. Branding

Port the Outback theme from `reference/styles.css` into the storefront design system:
- Palette: black `#0e0b08`, burnt rust `#a84e1c`, amber `#e0954c`, cream `#f7eeda`.
- Fonts: **Oswald** (headings) + **Inter** (body).
- Signature elements: hero with dunes SVG, top disclaimer ribbon, trust bar, product-card
  badges, drawn-vial SVG fallback for products without an image.
- Responsive down to mobile; light on a dark base (matches current design).

---

## 8. Email

- Medusa **Notification module** with the **Resend** provider.
- Foundation scope: **order-confirmation** email on successful order.
- Provider is swappable (SendGrid/Postmark) via config.

---

## 9. Testing

- **Backend (integration):** seed populates catalogue; cart totals + GST compute server-side;
  DOB validation workflow rejects age < 18 and accepts ≥ 18.
- **Storefront:** production build passes; Playwright **happy-path** E2E
  (browse → add to cart → checkout with Stripe test card → order confirmation).
- **SEO/perf:** Lighthouse check on a product page (structured data present, images optimized).
- No secrets committed; env vars documented.

---

## 10. Deployment

- **Backend:** Dockerized Medusa deployed to Railway with managed Postgres + Redis; admin
  reachable; Store API publishable key issued.
- **Storefront:** Next.js deployed to Vercel, configured with the Medusa Store API URL +
  publishable key.
- Documented environment variables for both; `.env.example` files; no real secrets in git.

---

## 11. Out of scope (each a later phase, own spec)

- Customer accounts / login / order history
- Real third-party **ID verification** vendor
- Product **reviews**
- **Abandoned-cart** + email **marketing automation**
- **Analytics** / conversion tracking
- **Blog** / content SEO
- Advanced **inventory / fulfilment**
- **Production payment gateway** (Stripe is the dev stand-in)
- **Final legal copy** (page structure is built; wording is the customer's lawyer's)

---

## 12. Assumptions

1. **Resend** is acceptable as the email provider (easy to swap).
2. Legal pages are ported with their **current draft/placeholder text**; the lawyer finalizes
   wording later.
3. Compliance, licensing, and a high-risk merchant account are handled by the customer
   (confirmed).
