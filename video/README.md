# MediGuard AI — Demo Video (Remotion)

**Duration: 2:55 max** (175s · 5250 frames @ 30fps) — intentionally **not** padded to 3:00.

## Commands

```bash
cd video
npm install
npm run dev          # Remotion Studio
npm run render       # → out/mediaguard-demo.mp4
```

From repo root: `npm run video:dev` · `npm run video:render`

## Voice-over (ElevenLabs)

Per-scene scripts: **`scripts/elevenlabs/*.txt`** (11 parts)  
Master doc + timeline: **`scripts/vo-elevenlabs.md`**

## Duration config (single source)

Edit **`src/constants/durasi-video.ts`** — total must stay ≤ `DURASI_MAKS_FRAME` (5250).

| Scene | Seconds |
|-------|---------|
| Hook | 10.5 |
| Problem | 13.5 |
| Flow (graph) | 59.0 |
| Transition | 6.5 |
| Demo ×4 | 11.0 each |
| Caregiver | 12.5 |
| Differentiation | 15.5 |
| CTA | 13.5 |
| **Total** | **175.0** |

## Edit graph layout

`src/constants/graf-alur.ts`
