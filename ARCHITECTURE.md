# MediGuard AI — Architecture

Public architecture reference for judges and contributors. The README includes Mermaid diagrams and a narrative deep dive; this document adds data-flow detail and file-level map.

---

## System overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER INTERFACES                               │
├──────────────────┬──────────────────┬───────────────────────────────┤
│   Web App        │   Email Alerts   │   Caregiver magic link          │
│   (Next.js)      │   (Resend)       │   /caregiver/[token]            │
└──────┬───────────┴────────┬─────────┴───────────────────────────────┘
       │                    │
       ▼                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     NEXT.JS API LAYER (port 3001)                     │
│  /api/medications  /api/alerts  /api/chat  /api/scan  /api/webhooks  │
└──────┬─────────────────┬──────────────────────────────────────────────┘
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────────────────────────────────────────┐
│  Supabase   │   │              AI PIPELINE (server-only keys)       │
│  PostgreSQL │   │  Nimble (FDA / PubMed / news) → Claude → dedup   │
│  + Auth     │   │  → INSERT alerts → Realtime + Resend (critical)  │
│  + Realtime │   └──────────────────────────────────────────────────┘
└─────────────┘
```

---

## Alert generation pipeline

**Entry:** `POST /api/scan` (manual) or `GET /api/webhooks/cron` (batch, `Bearer CRON_SECRET`).

**Core:** `lib/scan/jalankan-scan-untuk-pengguna.ts`

| Step | Action |
|------|--------|
| 1 | Load `medications` for `user_id` (RLS on user routes; service role on cron) |
| 2 | **Nimble** — `crawlFDAAlerts()` (20s timeout; RSS fallback on failure), per-drug `searchMedicalNews` + `crawlPubMed` (parallel, max 9 drugs) |
| 3 | Merge crawl text → `siapkan_konten_crawl_untuk_analisis()` |
| 4 | **Claude** — `analyzeForAlerts()` → JSON alerts |
| 5 | Filter — relevance, Zod schema, `confidence ≥ 0.75` (`lib/konstanta.ts`) |
| 6 | **Dedup** — normalized `source_url` per user (`lib/scan/deduplikasi-alert.ts`) |
| 7 | `INSERT` into `alerts`; `INSERT` into `scan_logs` |
| 8 | Supabase Realtime notifies dashboard; critical → `kirim_email_alert_kritis()` |

If crawl produces empty content after fallbacks → API **502** with explicit error (no fake success).

**Demo path:** `DEMO_FALLBACK=true` → `lib/scan/demo-fallback.ts` inserts cached alerts without Nimble/Claude.

---

## AI Chat pipeline

**Entry:** `POST /api/chat` (SSE).

| Step | Action |
|------|--------|
| 1 | Auth via Supabase session |
| 2 | Load user medication names |
| 3 | Prefetch Nimble — FDA slice + medical search per drug (failures are non-fatal) |
| 4 | Build prompt with live source shortlist + safety policy |
| 5 | Stream Claude tokens as `text/event-stream`; first events include `meta.sumber` |

Chat does not write alerts; it reuses Nimble for **fresh citations** in conversation.

---

## Data model (Supabase)

| Table | Purpose |
|-------|---------|
| `medications` | User drug profile (brand, generic, dosage) |
| `alerts` | Generated safety items + `source_url`, `ai_confidence`, severity |
| `scan_logs` | Audit: sources crawled, alerts created, `duration_ms` |
| `caregiver_access` | Invite tokens for read-only shared view |

RLS policies in `supabase/migrations/001_schema_rls.sql` — users only access their own rows.

Realtime: `supabase/migrations/002_realtime_alerts.sql` publishes `INSERT` on `alerts`.

---

## Security

| Concern | Solution |
|---------|----------|
| Authentication | Supabase Auth (cookie JWT via SSR) |
| Data isolation | Row Level Security on all user tables |
| API keys | Nimble, Anthropic, Resend, `SERVICE_ROLE` — server routes only |
| Cron | `CRON_SECRET` on `/api/webhooks/cron` |
| Consumer safety copy | No diagnosis / no direct stop-start medication orders in prompts |

---

## Key files

```
app/api/scan/route.ts              POST manual scan
app/api/webhooks/cron/route.ts     GET batch scan
app/api/chat/route.ts              SSE chat
lib/scan/jalankan-scan-untuk-pengguna.ts
lib/nimble.ts                      FDA + RSS fallback
lib/claude/analyze-for-alerts.ts
lib/scan/deduplikasi-alert.ts
lib/validasi-alert.ts              Zod + confidence filter
middleware.ts                      Protect /dashboard
```

---

## Performance & resilience

| Topic | Approach |
|-------|----------|
| Nimble latency | Parallel per-drug crawls; 20s timeout per call |
| FDA outage | Public FDA RSS fallback inside `crawlFDAAlerts()` |
| Claude cost | Prompt caching on analysis path; chat streams tokens |
| UI responsiveness | Scan runs server-side; estimated progress bar + Realtime push |
| Duplicate alerts | URL normalization before insert |
| Scan API ceiling | `BATAS_WAKTU_SCAN_MANUAL_MS` = 120s (`POST /api/scan`) |
| Rate limit | 5 manual scans / hour per user (`scan_logs`) |

---

## Expected performance

Observed ranges from dev/staging scans (Nimble + Claude live, not `DEMO_FALLBACK`). API credit estimates are **order-of-magnitude** for judge Q&A — not billing guarantees.

| Scenario | Medications | Scan duration | API credits used (est.) |
|----------|-------------|---------------|-------------------------|
| Light | 2 meds | 30–45s | ~$0.02 |
| Medium | 5 meds | 45–90s | ~$0.05 |
| Heavy | 9 meds (pipeline cap) | 90–150s | ~$0.08 |

**Optimizations:**

- **Parallel Nimble crawls** — FDA + per-drug news/PubMed via `Promise.all` (roughly **60% faster** than sequential per-drug requests).
- **Claude prompt caching** — system prompt on `analyzeForAlerts()` marked ephemeral cache (**~30% cost reduction** on repeated scans).
- **20s timeout per Nimble request** — `TIMEOUT_NIMBLE_MS` in `lib/scan/jalankan-scan-untuk-pengguna.ts`; failed branches skip without blocking other drugs.
- **Retry with backoff** — `jalankan_dengan_retry()` in `lib/nimble.ts` (2 attempts) reduces false RSS fallbacks on transient network blips.

**Observability:** structured logs — grep `[SCAN]` in server output (`status=ok|failed|skipped`, `meds`, `sources`, `alerts`, `duration_ms`).

---

## Why live web beats static DB

| Static (WebMD-style) | MediGuard |
|----------------------|-----------|
| Database updated periodically | Nimble reads FDA/PubMed/news **now** |
| Same page for everyone | Claude filters to **your** medication list |
| Keyword match | Severity + confidence scoring |
| No source in alert | Every alert aims at a **primary URL** |

This combination is the product moat for the Nimble + Claude hackathon story.
