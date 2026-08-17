# Portfolio OS

Vite + React frontend and an Express API that run together on **Vercel**, with **Supabase Postgres** as the database.

## Local development

```bash
cp .env.example .env
# Fill DATABASE_URL and DIRECT_URL from Supabase
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev:api
npm run dev
```

The Vite dev server proxies `/api` and `/health` to `http://127.0.0.1:3001`.

## Vercel + Supabase

Set these environment variables on the Vercel project:

- `DATABASE_URL` — Supabase pooled connection (port `6543`, include `pgbouncer=true`)
- `DIRECT_URL` — Supabase direct connection (port `5432`) for Prisma generate/push
- `JWT_SECRET`
- `ADMIN_PASSWORD`
- `OPENAI_API_KEY` (optional; AI falls back to offline retrieval)

Do not set `VITE_API_URL` when the site and API share the same Vercel deployment. The frontend calls same-origin `/api/...`.

After the first deploy, run `npm run db:push` and `npm run db:seed` once against Supabase so public CMS routes have published content.
