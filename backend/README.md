# Outback Peptide Labs — Backend (Medusa v2)

Headless commerce backend for the Outback Peptide Labs storefront. Serves the Store API,
computes all pricing/GST server-side, handles Stripe checkout, enforces an 18+ date-of-birth
gate at cart completion, and emails order confirmations.

- **Medusa** v2.17.0 · **Node** 20+ (built & tested on 25) · **PostgreSQL** · Redis optional

## Prerequisites

- Node 20+ and **pnpm** (`npm i -g pnpm`)
- A PostgreSQL server. Locally (macOS/Homebrew, no Docker):
  ```bash
  # one-time init + start (LC_ALL avoids a macOS "multithreaded postmaster" error)
  /opt/homebrew/opt/postgresql@15/bin/initdb -D /opt/homebrew/var/postgresql@15 -U postgres --auth=trust
  LC_ALL=C LANG=C /opt/homebrew/opt/postgresql@15/bin/pg_ctl -D /opt/homebrew/var/postgresql@15 -l /tmp/pg.log -o "-p 5432" start
  psql -p 5432 -U postgres -h localhost -c "CREATE DATABASE medusa;"
  ```
- **Redis is optional** in development — with no `REDIS_URL`, Medusa uses an in-memory event
  bus + cache. Use Redis in production.

## Setup

1. `cp .env.example .env` and fill values (at minimum `DATABASE_URL`; `STRIPE_API_KEY` /
   `RESEND_*` may stay as placeholders until you wire real keys).
2. Install deps from the repo root: `pnpm install`
3. Migrate: `npx medusa db:migrate`
4. Create an admin user: `npx medusa user -e admin@example.com -p <password>`
5. Seed the catalogue + region/tax/shipping: `npm run seed`
6. (Fresh scaffold only) remove Medusa's demo data: `npm run clean:demo`
7. (After configuring Stripe) enable it on the AU region: `npm run enable:stripe`
8. Run: `npm run dev` → Store/Admin API on `:9000`, admin dashboard at `:9000/app`

## What the seed creates

- Store currency **AUD**, **tax-inclusive**
- **Australia** region (AUD, country `au`) with Stripe enabled
- **10% GST** tax region
- Sales channel + Sydney stock location + default shipping profile
- Fulfillment set/service zone (au) + **Australia Post Express** flat option (A$14.95)
- Publishable API key linked to the sales channel (printed at the end of the seed log)
- 5 catalogue categories + a **Bulk Kits** category
- The full catalogue: **32 products + 4 kits** (idempotent on `handle`)
- **FREESHIP300** automatic promotion — 100% off shipping when item total ≥ A$300

## Key source

| Concern | Location |
|---|---|
| Catalogue data | `src/data/catalogue.ts` |
| Seed | `src/scripts/seed.ts` |
| Remove demo data | `src/scripts/remove-demo-data.ts` (`npm run clean:demo`) |
| Enable Stripe on region | `src/scripts/enable-stripe.ts` (`npm run enable:stripe`) |
| Age (18+) math | `src/lib/age.ts` |
| Purchaser eligibility rule | `src/lib/purchaser-eligibility.ts` |
| 18+ gate at checkout | `src/workflows/hooks/validate-age.ts` (hooks `completeCartWorkflow.validate`) |
| Payments | Stripe (`@medusajs/payment-stripe`), test mode |
| Order-confirmation email | `src/modules/resend` + `src/subscribers/order-placed.ts` |

## Tests

```bash
npm run test:unit               # pure logic: catalogue integrity, age math, eligibility
npm run test:integration:http   # boots a real app + test DB; proves the 18+ gate blocks checkout
```

The integration harness needs `pg-god` (installed) and `.env.test` (sets `DB_USERNAME=postgres`
for test-DB creation). PostgreSQL must be running.

## Notes

- Stripe stands in for the production high-risk gateway; swap it for a custom Medusa payment
  provider module later (the abstraction makes this a drop-in, not a rewrite).
- The 18+ gate here is a **server-validated DOB attestation**, not third-party ID verification
  (a later phase).
- Never commit `.env`. Only `.env.example` (all values blank) is tracked.
