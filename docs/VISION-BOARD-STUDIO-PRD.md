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


This is the final, most comprehensive plan I can produce. Every task from every part of our conversation — product, design, onboarding, retention, marketing, vision board, API, MCP, integrations, SEO, email, social, desktop app — is here, ordered by priority and structured for your AI to execute sequentially.

---

# 🖥️ RESURGO.LIFE
# THE COMPLETE MASTER EXECUTION PLAN
### *Every task from every conversation — zero things missed*

---

## 🔴 HOW TO USE THIS PLAN

- Give this to your coding AI **one block at a time**, in order.
- Every block has an **"AI Prompt"** you can copy directly.
- Follow the order. Do not skip to Platform until Core is solid.
- Each checkbox `[ ]` is a **discrete, shippable task**.

---

# ═══════════════════════════════════
# TIER 1: FOUNDATION (DO THIS FIRST)
# ═══════════════════════════════════
## Estimated Time: Days 1–5

---

## 📋 BLOCK 1.0 — PRODUCT TRUTH DOCUMENT
*The single source of truth. Everything else depends on this.*

### Tasks:
- [ ] Create `/config/product-truth.ts` with these exact exports:
  ```typescript
  export const PLANS = {
    free: { price: 0, coaches: 2, brainDumps: 10, apiWrites: 1000, visionBoards: 2 },
    pro: { price: 9, coaches: 6, brainDumps: -1, apiWrites: 50000, visionBoards: -1 },
    lifetime: { price: 199, coaches: 6, brainDumps: -1, apiWrites: 50000, visionBoards: -1 }
  };
  export const COACH_COUNT = 6;
  export const FOUNDING_LIFETIME_SPOTS = 100;
  export const APP_NAME = "Resurgo";
  export const TAGLINE = "The Execution OS for Ambitious Solo Operators";
  ```
- [ ] Replace **every hardcoded string** in the codebase that mentions pricing, coach counts, or plan limits with imports from this file.
- [ ] Audit every public page (home, features, pricing, FAQs) and make all copy match this file.
- [ ] Fix testimonial duplicates on landing page (find and deduplicate exact string matches).

### AI Prompt:
> "Scan the entire codebase for any hardcoded strings related to pricing, number of coaches, plan limits, or founding user counts. Replace them all with imports from `/config/product-truth.ts`. Also scan all `.tsx`, `.mdx`, and `.json` marketing copy files and flag any contradictions."

---

## 📋 BLOCK 1.1 — ANALYTICS & INSTRUMENTATION
*You cannot fix what you cannot see.*

### Tools to install (free):
- [ ] **Microsoft Clarity** (session replay + heatmaps, free, no limit): Add to `_app.tsx` or `layout.tsx`.
- [ ] **Plausible Analytics** (self-host on Hetzner for $5/mo) OR **Umami** (fully free self-host): Add script tag to layout.
- [ ] **PostHog** (generous free tier): Install `posthog-js` SDK.

### Events to track (add these to every key user action):
```typescript
// Add this tracking to every listed action:
const EVENTS = [
  'signup_started',
  'signup_completed',
  'onboarding_boot_seen',
  'onboarding_braindump_submitted',
  'onboarding_reflection_accepted',
  'first_task_completed',       // THE MOST IMPORTANT
  'first_habit_checked',
  'first_focus_session_started',
  'first_coach_message_sent',
  'first_vision_board_generated',
  'brain_dump_submitted',
  'plan_generated',
  'xp_earned',
  'streak_achieved',
  'weekly_review_completed',
  'pwa_install_prompt_shown',
  'pwa_installed',
  'upgrade_cta_seen',
  'upgrade_started',
  'upgrade_completed',
  'api_key_generated',
  'api_call_made',
  'session_replay_active',
];
```

### AI Prompt:
> "Install PostHog, Plausible, and Microsoft Clarity in our Next.js app. Create a custom `useTracking` hook that wraps PostHog's `capture` method and adds default properties: `user_plan`, `onboarding_complete`, `days_since_signup`. Instrument every event in this list: [paste EVENTS array]. Add the event calls to the exact components where each action occurs."

---

## 📋 BLOCK 1.2 — ERROR TRACKING & RELIABILITY
*This prevents silent failures that kill new users.*

### Tasks:
- [ ] Install **Sentry** (free tier, 5K errors/mo): Add to `_app.tsx` + API routes.
- [ ] Add global error boundary component wrapping the app.
- [ ] Add **AI fallback responses**: If Groq/HF API times out → show a pre-written fallback plan:
  ```typescript
  const FALLBACK_PLAN = {
    tasks: [
      { content: "Review your top goal for the week", priority: 1 },
      { content: "Complete one task that's been pending the longest", priority: 2 },
      { content: "Spend 25 minutes on deep work", priority: 3 },
    ],
    habits: [{ name: "5-minute morning intention" }],
    message: "AI is calibrating. Here's a default operator plan to get you moving."
  };
  ```
- [ ] Add 30-second timeout to all HuggingFace API calls with retry + fallback logic.
- [ ] Create a status page at `/status` or use a free service like Instatus (free tier).

### AI Prompt:
> "Install Sentry in our Next.js/Convex app. Add a global error boundary. Create an `aiSafeFetch` utility wrapper that: (1) times out at 30 seconds, (2) retries once on 503, (3) returns a FALLBACK_PLAN constant if all attempts fail, (4) logs errors to Sentry. Replace all direct Groq and HuggingFace fetch calls with this wrapper."

---

# ═══════════════════════════════════
# TIER 2: ONBOARDING & CORE UX
# ═══════════════════════════════════
## Estimated Time: Days 6–18
## *This is the most important tier. 75% of users churn in the first week — poor onboarding creates the biggest revenue leak in SaaS funnels. Fix this first.*

---

## 📋 BLOCK 2.0 — THE NEW ONBOARDING FLOW
*4 screens. <5 minutes. First win mandatory.*

Time-to-first-value should be under 15 minutes. Progressive disclosure prevents overwhelm — showing fewer choices early improves completion and comprehension.

### Screen Architecture:

**Screen 1: `/onboarding/boot` (20-30 seconds)**
```
Components needed:
- [ ] TerminalBootAnimation component (ASCII boot sequence)
- [ ] EnergyChipSelector (Low/Medium/High)
- [ ] FocusChipSelector (Clients/Build/Health/Side Project/Other)
- [ ] Single "Continue" button
- [ ] "Take a breath, operator. Pick what feels right." subtext
```

**Screen 2: `/onboarding/dump` (60-90 seconds)**
```
Components needed:
- [ ] Large monospace textarea with placeholder examples
- [ ] PromptChipRow: "Clients", "Fitness", "Side project", "Learning", "Health"
- [ ] Character count indicator
- [ ] "GENERATE_PLAN" CTA button
- [ ] Loading state: terminal-style "ANALYZING INPUT..."
```

**Screen 3: `/onboarding/reflection` (30 seconds)**
```
Components needed:
- [ ] AI summary display ("Here's what I heard, operator:")
- [ ] Goal statement
- [ ] Blocker identification
- [ ] "Looks right" button → proceeds
- [ ] "Edit" button → returns to dump
- [ ] "+10 XP for clarity" badge on accept
```

**Screen 4: `/onboarding/today` (first win)**
```
Components needed:
- [ ] Today view with exactly 3 tasks
- [ ] 1-3 habits (max)
- [ ] Single coach card "Ask Ship Coach"
- [ ] "Complete one now to activate system" prompt
- [ ] ON TASK COMPLETION: ASCII success animation + "+50 XP EARNED"
- [ ] "SYSTEM ONLINE. WELCOME TO YOUR OS." terminal message
- [ ] "Enter Command Center" → navigates to /home
```

### Tasks:
- [ ] Create route `/onboarding` with 4 sub-routes using React state machine (or simple step counter).
- [ ] Redirect all new signups to `/onboarding` before accessing `/home`.
- [ ] Save `onboarding_complete: boolean` to user record in Convex.
- [ ] Never show onboarding to returning users (check flag).
- [ ] Add skip option (for developers/testers) hidden behind triple-click on logo.

### AI Prompt:
> "Build a 4-step onboarding flow in our Next.js/Convex app with screens: Boot → BrainDump → Reflection → Today. Use terminal aesthetic (JetBrains Mono, green #00FF41, dark bg). After signup (Clerk auth), redirect to `/onboarding/boot`. Use a Convex mutation to save `onboarding_complete` on completion. Screen 4 must show exactly 3 AI-generated tasks and 1 habit. On first task completion, trigger an ASCII celebration animation and award 50 XP. Fire `first_task_completed` PostHog event. Route to `/home` after. Here is the full spec: [paste Screen Architecture above]."

---

## 📋 BLOCK 2.1 — STARTER / BUILDER / POWER MODES
*Keep all features. Show fewer by default.*

The core principle is to align feature discovery with user motivation. By revealing complexity over time, you build user confidence and competence, significantly improving long-term retention and mastery. This is one of the most effective onboarding practices because it mirrors natural learning, preventing the initial friction that causes many users to abandon a new product.

### Schema:
```typescript
// Add to user Convex schema:
mode: v.union(v.literal('starter'), v.literal('builder'), v.literal('power')),
// Default: 'starter'
// module_pins: array of enabled module IDs
module_pins: v.optional(v.array(v.string())),
```

### Starter Mode (default, first 7 days):
- [ ] Home shows: Today view, 1 coach card, brain dump button ONLY.
- [ ] All other nav items hidden (not deleted, just hidden).
- [ ] Floating "Library" button in bottom-right corner.

### Builder Mode (after 7 days or 20 tasks completed):
- [ ] Adds: Weekly review, goals overview, habit stacks, wellness log.
- [ ] Show "You've unlocked Builder Mode" modal on transition.

### Power Mode (manual unlock or after 60 days):
- [ ] All modules visible.
- [ ] Full dashboard, analytics, API settings, integrations, advanced coaches.

### Library Page `/library`:
- [ ] Grid of all modules (Goals, Habits, Focus, Weekly Review, Wellness, Nutrition, Budget, Vision Boards, Integrations, API, Telegram).
- [ ] Each module: name, one-line description, toggle (enabled/disabled), "Pin to Home" button.
- [ ] Pinned modules appear in sidebar nav.

### Anti-Overwhelm Modal:
- [ ] Trigger: User has >10 overdue tasks AND zero completions today.
- [ ] Modal text: `"Take a breath, operator. Want to simplify today to 1 task?"`
- [ ] Action: `Simplify Today` → archive all but top 1 task to "Tomorrow".

### AI Prompt:
> "Extend the Convex user schema with `mode` ('starter'|'builder'|'power') defaulting to 'starter', and `module_pins` array. Build a `/library` page showing all modules with enable/pin toggles. On the home page, read `mode` from the user record and conditionally render: starter = Today + 1 coach + brain dump only; builder = adds weekly review + goals + habits; power = all. Add a transition modal when mode upgrades. Add anti-overwhelm detection: if `overdue_tasks > 10 AND today_completions === 0` show 'Simplify Today' modal that archives all but top task."

---

## 📋 BLOCK 2.2 — AI COACH ACTION ENGINE
*Every coach reply must end in a 1-tap action.*

### Tasks:
- [ ] After every coach response, automatically append `ActionCards`:
  ```typescript
  type ActionCard = {
    label: string; // "Add to Today" | "Make it a habit" | "Start focus block" | "Activate Emergency Mode"
    action: 'ADD_TASK' | 'ADD_HABIT' | 'START_FOCUS' | 'EMERGENCY_MODE' | 'SIMPLIFY_TODAY';
    payload?: any;
  }
  ```
- [ ] Build `ActionCardRow` component: horizontal scrollable row of pill buttons.
- [ ] Clicking any action card: executes the action AND sends `coach_action_taken` event to PostHog.
- [ ] System prompt addition for ALL coaches:
  ```
  You are an action-oriented coach inside Resurgo OS. 
  After every response, output a JSON block:
  {"actions": [{"label": "...", "action": "...", "payload": {...}}]}
  Maximum 3 actions. Only suggest actions that are immediately executable.
  Never suggest actions you cannot trigger. Be calm, direct, operator-toned.
  ```
- [ ] On home screen: Show max **3 coaches** visible by default. "Coach Library" expander for the rest.
- [ ] Specialty coaches unlock via module: enable Budget module → Finance Coach appears.

