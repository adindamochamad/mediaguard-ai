# DeveloperWeek NYC 2026 — Submission Pack

**Deadline:** June 10, 2026 @ 10:00 AM EDT  
**Live app:** https://mediguard.adindamochamad.com  
**Repo:** https://github.com/adindamochamad/mediaguard-ai  
**Video:** `video/out/mediaguard-demo.mp4` (upload to YouTube unlisted, then paste URL in Devpost)

---

## Devpost — copy/paste fields

### Project name
MediGuard AI

### Tagline (≤60 chars)
Personal medication safety alerts from live FDA data

### Elevator pitch (short description)
MediGuard AI monitors FDA.gov, PubMed, and medical news for safety signals that match *your* medication list — then delivers plain-language alerts with primary source links. Built for patients and caregivers, not clinicians.

### About the project (long description)

**The problem**  
1.5 million Americans are harmed by medication errors every year. The FDA publishes 100,000+ drug safety signals annually, but patients receive zero proactive, personalized alerts. Caregivers managing prescriptions for family members have no safety tooling at all.

**Our solution**  
MediGuard AI is a personal medication safety intelligence agent. Add your medications once. The system crawls live web sources via **Nimble**, analyzes findings with **Anthropic Claude**, and surfaces only alerts relevant to your list — with confidence ≥ 0.75, deduplication, and plain-language summaries.

**How we use Nimble (Nimble Challenge)**  
- **Extract** — crawl FDA Drug Safety Communications (`crawlFDAAlerts`) with RSS fallback  
- **Search** — per-medication medical news queries (`searchMedicalNews`)  
- **Extract** — PubMed search results per drug (`crawlPubMed`)  
- Pipeline runs on-demand (Scan Now) and every 6 hours via cron webhook

**Agentic architecture**  
MediGuard behaves as an autonomous safety agent, not a static database lookup:
1. **Perceive** — Nimble Extract + Search gathers fresh FDA, PubMed, and medical news content for each user's medication profile  
2. **Reason** — Claude Sonnet scores severity, filters by confidence threshold, and writes patient-friendly action steps  
3. **Act** — alerts persist to Supabase (Realtime push to dashboard), critical alerts trigger Resend email, caregivers get read-only magic links  
4. **Remember** — deduplication index prevents alert fatigue from repeated sources  

The AI Chat agent pre-crawls Nimble sources for the user's medications before answering safety questions, streaming responses with cited URLs.

**Tech stack**  
Next.js 14 · Supabase (Auth + RLS + Realtime) · Nimble API · Claude Sonnet · Resend · PM2 + Nginx

**Business model (feasibility)**  
- **B2C:** $9/mo subscription for unlimited scans + caregiver seats  
- **B2B:** white-label for senior living facilities and home-health agencies (53M unpaid US caregivers)  
- **Distribution:** pharmacy partnerships, employer wellness programs  

**Disclaimer:** Not medical advice. Always consult your physician or pharmacist.

### Built with
Next.js, TypeScript, Supabase, Nimble API, Anthropic Claude, Resend, Tailwind CSS, Recharts

### Challenges entered
- [x] Nimble — Build an Agentic App That Sees the Live Web
- [x] DeveloperWeek Overall

---

## Demo credentials (private note to judges)

**Copy-paste ke Devpost:** isi penuh ada di `scripts/teks-devpost-private-notes.txt`.

| Field | Value |
|-------|-------|
| **Email** | `demo@mediguard.adindamochamad.com` |
| **Password** | `MediGuardDemo2026!` |
| **Pre-seeded** | 9 medications + 9 alerts (run `scripts/seed-demo.sql` if dashboard is empty) |

**Login page hint:** set `NEXT_PUBLIC_DEMO_JUDGE_HINT=true`, `NEXT_PUBLIC_DEMO_JUDGE_EMAIL`, and `NEXT_PUBLIC_DEMO_JUDGE_PASSWORD` on production — judges see email + password on `/login` and the form is pre-filled.

---

## Hybrid demo strategy (Scan cached · Chat live Nimble)

Full presenter script: [`docs/demo-hybrid-juri.md`](docs/demo-hybrid-juri.md).

**Production env before stage:**

