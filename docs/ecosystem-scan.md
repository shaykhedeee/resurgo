# 🚀 Resurgo.life — Full End-to-End Product Scan & Ecosystem Analysis

*Conducted: May 20, 2026*

---

## 1. COMPLETE SITE ARCHITECTURE MAPPED

```
resurgo.life
├── / (Homepage) — 3 chunks of content, terminal UI, live demo, stats counter
├── /features — 12 modules: Goal System, Habit Builder, AI Coaching, Focus Engine,
│               Health Suite, Gamification, Integrations + FAQ
├── /billing — Pricing page (Free, Pro $9.99/mo, Pro Yearly $7.99/mo, Lifetime $89)
├── /sign-up — Auth (via Clerk) × 2 flows (free / lifetime)
├── /sign-in — Auth (via Clerk) × N redirect_url variants
├── /dashboard — [Auth wall] Main app
├── /templates — 28 goal templates across 7 categories
│   ├── Fitness (5): 5K, Lose 20lbs, Gym Habit, Half Marathon, 4 more
│   ├── Wellness (4): Morning Routine, Burnout, Sleep, Screen Time
│   ├── Finance (4): Emergency Fund, Budget, Debt, Investing
│   ├── Career (4): Promotion, Side Project, LinkedIn, Remote Job
│   ├── Learning (4): Spanish, Code, Books, Certification
│   ├── Creativity (3): Book, Newsletter, Podcast
│   ├── Productivity (3): Deep Work, Inbox, Weekly Planning
│   └── Health (3): Quit Smoking, Stress Recovery, Blood Pressure
├── /compare — Hub page linking 15 comparison micro-pages
│   ├── /best-app-for-indie-founders — [Auth wall] BOFU landing page
│   ├── /compare/resurgo-vs-ticktick
│   ├── /compare/resurgo-vs-notion
│   ├── /compare/resurgo-vs-habitica
│   ├── /compare/resurgo-vs-todoist
│   ├── /compare/resurgo-vs-streaks
│   ├── /compare/resurgo-vs-habitify
│   ├── /compare/resurgo-vs-reclaim
│   ├── /compare/resurgo-vs-things3
│   ├── /compare/resurgo-vs-anydo
│   ├── /compare/resurgo-vs-trello
│   ├── /compare/resurgo-vs-fabulous
│   ├── /compare/resurgo-vs-finch
│   ├── /compare/resurgo-vs-routinery
│   ├── /compare/resurgo-vs-motion
│   └── /compare/resurgo-vs-akiflow
├── /download — Android APK + iOS PWA instructions
├── /roadmap — Public roadmap (NOW / NEXT / LATER)
├── /changelog — 6 versions logged (v1.0.0 → v1.4.0)
├── /adhd — [Auth wall] ADHD mode page
└── [NO /blog — NO content marketing exists]
```

---

## 2. TECH STACK

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js (React) | SSR + static pages |
| Backend | Convex | Realtime DB, serverless functions, file storage |
| Auth | Clerk | SOC 2 Type II, supports social login |
| Payments | Dodo Payments | Merchant of Record, handles VAT/tax |
| Food DB | OpenFoodFacts API | 2M+ products |
| AI Coaches | Custom LLM pipeline | 5 distinct personalities with action capabilities |
| PWA | Service Worker / Web Manifest | Works offline, push notifications |
| APK | WebView wrapper | Same codebase, distributed via GitHub |
| CI/CD | GitHub | github.com/shaykhedeee/resurgo |
| Updates | In-app + Changelog | v1.4.0 as of Feb 2026 |

---

## 3. CRITICAL GAPS FOUND (That I Will Fill)

### Gap #1: NO BLOG EXISTS
Zero blog content means zero organic search traffic from informational queries. 
- People search: "how to build a habit that sticks", "ADHD productivity tips", "goal decomposition methods"
- These searches drive 500M+ monthly impressions globally
- Every competitor (Fabulous, Habitica, Finch) has a blog
- **Fix:** SEO blog posts that teach + naturally showcase Resurgo