### AI Prompt:
> "Update all AI coach system prompts to append a structured JSON `actions` block after every response. Parse this JSON in our coach response handler and render an `ActionCardRow` component with pill buttons. Each button triggers a Convex mutation for its action (ADD_TASK, ADD_HABIT, START_FOCUS, EMERGENCY_MODE, SIMPLIFY_TODAY). Add PostHog tracking on each action. On the home screen, limit visible coaches to 3 with a 'Show all coaches' expander. Coaches unlock contextually: finance coach appears only when Budget module is enabled."

---

## 📋 BLOCK 2.3 — THE DAILY RETENTION LOOP
*The app must always have a "next move" ready.*

### Tasks:
- [ ] **Morning Cron (8 AM user-local time)**:
  - Rebuild "Today" plan based on pending tasks + habits + energy.
  - Send email: `"Your Execution Plan is ready, operator."` (via Resend or Listmonk API).
  - Send push notification (if PWA installed).

- [ ] **Midday Nudge (12 PM)**:
  - In-app only: soft banner `"Focus block available → 25 min timer"`.

- [ ] **Evening Review (9 PM)**:
  - In-app: `"2-minute review. What shipped today?"`.
  - 3 quick fields: Energy (emoji), Key Win (text), Tomorrow's #1 Task.
  - Saves to Convex `daily_reviews` table.

- [ ] **Weekly Review (Sunday 6 PM)**:
  - Auto-generate AI summary: tasks completed, habits kept, goal progress, one insight.
  - Display as "Operator Momentum Report" in terminal style.
  - Include in weekly email newsletter.

- [ ] **Empty State Logic**: Dashboard is NEVER blank.
  - No tasks? → Show `"Brain dump something. Let's build today."` with inline textarea.
  - No habits? → Show `"Add 1 habit to start your streak."` with quick-add.

### AI Prompt:
> "Set up Convex scheduled functions (cron) for: morning plan rebuild at 8 AM per user timezone, midday in-app nudge at noon, evening 2-minute review prompt at 9 PM, and weekly AI summary on Sundays. Create a `daily_reviews` Convex table. Add Resend email integration for morning and weekly emails. Ensure the home dashboard is never empty: implement empty-state components for tasks, habits, and coaches that show contextual prompts instead of blank space."

---

# ═══════════════════════════════════
# TIER 3: VISION BOARD ENGINE
# ═══════════════════════════════════
## Estimated Time: Days 16–26

---

## 📋 BLOCK 3.0 — FIX THE BROKEN VISION BOARD (CRITICAL)
*Currently returns random emoji. Replace entire pipeline.*

### Root cause fix:
- [ ] **Replace the broken HF endpoint** with correct FLUX.1-schnell URL:
  ```
  https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell
  ```
  FLUX.1 [schnell] is a 12 billion parameter rectified flow transformer capable of generating images from text descriptions, offering cutting-edge output quality and competitive prompt following. Trained using latent adversarial diffusion distillation, it can generate high-quality images in only 1 to 4 steps and is released under the Apache 2.0 licence for personal, scientific, and commercial purposes.

- [ ] Add correct request body format:
  ```typescript
  body: JSON.stringify({
    inputs: promptString,
    parameters: {
      negative_prompt: "cartoon, emoji, low quality, text, watermark",
      width: 768,
      height: 512,
      num_inference_steps: 4,
      guidance_scale: 0.0,
    }
  })
  ```
- [ ] Add model fallback chain: FLUX.1-schnell → SDXL → SD 1.5 → Pexels stock image.
- [ ] Add 503 handler (model loading): wait `estimated_time` seconds, retry once.

### AI Prompt:
> "The vision board is broken — it currently returns emoji. Fix the HuggingFace API call by: (1) changing the model to `black-forest-labs/FLUX.1-schnell`, (2) using the correct parameters (4 steps, guidance 0.0), (3) adding a fallback chain to SDXL then SD 1.5 then Pexels API, (4) handling 503 model-loading responses with a timed retry. Never let the generator return an error to the user — always return at least a stock image."

---

## 📋 BLOCK 3.1 — GOAL PARSER (GROQ)
- [ ] Create `lib/visionBoard/goalParser.ts`.
- [ ] Groq call → structured JSON output with: categories (max 6), mood, colorPalette (5 styles), affirmations (5 personal), boardTitle, timeframe.
- [ ] Style options: `dark_luxury`, `terminal_green`, `clean_minimal`, `vibrant_bold`, `soft_pastel`.
- [ ] Use `response_format: { type: 'json_object' }` with Llama-3.3-70b-versatile.

## 📋 BLOCK 3.2 — PROMPT ENGINEER
- [ ] Create `lib/visionBoard/promptEngineer.ts`.
- [ ] 5 style preset templates (lighting, composition, quality, negative prompt per style).
- [ ] Category-specific fallback prompts (career, finance, health, travel, etc.).
- [ ] Output: `{ positive: string, negative: string }` per category.

## 📋 BLOCK 3.3 — CANVAS COMPOSITOR
- [ ] 5 layout templates: `operator_grid`, `power_asymmetric`, `magazine_collage`, `zen_minimal`, `timeline_strip`.
- [ ] Each layout: CSS Grid/absolute positioning with slot positions (x, y, width, height as percentages).
- [ ] `selectBestLayout(parsedGoal, count)` function: matches mood/style to best layout.
- [ ] Affirmation overlays: text rendered over image slots in terminal/serif/sans styles.

## 📋 BLOCK 3.4 — FRONTEND VISION BOARD UI
- [ ] Input screen: style selector (5 options as icon cards) + goals textarea + generate button.
- [ ] Generation screen: terminal progress bar + status logs (`$ GENERATING: HEALTH...`).
- [ ] Canvas viewer: rendered board with all images + affirmations.
- [ ] Actions: "Download PNG", "Set as Dashboard Background", "Share to Twitter".
- [ ] Edit mode: click any slot to swap image (search Pexels inline), click affirmation to edit.

## 📋 BLOCK 3.5 — VISION BOARD LIMITS & MONETIZATION
- [ ] Free: 2 boards/month, stock images only, watermark, JPEG download.
- [ ] Pro: unlimited, FLUX AI images, no watermark, PNG/4K download, auto-quarterly regeneration.
- [ ] Show usage meter: `"1 of 2 free boards used this month. Upgrade for unlimited."`

### AI Prompt for Blocks 3.1–3.5:
> "Build a complete vision board generation system. Create these files: `lib/visionBoard/goalParser.ts` (Groq JSON extraction), `lib/visionBoard/promptEngineer.ts` (style presets → FLUX prompts), `lib/visionBoard/imageOrchestrator.ts` (parallel fetch: HF AI + Pexels stock with fallbacks), `lib/visionBoard/layouts.ts` (5 CSS grid layouts), `components/VisionBoard/VisionBoardMaker.tsx` (full UI with style picker, generation progress, canvas viewer, download, edit mode). Wire to `/api/vision-board/generate` route. Enforce limits from product-truth config. Use the full spec we designed: [paste vision board architecture from prior conversation]."

---

# ═══════════════════════════════════
# TIER 4: PLATFORM (API + MCP + EXTENSIONS)
# ═══════════════════════════════════
## Estimated Time: Days 25–45

---

## 📋 BLOCK 4.0 — REST API FOUNDATION

### Tasks:
- [ ] Create API route namespace: `app/api/v1/`.
- [ ] Implement endpoints:
  ```
  GET  /v1/today              → computed today plan
  GET  /v1/tasks              → list with filters
  POST /v1/tasks              → create task
  PATCH /v1/tasks/:id         → update task
  GET  /v1/goals              → list goals
  POST /v1/goals              → create goal
  GET  /v1/habits             → list habits
  POST /v1/habits             → create habit
  PATCH /v1/habits/:id/check  → mark habit done for today
  POST /v1/actions/brain-dump → AI brain dump processing
  POST /v1/actions/simplify-today → reduce today to 1 task
  GET  /v1/reviews/weekly     → latest weekly review
  ```
