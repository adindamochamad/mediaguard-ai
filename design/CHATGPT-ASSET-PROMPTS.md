# MediGuard AI — ChatGPT image prompts (brand assets)

Use this file in **ChatGPT** (GPT-4o / DALL·E image generation).  
**Workflow:** generate **Prompt 1** first → download PNG → **upload that file** into ChatGPT for Prompts 2, 3, and 4 so the logo stays identical.

---

## How many images?

| # | File to save | Size | ChatGPT prompt |
|---|----------------|------|----------------|
| 1 | `logo-master-1024.png` | 1024×1024 | **Prompt 1** (canonical logo) |
| 2 | `og-social-1200x630.png` | 1200×630 | **Prompt 2** (+ upload #1) |
| 3 | `hero-background-1920x1080.png` | 1920×1080 | **Prompt 3** (no logo) |
| 4 | `icon-safe-512.png` | 512×512 | **Prompt 4** (+ upload #1) |
| 5–7 | Resize #1 or #4 locally | 180, 192, 32 | No new prompt — use [favicon.io](https://favicon.io) or `sips`/Figma |

**Total: 4 ChatGPT prompts → 4 generated images → 3 extra sizes by resize.**

Place finished files in `public/brand/` (see `design/brand/README.md`).

---

## LOGO LOCK (paste into every prompt that includes the logo)

Copy this block **verbatim**; do not let the model “improve” the mark.

```text
LOGO SPECIFICATION — MUST MATCH EXACTLY:
- Icon mark only: a rounded square (squircle), corner radius approximately 22% of the width.
- Mark background: solid flat teal hex #0D9488, no gradient, no gloss, no 3D.
- Single letter centered in the mark: uppercase "M", color #FFFFFF, bold geometric sans-serif (similar to Inter or SF Pro), optically centered.
- Forbidden: medical cross, caduceus, pill capsule icon, heart rate line, shield shape, gradient fills, drop shadows on the mark, extra letters inside the square.
- Style: minimal modern health-tech SaaS, 2024–2026, flat vector-like clarity.
- If a wide layout allows a wordmark beside the mark: text "MediGuard" in slate #0F172A and " AI" in teal #0D9488, semibold sans-serif — never distort the M square.
```

---

## Prompt 1 — Master logo (generate this first)

**Output:** 1024×1024 PNG, transparent or very light `#f8fafc` background.

```text
Create a square app logo image, 1024x1024 pixels, high resolution, PNG style.

LOGO SPECIFICATION — MUST MATCH EXACTLY:
- Icon mark only: a rounded square (squircle), corner radius approximately 22% of the width.
- Mark background: solid flat teal hex #0D9488, no gradient, no gloss, no 3D.
- Single letter centered in the mark: uppercase "M", color #FFFFFF, bold geometric sans-serif (similar to Inter or SF Pro), optically centered.
- Forbidden: medical cross, caduceus, pill capsule icon, heart rate line, shield shape, gradient fills, drop shadows on the mark, extra letters inside the square.
- Style: minimal modern health-tech SaaS, 2024–2026, flat vector-like clarity.

Composition: the teal M mark centered with generous padding (about 18% margin on each side). Background very light cool gray #F8FAFC. No tagline, no mockup device frame, no watermark text.
```

---

## Prompt 2 — Open Graph / social preview

**Upload:** `logo-master-1024.png` from Prompt 1.  
**Output:** 1200×630 PNG.

```text
I uploaded the exact MediGuard logo. Use ONLY that logo mark — do not redraw or redesign the M square.

Create a social sharing banner, 1200x630 pixels, landscape.

Layout:
- Left third: the uploaded logo at a comfortable size with clear padding.
- Right area: headline text "MediGuard AI" in slate #0F172A, semibold modern sans-serif; subline "Medication safety intelligence with traceable sources" in #64748B, smaller.
- Background: soft light gradient from #F8FAFC to #CCFBF1 (very subtle), optional faint abstract grid or dots at 5% opacity — no photos of people, no hospital stock imagery.

LOGO SPECIFICATION — MUST MATCH EXACTLY:
- Icon mark only: a rounded square (squircle), corner radius approximately 22% of the width.
- Mark background: solid flat teal hex #0D9488, no gradient, no gloss, no 3D.
- Single letter centered in the mark: uppercase "M", color #FFFFFF, bold geometric sans-serif (similar to Inter or SF Pro), optically centered.
- Forbidden: medical cross, caduceus, pill capsule icon, heart rate line, shield shape, gradient fills, drop shadows on the mark, extra letters inside the square.

Professional, minimal, trustworthy health-tech marketing visual.
```

---

## Prompt 3 — Hero background (no logo)

**No logo** in this image — keeps the site hero clean; logo stays in the header component.

**Output:** 1920×1080 PNG (can crop on mobile).

```text
Abstract website hero background, 1920x1080 pixels, no text, no logo, no people.

Palette only: #F8FAFC base, soft blobs or arcs in #CCFBF1 and hints of #0D9488 at low saturation (under 15% opacity). Very subtle grain optional. Feeling: calm, modern, digital health product — not clinical, not dark mode, not neon. Plenty of empty space in the center-left for overlaid HTML text in production.

Flat minimal design, no 3D glass, no purple, no stock photo.
```

---

## Prompt 4 — App icon safe zone (PWA / Apple)

**Upload:** `logo-master-1024.png` from Prompt 1.  
**Output:** 512×512 PNG (resize to 192 and 180 locally).

```text
I uploaded the exact MediGuard logo. Use ONLY that logo mark — do not redraw the M square.

Create an app icon, 512x512 pixels, for iOS/Android.

LOGO SPECIFICATION — MUST MATCH EXACTLY:
- Icon mark only: a rounded square (squircle), corner radius approximately 22% of the width.
- Mark background: solid flat teal hex #0D9488, no gradient, no gloss, no 3D.
- Single letter centered in the mark: uppercase "M", color #FFFFFF, bold geometric sans-serif (similar to Inter or SF Pro), optically centered.
- Forbidden: medical cross, caduceus, pill capsule icon, heart rate line, shield shape, gradient fills, drop shadows on the mark, extra letters inside the square.

Place the uploaded logo smaller than Prompt 1 — about 62% of canvas width — centered on solid background #F8FAFC so iOS rounded corners do not clip the M. No wordmark, no badge text.
```

---

## Optional Prompt 5 — Empty state illustration

Only if you want one extra marketing illustration (medications list empty state).

**Upload:** `logo-master-1024.png` (small, corner watermark size).

```text
I uploaded the exact MediGuard logo. Use the mark only at small scale in the top-left corner; do not alter the M square.

Minimal flat illustration, 800x600 pixels: empty medication list state — simple outline cards or checklist rows in #E2E8F0, one accent element in #0D9488, background #F8FAFC. Friendly but professional. English caption area left blank. No characters, no pills photorealistic.
```

---

## After generation — wire into Next.js

1. Save files to `public/brand/` with names in the table above.
2. Add to `app/layout.tsx` metadata: `icons`, `openGraph.images`.
3. Replace header placeholder `<span>M</span>` with `<Image src="/brand/logo-master-1024.png" ... />` when ready.

---

## Tips for logo consistency in ChatGPT

1. Always **upload Prompt 1 output** for prompts 2 and 4; say “do not redesign.”
2. If the M drifts, reply: **“Regenerate using only the uploaded logo; same teal #0D9488 squircle and white M.”**
3. Do **not** ask for “variation” or “alternative logo” in the same thread.
4. For favicons, resize **Prompt 1 or 4** — do not regenerate at 32×32 in ChatGPT (quality loss).

---

## Color reference card (for any extra prompts)

| Name | Hex |
|------|-----|
| Teal accent | `#0D9488` |
| Teal soft | `#CCFBF1` |
| Slate text | `#0F172A` |
| Muted text | `#64748B` |
| Page bg | `#F8FAFC` |
| Border | `#E2E8F0` |