### Gap #2: ADHD PAGE IS BEHIND AUTH WALL
The `/adhd` page redirects to sign-in. This is a massive missed opportunity:
- ADHD is one of your strongest differentiators
- 5-8% of the global population has ADHD
- People searching for ADHD productivity tools are HIGH intent
- Google can't index the page behind auth
- **Fix:** Make the ADHD page public with no auth wall. Let Google find it. Let Reddit link to it.

### Gap #3: "BEST APP FOR INDIE FOUNDERS" IS BEHIND AUTH WALL
Same problem — `/best-app-for-indie-founders` is behind sign-in.
- This should be a public SEO landing page
- **Fix:** Move auth to after the content, not before it

### Gap #4: NO PUBLIC-FACING TOOL / FUNNEL
There's no standalone tool that non-users can experience without signing up.
- The homepage demo is great but it's ephemeral (no save, no share)
- **Fix:** Build a standalone micro-tool

### Gap #5: NO SOCIAL VIRAL LOOP
No shareable cards, no streak sharing, no "look what I achieved" moments.
- Duolingo grew to 500M users partly through shareable streak cards
- **Fix:** Shareable progress cards

### Gap #6: COMPARISON PAGES ARE THIN
The comparison pages are good but they're template-like. They need:
- Real data from actual users who switched
- More specific feature callouts
- Better internal linking

### Gap #7: PRICING INCONSISTENCY
Structured data says "$4.99/mo Pro" but the live page says "$9.99/mo Pro".
Also the homepage says "$9.99/mo" while the billing page says the same. The structured data may be outdated.
- **Fix:** Audit and update structured data

### Gap #8: NO CALENDAR INTEGRATION
Noted on roadmap as "planned" but it's a major adoption blocker.
- People live in Google Calendar / Outlook
- Without calendar sync, Resurgo is a "second brain" they have to check separately
- **Fix:** Prioritize Google Calendar 2-way sync

---

## 4. COMPETITIVE POSITIONING (REAL)

After examining 15+ comparison pages, here's where Resurgo truly wins and loses:

| Domain | Resurgo | Best Competitor | Gap |
|--------|---------|----------------|-----|
| Habit tracking | ✅ Strong (XP, streaks, stacking) | Habitica (RPG) | Comparable |
| AI Goal Planning | ✅✅ Strongest | Motion (auto-scheduling) | Clear win |
| AI Coaching | ✅✅✅ UNIQUE | Nobody has 5 distinct coaches | Moatsville |
| ADHD Mode | ✅✅ Strong | Tiimo (visual schedules) | Comparable |
| Nutrition | ✅ Good | MyFitnessPal | MFP has bigger DB |
| Fitness | ✅ Good | Fitbod | Fitbod stronger for workouts |
| Gamification | ✅ Good (no leaderboards) | Habitica (RPG quests) | Different philosophy |
| Calendar sync | ❌ Missing | Motion, Reclaim | LOSING |
| App Store presence | ❌ PWA only | Everyone has native apps | LOSING |
| Public API | ⚠️ Pro-only | Todoist (free API) | LOSING for ecosystem |
| Free tier | ✅✅ Very generous | Finch, Habitica | Clear win |
| Brand reach | ❌ Near-zero | Notion (100M users) | Long road ahead |

---

## 5. WHAT I'LL BUILD NOW

### A. 2 Deeply Useful Blog Posts (not generic)
1. **"How to Turn Any Big Goal Into Daily Actions"** — teaches the decomposition method, shows Resurgo as the shortcut
2. **"Why Most Productivity Systems Fail ADHD Brains"** — neuroscience-backed, leads naturally to ADHD mode

### B. 1 SaaS Ecosystem App Idea (with full spec)
**"GoalScan"** — The public goal decomposition sandbox that feeds into Resurgo