- [ ] Bearer token auth middleware: `Authorization: Bearer sk-resurgo-XXXX`.
- [ ] Rate limiting via Upstash Redis (free tier: 10K requests/day).
- [ ] Return standard error shapes: `{ error: string, code: string, quota_remaining?: number }`.
- [ ] Add `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers.

## 📋 BLOCK 4.1 — API KEY MANAGEMENT UI

### Tasks:
- [ ] Convex schema: `api_keys` table with `userId`, `keyHash`, `label`, `createdAt`, `lastUsed`, `monthlyCallCount`.
- [ ] `/settings/api` page:
  - Generate key button (shows key ONCE, then only shows last 4 chars).
  - Key list with labels, last used, monthly usage bar.
  - Revoke button per key.
  - Monthly usage vs limit display.
- [ ] Free users: 1 key max. Pro users: 5 keys max.

## 📋 BLOCK 4.2 — MCP SERVER

### Repository: `resurgo-mcp-server` (separate GitHub repo)

**Tools to implement:**
```json
[
  { "name": "resurgo_get_today_plan",
    "description": "Get the user's prioritized execution plan for today including tasks and habits." },
  { "name": "resurgo_add_task",
    "description": "Add a new task to the user's system.",
    "params": ["content (required)", "due_date (optional)", "add_to_today (boolean)"] },
  { "name": "resurgo_find_tasks",
    "description": "Search tasks by keyword or status.",
    "params": ["query", "status (todo|in-progress|done|overdue)"] },
  { "name": "resurgo_update_task",
    "description": "Mark a task complete or update its content.",
    "params": ["task_id", "status", "content"] },
  { "name": "resurgo_add_habit",
    "description": "Add a new habit to track.",
    "params": ["name", "frequency (daily|weekly)", "linked_goal_id"] },
  { "name": "resurgo_brain_dump",
    "description": "Submit unstructured text for AI processing into tasks and goals.",
    "params": ["text"] },
  { "name": "resurgo_emergency_mode",
    "description": "Activate Emergency Mode — reduces today to 1 task, sends calming plan.",
    "params": [] }
]
```

### Tasks:
- [ ] Create Node.js/TypeScript MCP server project.
- [ ] Implement all 7 tools as JSON-RPC handlers calling your REST API.
- [ ] `RESURGO_API_KEY` read from env variable.
- [ ] Publish to npm as `resurgo-mcp-server`.
- [ ] Write setup docs: "Add Resurgo to Claude in 2 minutes."

### AI Prompt:
> "Create a new Node.js/TypeScript project for a Resurgo MCP server. Implement an MCP-compatible JSON-RPC server with these 7 tools: [paste tools list]. Each tool calls the corresponding Resurgo REST API endpoint using `RESURGO_API_KEY` from env. Add TypeScript types for all request/response shapes. Write a README with Claude config instructions. Make it publishable to npm."

---

## 📋 BLOCK 4.3 — VS CODE EXTENSION

### Tasks:
- [ ] Create VS Code extension project: `resurgo-vscode`.
- [ ] Settings contribution: `resurgo.apiKey` (stored in secrets).
- [ ] Sidebar panel: "Resurgo OS — Today".
  - List today's 3 tasks with checkboxes.
  - Mark done → calls `PATCH /v1/tasks/:id`.
- [ ] Command palette:
  - `Resurgo: Add Task` → input box → POST to API.
  - `Resurgo: Brain Dump` → multi-line input → POST to brain dump endpoint.
  - `Resurgo: Start Focus Session` → opens 25-min timer in status bar.
- [ ] Status bar item: shows "Resurgo: 3 tasks today" — click to open panel.
- [ ] Publish to VS Code Marketplace (free).

---

## 📋 BLOCK 4.4 — WORDPRESS PLUGIN

### Tasks:
- [ ] Create `resurgo-wp-plugin` PHP project.
- [ ] Admin settings page: API key field + save.
- [ ] Shortcodes:
  - `[resurgo_today]` → renders today's tasks as styled list.
  - `[resurgo_ship_log]` → renders last 7 days completed tasks.
  - `[resurgo_vision_board]` → embeds latest vision board image.
- [ ] Gutenberg block: drag-and-drop "Resurgo Today" widget.
- [ ] Submit to WordPress.org plugin directory (free).

---

## 📋 BLOCK 4.5 — OPENAPI DOCUMENTATION SITE

### Tasks:
- [ ] Set up **Mintlify** or **Docusaurus** at `dev.resurgo.life`.
- [ ] Pages: Overview, Quick Start, Authentication, Rate Limits, API Reference (auto from OpenAPI spec), MCP Guide, VS Code Guide, WordPress Guide, Changelog.
- [ ] Embed Swagger UI for interactive API explorer.
- [ ] Add "Try It" buttons for key endpoints.
- [ ] Link from main site nav: "Developers →".

---

# ═══════════════════════════════════
# TIER 5: LANDING PAGES & SEO
# ═══════════════════════════════════
## Estimated Time: Days 20–35 (parallel with Tier 3/4)

---

## 📋 BLOCK 5.0 — MAIN LANDING PAGE OVERHAUL (`/`)

### Current issues to fix:
- [ ] Remove duplicate sections (keep one explanation of "how it works" — not both Framework AND Pipeline full-length).
- [ ] Reduce Core Capabilities to 6 visible, rest behind "Show all tools" expander.
- [ ] Fix hero → demo flow: ONE primary experience above fold.
- [ ] Remove ~20% of decorative terminal labels that don't add meaning.
- [ ] Fix mobile: terminal blocks need `overflow-x: hidden`, responsive font sizing, no awkward wrapping.
- [ ] Fix comparison matrix: desktop = table, mobile = stacked cards.

### Optimized section order:
```
1. HERO: Hook + CTA (terminal boot animation)
2. INTERACTIVE DEMO: Inline brain dump → Today plan preview
3. PROBLEM: "5 apps, 10 tabs, zero ships"
4. HOW IT WORKS: 3 steps (Dump → Plan → Execute)
5. CORE MODULES: 6 cards max, "Show all" expander
6. PROOF: 3 clean testimonials (no duplicates)
7. PRICING: 3 tiers, clear, consistent
8. FINAL CTA: "Your chaos becomes clarity. Start free."
9. FOOTER
```

### Copy / SEO:
- [ ] H1: "The Execution OS for Ambitious Solo Operators"
- [ ] Meta title: "Resurgo — AI-Powered Life OS | Goals, Habits & Daily Execution"
- [ ] Meta description: "Turn your brain dump into today's execution plan. AI-powered goals, habits, focus, and weekly reviews — all in one terminal-style OS."
- [ ] SoftwareApplication schema: Add to `<head>`.

### AI Prompt for landing page:
> "Refactor the Resurgo main landing page with this exact section order: [paste section order]. Keep the terminal aesthetic. Remove the duplicate 'Framework' and 'How it works' sections — keep only a 3-step version. Reduce capabilities section to 6 visible cards with a progressive disclosure expander. Fix all mobile breakpoints: terminal blocks use `overflow-x: auto` and `font-size: clamp(10px, 2vw, 14px)`. Convert comparison matrix to stacked cards on mobile. Fix all testimonial duplicates. Add SoftwareApplication schema. Match all copy to product-truth.ts."

---

## 📋 BLOCK 5.1 — NICHE LANDING PAGES
*Build these in order of traffic priority.*

### Page set (5 pages):

**1. `/solopreneurs` — Primary niche**
- H1: "Stop Juggling 5 Apps. Ship Like a Solo Operator."
- Features emphasis: Client Ops Coach, MRR Momentum, Brain Dump → Today.
- Target KW: "productivity os for solopreneurs", "ai planner for solopreneurs 2026".

**2. `/indie-hackers` — IH/Product Hunt traffic**
- H1: "The OS That Ships MVPs While You Sleep."
- Features: Build-in-public mode, Ship Tracker, GitHub integration.
- Target KW: "productivity tool for indie hackers", "ai execution os for builders".

**3. `/freelance-developers` — Reddit/HN traffic**
- H1: "Terminal-Native. Gig-Ready. Zero Friction."
- Features: Gig pipeline, code focus blocks, Invoice tracker.
- Target KW: "ai goal tracker for freelance developers".

**4. `/content-creators` — TikTok/YouTube audience**
- H1: "From Content Idea to Published. Daily."
- Features: Content calendar coach, Ship streak, Batch recording blocks.
- Target KW: "daily planner for content creators 2026".

**5. `/digital-nomads` — Nomad List traffic**
- H1: "Timezone Chaos? Your Plan Adapts Automatically."
- Features: Travel-aware plan adaptation, Sleep/energy integration.
- Target KW: "adaptive life os for digital nomads".

### Tasks for each page:
- [ ] Hero with niche-specific terminal ASCII.
- [ ] Interactive inline demo (pre-filled with niche-relevant brain dump example).
- [ ] 3 niche-specific testimonials.
- [ ] Links back to main pricing.
- [ ] FAQ section with `FAQPage` schema markup.
- [ ] Internal link to `/blog` pillar post.

### AI Prompt:
> "Create 5 niche landing pages in Next.js at routes `/solopreneurs`, `/indie-hackers`, `/freelance-developers`, `/content-creators`, `/digital-nomads`. Use the same terminal design system as main. Each page: niche H1, inline demo with niche-prefilled brain dump, 3 niche feature highlights, 3 testimonials, FAQ with schema markup. Use this spec per page: [paste niche details above]. All pages link to main pricing. Add JSON-LD FAQPage schema to each."

---

## 📋 BLOCK 5.2 — AEO & COMPARISON PAGES
*Answer Engine Optimization for AI search visibility.*

### Pages to build:
- [ ] `/vs/notion` — "Resurgo vs Notion: Which is better for execution?"
- [ ] `/vs/motion` — "Resurgo vs Motion: AI Planning Comparison"
- [ ] `/vs/clickup` — "Resurgo vs ClickUp: Life OS vs Work OS"
- [ ] `/vs/todoist` — "Resurgo vs Todoist: Beyond Task Lists"
- [ ] `/alternatives/notion` — "Best Notion Alternatives for Solo Operators 2026"

### Structure for each `/vs/` page:
```
H1: "Resurgo vs [Competitor]: Head-to-Head [Year]"
Section 1: Quick verdict (2-3 sentences)
Section 2: Feature comparison table
Section 3: "Who should use [Competitor]"
Section 4: "Who should use Resurgo"
Section 5: Pricing comparison
Section 6: FAQ (5 questions with FAQPage schema)
CTA: "Try Resurgo free — no card required"
```

### AEO-specific requirements:
- [ ] Answer the comparison question directly in the **first paragraph** (AI Overview bait).
- [ ] Use `FAQPage` JSON-LD schema.
- [ ] Use `SoftwareApplication` schema on main pages.
- [ ] Add `HowTo` schema to guide pages.

---

## 📋 BLOCK 5.3 — SEO BLOG SYSTEM (Ghost CMS)

### Setup:
- [ ] Self-host Ghost on Hetzner CX21 ($5/mo) OR use Ghost Cloud ($9/mo).
- [ ] Configure custom domain: `blog.resurgo.life`.
- [ ] Install Ghost + connect to your Next.js frontend via Ghost Content API.

### Pillar Posts (must write these):
1. **"The Complete Solo Operator Productivity System for 2026"** (5,000+ words, target KW: "solo operator productivity system")
2. **"How to Use AI Brain Dumps to Plan Your Entire Week"** (2,500 words, target KW: "ai brain dump planner")
3. **"The Best Habit Tracking Apps for Solopreneurs in 2026"** (3,000 words, target KW: "habit tracker solopreneurs")

### Cluster Posts (10 posts linked to Pillar 1):
- [ ] "How to Do a Brain Dump That Actually Works"
- [ ] "The Science Behind Habit Formation for Busy Professionals"
- [ ] "Why Your To-Do List is Making You Less Productive"
- [ ] "Emergency Mode: How to Recover When Everything Breaks"
- [ ] "The 3-Task Rule: Why Less is More for Solo Operators"
- [ ] "How AI Can Build Your Daily Plan While You Sleep"
- [ ] "Building a Weekly Review System That Sticks"
- [ ] "From Chaos to Clarity: The Solo Operator's Morning Routine"
- [ ] "Why Vision Boards Actually Work (The Neuroscience)"
- [ ] "Tools Every Indie Hacker Needs in 2026"

### Blog SEO requirements:
- [ ] `Article` and `BlogPosting` JSON-LD schema on every post.
- [ ] Internal links from every cluster post → pillar.
- [ ] Each post has: meta title (60 chars), meta description (155 chars), OG image (terminal-styled).
- [ ] XML sitemap auto-generated by Ghost.

---

# ═══════════════════════════════════
# TIER 6: EMAIL MARKETING ENGINE
# ═══════════════════════════════════
## Estimated Time: Days 30–40

---

## 📋 BLOCK 6.0 — EMAIL INFRASTRUCTURE

### Tools:
- [ ] **Listmonk** (self-host on same Hetzner server as Ghost, free) OR **Resend** (free tier: 3K/mo, great dev DX).
- [ ] Configure DNS: SPF, DKIM, DMARC records for `mail.resurgo.life`.
- [ ] Verify DNS propagation before sending a single email.
- [ ] Create unsubscribe handling (legal requirement + trust signal).

### Lists to create:
```
[Resurgo] All Subscribers
[Resurgo] Free Users
[Resurgo] Pro Users
[Resurgo] Churned Users
[Resurgo] Blog Subscribers (RSS feed subscribers)
[Resurgo] Waitlist (for new features)
```

---

## 📋 BLOCK 6.1 — EMAIL SEQUENCES

### Sequence 1: "System Calibration" (Welcome — 7 emails)
Effective onboarding emails focus on personalization, clarity, and timing. Each email should highlight one core benefit, include a single prominent CTA, and be spaced logically. The welcome email should be sent immediately after signup.

```
Email 1 — Instant (T=0):
  Subject: "Welcome, Operator. System Calibration Initiated."
  Body: Terminal-style. One CTA: "Complete your first task → [link to Today view]"
  
Email 2 — Day 2:
  Subject: "Your Daily Execution Plan is Ready."
  Body: Screenshot/snapshot of their Today view. CTA: "Open Today"
  Trigger: ONLY if `first_task_completed = false` → add urgency line

Email 3 — Day 4:
  Subject: "Intel Brief: How to Use Brain Dumps Effectively"
  Body: 3-step brain dump guide. CTA: "Run your brain dump → [link]"
  
Email 4 — Day 7:
  Subject: "Your First Operator's Weekly Report"
  Body: Summary of week 1 (tasks done, habit streak). Soft upgrade mention.
  
Email 5 — Day 10:
  Subject: "Unlocking Builder Mode: New Features Available"
  Body: Announce Builder Mode unlock. Show what's new. CTA: "Explore Library"
  
Email 6 — Day 14:
  Subject: "What Are Your Top Operators Doing Differently?"
  Body: 3 best practices from the community. Social proof.
  
Email 7 — Day 21:
  Subject: "You've been operating for 3 weeks. Here's your progress."
  Body: Milestone email. Personalised stats. Soft Pro upgrade CTA.
```

### Sequence 2: "Signal Lost" (Inactivity — 3 emails)
```
Email 1 — Day 8 of inactivity:
  Subject: "System Alert: Signal Lost. Re-engage?"
  Body: Direct, no guilt. One CTA: "Run Diagnostic → [link]"
  
Email 2 — Day 15 of inactivity:
  Subject: "A Simple Fix for Overwhelm"
  Body: Link to Emergency Mode guide. Compassionate tone.
  
Email 3 — Day 30 of inactivity:
  Subject: "Pausing your Momentum Reports"
  Body: "We're keeping your data safe. Come back when ready." + Data export offer.
```

### Sequence 3: "Operator's Dispatch" (Weekly Newsletter)
```
Template structure:
  $ OPERATOR'S DISPATCH :: WEEK [N]
  ─────────────────────────────
  > ONE BIG INSIGHT: (2 paragraphs)
  > TACTICAL TIP: (numbered list, 3 items)
  > NEW BLOG POST: (title + 1 sentence + link)
  > COMMUNITY SHIP OF THE WEEK: (Discord screenshot or quote)
  > SYSTEM STATUS: (brief Resurgo update/changelog)
  ─────────────────────────────
  [CTA: Join Operator Discord →]
```

### Tasks:
- [ ] Build all email templates in HTML (terminal aesthetic: dark bg, monospace, green accents).
- [ ] Configure automations in Listmonk/Resend to trigger based on: signup, last login date, plan type.
- [ ] Test all emails across: Gmail, Outlook, Apple Mail, Mobile Gmail.

---

# ═══════════════════════════════════
# TIER 7: SOCIAL & CONTENT ENGINE
# ═══════════════════════════════════
## Estimated Time: Days 35–50 (ongoing)

---

## 📋 BLOCK 7.0 — N8N CONTENT AUTOMATION

### Setup:
- [ ] Self-host **n8n** on Hetzner (free, same server).
- [ ] Connect: Ghost (new post trigger) → Groq AI (content repurpose) → Buffer (schedule).
- [ ] Create free **Buffer** account + connect: Twitter/X, LinkedIn, (optional: Instagram).

### Workflow (Ghost → Buffer):
```
Trigger: Ghost "New Post Published"
  ↓
