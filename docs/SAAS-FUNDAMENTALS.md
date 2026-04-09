# RESURGO — SaaS FUNDAMENTALS & METRICS BIBLE
> Every decision — pricing, features, roadmap, marketing — must trace back to these numbers.
> Source: David Skok (forentrepreneurs.com), HubSpot SaaS Metrics, Y Combinator playbooks.

---

## 1. THE 3 KEYS TO SaaS SUCCESS

| Key | What it means | Resurgo status |
|---|---|---|
| **Acquire** customers | Get them to sign up | ✅ Landing page live, SEO started, 5 niche pages |
| **Retain** customers | Keep them using the product | ⚠️ Retention mechanics exist (check-ins, streaks, nudges), but churn instrumentation + CES not complete |
| **Monetize** customers | Convert free → paid → upsell | ✅ Dodo + contextual upsell triggers implemented; ⚠️ conversion goal instrumentation still incomplete |

> **Rule**: Fix retention BEFORE scaling acquisition. Pouring users into a leaky bucket wastes money.

---

## 2. CRITICAL METRICS — RESURGO TARGETS

### 2.1 Unit Economics

| Metric | Formula | Target | Resurgo today |
|---|---|---|---|
| **LTV** (Lifetime Value) | ARPU × Avg. lifespan (months) | — | $4.99 × ? months = ? |
| **CAC** (Customer Acquisition Cost) | Total spend ÷ New customers | <$15 | Near $0 (organic) |
| **LTV:CAC Ratio** | LTV ÷ CAC | ≥ 3:1 (best SaaS = 7–8:1) | High (organic acquisition) |
| **Months to Recover CAC** | CAC ÷ ARPU | < 12 months | ~1 month if organic |
| **Monthly Churn** | Lost customers ÷ Start-of-month customers | < 5% | ❓ Not tracked |
| **Revenue Churn** | Lost MRR ÷ Start-of-month MRR | < 3% | ❓ Not tracked |

### 2.2 Revenue Metrics

| Metric | Target | Notes |
|---|---|---|
| **MRR** (Monthly Recurring Revenue) | Track from day 1 | Pro Monthly × active subs |
| **ARR** (Annual Recurring Revenue) | MRR × 12 | North star metric |
| **Expansion Revenue** | > 20% of new revenue | Upsell Free→Pro, Monthly→Yearly, Yearly→Lifetime |
| **Net Revenue Retention (NRR)** | > 100% | Means existing users generate more over time |

### 2.3 Funnel Metrics

| Stage | Target | How to measure |
|---|---|---|
| Visitor → Signup | 3–5% | GA4 event tracking |
| Signup → First Win (complete 1 action) | > 60% | Convex + analytics |
| First Win → Day 7 Return | > 40% | Cohort tracking |
| Day 7 → Day 30 Return | > 25% | Cohort tracking |
| Free → Pro Conversion | 5–10% | Billing events |
| Trial → Paid (if trial added) | 15–20% | Industry benchmark |

---

## 3. NEGATIVE CHURN — THE HOLY GRAIL

> **"3% negative churn means 3× more revenue vs 3% positive churn over 40 months."** — David Skok

**What is it:** When expansion revenue from existing users exceeds revenue lost from churn.

**How Resurgo achieves it:**
1. Free → Pro Monthly ($4.99) — primary conversion
2. Pro Monthly → Pro Yearly ($29.99 = save $30/yr) — retention lock-in
3. Pro → Lifetime ($49.99) — one-time windfall, zero future churn
4. Future: Add-ons (API access, premium AI models, team features)

**Implementation priority:**
- [ ] Build in-app upgrade prompts at value moments (after completing 10th goal, after 30-day streak)
- [ ] Annual billing discount shown at checkout
- [ ] Lifetime CTA shown after 3+ months on Pro

---

## 4. CUSTOMER ENGAGEMENT SCORE

> HubSpot's "Customer Happiness Index (CHI)" predicted churn before it happened.

**Resurgo Engagement Score formula (proposed):**

| Signal | Weight | Why |
|---|---|---|
| Days active this week (0–7) | 30% | Core usage indicator |
| Habits completed today | 20% | Daily engagement depth |
| Coach messages sent this week | 15% | Feature adoption |
| Goals with activity this week | 15% | System usage breadth |
| Focus sessions completed | 10% | Power feature usage |
| Check-in completion (morning/evening) | 10% | Routine formation |

**Score bands:**
- 80–100: **Power User** — upsell candidates, referral program
- 50–79: **Active** — healthy, nurture with tips
- 20–49: **At Risk** — trigger win-back: push notification, coach nudge
- 0–19: **Churning** — urgent: email + special offer + "we miss you"

**Implementation:** Store in `users` table, recalculate weekly via Convex cron.

---

## 5. COHORT ANALYSIS

Track users by signup week. For each cohort, measure:
- Week 1 retention (% still active)
- Week 4 retention
- Week 12 retention
- Conversion rate to paid

