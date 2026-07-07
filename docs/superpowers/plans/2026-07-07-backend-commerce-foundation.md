# Backend Commerce Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a Medusa v2 backend that serves the full Outback Peptide Labs catalogue over the Store API, computes all pricing/GST server-side, accepts Stripe (test-mode) checkout, enforces an 18+ date-of-birth gate at cart completion, and emails an order confirmation.

**Architecture:** A Medusa v2 (Node) application in `backend/`. Catalogue data is ported from the legacy `reference/app.js` into a typed data file and loaded by an idempotent seed script that uses `createProductsWorkflow`. A single Australia region (AUD, 10% GST tax-inclusive) with a free-over-$300 express shipping option. Payments via the official Stripe module. The 18+ rule is enforced with a `completeCartWorkflow.hooks.validate` hook reading `cart.metadata.date_of_birth`. Order confirmation email via a Resend notification provider triggered by an `order.placed` subscriber.

**Tech Stack:** Medusa v2, Node 20+, PostgreSQL, Redis, TypeScript, Jest (Medusa's integration test tooling), `@medusajs/payment-stripe`, Resend.

**Companion plans (not this doc):** Plan 2 — Next.js storefront; Plan 3 — Railway/Vercel deployment.

**Conventions for every task below:** run commands from `backend/` unless stated. Prices are in major currency units (Medusa v2: `amount: 59.95` = A$59.95). Never commit secrets — only `.env.example`.

---

## Task 0: Monorepo scaffold + preserve the legacy demo as reference

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (root)
- Create: `reference/` (move existing static site here)
- Modify: root `README.md`

- [ ] **Step 1: Move the legacy static site into `reference/`**

```bash
mkdir -p reference
git mv index.html app.js styles.css serve.ps1 compliance-checklist.html reference/
git mv images reference/images
git mv legal reference/legal
git mv "ChatGPT Image Jul 6, 2026, 05_38_43 PM.png" reference/ 2>/dev/null || true
```

- [ ] **Step 2: Create the pnpm workspace file**

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - "backend"
  - "storefront"
```

- [ ] **Step 3: Create the root package.json**

Create `package.json`:
```json
{
  "name": "outback-peptide-labs",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev:backend": "pnpm --filter backend dev",
    "seed": "pnpm --filter backend seed"
  }
}
```

- [ ] **Step 4: Note the restructure in the README**

Append to `README.md`:
```markdown

## Repository structure (post-migration)

- `backend/` — Medusa v2 commerce backend (this plan)
- `storefront/` — Next.js storefront (Plan 2)
- `reference/` — the original static demo, kept as the visual/design source of truth
- `docs/superpowers/` — specs and implementation plans
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: move legacy static demo to reference/, add pnpm workspace"
```

---

## Task 1: Initialize the Medusa v2 backend

**Files:**
- Create: `backend/` (Medusa app, generated)
- Create: `backend/.env` (local, git-ignored)
- Create: `backend/.env.example`

- [ ] **Step 1: Scaffold Medusa into `backend/`**

Run from repo root (skip the bundled Next.js starter — we build our own in Plan 2):
```bash
npx create-medusa-app@latest backend --skip-db --no-browser
```
If prompted for a storefront, choose **none**. This generates a Medusa v2 project in `backend/`.

- [ ] **Step 2: Provision local Postgres + Redis**

```bash
docker run -d --name opl-postgres -e POSTGRES_PASSWORD=medusa -e POSTGRES_DB=medusa -p 5432:5432 postgres:16
docker run -d --name opl-redis -p 6379:6379 redis:7
```

- [ ] **Step 3: Configure environment**

Create `backend/.env`:
```bash
DATABASE_URL=postgres://postgres:medusa@localhost:5432/medusa
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-change-me
COOKIE_SECRET=dev-cookie-secret-change-me
STORE_CORS=http://localhost:3000
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:3000,http://localhost:9000
STRIPE_API_KEY=sk_test_placeholder
RESEND_API_KEY=re_placeholder
RESEND_FROM_EMAIL=orders@outbackpeptidelabs.example
```

Create `backend/.env.example` with the same keys but empty/placeholder values (this one IS committed).

- [ ] **Step 4: Run migrations and create an admin user**

```bash
cd backend
npx medusa db:migrate
npx medusa user -e admin@outbackpeptidelabs.example -p supersecret
```
Expected: migrations complete; "User created successfully".

- [ ] **Step 5: Boot to verify**

```bash
npm run dev
```
Expected: server boots on `http://localhost:9000`, admin on `http://localhost:9000/app`. Stop with Ctrl-C.

- [ ] **Step 6: Ensure `.env` is git-ignored, then commit scaffold**

Verify `backend/.gitignore` contains `.env`. Then:
```bash
cd ..
git add backend .gitignore 2>/dev/null; git add -A
git commit -m "feat(backend): scaffold Medusa v2 app with local Postgres/Redis config"
```

---

## Task 2: Port the catalogue into typed data

