# Production Deployment Runbook

This monorepo deploys as **two services**:

| Part         | Directory     | Platform | Provides                                  |
| ------------ | ------------- | -------- | ----------------------------------------- |
| Backend      | `backend/`    | Railway  | Medusa v2 API + Admin, Postgres, Redis    |
| Storefront   | `storefront/` | Vercel   | Next.js 15 storefront                     |

**Deploy order matters:** deploy and seed the **backend first**, obtain its public URL + publishable key, then deploy the storefront (its build pre-renders product pages by calling the backend).

---

## 0. Prerequisites

- The GitHub repo is pushed and accessible to Railway and Vercel.
- A Stripe account (test keys `sk_test_…` / `pk_test_…` to start; live keys later).
- A Resend account with a verified sender domain (API key `re_…`).
- Two strong random secrets for the backend (`JWT_SECRET`, `COOKIE_SECRET`), e.g.:
  ```bash
  openssl rand -base64 32
  ```

Environment key references (do **not** commit real values):
- Backend: [`backend/.env.production.example`](backend/.env.production.example)
- Storefront: [`storefront/.env.production.example`](storefront/.env.production.example)

---

## 1. Backend → Railway

### 1.1 Create the project and data plugins
1. Railway → **New Project** → **Deploy from GitHub repo** → select this repo.
2. In the project, add **Database → PostgreSQL** (Railway provisions it and exposes `DATABASE_URL`).
3. Add **Database → Redis** (Railway provisions it and exposes `REDIS_URL`). **Redis is required in production** — the backend enables the Redis-backed event bus, cache, workflow engine, and distributed locking only when `REDIS_URL` is present.

### 1.2 Configure the backend service
1. Open the service created from the repo → **Settings**.
2. **Root Directory:** `backend`
3. **Config-as-code:** [`backend/railway.json`](backend/railway.json) is picked up automatically. It defines:
   - **Build command:**
     ```
     corepack enable && pnpm install --frozen-lockfile && pnpm --filter backend build
     ```
   - **Start command:**
     ```
     sh ./scripts/start-prod.sh
     ```
     ([`backend/scripts/start-prod.sh`](backend/scripts/start-prod.sh) runs `medusa db:migrate` then `medusa start` from `.medusa/server`.)
   - **Healthcheck path:** `/health`

   If you prefer setting these in the Railway UI instead of `railway.json`, use the exact same values:
   | Field         | Value                                                                        |
   | ------------- | ---------------------------------------------------------------------------- |
   | Build Command | `corepack enable && pnpm install --frozen-lockfile && pnpm --filter backend build` |
   | Start Command | `sh ./scripts/start-prod.sh`                                                 |
   | Pre-Deploy    | *(optional)* `cd .medusa/server && npx medusa db:migrate` — migrations already run in the start script, so leaving Pre-Deploy empty is fine |
   | Healthcheck   | `/health`                                                                    |

### 1.3 Set backend environment variables
In the service → **Variables**, add (see `backend/.env.production.example` for details):

| Variable                  | Value                                                                 |
| ------------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`            | `${{Postgres.DATABASE_URL}}` (reference the Postgres plugin)          |
| `REDIS_URL`               | `${{Redis.REDIS_URL}}` (reference the Redis plugin)                   |
| `JWT_SECRET`              | strong random string                                                  |
| `COOKIE_SECRET`           | strong random string (different from JWT_SECRET)                      |
| `STORE_CORS`              | your Vercel storefront URL (fill in after step 2; can be a placeholder first) |
| `ADMIN_CORS`              | your Railway backend public URL                                       |
| `AUTH_CORS`               | storefront URL **and** backend URL, comma-separated                  |
| `STRIPE_API_KEY`          | `sk_test_…` (later `sk_live_…`)                                       |
| `RESEND_API_KEY`          | `re_…`                                                                |
| `RESEND_FROM_EMAIL`       | verified sender, e.g. `orders@yourdomain.com`                        |
| `NODE_ENV`                | `production`                                                          |

> `PORT` is injected by Railway automatically — do not set it. `MEDUSA_WORKER_MODE` only needs setting if you split API and workers into separate services (leave unset for a single combined service).

### 1.4 First deploy
1. Trigger the deploy. Watch the build + start logs.
2. Under the service → **Settings → Networking**, **Generate Domain** to get the public backend URL, e.g. `https://your-backend.up.railway.app`. Record it — this is the **Railway backend URL**.
3. Set `ADMIN_CORS` to this URL (and include it in `AUTH_CORS`) if you used placeholders.

### 1.5 One-time data setup (Railway shell)
Open the service → **⋮ → Shell** (or `railway run` locally with linked env), then run **from the `.medusa/server` directory** so the compiled app + migrations resolve:

```bash
cd .medusa/server

# 1) Seed base data (regions incl. AU, sales channel, products, publishable key)
npm run seed

# 2) Remove Medusa demo data that the starter ships with
npm run clean:demo

# 3) Enable the Stripe payment provider on the region(s)
npm run enable:stripe
```

> These npm scripts exist in `backend/package.json` and are copied into `.medusa/server`. If a script is not found there, run the underlying command, e.g. `npx medusa exec ./src/scripts/seed.ts` from the repo `backend/` root during a temporary shell.

