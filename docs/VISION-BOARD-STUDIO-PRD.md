# Vision Board Studio PRD (Premium Conversion Feature)

## Goal

Make Vision Board Studio a **high-desire Pro feature** that:

1. gives users emotional clarity and motivation
2. increases daily engagement
3. converts free users to Pro/Lifetime

---

## Product promise

> Turn your goals into a premium, Pinterest-style visual board with AI-generated scenes, personal affirmations, and optional custom images.

---

## User modes

## Mode A — AI Only

- User goals + profile + archetype generate complete board
- Best for speed

## Mode B — Hybrid Upload (Premium)

- User uploads up to 6 custom images
- System blends uploads with AI generated panels
- Best for personal emotional attachment

---

## Style presets

1. Pinterest Bold
2. Clean Minimal
3. Luxury Editorial
4. Cinematic Dream

Each preset modifies prompt style, composition tone, and visual mood.

---

## Access control

- Free plan: can view teaser + upgrade CTA
- Pro/Lifetime: full generation and regeneration

API-level enforcement required (no client-only gating).

---

## Generation pipeline

1. Read authenticated user + goals
2. Validate plan (must be Pro/Lifetime)
3. Generate board config via AI
4. Apply style preset suffix to each image prompt
5. Generate images using free-provider cascade:
   - Pollinations
   - Hugging Face
   - Gemini fallback
6. If Hybrid mode, merge uploaded images into panel set
7. Save active board to Convex
8. Return board JSON for immediate rendering

---

## Conversion design

Upgrade prompts shown when free user attempts:

- open Vision Board page
- click “Generate Vision Board”

Copy strategy:

- lead with emotional outcome, not technical detail
- show this as a “turning point” feature

CTA:

- Upgrade to Pro
- Secondary: compare plans

---

## Quality standards

Board must look:

- premium
- coherent color direction
- emotionally aligned with user goals
- zero generic stock-feeling outputs

Guardrails:

- no text in generated images
- no low-res or stretched panels
- safe and inclusive prompts

---

## KPI targets

- Vision board page visit → upgrade click rate
- Vision board gate hit → paid conversion (7-day window)
- Pro users who generate board at least once
- D7 retention delta (generated board vs non-generated)

---

## Future upgrades (next iteration)

1. Drag-and-drop panel editor
2. Multi-board collections (career/health/year vision)
3. Scheduled re-generation every 30 days
4. Print/export board variants (desktop/mobile wallpaper)
5. Social share cards + referral watermark links

---

## Launch checklist

- [x] Pro API gate
- [x] Dedicated dashboard route (`/vision-board`)
- [x] Style presets
- [x] Hybrid upload mode
- [x] Regeneration support for paid users
- [ ] Add analytics events for board funnel
- [ ] Add testimonial/social proof section on pricing page