**Files:**
- Create: `backend/src/data/catalogue.ts`
- Test: `backend/src/data/__tests__/catalogue.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `backend/src/data/__tests__/catalogue.spec.ts`:
```typescript
import { PRODUCTS, KITS, CATEGORIES } from "../catalogue"

describe("catalogue data", () => {
  it("has the full product + kit counts", () => {
    expect(PRODUCTS.length).toBe(32)
    expect(KITS.length).toBe(4)
  })

  it("exposes the five categories in order", () => {
    expect(CATEGORIES).toEqual([
      "Tissue Repair & Regenerative Support",
      "Hormonal Balance & Metabolic Regulation",
      "Resilience & Healthy Aging",
      "Neuro-Enhancement & Specialty Protocols",
      "Lab Supplies",
    ])
  })

  it("has unique handles across products and kits", () => {
    const handles = [...PRODUCTS, ...KITS].map((p) => p.handle)
    expect(new Set(handles).size).toBe(handles.length)
  })

  it("every variant has a positive price and a dose label", () => {
    for (const p of [...PRODUCTS, ...KITS]) {
      expect(p.variants.length).toBeGreaterThan(0)
      for (const v of p.variants) {
        expect(v.price).toBeGreaterThan(0)
        expect(v.dose.trim().length).toBeGreaterThan(0)
      }
    }
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd backend && npx jest src/data/__tests__/catalogue.spec.ts
```
Expected: FAIL — cannot find module `../catalogue`.

- [ ] **Step 3: Create the catalogue data file**

Port every entry from `reference/app.js` (`PRODUCTS` then `KITS`). Create `backend/src/data/catalogue.ts`. Use `id` → `handle`. Full content:

```typescript
export type Variant = { dose: string; price: number }
export type CatalogueItem = {
  handle: string
  name: string
  category?: string
  desc: string
  badge?: string | null
  color: string
  image?: string | null
  optionLabel?: string
  noCoa?: boolean
  variants: Variant[]
}

export const CATEGORIES = [
  "Tissue Repair & Regenerative Support",
  "Hormonal Balance & Metabolic Regulation",
  "Resilience & Healthy Aging",
  "Neuro-Enhancement & Specialty Protocols",
  "Lab Supplies",
] as const

export const PRODUCTS: CatalogueItem[] = [
  { handle: "bpc-157", name: "BPC-157", category: "Tissue Repair & Regenerative Support", desc: "A synthetic peptide fragment that is the subject of ongoing preclinical research into tissue-repair and gastrointestinal models.", badge: "Popular", color: "#a84e1c", variants: [{ dose: "5mg", price: 59.95 }, { dose: "10mg", price: 94.99 }] },
  { handle: "tb-500", name: "TB-500", category: "Tissue Repair & Regenerative Support", desc: "A synthetic version of thymosin beta-4, studied in research into cellular-repair and recovery models.", badge: null, color: "#b8632a", variants: [{ dose: "10mg", price: 129.99 }] },
  { handle: "bpc-tb", name: "BPC-157 + TB-500", category: "Tissue Repair & Regenerative Support", desc: "A combination of BPC-157 and TB-500 supplied together in a single vial for tissue-repair research applications.", badge: "Stack", color: "#8a5a33", variants: [{ dose: "10mg", price: 109.99 }] },
  { handle: "kpv", name: "KPV", category: "Tissue Repair & Regenerative Support", desc: "A tripeptide fragment (lysine-proline-valine) studied in research into inflammatory-response models.", badge: null, color: "#c2601f", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "ghk-cu", name: "Copper Peptide (GHK-Cu)", category: "Tissue Repair & Regenerative Support", desc: "A naturally occurring copper-binding peptide investigated in research into skin, collagen and wound-healing models.", badge: null, color: "#b87333", variants: [{ dose: "50mg", price: 69.95 }, { dose: "100mg", price: 109.95 }] },
  { handle: "glow", name: "GLOW Peptide Blend", category: "Tissue Repair & Regenerative Support", desc: "A multi-peptide research blend combining BPC-157, TB-500 and GHK-Cu in a single vial for tissue-repair research.", badge: "Blend", color: "#d98841", variants: [{ dose: "50mg", price: 168.99 }, { dose: "70mg", price: 199.99 }] },
  { handle: "klow", name: "Klow (Multi-Peptide Stack)", category: "Tissue Repair & Regenerative Support", desc: "An advanced, proprietary multi-peptide stack combining four synthetic peptides — BPC-157, GHK-Cu, TB-500 and KPV — in a single formulation for research applications.", badge: "Premium Stack", color: "#c2601f", variants: [{ dose: "Blend 78mg", price: 189.95 }, { dose: "Blend 130mg", price: 289.95 }] },
  { handle: "retatrutide", name: "Retatrutide", category: "Hormonal Balance & Metabolic Regulation", desc: "A multi-receptor agonist peptide investigated in metabolic research, including laboratory studies of energy balance and body-weight regulation.", badge: "Best Seller", color: "#14b8a0", image: "images/retatrutide.avif", variants: [{ dose: "10mg", price: 144.99 }, { dose: "15mg", price: 179.99 }, { dose: "20mg", price: 229.99 }, { dose: "30mg", price: 329.99 }, { dose: "40mg", price: 429.95 }, { dose: "60mg", price: 549.99 }] },
  { handle: "tirzepatide", name: "Tirzepatide", category: "Hormonal Balance & Metabolic Regulation", desc: "A dual GIP and GLP-1 receptor agonist peptide investigated in metabolic research, including laboratory studies of glucose regulation and energy balance.", badge: "Popular", color: "#8a5a33", variants: [{ dose: "10mg", price: 139.95 }, { dose: "20mg", price: 249.99 }, { dose: "30mg", price: 319.95 }, { dose: "40mg", price: 343.99 }, { dose: "60mg", price: 423.99 }] },
  { handle: "cjc-ipamorelin", name: "CJC-1295 + Ipamorelin", category: "Hormonal Balance & Metabolic Regulation", desc: "A peptide combination studied in research contexts for its effects on growth-hormone secretion pathways.", badge: "Stack", color: "#9c6b3f", variants: [{ dose: "5mg + 5mg", price: 119.95 }, { dose: "10mg + 10mg", price: 199.95 }] },
  { handle: "cjc-no-dac", name: "CJC-1295 (no DAC)", category: "Hormonal Balance & Metabolic Regulation", desc: "A growth-hormone-releasing peptide analogue studied in research into GH-secretion pathways.", badge: null, color: "#6b4226", variants: [{ dose: "10mg", price: 104.99 }] },
  { handle: "cjc-dac", name: "CJC-1295 with DAC", category: "Hormonal Balance & Metabolic Regulation", desc: "A long-acting growth-hormone-releasing peptide analogue studied in GH-axis research.", badge: null, color: "#7a5333", variants: [{ dose: "10mg", price: 179.99 }] },
  { handle: "ipamorelin", name: "Ipamorelin", category: "Hormonal Balance & Metabolic Regulation", desc: "A selective growth-hormone secretagogue studied in research into GH-release pathways.", badge: null, color: "#a06a3a", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "tesamorelin", name: "Tesamorelin", category: "Hormonal Balance & Metabolic Regulation", desc: "A stabilised GHRH analogue investigated in metabolic and body-composition research.", badge: null, color: "#8a5a33", variants: [{ dose: "5mg", price: 79.99 }, { dose: "10mg", price: 145.99 }, { dose: "20mg", price: 259.99 }] },
  { handle: "aod-9604", name: "AOD-9604", category: "Hormonal Balance & Metabolic Regulation", desc: "A modified fragment of the growth-hormone molecule studied in metabolic research models.", badge: null, color: "#c2601f", variants: [{ dose: "5mg", price: 99.99 }] },
  { handle: "cagrilintide", name: "Cagrilintide", category: "Hormonal Balance & Metabolic Regulation", desc: "A long-acting amylin analogue investigated in metabolic and appetite-regulation research.", badge: null, color: "#b87333", variants: [{ dose: "5mg", price: 129.99 }] },
  { handle: "amino-1mq", name: "5-Amino-1MQ", category: "Hormonal Balance & Metabolic Regulation", desc: "A small-molecule research compound studied in metabolic and NNMT-pathway research.", badge: null, color: "#9c6b3f", variants: [{ dose: "50mg", price: 109.99 }] },
  { handle: "slu-pp-332", name: "SLU-PP-332", category: "Hormonal Balance & Metabolic Regulation", desc: "A research compound studied in metabolic and mitochondrial-activity models.", badge: null, color: "#a84e1c", variants: [{ dose: "5mg", price: 105.99 }] },
  { handle: "mots-c", name: "MOTS-c", category: "Resilience & Healthy Aging", desc: "A mitochondrial-derived peptide studied in research into cellular energy metabolism and insulin-sensitivity pathways, of interest in metabolic and ageing research.", badge: "New", color: "#5a7d5a", variants: [{ dose: "5mg", price: 89.95 }, { dose: "10mg", price: 94.99 }, { dose: "20mg", price: 125.99 }, { dose: "40mg", price: 159.99 }] },
  { handle: "nad", name: "NAD+", category: "Resilience & Healthy Aging", desc: "A cellular coenzyme supplied for research into energy-metabolism and cellular-ageing models.", badge: null, color: "#6b8a5a", variants: [{ dose: "500mg", price: 129.99 }] },
  { handle: "ss-31", name: "SS-31", category: "Resilience & Healthy Aging", desc: "A mitochondria-targeted research peptide studied in cellular-energy and oxidative-stress models.", badge: null, color: "#4f7a6a", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "epitalon", name: "Epitalon", category: "Resilience & Healthy Aging", desc: "A synthetic tetrapeptide studied in research into telomere and cellular-ageing pathways.", badge: null, color: "#5a7d5a", variants: [{ dose: "10mg", price: 79.99 }] },
  { handle: "glutathione", name: "Glutathione", category: "Resilience & Healthy Aging", desc: "An antioxidant tripeptide supplied for research into oxidative-stress and cellular models.", badge: null, color: "#7a9060", variants: [{ dose: "600mg", price: 79.99 }] },
  { handle: "ara-290", name: "ARA-290 (Cibinetide)", category: "Resilience & Healthy Aging", desc: "A synthetic peptide studied in research into tissue-protection and neuropathy models.", badge: null, color: "#6b8a5a", variants: [{ dose: "10mg", price: 89.99 }] },
  { handle: "selank", name: "Selank", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic analogue of the peptide tuftsin, studied in neuroscience research into stress-response and cognition pathways.", badge: null, color: "#5a7d5a", variants: [{ dose: "5mg", price: 64.95 }, { dose: "10mg", price: 94.99 }] },
  { handle: "semax", name: "Semax", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic peptide studied in neuroscience research into cognitive-function and neuroprotection pathways.", badge: null, color: "#7a5f2a", variants: [{ dose: "5mg", price: 69.95 }, { dose: "10mg", price: 69.99 }, { dose: "30mg", price: 269.95 }] },
  { handle: "dsip", name: "DSIP", category: "Neuro-Enhancement & Specialty Protocols", desc: "A delta sleep-inducing peptide studied in research into sleep-regulation and stress models.", badge: null, color: "#6b5a44", variants: [{ dose: "10mg", price: 75.99 }] },
  { handle: "pt-141", name: "PT-141", category: "Neuro-Enhancement & Specialty Protocols", desc: "A melanocortin-receptor peptide studied in neuroscience and receptor-pathway research.", badge: null, color: "#a84e1c", variants: [{ dose: "10mg", price: 99.99 }] },
  { handle: "melanotan-1", name: "Melanotan I", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic analogue of alpha-MSH studied in research into melanogenesis (pigmentation) pathways.", badge: null, color: "#b87333", variants: [{ dose: "10mg", price: 79.99 }] },
  { handle: "melanotan-2", name: "Melanotan II", category: "Neuro-Enhancement & Specialty Protocols", desc: "A synthetic melanocortin analogue studied in research into pigmentation and receptor pathways.", badge: null, color: "#c2601f", variants: [{ dose: "10mg", price: 79.99 }] },
  { handle: "bac-water", name: "Bacteriostatic Water", category: "Lab Supplies", desc: "Bacteriostatic water for laboratory reconstitution of lyophilised research peptides. Contains 0.9% benzyl alcohol. Not for injection.", badge: null, color: "#7a8a9a", optionLabel: "Size", noCoa: true, variants: [{ dose: "3mL", price: 19.99 }, { dose: "10mL", price: 28.99 }] },
  { handle: "syringes", name: "Insulin Syringes", category: "Lab Supplies", desc: "Sterile single-use syringes for laboratory handling and measurement of reconstituted research material.", badge: null, color: "#8a9aa5", optionLabel: "Pack", noCoa: true, variants: [{ dose: "20 pack", price: 22.99 }] },
]

export const KITS: CatalogueItem[] = [
  { handle: "kit-recovery", name: "Recovery & Repair Kit", desc: "A bundled research kit pairing BPC-157, TB-500 and GHK-Cu, supplied together at bulk pricing for tissue-repair research programs.", badge: "Best Value", color: "#a84e1c", optionLabel: "Kit Size", variants: [{ dose: "Standard — 3 vials", price: 249.95 }, { dose: "Bulk — 6 vials", price: 459.95 }, { dose: "Lab — 12 vials", price: 839.95 }] },
  { handle: "kit-metabolic", name: "Metabolic Research Kit", desc: "A bundled kit combining Retatrutide and Tirzepatide for laboratories running metabolic research at volume.", badge: "Popular", color: "#8a5a33", optionLabel: "Kit Size", variants: [{ dose: "Standard — 2 vials", price: 269.95 }, { dose: "Bulk — 6 vials", price: 749.95 }] },
  { handle: "kit-cognition", name: "Cognition Research Kit", desc: "A bundled kit pairing Selank and Semax for neuroscience research applications, priced for volume.", badge: null, color: "#5a7d5a", optionLabel: "Kit Size", variants: [{ dose: "Standard — 2 vials", price: 129.95 }, { dose: "Bulk — 6 vials", price: 349.95 }] },
  { handle: "kit-supplies", name: "Reconstitution Supplies Kit", desc: "Laboratory reconstitution supplies — bacteriostatic water, sterile syringes and alcohol swabs — bundled for research handling. Contains no peptides.", badge: "Supplies", color: "#6b4226", optionLabel: "Pack Size", noCoa: true, variants: [{ dose: "Starter — 10 sets", price: 39.95 }, { dose: "Bulk — 25 sets", price: 84.95 }] },
]
```

Note: `PRODUCTS` has 32 entries; `KITS` has 4. If your port yields different counts, fix the port — the test enforces these.

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx jest src/data/__tests__/catalogue.spec.ts
```
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
cd .. && git add backend/src/data
git commit -m "feat(backend): port peptide catalogue to typed data with integrity tests"
```

---

## Task 3: Age utility (pure, testable)

**Files:**
- Create: `backend/src/lib/age.ts`
- Test: `backend/src/lib/__tests__/age.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `backend/src/lib/__tests__/age.spec.ts`:
```typescript
import { calculateAge, isAdult } from "../age"

const NOW = new Date("2026-07-07T00:00:00Z")

describe("age", () => {
  it("computes age from a DOB", () => {
    expect(calculateAge("2000-07-07", NOW)).toBe(26)
  })
  it("does not count a birthday that has not occurred yet this year", () => {
    expect(calculateAge("2008-07-08", NOW)).toBe(17)
  })
  it("treats exactly-18-today as adult", () => {
    expect(isAdult("2008-07-07", NOW)).toBe(true)
  })
  it("treats 17 as not adult", () => {
    expect(isAdult("2009-01-01", NOW)).toBe(false)
  })
  it("rejects invalid/empty input as not adult", () => {
    expect(isAdult("", NOW)).toBe(false)
    expect(isAdult("not-a-date", NOW)).toBe(false)
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd backend && npx jest src/lib/__tests__/age.spec.ts
```
Expected: FAIL — cannot find module `../age`.

- [ ] **Step 3: Implement the utility**

Create `backend/src/lib/age.ts`:
```typescript
export function calculateAge(dob: string, now: Date = new Date()): number {
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return NaN
  let age = now.getUTCFullYear() - birth.getUTCFullYear()
  const monthDiff = now.getUTCMonth() - birth.getUTCMonth()
  const dayDiff = now.getUTCDate() - birth.getUTCDate()
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--
  return age
}

export function isAdult(dob: string, now: Date = new Date()): boolean {
  const age = calculateAge(dob, now)
  return Number.isFinite(age) && age >= 18
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx jest src/lib/__tests__/age.spec.ts
```
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
cd .. && git add backend/src/lib
git commit -m "feat(backend): add pure age-calculation utility with tests"
```

---

## Task 4: Seed script — region, tax-inclusive AUD, categories, shipping, catalogue

**Files:**
- Create: `backend/src/scripts/seed.ts`
- Modify: `backend/package.json` (add `seed` script)

- [ ] **Step 1: Add the `seed` npm script**

In `backend/package.json`, add to `"scripts"`:
```json
"seed": "medusa exec ./src/scripts/seed.ts"
```

- [ ] **Step 2: Write the seed script**

Create `backend/src/scripts/seed.ts`. It configures the store currency as tax-inclusive AUD, creates the AU region + tax region, a sales channel + stock location, an express shipping option (free over A$300), the five categories, then all products and kits. Idempotent: it skips products whose handle already exists.

```typescript
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createStockLocationsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { PRODUCTS, KITS, CATEGORIES } from "../data/catalogue"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModule = container.resolve(Modules.STORE)

  logger.info("Seeding Outback Peptide Labs catalogue…")

  // 1. Store: AUD, tax-inclusive
  const [store] = await storeModule.listStores()
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          { currency_code: "aud", is_default: true, is_tax_inclusive: true },
        ],
      },
    },
  })

  // 2. Sales channel + stock location
  const { data: existingChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  })
  let salesChannelId = existingChannels[0]?.id
  if (!salesChannelId) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Outback Storefront" }] },
    })
    salesChannelId = result[0].id
  }

  const { result: locations } = await createStockLocationsWorkflow(container).run({
    input: { locations: [{ name: "Sydney Facility", address: { address_1: "1 Research Way", city: "Sydney", country_code: "au", postal_code: "2000" } }] },
  })

  // 3. Region (AU / AUD) with Stripe enabled
  await createRegionsWorkflow(container).run({
    input: {
      regions: [{
        name: "Australia",
        currency_code: "aud",
        countries: ["au"],
        payment_providers: ["pp_stripe_stripe"],
      }],
    },
  })

  // 4. Tax region: 10% GST
  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "au", default_tax_rate: { name: "GST", code: "GST", rate: 10 } }],
  })

  // 5. Shipping profile + express option (free over A$300)
  const { result: profiles } = await createShippingProfilesWorkflow(container).run({
    input: { data: [{ name: "Default", type: "default" }] },
  })
  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: ["id", "service_zones.id"],
  })
  // A fulfillment set + service zone is created with the stock location above.
  const serviceZoneId = fulfillmentSets[0]?.service_zones?.[0]?.id
  if (serviceZoneId) {
    await createShippingOptionsWorkflow(container).run({
      input: [{
        name: "Australia Post Express",
        service_zone_id: serviceZoneId,
        shipping_profile_id: profiles[0].id,
        provider_id: "manual_manual",
        price_type: "flat",
        type: { label: "Express", description: "Australia Post Express", code: "express" },
        prices: [{ currency_code: "aud", amount: 14.95 }],
        rules: [{ attribute: "enabled_in_store", value: "true", operator: "eq" }],
      }],
    })
  }
  // Note: the free-over-$300 threshold is applied as a promotion in Step 4b below.

  // 6. Categories
  const { result: categories } = await createProductCategoriesWorkflow(container).run({
    input: { product_categories: CATEGORIES.map((name) => ({ name, is_active: true })) },
  })
  const catByName = new Map(categories.map((c) => [c.name, c.id]))

  // 7. Products + kits (idempotent on handle)
  const kitCategory = await createProductCategoriesWorkflow(container).run({
    input: { product_categories: [{ name: "Bulk Kits", is_active: true }] },
  })
  const kitCategoryId = kitCategory.result[0].id

  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["handle"],
  })
  const existingHandles = new Set(existing.map((p) => p.handle))

  const toProductInput = (item: typeof PRODUCTS[number], categoryId?: string) => {
    const optionName = item.optionLabel || "Dosage"
    return {
      title: item.name,
      handle: item.handle,
      description: item.desc,
      status: "published" as const,
      category_ids: categoryId ? [categoryId] : [],
      sales_channels: [{ id: salesChannelId }],
      shipping_profile_id: profiles[0].id,
      metadata: {
        badge: item.badge ?? null,
        color: item.color,
        no_coa: item.noCoa ?? false,
      },
      options: [{ title: optionName, values: item.variants.map((v) => v.dose) }],
      variants: item.variants.map((v) => ({
        title: v.dose,
        options: { [optionName]: v.dose },
        manage_inventory: false,
        prices: [{ amount: v.price, currency_code: "aud" }],
      })),
    }
  }

  const productInputs = PRODUCTS
    .filter((p) => !existingHandles.has(p.handle))
    .map((p) => toProductInput(p, p.category ? catByName.get(p.category) : undefined))

  const kitInputs = KITS
    .filter((k) => !existingHandles.has(k.handle))
    .map((k) => toProductInput(k, kitCategoryId))

  const allInputs = [...productInputs, ...kitInputs]
  if (allInputs.length) {
    await createProductsWorkflow(container).run({ input: { products: allInputs } })
  }

  logger.info(`Seed complete: ${productInputs.length} products, ${kitInputs.length} kits created (existing skipped).`)
}
```

- [ ] **Step 3: Run the seed**

```bash
cd backend && npm run seed
```
Expected: log "Seed complete: 32 products, 4 kits created".

- [ ] **Step 4: Verify idempotency — run it again**

```bash
npm run seed
```
Expected: log "Seed complete: 0 products, 0 kits created (existing skipped)."

- [ ] **Step 5: Verify via the Store API**

Get the publishable key from the admin (`Settings → Publishable API keys`) or the seeded default, then:
```bash
curl -s "http://localhost:9000/store/products?limit=1" -H "x-publishable-api-key: <PUBLISHABLE_KEY>" | head -c 400
```
Expected: JSON containing a product with a `handle` and a `variants[].calculated_price` in AUD.

- [ ] **Step 6: Commit**

```bash
cd .. && git add backend/src/scripts backend/package.json
git commit -m "feat(backend): seed AU/AUD tax-inclusive region, categories, shipping, full catalogue"
```

---

## Task 4b: Free-shipping-over-$300 promotion

**Files:**
- Modify: `backend/src/scripts/seed.ts` (append promotion creation)

- [ ] **Step 1: Append the promotion to the seed**

At the end of `seed()` in `backend/src/scripts/seed.ts`, before the final log line, add a free-shipping automatic promotion using `createPromotionsWorkflow` (import it from `@medusajs/medusa/core-flows`):
```typescript
  const { createPromotionsWorkflow } = await import("@medusajs/medusa/core-flows")
  const { data: promos } = await query.graph({ entity: "promotion", fields: ["code"] })
  if (!promos.some((p) => p.code === "FREESHIP300")) {
    await createPromotionsWorkflow(container).run({
      input: {
        promotions: [{
          code: "FREESHIP300",
          is_automatic: true,
          type: "standard",
          application_method: {
            type: "percentage",
            target_type: "shipping_methods",
            value: 100,
            currency_code: "aud",
          },
          rules: [{ attribute: "item_total", operator: "gte", values: ["300"] }],
        }],
      },
    })
  }
