# MediGuard AI — Voice-Over Script (ElevenLabs)

**Total video length:** 2 minutes 55 seconds (175s) · 30 fps · 5250 frames  
**Not** padded to 3:00 — hard cap at 2:55.

Generate **one audio file per part** below, then align in your editor to the timeline starts.

---

## ElevenLabs settings (recommended)

| Setting | Value |
|--------|--------|
| Language | English (US) |
| Voice | Clear explainer (e.g. *Adam*, *Brian*, or *Sarah* — your choice) |
| Model | Eleven Multilingual v2 or Turbo v2.5 |
| Stability | 0.45–0.55 |
| Clarity / Similarity | 0.75 |
| Style exaggeration | 0–0.15 (keep neutral–confident) |
| Speed | 0.95–1.0 (do not rush Scene 03) |

**Tone:** Calm, credible, consumer-health (not clinical diagnosis). Pause briefly at periods.  
**Disclaimer line (Part 11):** Slightly slower, matter-of-fact.

---

## Master timeline (for sync)

| Part | File | Scene | Duration | Starts at |
|------|------|--------|----------|-----------|
| 01 | `01-hook.txt` | Hook | 0:10.5 | 0:00.0 |
| 02 | `02-problem.txt` | Problem | 0:13.5 | 0:10.5 |
| 03 | `03-flow.txt` | Product flow (graph) | 0:59.0 | 0:24.0 |
| 04 | `04-transition.txt` | Transition | 0:06.5 | 1:23.0 |
| 05 | `05-demo-medications.txt` | Demo — medications | 0:11.0 | 1:29.5 |
| 06 | `06-demo-alerts.txt` | Demo — alerts | 0:11.0 | 1:40.5 |
| 07 | `07-demo-recall.txt` | Demo — FDA recall | 0:11.0 | 1:51.5 |
| 08 | `08-demo-chat.txt` | Demo — AI chat | 0:11.0 | 2:02.5 |
| 09 | `09-demo-caregiver.txt` | Demo — caregiver | 0:12.5 | 2:13.5 |
| 10 | `10-differentiation.txt` | Why different | 0:15.5 | 2:26.0 |
| 11 | `11-cta.txt` | CTA + disclaimer | 0:13.5 | 2:41.5 |

**Ends at 2:55.0**

---

## Part 01 — Hook (~10.5s, ~28 words)

See `elevenlabs/01-hook.txt`

---

## Part 02 — Problem (~13.5s, ~34 words)

See `elevenlabs/02-problem.txt`

---

## Part 03 — Product flow (~59s, ~145 words)

Longest section — matches the animated node graph. Speak steadily; brief pauses when the graph branches.

See `elevenlabs/03-flow.txt`

---

## Part 04 — Transition (~6.5s, ~18 words)

See `elevenlabs/04-transition.txt`

---

## Part 05 — Demo: Medications (~11s, ~28 words)

See `elevenlabs/05-demo-medications.txt`

---

## Part 06 — Demo: Alerts (~11s, ~28 words)

See `elevenlabs/06-demo-alerts.txt`

---

## Part 07 — Demo: FDA recall (~11s, ~30 words)

See `elevenlabs/07-demo-recall.txt`

---

## Part 08 — Demo: AI chat (~11s, ~28 words)

See `elevenlabs/08-demo-chat.txt`

---

## Part 09 — Demo: Caregiver (~12.5s, ~32 words)

Covers email invite + magic link view.

See `elevenlabs/09-demo-caregiver.txt`

---

## Part 10 — Differentiation (~15.5s, ~38 words)

See `elevenlabs/10-differentiation.txt`

---

## Part 11 — CTA (~13.5s, ~36 words)

See `elevenlabs/11-cta.txt`

---

## After export

1. Import MP4 from `npm run video:render` and all VO WAV/MP3 into Premiere / DaVinci / CapCut.
2. Place each VO at the **Starts at** time above.
3. Trim VO tails so the mix ends by **2:55** — do not pad to 3:00.
4. Light background music at −18 to −22 dB under VO (optional).

---

## Full script (single read-through)

For reference only — still generate **per-part** in ElevenLabs for easier retakes.

```
[01] MediGuard AI is your personal medication safety intelligence agent. Add your medications once. We monitor FDA alerts, PubMed, and medical news — and only surface what matters to you, with links to primary sources.

[02] The warning was often already public. The patient never heard. In the U.S., adverse drug events are linked to over a hundred thousand deaths a year — while caregivers managing meds at home still lack real-time safety tools.

[03] Here is how the pipeline works. You build one medication list — secured with row-level access. A manual scan or scheduled job triggers the run. Nimble crawls live web sources — FDA safety communications, PubMed, and medical news — in parallel branches. Claude matches crawled content to your list, scores severity, and filters noise. Duplicates collapse to a single alert per source URL. Everything lands in Supabase — then splits: realtime push to your dashboard, email when critical, and a read-only link for family. End to end, under sixty seconds.

[04] You have seen the flow. Now see it in the real product.

[05] On the medications page, you manage the list we monitor — generic and brand names — once.

[06] On the dashboard, alerts arrive live over Supabase Realtime — no refresh. Scan Now runs the full pipeline in under a minute.

[07] This is a real FDA Class Two recall — lot numbers, manufacturer, plain language — matched automatically to a statin on this patient's list.

[08] Ask questions in everyday language. Claude streams answers with live Nimble sources — not a static drug FAQ.

[09] Invite a caregiver by email. They open a magic link — read-only alerts, no account required.

[10] FDA MedWatch blasts generic alerts to everyone. MediGuard sends only what matches your list — confidence-scored and source-linked. Nimble for live web. Claude for relevance. Realtime for the demo moment.

[11] MediGuard AI — real-time safety intelligence for patients and caregivers. Visit mediguard dot adindamochamad dot com. Informational only — not medical advice. Always consult your clinician for decisions.
```