Fetch: Full post Markdown
  ↓
Groq Prompt 1: Generate 8-tweet X thread (operator tone, hook first, question at end)
  ↓
Groq Prompt 2: Generate LinkedIn post (professional, 3-5 hashtags)
  ↓
Groq Prompt 3: Generate 3 TikTok/Short video ideas with hooks
  ↓
Format: Structure into Buffer-compatible items
  ↓
Buffer API: Add to queue as DRAFTS (human review before publish)
```

### AI Prompt:
> "Build an n8n workflow: trigger on Ghost new post publication, fetch the post Markdown, call Groq with 3 different prompts to generate (1) an 8-tweet X thread, (2) a LinkedIn post, (3) 3 video ideas. Add each to Buffer via their API as draft posts. Format the X thread as numbered tweets with the first tweet as a strong hook. Include error handling if Groq or Buffer fails."

---

## 📋 BLOCK 7.1 — CONTENT CALENDAR (90 Days)

### Twitter/X strategy (3-5 tweets/day via Buffer):
- [ ] Monday: "Operator Insight" (productivity tip)
- [ ] Tuesday: "Build-in-public" update (Resurgo progress)
- [ ] Wednesday: Blog post thread (auto from n8n)
- [ ] Thursday: "Stack Teardown" (how to build a better system)
- [ ] Friday: "Shipped" post (what you built/improved this week)
- [ ] Weekend: Engagement (polls, questions, community highlights)

### Reddit strategy (manual, value-first):
- [ ] Subreddits: r/solopreneur, r/indiehackers, r/productivity, r/getdisciplined, r/selfimprovement.
- [ ] Rule: Add value for 10 posts before mentioning Resurgo.
- [ ] Share blog posts as helpful resources, not ads.

### Launch strategy:
- [ ] **Product Hunt launch day**: Prepare 5 makers to upvote, launch Tuesday 12:01 AM PST.
- [ ] **Indie Hackers post**: "I built an execution OS for solo operators — here's what I learned."
- [ ] **Hacker News ShowHN**: "Show HN: A terminal-style life OS that turns brain dumps into daily execution plans."

---

# ═══════════════════════════════════
# TIER 8: INTEGRATIONS
# ═══════════════════════════════════
## Estimated Time: Days 40–60

---

## 📋 BLOCK 8.0 — GOOGLE CALENDAR (Two-Way Sync)

### Tasks:
- [ ] OAuth2 flow for Google Calendar API (free, no limits for personal use).
- [ ] **Resurgo → Calendar**: Scheduled focus blocks and tasks with deadlines appear in Google Calendar.
- [ ] **Calendar → Resurgo**: Webhook on new event → AI asks: "I see 'Project Demo' at 3 PM. Add a 'Prepare Demo' task?"
- [ ] Settings: Toggle sync on/off per calendar.

---

## 📋 BLOCK 8.1 — HEALTH & SLEEP INTEGRATION

### Phase 1 (do first): Apple Health + Android Health Connect
- [ ] **Android**: Request `SleepSessionRecord` and `ActivityRecord` from Health Connect API.
- [ ] **iOS**: Request `HKSleepAnalysis` and `HKWorkoutType` from HealthKit.
- [ ] Use sleep data to: adjust today's plan intensity ("Low energy detected: 2 tasks instead of 3").
- [ ] Show sleep score on Today view header.

### Phase 2 (later): Direct Fitbit API
- [ ] OAuth2 Fitbit Web API connection.
- [ ] Fetch: sleep logs, activity, heart rate.
- [ ] Only build if > 10% of users request it (validate first).

---

## 📋 BLOCK 8.2 — GITHUB INTEGRATION

### Tasks:
- [ ] GitHub OAuth + Webhook setup.
- [ ] Connect Resurgo task to GitHub issue.
- [ ] Commit with task ID in message → auto-complete in Resurgo + award XP.
- [ ] Show "Commits today" on Today view for developer users.

---

## 📋 BLOCK 8.3 — SLACK BOT

### Tasks:
- [ ] Slack app (free Slack API tier).
- [ ] Slash command: `/resurgo add [task text]` → creates task.
- [ ] Message action: "Send to Resurgo" → turns any Slack message into a task.
- [ ] Daily digest in personal DM (optional, user-configurable).

---

## 📋 BLOCK 8.4 — EMAIL CAPTURE (MAGIC EMAIL ADDRESS)
- [ ] Generate `[username]@tasks.resurgo.life` for every user.
- [ ] Inbound email processing (use **Cloudflare Email Routing** — free).
- [ ] Email subject → task title. Email body → task description.
- [ ] Show this address in Settings as "Quick capture email."

---

# ═══════════════════════════════════
# TIER 9: WINDOWS DESKTOP APP
# ═══════════════════════════════════
## Estimated Time: Days 55–75

---

## 📋 BLOCK 9.0 — TAURI DESKTOP WRAPPER (Phase 1: Online-Required)

### Tasks:
- [ ] Initialize Tauri project wrapping existing Next.js web app.
- [ ] Add local cache layer: Today view, tasks, habits cached in SQLite (Tauri plugin).
- [ ] Offline state: serve cached data, queue mutations locally.
- [ ] Auto-sync queue when back online.
- [ ] System tray icon: "Resurgo OS — 3 tasks today".
- [ ] Native notifications: morning plan, focus session end, habit reminders.
- [ ] Auto-updater (Tauri built-in).
- [ ] Build targets: Windows (x64 + arm64), macOS (x64 + Apple Silicon), Linux (AppImage).
- [ ] Code-sign for Windows (required for Microsoft Defender to not flag it).

### Phase 2 (V2 — Local First): Plan only, build later
- [ ] Move to CRDT-based sync (ElectricSQL or TinyBase).
- [ ] Full offline mode: all AI features work with local LLM (Ollama).
- [ ] "Air-gapped mode" for privacy-focused users.

---

# ═══════════════════════════════════
# TIER 10: AI COACH TRAINING
# ═══════════════════════════════════
## Estimated Time: Days 15–25 (parallel)

---

## 📋 BLOCK 10.0 — COACH SYSTEM PROMPTS (All 6 Coaches)

### "Product Bible" context to add to all coaches:
```
RESURGO SYSTEM BIBLE:
- App: Life Execution OS for ambitious solo operators
- Core flow: Brain dump → AI plan → Today view → Execute → Review → Adapt
- Users: Solopreneurs, indie hackers, freelancers, creators, digital nomads
- Modes: Starter (simple) → Builder → Power (full features)
- Emergency Mode: Reduces today to 1 task. Always free. Never punish missed streaks.
- XP System: Rewarded for tasks, habits, reviews. Non-punishing. Gamification is encouraging.
- Tone: Calm, direct, operator-like. Never corporate. Never preachy. Never verbose.
- Rule: Always end with 1-3 Action Cards (see schema).
- Rule: If user sounds overwhelmed → suggest Emergency Mode or Simplify Today.
- Rule: Reference their past memory when relevant.
- Rule: Never suggest features that don't exist in Resurgo.
```

### Coach roles:
- [ ] **Ship Coach** (default free): Prioritizes launch/execution. Focused on daily shipping.
- [ ] **Strategy Coach** (Pro): Long-term goal setting, quarterly reviews, business direction.
- [ ] **Momentum Coach** (Pro): Recovery from setbacks. Re-engagement. Motivational but real.
- [ ] **Wellness Coach** (Pro): Sleep, energy, stress. Adapts plans based on health data.
- [ ] **Focus Coach** (Pro): Deep work sessions, Pomodoro, distraction elimination.
- [ ] **Finance Coach** (Pro): Freelance income, client billing, revenue goals. (Unlocks with Budget module)

### Memory system tasks:
- [ ] `user_memory` Convex table: `summary`, `constraints`, `preferences`, `current_goal`, `energy_pattern`, `past_wins`, `past_blockers`.
- [ ] Extract memory from brain dumps automatically (Groq pass after each dump).
- [ ] Show "What Resurgo knows about you" page at `/settings/memory`.
  - Editable, deletable, exportable as JSON.
- [ ] Coaches reference memory: "Last week you mentioned a client deadline — how did that go?"

---

# ═══════════════════════════════════
# MASTER METRICS DASHBOARD
# ═══════════════════════════════════

## 📋 BLOCK 11.0 — WHAT TO MEASURE (YOUR NORTH STAR METRICS)

Set these up in PostHog as a dashboard:

```
ACQUISITION:
  - Signups per day/week
  - Source breakdown (organic/social/direct)
  - Landing page conversion rate per niche page

ACTIVATION (most important):
  - % users who complete onboarding
  - % users who complete first task (target: >60%)
  - Time-to-first-task (target: <5 min)
  - % users who generate first plan

RETENTION:
  - Day 1 retention (target: >50%)
  - Day 7 retention (target: >35%)
  - Day 30 retention (target: >20%)
  - Daily Active / Monthly Active ratio

MONETIZATION:
  - Free → Pro conversion rate (target: 10-15%)
  - MRR growth MoM
  - Churn rate
  - Lifetime value

PLATFORM:
  - API keys generated
  - Monthly API calls
  - MCP connections active
  - VS Code installs
```

---

# ═══════════════════════════════════
# ORDERED EXECUTION TIMELINE
# ═══════════════════════════════════

```
WEEK 1 (Days 1-7):
  ✅ Block 1.0 — Product Truth Document
  ✅ Block 1.1 — Analytics (PostHog + Clarity)
  ✅ Block 1.2 — Error tracking + AI fallbacks
  ✅ Block 2.0 — New onboarding flow (start)
  ✅ Block 10.0 — Coach system prompts + memory schema

WEEK 2 (Days 8-14):
  ✅ Block 2.0 — Finish onboarding (all 4 screens)
  ✅ Block 2.1 — Starter/Builder/Power modes + Library
  ✅ Block 2.2 — Coach Action Cards
  ✅ Block 3.0 — Fix broken vision board (critical)
  ✅ Block 5.0 — Main landing page overhaul

WEEK 3 (Days 15-21):
  ✅ Block 2.3 — Daily retention loop (cron jobs)
  ✅ Block 3.1 — Goal parser (Groq)
  ✅ Block 3.2 — Prompt engineer
  ✅ Block 5.1 — Niche landing pages (start)
  ✅ Block 6.0 — Email infrastructure setup

WEEK 4 (Days 22-28):
  ✅ Block 3.3 — Canvas compositor
  ✅ Block 3.4 — Vision board frontend
  ✅ Block 3.5 — Vision board limits
  ✅ Block 5.1 — Finish all 5 niche pages
  ✅ Block 6.1 — Email sequences (all 3)

WEEK 5-6 (Days 29-42):
  ✅ Block 4.0 — REST API
  ✅ Block 4.1 — API key management
  ✅ Block 5.2 — AEO comparison pages
  ✅ Block 5.3 — Blog setup + first 3 posts
  ✅ Block 7.0 — n8n content automation
  ✅ Block 8.0 — Google Calendar integration

WEEK 7-8 (Days 43-56):
  ✅ Block 4.2 — MCP server
  ✅ Block 4.3 — VS Code extension
  ✅ Block 4.4 — Documentation site
  ✅ Block 8.1 — Health/sleep integration
  ✅ Block 7.1 — Content calendar + social launch
  ✅ Block 8.4 — Magic email address

WEEK 9-10 (Days 57-70):
  ✅ Block 4.4 — WordPress plugin
  ✅ Block 8.2 — GitHub integration
  ✅ Block 8.3 — Slack bot
  ✅ Block 9.0 — Tauri desktop app
  ✅ Block 11.0 — Metrics dashboard
  ✅ Product Hunt + IH launch