```

- [ ] **Step 2: Re-run the seed and confirm the promotion is created once**

```bash
cd backend && npm run seed && npm run seed
```
Expected: first run creates the promotion; second run does not error and does not duplicate it.

- [ ] **Step 3: Commit**

```bash
cd .. && git add backend/src/scripts/seed.ts
git commit -m "feat(backend): add automatic free-express-shipping-over-\$300 promotion to seed"
```

---

## Task 5: Configure Stripe payment provider

**Files:**
- Modify: `backend/medusa-config.ts`

- [ ] **Step 1: Install the Stripe module**

```bash
cd backend && npm install @medusajs/payment-stripe
```

- [ ] **Step 2: Register the payment module**

In `backend/medusa-config.ts`, add to the `modules` array (create the array if the generated config doesn't have one):
```typescript
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
            },
          },
        ],
      },
    },
  ],
```

- [ ] **Step 3: Boot and confirm the provider loads**

```bash
npm run dev
```
Expected: no module-resolution errors; the AU region (seeded with `pp_stripe_stripe`) shows Stripe as an available payment provider. Stop the server.

- [ ] **Step 4: Commit**

```bash
cd .. && git add backend/medusa-config.ts backend/package.json backend/package-lock.json 2>/dev/null; git add -A
git commit -m "feat(backend): register Stripe payment provider (test mode)"
```

---

## Task 6: Enforce the 18+ DOB gate at cart completion

**Files:**
- Create: `backend/src/workflows/hooks/validate-age.ts`
- Test: `backend/integration-tests/http/age-gate.spec.ts`

- [ ] **Step 1: Write the failing integration test**

Create `backend/integration-tests/http/age-gate.spec.ts`:
```typescript
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("age gate on cart completion", () => {
      it("rejects completion when DOB is missing", async () => {
        const container = getContainer()
        await expect(
          completeCartWorkflow(container).run({
            input: { id: "cart_missing_dob_test" },
          })
        ).rejects.toThrow(/date of birth/i)
      })
    })
  },
})
```
(This asserts the hook fires and blocks; the cart id need not exist — the age hook runs and throws before cart resolution when metadata is absent. If the runner resolves the cart first, see Step 3's note and adjust to seed a cart with no DOB metadata.)

- [ ] **Step 2: Run it and watch it fail**

```bash
cd backend && npx jest integration-tests/http/age-gate.spec.ts
```
Expected: FAIL — completion succeeds or throws a different error (hook not yet added).

- [ ] **Step 3: Add the validate hook**

Create `backend/src/workflows/hooks/validate-age.ts`:
```typescript
import { completeCartWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError, ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { isAdult } from "../../lib/age"

completeCartWorkflow.hooks.validate(async ({ input }, { container }) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data: [cart] } = await query.graph({
    entity: "cart",
    fields: ["id", "metadata"],
    filters: { id: input.id },
  })

  const dob = cart?.metadata?.date_of_birth as string | undefined
  const attested = cart?.metadata?.age_attested === true

  if (!dob) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "A date of birth is required to complete this order."
    )
  }
  if (!attested) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must confirm you are 18+ and an authorised purchaser."
    )
  }
  if (!isAdult(dob)) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "You must be 18 years or older to purchase from this store."
    )
  }
})
```

Note: Medusa auto-loads files under `src/workflows`. If the runner resolves the cart before the hook, adjust the test to first create a cart (via `createCartWorkflow`) without `date_of_birth` metadata and assert completion rejects with `/date of birth/i`.

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx jest integration-tests/http/age-gate.spec.ts
```
Expected: PASS — completion rejects with a date-of-birth error.

