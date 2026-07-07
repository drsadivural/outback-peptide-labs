import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

/**
 * Redis is REQUIRED in production. Railway injects `REDIS_URL` via its Redis
 * plugin. When it is present we register the Redis-backed infrastructure
 * modules (event bus, cache, workflow engine, distributed locking) so the
 * backend can run with multiple workers/instances safely.
 *
 * When `REDIS_URL` is NOT set (local dev without Redis), these entries are
 * omitted and Medusa falls back to its in-memory defaults, keeping local
 * development zero-dependency.
 */
const REDIS_URL = process.env.REDIS_URL

const redisModules = REDIS_URL
  ? [
      {
        key: Modules.EVENT_BUS,
        resolve: '@medusajs/event-bus-redis',
        options: {
          redisUrl: REDIS_URL,
        },
      },
      {
        key: Modules.CACHE,
        resolve: '@medusajs/cache-redis',
        options: {
          redisUrl: REDIS_URL,
        },
      },
      {
        key: Modules.WORKFLOW_ENGINE,
        resolve: '@medusajs/workflow-engine-redis',
        options: {
          // NOTE: workflow-engine-redis reads its connection from a nested
          // `redis` object (verified against @medusajs/workflow-engine-redis
          // 2.17.0 loader), unlike the other Redis modules which take
          // `redisUrl` at the top level.
          redis: {
            redisUrl: REDIS_URL,
          },
        },
      },
      {
        key: Modules.LOCKING,
        resolve: '@medusajs/medusa/locking',
        options: {
          providers: [
            {
              resolve: '@medusajs/medusa/locking-redis',
              id: 'locking-redis',
              is_default: true,
              options: {
                redisUrl: REDIS_URL,
              },
            },
          ],
        },
      },
    ]
  : []

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // NOTE: the HTTP port is read from the PORT env var by Medusa's CLI at
    // runtime (Railway injects PORT), so it is intentionally not set here —
    // `port` is not a valid `http` config key in Medusa 2.17.
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
    // Worker mode: "shared" (default, single instance runs API + workers),
    // "server" (HTTP only) or "worker" (background jobs only). Set
    // MEDUSA_WORKER_MODE=server/worker when splitting into separate Railway
    // services; leave unset for a single combined service.
    ...(process.env.MEDUSA_WORKER_MODE
      ? { workerMode: process.env.MEDUSA_WORKER_MODE as 'shared' | 'worker' | 'server' }
      : {}),
  },
  modules: [
    ...redisModules,
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
          {
            resolve: "@medusajs/medusa/notification-local",
            id: "local",
            options: {
              channels: ["feed"],
            },
          },
        ],
      },
    },
  ],
})
