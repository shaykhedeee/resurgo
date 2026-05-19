# Resurgo Ecosystem Roadmap

Last updated: 2026-05-17

## Product North Star

Resurgo should become the personal Execution OS for ambitious solo operators: a place where a user can dump mental clutter, get a realistic plan, execute today, review progress, and recover momentum without switching systems.

The current app already has many strong pieces: brain dump parsing, AI goal decomposition, habits, focus sessions, wellness, gamification, Telegram, billing, and multiple coach engines. The main problem is not lack of features. The problem is that too many surfaces still feel like separate products with slightly different truths.

## Highest Priority Diagnosis

1. The product truth has to be singular. Pricing, coaches, free limits, and mobile status must say the same thing everywhere.
2. Onboarding should start with a brain dump, not a form. The form can be inferred from the dump.
3. "One goal" should become "one focus at a time." Users can have multiple goals, but Resurgo should pick the most important next move for today.
4. AI coaches need one shared memory layer and one canonical roster. The app currently has multiple coach systems that disagree with each other.
5. Mobile should be presented honestly: PWA everywhere, Android wrapper in progress, iOS native not ready until the Xcode project and Apple Team ID are real.

## Relaunch Offer

Canonical pricing:

- Free: 3 active goals, 5 habit check-ins per day, 10 AI coach messages per day.
- Pro Monthly: $9.99/month.
- Pro Yearly: $95.88/year, $7.99/month effective.
- Founding Lifetime: $89 one-time, limited to the first 100 relaunch signups, then $199.

The relaunch offer should be visible but not desperate. The best framing is:

"Founding Lifetime - first 100 relaunch signups."

Avoid fake precision unless the counter is backed by real purchase data. If the app says "47 remaining," the number should come from billing records.

## Onboarding V2

Target: first meaningful plan and first completed action in under 5 minutes.

Flow:

1. Welcome: one sentence of positioning, then brain dump input.
2. Brain dump: user pastes messy goals, worries, tasks, habits, deadlines, constraints.
3. AI planner: parse into goals, projects, tasks, habits, deadlines, blockers, energy patterns, and user preferences.
4. Goal portfolio: detect whether the user has one primary goal or multiple active goals. Do not force one life goal.
5. Today plan: pick one daily focus, 3 tasks max, and 1 starter habit.
6. First win: user completes or schedules one concrete action before seeing the full dashboard.
7. Memory consent: explain that Resurgo remembers goals, constraints, preferences, and recent patterns to personalize coaching.

Data the onboarding should store:

- User identity: name, role, current season of life.
- Goal portfolio: primary goal, secondary goals, domains, deadlines.
- Constraints: available time, energy pattern, work schedule, health limits, money constraints.
- Preferences: coach style, reminder style, planning depth, ADHD-friendly mode.
- AI memory summary: short durable summary used in coach prompts.

## Multi-Goal Model

Resurgo should support multiple goals without becoming noisy.

Recommended model:

- Goal portfolio: all active goals.
- North Star: optional, long-term identity direction.
- Current focus: one selected goal or project for today/this week.
- Daily execution queue: tasks ranked across all goals.
- AI triage: if multiple goals compete, the AI explains the tradeoff and chooses based on urgency, leverage, energy, and deadlines.

This lets the product keep the practical benefit of "one focus" while respecting that real users have health, work, money, learning, and relationship goals at the same time.

## AI Coach Architecture

Do not start with PyTorch fine-tuning. The fastest path to much smarter bots is structured memory, retrieval, tools, and evals.

Recommended architecture:

- Shared user memory: stored in Convex, updated after onboarding, weekly reviews, and important coach chats.
- Coach personality layer: Marcus, Titan, Aurora, Phoenix, Nexus.
- Tool layer: create tasks, create habits, update goals, start focus sessions, summarize week, inspect progress, suggest recovery plan.
- Retrieval layer: pull relevant recent tasks, habits, goals, check-ins, summaries, and user constraints into each response.
- Evaluation layer: regression tests for coach quality, safety, specificity, and actionability.

Use PyTorch only later if there is a clear dataset and a reason to train a classifier or recommender. For now, memory plus tool use will feel much more intelligent than a generic fine-tune.

Canonical coaches:

- Marcus: discipline, clarity, strategy.
- Titan: energy, physical performance, output.
- Aurora: sleep, recovery, emotional balance.
- Phoenix: resilience, burnout recovery, restart.
- Nexus: systems, routines, automation.

Every coach should know the full user context, but each should interpret it through their own specialty.

## Feature Integration Rules

Each major feature should attach to the same loop:

Brain dump -> plan -> today -> focus -> track -> review -> adapt.

Examples:

- Habits should be generated from goals and reviewed by the coach.
- Focus sessions should attach to tasks and count toward weekly progress.
- Wellness should influence planning load and coach tone.
- Budget should attach to finance goals, not sit as a separate mini-app.
- Vision board should attach to goals and identity, not only image generation.
- Telegram should be quick capture and nudges, not a parallel product.

## SaaS Operating Model

Track these metrics before scaling acquisition:

- Visitor to signup.
- Signup to first action.
- First action to Day 1 return.
- Day 7 and Day 30 retention.
- Free limit hit rate.
- Upgrade prompt view to checkout start.
- Checkout start to purchase.
- Coach messages per active user.
- Brain dump to plan completion rate.

Primary activation event:

"User completes one task, habit, or scheduled focus block within the first session."

If activation is weak, do not add more features. Simplify onboarding and make the first action easier.

## Mobile Roadmap

Current truth:

- PWA is the production mobile experience.
- Android wrapper exists and an APK is present, but emulator verification still needs adb on PATH or Android Studio tooling.
- iOS native is not production-ready because the Xcode project/workspace are placeholders and the Apple app-site association file still needs a real Apple Team ID.

Recommended path:

1. Ship PWA polish first: install prompt, offline brain dump, push-ready reminders, mobile dashboard.
2. Android beta: verify APK install, login, deep links, offline fallback, push notifications, purchase flow.
3. iOS TestFlight: generate a real Capacitor iOS project, set signing, replace Team ID placeholder, validate universal links.
4. App Store/Play Store copy should promise the same 5 coaches, same pricing, and same PWA-first capabilities.

## 90-Day Execution Plan

Phase 1 - Foundation:

- Finish product truth cleanup across public pages, billing, docs, and chatbot knowledge.
- Fix typecheck blockers that prevent confident releases.
- Replace duplicated onboarding flows with one brain-dump-first onboarding.
- Consolidate coach roster to 5 everywhere.

Phase 2 - Intelligence:

- Build user memory write/update paths after onboarding and weekly reviews.
- Route all coach responses through the same memory builder.
- Add coach action tools for creating tasks, goals, habits, and focus plans.
- Add quality tests for coach specificity and hallucination resistance.

Phase 3 - Retention:

- Add engagement score and cohort tracking.
- Add Day 1, Day 7, and Day 30 lifecycle nudges.
- Make weekly review the central retention ritual.
- Use low-energy planning when wellness signals show overload.

Phase 4 - Relaunch:

- Launch the first-100 lifetime offer.
- Track all pricing funnel events.
- Publish Android beta only after install/login/deep-link verification.
- Keep iOS positioned as PWA/TestFlight until the native project is real.

## Product Principle

Resurgo should feel like one intelligent system, not a collection of widgets. Every screen should answer one of three questions:

- What matters now?
- What should I do next?
- What did we learn about how I work?