### 1.6 Grab the publishable key
The seed script prints it near the end of its output:

```
Publishable API key: pk_XXXXXXXXXXXXXXXXXXXXXXXX
```

Record this **publishable key** (`pk_…`) — the storefront needs it. You can also find it later in **Admin → Settings → Publishable API Keys** at `https://your-backend.up.railway.app/app`.

---

## 2. Storefront → Vercel

### 2.1 Import the project
1. Vercel → **Add New… → Project** → import this GitHub repo.
2. **Root Directory:** `storefront` (click **Edit** next to Root Directory and select it — this is a monorepo, so it must not be the repo root).
3. **Framework Preset:** Next.js (auto-detected).

### 2.2 Install / build settings
[`storefront/vercel.json`](storefront/vercel.json) sets these; override in the dashboard only if needed:
- **Install Command:** `cd .. && corepack pnpm@9.15.9 install --frozen-lockfile --filter storefront...`
  (installs the storefront + its workspace deps from the repo-root `pnpm-lock.yaml`)
- **Build Command:** `corepack pnpm@9.15.9 exec next build`
- **Node.js Version:** 20.x (set under Settings → General → Node.js Version)
- **Output Directory:** `.next` (default; leave as-is)

> Why the custom commands: the storefront is a **pnpm workspace member** (the lockfile lives at the repo root). The `packageManager: yarn@…` field inside `storefront/package.json` would otherwise make Vercel try Yarn, which has no lockfile here. The commands above force pnpm from the workspace root.

### 2.3 Set storefront environment variables
Project → **Settings → Environment Variables** (Production). See `storefront/.env.production.example`:

| Variable                             | Value                                             |
| ------------------------------------ | ------------------------------------------------- |
| `MEDUSA_BACKEND_URL`                 | the **Railway backend URL** from step 1.4         |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL`     | same Railway backend URL                          |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | the **publishable key** (`pk_…`) from step 1.6    |
| `NEXT_PUBLIC_DEFAULT_REGION`         | `au`                                              |
| `NEXT_PUBLIC_BASE_URL`               | your Vercel URL, e.g. `https://your-storefront.vercel.app` |
| `REVALIDATE_SECRET`                  | strong random string                              |
| `NEXT_PUBLIC_STRIPE_KEY`             | Stripe **publishable** key `pk_test_…` / `pk_live_…` |

> `NEXT_PUBLIC_STRIPE_KEY` is the browser (publishable) Stripe key and must belong to the **same** Stripe account whose secret key is set as `STRIPE_API_KEY` on the backend. Without it the checkout payment step renders an error.

### 2.4 Deploy
Trigger the deploy. The build pre-renders product pages by calling `MEDUSA_BACKEND_URL`, so the backend must already be up and seeded (step 1). Record the storefront URL, e.g. `https://your-storefront.vercel.app`.

---

## 3. Wire the two together

After both are live, cross-reference the URLs:

1. **Backend (Railway) Variables** — set to the real Vercel URL and redeploy:
   - `STORE_CORS` = `https://your-storefront.vercel.app`
   - `AUTH_CORS` = `https://your-storefront.vercel.app,https://your-backend.up.railway.app`
   - (`ADMIN_CORS` stays the backend URL)
   - Redeploy the backend service so the new CORS values take effect.

2. **Storefront (Vercel) Variables** — confirm `MEDUSA_BACKEND_URL` points at the Railway URL. If you change it, redeploy.

---

## 4. Stripe

- **Backend:** `STRIPE_API_KEY` = secret key (`sk_test_…`, then `sk_live_…`). Enabled on regions via `npm run enable:stripe` (step 1.5).
- **Storefront:** `NEXT_PUBLIC_STRIPE_KEY` = publishable key (`pk_test_…`, then `pk_live_…`).
- Both keys must come from the **same** Stripe account/mode (test vs live).
- **Webhooks (recommended for production):** the backend logs a warning that `webhookSecret` is missing on the Stripe plugin. For reliable async flows (3D Secure, redirect-based methods, async capture), create a Stripe webhook pointing at the backend's Stripe webhook endpoint and add the signing secret to the Stripe payment provider options. Not required for a basic card checkout smoke test, but do this before going live.

---

## 5. Smoke test after deploy

Run against the **storefront** production URL:

- [ ] **Home loads** — `https://your-storefront.vercel.app/au` returns 200 and renders.
- [ ] **Product loads** — open a product (e.g. `/au/products/nad`) and it renders with price/region AU.
- [ ] **Add to cart → 200** — add a product to the cart; the cart updates (network call returns 200).
- [ ] **Under-18 checkout blocked** — attempt checkout with a date of birth under 18; the age gate (`validate-age` workflow hook) blocks the purchase with a clear error. An 18+ DOB proceeds.
- [ ] **Admin reachable** — `https://your-backend.up.railway.app/app` loads the Medusa admin login.
- [ ] **Health** — `https://your-backend.up.railway.app/health` returns 200.

---

## 6. Rollback

- **Railway:** Deployments tab → select a previous successful deploy → **Redeploy** / **Rollback**.
- **Vercel:** Deployments tab → previous deployment → **Promote to Production**.
- Database migrations are forward-only; a code rollback that expects an older schema may require care. Take a Postgres backup (Railway → Postgres plugin → Backups) before schema-changing deploys.