```
DEMO_FALLBACK=true
NEXT_PUBLIC_DEMO_JUDGE_HINT=true
NEXT_PUBLIC_DEMO_JUDGE_EMAIL=demo@mediguard.adindamochamad.com
```

| Moment | Mode | What judges see |
|--------|------|-----------------|
| **Scan Now** | `DEMO_FALLBACK` | ~1s, Realtime push, scan history with realistic source counts |
| **AI Chat** | Live Nimble + Claude tools | Tool status lines + "Nimble sources fetched" panel |
| **Alert detail** | Pre-seeded or demo insert | Real FDA / PubMed URLs |

**Say on stage when clicking Scan Now:**  
*"Production scans crawl live FDA, PubMed, and medical news in about sixty seconds. For this demo we use cached alerts so Wi‑Fi doesn't block us — live Nimble is in AI Chat."*

---

## 3-minute live demo script (hybrid)

| Time | Action | Say |
|------|--------|-----|
| 0:00 | Login as demo account → Dashboard | "Nine medications, nine personalized alerts — not generic FDA spam." |
| 0:10 | Point at amber hybrid banner | "Scan is cached for speed; chat uses live Nimble." |
| 0:25 | Open **critical** Warfarin or Sertraline alert | "Plain language, severity, verifiable source URL." |
| 0:45 | **Scan Now** | "One click — Realtime push in about a second. Production runs full Nimble crawl." |
| 1:10 | Scan history row | "Sources crawled, new alerts, duration — audit trail." |
| 1:25 | **AI Chat** → click **Live Nimble demo** suggested question | "Claude calls Nimble FDA Extract, Search, and PubMed before answering." |
| 1:50 | Tool status + sources panel | "These URLs were just fetched from the live web." |
| 2:20 | Settings → caregiver (optional) | "Read-only magic link for family — no account." |
| 2:45 | Close | "MediGuard — the one alert that matters to you." |

**Backup:** YouTube video (Devpost) if WiFi fails.

---

## Pre-submission checklist

```
[x] Upload video to YouTube (unlisted) → paste URL in Devpost
[x] Paste live URL: https://mediguard.adindamochamad.com
[x] Paste GitHub repo link
[ ] Tag Nimble + Overall challenges
[ ] Add demo credentials in Devpost private notes (copy scripts/teks-devpost-private-notes.txt — requires your Devpost login)
[ ] Run seed-demo.sql on production Supabase — or: npm run setup:demo-juri
[ ] Set DEMO_FALLBACK=true + NEXT_PUBLIC_DEMO_JUDGE_HINT=true on production before stage
[ ] Rehearse hybrid 3-min script × 3 (docs/demo-hybrid-juri.md)
[ ] npm run verify && npm run test — both exit 0
[ ] Health checks all green:
      curl https://mediguard.adindamochamad.com/api/health/db
      curl https://mediguard.adindamochamad.com/api/health/nimble
      curl https://mediguard.adindamochamad.com/api/health/claude
      curl https://mediguard.adindamochamad.com/api/health/email
```

---

## Cron (background agent — optional but strong for feasibility)

On the VPS, add to crontab:

```bash
0 */6 * * * curl -s -H "Authorization: Bearer YOUR_CRON_SECRET" https://mediguard.adindamochamad.com/api/webhooks/cron
```

Screenshot `scan_logs` table in Supabase after one run for Devpost "try it out" section.

---

## Q&A prep (likely judge questions)

**Q: How is this different from Drugs.com or WebMD?**  
A: Those use static databases updated monthly. We crawl *live* FDA and PubMed via Nimble on every scan, then AI-filter to *your* list only.

**Q: Is this medical advice?**  
A: No — we aggregate public FDA/PubMed data in plain language and always say "consult your doctor." Confidence threshold 0.75 suppresses noise.

**Q: Why Nimble?**  
A: FDA.gov and PubMed require reliable Extract + Search at scale. Nimble handles anti-bot, JS rendering fallback, and structured crawl — we focus on the safety intelligence layer.

**Q: What's next after the hackathon?**  
A: Caregiver B2B for home-health agencies, pharmacy white-label, and Claude tool-use loop so chat can trigger Nimble crawls on demand per question.
