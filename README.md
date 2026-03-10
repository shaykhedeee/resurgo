# 🚀 RESURGO — AI-Powered Life Transformation System

<div align="center">
  <img src="public/icons/icon.svg" alt="RESURGO Logo" width="120" height="120" />
  <br /><br />
  <strong>Rise to Your Potential</strong>
  <br />
  <em>Intelligent goal decomposition · Habit tracking · Gamified progress · AI coaching</em>
  <br /><br />

  ![CI](https://github.com/shaykhedeee/resurgo/actions/workflows/ci.yml/badge.svg)
  ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Convex](https://img.shields.io/badge/Convex-1.31-purple)
</div>

---

## ✨ Features

| Feature | Free | Pro | Lifetime |
|---|---|---|---|
| 🎯 AI Goal Decomposition | ✅ (3 goals) | ✅ Unlimited | ✅ Unlimited |
| 📊 Habit Tracking | ✅ (10 habits) | ✅ Unlimited | ✅ Unlimited |
| 🎮 Gamification (XP, Levels, Badges) | ✅ | ✅ | ✅ |
| 📅 Interactive Calendar | ✅ | ✅ | ✅ |
| 🤖 AI Life Coach (Kai) | ✅ Basic | ✅ Advanced | ✅ Advanced |
| 📈 Advanced Analytics | ❌ | ✅ | ✅ |
| 💾 Data Export (JSON / PDF) | ❌ | ✅ | ✅ |
| 🌙 Dark / Light Theme | ✅ | ✅ | ✅ |
| 📱 Native Android App (PWA) | ✅ | ✅ | ✅ |
| 🔔 Push Notifications | ✅ | ✅ | ✅ |
| 🏃 Focus Timer (Pomodoro / Deep Work) | ✅ | ✅ | ✅ |
| 🧠 Vision Board | ❌ | ✅ | ✅ |
| 💰 Budget Tracker | ❌ | ✅ | ✅ |
| 🍽️ Nutrition & Wellness | ❌ | ✅ | ✅ |

### 🎯 AI Goal Decomposition
Transform any life goal into a structured action plan in seconds. RESURGO's multi-provider AI (Groq, Gemini, OpenRouter) breaks down your ultimate goal into:
- **Milestones** — major checkpoints
- **Weekly objectives** — manageable weekly targets
- **Daily tasks** — concrete next actions

### 🎮 Gamification Engine
- Earn XP for every completed task and habit
- 16-level progression system with meaningful titles (Novice → Legendary)
- Achievement badges, streak rewards, and daily challenges
- Leaderboards and social accountability (coming soon)

### 🤖 AI Life Coach (Kai)
- Personalised morning briefings and evening reflections
- Archetype detection to match your coaching style
- Brain-dump → structured tasks conversion
- Proactive habit suggestions based on your goals

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Components) |
| **Language** | TypeScript 5 (strict mode) |
| **Auth** | Clerk (social login, MFA, billing) |
| **Backend / Database** | Convex (real-time reactive database) |
| **Styling** | Tailwind CSS 3 + Radix UI primitives |
| **State Management** | Convex queries + Zustand (UI only) |
| **Charts** | Recharts |
| **AI** | Groq / Gemini / OpenRouter (multi-provider fallback) |
| **Payments** | DodoPayments + Clerk Billing |
| **Mobile** | Capacitor 8 (Android APK) |
| **Notifications** | Capacitor Push Notifications |
| **PDF / Export** | jsPDF + jspdf-autotable |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Testing** | Jest + Testing Library |
| **CI/CD** | GitHub Actions |
| **Hosting** | Vercel (recommended) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20.x or later
- **npm** 10.x or later
- A free [Convex](https://convex.dev) account
- A free [Clerk](https://clerk.dev) account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/shaykhedeee/resurgo.git
cd resurgo

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env.local
# Edit .env.local and fill in your keys (see below)

# 4. Start the development server (starts Convex + Next.js)
npm run dev
```

The app will be available at `http://localhost:3000`.

### Environment Variables

Copy `.env.example` to `.env.local` and populate the values:

```env
# ── Clerk (Authentication) ───────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# ── Convex (Backend / Database) ──────────────────────────────────────────────
CONVEX_DEPLOYMENT=dev:your-project-slug
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# ── AI Providers (server-side only — never expose to the client) ─────────────
GROQ_API_KEY=gsk_...
GOOGLE_AI_STUDIO_KEY=AIza...
OPENROUTER_API_KEY=sk-or-...

# ── Payments ─────────────────────────────────────────────────────────────────
BILLING_WEBHOOK_SYNC_SECRET=...
NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL=https://...
NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL=https://...
NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL=https://...
NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL=https://...
```

> **Tip:** The app runs without AI keys (falls back to limited AI behaviour), but full billing features require Clerk + Convex configured.

---

## 📦 Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub.
2. Import your repo at [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.local` in the Vercel dashboard.
4. Vercel auto-detects Next.js — click **Deploy**.

### Build Locally

```bash
# Type-check + build (mirrors CI)
npm run verify:deploy

# Or just build
npm run build
npm run start
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

### Android APK

```bash
# Sync web assets to the Android project
npm run android:sync

# Build a debug APK (requires Android SDK)
npm run android:build

# Or use GitHub Actions — see .github/workflows/build-android-apk.yml
```

---

## 📁 Project Structure

```
resurgo/
├── convex/                     # Convex backend (real-time DB + functions)
│   ├── schema.ts               # Complete database schema
│   ├── goals.ts                # Goal CRUD + AI decomposition hooks
│   ├── habits.ts               # Habit engine + streak calculation
│   ├── tasks.ts                # Task management + Eisenhower matrix
│   ├── focusSessions.ts        # Focus / Pomodoro timer sessions
│   ├── gamification.ts         # XP, levels, badges, achievements
│   ├── wellness.ts             # Mood, sleep, fitness tracking
│   ├── coachAI.ts              # AI coaching messages
│   ├── payments.ts             # DodoPayments integration
│   ├── referrals.ts            # Referral programme
│   └── crons.ts                # Scheduled background jobs
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Auth-gated dashboard routes
│   │   │   ├── dashboard/      # Home dashboard
│   │   │   ├── goals/          # Goal management + [id] detail view
│   │   │   ├── habits/         # Habit tracker
│   │   │   ├── tasks/          # Task manager
│   │   │   ├── focus/          # Focus timer
│   │   │   ├── calendar/       # Activity calendar
│   │   │   ├── analytics/      # Stats + charts
│   │   │   ├── wellness/       # Mood + health tracking
│   │   │   ├── coach/          # AI life coach
│   │   │   ├── vision-board/   # Vision board
│   │   │   ├── budget/         # Budget tracker
│   │   │   └── settings/       # Account & preferences
│   │   ├── (marketing)/        # Public marketing pages
│   │   │   ├── pricing/        # Pricing page
│   │   │   ├── blog/           # Blog + RSS feed
│   │   │   ├── features/       # Feature showcase
│   │   │   └── docs/           # Documentation
│   │   └── api/
│   │       ├── ai/             # AI chat, decompose, suggestions
│   │       ├── chatbot/        # Kai chatbot endpoint
│   │       ├── webhooks/       # Clerk & payment webhooks
│   │       └── health/         # Health check endpoint
│   ├── components/             # Shared UI components
│   ├── hooks/                  # Custom React hooks
│   │   ├── useStoreUser.ts     # Clerk → Convex user sync
│   │   └── usePlanGating.ts    # Plan-based feature gating
│   ├── lib/                    # Utilities & configuration
│   │   ├── store.ts            # Zustand store (UI-only state)
│   │   ├── plans.ts            # Plan definitions & limits
│   │   └── security.ts         # Rate limiting & input sanitisation
│   └── types/                  # Shared TypeScript types
├── public/                     # Static assets
├── .github/
│   └── workflows/
│       ├── ci.yml              # Continuous integration (typecheck + lint + test + build)
│       ├── build-android-apk.yml  # Android APK build
│       └── chatbot-regression-weekly.yml  # Weekly chatbot regression tests
└── scripts/                    # Build & utility scripts
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run specific suites
npm run test:ics                    # ICS calendar compatibility
npm run test:chatbot-regression     # Chatbot regression suite

# Watch mode during development
npm run test:watch
```

Tests live alongside the source files they test, following the `*.test.ts(x)` naming convention.

---

## 🎨 Customisation

### Theme Colours

Edit `src/app/globals.css`:

```css
:root {
  --resurgo-primary: #F97316;  /* Main accent — orange */
  --gold-primary:    #F59E0B;  /* Secondary accent — gold */
  --background:      #0A0A0B;  /* Dark background */
}
```

### Add New Goal Categories

Add a new entry to the template map in `src/lib/ai-goal-decomposer.ts`:

```ts
myCategory: {
  milestones: [...],
  weeklyObjectives: [...],
  dailyTasks: [...],
},
```

---

## 💰 Pricing

| Plan | Price | Limits |
|---|---|---|
| **Free** | $0 / forever | 3 goals · 10 habits |
| **Pro** | ₹199/month · $12/month | Unlimited everything |
| **Pro Annual** | ₹1,499/year · $99/year | Save ~37% |
| **Lifetime** | ₹999 · $199 one-time | Everything, forever |

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to your branch: `git push origin feat/your-feature`
5. **Open** a Pull Request

---

## 🔒 Security

Found a vulnerability? Please **do not** open a public issue. See [SECURITY.md](SECURITY.md) for our responsible disclosure policy.

---

## 📄 License

[MIT](LICENSE) — feel free to use for personal or commercial projects.

---

<div align="center">
  <strong>Built with ❤️ using Next.js, Convex, and AI</strong>
  <br />
  <em>Start your transformation journey today → <a href="https://resurgo.life">resurgo.life</a></em>
</div>