- [ ] **Step 5: Add a passing-path assertion**

Append to the same test file a case that creates a cart with `metadata: { date_of_birth: "1990-01-01", age_attested: true }` and asserts the age hook does **not** throw (it may fail later for unrelated reasons like no payment session — assert specifically that the thrown error, if any, does not match `/date of birth|18 years/i`).

- [ ] **Step 6: Run and commit**

```bash
npx jest integration-tests/http/age-gate.spec.ts
cd .. && git add backend/src/workflows backend/integration-tests
git commit -m "feat(backend): enforce 18+ DOB gate at cart completion via workflow hook"
```

---

## Task 7: Order-confirmation email via Resend

**Files:**
- Create: `backend/src/modules/resend/index.ts`
- Create: `backend/src/modules/resend/service.ts`
- Create: `backend/src/subscribers/order-placed.ts`
- Modify: `backend/medusa-config.ts`

- [ ] **Step 1: Install Resend**

```bash
cd backend && npm install resend
```

- [ ] **Step 2: Create the Resend notification provider module**

Create `backend/src/modules/resend/service.ts`:
```typescript
import { AbstractNotificationProviderService, MedusaError } from "@medusajs/framework/utils"
import { ProviderSendNotificationDTO, ProviderSendNotificationResultsDTO } from "@medusajs/framework/types"
import { Resend } from "resend"

type Options = { api_key: string; from: string }

export default class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend"
  private client: Resend
  private from: string

  constructor(_, options: Options) {
    super()
    if (!options.api_key) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Resend api_key is required")
    this.client = new Resend(options.api_key)
    this.from = options.from
  }

  async send(notification: ProviderSendNotificationDTO): Promise<ProviderSendNotificationResultsDTO> {
    const data = notification.data as Record<string, any>
    const { data: sent, error } = await this.client.emails.send({
      from: this.from,
      to: [notification.to],
      subject: data.subject ?? "Your Outback Peptide Labs order",
      html: data.html ?? "<p>Thank you for your order.</p>",
    })
    if (error) throw new MedusaError(MedusaError.Types.UNEXPECTED_STATE, error.message)
    return { id: sent?.id }
  }
}
```

