# MediGuard AI
### Real-Time Medication Safety Intelligence — Powered by AI + Live Web

> DeveloperWeek New York 2026 Hackathon — Strategy: **Overall Winner + Nimble Challenge**

---

## The Problem

- **1.5 million** Americans experience medication errors every year
- **FDA issues 100,000+ drug safety alerts annually** — most patients never see them
- **35% of clinicians ignore routine safety alerts** because they're overwhelmed with irrelevant noise
- **Drug interactions cause 125,000 deaths annually** in the United States
- Caregivers managing elderly parents have **no centralized tool** to stay updated on medication safety in real-time

## The Solution

MediGuard AI is a personal medication safety intelligence platform. You add your medication list once. Our AI agent — powered by Nimble's real-time web intelligence — continuously monitors FDA safety alerts, PubMed research, and medical news, then surfaces **only the alerts relevant to YOUR medications**, explained in plain language.

**We don't send you 100 irrelevant alerts. We send you the one alert that matters to you — before your doctor even knows about it.**

---

## What We Qualify For

| Prize | Why We Qualify |
|-------|---------------|
| **Overall Winner** | Healthcare AI + social impact (consistent winner pattern 2024-2025) |
| **Nimble Challenge ($500 cash)** | Core architecture uses Nimble Search + Extract + Crawl |

---

## Quality & agents (internal)

```bash
npm install   # sekali, bila package lock nanti ditambahkan
npm run agents  # verify + rangka tes; disarankan setiap perubahan materi
```

Lihat [`AGENTS.md`](AGENTS.md) untuk persona **Agen Pengujian** dan **Agen Verifikasi** (Composer / tugas manual). Alur kualitas: [`docs/11-GOVERNANCE.md`](docs/11-GOVERNANCE.md). Prompt kanonik: [`prompts/`](prompts/). Hook proyek memicu pemeriksaan cepat setelah penyuntingan file di Cursor.

**Privasi GitHub (tanpa Co-Author, tanpa .env di remote):**

```bash
npm run setup:git-hooks   # sekali — aktifkan pre-commit / commit-msg / pre-push
```

Detail: [`docs/12-GIT-PRIVASI.md`](docs/12-GIT-PRIVASI.md).

## Docs

| File | Description |
|------|-------------|
| [CONCEPT](docs/01-CONCEPT.md) | Problem deep-dive, solution, user personas |
| [TECH STACK](docs/02-TECH_STACK.md) | Technology choices with rationale |
| [ARCHITECTURE](docs/03-ARCHITECTURE.md) | System design, data flow, component diagram |
| [FEATURES](docs/04-FEATURES.md) | MVP features vs. future roadmap |
| [PITCH](docs/05-PITCH.md) | Hackathon pitch script + judge talking points |
| [TIMELINE](docs/06-TIMELINE.md) | 16-day build plan with milestones |
| [API INTEGRATIONS](docs/07-API_INTEGRATIONS.md) | Nimble + Claude API implementation details |
| [BUSINESS MODEL](docs/08-BUSINESS_MODEL.md) | Startup feasibility, revenue model, market size |

---

## Quick Start (for build phase)

```bash
# Clone & install
git clone https://github.com/yourteam/mediaguard-ai
cd mediaguard-ai
npm install

# Environment
cp .env.example .env.local
# Fill: ANTHROPIC_API_KEY, NIMBLE_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, RESEND_API_KEY

# Dev server
npm run dev
```

---

## Team

Built for DeveloperWeek New York 2026 Hackathon
Submission deadline: June 10, 2026
