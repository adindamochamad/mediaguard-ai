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

Create or use the seeded demo account:

1. Sign up at https://mediguard.adindamochamad.com/signup **or** use pre-seeded account  
2. Run `scripts/seed-demo.sql` in Supabase SQL Editor (replace UUID if needed)  
3. Suggested demo email: *(fill in your demo account email + password before submitting)*

**Production demo mode:** set `DEMO_FALLBACK=true` in server `.env.local` before live presentation so Scan Now inserts realistic alerts instantly (Nimble + Claude still used for AI Chat and health checks).

---

## 3-minute live demo script

| Time | Action | Say |
|------|--------|-----|
| 0:00 | Open dashboard (logged in, 9 meds seeded) | "This patient takes 9 medications. MediGuard already found 9 personalized alerts — not generic FDA spam." |
| 0:20 | Click **critical** Warfarin or Sertraline alert | "Every alert has severity, plain language, and a direct FDA or PubMed link you can verify." |
| 0:45 | Click **Scan now** | "One click triggers Nimble to crawl FDA, PubMed, and medical news — Claude filters to this patient's list." |
| 1:30 | Point at new alert appearing (Realtime) | "Supabase Realtime pushes alerts instantly — no refresh." |
| 1:50 | Open **AI Chat**, ask: "Any FDA warning about Metformin this week?" | "Chat pre-crawls Nimble sources and streams an answer with citations." |
| 2:30 | **Settings** → invite caregiver | "Family members get a read-only magic link — no account needed." |
| 2:50 | Close | "MediGuard — the one alert that matters to you." |

**Backup:** play `video/out/mediaguard-demo.mp4` if WiFi fails.

---

## Pre-submission checklist

```
[ ] Upload video to YouTube (unlisted) → paste URL in Devpost
[ ] Paste live URL: https://mediguard.adindamochamad.com
[ ] Paste GitHub repo link
[ ] Tag Nimble + Overall challenges
[ ] Add demo credentials in Devpost private notes
[ ] Run seed-demo.sql on production Supabase
[ ] Set DEMO_FALLBACK=true on production before stage demo (optional)
[ ] Rehearse 3-min script × 3
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