Create `backend/src/modules/resend/index.ts`:
```typescript
import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import ResendNotificationService from "./service"

export default ModuleProvider(Modules.NOTIFICATION, {
  services: [ResendNotificationService],
})
```

- [ ] **Step 3: Register the notification module**

In `backend/medusa-config.ts`, add to `modules`:
```typescript
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "./src/modules/resend",
            id: "resend",
            options: {
              channels: ["email"],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL,
            },
          },
        ],
      },
    },
```

- [ ] **Step 4: Create the order.placed subscriber**

Create `backend/src/subscribers/order-placed.ts`:
```typescript
import { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules, ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({ event, container }: SubscriberArgs<{ id: string }>) {
  const notification = container.resolve(Modules.NOTIFICATION)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [order] } = await query.graph({
    entity: "order",
    fields: ["id", "display_id", "email", "total", "currency_code"],
    filters: { id: event.data.id },
  })
  if (!order?.email) return

  await notification.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-placed",
    data: {
      subject: `Order #${order.display_id} confirmed — Outback Peptide Labs`,
      html: `<p>Thanks for your research supply order #${order.display_id}.</p><p>Total: ${order.total} ${String(order.currency_code).toUpperCase()}.</p>`,
    },
  })
}

export const config: SubscriberConfig = { event: "order.placed" }
```

- [ ] **Step 5: Boot and confirm no load errors**

```bash
npm run dev
```
Expected: server boots; notification module + subscriber load with no errors. (Real send requires a valid `RESEND_API_KEY`; with the placeholder it will only error at send time, not boot.) Stop the server.

- [ ] **Step 6: Commit**

```bash
cd .. && git add backend/src/modules backend/src/subscribers backend/medusa-config.ts backend/package.json
git commit -m "feat(backend): order-confirmation email via Resend notification provider"
```

---

## Task 8: Backend README + full test run

**Files:**
- Create: `backend/README.md`

- [ ] **Step 1: Write the backend README**

Create `backend/README.md`:
```markdown
# Outback Peptide Labs — Backend (Medusa v2)

