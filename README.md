<div align="center">

# MediGuard AI

### Real-time medication safety intelligence — personalized to your prescriptions

**DeveloperWeek New York 2026** · Nimble Challenge + Overall track

[![Nimble](https://img.shields.io/badge/Powered%20by-Nimble%20Web%20Intel-0d9488?style=for-the-badge)](https://www.nimbleway.com/)
[![Claude](https://img.shields.io/badge/AI-Anthropic%20Claude-d97706?style=for-the-badge)](https://www.anthropic.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)

*Not a diagnosis tool. A patient-facing safety layer between public FDA data and the people who need it.*

[Problem](#-the-problem) · [Solution](#-the-solution) · [How it works](#-how-it-works) · [Features](#-features) · [Tech stack](#-tech-stack) · [Quick start](#-quick-start)

</div>

---

## The problem

Every year, **1.5 million Americans** are harmed by medication errors. The FDA publishes **100,000+** drug safety signals annually — but patients receive **zero** proactive, personalized alerts.

- **35%** of clinicians ignore routine safety alerts (alert fatigue from irrelevant noise)
- **125,000** deaths annually linked to adverse drug events
- **53 million** unpaid caregivers manage prescriptions with no safety tooling

> The information exists. It never reaches the right person at the right time.

---

## The solution

MediGuard AI is a personal medication safety intelligence agent. Add your medications once — MediGuard monitors FDA communications, PubMed studies, and medical news in real time, then delivers only the alerts that are relevant to *your* specific list, in plain language, with links directly to the source.

| Legacy tools | MediGuard AI |
|---|---|
| Static drug database (months stale) | **Live web** via Nimble crawl |
| All FDA alerts → everyone | **AI-filtered** to your medication list |
| Provider-only clinical decision support | **Patient + caregiver** facing |
| Medical jargon | **Plain language** + verifiable source URLs |

---

## How it works

```
Nimble crawls FDA.gov / PubMed / DailyMed / medical news
         ↓
Claude matches findings to your medication list
    → scores severity (0–1 confidence)
    → suppresses alerts below 0.75 threshold
    → deduplicates across sources
         ↓
Supabase stores alerts + fires Realtime event
         ↓
Dashboard updates live  +  Critical alert → email (Resend)
```

Scans run on-demand (Scan Now) and automatically every 6 hours via cron.

---

## Features

| Feature | Description |
|---|---|
| **Medication profile** | Add/edit/delete medications with brand name, generic, dosage, and condition note |
| **Live scan** | On-demand Nimble crawl → Claude analysis → alert storage in one pipeline |
| **Alert dashboard** | Severity-coded cards (Critical / Warning / Info) with real-time Supabase push |
| **Filter + stats** | Filter by severity, unread count badge, KPI summary row, scan history |
| **Alert detail page** | Dedicated URL per alert — severity rationale, action items, source link |
| **AI Chat** | Ask questions about your medications; Claude answers with live Nimble sources and streaming response |
| **Email notifications** | Critical alerts trigger an immediate Resend email to the patient |
| **Caregiver sharing** | Invite a family member or doctor — they get a read-only magic link, no account needed |
| **Onboarding flow** | Step-by-step guidance for first-time users |
| **Scan fallback** | `DEMO_FALLBACK=true` bypasses Nimble for zero-risk live demos |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, Recharts, Sonner |
| Database + Auth | Supabase (PostgreSQL + Row Level Security + Realtime) |
| Web intelligence | **Nimble API** (Extract, Search, Crawl) |
| AI | **Anthropic Claude Sonnet** (prompt caching, tool use, SSE streaming) |
| Email | Resend + React Email |
| Hosting | VPS (PM2 + Nginx) or Vercel |

---

## Quick start

### Prerequisites

- Node.js 18+
- Supabase project ([free tier](https://supabase.com))
- Nimble API key ([nimbleway.com](https://www.nimbleway.com))
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))
- Resend API key ([resend.com](https://resend.com)) — for email notifications

### Setup

```bash
git clone https://github.com/adindamochamad/mediaguard-ai.git
cd mediaguard-ai
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

```
ANTHROPIC_API_KEY=
NIMBLE_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3001
CRON_SECRET=your-random-secret
```

Run the database migrations in your Supabase SQL Editor:

```bash
# Run in order:
supabase/migrations/001_schema_rls.sql
supabase/migrations/002_realtime_alerts.sql
```

Start the dev server:

```bash
npm run dev
# → http://localhost:3001
```

Verify all services are connected:

```bash
curl http://localhost:3001/api/health/db
curl http://localhost:3001/api/health/nimble
curl http://localhost:3001/api/health/claude
curl http://localhost:3001/api/health/email
```

### Deploying to VPS

```bash
npm run build
pm2 start ecosystem.config.js --env production

# Background scan every 6 hours:
crontab -e
# add: 0 */6 * * * curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" https://yourdomain.com/api/webhooks/cron
```

Configure Nginx to proxy port 3001 and terminate SSL (Let's Encrypt recommended).

---

## Demo

| Step | Action |
|---|---|
| 1 | Sign up → add medications (e.g. Metformin, Lisinopril, Warfarin) |
| 2 | Click **Scan Now** — live FDA + PubMed crawl via Nimble |
| 3 | Alerts appear on dashboard in real time (Supabase Realtime) |
| 4 | Click any alert → severity rationale, action items, direct FDA source link |
| 5 | Open **AI Chat** → ask a question → Claude streams an answer with citations |
| 6 | Invite a caregiver → they receive a read-only link via email |

---

## Disclaimer

MediGuard aggregates **public** safety information from FDA.gov, PubMed, and DailyMed in consumer-friendly language. It is **not** medical advice, diagnosis, or treatment. Always consult your physician or pharmacist before changing any medication.

---

<div align="center">

Built by **Adinda Panca Mochamad** for DeveloperWeek NYC 2026

*MediGuard AI — The one alert that matters to you.*

</div>