```

---

# ONE FINAL RULE

Measure four metrics constantly: completion rate, time-to-value, activation rate, and 7-day retention. SaaS onboarding is the single biggest lever for reducing churn, improving activation, and increasing lifetime value.

> **If you only do one thing from this entire plan:**
> Build Block 2.0 — the new onboarding flow with a guaranteed first win in <5 minutes.
>
> The first 3 days post-signup are critical: users who don't activate during this window are 90% more likely to churn.
>
> Everything else — API, MCP, desktop app, social media — only matters after a new user gets a real win in their first session. That is the foundation everything else is built on.
>
> **Now execute, operator.**

# RESURGO VISION BOARD MAKER: Complete Enhancement Schema
## From Broken Emoji to Powerful Goal Visualization System

**Why This Matters for Resurgo:** Vision boards increase goal achievement by 42% (studies show visualization activates the RAS - Reticular Activating System). For your "Life OS," this becomes the visual manifestation of brain dumps, directly tied to retention and goal completion. Users who create vision boards are 2x more likely to achieve goals and stay engaged.

**Current State:** Random emoji (broken) → **Target State:** AI-generated personalized vision boards combining custom imagery + curated stock photos that adapt to user's goals and progress.

---

## PART 1: TECHNICAL ARCHITECTURE (Free/Open Source Stack)

### Core Schema: Multi-Source Intelligent Composition

```javascript
// Vision Board Generation Pipeline
const VisionBoardSchema = {
  // 1. Input Analysis
  userInput: {
    brainDump: "Original user goals/dreams text",
    parsedGoals: ["goal_1", "goal_2", "goal_3"], // AI-extracted
    categories: ["career", "health", "relationships"], // AI-classified
    emotionalTone: "ambitious/calm/urgent", // Sentiment analysis
    timeframe: "3months/1year/5years"
  },
  
  // 2. Visual Strategy
  imageStrategy: {
    aiGenerated: 40%, // Custom, unique, aspirational
    stockPhotos: 40%, // Professional, realistic
    textOverlays: 20% // Affirmations, milestones
  },
  
  // 3. Layout Engine
  layout: {
    type: "grid/collage/centered/timeline",
    positions: [{image, x, y, size, blend}],
    colorScheme: "extracted from images or terminal green",
    mood: "matches user energy level"
  },
  
  // 4. Generation Pipeline
  pipeline: [
    "analyzeGoals()",
    "generatePrompts()",
    "fetchAIImages()",
    "fetchStockImages()",
    "composeBoard()",
    "addPersonalization()",
    "saveToProfile()"
  ]
}
```

### Best Free Image Generation Stack (Hugging Face)

**Primary Model Recommendations (All Free via HF Inference API):**

1. **Stable Diffusion XL (SDXL) - Best Overall**
   ```javascript
   // HuggingFace Inference API (free tier: 30k chars/month)
   const generateWithSDXL = async (prompt) => {
     const response = await fetch(
       "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
       {
         headers: { Authorization: `Bearer ${HF_TOKEN}` },
         method: "POST",
         body: JSON.stringify({ 
           inputs: prompt,
           parameters: {
             num_inference_steps: 25,
             guidance_scale: 7.5,
             negative_prompt: "low quality, blurry, text, watermark"
           }
         }),
       }
     );
     return await response.blob();
   };
   ```

2. **Playground v2.5 - Best for Photorealistic**
   - Model: `playgroundai/playground-v2.5-1024px-aesthetic`
   - Better for lifestyle/success imagery

3. **OpenJourney - Best for Artistic/Inspirational**
   - Model: `prompthero/openjourney-v4`
   - Great for abstract goal visualization

**Fallback Models (Always Available):**
- `runwayml/stable-diffusion-v1-5` (lightweight, fast)
- `CompVis/stable-diffusion-v1-4` (reliable baseline)

### Stock Image Integration

```javascript
// Multi-source stock API aggregation
const stockImageSources = {
  primary: {
    unsplash: {
      endpoint: "https://api.unsplash.com/search/photos",
      rateLimit: "50/hour",
      quality: "high",
      use: "realistic goals, locations, lifestyle"
    },
    pexels: {
      endpoint: "https://api.pexels.com/v1/search",
      rateLimit: "200/hour", 
      quality: "good",
      use: "backup, variety"
    }
  },
  fallback: {
    pixabay: "https://pixabay.com/api/",
    burst: "shopify.github.io/burst" // Static but free
  }
};

// Smart stock search based on goal parsing
const fetchRelevantStock = async (goal) => {
  const keywords = await extractKeywords(goal); // "lose weight" → ["fitness", "healthy", "transformation"]
  const enhancedQuery = addVisualModifiers(keywords); // Add: "bright", "inspiring", "achievement"
  return await searchMultipleSources(enhancedQuery);
};
```

---

## PART 2: ENHANCED VISION BOARD GENERATION WORKFLOW

### Step 1: Intelligent Goal Analysis
```javascript
// Transform brain dump into visual concepts
const analyzeForVisionBoard = (brainDump) => {
  return {
    // Core goals extraction
    goals: [
      {
        text: "Launch my SaaS to 1000 users",
        category: "career",
        visualConcepts: ["laptop success", "growth chart", "celebration"],
        emotion: "ambitious",
        aiPrompt: "entrepreneur celebrating at modern desk with growth charts, photorealistic, inspiring",
        stockQuery: "startup success entrepreneur"
      },
      {
        text: "Get fit and healthy",
        category: "health",
        visualConcepts: ["running sunrise", "healthy meal", "strong body"],
        emotion: "determined",
        aiPrompt: "athletic person running at sunrise, powerful silhouette, motivational",
        stockQuery: "fitness transformation healthy lifestyle"
      }
    ],
    
    // Overall board theme
    boardTheme: {
      primaryColor: "#00FF41", // Maintain terminal green accent
      mood: "ambitious yet calm",
      style: "modern minimalist with tech aesthetics",
      layout: "dynamic grid" // Based on goal count
    }
  };
};
```

### Step 2: Prompt Engineering for Vision Boards
```javascript
// Generate optimized prompts for each goal
const generateVisionPrompts = (goal) => {
  const basePrompt = `${goal.visualConcept}, photorealistic, inspiring, high quality, 4k`;
  
  // Style modifiers based on user preferences
  const styleModifiers = {
    terminal: "cyber aesthetic, green accent lighting, tech minimalist",
    classic: "professional, clean, aspirational",
    bold: "dramatic lighting, powerful, achievement focused"
  };
  
  // Negative prompts to avoid common issues
  const negativePrompt = "text, words, labels, low quality, blurry, distorted, watermark, logo";
  
  return {
    positive: `${basePrompt}, ${styleModifiers[userStyle]}`,
    negative: negativePrompt
  };
};
```

### Step 3: Intelligent Composition Engine
```javascript
class VisionBoardComposer {
  constructor(images, goals, userProfile) {
    this.canvas = createCanvas(1920, 1080); // HD default
    this.ctx = this.canvas.getContext('2d');
    this.images = images;
    this.goals = goals;
    this.userProfile = userProfile;
  }
  
  async compose() {
    // 1. Smart layout based on goal count
    const layout = this.calculateLayout();
    
    // 2. Place primary goal centrally/largest
    await this.placePrimaryImage(this.images[0], layout.primary);
    
    // 3. Surround with supporting goals
    for (let i = 1; i < this.images.length; i++) {
      await this.placeSecondaryImage(this.images[i], layout.secondary[i-1]);
    }
    
    // 4. Add personalized text overlays
    this.addAffirmations();
    
    // 5. Apply cohesive color grading
    this.applyColorHarmony();
    
    // 6. Add subtle terminal branding
    this.addResurgoBranding();
    
    return this.canvas.toBuffer();
  }
  
  calculateLayout() {
    const layouts = {
      1: "fullscreen",
      2: "split",
      3: "triangle",
      4: "grid",
      5: "collage",
      "6+": "mosaic"
    };
    
    return layoutTemplates[layouts[Math.min(this.goals.length, 6)]];
  }
  