## Prerequisites
- Node 20+, pnpm, Docker (for Postgres + Redis)

## Setup
1. `cp .env.example .env` and fill values.
2. Start Postgres + Redis (see docker commands in the plan or your infra).
3. `npx medusa db:migrate`
4. `npx medusa user -e admin@example.com -p <password>`
5. `npm run seed`
6. `npm run dev` → API on :9000, admin on :9000/app

## Key modules
- Catalogue: `src/data/catalogue.ts` + `src/scripts/seed.ts`
- Age gate (18+): `src/workflows/hooks/validate-age.ts` + `src/lib/age.ts`
- Payments: Stripe (`@medusajs/payment-stripe`), test mode
- Email: Resend provider in `src/modules/resend`

## Tests
- `npx jest src` — unit (catalogue, age)
- `npx jest integration-tests` — integration (age gate)
```

- [ ] **Step 2: Run the whole unit + integration suite**

```bash
cd backend && npx jest src && npx jest integration-tests
```
Expected: all suites PASS (catalogue: 4, age: 5, age-gate: 2).

- [ ] **Step 3: Commit**

```bash
cd .. && git add backend/README.md
git commit -m "docs(backend): add backend README"
```

---

## Self-review notes (checked against the spec)

- **§3 catalogue mapping** → Tasks 2 & 4 (handles, categories, AUD prices, metadata for badge/color/no_coa, kits collection). ✓
- **§3 region/tax/shipping** → Task 4 (AU/AUD, 10% GST tax-inclusive, express + free-over-$300 via Task 4b). ✓
- **§4 payments** → Task 5 (Stripe, swappable provider). ✓
- **§5 age gate** → Tasks 3 & 6 (pure util + server-side completeCart hook, DOB+attestation on cart metadata). ✓
- **§8 email** → Task 7 (Resend provider + order.placed subscriber). ✓
- **§9 testing** → Tasks 2, 3, 6, 8 (unit + integration). ✓
- **Out of scope (§11)** — accounts, ID vendor, reviews, analytics, storefront, deployment — correctly absent. ✓
- **COA link / image** are storefront concerns (metadata carries `no_coa`, `color`, and image is on the product) — consumed in Plan 2. ✓
- **`calculateAge` / `isAdult`** names are consistent between Task 3 (definition) and Task 6 (use). ✓

## Risks / notes for the implementer

- Medusa v2 workflow/step input shapes evolve between minor versions. If a `*Workflow` input key is rejected at runtime, check the installed version's `core-flows` types and adjust the object (the shape, not the approach, is what may drift).
- The seed assumes a fresh DB creates one default sales channel + one fulfillment set/service zone with the stock location. If your Medusa version doesn't auto-create the fulfillment set, add a `createFulfillmentSetsWorkflow` step before the shipping option.
- Stripe test mode needs a real `sk_test_...` key to actually create payment sessions during any manual checkout smoke test; unit/integration tests above do not require it.
```
