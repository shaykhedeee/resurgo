# RESURGO — MASTER LAUNCH PLAN
> Single source of all tasks, integrations, upgrades, and fixes needed before launch.
> **Last updated:** 2026-06-26 — doc consolidation pass (5 files merged/deleted)
> Synthesized from: PRODUCT_TRUTH.md, BRAND_VOICE.md, SAAS-FUNDAMENTALS.md, levelgrow.md, userflow-and-retention.md, MARKETING-STRATEGY.md, competitor research, SaaS metrics research, codebase deep scan.

---

## TABLE OF CONTENTS

1. [Critical Conflicts to Resolve](#1-critical-conflicts-to-resolve)
2. [Code Cleanup & Dead Code](#2-code-cleanup--dead-code)
3. [Coach System — Canonical Decision](#3-coach-system--canonical-decision)
4. [Onboarding & First Win](#4-onboarding--first-win)
5. [Dashboard & UX Polish](#5-dashboard--ux-polish)
6. [AI Coach Enhancement](#6-ai-coach-enhancement)
7. [Landing Page Simplification](#7-landing-page-simplification)
8. [Retention & Engagement Systems](#8-retention--engagement-systems)
9. [Billing & Upsell Flows](#9-billing--upsell-flows)
10. [Mobile & PWA](#10-mobile--pwa)
11. [Analytics & Metrics](#11-analytics--metrics)
12. [SEO / AEO / Content Pages](#12-seo--aeo--content-pages)
13. [Email Automation](#13-email-automation)
14. [Marketing Pre-Launch](#14-marketing-pre-launch)
15. [Design Consistency Audit](#15-design-consistency-audit)
16. [API & Integrations](#16-api--integrations)
17. [Security & Performance](#17-security--performance)
18. [Launch Day Checklist](#18-launch-day-checklist)
19. [Post-Launch Week 1](#19-post-launch-week-1)
20. [Priority Matrix](#20-priority-matrix)
21. [New Tasks (from doc audit)](#21-new-tasks-from-doc-audit)

---

## 1. CRITICAL CONFLICTS TO RESOLVE

> These MUST be resolved before any other work. They create inconsistencies across the product.

### 1.1 Coach Count Conflict
| Source | Says |
|---|---|
| `PRODUCT_TRUTH.md` | 5 coaches (Marcus, Titan, Aurora, Phoenix, Nexus) |
| `coach/page.tsx` (code) | 8 coaches (adds SAGE, NOVA, ORACLE) |
| `billing/plans.ts` (code) | "5 core AI coaches" on free plan |
| Various strategy docs | 5, 6, or 8 variously |

**DECISION REQUIRED:**

**Option A — Keep 5 (align with PRODUCT_TRUTH.md):**
- Remove SAGE, NOVA, ORACLE from code
- Simpler, cleaner, easier to market
- Every coach has a clear lane

**Option B — Keep 8 (align with code):**
- Update PRODUCT_TRUTH.md to 8 coaches
- Free: Marcus + Titan (2)
- Pro: Marcus + Titan + Aurora + Phoenix + Nexus + Sage + Nova (7)
- Premium (Yearly/Lifetime only): ORACLE + NEXUS (2)

**Recommended: Option A with one modification:**
- Keep 5 coaches as canonical
- ORACLE becomes a "premium mode" of any coach (not a separate coach)
- SAGE and NOVA content absorbed into existing coaches (SAGE → NEXUS for financial systems, NOVA → AURORA for creative wellness)
- Result: Clean story, strong differentiation per coach

### Tasks:
- [x] **DECIDE**: 5 coaches — committed (Option A)
- [x] Update `coach/page.tsx` to match decision
- [x] Update `billing/plans.ts` features array to match
- [x] Update PRODUCT_TRUTH.md if decision ≠ 5 (already correct)
- [x] Update landing page coach section
- [x] Update onboarding coach selection screen
- [x] Grep entire codebase for coach references and align (llms.txt, blog, knowledge bases fixed)

### 1.2 Free Plan Coach Access Conflict
| Source | Free plan coaches |
|---|---|
| PRODUCT_TRUTH.md | 2 (Marcus + Titan) |
| billing/plans.ts code | "5 core AI coaches (Marcus, Titan, Aurora, Phoenix, Nexus)" |
| coach/page.tsx code | 6 coaches marked `premium: false` |

**DECISION REQUIRED:**
- PRODUCT_TRUTH says 2 free coaches
- Code says 5 or 6 free coaches
- **Recommendation:** Free = 2 coaches (Marcus + Titan). It creates a clear upgrade path.

### Tasks:
- [x] Update `billing/plans.ts` free tier to say "2 AI Coaches (Marcus + Titan)"
- [x] Update `coach/page.tsx` to gate Aurora, Phoenix, Nexus behind Pro
- [x] Update onboarding to only show Marcus + Titan for free users

### 1.3 Pricing Alignment
**PRODUCT_TRUTH.md is canonical. Code matches. Docs do not.**

| Where | Monthly | Yearly | Lifetime |
|---|---|---|---|
| PRODUCT_TRUTH.md ✅ | $4.99 | $29.99 | $49.99 |
| billing/plans.ts ✅ | $4.99 | $29.99 | $49.99 |
| astepforword.md ❌ | $9 | — | $199 |
| MARKETING-STRATEGY.md ❌ | — | — | $149 |

### Tasks:
- [x] Update astepforword.md pricing references to $4.99/$29.99/$49.99
- [x] Update MARKETING-STRATEGY.md pricing references
- [x] Search all .md files for "$9", "$149", "$199" and correct (README, llms.txt, knowledge bases, tests, webhook all fixed)

### 1.4 App Name
Some docs still reference "ASCEND" instead of "Resurgo".

### Tasks:
- [x] Grep for "ASCEND" across entire codebase and docs
- [x] Replace with "Resurgo" everywhere (MARKETING-STRATEGY.md, README.md, twitter-image.svg — CSS tokens/localStorage keys kept for backward compat)

---

## 2. CODE CLEANUP & DEAD CODE

### 2.1 Dead Landing Page
- `src/components/LandingPage.tsx` — OLD V1 landing page, not referenced
- `src/components/LandingPageV2.tsx` — ACTIVE landing page

### Tasks:
- [x] Delete `src/components/LandingPage.tsx` (already deleted in prior session)
- [ ] Rename `LandingPageV2.tsx` → `LandingPage.tsx` (optional, cosmetic)
- [x] Update any imports referencing old landing page (only LandingPageV2 exists, imported in page.tsx)

### 2.2 SmartCoach vs Coach Confusion
- `src/components/SmartCoach.tsx` — Atomic Habits wisdom widget (separate component)
- `src/app/(dashboard)/coach/page.tsx` — Full AI coaching system

### Tasks:
- [x] Rename `SmartCoach.tsx` → `AtomicHabitsWidget.tsx` to prevent confusion
- [ ] Or integrate its wisdom into the main coach responses and delete it

### 2.3 General Code Hygiene
- [x] Remove any unused imports across dashboard components (Zap from MorningCheckIn, setEnergy prefixed in EveningDebrief)
- [x] Check for console.log statements in production code (removed 4 debug-only, kept 10 infrastructure)
- [x] Verify all TODO/FIXME comments are addressed or tracked (none found in src/)

---

## 3. COACH SYSTEM — CANONICAL DECISION

> Once conflicts in Section 1 are resolved, this section defines the final coach architecture.

### 3.1 Coach Roster (per PRODUCT_TRUTH.md — 5 coaches)

| Coach | ID | Focus | Free? | Voice signature |
|---|---|---|---|---|
| **Marcus** | MARCUS | Deep work, mental clarity, discipline | ✅ Free | Stoic, precise, one-sentence directives |
| **Titan** | TITAN | Physical performance, energy, output | ✅ Free | Direct, athletic, action-oriented |
| **Aurora** | AURORA | Sleep, recovery, emotional balance | Pro | Warm, observant, systems-aware |
| **Phoenix** | PHOENIX | Resilience, burnout recovery, restart | Pro | Empathetic, data-driven, rebuilding |
| **Nexus** | NEXUS | Habits, routines, automation, efficiency | Pro | Systematic, environmental design focus |

### 3.2 AI Cascade (current — working well)
```
Groq Llama-3.3-70b-versatile → Cerebras Llama-3.3-70b → Gemini 2.0 Flash → Groq Llama-3.1-8b
```

### 3.3 Coach Enhancement Plan

#### Phase 1 — Context Depth (Pre-Launch)
- [ ] Coach reads full user context before responding: habits, goals, tasks, streaks, mood, sleep, energy
- [ ] Coach references specific data: "Your sleep avg is 5.8hr this week — that's why focus dropped"
- [ ] Coach remembers conversation history (last 20 messages minimum)

#### Phase 2 — Action Capability (Launch)
- [ ] Coach can create tasks, habits, goals on user's behalf
- [ ] Coach can set reminders and due dates
- [ ] Coach can suggest habit adjustments based on completion rates
- [ ] "Marcus, plan my day" → generates today's task list from existing goals

#### Phase 3 — Multi-Chain Intelligence (Post-Launch)
- [ ] Fast responses: Groq 8b for quick acknowledgments
- [ ] Deep analysis: Groq 70b for goal decomposition, weekly reviews
- [ ] Creative: Gemini for vision board prompts, motivational reframes
- [ ] Each coach selects the best model tier based on query complexity

### 3.4 ADHD-Specific Coach Behaviors
- [ ] "Just Start" mode: AI picks one task, sets 5-min timer, says "Just start. I'll be right here."
- [ ] Micro-celebrations after every completion (not just streaks)
- [ ] Time estimate tags on all tasks: "This takes ~5 minutes"
- [ ] Body doubling: Coach "stays present" during focus sessions with periodic check-ins
- [ ] Forgiveness-first language: "Missed yesterday? That's one day. Show me today."
- [ ] Novelty injection: Rotate tips, change greeting style, suggest dashboard widget changes

---

## 4. ONBOARDING & FIRST WIN

> **Target: User completes 1 meaningful action within 5 minutes of signup.**

### 4.1 Current Onboarding: Deep Scan Protocol
- User answers questions about schedule, preferences, goals
- System generates initial setup

### 4.2 Problems
- Too many questions before value delivery
- No clear "first win" moment
- No segmented path (general user vs ADHD vs fitness vs founder)

### 4.3 Improved Flow

**Step 1 — Name + 1 Pick (30 seconds)**
```
"What's your name?"
"Pick your primary focus:"
  [ ] Build better habits
  [ ] Hit a specific goal
  [ ] Get organized (ADHD-friendly)
  [ ] Level up physically
```

**Step 2 — Quick Win (60 seconds)**
Based on selection:
- Habits: "Add your first habit. Make it tiny. Example: 'Drink water after waking up'"
- Goal: "What's one goal you want to hit? Just one line."
- ADHD: "Brain dump everything on your mind right now. We'll sort it."
- Fitness: "What's your daily move? Walk, gym, stretch? Add it."

**Step 3 — Celebration (10 seconds)**
- XP awarded, streak started, confetti animation
- "You're in. Check back tomorrow to keep your streak."

**Step 4 — Optional Deep Scan (later)**
- Shown after Day 1 return: "Want to customize your experience? Take a 2-minute scan."
- DO NOT block the main flow with Deep Scan

### Tasks:
- [x] Restructure onboarding to 3-step quick flow (Welcome → Focus combined → Ready)
- [ ] Move Deep Scan to optional day-2 prompt
- [ ] Add segmentation question (habits / goal / ADHD / fitness)
- [x] Implement first-win celebration (XP +50 badge + confetti particles on Ready step)
- [ ] Track activation metric: "completed first action within first session"

---

## 5. DASHBOARD & UX POLISH

### 5.1 Today View (Desktop)
Current state: Good. Has morning check-in, evening debrief, widgets, tutorials, quick-add.

### Tasks:
- [ ] Ensure progressive disclosure: new users see minimal widgets
- [ ] Widget recommendations based on usage (show fitness widget after 3 workout habits)
- [x] "Your Focus" banner at top: today's #1 priority task (from AI or user-set)
- [x] Clean up empty states: every empty widget should have a clear action CTA

### 5.2 Mobile Dashboard
Current: 4-tab layout (TODAY | HEALTH | GOALS | WEALTH) + center AI FAB.

### Tasks:
- [ ] Ensure all tabs work offline (PWA cache)
- [ ] Haptic feedback on habit completions (mobile)
- [ ] Swipe-to-complete on habits and tasks
- [ ] Pull-to-refresh on all tabs
- [ ] Bottom sheet for AI coach (not full-page redirect)

### 5.3 Progressive Disclosure Decisions

| Component | Show to new users? | Unlock trigger |
|---|---|---|
| Today View | ✅ Always | — |
| Habits tab | ✅ Always | — |
| Goals tab | ✅ Always | — |
| Tasks tab | ✅ Always | — |
| Focus Sessions | After 1st week OR manually toggled | User activates OR 7 days |
| Wellness tracking | After habits established | 3+ habits with 3+ day streak |
| Budget tracker | Never by default | User enables in settings |
| Vision Board | After 1st goal | Prompted after first goal set |
| Weekly Review | After week 1 | Auto-prompt on day 7 |
| Gamification (XP/badges) | Immediately but subtle | Always visible, detail on click |

### Tasks:
- [ ] Implement feature unlock triggers in user state
- [ ] Add "Discover More" section showing locked features with unlock criteria
- [ ] Ensure no feature requires manual code flags — all driven by user state

---

## 6. AI COACH ENHANCEMENT

> See Section 3 for coach roster. This section covers system-level AI improvements.

### 6.1 System Prompt Improvements

Each coach needs:
- [ ] Personality prompt (voice, vocabulary, communication style)
- [ ] Context injection (user's current habits, goals, streaks, mood, sleep, energy)
- [ ] Boundary rules (never diagnose medical conditions, redirect to professionals if crisis)
- [ ] Action capability instructions (how to create tasks/habits/goals)
- [ ] PRODUCT_TRUTH awareness (correct pricing, correct feature set if asked)

### 6.2 Coach Memory
- [ ] Store last 20 messages per coach per user
- [ ] Coach references previous conversations: "Last week you said you'd start running. How'd that go?"
- [ ] Weekly summary generation: "Here's what we worked on this week"

### 6.3 Proactive Coaching
- [ ] Morning nudge: "Good morning. Your top 3 for today: [tasks]. Which one first?"
- [ ] Streak at risk: "You're at 6 days on 'Meditate.' Don't let today break it."
- [ ] Long absence: "Haven't seen you in 3 days. Want to restart with just one thing?"
- [ ] Completion celebration: "That's 7 in a row. The compound effect is working."

### 6.4 Physical / Real-World Tasks
- [ ] Coach can suggest location-based tasks: "Walk meeting at 2pm — weather is good"
- [ ] Coach can suggest time-boxed physical breaks: "Stand up and stretch. 2 minutes. Now."
- [ ] Integration with step counting (future): "You're at 4,200 steps. 800 more to hit your goal."

---

## 7. LANDING PAGE SIMPLIFICATION

### 7.1 Current State
`LandingPageV2.tsx` — Terminal-themed, 12 core features, multiple marketing components.

### 7.2 Problems Identified
- Too many features shown at once (12 is overwhelming)
- Feature list ≠ benefit list (users don't care about features, they care about outcomes)
- Multiple CTAs compete for attention

### 7.3 Simplified Structure

```
SECTION 1: Hero (above fold)
> "Stop planning. Start executing."
> 1-line description: Resurgo breaks goals into daily habits + AI coaching
> Primary CTA: "Start Free — No Credit Card"
> Secondary CTA: "See it in action ↓"
> Social proof: "Used by X operators" (when available)

SECTION 2: Terminal Demo (interactive)
> Show the product working — not screenshots
> User types a goal → AI decomposes → habits created → streak shown

SECTION 3: 3 Core Benefits (not features)
> 1. "Dump your goals → Get a plan in 90 seconds" (AI decomposition)
> 2. "5 AI coaches that know your patterns" (personalized coaching)
> 3. "Track everything that matters in one place" (habits + goals + wellness)

SECTION 4: How It Works (3 steps)
> 1. Brain dump your goals
> 2. AI builds your daily system
> 3. Track, coach, iterate, win

SECTION 5: Pricing (simple table)
> Free | Pro $4.99/mo | Lifetime $49.99
> Clear feature comparison
> Lifetime urgency: "847 of 1,000 spots remaining"

SECTION 6: FAQ (5 questions max)

SECTION 7: Final CTA
> "One system. Everything that matters. Start free."
```

### Tasks:
- [x] Reduce features from 12 to 3 core benefits (AI Plan, AI Coaching, One System)
- [x] Rewrite sections as outcomes, not features (each benefit has outcome line)
- [x] Add "Founding Lifetime" urgency counter (847/1000 spots remaining badge with CTA)
- [x] Remove or consolidate marketing components that distract (FAQ reduced from 10→5, features section simplified)
- [ ] Ensure mobile landing page is equally clean
- [ ] A/B test hero headline (3 variants)
- [x] Ensure CTA hierarchy: Primary (Start Free) > Secondary (Lifetime)

---

## 8. RETENTION & ENGAGEMENT SYSTEMS

### 8.1 Streak System
- [x] Visual streak flames/counters on every habit (streakBadge() with 💎🏆🔥 escalating tiers)
- [x] "Don't break the chain" prompt at 5pm if incomplete (animated banner 5-8pm)
- [ ] Streak freeze: 1 free pass/week (Pro gets 3/week)
- [x] Streak milestones: 7 days, 21 days, 30 days, 66 days, 100 days → XP + badge (analytics + visual tiers)

### 8.2 Gamification Enhancements
Current: XP, levels, badges exist.

- [x] Make XP visible on every action completion ("+10 XP" toast)
- [ ] Level-up animation with sound
- [ ] Weekly XP leaderboard (opt-in, anonymous or with friends)
- [ ] Badge showcase on profile
- [ ] Daily XP cap to prevent gaming

### 8.3 Morning Check-In / Evening Debrief
Both exist. Enhancements needed:

- [x] Morning: Show today's scheduled habits + top 3 tasks + weather (Today's Lineup panel in MorningCheckIn)
- [ ] Morning: "How charged are you? 1-5" → adjusts day's difficulty
- [x] Evening: "What went well? What blocked you?" → feeds AI memory (biggestWin + biggestChallenge fields)
- [x] Evening: Quick mood/energy/sleep log (dayRating + mood in EveningDebrief)
- [ ] Streaks for daily check-ins themselves

### 8.4 Weekly Review
Exists. Enhancements:

- [ ] Auto-generated summary: habits hit %, goals progressed, XP earned, mood trend
- [ ] AI-written narrative: "This week you nailed mornings but evenings fell apart. Let's fix that."
- [ ] One action item for next week (AI-suggested)
- [ ] Share-to-social option (anonymous stats card)

### 8.5 Win-Back Flows
- [ ] Day 3 absence: Push notification — "Your streak is at risk. 1 quick habit?"
- [ ] Day 7 absence: Email — "[Name], we saved your progress. Come back and pick up."
- [ ] Day 14 absence: Email — "Here's what you missed" + progress summary
- [ ] Day 30 absence: Email — "Start fresh. Zero pressure." + one-click reset option

### 8.6 Notification Strategy (Duolingo-Inspired)
Reference: Duolingo's push notifications are the gold standard for retention.

- [ ] Permission-granted rate tracking
- [ ] Time-adaptive (send at user's typical active hour)
- [ ] Personality-matched (stoic users get "Execute." / warm users get "You've got this.")
- [ ] Reminder styles from schema: gentle, supportive, direct, tough_love
- [ ] Smart throttling: never more than 2 push notifications/day
- [ ] A/B test notification copy

---

## 9. BILLING & UPSELL FLOWS

### 9.1 Current State
- Dodo Payments live with 3 products
- Checkout works
- No in-app upsell prompts

### 9.2 Upsell Triggers (implement in-app)

| Trigger | Show what | Where |
|---|---|---|
| Free user hits 3rd goal limit | "Unlock unlimited goals — Pro $4.99/mo" | Goal creation modal |
| Free user sends 10th AI message | "You've used all 10 messages today. Get unlimited." | Coach chat |
| Free user tries Aurora/Phoenix/Nexus | "This coach is Pro-only. Upgrade to access all 5." | Coach selection |
| User has 7-day streak | "You're serious about this. Lock in the Lifetime deal." | Dashboard banner |
| User browses Pro features repeatedly | Soft upsell card in sidebar | Dashboard |
| Day 30 of free usage | "You've been here a month. Pro is $4.99. Worth it?" | One-time modal |

### 9.3 Checkout Optimization
- [x] Default to annual billing at checkout (show monthly savings) — BILLING_PLANS reordered: yearly first
- [x] Price anchor: Show Lifetime ($49.99) next to Monthly ($4.99 × 12 = $59.88) — billing page shows comparison
- [ ] Add testimonial on checkout page
- [ ] Payment failure retry (Dodo webhook → retry email)
- [ ] Cancellation survey (why are you leaving? → offer annual discount)

### Tasks:
- [x] Build upsell prompt component (reusable) — UpsellPrompt.tsx with 4 variants + 6 triggers
- [x] Add trigger logic per table above (coach_locked wired in coach/page.tsx; goal_limit, ai_message_limit, streak_milestone, feature_locked, usage_milestone supported)
- [ ] Add cancellation survey
- [x] Track upgrade funnel events in GA4

---

## 10. MOBILE & PWA

### 10.1 Current State
- MobileDashboard.tsx with 4 tabs + AI FAB
- PWA manifest exists
- Android APK planned via Capacitor

### 10.2 PWA Priorities
- [ ] Verify service worker caches all critical routes
- [ ] Offline mode: read cached data, queue mutations
- [ ] Add-to-homescreen prompt (after 3rd visit)
- [ ] Push notification support (Web Push API)

### 10.3 Android APK (Capacitor)
Current: `android/` directory exists with Capacitor config.

- [ ] Verify Capacitor build compiles cleanly
- [ ] Test all routes in WebView
- [ ] Add splash screen and app icon
- [ ] Configure deep links
- [ ] Test push notifications via Firebase
- [ ] Build signed APK for testing
- [ ] Google Play Store listing preparation

### 10.4 Mobile-Specific Features
- [ ] Widget for Android home screen (today's habits, streak count)
- [ ] Haptic feedback on completions
- [ ] Swipe gestures (swipe right = complete, swipe left = skip)
- [ ] Bottom sheet for coach (not full page navigation)
- [ ] Quick-add from notification shade

---

## 11. ANALYTICS & METRICS

### 11.1 Current State
- GA4 (G-F1VLMSS8FB) installed ✅
- Meta Pixel installed ✅
- GTM (GTM-KWTBH8SB) installed ✅
- Custom event tracking via `src/lib/analytics.tsx` ✅

### 11.2 Events to Track

| Event | When | Priority |
|---|---|---|
| `signup_complete` | After Clerk signup | P0 |
| `onboarding_complete` | After first action | P0 |
| `first_habit_created` | First habit | P0 |
| `first_goal_created` | First goal | P0 |
| `first_ai_message` | First coach interaction | P0 |
| `streak_milestone_7` | 7-day streak | P1 |
| `streak_milestone_30` | 30-day streak | P1 |
| `upgrade_prompt_shown` | Upsell displayed | P0 |
| `upgrade_started` | Clicked upgrade | P0 |
| `upgrade_completed` | Payment success | P0 |
| `coach_selected` | Which coach chosen | P1 |
| `focus_session_completed` | Focus timer ended | P1 |
| `morning_checkin` | Morning check-in done | P1 |
| `evening_debrief` | Evening debrief done | P1 |
| `feature_unlocked` | Progressive disclosure | P1 |

### Tasks:
- [x] Create analytics utility (`src/lib/analytics.tsx`) with `trackEvent()` function
- [x] Wire all P0 events (signup, onboarding, first_habit, first_goal, first_ai_message, upgrade_prompt, upgrade_started, upgrade_completed)
- [x] Wire P1 events in sprint 2 (morningCheckin, eveningDebrief, focusSessionCompleted, streakMilestone, coachSelected)
- [ ] Create GA4 conversion goals for signup → first_action → upgrade
- [x] Meta Pixel standard events for Purchase, Lead, CompleteRegistration

---

## 12. SEO / AEO / CONTENT PAGES

### 12.1 Existing Niche Landing Pages
5 niche landing pages already created. Need to verify they:
- [ ] Have unique meta titles and descriptions
- [ ] Have proper H1 → H2 → H3 hierarchy
- [ ] Include schema markup (FAQ, Product, SoftwareApplication)
- [ ] Load fast (<3s mobile)
- [ ] Have proper internal linking

### 12.2 New Content Pages Needed

| Page | Target keyword | Priority |
|---|---|---|
| `/blog/best-habit-tracker-2026` | "best habit tracker" | P0 |
| `/blog/adhd-productivity-app` | "adhd productivity app" | P0 |
| `/blog/ai-life-coach-app` | "ai life coach app" | P0 |
| `/blog/free-goal-tracker` | "free goal tracker" | P1 |
| `/blog/morning-routine-builder` | "morning routine app" | P1 |
| `/compare/resurgo-vs-todoist` | "todoist alternative" | P1 |
| `/compare/resurgo-vs-habitica` | "habitica alternative" | P1 |
| `/compare/resurgo-vs-notion` | "notion for personal goals" | P2 |

### 12.3 AEO (Answer Engine Optimization)
- [ ] Add FAQ schema to landing page and all blog posts
- [ ] Structure blog content as question → answer format
- [ ] Add "People also ask" sections to blog posts
- [ ] Ensure Bing/Google can extract direct answers from content

### 12.4 Technical SEO
- [x] XML sitemap generation (auto from Next.js) — src/app/sitemap.ts comprehensive
- [x] robots.txt configured properly — src/app/robots.ts with AI bot rules
- [x] Canonical URLs on all pages — metadataBase in layout.tsx
- [x] Open Graph images for all pages
- [x] Twitter card meta tags
- [x] Structured data: SoftwareApplication, FAQ, Organization — JSON-LD in layout.tsx (fixed coach count 8→5, removed fabricated aggregateRating)

---

## 13. EMAIL AUTOMATION

### 13.1 Drip Sequences (via Resend)

**Onboarding Sequence (7 emails):**

| Day | Subject | Content |
|---|---|---|
| 0 | "Welcome to Resurgo. Here's your first move." | Quick win: add 1 habit |
| 1 | "The 2-minute habit trick that actually works" | Atomic Habits principle + CTA |
| 3 | "You've been here 3 days. Here's what happens next." | Show progress, introduce coaches |
| 5 | "Most people quit by day 5. You're still here." | Social proof + streak importance |
| 7 | "Your first week: reviewed by AI" | Weekly review CTA + upgrade soft-sell |
| 14 | "Pro users are 3x more likely to hit their goals" | Upgrade CTA with data |
| 30 | "30 days. Not bad. Lock it in forever?" | Lifetime offer |

**Win-Back Sequence:**
| Day absent | Subject |
|---|---|
| 3 | "Your streak needs you." |
| 7 | "We saved your progress. Pick up where you left off." |
| 14 | "Here's what you've built so far (don't lose it)." |
| 30 | "Fresh start? One tap and you're back." |

### Tasks:
- [ ] Set up Resend email templates with brand styling
- [ ] Build email trigger system (Convex crons + Resend API)
- [ ] Track open rates and click rates
- [ ] A/B test subject lines

---

## 14. MARKETING PRE-LAUNCH

### 14.1 Product Hunt Launch
- [ ] Prepare Product Hunt listing (tagline, description, images, video)
- [ ] Create 4-5 screenshots showing key features
- [ ] Record 60-second demo video
- [ ] Build hunter outreach list (10 potential hunters)
- [ ] Schedule launch for Tuesday (best PH day)
- [ ] Prepare launch-day support (respond to every comment)

### 14.2 Social Media
- [ ] Twitter/X thread: "I built an AI-powered execution OS. Here's what I learned."
- [ ] Reddit posts: r/productivity, r/ADHD, r/getdisciplined, r/SideProject
- [ ] IndieHackers post: share metrics openly
- [ ] Dev.to post: technical architecture of Resurgo
- [ ] LinkedIn post: "Why I built an execution OS instead of another to-do app"

### 14.3 Content Calendar (First 30 Days)
From CONTENT-AND-ADS-PLAYBOOK-2026.md — 5 priority articles:
1. "Best Habit Tracker App 2026" — comparison + Resurgo CTA
2. "ADHD-Friendly Productivity: What Actually Works" — capture ADHD audience
3. "AI Life Coach vs Human Coach: The Real Comparison" — establish coach value
4. "Morning Routine Science: Build One That Sticks" — habit science + product
5. "Why Every Goal Tracking App Fails (And What's Different)" — anti-competitor

### 14.4 Ads (Post-Launch, After PMF Confirmed)
- Meta Ads: 3 ad sets targeting habits, ADHD, productivity
- Google Ads: Target "habit tracker app", "AI productivity app", "goal tracker"
- Budget: $10-20/day initially, scale with ROAS data

---

## 15. DESIGN CONSISTENCY AUDIT

### 15.1 Color System
Canonical (from PRODUCT_TRUTH.md):
- Primary accent: `#f97316` (orange)
- Background: dark terminal theme
- Text: white/gray scale

### Tasks:
- [ ] Audit all components for hardcoded colors — replace with CSS variables/Tailwind config
- [ ] Verify all buttons use consistent border-radius, padding, hover states
- [ ] Verify all cards have consistent shadow, border, spacing
- [ ] Dark mode only (no light mode needed)
- [ ] Loading states: consistent skeleton patterns across all pages

### 15.2 Typography
Canonical fonts:
- **Press Start 2P** — pixel labels, retro accents
- **IBM Plex Mono** — terminal text, code-like elements
- **Inter** — body text, UI labels
- **VT323** — secondary retro/terminal

### Tasks:
- [ ] Audit font usage — ensure no component uses arbitrary fonts
- [ ] Verify font loading (preload critical fonts)
- [ ] Verify mobile font sizes are readable (min 14px body)

### 15.3 Component Consistency
- [ ] Button styles: primary (orange), secondary (outline), ghost (text-only)
- [ ] Modal styles: consistent header, padding, close button position
- [ ] Toast/notification styles: consistent position, animation, duration
- [x] Empty states: consistent illustration/icon + action CTA pattern
- [ ] Error states: consistent error message display

---

## 16. API & INTEGRATIONS

### 16.1 REST API v1
Status: Routes exist. Need to verify:
- [ ] All routes return consistent JSON format
- [ ] Authentication via API key (personal key from user settings)
- [ ] Rate limiting implemented
- [ ] Error responses follow standard format

### 16.2 Telegram Bot
Status: Live and working.
- [ ] Verify all commands work
- [ ] Add: `/coach [message]` — chat with default coach from Telegram
- [ ] Add: `/today` — show today's habits and tasks

### 16.3 Future Integrations (Roadmap — NOT launch-blocking)
- Google Calendar sync
- Apple Health / Google Fit
- Zapier/IFTTT webhook support
- VS Code extension
- MCP Server

---

## 17. SECURITY & PERFORMANCE

### 17.1 Security Checklist
- [x] All API routes authenticated (Clerk middleware)
- [ ] Rate limiting on all public endpoints
- [ ] Input validation on all Convex mutations (already has validators)
- [ ] No sensitive data in client-side code
- [ ] Environment variables properly configured (no secrets in repo)
- [x] CSP headers configured — full CSP in next.config.js (script/style/connect/frame/img/font/worker/manifest-src, Meta Pixel domains added)
- [ ] CORS configured properly for API routes

### 17.2 Performance
- [ ] Lighthouse score > 90 on landing page (mobile)
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [x] Image optimization (next/image for all images) — PWAInstallPrompt <img> → <Image>
- [x] Code splitting (dynamic imports for heavy components) — 14+ components via next/dynamic across dashboard, coach, wellness
- [ ] Preload critical fonts and above-fold resources

---

## 18. LAUNCH DAY CHECKLIST

### Pre-Launch (Day -1)
- [ ] All critical conflicts resolved (Section 1)
- [ ] PRODUCT_TRUTH.md fully aligned with code
- [ ] Landing page live at resurgo.life
- [ ] Pricing page shows correct pricing
- [ ] Checkout flow tested end-to-end (all 3 plans)
- [ ] Onboarding flow tested (new user, returning user)
- [ ] All 5 coaches respond correctly
- [ ] Mobile experience tested on 3+ devices
- [ ] Email automation tested (send test emails)
- [ ] Analytics events firing correctly
- [ ] Error monitoring set up (Vercel analytics)
- [ ] Product Hunt listing prepared

### Launch Day (Day 0)
- [ ] Deploy final production build
- [ ] Verify all environments (prod, Convex, Clerk, Dodo)
- [ ] Submit to Product Hunt
- [ ] Post Twitter/X thread
- [ ] Post Reddit threads
- [ ] Monitor error logs every 30 minutes
- [ ] Respond to every Product Hunt comment within 1 hour
- [ ] Track signups in real-time

### Post-Launch (Day 1-3)
- [ ] Review signup numbers
- [ ] Review onboarding completion rate
- [ ] Fix any reported bugs immediately
- [ ] Respond to all user feedback
- [ ] Send Day-0 welcome email to all new signups

---

## 19. POST-LAUNCH WEEK 1

### Metrics to Track Daily
- [ ] New signups
- [ ] Onboarding completion rate
- [ ] First-win rate (% who complete 1 action)
- [ ] Day-1 retention
- [ ] Coach interaction rate
- [ ] Free-to-pro conversion attempts
- [ ] Error rate

### Quick Wins Based on Data
- If onboarding drops off → simplify further
- If coach interaction is low → surface coach prompts more prominently  
- If free-to-pro is <2% → test different upsell triggers
- If day-1 retention is <40% → add push notification for day-2 nudge

---

## 20. PRIORITY MATRIX

### P0 — LAUNCH BLOCKERS (Do first)
| # | Task | Section |
|---|---|---|
| 1 | Resolve coach count conflict | §1.1 |
| 2 | Resolve free plan coach access conflict | §1.2 |
| 3 | Fix pricing references in docs | §1.3 |
| 4 | Delete dead LandingPage.tsx | §2.1 |
| 5 | Simplify onboarding to 3-step flow | §4 |
| 6 | Add analytics event tracking (P0 events) | §11 |
| 7 | Test checkout flow end-to-end | §9.3 |
| 8 | Lighthouse performance audit | §17.2 |

### P1 — LAUNCH WEEK (Do within first week)
| # | Task | Section |
|---|---|---|
| 9 | Build upsell prompt system | §9.2 |
| 10 | Customer Engagement Score | §8 (SAAS-FUNDAMENTALS) |
| 11 | Morning/evening check-in enhancements | §8.3 |
| 12 | Streak milestones + badges | §8.1 |
| 13 | Win-back email flows | §8.5 |
| 14 | Landing page simplification | §7 |
| 15 | SEO schema markup | §12.4 |

### P2 — MONTH 1 (After launch stabilizes)
| # | Task | Section |
|---|---|---|
| 16 | Coach memory (20-msg history) | §6.2 |
| 17 | Proactive coaching nudges | §6.3 |
| 18 | ADHD-specific coach behaviors | §3.4 |
| 19 | Email drip sequences | §13 |
| 20 | 3 comparison blog posts | §12.2 |
| 21 | Product Hunt launch | §14.1 |
| 22 | Android APK build | §10.3 |

### P3 — MONTH 2+ (Growth phase)
| # | Task | Section |
|---|---|---|
| 23 | Multi-chain AI (model selection per query) | §3.3 |
| 24 | NPS survey system | SAAS-FUNDAMENTALS §12 |
| 25 | Cohort tracking | SAAS-FUNDAMENTALS §5 |
| 26 | Google Calendar sync | §16.3 |
| 27 | Social challenges/leaderboards | §8.2 |
| 28 | Ads (Meta + Google) | §14.4 |
| 29 | Segmented onboarding (ADHD/Fitness/Founder) | §4.3 |
| 30 | MCP Server + VS Code extension | §16.3 |

---

## 21. NEW TASKS (from doc audit)

> Discovered during doc consolidation — tasks not yet tracked elsewhere.

### 21.1 Analytics Gaps
- [ ] Install Microsoft Clarity (free session replay + heatmaps)
- [ ] Build Customer Engagement Score (per SAAS-FUNDAMENTALS: login freq × habit completions × streak × coach usage)

### 21.2 Marketing Gaps
- [ ] Short-form video series: "Coach Reacts" format (TikTok/Reels — Marcus reacts to bad habits, Phoenix reacts to burnout posts)
- [ ] 100-email backlink sprint (per BACKLINK-OUTREACH-PLAYBOOK.md — target productivity bloggers, ADHD communities)

### 21.3 Automation Gaps
- [ ] Convex cron: morning nudge (8am user-local — today's top 3 tasks via push/email)
- [ ] Convex cron: evening prompt (8pm user-local — evening debrief reminder)
- [ ] Convex cron: weekly AI summary (Sunday — auto-generate week recap for each active user)

### 21.4 Doc Consistency
- [ ] Fix "8 coaches" → "5 coaches" references in levelgrow.md (search "8 specialized")
- [ ] Fix resurgo.life vs resurgo.app domain references across docs

---

## DOCUMENT REGISTRY

These supporting documents exist. **5 files were deleted on 2026-06-26** (content merged into surviving docs).

| Document | Status | Location | Notes |
|---|---|---|---|
| PRODUCT_TRUTH.md | ✅ Active | `docs/PRODUCT_TRUTH.md` | Canonical source of truth |
| BRAND_VOICE.md | ✅ Active | `docs/BRAND_VOICE.md` | Brand guidelines |
| SAAS-FUNDAMENTALS.md | ✅ Active | `docs/SAAS-FUNDAMENTALS.md` | SaaS metrics bible |
| MASTER-LAUNCH-PLAN.md | ✅ This file | `docs/MASTER-LAUNCH-PLAN.md` | Single task tracker |
| MARKETING-STRATEGY.md | ✅ Active | `docs/MARKETING-STRATEGY.md` | **Merged in:** CONTENT-AND-ADS-PLAYBOOK-2026.md |
| COMPETITIVE-ANALYSIS.md | ✅ Active | `docs/COMPETITIVE-ANALYSIS.md` | Market research |
| SEO-GEO-AEO-STRATEGY.md | ✅ Active | `docs/SEO-GEO-AEO-STRATEGY.md` | Technical SEO guide |
| VISION-BOARD-STUDIO-PRD.md | ✅ Active | `docs/VISION-BOARD-STUDIO-PRD.md` | Feature spec |
| levelgrow.md | ✅ Active | `docs/operations/levelgrow.md` | **Merged in:** CUSTOMER-ACQUISITION-PLAN.md + astepforword.md |
| userflow-and-retention.md | ✅ Active | `docs/operations/userflow-and-retention.md` | Retention playbook |
| founder-execution-schedule.md | ✅ Active | `docs/operations/founder-execution-schedule.md` | 8-week daily schedule |
| AEO-GEO-CITATION-TRACKER.md | ✅ Active | `docs/operations/AEO-GEO-CITATION-TRACKER.md` | Weekly tracking template |
| BACKLINK-OUTREACH-PLAYBOOK.md | ✅ Active | `docs/operations/BACKLINK-OUTREACH-PLAYBOOK.md` | Outreach process |
| refinedresurgo.md | ✅ Active | `docs/refinedresurgo.md` | Architecture reference |
| DODO_SETUP.md | ✅ Active | `DODO_SETUP.md` | Billing integration guide |
| ~~CONTENT-AND-ADS-PLAYBOOK-2026.md~~ | ❌ Deleted | — | Merged into MARKETING-STRATEGY.md |
| ~~CUSTOMER-ACQUISITION-PLAN.md~~ | ❌ Deleted | — | Merged into levelgrow.md |
| ~~astepforword.md~~ | ❌ Deleted | — | Superseded by levelgrow.md |
| ~~RELEASE_NOTES.md~~ | ❌ Deleted | — | Completed v2.1.0 changelog |
| ~~clerk.md~~ | ❌ Deleted | — | Static reference (see Clerk docs) |

---

*This is your single execution document. Every task has a section. Every decision is documented.*
*When you pick up work, reference this file. When you finish work, check it off here.*
*Do NOT create new strategy documents. Update this one.*
