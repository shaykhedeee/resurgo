# Automated Blog Engine

Resurgo now has a scheduled content engine that researches Google Trends and Reddit, generates a quality-gated blog post, stores it in Convex, and exposes published posts through the blog, sitemap, and dynamic article route.

## Endpoint

- `GET /api/blog/generate`
- `POST /api/blog/generate`

Production calls require one of:

- `Authorization: Bearer $CRON_SECRET`
- `x-admin-secret: $ADMIN_SECRET`

Useful parameters:

- `topic`: optional manual topic override.
- `geo`: Google Trends geo, defaults to `US`.
- `publish`: `true` publishes immediately; otherwise the post is saved as draft unless `BLOG_AUTO_PUBLISH=true`.
- `dryRun`: `true` researches and generates without saving.

## Environment

Required:

- `NEXT_PUBLIC_CONVEX_URL`
- `CRON_SECRET`
- `ADMIN_SECRET`

Optional:

- `OPENAI_API_KEY`
- `BLOG_GENERATION_MODEL`, defaults to `gpt-4o-mini`
- `BLOG_AUTO_PUBLISH=true`

## Manual Runs

Dry run:

```bash
curl "https://resurgo.life/api/blog/generate?dryRun=true&topic=indie%20founder%20productivity" \
  -H "x-admin-secret: $ADMIN_SECRET"
```

Publish:

```bash
curl "https://resurgo.life/api/blog/generate?publish=true&topic=AI%20productivity" \
  -H "x-admin-secret: $ADMIN_SECRET"
```

## Quality Gate

Posts are rejected unless they have:

- At least 800 words.
- At least five H2 sections.
- A Reddit questions section.
- A Resurgo product-fit section.
- Source/research signal coverage.

## Cron

`vercel.json` schedules `/api/blog/generate` every Monday and Thursday at 08:00 UTC. Vercel sends `Authorization: Bearer $CRON_SECRET` automatically when `CRON_SECRET` is configured.
