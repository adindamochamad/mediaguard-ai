# MediGuard AI — Testing guide (judges & contributors)

Quick path to verify the project without internal `docs/` (local-only in some clones).

---

## Automated (from repo root)

```bash
npm run test              # parsers, Zod alerts, dedup, Nimble timeout resiliensi
npm run build             # TypeScript + Next.js production build
npm run test:polish       # E2E API: signup → meds → scan → alerts → complex chat
```

Requires `.env.local` (copy from `.env.example`) and **`npm run dev`** on port **3001** for `test:polish`.

Hari 8 chat regression:

```bash
node --env-file=.env.local scripts/uji-manual-hari8-chat.mjs
```

---

## Health checks (no login)

```bash
curl http://localhost:3001/api/health/db
curl http://localhost:3001/api/health/nimble
curl http://localhost:3001/api/health/claude?obat=Metformin,Lisinopril
curl http://localhost:3001/api/health/email
```

---

## Manual demo flow (~5 min)

| # | Step | Expected |
|---|------|----------|
| 1 | `/signup` → dashboard | Session works |
| 2 | `/dashboard/medications` → add Metformin | Card appears |
| 3 | `/dashboard` → **Scan Now** | Completes; 0+ alerts; Last scanned updates |
| 4 | Open alert → source link | FDA/PubMed URL opens |
| 5 | `/dashboard/chat` → complex question | SSE stream + Nimble sources panel |
| 6 | `POST /api/scan` twice | Second run dedupes same URL |

Cron (optional):

```bash
curl -s -H "Authorization: Bearer $CRON_SECRET" http://localhost:3001/api/webhooks/cron
```

---

## Edge cases (Day 1–2 polish)

| Case | Expected behavior |
|------|-------------------|
| Nimble timeout | Per-request 20s cap; FDA RSS fallback; 502 if no crawl text at all |
| Unknown drug name | `POST /api/medications` accepts free-text brand (201) |
| Complex medical chat | SSE answer + `meta.sumber` from Nimble |
| No medications | Scan returns message to add meds first |
| `DEMO_FALLBACK=true` | Scan uses cached demo alerts (no live Nimble) |

---

## Sitemap

```bash
curl http://localhost:3001/sitemap.xml
```

Lists `/`, `/login`, `/signup` (from `app/sitemap.ts`).

---

## Screenshots for Devpost

See [`public/screenshots/`](public/screenshots/) — same assets referenced in the README.