**Why:** Averages hide problems. If Jan cohort retains at 40% but Feb cohort at 15%, something broke in Feb.

---

## 6. GROWTH LEVERS — IN PRIORITY ORDER (Skok)

| Priority | Lever | Resurgo action |
|---|---|---|
| 1 | **Fix churn** | Build engagement score, win-back flows, morning check-in streaks |
| 2 | **Product** | Polish onboarding, first-win in <5 min, progressive disclosure |
| 3 | **Funnel** | Simplify landing page, reduce signup friction, clear CTA hierarchy |
| 4 | **Sales** | N/A (self-serve) — but in-app upgrade prompts are critical |
| 5 | **Pricing / Upsell** | Current pricing is competitive. Add value-based upgrade triggers |
| 6 | **Segmentation** | ADHD users vs general vs fitness vs founders — different onboarding |

---

## 7. RESURGO vs BENCHMARKS

| Benchmark | Industry avg | Resurgo target | Status |
|---|---|---|---|
| Free-to-paid conversion | 2–5% | 8% (AI coaches = strong pull) | ❓ Not tracked |
| Monthly churn | 3–7% | <5% | ❓ Not tracked |
| NPS | 30–50 excellent | 50+ | ❓ Not implemented |
| Day-1 retention | 40–60% | >50% | ❓ Not tracked |
| Day-7 retention | 20–35% | >30% | ❓ Not tracked |
| Day-30 retention | 10–20% | >20% | ❓ Not tracked |
| Avg. session length | 3–5 min | >4 min | ❓ Not tracked |

---

## 8. PRICING PSYCHOLOGY — WHAT THE DATA SAYS

### Current pricing is AGGRESSIVE (good for launch):
- **$4.99/mo** is below most competitors (Todoist Pro ~$4/mo, TickTick ~$2.79/mo, Habitify ~$5/mo)
- **$49.99 lifetime** creates urgency + permanent revenue (must cap supply: "1,000 spots")

### Key principles:
1. **Getting paid upfront lowers churn** (Skok) — push annual/lifetime
2. **Price anchoring**: Show Lifetime ($49.99) next to Monthly ($4.99×12 = $59.88/yr) — Lifetime looks like a deal
3. **Loss aversion**: "1,000 founding lifetime spots — 847 remaining" (visible counter)
4. **Segment pricing**: One plan is fine at launch. Segment later (Student, Creator, ADHD edition?)

### Post-100-user pricing roadmap:
1. Lifetime → $79.99 (at 100 users)
2. Lifetime → $99.99 (at 500 users)
3. Consider removing Lifetime entirely at 1,000+ users
4. Consider adding Teams tier later

---

## 9. WHAT COMPETITORS PROVE

### Todoist ($4/mo Pro, 30M users)
- **What works:** Simplicity, natural language input, boards/lists/calendar views, 90+ integrations
- **What Resurgo does better:** AI coaches, habit tracking, wellness, gamification, all-in-one
- **Lesson:** Never underestimate simplicity. Speed > features for acquisition.

### Habitica (Gamified habits, 4M users)
- **What works:** Full RPG gamification (battle monsters, level up, equip gear), community quests
- **What Resurgo does better:** AI coaching, professional aesthetic, wellness tracking, real-world focus
- **Lesson:** Gamification drives retention massively. Resurgo's XP/badges system should be visible and rewarding.

### Fabulous (37M users, behavioral science)
- **What works:** Routines (morning/afternoon/evening), coaching library 24/7, human coaching option, behavioral science pedigree (Duke University)
- **What Resurgo does better:** AI coaches are always free (Fabulous charges for human coaches), goal decomposition, terminal aesthetic
- **Lesson:** Routine-based design works. Morning/evening check-ins are validated by 37M users.

### Streaks (Apple Design Award)
- **What works:** Extreme simplicity (24 tasks max), Apple Health integration, Apple Watch, "don't break the chain"
- **What Resurgo does better:** Comprehensive system (goals + tasks + habits + AI), cross-platform
- **Lesson:** "Don't break the chain" is the most powerful habit mechanic. Resurgo's streak system must be prominent.

### Habitify (2M users)
- **What works:** Challenges/leaderboards, mood tracking, API access, Zapier/IFTTT, built-in timer
- **What Resurgo does better:** AI coaches, deeper AI integration, vision boards, execution focus
- **Lesson:** Challenges and social competition drive engagement. Consider adding challenges.

### TickTick (Comprehensive productivity)
- **What works:** Habit tracker + Pomodoro + Eisenhower Matrix + Calendar + Kanban + Timeline view
- **What Resurgo does better:** AI coaches, more opinionated workflow (execution OS vs flexible tool)
- **Lesson:** Pomodoro and Eisenhower Matrix are table-stakes. Resurgo already has Pomodoro; consider Eisenhower.

### Notion (100M+ users)
- **What works:** Everything-app with AI agents, docs, projects, wikis, enterprise search
- **What Resurgo does NOT compete with:** Team collaboration, enterprise, docs, wikis
- **Lesson:** Resurgo should NEVER try to be Notion. Stay laser-focused on personal execution + AI coaching.

