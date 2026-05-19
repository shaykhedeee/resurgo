# RESURGO — AI-Powered Life Operating System

<div align="center">
  <img src="public/icons/icon.svg" alt="RESURGO Logo" width="120" height="120" />
  <br />
  <strong>Rise to Your Potential</strong>
  <br />
  <em>The personal productivity SaaS that combines AI coaching, goal decomposition, habit engineering, and holistic wellness tracking — all in one brutalist-minimalist interface.</em>
  <br /><br />
  <a href="https://resurgo.life">resurgo.life</a> · <a href="https://resurgo.life/pricing">Pricing</a> · <a href="https://resurgo.life/docs">Docs</a> · <a href="https://resurgo.life/changelog">Changelog</a>
</div>

---

## Features

### AI Goal Decomposition
- Transform any life goal into actionable steps via AI
- Automatic breakdown: Ultimate Goal → Milestones → Weekly Objectives → Daily Tasks
- 8-provider AI cascade with automatic fallback (Ollama → Groq → Cerebras → Gemini → OpenRouter → Together → AIML → OpenAI)

### 5 AI Coaches
- **Marcus** — Stoic discipline & mental clarity
- **Titan** — Peak performance & relentless execution
- **Aurora** — Creative growth & emotional intelligence
- **Phoenix** — Transformation & resilience
- **Nexus** — Systems thinking & strategic planning

### Habit Tracking & Stacking
- Create and track daily/weekly habits with streaks
- Habit stacking system for compound growth
- Heatmap calendar view + completion rates

### Vision Board Studio
- AI-generated vision boards (8 image providers: HuggingFace, ImagineArt, Freepik, Pollinations, and more)
- Stock image search (Pexels)
- 5-step guided wizard with 12 life domains
- HD download + panel regeneration

### Focus Sessions
- Pomodoro and deep work timers
- Session tracking with XP rewards

### Gamification
- Earn XP for tasks, habits, and milestones
- Level progression with meaningful titles
- Achievement badges and streak rewards

### Wellness Suite
- Daily mood & energy tracking
- Sleep logging and analysis
- Nutrition tracking (OpenFoodFacts integration)
- Fitness activity logging
- Recovery protocols

### Budget & Finance
- Income/expense tracking
- Budget categories and spending analysis
- Financial goal alignment

### Analytics & Insights
- Comprehensive dashboard with progress charts
- AI-generated weekly reviews
- Growth analytics and pattern detection

### Additional Features
- Brain dump / scratch notes
- AI orchestrator for complex planning
- Referral system
- Wishlist tracking
- Telegram bot integration
- Progressive Web App (installable)
- Dark mode by default

---

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router + Turbopack)
- **Language:** TypeScript (strict)
- **Auth:** Clerk (clerk.resurgo.life)
- **Backend/Database:** Convex (real-time, EU-West-1)
- **Payments:** Dodo Payments
- **Styling:** Tailwind CSS
- **State:** Convex queries (primary), Zustand (UI)
- **AI:** 8-provider cascade (Ollama → Groq → Cerebras → Gemini → OpenRouter → Together → AIML → OpenAI)
- **Image Gen:** HuggingFace FLUX, ImagineArt, Freepik, Pollinations, Stability AI, Gemini
- **Email:** Resend (transactional + marketing)
- **Analytics:** GA4, GTM, Meta Pixel
- **Testing:** Jest (17 suites, 134 tests)
- **Hosting:** Vercel

---

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm

### Installation

```bash
git clone https://github.com/shaykhedeee/resurgo.git
cd resurgo
npm install
cp .env.example .env.local
# Fill in all env vars (see .env for documentation)
npm run dev
```

### Key Environment Variables

```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# AI (at least one required)
GROQ_API_KEY=
GOOGLE_AI_STUDIO_KEY=
CEREBRAS_API_KEY=

# Payments
DODO_PAYMENTS_API_KEY=
DODO_PAYMENTS_WEBHOOK_SECRET=
```

See `.env` for the full list with setup instructions for each provider.

### Plans & Pricing

| Plan | Price | Includes |
|------|-------|----------|
| **Free** | $0 | 3 goals, 5 habits/day, 10 AI messages/day, focus timer, mood tracking |
| **Pro Monthly** | $9.99/mo | Unlimited everything, all 5 coaches, vision boards, advanced analytics |
| **Pro Yearly** | $95.88/yr | Same as Pro Monthly (save 20%) |
| **Lifetime** | $89 | Everything in Pro, forever - limited to the first 100 relaunch signups (founding price until July 5, 2026; after: $199) |

---

## Production Deployment

```bash
npm run build    # 288 static pages generated
npm run start    # Start production server
```

### Deploy to Vercel (Recommended)

