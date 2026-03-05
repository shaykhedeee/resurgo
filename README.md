# 🚀 RESURGO - AI-Powered Life Transformation System

<div align="center">
  <img src="public/icons/icon.svg" alt="RESURGO Logo" width="120" height="120" />
  <br />
  <strong>Rise to Your Potential</strong>
  <br />
  <em>Intelligent goal decomposition, habit tracking, and gamified progress</em>
</div>

---

## ✨ Features

### 🎯 AI Goal Decomposition
- Transform any life goal into actionable steps
- Automatic breakdown: Ultimate Goal → Milestones → Weekly Objectives → Daily Tasks
- Multi-provider AI: Groq, Gemini, OpenRouter (with smart fallback)

### 📊 Habit Tracking
- Create and track daily/weekly habits
- Visual progress with streaks and completion rates
- Heatmap calendar view

### 🎮 Gamification System
- Earn XP for completing tasks and habits
- Level up with meaningful titles
- Achievement badges and streak rewards

### 📅 Interactive Calendar
- Monthly view of all activities
- Track perfect days and streaks
- Visual completion indicators

### 🌙 Dark/Light Theme
- Beautiful dark mode by default
- Easy toggle in header
- Theme persists across sessions

### 💾 Data Management
- Export data to JSON backup
- Generate PDF progress reports
- Import backups to restore data

### 📱 Progressive Web App (PWA)
- Install on mobile or desktop
- Offline-capable (static content)
- Native app-like experience

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Auth:** Clerk
- **Backend/Database:** Convex (real-time)
- **Styling:** Tailwind CSS
- **State Management:** Convex queries (primary), Zustand (UI state)
- **Charts:** Recharts
- **Icons:** Lucide React
- **PDF Generation:** jsPDF + jspdf-autotable
- **AI:** Groq / Gemini / OpenRouter (multi-provider fallback)
- **Payments:** Clerk Billing

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ascend.git
cd ascend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add Clerk/Convex/AI/Billing values

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Convex
CONVEX_DEPLOYMENT=dev:your-project
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# AI (server-side only)
GROQ_API_KEY=
GOOGLE_AI_STUDIO_KEY=
OPENROUTER_API_KEY=
AIML_API_KEY=

# Billing
BILLING_WEBHOOK_SYNC_SECRET=
NEXT_PUBLIC_CLERK_CHECKOUT_PRO_MONTHLY_URL=
NEXT_PUBLIC_CLERK_CHECKOUT_PRO_YEARLY_URL=
NEXT_PUBLIC_CLERK_CHECKOUT_LIFETIME_URL=
NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL=

```

**Note:** The app can still run without AI keys (limited/fallback AI behavior), but launch-ready billing requires Clerk + webhook env vars configured.

### Free Tier Limits
- 10 habits
- 3 goals
- AI insights
- Focus timer
- Mood tracking

### Pro Plan (₹199/month or $12/month)
- Unlimited habits & goals
- Advanced analytics
- Identity system
- Custom themes
- Data export
- Priority support

### Lifetime Plan (₹999 or $199 one-time)
- Everything in Pro, forever

---

## 📦 Production Deployment

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard (if using OpenAI)
4. Deploy!

### Deploy to Other Platforms

The app exports as static files when possible. For other platforms:

```bash
# Build the app
npm run build

# The .next folder contains the build output
# For static export (if needed):
# Add "output": "export" to next.config.js
```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles & CSS variables
│   ├── layout.tsx           # Root layout (Clerk/Convex providers)
│   ├── page.tsx             # Landing page (server component)
│   ├── (dashboard)/         # Auth-gated dashboard routes
│   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   ├── page.tsx         # Dashboard home
│   │   ├── habits/          # Habit tracking
│   │   ├── goals/           # Goal management
│   │   ├── focus/           # Focus timer (Pomodoro/Deep Work)
│   │   ├── calendar/        # Calendar view
│   │   ├── analytics/       # Statistics & charts
│   │   ├── wellness/        # Mood tracking
│   │   └── settings/        # User settings
│   ├── api/
│   │   ├── ai/              # AI chat, decompose, suggestions
│   │   ├── webhooks/        # Clerk billing webhooks
│   │   └── chatbot/         # Kai chatbot endpoint
│   ├── billing/             # Billing/pricing pages
│   └── help/                # Help center
├── components/              # Shared UI components
├── hooks/                   # Custom React hooks
│   ├── useStoreUser.ts      # Clerk → Convex user sync
│   └── usePlanGating.ts     # Feature gating by plan
├── lib/                     # Utilities & config
│   ├── store.ts             # Zustand store (UI state)
│   ├── plans.ts             # Plan definitions
│   └── security.ts          # Rate limiting & CSRF
└── types/                   # TypeScript types
convex/                      # Convex backend
├── schema.ts                # Database schema
├── users.ts                 # User management
├── goals.ts                 # Goal CRUD
├── habits.ts                # Habit engine + streaks
├── focusSessions.ts         # Focus timer sessions
├── gamification.ts          # XP, levels, achievements
└── wellness.ts              # Mood tracking
```

---

## 🧪 Testing the App

1. **Onboarding:** First launch shows goal setup wizard
2. **Dashboard:** View stats, today's tasks, habits
3. **Goals Tab:** Manage goals and milestones
4. **Habits Tab:** Track daily habits with streaks
5. **Analytics Tab:** Charts and progress insights
6. **Calendar Tab:** Monthly activity view
7. **Settings:** Export data, view profile

---

## 🎨 Customization

### Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --ascend-primary: #F97316;  /* Main accent - orange */
  --gold-primary: #F59E0B;    /* Secondary accent */
  --background: #0A0A0B;      /* Dark background */
}
```

### Add New Goal Categories

Edit `src/lib/ai-goal-decomposer.ts` to add templates for new categories.

---

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

---

<div align="center">
  <strong>Built with ❤️ using Next.js and AI</strong>
  <br />
  <em>Start your transformation journey today</em>
</div>