  addAffirmations() {
    // Pull from user's actual progress
    const affirmations = [
      `${this.userProfile.name}, you've already completed ${this.userProfile.completedTasks} tasks`,
      `Your next milestone: ${this.goals[0].nextMilestone}`,
      `${this.userProfile.daysStreak} days of consistent progress`
    ];
    
    // Overlay with terminal-style text
    this.ctx.font = '24px "JetBrains Mono"';
    this.ctx.fillStyle = '#00FF41';
    this.ctx.shadowColor = '#00FF41';
    this.ctx.shadowBlur = 10;
    
    affirmations.forEach((text, i) => {
      this.ctx.fillText(text, 50, 950 + (i * 35));
    });
  }
}
```

### Step 4: Progressive Enhancement Strategy
```javascript
// Start simple, enhance based on engagement
const progressiveVisionBoard = {
  // Level 1: First-time user (simple, fast)
  starter: {
    images: 3,
    sources: "stock only", // Faster, no AI generation wait
    layout: "simple grid",
    generation: "instant"
  },
  
  // Level 2: Engaged user (mixed sources)
  engaged: {
    images: 5,
    sources: "50% AI + 50% stock",
    layout: "dynamic collage",
    personalization: "includes progress metrics"
  },
  
  // Level 3: Power user (fully personalized)
  power: {
    images: 9,
    sources: "70% AI custom generated",
    layout: "adaptive mosaic",
    features: [
      "animated transitions",
      "daily refresh based on progress",
      "AR mode for mobile"
    ]
  }
};
```

---

## PART 3: IMPLEMENTATION PLAN

### Quick Fix (This Week) - Get It Working
```javascript
// Minimal viable vision board
const quickVisionBoard = async (userGoals) => {
  // 1. Parse goals into keywords
  const keywords = userGoals.split(',').map(g => g.trim());
  
  // 2. Fetch 1 stock image per keyword
  const images = await Promise.all(
    keywords.slice(0, 4).map(async (keyword) => {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${keyword}&per_page=1`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }}
      );
      const data = await response.json();
      return data.results[0]?.urls?.regular;
    })
  );
  
  // 3. Create simple grid
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  // 4. Place images in 2x2 grid
  for (let i = 0; i < 4; i++) {
    const img = await loadImage(images[i] || '/placeholder.jpg');
    const x = (i % 2) * 400;
    const y = Math.floor(i / 2) * 300;
    ctx.drawImage(img, x, y, 400, 300);
  }
  
  // 5. Add goal text overlay
  ctx.fillStyle = 'rgba(0, 255, 65, 0.9)';
  ctx.fillRect(0, 550, 800, 50);
  ctx.fillStyle = '#000';
  ctx.font = '20px monospace';
  ctx.fillText('Your 2026 Vision | Powered by Resurgo', 20, 580);
  
  return canvas.toBuffer('image/jpeg');
};
```

### Full Implementation (Next 30 Days)
1. **Week 1:** Fix current broken state with quickVisionBoard above
2. **Week 2:** Integrate Hugging Face SDXL for AI generation
3. **Week 3:** Build intelligent composition engine
4. **Week 4:** Add personalization and progress tracking

### Integration with Resurgo Core
```javascript
// Tie vision boards to goal completion
const visionBoardIntegration = {
  // Generate on goal setting
  onGoalCreated: async (goal) => {
    const board = await generateVisionBoard(goal);
    await saveToProfile(board);
    return { boardUrl: board.url, xpReward: 100 };
  },
  
  // Update as user progresses
  onMilestoneReached: async (milestone) => {
    await updateVisionBoard(milestone);
    await notify("Your vision board evolved! 🎯");
  },
  
  // Daily motivation
  dailyVisionReminder: {
    time: "morning",
    message: "Visualize your success today",
    action: "Opens vision board with progress overlay"
  },
  
  // Share functionality
  shareableBoard: {
    format: "image/video",
    channels: ["twitter", "instagram"],
    hashtags: ["#ResurgoVision", "#LifeOS"]
  }
};
```

---

## PART 4: ADVANCED FEATURES (Future Roadmap)

### 1. AI-Powered Style Transfer
```javascript
// Apply user's preferred aesthetic to all images
const styleTransfer = {
  models: {
    artistic: "CompVis/stable-diffusion-v1-4",
    photorealistic: "playgroundai/playground-v2.5",
    terminal: "custom-trained-terminal-aesthetic"
  }
};
```

### 2. Dynamic Vision Boards
- Auto-update based on completed tasks
- Seasonal variations
- Time-based progression (morning/evening versions)

### 3. AR Vision Board (Mobile)
- Place vision board in physical space
- Daily AR meditation/visualization

### 4. Community Vision Boards
- Share anonymized boards for inspiration
- Vision board templates marketplace

---

## IMMEDIATE ACTION ITEMS

1. **Today:** Implement quickVisionBoard function to replace broken emoji
2. **This Week:** Set up Hugging Face API with fallbacks
3. **Next Week:** Build goal analysis pipeline
4. **This Month:** Launch "Vision Board 2.0" as retention feature

**Metrics to Track:**
- Vision board creation rate
- Daily vision board views
- Correlation with goal completion
- Share rate (viral potential)

This transforms your broken feature into a powerful retention and motivation engine. The vision board becomes a daily touchpoint that keeps users emotionally connected to their goals while maintaining the terminal aesthetic that makes Resurgo unique.


Now I have everything needed. Here is your **comprehensive Vision Board Enhancement Schema** — the most detailed plan possible.

---

# 🎯 RESURGO VISION BOARD MAKER
## Complete Enhancement Schema: From "Random Emoji" to World-Class AI Vision Board Engine

**Research Basis:** Deep scan of FLUX.1 (best free HF model), Pexels/Unsplash/Pixabay APIs, competitor vision board tools (Canva, Venngage, GitMind, Milanote), neuroscience of vision boards, and 2026 image generation best practices.

---

# PART 1: WHY YOUR CURRENT VISION BOARD IS BROKEN (ROOT CAUSE DIAGNOSIS)

Before fixing anything, here's exactly what's wrong and why:

## The Core Problem Stack:
```
Current Flow (BROKEN):
User submits goal → Hugging Face API called → Random/wrong model → Emoji returned

Why it fails:
1. Wrong HF model (likely using a deprecated or incompatible endpoint)
2. No prompt engineering (raw goal text ≠ good image prompt)
3. No fallback system (when HF fails → nothing)
4. No layout/canvas engine (even if image generates, it's one raw image)
5. No stock image blending (Pexels API connected but not orchestrated)
6. No goal-to-visual category mapping (AI doesn't know what to generate)
```

**The Fix:** Replace the single broken API call with a **5-layer intelligent pipeline.**

---

# PART 2: THE ARCHITECTURE — 5-LAYER VISION BOARD ENGINE

```
┌─────────────────────────────────────────────────┐
│           RESURGO VISION BOARD ENGINE            │
│                                                  │
│  Layer 1: GOAL PARSER (Your existing AI/LLM)    │
│     ↓ Extracts categories + visual keywords      │
│                                                  │
│  Layer 2: PROMPT ENGINEER (Auto-builder)         │
│     ↓ Converts keywords → optimized image prompts│
│                                                  │
│  Layer 3: DUAL IMAGE FETCHER (Parallel)          │
│     ├── Branch A: FLUX.1-schnell (HF API)        │
│     └── Branch B: Pexels/Unsplash (Stock)        │
│                                                  │
│  Layer 4: CANVAS COMPOSITOR (Layout Engine)      │
│     ↓ Arranges images into board layout          │
│                                                  │
│  Layer 5: AFFIRMATION OVERLAY (Text + Style)     │
│     ↓ Adds motivational text, quotes, styling    │
└─────────────────────────────────────────────────┘
```

---

# PART 3: LAYER 1 — THE GOAL PARSER

This is the **most important layer**. Your LLM (Groq) already exists — use it.

## Goal → Category Mapping Schema

```typescript
// types/visionBoard.ts

export interface ParsedGoal {
  rawGoal: string;
  categories: VisionCategory[];
  mood: 'ambitious' | 'calm' | 'energetic' | 'luxurious' | 'minimalist';
  colorPalette: ColorPalette;
  timeframe: 'short' | 'medium' | 'long';
}

export interface VisionCategory {
  name: CategoryType;
  weight: number;        // 1-10, how prominent on board
  keywords: string[];    // visual keywords extracted
  emotion: string;       // "freedom", "success", "peace"
  imageSlots: number;    // how many images to generate
}

export type CategoryType =
  | 'career'      // office, success, achievement
  | 'finance'     // abundance, growth, wealth
  | 'health'      // fitness, vitality, energy
  | 'travel'      // adventure, freedom, explore
  | 'relationships' // connection, love, community
  | 'personal_growth' // learning, mindset, evolution
  | 'lifestyle'   // home, luxury, comfort
  | 'creativity'  // art, innovation, expression
  | 'business'    // entrepreneurship, startup, ship
  | 'wellness';   // peace, balance, mindfulness

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  style: 'dark_luxury' | 'clean_minimal' | 'vibrant_bold' | 'soft_pastel' | 'terminal_green';
}
```

## Groq Prompt for Goal Parsing

```typescript
// lib/visionBoard/goalParser.ts

export async function parseGoalForVisionBoard(
  userGoals: string,
  userProfile?: UserProfile
): Promise<ParsedGoal> {
  const prompt = `
You are a vision board AI assistant. Analyze the user's goals and extract structured visual data.

USER GOALS: "${userGoals}"
USER PROFILE CONTEXT: ${JSON.stringify(userProfile?.summary || {})}

Return a JSON object with this EXACT structure:
{
  "categories": [
    {
      "name": "career|finance|health|travel|relationships|personal_growth|lifestyle|creativity|business|wellness",
      "weight": 1-10,
      "keywords": ["3-5 highly visual, specific keywords"],
      "emotion": "one word emotion this category should evoke",
      "imageSlots": 1-3,
      "aiPrompt": "A detailed, cinematic image generation prompt for this category. Be specific about lighting, style, mood. Make it inspiring and aspirational.",
      "stockQuery": "2-3 word Pexels search query for this category"
    }
  ],
  "mood": "ambitious|calm|energetic|luxurious|minimalist",
  "colorPalette": {
    "primary": "#hexcode",
    "secondary": "#hexcode", 
    "accent": "#hexcode",
    "background": "#hexcode",
    "text": "#hexcode",
    "style": "dark_luxury|clean_minimal|vibrant_bold|soft_pastel|terminal_green"
  },
  "affirmations": ["3-5 powerful, personal affirmations based on their goals"],
  "boardTitle": "A 3-5 word inspiring board title",
  "timeframe": "short|medium|long"
}

Rules:
- Max 6 categories (pick most important)
- Total imageSlots across all categories = 6-9
- aiPrompt must be 50-100 words, cinematic, specific
- stockQuery must be simple (e.g. "morning fitness", "luxury office")
- affirmations must feel personal, not generic
- colorPalette should match the mood
- terminal_green style ONLY if user is a developer/operator type

Return ONLY the JSON. No explanation.
`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content);
}
```

---

# PART 4: LAYER 2 — PROMPT ENGINEERING FOR FLUX.1

FLUX.1 follows complex, structured, and multi-section prompts with high accuracy. You can specify layout, composition rules, typography, lighting, and scene constraints more reliably than with earlier diffusion models — giving creators and developers much finer control over the final output.

This means **prompt quality directly determines image quality.** Here's the full prompt engineering system:

## The Vision Board Prompt Formula

```typescript
// lib/visionBoard/promptEngineer.ts

interface PromptTemplate {
  base: string;
  style: string;
  lighting: string;
  composition: string;
  quality: string;
  negative: string;
}

const STYLE_PRESETS: Record<string, PromptTemplate> = {
  dark_luxury: {
    base: '',
    style: 'cinematic dark luxury aesthetic, deep blacks and gold accents, premium editorial photography style',
    lighting: 'dramatic moody lighting, soft rim light, bokeh background',
    composition: 'rule of thirds composition, professional depth of field',
    quality: 'ultra-high resolution, 8k, photorealistic, magazine quality, sharp details',
    negative: 'cartoon, illustration, text, watermark, blurry, distorted, low quality, emoji, clipart'
  },
  clean_minimal: {
    base: '',
    style: 'clean minimalist aesthetic, white space, Scandinavian design influence, airy and bright',
    lighting: 'soft natural daylight, even exposure, clean whites',
    composition: 'centered composition, balanced negative space',
    quality: 'high resolution, crisp, clean, professional lifestyle photography',
    negative: 'clutter, dark shadows, busy backgrounds, text, watermark, noise'
  },
  vibrant_bold: {
    base: '',
    style: 'vibrant bold colors, energetic lifestyle photography, dynamic and inspiring',
    lighting: 'bright natural light, vivid saturation, high contrast',
    composition: 'dynamic diagonal composition, motion energy',
    quality: 'high resolution, vivid, sharp, editorial sports and lifestyle',
    negative: 'dull, muted, static, text, watermark, low energy'
  },
  soft_pastel: {
    base: '',
    style: 'soft pastel aesthetic, dreamy and aspirational, feminine elegance meets modern minimalism',
    lighting: 'golden hour soft light, warm tones, gentle shadows',
    composition: 'lifestyle flat lay or portrait, organic arrangement',
    quality: 'high resolution, soft focus background, warm film aesthetic',
    negative: 'harsh lighting, dark tones, text, watermark, clinical'
  },
  terminal_green: {
    base: '',
    style: 'dark terminal aesthetic, green phosphor glow on black, cyberpunk meets professional, operator energy',
    lighting: 'green bioluminescent ambient light, dark environment, screen glow',
    composition: 'centered power composition, clean lines',
    quality: 'ultra sharp, high contrast, cinematic, digital art quality',
    negative: 'bright colors, pastel, feminine, text overlay, watermark'
  }
};

export function buildFluxPrompt(
  category: VisionCategory,
  style: string,
  userGoalContext: string
): { positive: string; negative: string } {
  const template = STYLE_PRESETS[style] || STYLE_PRESETS.dark_luxury;
  
  const positive = `
    ${category.aiPrompt}. 
    ${template.style}. 
    ${template.lighting}. 
    ${template.composition}. 
    Emotional tone: ${category.emotion}, aspirational and motivating. 
    ${template.quality}.
  `.replace(/\s+/g, ' ').trim();

  return {
    positive,
    negative: template.negative
  };
}

// Category-specific prompt templates (fallbacks)
export const CATEGORY_PROMPT_TEMPLATES: Record<CategoryType, string> = {
  career: "A confident professional in a sleek modern office, standing at floor-to-ceiling windows overlooking a city skyline, success and achievement energy, tailored clothing, warm morning light",
  finance: "Abstract visualization of financial abundance, gold coins and banknotes flowing upward like a fountain, luxury lifestyle symbols, clean white background with gold accents, aspirational wealth aesthetic",
  health: "An athlete in peak physical condition performing a powerful workout at golden hour, dramatic outdoor setting, sweat glistening, raw determination and vitality, motion blur on background",
  travel: "A solo traveler standing at the edge of a breathtaking mountain vista or pristine beach, backpack on, arms outstretched, golden sunset sky, freedom and adventure energy",
  relationships: "Two people sharing a genuine laughing moment in a warm cafe or outdoor setting, authentic connection, soft bokeh background, warm golden tones, genuine emotion",
  personal_growth: "A person meditating on a mountain peak at sunrise, silhouette against golden clouds, evolution and clarity, spiritual and ambitious energy combined",
  lifestyle: "A stunning modern interior space — open plan living room with floor-to-ceiling windows, luxury furniture, city view, aspirational home aesthetic",
  creativity: "An artist or creator in their perfect studio space, surrounded by their work, flow state energy, colorful and inspiring environment, natural light",
  business: "A founder at their standing desk, multiple screens showing dashboards and growth metrics, startup energy meets executive confidence, focused determination",
  wellness: "A serene wellness scene — yoga at sunrise, clean juice, white linen, natural elements, peace and balance, soft morning light, mindful living"
};
```

---

# PART 5: LAYER 3 — DUAL IMAGE FETCHER (The Most Critical Fix)

This is the layer that replaces your broken single API call with a **resilient parallel system.**

## Primary: FLUX.1-schnell via Hugging Face Inference API

FLUX.1 [schnell] is the fastest model, openly available under an Apache 2.0 license. Weights are available on Hugging Face and inference code can be found on GitHub.

One of the easiest ways to use it is via the Hugging Face Inference API — no need for heavy local setup. It's perfect for those without powerful GPUs.

```typescript
// lib/visionBoard/imageGenerators/fluxGenerator.ts

const HF_MODELS = {
  primary: 'black-forest-labs/FLUX.1-schnell',    // Fast, Apache 2.0, FREE
  fallback1: 'stabilityai/stable-diffusion-xl-base-1.0', // Free fallback
  fallback2: 'runwayml/stable-diffusion-v1-5',    // Lightweight fallback
};

interface GenerationResult {
  imageUrl: string;
  source: 'flux' | 'sdxl' | 'sd15' | 'stock';
  model: string;
  cached: boolean;
}

export async function generateWithFlux(
  prompt: string,
  negativePrompt: string,
  options: {
    width?: number;
    height?: number;
    steps?: number;
    seed?: number;
  } = {}
): Promise<GenerationResult> {
  const { width = 768, height = 768, steps = 4 } = options;

  // Try models in priority order
  const models = [HF_MODELS.primary, HF_MODELS.fallback1, HF_MODELS.fallback2];
  
  for (const model of models) {
    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: negativePrompt,
              width,
              height,
              num_inference_steps: model.includes('schnell') ? 4 : 20,
              guidance_scale: model.includes('schnell') ? 0.0 : 7.5,
              seed: options.seed || Math.floor(Math.random() * 1000000),
            },
          }),
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );

      if (!response.ok) {
        // Handle model loading (HF cold start)
        if (response.status === 503) {
          const error = await response.json();
          if (error.estimated_time) {
            // Model is loading - wait and retry once
            await new Promise(resolve => 
              setTimeout(resolve, Math.min(error.estimated_time * 1000, 20000))
            );
            continue; // retry same model
          }
        }
        throw new Error(`HF API error: ${response.status}`);
      }

      const blob = await response.blob();
      const buffer = Buffer.from(await blob.arrayBuffer());
      
      // Upload to your storage (Convex or Vercel Blob)
      const imageUrl = await uploadToStorage(buffer, `vision-board-${Date.now()}.png`);
      
      return {
        imageUrl,
        source: 'flux',
        model,
        cached: false,
      };

    } catch (error) {
      console.error(`Failed with model ${model}:`, error);
      continue; // Try next model
    }
  }

  // All AI models failed - return null to trigger stock image fallback
  throw new Error('All AI generation models failed');
}
```

## Secondary (Fallback + Blending): Stock Image APIs

Use Unsplash if visual quality matters most. Use Pexels if you want the easiest all-purpose free API. Use Pixabay if you want to download and cache files from your own infrastructure.

Pexels is rate-limited to 200 requests per hour and 20,000 requests per month by default. You may contact them to request a higher limit. If you meet their API terms, you can get unlimited requests for free.

```typescript
// lib/visionBoard/imageGenerators/stockFetcher.ts

interface StockImage {
  url: string;
  photographer: string;
  source: 'pexels' | 'unsplash' | 'pixabay';
  attributionRequired: boolean;
}

export async function fetchStockImages(
  query: string,
  count: number = 3,
  orientation: 'landscape' | 'portrait' | 'square' = 'landscape'
): Promise<StockImage[]> {
  
  // Try Pexels first (easiest, free, good quality)
  try {
    const pexelsResults = await fetchFromPexels(query, count, orientation);
    if (pexelsResults.length >= count) return pexelsResults;
  } catch (e) {
    console.error('Pexels failed:', e);
  }

  // Fallback to Unsplash
  try {
    const unsplashResults = await fetchFromUnsplash(query, count, orientation);
    if (unsplashResults.length > 0) return unsplashResults;
  } catch (e) {
    console.error('Unsplash failed:', e);
  }

  // Last resort: Pixabay
  return await fetchFromPixabay(query, count);
}

async function fetchFromPexels(
  query: string,
  count: number,
  orientation: string
): Promise<StockImage[]> {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=${orientation}&size=large`,
    {
      headers: { 'Authorization': process.env.PEXELS_API_KEY! }
    }
  );

  if (!response.ok) throw new Error('Pexels error');
  
  const data = await response.json();
  
  return data.photos.map((photo: any) => ({
    url: photo.src.large2x || photo.src.large,
    photographer: photo.photographer,
    source: 'pexels' as const,
    attributionRequired: true,
  }));
}

async function fetchFromUnsplash(
  query: string,
  count: number,
  orientation: string
): Promise<StockImage[]> {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=${orientation}&content_filter=high`,
    {
      headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
    }
  );

  if (!response.ok) throw new Error('Unsplash error');
  
  const data = await response.json();
  
  return data.results.map((photo: any) => ({
    url: photo.urls.regular,
    photographer: photo.user.name,
    source: 'unsplash' as const,
    attributionRequired: true,
  }));
}
```

## The Intelligent Orchestrator (Combining Both Sources)

```typescript
// lib/visionBoard/imageOrchestrator.ts

export async function fetchImagesForCategory(
  category: VisionCategory,
  style: string,
  strategy: 'ai_primary' | 'stock_primary' | 'hybrid' = 'hybrid'
): Promise<CategoryImages> {
  
  const { positive, negative } = buildFluxPrompt(category, style, '');
  const results: GeneratedImage[] = [];

  if (strategy === 'ai_primary' || strategy === 'hybrid') {
    // Try AI generation for hero image
    try {
      const aiImage = await generateWithFlux(positive, negative, {
        width: 768,
        height: 512,
        steps: 4,
      });
      results.push({ ...aiImage, role: 'hero' });
    } catch {
      // Silently fall through to stock
    }
  }

  // Fill remaining slots with stock images
  const stockNeeded = category.imageSlots - results.length;
  if (stockNeeded > 0) {
    try {
      const stockImages = await fetchStockImages(
        category.stockQuery,
        stockNeeded,
        'landscape'
      );
      results.push(...stockImages.map(img => ({ 
        ...img, 
        role: results.length === 0 ? 'hero' : 'supporting' 
      })));
    } catch {
      // Use placeholder
      results.push({
        imageUrl: `/placeholders/${category.name}.jpg`,
        source: 'placeholder',
        role: 'hero',
      });
    }
  }

  return { category, images: results };
}
```

---

# PART 6: LAYER 4 — THE CANVAS COMPOSITOR

This is what transforms individual images into an actual **beautiful vision board layout.**

## Layout Templates (React/CSS Grid)

```typescript
// components/VisionBoard/layouts.ts

export type LayoutType = 
  | 'operator_grid'      // Terminal-style, 3x3 grid with borders
  | 'magazine_collage'   // Overlapping, editorial feel
  | 'zen_minimal'        // Lots of space, 2x3 clean
  | 'power_asymmetric'   // One hero image + supporting grid
  | 'timeline_strip'     // Horizontal timeline of goals

export interface BoardLayout {
  type: LayoutType;
  slots: LayoutSlot[];
  background: string;
  dimensions: { width: number; height: number };
}

export interface LayoutSlot {
  id: string;
  x: number;       // percentage position
  y: number;
  width: number;   // percentage width
  height: number;
  zIndex: number;
  rotation?: number;
  borderRadius?: string;
  categoryName: CategoryType;
  role: 'hero' | 'supporting' | 'accent';
  overlayText?: string;  // affirmation text to overlay
  overlayPosition?: 'top' | 'center' | 'bottom';
}

// Pre-defined layouts
export const LAYOUTS: Record<LayoutType, BoardLayout> = {
  
  operator_grid: {
    type: 'operator_grid',
    dimensions: { width: 1200, height: 800 },
    background: '#0a0a0a',
    slots: [
      { id: 'slot-1', x: 0, y: 0, width: 50, height: 60, zIndex: 1, role: 'hero', categoryName: 'career', borderRadius: '0' },
      { id: 'slot-2', x: 50, y: 0, width: 25, height: 60, zIndex: 1, role: 'supporting', categoryName: 'finance', borderRadius: '0' },
      { id: 'slot-3', x: 75, y: 0, width: 25, height: 60, zIndex: 1, role: 'supporting', categoryName: 'health', borderRadius: '0' },
      { id: 'slot-4', x: 0, y: 60, width: 33.33, height: 40, zIndex: 1, role: 'supporting', categoryName: 'lifestyle', borderRadius: '0' },
      { id: 'slot-5', x: 33.33, y: 60, width: 33.33, height: 40, zIndex: 1, role: 'supporting', categoryName: 'travel', borderRadius: '0' },
      { id: 'slot-6', x: 66.66, y: 60, width: 33.34, height: 40, zIndex: 1, role: 'accent', categoryName: 'personal_growth', borderRadius: '0' },
    ]
  },

  power_asymmetric: {
    type: 'power_asymmetric',
    dimensions: { width: 1200, height: 800 },
    background: '#111111',
    slots: [
      { id: 'slot-1', x: 0, y: 0, width: 60, height: 100, zIndex: 1, role: 'hero', categoryName: 'career', borderRadius: '8px' },
      { id: 'slot-2', x: 61, y: 0, width: 39, height: 48, zIndex: 1, role: 'supporting', categoryName: 'finance', borderRadius: '8px' },
      { id: 'slot-3', x: 61, y: 51, width: 19, height: 49, zIndex: 1, role: 'supporting', categoryName: 'health', borderRadius: '8px' },
      { id: 'slot-4', x: 81, y: 51, width: 19, height: 49, zIndex: 1, role: 'accent', categoryName: 'lifestyle', borderRadius: '8px' },
    ]
  },

  magazine_collage: {
    type: 'magazine_collage',
    dimensions: { width: 1200, height: 900 },
    background: '#f5f0eb',
    slots: [
      { id: 'slot-1', x: 5, y: 5, width: 45, height: 55, zIndex: 2, role: 'hero', rotation: -2, categoryName: 'career', borderRadius: '4px' },
      { id: 'slot-2', x: 48, y: 3, width: 35, height: 40, zIndex: 3, role: 'supporting', rotation: 1.5, categoryName: 'travel', borderRadius: '4px' },
      { id: 'slot-3', x: 82, y: 8, width: 15, height: 30, zIndex: 1, role: 'accent', rotation: -1, categoryName: 'health', borderRadius: '4px' },
      { id: 'slot-4', x: 10, y: 58, width: 30, height: 38, zIndex: 2, role: 'supporting', rotation: 2, categoryName: 'lifestyle', borderRadius: '4px' },
      { id: 'slot-5', x: 42, y: 52, width: 40, height: 45, zIndex: 3, role: 'supporting', rotation: -1.5, categoryName: 'finance', borderRadius: '4px' },
    ]
  },

  zen_minimal: {
    type: 'zen_minimal',
    dimensions: { width: 1200, height: 800 },
    background: '#fafafa',
    slots: [
      { id: 'slot-1', x: 2, y: 3, width: 47, height: 94, zIndex: 1, role: 'hero', categoryName: 'personal_growth', borderRadius: '12px' },
      { id: 'slot-2', x: 52, y: 3, width: 23, height: 45, zIndex: 1, role: 'supporting', categoryName: 'health', borderRadius: '12px' },
      { id: 'slot-3', x: 77, y: 3, width: 21, height: 45, zIndex: 1, role: 'supporting', categoryName: 'travel', borderRadius: '12px' },
      { id: 'slot-4', x: 52, y: 52, width: 46, height: 45, zIndex: 1, role: 'accent', categoryName: 'lifestyle', borderRadius: '12px' },
    ]
  },
};

// Smart layout selector
export function selectBestLayout(
  parsedGoal: ParsedGoal,
  categoryCount: number
): LayoutType {
  if (parsedGoal.colorPalette.style === 'terminal_green') return 'operator_grid';
  if (parsedGoal.mood === 'ambitious') return 'power_asymmetric';
  if (parsedGoal.mood === 'calm') return 'zen_minimal';
  if (categoryCount >= 5) return 'magazine_collage';
  return 'power_asymmetric';
}
```

---

# PART 7: LAYER 5 — AFFIRMATION OVERLAY + STYLING ENGINE

```typescript
// components/VisionBoard/AffirmationOverlay.tsx

interface AffirmationConfig {
  text: string;
  font: string;
  size: number;
  color: string;
  position: 'top-left' | 'center' | 'bottom-right' | 'bottom-left';
  background: string;  // semi-transparent overlay
  style: 'terminal' | 'serif_elegant' | 'sans_bold' | 'handwriting';
}

const FONT_PRESETS = {
  terminal: {
    font: '"JetBrains Mono", monospace',
    prefix: '> ',
    suffix: '_',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  serif_elegant: {
    font: '"Playfair Display", serif',
    prefix: '"',
    suffix: '"',
    textTransform: 'none',
    letterSpacing: '0.02em',
  },
  sans_bold: {
    font: '"Inter", sans-serif',
    prefix: '',
    suffix: '',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
  },
};

export function buildAffirmationOverlays(
  affirmations: string[],
  slots: LayoutSlot[],
  style: string
): AffirmationConfig[] {
  const fontPreset = FONT_PRESETS[style === 'terminal_green' ? 'terminal' : 'serif_elegant'];
  
  // Place affirmations on accent/supporting slots
  const affirmationSlots = slots.filter(s => s.role !== 'hero').slice(0, affirmations.length);
  
  return affirmationSlots.map((slot, i) => ({
    text: `${fontPreset.prefix}${affirmations[i]}${fontPreset.suffix}`,
    font: fontPreset.font,
    size: 14,
    color: style === 'terminal_green' ? '#00FF41' : '#ffffff',
    position: 'bottom-left',
    background: 'rgba(0,0,0,0.5)',
    style: style === 'terminal_green' ? 'terminal' : 'serif_elegant',
  }));
}
```

---

# PART 8: THE COMPLETE REACT VISION BOARD COMPONENT

```tsx
// components/VisionBoard/VisionBoardMaker.tsx

'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';

export default function VisionBoardMaker() {
  const [step, setStep] = useState<'input' | 'generating' | 'editing' | 'complete'>('input');
  const [goals, setGoals] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('dark_luxury');
  const [boardData, setBoardData] = useState<VisionBoardData | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');

  const STYLE_OPTIONS = [
    { id: 'dark_luxury', label: 'Dark Luxury', icon: '◈', preview: 'bg-black border-yellow-500' },
    { id: 'terminal_green', label: 'Operator OS', icon: '$', preview: 'bg-black border-green-500' },
    { id: 'clean_minimal', label: 'Clean Minimal', icon: '○', preview: 'bg-white border-gray-300' },
    { id: 'vibrant_bold', label: 'Vibrant Bold', icon: '◆', preview: 'bg-orange-500 border-red-500' },
    { id: 'soft_pastel', label: 'Soft Pastel', icon: '◇', preview: 'bg-pink-100 border-pink-300' },
  ];

  async function generateBoard() {
    setStep('generating');
    setGenerationProgress(0);

    try {
      // Step 1: Parse goals
      setGenerationStatus('$ ANALYZING GOALS...');
      setGenerationProgress(10);
      const parsedGoal = await parseGoalForVisionBoard(goals);
      
      // Step 2: Fetch images for each category
      const totalCategories = parsedGoal.categories.length;
      const categoryImages = [];

      for (let i = 0; i < parsedGoal.categories.length; i++) {
        const category = parsedGoal.categories[i];
        setGenerationStatus(`$ GENERATING: ${category.name.toUpperCase()}...`);
        setGenerationProgress(20 + (i / totalCategories) * 60);
        
        const images = await fetchImagesForCategory(category, selectedStyle, 'hybrid');
        categoryImages.push(images);
      }

      // Step 3: Build layout
      setGenerationStatus('$ COMPOSITING BOARD...');
      setGenerationProgress(85);
      
      const layoutType = selectBestLayout(parsedGoal, parsedGoal.categories.length);
      const layout = LAYOUTS[layoutType];
      
      // Step 4: Build board data
      setGenerationStatus('$ FINALIZING...');
      setGenerationProgress(95);

      const board: VisionBoardData = {
        id: `board-${Date.now()}`,
        title: parsedGoal.boardTitle,
        layout,
        categoryImages,
        affirmations: parsedGoal.affirmations,
        colorPalette: parsedGoal.colorPalette,
        style: selectedStyle,
        createdAt: new Date().toISOString(),
      };

      setBoardData(board);
      setGenerationProgress(100);
      setGenerationStatus('$ BOARD READY ✓');
      
      setTimeout(() => setStep('editing'), 500);

    } catch (error) {
      setGenerationStatus('$ ERROR: Retrying with fallback...');
      // Handle gracefully
    }
  }

  if (step === 'input') {
    return (
      <div className="vision-board-maker font-mono bg-black text-green-400 min-h-screen p-6">
        {/* Terminal header */}
        <div className="border border-green-500/30 p-4 mb-6">
          <div className="text-xs text-green-500/60 mb-2">
            $ resurgo --module vision-board --status ACTIVE
          </div>
          <h1 className="text-xl font-bold text-green-400">
            VISION_BOARD_GENERATOR.exe
          </h1>
          <p className="text-sm text-green-400/60 mt-1">
            AI turns your goals into a visual execution map.
          </p>
        </div>

        {/* Style selector */}
        <div className="mb-6">
          <label className="text-xs text-green-500/60 block mb-3">
            &gt; SELECT_AESTHETIC:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {STYLE_OPTIONS.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 border text-xs transition-all ${
                  selectedStyle === style.id 
                    ? 'border-green-400 text-green-400 bg-green-400/10' 
                    : 'border-green-500/20 text-green-500/50 hover:border-green-500/50'
                }`}
              >
                <div className="text-lg mb-1">{style.icon}</div>
                <div className="leading-tight">{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Goal input */}
        <div className="mb-6">
          <label className="text-xs text-green-500/60 block mb-2">
            &gt; DUMP_GOALS (be specific — AI will extract the visuals):
          </label>
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder={`Launch my SaaS to $10k MRR
Get to 15% body fat, train 4x/week
Travel to Japan for 2 weeks
Build consistent morning routine
Land 3 high-value clients by Q3`}
            className="w-full bg-black border border-green-500/30 text-green-400 p-4 font-mono text-sm resize-none focus:border-green-400 focus:outline-none placeholder-green-500/20 min-h-[160px]"
          />
        </div>

        {/* Generate button */}
        <button
          onClick={generateBoard}
          disabled={goals.length < 20}
          className="w-full border border-green-400 text-green-400 py-4 font-mono text-sm hover:bg-green-400 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          $ GENERATE_VISION_BOARD --ai --stock --compose
        </button>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="generating-screen font-mono bg-black text-green-400 min-h-screen p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-xs text-green-500/60 mb-8">
            RESURGO.OS :: VISION_BOARD_ENGINE
          </div>
          
          {/* Progress bar */}
          <div className="border border-green-500/30 p-1 mb-4">
            <div 
              className="h-2 bg-green-400 transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
          
          <div className="text-sm mb-2">{generationStatus}</div>
          <div className="text-xs text-green-500/40">
            {generationProgress < 30 && 'Extracting visual categories from your goals...'}
            {generationProgress >= 30 && generationProgress < 80 && 'Generating AI images + curating stock photos...'}
            {generationProgress >= 80 && 'Compositing final board layout...'}
          </div>

          {/* Fun loading details */}
          <div className="mt-8 text-xs text-green-500/30 font-mono">
            <div>MODEL: black-forest-labs/FLUX.1-schnell</div>
            <div>STOCK: Pexels API v1</div>
            <div>LAYOUT: {selectedStyle.toUpperCase()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Editing and complete states render the actual board...
  return <VisionBoardCanvas boardData={boardData!} />;
}
```

---

# PART 9: COMPLETE API ROUTE (Next.js)

```typescript
// app/api/vision-board/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { goals, style, userId } = await req.json();

  // Rate limiting (free: 2 boards/month, Pro: unlimited)
  const userTier = await getUserTier(userId);
  const boardCount = await getBoardCountThisMonth(userId);
  
  if (userTier === 'free' && boardCount >= 2) {
    return NextResponse.json(
      { 
        error: 'Board limit reached',
        upgradeMessage: 'Upgrade to Pro for unlimited vision boards',
        remainingBoards: 0 
      },
      { status: 429 }
    );
  }

  try {
    // Step 1: Parse goals with Groq
    const parsedGoal = await parseGoalForVisionBoard(goals);
    
    // Step 2: Generate all images in parallel (with limits)
    const imagePromises = parsedGoal.categories.map(category =>
      fetchImagesForCategory(category, style, 'hybrid')
    );
    
    // Use Promise.allSettled so one failure doesn't kill everything
    const imageResults = await Promise.allSettled(imagePromises);
    
    const categoryImages = imageResults.map((result, i) => {
      if (result.status === 'fulfilled') return result.value;
      // Fallback: use stock only
      return {
        category: parsedGoal.categories[i],
        images: [{ 
          imageUrl: `/placeholders/${parsedGoal.categories[i].name}.jpg`,
          source: 'placeholder' 
        }]
      };
    });

    // Step 3: Select layout
    const layoutType = selectBestLayout(parsedGoal, parsedGoal.categories.length);
    
    // Step 4: Build board
    const board = {
      id: `board_${Date.now()}`,
      title: parsedGoal.boardTitle,
      style,
      layout: LAYOUTS[layoutType],
      categories: categoryImages,
      affirmations: parsedGoal.affirmations,
      palette: parsedGoal.colorPalette,
      metadata: {
        generatedAt: new Date().toISOString(),
        userId,
        goals: goals.substring(0, 200),
      }
    };

    // Save to Convex
    await saveBoardToDatabase(board, userId);
    
    // Increment count
    await incrementBoardCount(userId);

    return NextResponse.json({ 
      success: true, 
      board,
      remainingBoards: userTier === 'free' ? 2 - boardCount - 1 : 'unlimited'
    });

  } catch (error) {
    console.error('Vision board generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed', fallback: true },
      { status: 500 }
    );
  }
}
```

---

# PART 10: THE MODEL SELECTION GUIDE (Free Tier Strategy)

One of the most mentioned names in image generation is Stable Diffusion, which comes with a series of open-source visual generation models, like Stable Diffusion 1.4, XL and 3.5 Large.

FLUX.1.1 is celebrated for its speed and efficiency, offering six times faster performance than its predecessors. It excels in image quality, prompt adherence, and diversity.

## Model Priority Stack for Resurgo Vision Boards:

| Priority | Model | HF ID | Speed | Quality | Cost | Best For |
|----------|-------|--------|-------|---------|------|---------|
| **1st** | FLUX.1-schnell | `black-forest-labs/FLUX.1-schnell` | ⚡ 4 steps | ★★★★★ | Free (HF token) | Hero images |
| **2nd** | SDXL Base | `stabilityai/stable-diffusion-xl-base-1.0` | Medium | ★★★★ | Free | Supporting images |
| **3rd** | SD 1.5 | `runwayml/stable-diffusion-v1-5` | Fast | ★★★ | Free | Fallback |
| **Stock A** | Pexels | REST API | Instant | ★★★★★ | Free (200/hr) | Any category |
| **Stock B** | Unsplash | REST API | Instant | ★★★★★ | Free | Lifestyle/nature |
| **Stock C** | Pixabay | REST API | Instant | ★★★★ | Free (unlimited) | Broad coverage |

---

# PART 11: MONETIZATION INTEGRATION (Vision Board as Retention Tool)

When users repeatedly see their vision board, the brain's reticular activating system tunes awareness toward people, opportunities, and ideas that support their goals. Additionally, visualization activates the prefrontal cortex — the executive area responsible for planning and decision-making.

This is **gold for retention.** Vision boards aren't decoration — they're neuroscience-backed retention tools.

## Free vs Pro Vision Board Tiers:

```
FREE TIER:
├── 2 boards per month
├── 3 layout options
├── Pexels stock images only
├── 3 affirmations max
├── Download as JPEG
└── Resurgo watermark