1. Push to GitHub (`shaykhedeee/resurgo`)
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env`
4. Deploy

### Post-Deploy Checklist
1. Set Convex env vars in dashboard.convex.dev
2. Switch Dodo Payments from `test_mode` to `live_mode`
3. Register Telegram webhook (if using)
4. Verify Clerk webhook endpoint

---

## Project Structure

```
src/
├── app/
│   ├── (marketing)/         # 34 public pages (landing, pricing, blog, niche, etc.)
│   ├── (dashboard)/         # 25 protected pages (goals, habits, coach, analytics, etc.)
│   ├── api/                 # 60+ API routes (AI, vision-board, webhooks, marketing, etc.)
│   ├── sign-in/             # Clerk auth (catch-all)
│   ├── sign-up/             # Clerk auth (catch-all)
│   └── onboarding/          # 3-step new user wizard
├── components/              # Shared UI components
├── hooks/                   # Custom hooks (useStoreUser, usePlanGating, etc.)
├── lib/                     # AI providers, plans, security, utilities
│   └── ai/                  # Provider router, coach system, vision board generators
└── types/                   # TypeScript definitions
convex/                      # Convex backend (40+ modules)
├── schema.ts                # Full database schema
├── users.ts                 # User management + onboarding
├── goals.ts / habits.ts     # Core tracking
├── coachAI.ts               # AI coach conversations
├── visionBoards.ts          # Vision board CRUD
├── payments.ts              # Dodo Payments integration
├── gamification.ts          # XP, levels, achievements
└── ...                      # 30+ more modules
docs/                        # Strategy, marketing, brand, API docs
```

---

## Mobile Apps

Resurgo is available as native mobile apps via Capacitor, wrapping the web app with native features (push notifications, haptics, splash screens).

### Android

Already setup in this repository. Build commands:

```bash
npm run android:build           # Debug APK
npm run android:build:release   # Signed release APK
npm run android:open            # Open Android Studio
npm run android:sync            # Sync web assets to native project
```

Android builds work on any OS. See `scripts/build-android.js` and `docs/ANDROID-DEPLOYMENT.md` for details.

---

## iOS (macOS + Xcode Required)

### Prerequisites
- macOS 14 (Sonoma) or newer
- Xcode 15+ (with Command Line Tools)
- CocoaPods: `sudo gem install cocoapods`
- Apple Developer account ($99/year)

### One-Time Setup

```bash
# Add iOS platform (generates ios/ directory)
npx cap add ios

# Sync Capacitor config and web assets
npx cap sync ios

# Open Xcode to configure signing
npx cap open ios
```

### Build Commands

```bash
# Build IPA for TestFlight or App Store
npm run ios:build              # App Store build
npm run ios:build:adhoc        # Ad Hoc build (direct distribution)
npm run ios:build:enterprise   # Enterprise build (internal)

# Sync assets before building
npm run ios:sync

# Open Xcode for manual signing configuration
npm run ios:open
```

**Note:** iOS builds require macOS with Xcode CLI tools. The `scripts/build-ios.js` Node.js wrapper will error on Windows/Linux and display macOS-specific instructions.

### Deployment

Full iOS deployment guide: [docs/IOS-DEPLOYMENT.md](docs/IOS-DEPLOYMENT.md)

Key steps:
1. Register **App ID** in Apple Developer Portal
2. Create **distribution certificate** and **provisioning profiles**
3. Upload **APNs key** to Firebase Console (for push notifications)
4. Configure **Universal Links** (apple-app-site-association file)
5. Build **archive** in Xcode and export **IPA**
6. Upload to **App Store Connect** via Transporter or Xcode Organizer
7. Distribute via **TestFlight** or submit for App Store review

### iOS Project Structure

```
ios/
├── App/                        # Native iOS source
│   └── App/
│       ├── AppDelegate.swift   # App lifecycle
│       ├── SceneDelegate.swift # Scene management
│       ├── Info.plist          # App configuration
│       ├── App.entitlements    # Capabilities
│       ├── LaunchScreen.storyboard
│       └── Assets.xcassets/    # Icons & images
├── App.xcodeproj/              # Auto-generated Xcode project
├── App.xcworkspace/            # Xcode workspace (CocoaPods)
└── README.md                   # iOS project structure docs
```

**Important:** Files under `ios/App/` are **partially managed by Capacitor**. Manual changes may be overwritten on `npx cap sync ios`. To persist custom native code or config, create a Capacitor plugin or edit before syncing.

---

## Testing

```bash
npm test              # Run all tests (17 suites, 134 tests)
npm run typecheck     # TypeScript strict check
npm run build         # Full production build validation
```

---

## License

MIT License — free for personal or commercial use.

---

<div align="center">
  <strong>Built with discipline using Next.js, Convex, and AI</strong>
  <br />
  <a href="https://resurgo.life">resurgo.life</a> — Rise to your potential.
</div>
