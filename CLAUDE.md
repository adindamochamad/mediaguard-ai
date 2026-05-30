# MediGuard AI — Claude Code Context

## What this project is

MediGuard AI is a real-time medication safety intelligence platform. Users add their medications once; the system continuously monitors Food and Drug Administration (FDA) communications, PubMed studies, and medical news via Nimble API, then uses Anthropic Claude to match findings to the user's specific medication list and deliver plain-language alerts with primary source links.

Built for DeveloperWeek NYC 2026 — Nimble Challenge + Overall track.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router, TypeScript (strict) |
| Styling | Tailwind CSS, Recharts (charts), Sonner (toasts) |
| Database + Auth | Supabase (PostgreSQL + Row Level Security + Realtime) |
| Web intelligence | Nimble API (Extract, Search, Crawl) |
| AI | Anthropic Claude Sonnet (prompt caching, tool use, SSE streaming) |
| Email | Resend + React Email |
| Process manager | PM2 (`ecosystem.config.js`) |
| Reverse proxy | Nginx |

## Port

Always `3001` — dev and production both use port 3001.

```bash
npm run dev    # → http://localhost:3001
npm run build && npm run start  # production
```

## Key commands

```bash
npm run dev          # dev server on port 3001
npm run build        # production build
npm run start        # start production server
npm run verify       # run project verification scripts
npm run test         # run test suite
npm run agents       # run agent scripts
npm run setup:git-hooks  # install git hooks (privacy guards)
```

## Environment variables (all required)

Copy `.env.example` → `.env.local` and fill. See `.env.example` for the full list.

| Variable | Source |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic Console |
| `NIMBLE_API_KEY` | Nimble dashboard (Bearer key) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → API settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → API settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → API settings (server-only, never `NEXT_PUBLIC_`) |
| `RESEND_API_KEY` | Resend dashboard |
| `RESEND_FROM` | e.g. `MediGuard AI <noreply@yourdomain.com>` |
| `NEXT_PUBLIC_APP_URL` | Production URL, no trailing slash |
| `CRON_SECRET` | Run `openssl rand -hex 32` to generate |
| `DEMO_FALLBACK` | `false` in production; `true` to skip Nimble/Claude during live demo |

## Database setup

Run in Supabase SQL Editor in order:

1. `supabase/migrations/001_schema_rls.sql` — tables + RLS policies
2. `supabase/migrations/002_realtime_alerts.sql` — Realtime publication

## Architecture: core scan pipeline

```
POST /api/scan  (or GET /api/webhooks/cron every 6h)
  → jalankan_scan_untuk_pengguna()        lib/scan/jalankan-scan-untuk-pengguna.ts
    → kumpulkan_konten_nimble()           crawlFDAAlerts() + searchMedicalNews() + crawlPubMed()
    → analyzeForAlerts()                  lib/claude/analyze-for-alerts.ts
      → Claude Sonnet with prompt cache   lib/claude/klien.ts
    → apakah_alert_duplikat()             lib/scan/deduplikasi-alert.ts
    → supabase.from('alerts').insert()    → fires Realtime event → UI updates live
    → kirim_email_alert_kritis()          lib/email/kirim-alert-kritis.ts (if severity=critical)
```

## Key directories

```
app/
  (auth)/login|signup/    Auth pages (split layout — branding left, form right)
  dashboard/
    page.tsx              Main alerts dashboard (KPI cards, chart, filter tabs, list)
    alerts/[id]/          Alert detail page (server component)
    medications/          CRUD medication list
    chat/                 AI Chat with SSE streaming
    settings/             Caregiver invite management
  api/
    scan/                 POST — manual scan trigger
    alerts/               GET list, PATCH read
    chat/                 POST — SSE streaming chat with Nimble tool use
    caregivers/           GET/POST/DELETE caregiver access
    medications/          GET/POST/PATCH/DELETE
    webhooks/cron/        GET — batch scan all users (requires Bearer CRON_SECRET)
    health/db|claude|nimble|email/  Health check endpoints
  caregiver/[token]/      Read-only magic link view (no auth required)

components/               All UI components (naming: bahasa Indonesia snake_case)
lib/
  scan/                   Scan pipeline logic
  claude/                 Claude client, prompt builder, response parser
  nimble/                 Nimble crawl wrappers + response parsers
  email/                  Resend email functions + templates
  supabase/               Client/server/admin Supabase instances

scripts/
  seed-demo.sql           SQL to seed a demo account (replace DEMO_USER_ID)
  uji-manual-hari8-chat.mjs   Full E2E test for chat pipeline
  uji-manual-hari9-email.mjs  Email health check
```

## Naming conventions

- All component function names and variables: **Bahasa Indonesia snake_case**
  - e.g. `buat_klien_supabase_server`, `daftar_alert`, `pengguna_id`
- File names: **kebab-case** in Indonesian
  - e.g. `jalankan-scan-untuk-pengguna.ts`, `daftar-alert-ringkas.tsx`
- API response fields use Indonesian keys: `kesalahan` (error), `obat` (medication), `pengguna` (user)
- English is used only in: JSX text content, comments, README, CLAUDE.md

## Auth pattern

All dashboard API routes use `ambil_pengguna_api()` from `lib/api/ambil-pengguna-api.ts`.
This reads auth from Supabase SSR cookies — **not** Authorization headers.

For tests: use `createServerClient` with cookie store (see `scripts/uji-manual-hari8-chat.mjs`).

## Demo mode

Set `DEMO_FALLBACK=true` in `.env.local` to bypass Nimble + Claude during live demo.
Scan Now will instead insert pre-built alerts from `lib/scan/demo-fallback.ts`.
Supabase Realtime still fires — alerts appear live in browser.

To seed a demo account:
1. Create account at `/signup`
2. Get UUID from Supabase Dashboard → Authentication → Users
3. Replace `GANTI_DENGAN_UUID_AKUN_DEMO` in `scripts/seed-demo.sql`
4. Run in Supabase SQL Editor

## Health checks (verify all services connected)

```bash
curl http://localhost:3001/api/health/db
curl http://localhost:3001/api/health/claude
curl http://localhost:3001/api/health/nimble
curl http://localhost:3001/api/health/email
```

## VPS deployment

```bash
npm run build
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup

# Crontab for background scan every 6h:
# 0 */6 * * * curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/webhooks/cron
```

See Nginx config notes in README.md — `proxy_buffering off` is required for AI Chat SSE streaming.

## What NOT to do

- Never put secrets in `NEXT_PUBLIC_*` env vars
- Never commit `.env.local`, `/docs/`, `.cursor/`
- Never add `Co-Authored-By:` to commit messages (pre-push hook enforces this)
- Never skip the `CRON_SECRET` auth check in `/api/webhooks/cron`
- Do not change medication safety thresholds without understanding the confidence scoring in `lib/claude/konstanta.ts`

## E2E test

```bash
# Full pipeline test (requires running dev server + real credentials)
UJI_MANUAL_EMAIL=your@email.com UJI_MANUAL_PASSWORD=yourpass \
  node --env-file=.env.local scripts/uji-manual-hari8-chat.mjs
```

Expected: `[hari8] Semua langkah otomatis Day 8 lulus.`
