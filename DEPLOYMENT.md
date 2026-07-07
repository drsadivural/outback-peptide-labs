# Production Deployment Runbook

This monorepo deploys as **two services**:

| Part         | Directory     | Platform | Provides                                  |
| ------------ | ------------- | -------- | ----------------------------------------- |
| Backend      | `backend/`    | Render   | Medusa v2 API + Admin, Postgres, Redis    |
| Storefront   | `storefront/` | Vercel   | Next.js 15 storefront                     |

**Deploy order matters:** deploy and seed the **backend first**, obtain its public URL + publishable key, then deploy the storefront (its build pre-renders product pages by calling the backend).

The backend is defined as a **Render Blueprint** at [`render.yaml`](render.yaml) (repo root). It declares three resources: a managed **Postgres** (`opl-postgres`), a managed **Key-Value / Redis** (`opl-redis`, internal-only), and the **web service** (`opl-backend`).

---

## 0. Prerequisites

- The GitHub repo is pushed. Render can build a **public** repo straight from its Git URL (no GitHub App needed); a **private** repo requires the one-time "Connect GitHub" authorization in the Render dashboard (see Path B).
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

## 1. Backend → Render

The whole backend (web service + Postgres + Redis) is described by [`render.yaml`](render.yaml). You apply that Blueprint one of two ways depending on repo visibility.

### 1.1 Path A — Blueprint from a PUBLIC repo (API / Git, no GitHub App)

