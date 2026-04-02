# RESURGO — PRODUCT TRUTH DOCUMENT
> Single source of truth. All pages, AI responses, coaches, and copy must align with this.

---

## 1. POSITIONING STATEMENT

> **Resurgo is the Execution OS for ambitious solo operators — turning brain dumps into daily action, habits, and momentum.**

Use this sentence verbatim wherever a one-line description is needed.

---

## 2. PLAN NAMES & LIMITS (CANONICAL)

| Feature | Free | Pro ($4.99/mo) | Lifetime ($49.99) |
|---|---|---|---|
| Goals | 3 | Unlimited | Unlimited |
| Tasks | Unlimited | Unlimited | Unlimited |
| Habits / day | 5 | Unlimited | Unlimited |
| AI messages / day | 10 | Unlimited | Unlimited |
| AI Coaches available | 2 (Marcus, Titan) | All 5 | All 5 |
| Vision board panels | 3 | Unlimited | Unlimited |
| API access | Read-only (personal key) | Full (personal key) | Full (personal key) |
| Focus session modes | All | All | All |
| Integrations | Limited | All | All |
| Priority support | No | Yes | Yes |

---

## 3. COACH ROSTER (CANONICAL — EXACTLY 5)

| Coach | Persona | Focus |
|---|---|---|
| **Marcus** | Stoic strategist | Deep work, mental clarity, discipline |
| **Titan** | High-performance coach | Physical performance, energy, output |
| **Aurora** | Wellness guide | Sleep, recovery, emotional balance |
| **Phoenix** | Comeback specialist | Resilience, burnout recovery, restart |
| **Nexus** | Systems builder | Habits, routines, automation, efficiency |

**Rule:** No page may say "6 coaches", "8 coaches", or any number other than 5.
**Rule:** Free plan users access Marcus + Titan only.

---

## 4. PRICING (CANONICAL)

- **Free:** Forever. No credit card. 3 goals, 5 habits/day, 10 AI messages/day.
- **Pro Monthly:** $4.99/month. Everything unlimited.  
- **Pro Yearly:** $29.99/year ($2.50/mo). Everything unlimited.
- **Founding Lifetime:** $49.99 one-time. Everything unlimited. 1,000 spots total.

**Rule:** Pricing page, landing page, FAQ, and onboarding must always use these exact numbers.

---

## 5. FEATURE FLAGS (CANONICAL)

| Feature | Status |
|---|---|
| Brain Dump Engine | ✅ Live |
| AI Goal Decomposition | ✅ Live |
| Habit Tracking + Streaks | ✅ Live |
| Focus Sessions (Pomodoro / Deep Work / Flowtime) | ✅ Live |
| AI Coaches (5 personas) | ✅ Live |
| Vision Board Generator | ✅ Live (HuggingFace FLUX.1 primary) |
| Daily Check-ins (morning + evening) | ✅ Live |
| Weekly Reviews | ✅ Live |
| Gamification (XP / Levels / Badges) | ✅ Live |
| Wellness Tracking (mood, sleep, energy, nutrition) | ✅ Live |
| Telegram Bot Integration | ✅ Live |
| Scratch Notes | ✅ Live |
| Wishlist | ✅ Live |
| Budget Tracker | ✅ Live |
| Referral System | ✅ Live |
| Progressive Disclosure Dashboard (Armory) | ✅ Live |
| Deep Scan Protocol (onboarding) | ✅ Live |
| Personal API Keys | 🔜 Roadmap Q2 2026 |
| Google Calendar Sync | 🔜 Roadmap Q2 2026 |
| Mobile App (React Native) | 🔜 Roadmap Q3 2026 |
| MCP Server | 🔜 Roadmap Q2 2026 |
| VS Code Extension | 🔜 Roadmap Q3 2026 |
| Android Health Connect | 🔜 Roadmap Q3 2026 |

---

## 6. TECHNICAL STACK (FOR AI CONTEXT)

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS v3
- **Database/Backend:** Convex (real-time, serverless)
- **Auth:** Clerk
- **Billing:** Dodo Payments
- **AI:** OpenRouter (primary), OpenAI fallback
- **Image Generation:** HuggingFace Inference API (FLUX.1-schnell → SDXL → SD v1.5)
- **Email:** Resend
- **Analytics:** GA4 (G-F1VLMSS8FB) + GTM (GTM-KWTBH8SB)
- **Hosting:** Vercel
- **Domain:** resurgo.life

---

## 7. BRAND / UX RULES

- **Aesthetic:** Terminal-inspired dark UI with orange accent (#f97316)
- **Typography:** Press Start 2P (pixel labels), IBM Plex Mono (terminal copy), Inter (body)
- **Voice:** Direct, intelligent, calm, operator-like. No hype. No guilt.
- **CTA pattern:** Dominant = Founding Lifetime, Secondary = Pro Monthly, Tertiary = Start Free
- **Progressive disclosure:** New users see Today View only. Full Armory is opt-in.
- **First win principle:** User must complete one action in under 5 minutes of signing up.

---

## 8. DO NOT CONTRADICT

These facts must never be violated anywhere in the product or marketing:

1. There are exactly **5 coaches**, not 4, not 6, not 8.
2. Free plan allows **3 goals** and **5 habits/day**.
3. Pro is **$4.99/month** — not $9, not $14.
4. Lifetime is **$49.99** — not $99.
5. The app works as a **PWA on all platforms** — no native iOS/Android app yet.
6. Vision board uses **HuggingFace FLUX.1-schnell** as the primary model.
7. The product is for **solo operators / individuals** — not teams.

---

*Last updated: April 2026 | Owner: Founder*
