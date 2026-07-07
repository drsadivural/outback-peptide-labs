# Storefront Foundation — Implementation Plan (Plan 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** An Outback-branded, SEO-ready Next.js storefront on top of Medusa's official Next.js starter, wired to the Plan 1 backend — customers can browse the AU catalogue, see AUD/GST prices, add to cart, and check out with Stripe, passing an 18+ entry gate and a checkout DOB gate that satisfies the backend's server-side age enforcement.

**Architecture:** Clone Medusa's Next.js Starter into `storefront/` (App Router, server-rendered). It already provides product listing/detail, cart, and Stripe checkout against the Store API. Our work is: point it at our backend + AU region, port the Outback brand, add the entry age gate, collect DOB+attestation at checkout (write to `cart.metadata.date_of_birth` / `age_attested` so the backend hook passes for adults and blocks minors), add SEO (metadata, JSON-LD, sitemap/robots, optimized images), and port the legal pages.

**Tech Stack:** Next.js 15 (App Router), Medusa JS SDK, Tailwind, TypeScript, Vercel-target. Backend: Medusa v2 on `http://localhost:9000` (Plan 1).

**Prereqs:** Plan 1 backend runnable. Postgres running. The seed printed a **publishable API key** (`pk_...`) linked to the "Outback Storefront"/default sales channel — obtain it from the admin (Settings → API Key Management) or by re-running `npm run seed` (it logs the key). Region country code is **au**.

**Convention:** The starter's internal file paths (e.g. `src/modules/...`, `src/lib/...`) must be DISCOVERED by reading the cloned starter — this plan gives acceptance criteria and the specific integration points, not verbatim files, because the starter is a large evolving codebase. Follow its existing patterns. Commit after each task. Never commit `.env.local`.

---

## Task 0: Scaffold the Next.js storefront and connect it to the backend

**Files:** `storefront/` (cloned starter), `storefront/.env.local` (gitignored), `storefront/.env.template` (committed), root `pnpm-workspace.yaml` (already lists `storefront`).

- [ ] **Step 1: Clone the official starter into `storefront/`** (from repo root):
```bash
git clone https://github.com/medusajs/nextjs-starter-medusa.git --depth=1 storefront-tmp
rm -rf storefront-tmp/.git
mv storefront-tmp storefront
```
If that repo has moved/renamed, use the current official Medusa Next.js starter (must be the **Medusa v2-compatible** version — verify its `package.json` depends on `@medusajs/js-sdk` v2 / `@medusajs/types` ^2). Report which repo/branch you used.

- [ ] **Step 2: Set the package name** so the pnpm workspace resolves it. In `storefront/package.json` set `"name": "storefront"`.

- [ ] **Step 3: Install deps** from repo root: `pnpm install`. Resolve any peer issues; report blockers.

- [ ] **Step 4: Get the publishable key + configure env.** Obtain the `pk_...` publishable key (re-run `cd backend && npm run seed` and read the final `Publishable API key: pk_...` log line, or from the admin). Create `storefront/.env.local`:
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<pk_from_seed>
NEXT_PUBLIC_DEFAULT_REGION=au
NEXT_PUBLIC_BASE_URL=http://localhost:3000
REVALIDATE_SECRET=dev-revalidate-secret
```
(Match the exact env var NAMES the cloned starter expects — check its `.env.template`/`.env.local.template` and `next.config.js`; some starter versions use `MEDUSA_BACKEND_URL` server-side too. Set both if required.) Copy the same keys, values blank, into a committed `storefront/.env.template`.

- [ ] **Step 5: Boot both and verify products render.** Ensure the backend is running (`cd backend && npm run dev`). In another shell: `cd storefront && (npm run dev > /tmp/sf.log 2>&1 &) ; sleep 40`. Then:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/au/store   # or the starter's store route
curl -s http://localhost:3000/au/store | grep -io "bpc-157\|retatrutide\|Tissue Repair" | head
```
Expected: 200 and at least one real catalogue product/category name in the HTML (proves SSR against our backend + AU region works). If the starter uses a different route (e.g. `/au/store` vs `/store`), find and report it. Kill both dev servers when done (or leave backend running for later tasks — your choice, but kill the storefront).