Render can build a **public** Git repo directly from its URL — no interactive GitHub App connection required. This is the automation-friendly path (see [§7 Render API](#7-render-api-endpoints-for-automation) for the exact calls).

1. Push this repo to a **public** GitHub repository, e.g. `https://github.com/<you>/<repo>`.
2. With a Render **API key** (Dashboard → Account Settings → API Keys), create the Blueprint / services pointing at the public repo URL and the branch. Render reads `render.yaml` at the repo root and provisions `opl-postgres`, `opl-redis`, and `opl-backend`.
   - Via CLI: `render blueprint launch` (or the API `POST /v1/services` per resource — see §7).
3. Render runs the build (`buildCommand`) and start (`startCommand`) from `render.yaml`. Watch the deploy logs.

### 1.2 Path B — Blueprint from a PRIVATE repo (Dashboard)

1. Push this repo to a **private** GitHub repository.
2. Render Dashboard → **connect your GitHub account** (one-time OAuth authorization; grant access to the repo).
3. **New → Blueprint** → pick the repo → Render detects [`render.yaml`](render.yaml) → **Apply**. It creates all three resources.

### 1.3 What `render.yaml` defines (both paths)

| Resource                  | Type              | Notes                                                                                  |
| ------------------------- | ----------------- | -------------------------------------------------------------------------------------- |
| `opl-postgres`            | `databases:`      | Managed Postgres, `databaseName: medusa`, `plan: basic`. Injects `DATABASE_URL`.       |
| `opl-redis`               | `type: keyvalue`  | Managed Redis, `ipAllowList: []` (internal only). Injects `REDIS_URL`.                  |
| `opl-backend`             | `type: web`       | Node service, `rootDir: backend`, health check `/health`.                              |

**Build command** (handles the pnpm-workspace-from-`rootDir` problem):
```
corepack enable && cd .. && pnpm install --frozen-lockfile && pnpm --filter backend build
```
`rootDir: backend` makes Render run in `<repo>/backend`, but the workspace root (`pnpm-workspace.yaml` + the single `pnpm-lock.yaml`) is one level up, so the command `cd ..` to the repo root, installs the frozen workspace, then builds only the backend. `medusa build` writes `backend/.medusa/server`.

**Start command:** `sh ./scripts/start-prod.sh` — runs from `rootDir: backend`. [`backend/scripts/start-prod.sh`](backend/scripts/start-prod.sh) cd's into `.medusa/server`, installs prod deps if missing, runs `medusa db:migrate`, then `medusa start` (which binds to Render's injected `PORT`).

### 1.4 Backend environment variables (set on `opl-backend`)

`render.yaml` wires most of these automatically; the `sync: false` ones you must fill in the Render dashboard (Service → **Environment**) after the URLs are known. See [`backend/.env.production.example`](backend/.env.production.example).

| Variable                       | Source in `render.yaml`                | Action                                                          |
| ------------------------------ | -------------------------------------- | -------------------------------------------------------------- |
| `DATABASE_URL`                 | `fromDatabase: opl-postgres`           | Auto — nothing to do.                                          |
| `REDIS_URL`                    | `fromService: opl-redis`               | Auto — enables Redis-backed event bus/cache/workflow/locking. |
| `JWT_SECRET`                   | `generateValue: true`                  | Auto — generated once, then held constant.                    |
| `COOKIE_SECRET`                | `generateValue: true`                  | Auto — generated once (different from JWT_SECRET).            |
| `NODE_VERSION`                 | `value: "22"`                          | Pinned to Node 22 LTS (Medusa supports 20/22; **not 25**).    |
| `NODE_ENV`                     | `value: production`                    | Auto.                                                          |
| `STORE_CORS`                   | `sync: false`                          | Set to the Vercel storefront URL (after §2).                  |
| `ADMIN_CORS`                   | `sync: false`                          | Set to this backend's Render URL.                             |
| `AUTH_CORS`                    | `sync: false`                          | Storefront URL **and** backend URL, comma-separated.          |
| `STRIPE_API_KEY`               | `sync: false`                          | `sk_test_…` then `sk_live_…`.                                 |
| `RESEND_API_KEY`               | `sync: false`                          | `re_…`.                                                        |
| `RESEND_FROM_EMAIL`            | `sync: false`                          | Verified sender, e.g. `orders@yourdomain.com`.               |
| `MEDUSA_BACKEND_URL`           | `sync: false`                          | Set to the `onrender.com` URL once live (or custom domain).  |
| `MEDUSA_ADMIN_BACKEND_URL`     | `sync: false`                          | Same Render URL (admin backend base).                        |

> `PORT` is injected by Render automatically — do not set it. `MEDUSA_WORKER_MODE` only needs setting if you split API and workers into separate services (leave unset for a single combined service). Render also exposes `RENDER_EXTERNAL_URL` at runtime if you prefer to derive the self-URL.

### 1.5 First deploy & the public URL
1. Apply the Blueprint (Path A or B). Watch the build + start logs.
2. Render assigns the web service a URL like `https://opl-backend.onrender.com`. Record it — this is the **Render backend URL**.
3. Set `ADMIN_CORS`, `AUTH_CORS`, `MEDUSA_BACKEND_URL`, `MEDUSA_ADMIN_BACKEND_URL` to this URL (see §3) and let it redeploy.

> **Cost note.** `free` Render web services **spin down when idle** (cold starts, and background workers/webhooks stall) and `free` Postgres **expires after 30 days**. `render.yaml` therefore uses `plan: basic` (Postgres) / `plan: starter` (Redis + web) as sensible always-on defaults for a real store. Adjust plans in `render.yaml` (or the dashboard) to your budget/scale.

### 1.6 One-time data setup (Render Shell)
Open the `opl-backend` service → **Shell** tab, then run **from the `.medusa/server` directory** so the compiled app + migrations resolve:

```bash
cd .medusa/server

# 1) Seed base data (regions incl. AU, sales channel, products, publishable key)
npm run seed

# 2) Remove Medusa demo data that the starter ships with
npm run clean:demo

# 3) Enable the Stripe payment provider on the region(s)
npm run enable:stripe
```

> These npm scripts exist in `backend/package.json` and are copied into `.medusa/server`. If a script is not found there, run the underlying command, e.g. `npx medusa exec ./src/scripts/seed.ts`.

### 1.7 Grab the publishable key
The seed script prints it near the end of its output:

```
Publishable API key: pk_XXXXXXXXXXXXXXXXXXXXXXXX
```

Record this **publishable key** (`pk_…`) — the storefront needs it. You can also find it later in **Admin → Settings → Publishable API Keys** at `https://opl-backend.onrender.com/app`.

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
| `MEDUSA_BACKEND_URL`                 | the **Render backend URL** from step 1.5          |
| `NEXT_PUBLIC_MEDUSA_BACKEND_URL`     | same Render backend URL                           |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | the **publishable key** (`pk_…`) from step 1.7    |
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

1. **Backend (Render) Environment** — set the `sync: false` vars to the real Vercel URL and let it redeploy:
   - `STORE_CORS` = `https://your-storefront.vercel.app`
   - `AUTH_CORS` = `https://your-storefront.vercel.app,https://opl-backend.onrender.com`
   - `ADMIN_CORS` = `https://opl-backend.onrender.com` (the backend's own Render URL)
   - `MEDUSA_BACKEND_URL` / `MEDUSA_ADMIN_BACKEND_URL` = `https://opl-backend.onrender.com`
   - Saving env changes triggers a redeploy so the new CORS values take effect.

2. **Storefront (Vercel) Variables** — confirm `MEDUSA_BACKEND_URL` points at the Render URL. If you change it, redeploy.

---

## 4. Stripe

- **Backend:** `STRIPE_API_KEY` = secret key (`sk_test_…`, then `sk_live_…`). Enabled on regions via `npm run enable:stripe` (step 1.6).
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
- [ ] **Admin reachable** — `https://opl-backend.onrender.com/app` loads the Medusa admin login.
- [ ] **Health** — `https://opl-backend.onrender.com/health` returns 200.

---

## 6. Rollback

- **Render:** service → **Deploys** tab → pick a previous successful deploy → **Rollback to this deploy**. (Instant rollback is available on paid instance types.)
- **Vercel:** Deployments tab → previous deployment → **Promote to Production**.
- Database migrations are forward-only; a code rollback that expects an older schema may require care. Take a Postgres backup (Render → `opl-postgres` → **Backups / Recovery**) before schema-changing deploys.

---

## 7. Render API endpoints (for automation)

To provision and deploy the backend without the dashboard (e.g. from CI with a Render **API key**, `Authorization: Bearer <RENDER_API_KEY>`, base `https://api.render.com/v1`). Applying [`render.yaml`](render.yaml) via the dashboard/CLI does all of this in one shot; the raw API sequence is:

1. **Get the owner id** — `GET /v1/owners` (the account/team that will own the resources).
2. **Create Postgres** — `POST /v1/postgres` with `{ name: "opl-postgres", databaseName: "medusa", user: "medusa", plan: "basic", ownerId, region }`. Poll `GET /v1/postgres/{id}` until `status = available`; read its `connectionInfo` for the internal connection string.
3. **Create Redis (key-value)** — `POST /v1/key-value` with `{ name: "opl-redis", plan: "starter", ipAllowList: [], maxmemoryPolicy: "noeviction", ownerId, region }`. Poll `GET /v1/key-value/{id}` until ready; read its connection string.
4. **Create the web service from the repo** — `POST /v1/services` with `type: "web_service"`, `ownerId`, `repo: "https://github.com/<you>/<repo>"` (a **public** repo needs no GitHub App), `branch`, and `serviceDetails` carrying `env: "node"`, `rootDir: "backend"`, `plan: "starter"`, `healthCheckPath: "/health"`, the build command (`corepack enable && cd .. && pnpm install --frozen-lockfile && pnpm --filter backend build`) and start command (`sh ./scripts/start-prod.sh`).
5. **Set env vars** — `PUT /v1/services/{serviceId}/env-vars` with the full desired list (`DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `NODE_VERSION=22`, `NODE_ENV=production`, `STORE_CORS`, `ADMIN_CORS`, `AUTH_CORS`, `STRIPE_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `MEDUSA_BACKEND_URL`, `MEDUSA_ADMIN_BACKEND_URL`). Wire `DATABASE_URL`/`REDIS_URL` to the connection strings from steps 2–3.
6. **Trigger a deploy** — `POST /v1/services/{serviceId}/deploys`.
7. **Poll deploy status** — `GET /v1/services/{serviceId}/deploys/{deployId}` until `status = live` (or `build_failed` / `update_failed`). Stream logs via `GET /v1/services/{serviceId}/logs`.

> Prefer the Blueprint (`render.yaml`) over hand-rolling these calls: it keeps Postgres/Redis/web + all env wiring in version control, and `fromDatabase`/`fromService`/`generateValue` are resolved by Render for you. Field names above follow the current Render REST API (`api.render.com/v1`); confirm against the live API reference before scripting, as endpoint shapes evolve.
