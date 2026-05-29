# Resurgo Marketing Execution Brief

Date: 2026-05-28

## What I verified

- The live site at `https://resurgo.life/` is already positioned around AI execution, daily planning, and founder productivity.
- The repo already contains:
  - A public marketing site under `src/app/(marketing)`
  - Blog infrastructure and multiple published SEO articles
  - Comparison pages under `src/app/(marketing)/compare`
  - Lead capture via `src/app/api/leads/capture/route.ts`
  - Marketing analytics components such as `src/components/marketing/EmailCapture.tsx` and `src/components/marketing/MarketingPageBeacon.tsx`
- The existing SEO plan in `docs/marketing/09-SEO-AEO-PLAN.md` explicitly called for these pages:
  - `/ai-brain-dump-planner`
  - `/goal-tracker-app`
  - `/habit-tracker-goals`

## Concrete gap found

Those three keyword pages were planned in docs but not implemented in `src/app/(marketing)`, which meant the SEO plan had no matching live routes for those intents.

## What I shipped

I added three new marketing pages:

- `src/app/(marketing)/ai-brain-dump-planner/page.tsx`
- `src/app/(marketing)/goal-tracker-app/page.tsx`
- `src/app/(marketing)/habit-tracker-goals/page.tsx`

Each page includes:

- SEO metadata and canonical URL
- Messaging aligned to the current product truth
- CTA paths into signup/pricing/comparison content
- Inline lead capture
- Marketing event beacon for page analytics

I also corrected several static marketing claims so they match the canonical product truth:

- Free plan copy now reflects `3 active goals`, `5 habits/day`, `10 AI messages/day`, and `2 coaches`
- Comparison CTA copy no longer claims unlimited habits on the free plan
- Niche pages no longer invent extra coach personas outside the canonical 5-coach roster
- Shared footer now links to the three new SEO pages for stronger internal linking

## Why these pages matter

- They convert an internal SEO plan into real crawlable assets.
- They target high-intent queries already named in the repo strategy docs.
- They fit the existing funnel instead of creating a disconnected campaign.

## Recommended next execution order

1. Link these pages from the main marketing site and relevant blog posts.
2. Add them to sitemap and internal navigation if not already auto-discovered.
3. Publish one matching blog article or comparison update per page.
4. Use Search Console and analytics to track impressions, CTR, and signup conversion by route.

## Validation

- `npm.cmd run typecheck` passed after the page additions.