- [ ] **Step 6: Ensure `.env.local` is gitignored** (starter's `.gitignore` includes it; verify). Commit from repo root:
```bash
git add -A && git commit -m "feat(storefront): scaffold Medusa Next.js starter wired to backend (AU region)"
```
Confirm `storefront/.env.local` is NOT staged and `node_modules` not committed.

**Report:** which starter repo/branch, the exact store route that rendered our products, proof a real product name appeared in SSR HTML, env var names used, base/HEAD SHAs.

---

## Task 1: Outback brand tokens (colors, fonts, base theme)

**Files:** the starter's Tailwind config (`tailwind.config.js`) + global CSS (`src/styles/globals.css` or equivalent — discover it). Reference: `reference/styles.css` (the `:root` CSS variables) and `reference/index.html` (Google Fonts link).

- [ ] **Step 1:** Read `reference/styles.css` top (the `:root` block) for the palette: black `#0e0b08`, burnt rust `#a84e1c`, amber `#e0954c`, cream `#f7eeda` (plus supporting shades you find). Read `reference/index.html` line 11 for the fonts: **Oswald** (headings) + **Inter** (body).

- [ ] **Step 2:** Add the Outback palette as Tailwind theme colors (e.g. `outback: { black, rust, amber, cream }`) in the starter's Tailwind config, and load Oswald + Inter (via `next/font/google` in the root layout — preferred — or the Google Fonts link). Set base body background to the dark base and default text to cream/appropriate, matching the reference's dark theme. Set Oswald as the heading font, Inter as body.

- [ ] **Step 3:** Build to verify nothing breaks: `cd storefront && npm run build` (expect success). Then `git commit -m "feat(storefront): add Outback brand tokens (palette + Oswald/Inter fonts)"`.

**Acceptance:** Tailwind exposes the Outback colors; headings render in Oswald, body in Inter; the page has the dark Outback base. `npm run build` passes.

---

## Task 2: Re-skin header, top disclaimer ribbon, and footer

**Files:** the starter's nav/header component, footer component (discover under `src/modules/layout/...`), root layout.

- [ ] **Step 1:** Add the top **disclaimer ribbon** above the header (from `reference/index.html` line 44-46): "⚠️ Research Use Only — Not for human consumption • 18+ Only • Same Day Dispatch before 2PM AEST". Style with the amber/rust accent.

- [ ] **Step 2:** Re-skin the header with the "Outback Peptide Labs" wordmark (rust "Outback" + cream "Peptide Labs" per reference), nav links (Shop, Bulk Kits, Quality, FAQ, Contact — map to the starter's real routes/categories where they exist; drop links with no destination), and keep the starter's cart + account controls.

- [ ] **Step 3:** Re-skin the footer with the four-column layout from `reference/index.html` (Shop / Support / Legal columns + the full legal disclaimer block from lines 219-227). Legal links point to the ported legal pages (Task 8 route paths: `/legal/terms`, `/legal/privacy`, `/legal/refunds`, `/legal/shipping`).

- [ ] **Step 4:** `npm run build` passes; `git commit -m "feat(storefront): Outback-branded header, disclaimer ribbon, footer"`.

**Acceptance:** ribbon + branded header + branded footer render on every page, styled in the Outback theme; legal disclaimer text present in footer.

---

## Task 3: Home page — hero + trust bar

**Files:** the starter's home page (`src/app/[countryCode]/(main)/page.tsx` or similar) and/or a hero module.

- [ ] **Step 1:** Replace the starter's default hero with the Outback hero from `reference/index.html` (lines 72-97): headline "Outback Peptide Labs, Delivered Australia-Wide", the sub-copy, CTA buttons (Shop Peptides → store, Bulk Kits → bulk category, Our Testing Process → quality/anchor), the "🇦🇺 Australian Owned & Operated" chip, and the **dunes SVG** (copy the `<svg>` from lines 92-95). Use the optimized brand hero image (Task 7 provides optimized assets; until then use `reference/images/logo-kangaroo.png` via `next/image`).

- [ ] **Step 2:** Add the **trust bar** (reference lines 100-107): Express Shipping (Free over $300), Same Day Dispatch, Third-Party Tested (COA), Secure Checkout — four items with icons.

- [ ] **Step 3:** `npm run build` passes; `git commit -m "feat(storefront): Outback hero + trust bar on home page"`.

**Acceptance:** home page shows the branded hero (with dunes) and trust bar; CTAs link to real routes.

---

## Task 4: Product card, listing, and product detail restyle

**Files:** the starter's product card/preview component, product template, product-listing/store template (discover under `src/modules/products/...` and `src/modules/store/...`).

- [ ] **Step 1:** Restyle the **product card**: Outback card styling; show the product `badge` metadata as a pill (top-left) and an "In Stock" pill; price shown with a small "AUD inc. GST" caption. For products WITHOUT an image, render the drawn-vial SVG fallback tinted with the `color` metadata (port the `vialSVG` function from `reference/app.js` lines 460-474 into a small React component).

- [ ] **Step 2:** On the **product detail** page, show the variant/dosage selector (starter already has variant selection — relabel to the product's `optionLabel` metadata when present, default "Dosage"), the price with "AUD inc. GST", and a "Lab Report ↗" link UNLESS the product's `no_coa` metadata is true (then hide it). Read metadata from the Medusa product (`badge`, `color`, `no_coa`, `coa_url`).

- [ ] **Step 3:** Ensure the store/listing page groups or filters by our categories (Tissue Repair, Hormonal…, Resilience…, Neuro…, Lab Supplies) and surfaces the Bulk Kits collection/category. Use the starter's existing category/collection routing.

- [ ] **Step 4:** `npm run build` passes; `git commit -m "feat(storefront): Outback product cards, vial fallback, GST pricing, COA link, categories"`.

**Acceptance:** cards show badge + In Stock + AUD-inc-GST price; image-less products show the tinted vial SVG; product page hides the COA link when `no_coa`; categories/kits browsable.

---

## Task 5: Entry 18+ age gate

**Files:** a new client component (e.g. `src/modules/common/components/age-gate/index.tsx`) mounted in the root layout.

- [ ] **Step 1:** Port the entry age-gate modal from `reference/index.html` (lines 17-41) + behavior from `reference/app.js` (lines 425-455) into a **client component**: on first visit it blocks the page with the 18+ confirmation modal; "Enter" sets `localStorage.apl_age_verified=true` and reveals the site; "Exit" redirects to `https://www.google.com.au`. Persist via localStorage; do not show again once accepted. Style in the Outback theme.

- [ ] **Step 2:** Mount it in the root layout so it covers all routes. It must not break SSR (guard `localStorage`/`window` access to client only; render the gate by default and hide after the client confirms the flag, to avoid a flash of content for unverified users — acceptable trade-off: gate shown until hydration confirms the flag).

- [ ] **Step 3:** `npm run build` passes; manual check: clearing localStorage shows the gate; clicking Enter reveals the site and persists. `git commit -m "feat(storefront): 18+ entry age gate (localStorage)"`.

**Acceptance:** first visit shows the gate; Enter persists and reveals; Exit redirects away. (This is a cosmetic gate — real enforcement is Task 6 + backend.)

---

## Task 6: Checkout DOB + attestation → cart metadata (satisfies the backend gate)

**Files:** the starter's checkout flow — the review/payment step and the cart-update data functions (discover under `src/modules/checkout/...` and `src/lib/data/cart.ts` or similar).

- [ ] **Step 1:** Add a **required date-of-birth input** and an **18+/authorised-purchaser attestation checkbox** to the checkout (a sensible step: the address or review step, before "Place order"). Validate client-side that DOB is present and age ≥ 18 and the box is checked (reuse the same age logic conceptually), showing inline errors.

- [ ] **Step 2:** Before completing the order, **persist DOB + attestation to the cart metadata** via the Store API: update the cart with `metadata: { date_of_birth: "<ISO yyyy-mm-dd>", age_attested: true }` (use the starter's existing cart-update SDK call / server action; the Medusa JS SDK `store.cart.update(cartId, { metadata })` or the starter's `updateCart`). This is REQUIRED — the backend's `completeCartWorkflow` validate hook reads exactly `cart.metadata.date_of_birth` and `cart.metadata.age_attested` and rejects otherwise.

- [ ] **Step 3:** **Surface the backend rejection.** If order completion fails with the backend's age error (message contains "18 years" / "date of birth" / "authorised"), display it to the user at checkout rather than a generic failure. (Test the block by submitting a DOB under 18 client-guard-disabled, or trust the backend integration test — but ensure the error path renders the server message.)

- [ ] **Step 4:** `npm run build` passes; `git commit -m "feat(storefront): checkout DOB + attestation written to cart metadata for 18+ gate"`.

**Acceptance:** checkout requires DOB + attestation; on place-order the cart metadata carries `date_of_birth` + `age_attested`; an under-18 submission is blocked (client and/or server) with a clear message. Adults proceed.

---

## Task 7: SEO — metadata, JSON-LD, sitemap, robots, image optimization

**Files:** product page (`generateMetadata`), root layout metadata, new `src/app/sitemap.ts` + `src/app/robots.ts`, a JSON-LD component, optimized brand images under `storefront/public/`.

- [ ] **Step 1:** Ensure each **product page** exports `generateMetadata` producing a unique `title`, `description` (from the product description), `alternates.canonical`, and Open Graph + Twitter tags (title/description/image). The starter may already do some of this — extend it, don't duplicate.

- [ ] **Step 2:** Add **JSON-LD**: a `Product` + `Offer` script on each product page (name, description, image, `offers: { priceCurrency: "AUD", price: <lowest variant price>, availability: InStock }`), an `Organization` script on the home page (name "Outback Peptide Labs", logo, url), and `BreadcrumbList` on category pages. Render via a `<script type="application/ld+json">` component.

- [ ] **Step 3:** Add `src/app/sitemap.ts` (Next.js metadata route) listing the home, store, category, and all product URLs (fetch product handles from the Store API), and `src/app/robots.ts` allowing crawl and pointing to the sitemap. Use `NEXT_PUBLIC_BASE_URL`.

- [ ] **Step 4:** **Optimize brand images.** The reference logos are ~1.1 MB PNGs. Regenerate small web assets (e.g. with `sharp`) into `storefront/public/` as WebP/AVIF at reasonable dimensions (logo/badge ≤ ~40 KB), and use `next/image` everywhere. Do NOT ship the 1 MB originals.

- [ ] **Step 5:** `npm run build` passes; verify: `curl -s http://localhost:3000/robots.txt` and `/sitemap.xml` return content; a product page's HTML contains `application/ld+json` with `"priceCurrency":"AUD"`. `git commit -m "feat(storefront): SEO metadata, JSON-LD, sitemap, robots, optimized images"`.

**Acceptance:** product pages have unique metadata + Product JSON-LD (AUD); home has Organization JSON-LD; `/sitemap.xml` + `/robots.txt` serve; brand images are optimized via `next/image`.

---

## Task 8: Port the legal pages

**Files:** new routes under `storefront/src/app/[countryCode]/(main)/legal/{terms,privacy,refunds,shipping}/page.tsx` (match the starter's route-group convention). Source: `reference/legal/*.html`.

- [ ] **Step 1:** Create a `/legal/terms`, `/legal/privacy`, `/legal/refunds`, `/legal/shipping` page for each `reference/legal/*.html`, porting the body content into JSX/MDX styled with the Outback theme and a shared legal layout. Keep the existing DRAFT/`[placeholder]` text as-is (the customer's lawyer finalizes wording) — do not invent legal text.

- [ ] **Step 2:** Add `generateMetadata` (title/description, `robots: noindex` optional for draft legal — your call; default index). Ensure the footer legal links (Task 2) resolve to these routes.

- [ ] **Step 3:** `npm run build` passes; `git commit -m "feat(storefront): port legal pages (terms, privacy, refunds, shipping)"`.

**Acceptance:** four legal routes render the ported content in the Outback theme; footer links work.

---

## Task 9: Verification — build, E2E happy-path, README

**Files:** `storefront/README.md`; optionally a Playwright spec under `storefront/e2e/`.

- [ ] **Step 1:** Full production build: `cd storefront && npm run build` — must pass with no type errors.

- [ ] **Step 2:** With backend + storefront running, drive a **Playwright happy-path** (or document a manual pass if Playwright isn't set up): open store → open a product → add to cart → open cart → proceed to checkout → fill address + DOB (adult) + attestation → reach the payment step. NOTE: completing Stripe payment requires real `sk_test`/`pk_test` keys (only placeholders exist) — assert up to the payment step and document the key requirement. Also verify an **under-18 DOB is blocked** at checkout.

- [ ] **Step 3:** Write `storefront/README.md`: prereqs, env vars (backend URL, publishable key, region), how to run against the backend, where the brand tokens / age gate / checkout DOB / SEO live, and the Stripe test-key requirement for full checkout.

- [ ] **Step 4:** `git commit -m "test(storefront): build + E2E happy-path, storefront README"`.

**Acceptance:** production build passes; happy-path reaches payment step; under-18 blocked; README documents setup + the Stripe test-key caveat.

---

## Self-review (checked against the Plan-2 design in the spec)
- Storefront = Next.js starter, Outback-styled → Tasks 0-4. ✓
- SEO (per-product metadata, JSON-LD, sitemap/robots, image optimization) → Task 7. ✓
- Entry age gate → Task 5; checkout DOB gate feeding the backend hook → Task 6. ✓
- Legal pages → Task 8. ✓
- AUD/GST display → Tasks 3-4 (backend already computes; storefront displays). ✓
- Out of scope (accounts beyond starter default, reviews, marketing automation, analytics, real ID verification, deployment) — not included; deployment is Plan 3. ✓

## Risks / notes
- The starter's internal paths and some env var names vary by version — implementers must read the cloned starter and adapt; that's expected, not a deviation.
- Full Stripe checkout needs real test keys (backend `sk_test`, storefront `pk_test`); only placeholders exist, so E2E asserts up to the payment step.
- The entry gate is cosmetic; the enforceable control is the checkout DOB → `cart.metadata` → backend `completeCartWorkflow` hook (Plan 1, tested).
