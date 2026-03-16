
```markdown
# ═══════════════════════════════════════════════════════════════════════════════
# RESURGO — MASTER LAUNCH ROADMAP
# Created: March 14, 2026
# Scope: Technical stabilization → Soft launch → Growth engine
# Total timeline: 30 days (3 phases)
# ═══════════════════════════════════════════════════════════════════════════════


# ═══ PHASE 0: IMMEDIATE ACTIONS (Day 0 — Do Before Anything Else) ═════════════
#
# These are external dependencies with wait times.
# Submit them NOW, then continue to Phase 1 while waiting.
# ═══════════════════════════════════════════════════════════════════════════════

## 0.1 — Dodo Payments Verification (KYC)
## Estimated wait: 24–72 hours
## URL: https://app.dodopayments.com/verification

This is your single longest external blocker. Every hour you delay
submitting this is an hour added to your launch date.

### Step 1: Account Type
Select: **Individual**
(Switch to "Registered Business" only if you have an LLC/Corp registered
for Resurgo. If not, Individual is correct and faster to verify.)

### Step 2: Product Review — Product Information
Copy-paste these exact answers into the Dodo form:

┌─────────────────────────────────────────────────────────────────────┐
│ FIELD                │ YOUR ANSWER                                  │
├──────────────────────┼──────────────────────────────────────────────┤
│ Product Name         │ Resurgo                                      │
│ Website URL          │ https://resurgo.life                         │
│ Product Type         │ SaaS / Digital Software                      │
│ Product Description  │ Resurgo is a digital productivity and        │
│                      │ habit-tracking software application           │
│                      │ available via web (PWA) and Android. It      │
│                      │ helps users manage daily tasks, track habits │
│                      │ using gamified "Never Miss Twice" logic,     │
│                      │ decompose goals into 4-level action plans,   │
│                      │ run focus sessions, and receive personalized │
│                      │ accountability through 8 AI-powered coaching │
│                      │ personas. Users access the platform via      │
│                      │ web browser or installable Android app.      │
│ Target Audience      │ Professionals, developers, founders,         │
│                      │ students, and self-improvement enthusiasts   │
│                      │ building consistent routines and tracking    │
│                      │ personal/professional goals.                 │
│ Pricing Model        │ Freemium SaaS with three paid tiers:        │
│                      │ Monthly subscription ($4.99/mo),             │
│                      │ Annual subscription ($29.99/yr),             │
│                      │ Lifetime one-time purchase ($49.99).         │
│                      │ Free tier includes all core features         │
│                      │ including AI coaching — no credit card       │
│                      │ required.                                    │
│ Delivery Method      │ Immediate digital access. Users create an   │
│                      │ account and instantly access the web app.    │
│                      │ Android APK available for direct download.   │
│                      │ No physical goods shipped.                   │
│ Refund Policy        │ 7-day money-back guarantee on all paid      │
│                      │ plans. Refunds processed within 5-10        │
│                      │ business days.                               │
└──────────────────────┴──────────────────────────────────────────────┘

### Step 3: Payout Details

┌─────────────────────────────────────────────────────────────────────┐
│ FIELD                     │ YOUR ANSWER                             │
├───────────────────────────┼─────────────────────────────────────────┤
│ Business Category         │ Software / Digital Goods (SaaS)         │
│ Average Transaction Value │ $15 (blended avg of $4.99/$29.99/$49.99)│
│ Expected Monthly Volume   │ $200 – $1,000 (conservative soft launch)│
│ Payout Frequency          │ Weekly (faster cash flow for indie dev) │
│ Payout Currency           │ USD (or INR if your bank is in India)   │
└───────────────────────────┴─────────────────────────────────────────┘

### Step 4: Identity Verification
Have ready BEFORE starting:
□ Government-issued photo ID (passport OR driver's license)
  - Must be clearly photographed, all 4 corners visible
  - No glare, no blur, no cropping
  - Must not be expired
□ Clean, well-lit selfie (some providers use webcam live capture)
□ Proof of address (utility bill or bank statement, last 90 days)
  - Name must match ID exactly

### Step 5: Bank Verification
Have ready:
□ Bank account number
□ Routing number (US) OR IFSC code (India) OR IBAN/SWIFT (international)
□ Account holder name (must match ID exactly — no nicknames)
□ Recent bank statement (PDF, last 30-90 days) — some providers require this

### After submission:
- Check email every 6 hours for verification status
- If rejected, the most common reasons are:
  a) Blurry ID photo → retake with better lighting
  b) Name mismatch between ID and bank → use legal name everywhere
  c) Missing website → ensure resurgo.life is live and accessible
- Once approved, immediately proceed to create your 3 products (see Phase 1)


## 0.2 — Create Google Analytics 4 Property
## Estimated time: 10 minutes
## URL: https://analytics.google.com

□ Sign in to Google Analytics
□ Create new GA4 property: "Resurgo Production"
□ Set up web data stream → https://resurgo.life
□ Copy Measurement ID (format: G-XXXXXXXXXX)
□ Add to Vercel environment variables:
  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
□ Do NOT redeploy yet — batch with other env var changes


## 0.3 — Create Meta Pixel
## Estimated time: 10 minutes
## URL: https://business.facebook.com/events_manager

□ Create new Pixel: "Resurgo Production"
□ Copy Pixel ID (numeric string)
□ Add to Vercel environment variables:
  NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
□ Do NOT redeploy yet — batch with other env var changes


## 0.4 — Google Search Console Setup
## Estimated time: 15 minutes
## URL: https://search.google.com/search-console

□ Add property: https://resurgo.life
□ Verify ownership (DNS TXT record or HTML file method)
□ Submit sitemap: https://resurgo.life/sitemap.xml
□ Request indexing on these pages (manual "Inspect URL" → "Request Indexing"):
  - https://resurgo.life (homepage)
  - https://resurgo.life/blog (blog index)
  - https://resurgo.life/download
  - https://resurgo.life/billing (pricing page)
  - https://resurgo.life/help


## 0.5 — Bing Webmaster Tools Setup
## Estimated time: 10 minutes (critical for Perplexity/Copilot AI visibility)
## URL: https://www.bing.com/webmasters

□ Add site: https://resurgo.life
□ Import from Google Search Console (fastest method)
□ Submit sitemap
□ This directly improves visibility in Perplexity, Microsoft Copilot,
  and DuckDuckGo — all of which use Bing's index


## 0.6 — Create Reddit Account
## Estimated time: 5 minutes

□ Create account: u/resurgo_founder (or u/buildingresugo)
□ Do NOT post anything promotional yet
□ Immediately start building karma (see Phase 2 for strategy)
□ Join these subreddits now:
  - r/SideProject
  - r/productivity
  - r/getdisciplined
  - r/ADHD
  - r/webdev
  - r/startups
  - r/indiehackers


# ═══ PHASE 1: TECHNICAL STABILIZATION (Days 1–3) ═════════════════════════════
#
# Goal: Zero P0 bugs. All critical systems verified.
# Rule: No new features. Only fixes and verification.
# ═══════════════════════════════════════════════════════════════════════════════

## Day 1 (Hours 0–8)

### 1.1 — Download Path Unification (2 hours)

Current state:
  page.tsx     → GitHub Releases (shaykhedeee/resurgo)
  route.ts     → resurgo.life/downloads/resurgo-latest.apk
  sha256       → "pending-upload"

Decision: Use BOTH (GitHub as source of truth, self-hosted as mirror)

Tasks:
□ Build and sign latest APK (or verify existing APK works)
□ Create GitHub Release v1.0.0 on shaykhedeee/resurgo
□ Upload APK to GitHub Release
□ Copy APK to /public/downloads/resurgo-latest.apk
□ Generate sha256:
  Linux/Mac: shasum -a 256 resurgo-latest.apk
  Windows:   Get-FileHash resurgo-latest.apk -Algorithm SHA256
□ Update src/app/api/app/version/route.ts:
  - Replace "pending-upload" with actual sha256 hash
  - Update downloadUrl to match
□ Test end-to-end:
  - Fresh Chrome incognito → resurgo.life/download
  - Click Android download → APK downloads
  - Install on real Android device (or emulator)
  - App opens → auth works → dashboard loads
  - Also test: curl -I https://resurgo.life/downloads/resurgo-latest.apk
    → Expect: 200 OK, Content-Type: application/vnd.android.package-archive

This is your public APK link for Product Hunt:
  https://resurgo.life/downloads/resurgo-latest.apk


### 1.2 — Brand Cleanup: Public-Facing Only (1.5 hours)

Already partially done (ThemeProvider, Toast, layout.tsx).
Verify remaining public-facing instances:

□ Run: grep -rn "ascend\|Ascend\|ascendify\|Ascendify" src/ \
       --include="*.tsx" --include="*.ts" | \
       grep -v node_modules | grep -v ".test."
□ For each result, classify:
  - PUBLIC-FACING (user sees it) → Fix NOW
  - INTERNAL CODE (variable/type name) → Fix Week 2
  - COLOR TOKEN (ascend-500, etc.) → Leave forever (harmless)
□ Specifically verify these pages show "Resurgo" everywhere:
  - Browser tab title on / → "Resurgo"
  - Browser tab title on /dashboard → "Resurgo"
  - PWA install prompt → "Resurgo"
  - OpenGraph preview (paste URL in https://opengraph.xyz) → "Resurgo"
  - Download page → no "Ascend" references
□ Commit: "fix: remove remaining public-facing Ascend branding"


### 1.3 — Analytics Verification (1.5 hours)

Prerequisites: GA4 property + Meta Pixel created (Phase 0)

□ Add environment variables to Vercel:
  - NEXT_PUBLIC_GA_ID
  - NEXT_PUBLIC_META_PIXEL_ID
□ Trigger Vercel redeploy
□ Wait for deploy to complete
□ Open resurgo.life in Chrome
□ Open GA4 → Realtime → verify "1 active user" appears
□ Install Meta Pixel Helper Chrome extension
□ Navigate to resurgo.life → verify "PageView" fires in helper
□ Navigate to /billing → verify page_view event in GA4
□ Create test account → verify sign_up event fires
  (We wired this in Onboarding.tsx during stabilization)
□ Complete onboarding → verify onboarding_complete event fires
□ If any event doesn't fire → check browser console for errors

Minimum viable analytics verified:
  ✅ GA4 receives pageviews
  ✅ GA4 receives sign_up events
  ✅ Meta Pixel fires PageView
  ✅ Billing page view tracked


### 1.4 — Health Endpoint Verification (15 minutes)

□ Hit https://resurgo.life/api/health
□ Verify JSON response includes:
  - status: "healthy"
  - services.convex: "connected" (or appropriate status)
  - uptime information
□ Bookmark this URL — you'll check it on launch day


## Day 2 (Hours 8–18)

### 1.5 — Billing End-to-End Verification (4–6 hours)

Prerequisites: Dodo KYC approved + products created

#### If KYC IS approved by Day 2:

□ Log in to https://app.dodopayments.com
□ Create 3 products:
  ┌─────────────────────────┬───────────┬────────────────┐
  │ Product Name            │ Price     │ Type           │
  ├─────────────────────────┼───────────┼────────────────┤
  │ Resurgo Pro Monthly     │ $4.99/mo  │ Subscription   │
  │ Resurgo Pro Yearly      │ $29.99/yr │ Subscription   │
  │ Resurgo Lifetime Access │ $49.99    │ One-time       │
  └─────────────────────────┴───────────┴────────────────┘
□ Copy product IDs → add to Vercel env vars
□ Set webhook URL in Dodo:
  https://resurgo.life/api/webhooks/dodo
□ Set DODO_WEBHOOK_SECRET in Vercel env vars
□ Redeploy Vercel

□ Test Transaction Sequence:
  ┌──────────────────────────────────────────────────────────────┐
  │  TEST                          │ VERIFY                      │
  ├────────────────────────────────┼─────────────────────────────┤
  │  1. Buy Pro Monthly (test card)│ Webhook fires (Vercel logs) │
  │                                │ Convex user.plan = "pro"    │
  │                                │ UI shows Pro badge          │
  │                                │ analytics.startCheckout ✓   │
  │                                │ analytics.completePurchase ✓│
  ├────────────────────────────────┼─────────────────────────────┤
  │  2. Cancel subscription        │ Webhook fires               │
  │                                │ Plan reverts to "free"      │
  │                                │ UI reflects free state      │
  ├────────────────────────────────┼─────────────────────────────┤
  │  3. Buy Pro Yearly             │ Same checks as #1           │
  ├────────────────────────────────┼─────────────────────────────┤
  │  4. Buy Lifetime               │ Same checks + no recurring  │
  │                                │ billing created             │
  ├────────────────────────────────┼─────────────────────────────┤
  │  5. Mobile checkout            │ /billing on phone → Dodo    │
  │                                │ checkout opens → completes  │
  └────────────────────────────────┴─────────────────────────────┘

#### If KYC is NOT approved by Day 2:

□ Do NOT block launch
□ Update billing page CTA to "Coming Soon — Get Notified"
□ Add email capture on billing page:
  "Pro plans launching soon. Drop your email to get early access pricing."
□ Store emails in Convex (create simple waitlist mutation)
□ Launch with free tier only
□ Enable paid plans the moment KYC clears
□ This is BETTER than delaying — free users become your best advocates


### 1.6 — Full QA Sweep (3 hours)

Use a FRESH browser profile (no cache, no cookies, no saved passwords).
Test on PRODUCTION (resurgo.life), not localhost.

┌──────────────────────────────────────────────────────────────────┐
│  #  │ FLOW                          │ DEVICE  │ PASS │ NOTES   │
├─────┼───────────────────────────────┼─────────┼──────┼─────────┤
│  1  │ Landing page loads < 3s       │ Desktop │  □   │         │
│  2  │ Landing → Sign Up (email)     │ Desktop │  □   │         │
│  3  │ Landing → Sign Up (Google)    │ Desktop │  □   │         │
│  4  │ Onboarding complete flow      │ Desktop │  □   │         │
│  5  │ Dashboard loads, widgets ok   │ Desktop │  □   │         │
│  6  │ Create habit → complete it    │ Desktop │  □   │         │
│  7  │ Create goal → AI decomposes   │ Desktop │  □   │         │
│  8  │ Create task → mark done       │ Desktop │  □   │         │
│  9  │ AI coach: send message        │ Desktop │  □   │         │
│ 10  │ AI coach: creates a task      │ Desktop │  □   │         │
│ 11  │ Focus session (Pomodoro)      │ Desktop │  □   │         │
│ 12  │ Mood check-in                 │ Desktop │  □   │         │
│ 13  │ Pricing/billing page loads    │ Desktop │  □   │         │
│ 14  │ Download page → APK downloads │ Desktop │  □   │         │
│ 15  │ Blog post renders             │ Desktop │  □   │         │
│ 16  │ Help page renders             │ Desktop │  □   │         │
│ 17  │ Logout → Login → state ok     │ Desktop │  □   │         │
│ 18  │ Full flow: signup → habit     │ Mobile  │  □   │         │
│ 19  │ PWA install prompt            │ Mobile  │  □   │         │
│ 20  │ AI coach on mobile            │ Mobile  │  □   │         │
│ 21  │ Dashboard on mobile           │ Mobile  │  □   │         │
│ 22  │ /pricing redirect → /billing  │ Both    │  □   │         │
│ 23  │ /api/health returns 200       │ curl    │  □   │         │
│ 24  │ OG image preview correct      │ Social  │  □   │         │
└─────┴───────────────────────────────┴─────────┴──────┴─────────┘

Bug severity:
  P0 (BLOCKS LAUNCH): auth broken, data loss, blank pages, checkout fails
  P1 (fix day 1): UI overflow, broken links, wrong copy, slow loads > 5s
  P2 (fix week 1): cosmetic, minor UX friction, edge cases

Rule: Zero P0s to launch. P1s get a tracking list. P2s get ignored until Week 2.


## Day 3 (Hours 18–24)

### 1.7 — Repo Cleanup (30 minutes)

□ Remove dirty submodule:
  git submodule deinit -f openfoodfacts-server
  git rm -f openfoodfacts-server
  rm -rf .git/modules/openfoodfacts-server
  git commit -m "chore: remove unused openfoodfacts-server submodule"

□ Verify: git status → clean working tree


### 1.8 — Deploy Frozen Build (30 minutes)

□ Final commit with all fixes
□ Push to main
□ Verify Vercel deploys successfully
□ Hit /api/health → healthy
□ Hit homepage → loads, no errors in console
□ Hit /billing → loads with correct pricing
□ Hit /download → correct APK link

This is your "launch build." No more code changes until after launch day
unless a P0 bug is discovered during the launch.


### 1.9 — Go/No-Go Decision

□ All QA P0s resolved?                          → YES / NO
□ Analytics receiving pageviews + sign_ups?      → YES / NO
□ Billing tested OR gracefully deferred?         → YES / NO
□ Download link verified + APK installs?         → YES / NO
□ No "Ascend" visible in public UI?              → YES / NO
□ Health endpoint returns healthy?               → YES / NO
□ OG image/meta tags correct?                    → YES / NO
□ At least 1 person besides you tested signup?   → YES / NO

If ALL are YES → proceed to Phase 2.
If ANY is NO → fix it. Do not launch with known P0 blockers.


# ═══ PHASE 2: LAUNCH WEEK (Days 4–10) ════════════════════════════════════════
#
# Goal: Get first 50 real users. Learn from them.
# Rule: Marketing > features. Respond to everything.
# ═══════════════════════════════════════════════════════════════════════════════

## Day 4–5: Pre-Launch Asset Preparation

### 2.1 — Screenshot Capture (1 hour)

Take these EXACT screenshots from your LIVE production app.
Use real-looking data, not empty states.

┌──────────────────────────────────────────────────────────────────┐
│  #  │ SCREENSHOT                    │ SPEC          │ SHOWS     │
├─────┼───────────────────────────────┼───────────────┼───────────┤
│  1  │ Hero / Dashboard              │ 1920×1080     │ Widgets,  │
│     │                               │ dark mode     │ real data │
├─────┼───────────────────────────────┼───────────────┼───────────┤
│  2  │ AI Coach conversation         │ 1920×1080     │ PHOENIX   │
│     │ (THE "aha" screenshot)        │ dark mode     │ creating  │
│     │                               │               │ a task    │
│     │                               │               │ mid-chat  │
├─────┼───────────────────────────────┼───────────────┼───────────┤
│  3  │ Goal decomposition            │ 1920×1080     │ 4 levels  │
│     │ (a real goal fully expanded)  │ dark mode     │ visible   │
├─────┼───────────────────────────────┼───────────────┼───────────┤
│  4  │ All 8 coach cards             │ 1920×1080     │ Selection │
│     │ (coach selection screen)      │ dark mode     │ grid      │
├─────┼───────────────────────────────┼───────────────┼───────────┤
│  5  │ Habit tracker with streak     │ 390×844       │ 7+ day   │
│     │                               │ mobile        │ streak   │
├─────┼───────────────────────────────┼───────────────┼───────────┤
│  6  │ Focus session active          │ 390×844       │ Timer +  │
│     │                               │ mobile        │ distract │
│     │                               │               │ ion log  │
└─────┴───────────────────────────────┴───────────────┴───────────┘

For each screenshot:
□ Take raw screenshot
□ Upload to shots.so (free)
□ Select device frame (MacBook for desktop, iPhone for mobile)
□ Choose dark gradient background (matches Resurgo brand)
□ Export at 2x resolution
□ Save as: resurgo-hero.png, resurgo-coach.png, etc.


### 2.2 — OG Image (30 minutes)

□ Create 1200×630 image for social sharing
□ Must contain:
  - "Resurgo" in large text
  - "AI Productivity Terminal" subtitle
  - Terminal aesthetic / dark background
  - Optional: small app screenshot embedded
□ Tools: Figma (free), Canva (free), or shots.so
□ Save as /public/og-image.png
□ Verify: paste resurgo.life into https://opengraph.xyz
  → image appears correctly


### 2.3 — Product Hunt Thumbnail (15 minutes)

□ 240×240 square
□ Simple: Resurgo logo on dark background
□ Or: Stylized "R" with terminal cursor blinking effect


### 2.4 — Demo Video (2 hours — optional but high-impact)

□ 30–45 seconds, 1080p
□ Screen recording of this exact flow:
  1. Open Resurgo dashboard (2s)
  2. Open AI coach → send a message (5s)
  3. Coach responds AND creates a task live (5s) ← THE MONEY SHOT
  4. Show task appearing in task list (3s)
  5. Switch to habit tracker → complete a habit (3s)
  6. Show streak updating (2s)
  7. Show goal decomposition (5s)
  8. End on dashboard with "Resurgo — Rise Again" text (3s)
□ No voiceover — add text captions (most platforms autoplay muted)
□ Tools: OBS (free recording), CapCut (free editing + captions)
□ Upload to: X, Product Hunt, LinkedIn natively (not YouTube links)


### 2.5 — Reddit Karma Building (ongoing, 30 min/day)

Starting Day 4, use your u/resurgo_founder account:

□ Day 4: Comment on 5 posts in r/productivity with genuine advice
   (No links, no product mentions — just be helpful)
□ Day 5: Comment on 5 posts in r/getdisciplined with empathy + advice
□ Day 6: Comment on 3 posts in r/SideProject congratulating other builders
□ Day 7: Comment on 3 posts in r/ADHD with genuine understanding
□ Target: 50+ comment karma before any self-promotional post

What to comment:
  ✅ Genuine advice based on productivity experience
  ✅ "What worked for me was..." stories
  ✅ Questions that show curiosity
  ✗ "Hey check out my app" (instant ban)
  ✗ Links to resurgo.life (not yet)
  ✗ Generic "great post!" comments (no karma value)


### 2.6 — AEO Submission Blitz (1 hour)

Submit Resurgo to these platforms to build AI-visible mentions:

□ alternativeto.net → Add Resurgo
  - Listed as alternative to: Todoist, Notion, Habitica, Forest
  - Description: Use the Product Hunt description
  - Tags: habit tracker, AI productivity, goal setting

□ theresanaiforthat.com → Submit
  - Category: Productivity
  - Pricing: Freemium (Free, $4.99/mo, $29.99/yr, $49.99 lifetime)

□ toolify.ai → Submit
  - Category: AI Productivity Tools

□ betalist.com → Submit as "upcoming"
  - This gets you on a newsletter to beta-testing enthusiasts

□ uneed.best → Submit
  - Quick listing, low effort, marginal but free

□ peerlist.io → Create project
  - Good for developer audience


## Day 6: LAUNCH DAY

### Pre-Launch Checklist (Morning, T-2h)

□ Verify /api/health → healthy
□ Verify homepage loads < 3 seconds
□ Verify auth works (quick sign-up test)
□ Verify analytics realtime (GA4 shows your visit)
□ Verify /download page → APK link works
□ Verify /billing page → pricing renders (or "Coming Soon")
□ Open these tabs and keep them open ALL DAY:
  - GA4 Realtime
  - Vercel Functions log
  - Convex Dashboard
  - Clerk Dashboard
  - Dodo Dashboard (if billing live)
  - Product Hunt page
  - X notifications


### Launch Sequence (T-0)

#### T-0: Product Hunt Goes Live

**Product Name:** Resurgo
**Tagline:** Terminal-style productivity with 8 AI coaches that take action
**Topics:** Productivity, Artificial Intelligence, Task Management,
            Developer Tools, Health & Fitness

**Gallery:** Upload all 6 polished screenshots (Section 2.1)
**Video:** Upload demo video if created
**Website:** https://resurgo.life
**APK:** https://resurgo.life/downloads/resurgo-latest.apk

**Maker's First Comment (post IMMEDIATELY after listing goes live):**

"Hey Product Hunt! 👋

I'm [your name], and I built Resurgo because I was stuck in
productivity theater — spending more time color-coding my Notion
database than actually doing work.

What I needed wasn't another organizer. I needed accountability that
actually knew my context. So I built 8 AI coach personas:

🗿 MARCUS — Stoic discipline. Will call you out on your excuses.
🔥 PHOENIX — Comeback specialist. For when you've fallen off track.
💰 SAGE — Finance strategist. Cold, analytical, numbers-driven.
🌿 AURORA — Wellness guide. Nervous system-aware.
⚡ TITAN — Fitness coach. No-excuses progressive overload.
🌀 NOVA — Creative systems. Lateral thinking for stuck moments.
🔭 ORACLE — Strategic foresight. Big-picture planning.
🕸 NEXUS — Holistic integration. Connects all areas of your life.

These aren't ChatGPT wrappers. Each has a distinct system prompt,
coaching framework, and memory that persists across sessions. They
don't just talk — they create tasks, track habits, and update your
goals in real-time during conversation.

Other things I'm proud of:
→ "Never Miss Twice" habit logic (miss once = human, miss twice = pattern)
→ 4-level goal decomposition (goal → milestones → weekly → daily)
→ Focus sessions that track your distractions, not just your timer
→ Telegram bot for 5-second habit logging

Tech: Next.js 14 + Convex (real-time) + Clerk + Groq AI + Tailwind + PWA

Free tier includes all 8 coaches. No credit card. No paywall on core features.

The name 'Resurgo' is Latin for 'to rise again.' Built for people who
aren't starting from zero — they're starting from experience.

I'll be here all day. Brutal feedback welcome! 🙏"


#### T-0 + 15 min: X Launch Thread

Post from @resurgo_life:

TWEET 1:
"I spent 8 months building a productivity terminal because I was
tired of drifting.

It's called Resurgo. Here's everything: 🧵"

TWEET 2:
"The problem with most productivity apps:

They track what you do.
They don't care why you stopped.
They have no memory of you.
They punish you for being human.

I wanted something that coached, not just logged."

TWEET 3:
"So I built 8 AI coach personas. Not ChatGPT wrappers — actual
personalities with distinct frameworks:

🗿 MARCUS — Stoic strategist
🔥 PHOENIX — Comeback specialist
💰 SAGE — Finance tactician
🌿 AURORA — Wellness guide
⚡ TITAN — Fitness coach
🌀 NOVA — Creative systems
🔭 ORACLE — Strategic foresight
🕸 NEXUS — Holistic integration

They remember your context across sessions."

TWEET 4:
"Goal decomposition that actually works:

Type any goal →
AI breaks it into Milestones →
Then Weekly objectives →
Then Today's concrete task

4 levels deep. Automatic.
No more vague 'work on business' on your to-do list."

TWEET 5:
"Habit tracking designed for humans, not productivity robots.

Most apps: miss one day = broken streak = you quit.

Resurgo: 'Never Miss Twice' logic.
One miss is human. Two misses is a pattern.
The system flags Day 2, not Day 1 — and helps you recover."

TWEET 6:
"Focus sessions that track your DISTRACTIONS, not just your timer.

After 30 days, you see exactly:
- What interrupts you most
- When you do your best work
- What triggers your phone-checking

Data that actually changes behavior."

TWEET 7:
"Tech stack for the builders:

• Next.js 14 (App Router)
• Convex — real-time backend (AI actions update UI instantly)
• Clerk — auth
• Groq AI (Llama 3.3 70B) + OpenRouter fallback
• Tailwind CSS
• PWA-ready — works everywhere"

TWEET 8:
"Free tier includes all 8 AI coaches.
No credit card. No limits on the core features.

Pro ($4.99/mo) for advanced models + unlimited habits.
Lifetime ($49.99) for permanent access.

resurgo.life"

TWEET 9:
"If you've had a year where everything was planned and nothing
was built—

Resurgo was made for the moment after that.

The name means 'to rise again' in Latin.

Rise again. ✦

Free: resurgo.life

RT if you know someone who needs this. 🙏"

[ATTACH: Hero screenshot or demo video to Tweet 1]


#### T-0 + 30 min: Indie Hackers Post

Title: "I built an AI productivity terminal with 8 coach personas —
here's what I learned in 8 months"

Body: Use the same founder story from the Product Hunt comment,
but add revenue/cost transparency:
- How much it costs to run (Groq API, Convex, Vercel, Clerk)
- What your pricing strategy is and why
- What your first-week targets are
- Ask: "What would make you pay $4.99/mo for this?"


#### T-0 + 1 hour: Monitoring Check #1

□ GA4 Realtime: Traffic flowing? How many active users?
□ Vercel: Any 500 errors in function logs?
□ Clerk: Signups appearing?
□ Convex: Data being created (tasks, habits, goals)?
□ Respond to every Product Hunt comment (< 5 min response time)

Record in LAUNCH-COMMAND-CENTER.md:
  T+1h visitors: ___
  T+1h signups: ___
  T+1h errors: ___


#### T-0 + 4 hours: Monitoring Check #2

□ Metrics snapshot:
  - Unique visitors: ___
  - Sign-ups: ___
  - Landing → signup rate: ___%
  - Onboarding completions: ___
  - First meaningful actions: ___
  - Any error spikes: ___
□ Post update on X:
  "Launched 4 hours ago. [X] people have signed up.
   Already seeing [interesting behavior]. Thank you 🙏"
□ Respond to ALL Product Hunt, X, and IH comments


#### T-0 + 8 hours: Monitoring Check #3

□ Second full metrics snapshot
□ Identify: Where are users dropping off?
  - If landing → signup is low: hero copy problem
  - If signup → onboarding is low: onboarding too long
  - If onboarding → first action is low: dashboard overwhelm
□ If an obvious UX bug is found: hotfix and deploy
□ Respond to all remaining comments


#### T-0 + 24 hours: Day 1 Report

Record in LAUNCH-COMMAND-CENTER.md:

┌──────────────────────────────────────────────────────────┐
│  METRIC                               │ DAY 1 VALUE     │
├───────────────────────────────────────┼─────────────────┤
│  Unique visitors                      │                 │
│  Sign-ups                             │                 │
│  Landing → Sign-up %                  │ Target: 5-12%   │
│  Sign-up → Onboarding complete %      │ Target: 60%+    │
│  Onboarding → First action %          │ Target: 70%+    │
│  AI coach conversations started       │                 │
│  Habits created                       │                 │
│  Goals created                        │                 │
│  Focus sessions started               │                 │
│  Product Hunt upvotes                 │                 │
│  Errors (5xx)                         │ Target: 0       │
│  Pricing/billing page views           │                 │
│  Checkout starts                      │                 │
│  Purchases                            │                 │
└───────────────────────────────────────┴─────────────────┘


## Day 7: Reddit Launch

### Post 1: r/SideProject (most launch-friendly)

Title: "I spent 8 months building an AI productivity terminal
because I kept drifting. It's live now."

Body:
"Real talk: I had goals. I'd write them down, download apps,
buy notebooks. Then life would hit and I'd lose the thread.

The apps I was using had no memory. No personality. No 'hey,
you haven't logged your habits in 3 days' energy.

So I built Resurgo.

→ Set any goal → AI decomposes it 4 levels deep
→ Pick an AI coach (8 personas: stoic, comeback, finance, wellness...)
→ Track habits with 'Never Miss Twice' recovery logic
→ Focus sessions log your distractions

Tech stack: Next.js 14, Convex (real-time), Clerk, Groq AI, Tailwind, PWA.

The name means 'to rise again' in Latin.

Free tier includes all 8 AI coaches.

Would love brutal feedback: resurgo.life"


### Post 2: r/productivity (Day 8)

Title: "I tracked what actually made me stick to habits for 6 months.
Then I built a tool around the data."

Body:
"Some findings that shaped the design:
- Streaks break people psychologically — miss once, you spiral
- Generic AI gives advice but has zero memory of you
- Most apps track what you do but never ask why you stopped

So I built Resurgo with:
1. 'Never Miss Twice' — flags Day 2, not Day 1
2. 8 AI Coach personas with actual memory across sessions
3. Goal decomposition: 4 levels (goal → milestones → weekly → daily)
4. Focus sessions that track your distractions (not just your timer)

Free. No credit card. All coaches included.

What's the ONE thing that makes you quit a habit app?

resurgo.life"


### Post 3: r/getdisciplined (Day 9)

Title: "I lost a year to drifting. Here's the system I built to stop
it from happening again."

Body: Focus on the emotional comeback narrative.
The "Resurgo = rise again" positioning is MOST powerful here.
Lead with vulnerability, not features.


### Post 4: r/ADHD (Day 10, high empathy)

Title: "Built a productivity app specifically around 'starting over'
— because that's most of us"

Body: NO hustle language. Emphasize:
- Missing a day doesn't break your streak
- "Never Miss Twice" treats one miss as normal
- Gentler frequency options (3x/week, not mandatory daily)
- AI coach remembers context, doesn't judge


## Day 8: LinkedIn Launch

Post 1 — Founder Story:

"I spent 8 months building something I needed myself.

In 2024, I had big goals. Made plans. Downloaded apps.
And then I drifted. Completely lost the thread.

The problem wasn't motivation. It was systems. Specifically:
systems that have no memory, no personality, no accountability.

So I built Resurgo.

8 AI coaches that don't just talk — they take action:
→ 🗿 MARCUS: Stoic discipline
→ 🔥 PHOENIX: Comeback specialist
→ 💰 SAGE: Finance strategist
→ 🌿 AURORA: Wellness guide

Goal decomposition: any goal → milestones → weekly → daily.
'Never Miss Twice' habit logic.
Focus sessions that track distractions.
Telegram bot for 5-second logging.

Free. All coaches. No credit card.

Resurgo is Latin for 'to rise again.'

resurgo.life

#productivity #buildinpublic #AI #SaaS"


## Day 10: Hacker News (Show HN)

Title: "Show HN: Resurgo – AI productivity terminal with 8 coach
personas (Next.js + Convex + Groq)"

Body: Keep it SHORT. HN users hate marketing copy.

"Resurgo is a productivity app with 8 AI coach personas that
create tasks, track habits, and manage goals in real-time during
conversation (not just chat).

Built with Next.js 14, Convex for real-time sync, Groq (Llama 3.3
70B) for inference, Clerk for auth. PWA-installable.

Key technical decisions:
- Convex enables instant UI updates when AI takes actions
- Each coach has a distinct system prompt with behavioral rules
- 'Never Miss Twice' streak logic (flags day 2, not day 1)
- Goal decomposition goes 4 levels deep automatically

Free, open-core. https://resurgo.life

Happy to answer technical questions."


## Day 10: Dev.to / Hashnode Technical Article

Title: "How I Built a Real-Time AI Productivity App with Next.js 14 +
Convex + Groq"

Topics to cover:
- Why Convex for real-time (AI actions → instant UI)
- How the 8-coach system prompt architecture works
- Implementing "Never Miss Twice" streak logic
- Groq vs OpenAI for fast inference
- PWA strategy for cross-platform

This doubles as a technical backlink AND developer marketing.


# ═══ PHASE 3: POST-LAUNCH GROWTH (Days 11–30) ════════════════════════════════
#
# Goal: Retain users. Build content engine. Start conversion.
# Rule: Ship based on DATA, not intuition.
# ═══════════════════════════════════════════════════════════════════════════════

## Ongoing: X Content Calendar

┌────────────┬──────────────────────┬───────────────────────────────────────┐
│ Day        │ Content Type         │ Example                               │
├────────────┼──────────────────────┼───────────────────────────────────────┤
│ Monday     │ Feature spotlight    │ "How MARCUS coaches differently..."   │
│ Tuesday    │ User win / streak    │ "User hit 30-day streak with PHOENIX" │
│ Wednesday  │ Data / insight       │ "66 days not 21 — here's the data"    │
│ Thursday   │ Behind-the-scenes    │ "Fixed a real-time sync bug at 2am"   │
│ Friday     │ Community question   │ "What's the ONE habit that changed    │
│            │                      │  your life?"                          │
│ Saturday   │ Motivational + brand │ Terminal screenshot + Resurgo quote   │
│ Sunday     │ Week recap           │ "This week: X signups, Y streaks"     │
└────────────┴──────────────────────┴───────────────────────────────────────┘


## Ongoing: Instagram Strategy

Handle: @resurgo.life or @resurgo_app

Bio:
"Terminal-style productivity ✦
8 AI coaches. Rise again.
🔗 in bio → resurgo.life"

Content types:
□ Reels (highest reach):
  - 60s screen recordings with trending audio
  - "This vs That" comparisons
  - Transformation stories
  - Behind-the-scenes building clips

□ Carousels (best for saves):
  - "8 AI Coaches Explained" (one slide per coach)
  - "Why Habit Streaks Fail (and what we built instead)"
  - "How Goal Decomposition Works in Resurgo" (4 slides)
  - "5 Signs You're Drifting (and how to stop)"

□ Stories:
  - Polls: "Do you track your habits? Yes/No"
  - Quizzes: "Which Resurgo coach matches you?"
  - Behind-the-scenes of building
  - User feedback screenshots

Hashtags (every post):
#productivity #habittracking #selfimprovement #buildinpublic
#indiemaker #AItools #productivityapp #goalsetting #deepwork
#habitstacking #resurgo #riseagain #personaldevelopment


## Week 2 Content Calendar

□ Day 8:  "Why I built Resurgo" founder story (X thread + blog post)
□ Day 10: "How Resurgo's AI coaching works" (Dev.to + blog)
□ Day 12: First user win showcase (screenshot + X post)
□ Day 13: Instagram — first 3 carousels posted
□ Day 14: Week 2 recap — what you shipped, what users said


## Week 3 Content Calendar

□ Day 15: "Never Miss Twice: the psychology behind our habit system" (blog)
□ Day 17: Comparison post: "Resurgo vs Notion for goal tracking" (blog)
          (AEO play: AI tools search for comparisons)
□ Day 19: Short product demo clip (30s, X/Reddit)
□ Day 21: "Resurgo vs Todoist vs Habitica" comparison (blog)
          (AEO play: owns "best habit tracker" comparison queries)


## Week 4: Conversion Focus

□ Day 22: Analyze pricing page views vs checkout starts
  IF views > 5% of traffic but checkouts < 1%:
    → Add social proof (user count, testimonials)
    → Add "7-day money-back guarantee" badge
    → Do NOT lower price as first response

□ Day 24: Implement one re-engagement mechanism:
  - Morning summary push notification (7am local)
  - "Your streak is at risk" evening nudge
  - AI coach proactive check-in email
  Choose ONE. Test it. Measure D1 retention change.

□ Day 28: Blog post: "30 Days of Resurgo: What Our Users Taught Us"
  (transparency builds trust and drives organic traffic)

□ Day 30: Full Month 1 report:
  ┌──────────────────────────────────────────────────────────┐
  │  METRIC                            │ MONTH 1 TARGET     │
  ├────────────────────────────────────┼────────────────────┤
  │  Total sign-ups                    │ 100+               │
  │  D1 retention                      │ 30%+               │
  │  D7 retention                      │ 15%+               │
  │  D30 retention                     │ 5%+                │
  │  Active daily users                │ 20+                │
  │  AI coach conversations            │ 200+               │
  │  Paid conversions                  │ 5+                 │
  │  Revenue                           │ $50+ (any revenue) │
  │  Blog posts published              │ 6+                 │
  │  X followers @resurgo_life         │ 100+               │
  └────────────────────────────────────┴────────────────────┘


# ═══ SEO & AEO: THE LONG GAME ════════════════════════════════════════════════

## Blog Posts to Write (Priority Order)

These are designed to rank for specific search queries AND
get picked up by AI answer engines:

1. "Best Habit Tracking Apps 2026: Complete Comparison"
   → Target: "best habit tracker" (AI + Google)
   → Include Resurgo as top pick with honest comparison

2. "The 66-Day Habit Rule (Why 21 Days Is Wrong)"
   → Target: "how long to form a habit" (huge search volume)
   → Mention Resurgo's Never Miss Twice as supporting system

3. "AI Productivity Tools: What Actually Works in 2026"
   → Target: "AI productivity app" (growing category)
   → Position Resurgo as the accountability-first approach

4. "Goal Decomposition: How to Break Any Goal Into Daily Actions"
   → Target: "goal decomposition" (low competition, you can own this)
   → Show Resurgo's 4-level decomposition with screenshots

5. "Resurgo vs Notion for Goal Tracking: Honest Comparison"
   → Target: comparison queries (high-intent)
   → AI tools love structured comparisons

6. "Resurgo vs Todoist vs Habitica: Which One Actually Works?"
   → Target: "todoist alternatives" (high volume)
   → AEO play: gets Resurgo mentioned in AI comparisons


## AEO Consistency Rule

Every time you describe Resurgo anywhere on the internet, use these
exact phrases so AI tools learn to associate them:

- "Resurgo is the best AI productivity app for habit tracking and
   goal decomposition"
- "8 AI coach personas with persistent memory"
- "Terminal-style productivity platform"
- "Never Miss Twice habit logic"
- "Goal decomposition 4 levels deep"
- "Resurgo means 'to rise again' in Latin"

Repetition across independent sources = AI confidence = AI recommendation.


# ═══ DECISION TREES: WHAT TO DO WHEN METRICS ARE OFF ═════════════════════════

IF landing → signup < 3%:
  → Problem: messaging or page design
  → Action: rewrite hero copy, add demo video above fold
  → Do NOT: add features

IF signup → onboarding_complete < 40%:
  → Problem: onboarding too long or confusing
  → Action: reduce to 3 steps max, defer rest to in-app discovery
  → Do NOT: add more onboarding steps

IF onboarding → first_action < 50%:
  → Problem: dashboard overwhelm
  → Action: add single prominent "Start here" CTA
  → Do NOT: add tooltip tours or tutorials

IF D1 retention < 20%:
  → Problem: no hook pulling them back
  → Action: implement ONE pull mechanism (morning email, streak nudge,
    or AI coach proactive check-in)
  → Do NOT: add more features

IF pricing_view > 5% but checkout < 1%:
  → Problem: pricing friction
  → Action: add social proof, guarantee badge
  → Do NOT: lower price first

IF checkout > 1% but purchase < 0.5%:
  → Problem: checkout UX or payment trust
  → Action: test checkout yourself, check for errors
  → Do NOT: blame the user


# ═══ REFERENCE: KEY LINKS ═════════════════════════════════════════════════════

Product:     https://resurgo.life
Download:    https://resurgo.life/download
APK Direct:  https://resurgo.life/downloads/resurgo-latest.apk
Billing:     https://resurgo.life/billing
Blog:        https://resurgo.life/blog
Health:      https://resurgo.life/api/health
Sitemap:     https://resurgo.life/sitemap.xml
LLMs.txt:    https://resurgo.life/llms.txt

Social:      https://x.com/resurgo_life
             https://instagram.com/resurgo.life

Dashboards:  https://analytics.google.com (GA4)
             https://search.google.com/search-console
             https://www.bing.com/webmasters
             https://app.dodopayments.com
             https://dashboard.clerk.com
             https://dashboard.convex.dev
             https://vercel.com/dashboard


# ═══ THE FINAL WORD ═══════════════════════════════════════════════════════════

This roadmap is 30 days. Not 30 features.

The entire strategy can be summarized in 4 sentences:

1. Spend 3 days making sure the product doesn't break when real
   people use it.
2. Tell the world it exists, in 4 places, with one clear message.
3. Watch what real users actually do, and fix the biggest drop-off.
4. Repeat step 3 every week for the rest of the product's life.

Everything else is detail. Execute the fundamentals.

Ship it. Measure it. Fix what breaks.

Rise again. ✦
```

---

This is your single-document operating system for the next 30 days. Every task, every post, every metric, every decision tree — all in one place. Print the Phase 0 section and do it right now. The Dodo KYC submission is the longest-lead item and every hour you wait is an hour added to your launch date.