---

## 10. DOMAIN KNOWLEDGE — HABIT FORMATION SCIENCE

### James Clear — Atomic Habits (25M+ copies sold)
1. **Start incredibly small** — Make it so easy you can't say no (1 minute, not 10)
2. **1% improvements compound** — Tiny gains, not radical changes
3. **Break habits into chunks** — 20 min meditation = 2 × 10 min
4. **Never miss twice** — Missing once is fine; missing twice starts a new habit
5. **Patience > motivation** — Stick to a pace you can sustain

**Resurgo application:**
- Default new habits to small (5 min, not 30 min)
- Show compound progress charts (streaks, weekly trends)
- "Never miss twice" should be a coach-level intervention
- Adaptive difficulty should suggest smaller habits when streaks break

### Psychology Today — Habit Formation
1. **Habit loop:** Cue → Routine → Reward (Duhigg)
2. **Habits account for ~40% of daily behaviors**
3. **Habits are efficient** — brain automates to save energy
4. **Incentives help kickstart** but intrinsic motivation sustains
5. **Environment design > willpower** — make the right action the default

**Resurgo application:**
- Coach messages should reference the habit loop
- Environmental design tips in AI responses
- Reward system (XP, badges, streak flames) as external incentive bridge

### ADHD-Specific Considerations
1. **Executive function deficits** — task initiation, working memory, time blindness
2. **Novelty-seeking** — new systems get abandoned after 2-3 weeks
3. **Hyperfocus asset** — can be channeled with proper systems
4. **External structure required** — reminders, visual timers, body doubling
5. **Emotional regulation** — rejection sensitivity, frustration tolerance

**Resurgo application for ADHD users:**
- Short, visual task cards (not long lists)
- Timer-based tasks (5-min sprints, not open-ended)
- "Just start" mode — auto-selects one task, sets 5-min timer
- Body doubling: AI coach "stays with you" during focus sessions
- Celebration micro-moments after every completion (not just at streaks)
- Novelty rotation: change dashboard widgets, themes, coach personalities
- Time-awareness widgets (visual countdown, "this task takes 5 minutes")
- Forgiveness-first language: "Missed a day? That's one data point, not a verdict."

---

## 11. KEY DECISIONS FOR LAUNCH

| Decision | Recommendation | Reasoning |
|---|---|---|
| Track churn from day 1? | **YES** — critical | You can't fix what you don't measure |
| Build engagement score? | **YES** — week 1 post-launch | Predicts churn before it happens |
| Implement NPS? | Yes — simple in-app survey at day 7, 30, 90 | Measures satisfaction + generates testimonials |
| Add cohort tracking? | Yes — tag users by signup week | Spot retention trends early |
| Segment onboarding? | Yes — ADHD / Fitness / General / Founder tracks | Different users need different first experiences |
| Annual billing push? | **YES** — default to annual at checkout | Reduces churn + cash flow |
| Show Lifetime counter? | **YES** — "847 of 1000 remaining" | Scarcity + urgency |

---

## 12. METRICS IMPLEMENTATION PLAN

### Phase 1 — Pre-launch (must-have)
- [x] MRR/ARR tracking foundation (Dodo billing events + subscription data in Convex)
- [ ] Signup funnel conversion goals in GA4 (visit → signup → first_action → upgrade)
- [ ] User activation definition: "User completed 1 habit OR 1 task within first session"
- [ ] Basic retention: track daily active users (DAU) via Convex

### Phase 2 — Week 1 post-launch
- [ ] Customer Engagement Score (store in users table, weekly cron)
- [ ] Churn tracking (monthly: compare active users start vs end)
- [ ] Revenue churn (MRR loss tracking)
- [ ] Cohort tagging (signupWeek field on user)

### 12.1 CURRENT STATE SNAPSHOT (2026-04-05)

- Build and typecheck pass for current release candidate.
- Core activation and conversion events exist in code (`src/lib/analytics.tsx`).
- Clarity instrumentation added and env-gated.
- Morning/evening local-time nudges and weekly summary cron are implemented.
- Remaining gap is not feature absence, but **measurement completeness** (GA4 goal wiring + churn/CES dashboards).

### 12.2 OPERATOR CADENCE (WEEKLY)

Every Monday, review:

1. Activation: signup → first action
2. Retention: D1 / D7 / D30 cohorts
3. Monetization: upgrade prompt views → checkout starts → completed purchases
4. Health: at-risk users by engagement score band

Required output each week:

- One retention hypothesis
- One funnel experiment
- One monetization copy/placement test
- One kill/keep decision

### Phase 3 — Month 1
- [ ] NPS survey (in-app at day 7, day 30)
- [ ] Free-to-paid conversion funnel
- [ ] Expansion revenue tracking (upgrade events)
- [ ] Customer Health Score dashboard (internal admin)

---

*Last updated: 2026-04-05*
*Source of truth for all metrics, pricing, and competitive intelligence.*
