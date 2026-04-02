# RESURGO — MASTER LAUNCH BLUEPRINT
> The ULTIMATE reference document. Every task, every decision, every system — in one place.
> Consolidates: astepforword.md, levelgrow.md, userflow-and-retention.md, CONTENT-AND-ADS-PLAYBOOK-2026.md, COMPETITIVE-ANALYSIS.md, PRODUCT_TRUTH.md, BRAND_VOICE.md, MARKETING-STRATEGY.md
> Status: Living document. Update as tasks complete.

---

## TABLE OF CONTENTS
1. [Product Truth (Canonical Reference)](#1-product-truth)
2. [What's Already Built](#2-whats-already-built)
3. [What Needs Building — Prioritized Backlog](#3-prioritized-backlog)
4. [Onboarding & First-Win Flow](#4-onboarding--first-win-flow)
5. [Progressive Disclosure System](#5-progressive-disclosure)
6. [AI Coach Enhancement Plan](#6-ai-coach-enhancement)
7. [Landing Page & Marketing Pages](#7-landing--marketing-pages)
8. [SEO / AEO / GEO Content Strategy](#8-seo--aeo--geo)
9. [Email Marketing System](#9-email-marketing)
10. [Paid Ads Strategy](#10-paid-ads)
11. [Mobile APK & Desktop Spec](#11-mobile--desktop)
12. [API / MCP / Integrations Platform](#12-api--integrations)
13. [Analytics & Tracking Stack](#13-analytics)
14. [Design System & UI Audit](#14-design-system)
15. [Code Cleanup & Architecture](#15-code-cleanup)
16. [Retention & Anti-Churn System](#16-retention)
17. [Gamification System](#17-gamification)
18. [Competitor Intelligence](#18-competitors)
19. [Brand Voice Quick-Reference](#19-brand-voice)
20. [Free Tools Stack](#20-free-tools)
21. [10-Week Execution Timeline](#21-execution-timeline)
22. [North Star Metrics & KPIs](#22-metrics)
23. [Launch Checklist](#23-launch-checklist)

---

## 1. PRODUCT TRUTH

**Positioning:** Resurgo is the Execution OS for ambitious solo operators — turning brain dumps into daily action, habits, and momentum.

### Plans & Pricing (CANONICAL — never deviate)
| Feature | Free | Pro ($4.99/mo) | Pro Yearly ($29.99/yr) | Lifetime ($49.99) |
|---|---|---|---|---|
| Goals | 3 | Unlimited | Unlimited | Unlimited |
| Tasks | Unlimited | Unlimited | Unlimited | Unlimited |
| Habits/day | 5 | Unlimited | Unlimited | Unlimited |
| AI messages/day | 10 | Unlimited | Unlimited | Unlimited |
| Coaches available | Marcus + Titan | All 5 | All 5 | All 5 |
| Vision board panels | 3 | Unlimited | Unlimited | Unlimited |
| API access | Read-only | Full | Full | Full |
| Focus sessions | All modes | All modes | All modes | All modes |
| Priority support | No | Yes | Yes | Yes |

### Coach Roster (EXACTLY 5)
| Coach | Persona | Focus |
|---|---|---|
| **Marcus** | Stoic Strategist | Deep work, mental clarity, discipline |
| **Titan** | High-Performance Coach | Physical performance, energy, output |
| **Aurora** | Wellness Guide | Sleep, recovery, emotional balance |
| **Phoenix** | Comeback Specialist | Resilience, burnout recovery, restart |
| **Nexus** | Systems Builder | Habits, routines, automation, efficiency |

**CRITICAL:** Code currently shows 8 coaches (adding SAGE, NOVA, ORACLE, NEXUS as premium). PRODUCT_TRUTH says exactly 5 with no premium gate except Marcus + Titan on free. **Decision needed: align code to 5 coaches OR update PRODUCT_TRUTH to 8.** Current recommendation: Keep 5 on landing/marketing (clean messaging), but keep ORACLE + NEXUS in-app as Pro-only bonus (underpromise, overdeliver).

### Tech Stack
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS v3
- Database: Convex (real-time, serverless)
- Auth: Clerk (hobby tier, 50k users)
- Billing: Dodo Payments (3 products created)
- AI: Groq (Llama 3.3 70B primary) → Cerebras → Gemini → Groq 8B fallback
- Images: HuggingFace (FLUX.1-schnell → SDXL → SD v1.5)
- Analytics: GA4 (G-F1VLMSS8FB) + GTM (GTM-KWTBH8SB)
- Hosting: Vercel
- Domain: resurgo.life

---

## 2. WHAT'S ALREADY BUILT

### Core Features (✅ Live)
- [x] Brain Dump Engine
- [x] AI Goal Decomposition (goals → milestones → tasks)
- [x] Habit Tracking + Streaks + Streak Freeze
- [x] Focus Sessions (Pomodoro / Deep Work / Flowtime)
- [x] 8 AI Coaches (MARCUS, AURORA, TITAN, SAGE, PHOENIX, NOVA, ORACLE, NEXUS)
- [x] Multi-provider AI cascade (Groq → Cerebras → Gemini → fallback)
- [x] Vision Board Generator (HuggingFace FLUX.1-schnell primary)
- [x] Daily Check-ins (morning + evening)
- [x] Weekly Reviews
- [x] Gamification (XP / Levels / Badges)
- [x] Wellness Tracking (mood, sleep, energy, nutrition)
- [x] Budget Tracker
- [x] Telegram Bot Integration
- [x] Scratch Notes
- [x] Wishlist
- [x] Referral System
- [x] Progressive Disclosure Dashboard (Armory)
- [x] Deep Scan Protocol (onboarding archetype detection)
- [x] Emergency Mode (overwhelm protection)
- [x] Distress Detection (safety-first AI responses)
- [x] Mobile Dashboard (4-tab bottom nav + AI arc FAB)
- [x] Widget Grid (dashboard customization)
- [x] Adaptive Difficulty Widget
- [x] Weather Widget
- [x] Cookie Consent
- [x] Calorie/Nutrition Tracker

### Marketing & SEO (✅ Live)
- [x] Landing Page V2 (terminal aesthetic, 12 features, pricing, testimonials)
- [x] 39 blog posts (verified complete, 184KB)
- [x] 5 niche landing pages (ADHD, night-owl-developer, student, solopreneur, fitness)
- [x] Features page
- [x] Pricing page
- [x] About page
- [x] Compare pages framework
- [x] Marketing header/footer
- [x] Lead capture system (API + Convex storage)
- [x] Email capture components
- [x] Exit Intent popup
- [x] Sticky CTA
- [x] UTM tracking + marketing analytics
- [x] A/B experiment framework
- [x] Social proof component
- [x] Product showcase component
- [x] Interactive demo carousel
- [x] MarketingPageBeacon (analytics)
- [x] PromoCodeBanner
- [x] Social links configured

### Billing (✅ Live)
- [x] Dodo Payments integration
- [x] 3 products: Pro Monthly ($4.99), Pro Yearly ($29.99), Lifetime ($49.99)
- [x] Checkout button component
- [x] Customer portal
- [x] Subscription management card
- [x] Billing page with full comparison matrix
- [x] Dodo webhook handler

### API (✅ Live)
- [x] REST API v1 — 4 routes: /tasks, /habits, /goals, /today
- [x] API key authentication helper
- [x] Coach chat API route (multi-provider cascade)
- [x] Onboarding archetype detection API
- [x] Vision board suggest-prompt API
- [x] Leads capture API

### Onboarding (✅ Live)
- [x] Premium onboarding flow (6-step wizard)
- [x] Deep onboarding (comprehensive profiling)
- [x] Brain Dump onboarding (quick entry)
- [x] Archetype detection (AI-powered)
- [x] DeepScanProtocol component

---

## 3. PRIORITIZED BACKLOG

### P0 — SHIP BEFORE LAUNCH (Critical Path)

#### 3.1 Coach Count Consistency Fix
- **Problem:** PRODUCT_TRUTH says 5. Code has 8. Landing page says "8 Specialized AI Coaches." Billing page says "5 Core AI Coaches + Premium Personas."
- **Action:** Decide canonical count. Update PRODUCT_TRUTH, landing page, billing page, features page, coach page to match.
- **Files:** `src/components/LandingPageV2.tsx`, `src/app/billing/page.tsx`, `src/app/(marketing)/features/page.tsx`, `src/app/(dashboard)/coach/page.tsx`, `docs/PRODUCT_TRUTH.md`

#### 3.2 Pricing Consistency Fix
- **Problem:** PRODUCT_TRUTH says Pro $4.99/mo. userflow-and-retention.md mentions $9/mo. Some copy references $199 lifetime (should be $49.99).
- **Action:** Audit all pricing references. Canonical: Free / $4.99 mo / $29.99 yr / $49.99 lifetime.
- **Files:** All marketing pages, billing page, FAQ, email templates

#### 3.3 Onboarding Flow Polish
- **Problem:** Multiple onboarding components exist (Onboarding.tsx, DeepOnboarding.tsx, onboarding/page.tsx). Which is the entry? Need clarity.
- **Action:** Ensure one clear happy path: Signup → Brain Dump → AI Reflection → Today View (first win in <5 min). Hide alternatives behind progressive disclosure.
- **Target:** 60%+ activation rate (first task completed)

#### 3.4 Landing Page Simplification
- **Problem:** Too many sections, information overload. Current hero mentions "8 coaches" inconsistently. 
- **Action:** Reduce to essential sections: Hero → Problem/Solution → 6 Key Features (not 12) → Social Proof → Pricing → CTA. Terminal theme preserved.
- **Key principle:** One clear CTA per viewport. "Dump your chaos" button prominent.

#### 3.5 Starter Mode Enforcement
- **Problem:** Dashboard shows everything at once. New users see full Armory immediately.
- **Action:** Default new users to Starter Mode: Today View only (3 tasks, 1-2 habits). Library/Armory unlocks after Day 1 or opt-in. "Builder Mode" after Day 3. "Power Mode" after Day 7 or manual unlock.
- **UI:** Subtle banner: "You're in Starter Mode. Library unlocks after Day 1."

### P1 — LAUNCH WEEK PRIORITIES

#### 3.6 Daily Retention Loop (Automated)
| Time | Trigger | Action |
|---|---|---|
| Morning (8am user TZ) | Push/email | "Today's 3 tasks ready, operator." |
| Midday (12pm) | In-app banner | "Start a 30min focus?" |
| Evening (7pm) | In-app nudge | "2-min review: what shipped?" |
| Weekly (Sunday 6pm) | Email + in-app | "AI Momentum Report ready" |

#### 3.7 Churn Risk Scoring
| Signal | Weight | Action |
|---|---|---|
| No login 3+ days | High | Email: "Your plan is waiting. No pressure." |
| 0 tasks completed 5 days | Critical | In-app: "Stuck? Let's simplify." + Emergency Mode offer |
| Only using 1 feature | Medium | Tooltip: "Try Focus Mode?" |
| Upgrade attempt → cancel | High | Modal: "What's blocking you?" + pause option |

#### 3.8 Pause Subscription Option
- Add "Pause 1 month" / "Pause 3 months" to cancellation flow
- 44% of cancellers would pause instead if option available
- **File:** Create/update cancellation flow in billing page

#### 3.9 Analytics Event Tracking
Events to track (via GTM + GA4):
- `signup_complete` — Clerk registration
- `onboarding_complete` — Finished onboarding
- `first_task_created` — Activation signal
- `first_task_completed` — Core activation
- `first_habit_logged` — Habit activation
- `brain_dump_submitted` — Feature adoption
- `coach_message_sent` — AI engagement
- `upgrade_clicked` — Intent signal
- `upgrade_completed` — Revenue event
- `emergency_mode_activated` — Distress signal

### P2 — POST-LAUNCH (Weeks 2-4)

#### 3.10 Email Marketing System
- Platform: Listmonk (self-hosted, free) OR Brevo (free tier: 300/day)
- 7-email welcome sequence (content in CONTENT-AND-ADS-PLAYBOOK-2026.md)
- 3-email inactivity sequence ("Signal Lost")
- Weekly "Operator's Dispatch" newsletter
- **See Section 9 for full email specs**

#### 3.11 Content Publishing Sprint
Publish in order (from CONTENT-AND-ADS-PLAYBOOK-2026.md):
1. "What Is a Life OS?" — informational, featured snippet candidate
2. "I Used an AI Life Coach for 90 Days" — personal essay, GEO citation bait
3. "Habitica vs Resurgo" — comparison, transactional intent
4. "12 Best Habit Tracker Apps 2026" — listicle, commercial intent
5. "Science of Habit Formation" — authority piece, backlink magnet

#### 3.12 Directory Submissions
- Product Hunt (waitlist → launch day)
- G2, Capterra, AlternativeTo profiles
- There's An AI For That, Futurepedia
- r/Resurgo subreddit
- Google Search Console setup
- r/productivity value posts (not promo)

### P3 — GROWTH PHASE (Weeks 5-10)

#### 3.13 Google Calendar 2-Way Sync
- Google Calendar API (free, OAuth)
- Resurgo → Calendar: Focus blocks appear on calendar
- Calendar → Resurgo: Events trigger AI prep suggestions

#### 3.14 API Key Management UI
- User generates personal API key in Settings
- Rate limits tied to plan (Free: 2k/mo, Pro: 50k/mo)
- Usage dashboard: "API Usage: 1.2k / 2k calls"

#### 3.15 MCP Server
- 6 tools: list_today, add_task, add_habit, plan_day, emergency_simplify, get_vision_board
- Node.js wrapper around REST API
- Config for Claude/Cursor integration

#### 3.16 VS Code Extension
- "Today" panel in sidebar
- Quick add task from editor
- Brain dump from command palette

#### 3.17 Content Automation Pipeline
- n8n workflow: Generate draft → Edit → Publish to blog → Push to Buffer
- Weekly content calendar (platform-specific)

#### 3.18 Health Connect / HealthKit Integration
- Import sleep, steps, heart rate
- Auto-adjust daily plan based on energy signals

#### 3.19 Paid Ads Launch
- Meta: $20-50/day, 4 audience segments (habit users, productivity switchers, self-improvement, ADHD/wellness)
- Google: $25-40/day, brand defense + competitor conquesting + category intent
- **See Section 10 for full ad specs**

#### 3.20 Mobile APK (React Native / Expo)
- Home screen widget: Today View (3 tasks + streak)
- Geo-tagged task reminders
- Personality-driven push notifications (Duolingo-style from coaches)
- **See Section 11 for full mobile spec**

---

## 4. ONBOARDING & FIRST-WIN FLOW

### The Perfect 4-Screen Sequence

**Screen 1: Boot (10 sec)**
```
$ RESURGO.OS v2026 BOOTING...
[===     ] Calibrating chaos tolerance...
> Welcome to Resurgo, [Name].
> 60 seconds from your first execution plan.

[Quick chips: energy level, focus area]
[Button: Continue →]
```

**Screen 2: Brain Dump (60-90 sec)**
```
> Dump everything on your mind. AI handles the rest.

[Large monospace textarea]
Placeholder: "What are you trying to accomplish? What's breaking?"

[Optional context chips: High energy, Low energy, Chaotic schedule]
[Button: Generate My Plan]
```

**Screen 3: AI Reflection (15 sec)**
```
> Processing... analyzing input...
> Here's what I heard:
  - Main goal: [extracted]
  - Blocker: [extracted]
  - Energy: [detected]
  - Mode: [Starter/Builder/Power]

[Looks right →] [Edit]
```

**Screen 4: Today View (Immediate Win)**
```
> Your Day 1 Plan Ready.

TODAY (3 tasks max):
[  ] [Primary task from brain dump] [+50 XP]
[  ] [Secondary task] [+30 XP]
[  ] Log today's win [+50 XP]

HABITS:
[  ] Ship log (daily)

[Ask Coach] [Start Focus] [Emergency Mode]
[Banner: "You're in Starter Mode. Library unlocks after Day 1."]
```

### Key Metrics
- Time from signup → first task complete: **< 5 minutes**
- Activation rate target: **60%+**
- Day-1 return rate target: **60%+**

---

## 5. PROGRESSIVE DISCLOSURE

### Mode System
| Mode | Unlocks | Visible Modules |
|---|---|---|
| **Starter** (Default) | Day 0 | Today View, 3 tasks, 1-2 habits, 1 coach, Brain Dump |
| **Builder** | Day 3 or opt-in | + Goals panel, Focus Sessions, Weekly Review, 2+ coaches |
| **Power** | Day 7 or opt-in | + Full Armory, Analytics, Nutrition, Budget, All coaches, API |

### Module Pin System
- Users can "pin" modules to their dashboard
- Hidden modules have subtle "+" indicators
- Never remove access — always additive
- Anti-overwhelm modal: If user adds 10+ items → "Whoa! Want Emergency Mode?"

### Dashboard Schema Addition (Convex)
```typescript
// In users table:
dashboardMode: v.optional(v.union(v.literal('starter'), v.literal('builder'), v.literal('power'))),
modulePins: v.optional(v.array(v.string())),
dashboardModeUnlocked: v.optional(v.string()), // ISO date when mode was unlocked
```

---

## 6. AI COACH ENHANCEMENT

### Current State
- 8 coaches with distinct personas
- Multi-provider AI cascade (Groq → Cerebras → Gemini → Groq 8B)
- Action-capable: can create tasks, goals, habits from chat
- Context-aware: reads user's real data
- Distress detection with safety-first responses

### Enhancement Plan

#### 6.1 Coach Memory System
```typescript
// New Convex table: coach_memory
coachMemory: defineTable({
  userId: v.id('users'),
  coachId: v.string(), // MARCUS, TITAN, etc.
  memoryType: v.union(v.literal('preference'), v.literal('pattern'), v.literal('constraint'), v.literal('milestone')),
  content: v.string(), // "User prefers morning workouts" / "Struggles with consistency on Fridays"
  confidence: v.number(), // 0-1
  createdAt: v.number(),
  lastReferencedAt: v.optional(v.number()),
}).index('by_user_coach', ['userId', 'coachId']),
```
- Coaches remember past conversations, preferences, patterns
- Memory persists across sessions
- "Last week you struggled with client emails — here's an adjusted plan"

#### 6.2 Physical Task Support (Titan Coach)
- Workout plan generation with sets/reps/rest
- Nutrition meal plan suggestions
- Sleep optimization protocols
- Energy pattern analysis from check-in data
- Integration with Health Connect (future)

#### 6.3 Multi-Chain AI (Agent-like behavior)
- Coach can chain actions: analyze → plan → create tasks → schedule focus blocks
- Example: "Plan my week" → AI reads goals, checks calendar conflicts, generates 5-day plan with tasks + focus blocks
- Each action logged as ActionCard in chat

#### 6.4 Personality-Driven Notifications
- Each coach has a distinct notification voice
- Marcus: "Your discipline window closes in 2 hours. Execute, operator."
- Aurora: "Sleep data shows you're running a deficit. Today's plan adjusted."
- Titan: "You haven't moved in 4 hours. 20 pushups. Now."
- Phoenix: "Day 3 of your comeback streak. Don't stop now."
- Nexus: "Your morning routine had 90% completion this week. Ready to level up?"

---

## 7. LANDING & MARKETING PAGES

### Current Landing Page Issues
1. **Too many features shown** — 12 features overwhelm; reduce to 6 key differentiators
2. **Coach count inconsistency** — Says "8" in feature card; PRODUCT_TRUTH says 5
3. **Hero CTA not clear enough** — Should be single dominant "Dump Your Chaos" button
4. **Social proof weak** — Need real user quotes (collect from beta users)
5. **Pricing section needs Lifetime anchor** — Show Lifetime first (anchor), then Monthly

### Ideal Landing Page Section Order
1. **Hero** — "Stop planning. Start executing." + one primary CTA
2. **Problem** — "You're using 6 apps and still failing" (pain point)
3. **Solution** — "One AI-powered command center" (3-sentence value prop)
4. **Terminal Demo** — Interactive demo showing brain dump → plan
5. **6 Key Features** — Goal AI, Habits, Focus, Coaching, Wellness, Gamification
6. **How It Works** — 3 steps: Dump → Plan → Execute
7. **Social Proof** — Testimonials + usage stats
8. **Pricing** — 3 tiers with Lifetime as dominant CTA
9. **FAQ** — 5-7 common questions
10. **Final CTA** — "Start free. No credit card."

### Pages That Need Creating
- [ ] `/changelog` — Version history
- [ ] `/roadmap` — Public roadmap (builds community trust)
- [ ] `/security` — Security practices page
- [ ] `/contact` — Contact form
- [ ] `/docs` — API documentation (Swagger/OpenAPI)
- [ ] Comparison pages: `/compare/notion`, `/compare/habitica`, `/compare/todoist`, `/compare/motion`

### Pages That Need Updating
- [ ] `/features` — Align coach count, update feature grid
- [ ] `/pricing` — Verify all numbers match PRODUCT_TRUTH
- [ ] `/about` — Add founder story, mission statement
- [ ] Niche pages — Verify CTAs and pricing references

---

## 8. SEO / AEO / GEO CONTENT STRATEGY

### Tier-1 Keywords (Highest Intent)
| Keyword | Priority | Current Coverage |
|---|---|---|
| ai productivity assistant | P1 | Homepage meta only |
| best habit tracker app 2026 | P1 | Blog post exists |
| adhd productivity app | P1 | Niche page exists |
| ai daily planner | P1 | Weak coverage |
| todoist alternative | P1 | Needs comparison page |
| notion alternative for habits | P1 | Needs comparison page |

### Content Architecture
```
PILLAR PAGES (long-form, 2000+ words)
├── /blog/life-os-guide → "What Is a Life OS?"
├── /blog/habit-formation-science → "Science of Habit Formation"
├── /blog/ai-coaching-90-days → "90 Days with AI Coach"
└── /blog/best-habit-trackers-2026 → "12 Best Habit Trackers"

COMPARISON PAGES (transactional)
├── /compare/habitica → "Habitica vs Resurgo"
├── /compare/notion → "Notion vs Resurgo for Habits"
├── /compare/todoist → "Todoist vs Resurgo"
├── /compare/motion → "Motion vs Resurgo"
└── /compare/ticktick → "TickTick vs Resurgo"

NICHE PAGES (existing, need polish)
├── /niche/adhd-productivity ✅
├── /niche/night-owl-developer ✅
├── /niche/student-exam-prep ✅
├── /niche/solopreneur-ceo ✅
└── /niche/fitness-transformation ✅

AEO PAGES (question-first architecture)
├── /learn/what-is-a-life-os
├── /learn/how-to-build-habits-that-stick
├── /learn/ai-coaching-vs-human-coaching
└── /learn/how-to-stay-consistent
```

### Page Structure Standard (Every Content Page)
1. Direct answer in first 80 words
2. Question-led H2/H3 sections
3. Proof block (data, example, benchmark)
4. Action checklist
5. One conversion CTA
6. Internal links to pillar + product pages

### GEO Signals (AI Engine Optimization)
- Include "Resurgo" in 3+ paragraph subheadings per article
- Use first-person narratives (AI engines cite "real experiences")
- Add citations/research references (highest trust weight)
- Submit to AI directories: There's An AI For That, Futurepedia

---

## 9. EMAIL MARKETING

### Welcome Sequence (7 Emails)
| Day | Subject | Goal |
|---|---|---|
| 0 | "Welcome to Resurgo ⚡ Your first win is 2 min away" | First action (add habit) |
| 2 | "Why most habits die on day 10" | Education + engagement |
| 4 | "The brain dump secret" | Feature discovery |
| 7 | "Your Week 1 momentum report" | Progress celebration |
| 10 | "Meet your AI coaches" | Feature expansion |
| 14 | "You've shipped [X] tasks — what's next?" | Upgrade consideration |
| 21 | "Power Mode unlocked" | Soft upgrade CTA |

### Inactivity Sequence (3 Emails — "Signal Lost")
| Day | Subject | Tone |
|---|---|---|
| 3 inactive | "Your execution plan is waiting" | Gentle reminder |
| 7 inactive | "One task. That's all." | Simplification offer |
| 14 inactive | "We saved your data. Come back anytime." | No pressure, data safety |

### Weekly Newsletter: "The Operator's Dispatch"
- AI-generated weekly insights from user data
- One tip, one tool, one challenge
- Ship log highlights from community
- Terminal-styled email template

---

## 10. PAID ADS

### Meta (Facebook/Instagram) — Starting at $20-50/day
| Segment | Targeting | Creative |
|---|---|---|
| Habit Users | Habitica, Streaks, Fabulous, James Clear interests | Before/after UGC video 30s |
| Productivity Switchers | Notion, Todoist, Trello interests | Screen recording demo |
| Self-Improvement | Tony Robbins, Tim Ferriss interests | Problem-led hook video |
| ADHD/Wellness | ADHD Magazine, Headspace, Calm interests | Clean UI demo, "no overwhelm" |
| Lookalike | 1% LAL from email list (500+ minimum) | Scale winners only |

### Google Ads — Starting at $25-40/day
- Brand defense: $3-5/day (protect "resurgo" queries)
- Competitor conquesting: $15-25/day (habitica alternative, notion alternative)
- Category intent: $25-40/day (ai habit tracker, best habit tracker app)

### Kill Rules
- CPR > $8 after 7 days + $50 spend → kill ad set
- Scale winners at 1.5x budget every 4 days if CPR < $5

### Required Before Spending
- [ ] Track `signup_complete` (Clerk → GTM)
- [ ] Track `upgrade_completed` (Dodo → tag on success page)
- [ ] Track `first_habit_created` (activation event)

---

## 11. MOBILE APK & DESKTOP

### Mobile (React Native / Expo) — P3 Roadmap
**Core Features:**
- Today View widget (home screen)
- 3 tasks + streak counter displayed
- One-tap task completion from widget
- Geo-tagged task reminders (e.g., "Buy groceries" when near store)
- Push notifications from AI coaches (personality-driven, Duolingo-style)
- Offline queue (tasks/habits sync when online)
- Voice brain dump input
- Biometric auth (fingerprint/face)

**Notification Personality Examples:**
- Marcus: "Discipline window closing. Execute or defer — decide now."
- Titan: "Haven't logged movement today. 10 min walk. Go."
- Aurora: "Your evening review is due. 2 minutes of reflection."
- Phoenix: "Streak alive at 14 days. Don't let comfort kill momentum."
- Nexus: "System check: 3/5 habits done. Two more to hit 100%."

**Widget Spec:**
- 4x2 minimum size
- Dark terminal aesthetic
- Shows: Date, top 3 tasks (checkable), streak count, XP
- Tap opens app to Today View
- Updates every 30 minutes

### Desktop (Tauri Wrapper) — P3 Roadmap
- Same PWA wrapped in Tauri for native feel
- System tray icon with quick-add
- Keyboard shortcuts for power users
- Offline mode with sync queue

---

## 12. API / MCP / INTEGRATIONS

### REST API v1 (✅ Exists — needs expansion)
| Endpoint | Method | Status |
|---|---|---|
| `/api/v1/tasks` | GET, POST | ✅ Live |
| `/api/v1/habits` | GET | ✅ Live |
| `/api/v1/goals` | GET | ✅ Live |
| `/api/v1/today` | GET | ✅ Live |
| `/api/v1/brain-dump` | POST | 🔜 Needed |
| `/api/v1/emergency-mode` | POST | 🔜 Needed |
| `/api/v1/webhooks/subscribe` | POST | 🔜 Needed |

### Rate Limits by Plan
| Plan | Reads/month | Writes/month | AI ops/month |
|---|---|---|---|
| Free | 10,000 | 1,000 | 100 |
| Pro | 250,000 | 50,000 | 5,000 |

### MCP Server (6 Tools)
1. `resurgo_list_today` — Get today's plan
2. `resurgo_add_task` — Create a task
3. `resurgo_add_habit` — Create/update a habit
4. `resurgo_plan_day` — Generate/rebuild today's plan
5. `resurgo_emergency_simplify` — Activate Emergency Mode
6. `resurgo_get_vision_board` — Get/regenerate vision board

### Integration Roadmap
| Integration | Priority | API | Cost |
|---|---|---|---|
| Google Calendar 2-way | P1 | Google Calendar API | Free |
| Health Connect/HealthKit | P2 | Android/iOS native | Free |
| GitHub webhooks | P3 | GitHub API | Free |
| Slack bot | P3 | Slack API | Free |
| Email-to-task | P3 | Custom SMTP | Free |

---

## 13. ANALYTICS & TRACKING

### Stack (All Free)
| Tool | Purpose | Status |
|---|---|---|
| GA4 (G-F1VLMSS8FB) | Web analytics | ✅ Live |
| GTM (GTM-KWTBH8SB) | Tag management | ✅ Live |
| Microsoft Clarity | Session replays, heatmaps | 🔜 Add |
| PostHog (free tier) | Product analytics, funnels | 🔜 Add |
| Google Search Console | SEO monitoring | 🔜 Setup |
| Plausible (self-hosted) | Privacy-first analytics | Optional |

### Events to Track (via GTM)
See Section 3.9 for complete event list.

### Key Dashboards Needed
1. **Acquisition:** Signups/day, source breakdown, landing page conversion
2. **Activation:** Time to first task, onboarding completion rate
3. **Engagement:** DAU/MAU, features used, session length
4. **Retention:** Day 1/3/7/30 cohort curves
5. **Revenue:** Conversion rate, MRR, LTV, churn rate

---

## 14. DESIGN SYSTEM & UI AUDIT

### Terminal Theme (Canonical)
| Element | Value |
|---|---|
| Background | Black (#000000) / near-black (#0a0a0a) |
| Primary accent | Orange (#f97316) |
| Success | Green (#22c55e / emerald) |
| Error | Red (#ef4444) |
| Text primary | zinc-100 / zinc-200 |
| Text secondary | zinc-400 / zinc-500 |
| Borders | zinc-800 / zinc-900 |
| Pixel font | Press Start 2P (labels, headings) |
| Terminal font | IBM Plex Mono / VT323 (data, code) |
| Body font | Inter (readable text) |
| Button style | Terminal-style, uppercase, underscores |

### Known UI Issues to Fix
- [ ] **Duplicate features sections** on landing page (overlapping Framework/How-it-works/Capabilities)
- [ ] **Mobile header double-render** — verify fix from last session holds
- [ ] **Pricing inconsistencies** across pages
- [ ] **Coach count inconsistencies** across pages
- [ ] **Blog post placeholder** — verify CHART_PLACEHOLDER leak fix
- [ ] **Large component files** — dashboard page.tsx is massive; consider splitting
- [ ] **Multiple onboarding paths** — clarify primary flow

---

## 15. CODE CLEANUP & ARCHITECTURE

### Files That Need Attention
| File | Issue | Action |
|---|---|---|
| `src/app/(dashboard)/dashboard/page.tsx` | Very large, many responsibilities | Split into sub-components |
| `src/components/LandingPage.tsx` | Old version (V1), likely unused | Verify and remove if redundant |
| `src/components/Onboarding.tsx` | Uses local Zustand store, not Convex | Migrate or deprecate |
| `src/lib/store.ts` | Zustand store — may duplicate Convex data | Audit usage, reduce |
| `src/components/AICoach.tsx` | Uses local AI client, not Convex coach | Verify not conflicting with coach page |
| `src/components/SmartCoach.tsx` | Another coach component | Verify usage, consolidate |

### Architecture Recommendations
1. **Consolidate coach components** — One source of truth for AI coach interaction
2. **Remove unused landing page** — If LandingPageV2 is active, remove LandingPage.tsx
3. **Standardize onboarding** — One primary path through Convex, not Zustand
4. **Split large components** — Dashboard page needs sub-component extraction
5. **Audit dead imports** — Remove unused component imports across the app

---

## 16. RETENTION & ANTI-CHURN

### Daily Habit Loop
| Time | Channel | Message | Psychology |
|---|---|---|---|
| 8am | Push/email | "Today's 3 tasks ready" | Trigger |
| 12pm | In-app | "Focus block available?" | Contextual |
| 7pm | In-app | "2-min review: what shipped?" | Closure |
| Sunday 6pm | Email + app | "Momentum Report ready" | Validation |

### Churn Risk Scoring
| Signal | Risk Level | Automated Response |
|---|---|---|
| No login 3+ days | High | Email: gentle check-in |
| 0 tasks completed 5 days | Critical | In-app: Emergency Mode offer |
| Single feature usage | Medium | Progressive disclosure tooltip |
| Canceled upgrade | High | Pause subscription offer |

### Anti-Overwhelm System
```
IF user doesn't complete any task in 3 days:
  → Modal: "Reduce today to 1 task?" [Yes] [I'm good]

IF user adds 10+ tasks in one day:
  → Modal: "Want Emergency Mode? AI picks top 3."

IF user hasn't logged in 2 days:
  → Email (not pushy): "Your plan is waiting."
```

### Ethical Guardrails
- Usage limits visible: "You've shipped 10 tasks today. Take a break?"
- Emergency Mode always free, always accessible
- Data export available anytime (CSV/PDF)
- No FOMO streaks — XP is progress, not punishment
- Streak freezes available on free tier

---

## 17. GAMIFICATION SYSTEM

### XP Rewards
| Action | XP |
|---|---|
| Complete a task | +10-50 (based on priority) |
| Complete a habit | +20 |
| Brain dump submitted | +10 |
| Focus session completed | +30 |
| Daily check-in | +15 |
| Weekly review completed | +50 |
| Streak milestone | +100 (varies) |

### Level System
- Levels unlock cosmetic features (terminal themes, avatar frames)
- NOT paywalled core features
- Levels provide sense of progress, not gatekeeping

### Streak Philosophy
- Streaks are encouraging, not punishing
- Miss a day? "You're human. Pick up where you left off."
- Streak freeze available (1 free/week, more on Pro)
- Emergency Mode protects streak

---

## 18. COMPETITOR INTELLIGENCE

### Competitive Positioning
| Competitor | Their Strength | Resurgo's Advantage |
|---|---|---|
| **Habitica** | Best gamification (full RPG, guilds) | Real AI coaching (they have zero) |
| **Notion** | Infinite customization | Zero setup needed; AI does it |
| **Todoist** | Best pure task manager | Full life OS (tasks + habits + wellness + AI) |
| **TickTick** | All-in-one + Pomodoro | AI coaching + brain dump + progressive disclosure |
| **Streaks** | Beautiful minimal design | Cross-platform + AI + gamification |
| **Motion** | AI calendar scheduling | Brain dump → execution (not just scheduling) |

### Key Insight: ZERO Competitors Have
1. AI coaching with memory and personality
2. Brain dump → instant execution plan
3. Progressive disclosure (Starter/Builder/Power modes)
4. Emergency Mode for overwhelm
5. Execution OS positioning (not just a tracker)

---

## 19. BRAND VOICE QUICK-REFERENCE

### Core Attributes
| ✅ Do | ❌ Don't |
|---|---|
| Direct, one sentence | Verbose, over-explaining |
| Calm authority | Frantic, guilt-tripping |
| Operator-like | Motivational-poster cheerleading |
| Intelligent | Condescending baby-talk |
| Anti-hype, honest | Buzzword soup, inflated claims |

### Word Preferences
| Use | Avoid |
|---|---|
| Operator | User, customer |
| Execute / Ship / Build | Work on, accomplish |
| System | App, tool |
| Coach | Chatbot, AI helper |
| Momentum | Progress |
| Brain dump | Enter notes |

### Formatting
- Labels: ALL CAPS terminal-style
- CTAs: UPPERCASE with underscores (START_FREE)
- Emoji: Never in formal copy; sparingly in coach messages
- Exclamation marks: Max 1 per page

---

## 20. FREE TOOLS STACK

| Tool | Purpose | Cost |
|---|---|---|
| ChatGPT (free) | Copy drafts, ideation | $0 |
| Gemini | Research, fact-checking | $0 |
| Perplexity | Citation research | $0 |
| Canva (free) | Social graphics | $0 |
| CapCut | Video editing | $0 |
| Buffer (free) | Social scheduling (3 channels) | $0 |
| Brevo (free) | Email marketing (300/day) | $0 |
| Microsoft Clarity | Session replays | $0 |
| Google Analytics 4 | Web analytics | $0 |
| Google Search Console | SEO monitoring | $0 |
| n8n (self-hosted) | Content automation | $0 |
| PostHog (free) | Product analytics | $0 |

---

## 21. 10-WEEK EXECUTION TIMELINE

### Week 1-2: Foundation & Fix
- [ ] Fix coach count consistency across all pages
- [ ] Fix pricing consistency across all pages
- [ ] Polish onboarding flow (4-screen brain dump → first win)
- [ ] Implement Starter Mode default
- [ ] Simplify landing page (reduce to 6 features)
- [ ] Setup Google Search Console
- [ ] Add Microsoft Clarity
- [ ] Audit and remove dead code (LandingPage.tsx, unused components)

### Week 3-4: Retention & Content
- [ ] Build daily retention loop (morning/evening notifications)
- [ ] Implement churn risk scoring
- [ ] Add pause subscription option
- [ ] Publish Article 1: "What Is a Life OS?"
- [ ] Publish Article 2: "90 Days with AI Coach"
- [ ] Submit to Product Hunt waitlist
- [ ] Claim G2, Capterra, AlternativeTo profiles

### Week 5-6: Launch Sprint
- [ ] Product Hunt launch
- [ ] Show HN post
- [ ] Reddit r/productivity value post
- [ ] Publish Article 3: "Habitica vs Resurgo"
- [ ] Start Meta ads (Segment 1, $20/day)
- [ ] Setup email welcome sequence (7 emails)
- [ ] Quora answers for target keywords

### Week 7-8: Growth & Iteration
- [ ] Publish Article 4: "12 Best Habit Trackers 2026"
- [ ] Start Google Search ads ($35/day)
- [ ] Build comparison pages (/compare/notion, /compare/habitica)
- [ ] Outreach to 5 productivity YouTubers
- [ ] First cohort retention analysis
- [ ] Iterate based on activation data

### Week 9-10: Platform Expansion
- [ ] Google Calendar 2-way sync
- [ ] API key management UI
- [ ] MCP server MVP
- [ ] Coach memory system implementation
- [ ] AEO landing pages (/learn/ routes)
- [ ] Indie Hackers build-in-public post

---

## 22. NORTH STAR METRICS & KPIs

### North Star: Daily Tasks + Habits Completed (per active user)
This single metric captures engagement depth, retention signal, and product value.

### Weekly Dashboard
| Category | Metric | Target |
|---|---|---|
| **Acquisition** | Signups/week | 100+ |
| **Activation** | % completing first task | 60%+ |
| **Engagement** | DAU/MAU ratio | 25%+ |
| **Retention** | Day-7 return | 50%+ |
| **Retention** | Day-30 return | 35%+ |
| **Revenue** | Free → Paid conversion | 5-8% |
| **Revenue** | Monthly churn | < 5% |
| **Content** | Pages published/week | 1-2 |
| **SEO** | Avg position (Tier-1 keywords) | Top 20 |

---

## 23. LAUNCH CHECKLIST

### Pre-Launch (Must Complete)
- [ ] All pricing consistent across every page
- [ ] All coach counts consistent
- [ ] Onboarding flow tested end-to-end
- [ ] Starter Mode working
- [ ] Emergency Mode working
- [ ] Dodo Payments checkout tested
- [ ] GA4 + GTM tracking verified
- [ ] 5+ blog posts indexed
- [ ] Social profiles active (Twitter/X, Reddit)
- [ ] Product Hunt page drafted
- [ ] Email welcome sequence ready
- [ ] Google Search Console set up
- [ ] Security page created
- [ ] Privacy policy updated
- [ ] Terms of service updated

### Launch Day
- [ ] Product Hunt submission (Monday, 12:01 AM PST)
- [ ] Show HN post
- [ ] Twitter/X launch thread
- [ ] Reddit r/productivity value post
- [ ] Email to waitlist
- [ ] Start Meta ads (Segment 1)

### Post-Launch (30 Days)
- [ ] Daily community engagement
- [ ] Weekly content publish
- [ ] First paid user celebration
- [ ] Activation rate review + iterate
- [ ] Retention cohort analysis
- [ ] Collect 5+ testimonials
- [ ] Monthly revenue review

---

*This is the LIVING document. Every task goes here. Every decision references here. Update as you ship.*

*Last updated: April 2026 | Owner: Founder*