PRO TIER:
├── Unlimited boards
├── All 5 layout styles
├── FLUX.1 AI generation (hero images)
├── All 3 stock APIs
├── Unlimited affirmations
├── Download as PNG (4K)
├── Set as app homescreen wallpaper
├── Auto-regenerate quarterly
├── No watermark
└── Board linked to goal progress (XP integration)
```

---

# PART 12: IMPLEMENTATION CHECKLIST

### Week 1 (The Fix):
- [ ] Replace broken HF endpoint with `FLUX.1-schnell` correct API URL
- [ ] Add 30-second timeout + model loading retry logic
- [ ] Add SDXL + SD1.5 fallback chain
- [ ] Add Pexels API as guaranteed fallback
- [ ] Test: every board generation succeeds (never returns emoji)

### Week 2 (The Enhancement):
- [ ] Build `goalParser.ts` (Groq → structured visual data)
- [ ] Build `promptEngineer.ts` (structured → FLUX prompts)
- [ ] Build canvas compositor (5 layout templates)
- [ ] Add affirmation overlay engine
- [ ] Style presets (5 aesthetics)

### Week 3 (The Polish):
- [ ] Build React VisionBoardMaker component
- [ ] Add generation progress terminal UI
- [ ] Add editing mode (swap images, edit affirmations)
- [ ] Add export (PNG download)
- [ ] Mobile responsive board viewer

### Week 4 (The Ecosystem):
- [ ] Link board to user goals (Convex schema)
- [ ] Add "Set as dashboard wallpaper" feature
- [ ] Add quarterly auto-regeneration (Pro)
- [ ] Add "Share board" social feature
- [ ] Analytics: track board views → retention correlation

---

# SUMMARY: FROM EMOJI TO WORLD-CLASS

| Before | After |
|--------|-------|
| Random emoji from broken API | FLUX.1-schnell AI images + curated Pexels stock |
| No prompt engineering | 100-word cinematic prompts with style presets |
| Single point of failure | 5-layer fallback (FLUX → SDXL → SD1.5 → Pexels → Unsplash → Pixabay) |
| No layout | 5 board layouts (terminal, asymmetric, collage, minimal, timeline) |
| No personalization | Groq parses goals → categories → custom prompts → matching palette |
| No text/affirmations | AI-generated personal affirmations overlaid in brand typography |
| No monetization | Free (2/mo + watermark) → Pro (unlimited + AI + 4K export) |
| No retention link | Board linked to goals, XP, progress → daily reminder loop |

**The vision board becomes the most emotional, shareable, and retention-driving feature in Resurgo.** Every user who generates one has a personalized visual reason to return every single day.