# RESURGO.life — Pre-Deploy External Actions Checklist

> Complete ALL 9 steps before running `vercel --prod`

---

## Step 1 — Clerk Webhook Secret

**Where:** [Clerk Dashboard](https://dashboard.clerk.com) → Your App → Webhooks → your endpoint  
**Action:** Copy the **Signing Secret** (format: `whsec_...`)  
**Set in two places:**
- `.env` → `CLERK_WEBHOOK_SECRET=whsec_YOUR_REAL_SECRET`
- Vercel → Settings → Environment Variables → `CLERK_WEBHOOK_SECRET`

---

## Step 2 — Convex Dashboard Environment Variables

**Where:** [Convex Dashboard](https://dashboard.convex.dev) → Your deployment (`spotted-akita-320.eu-west-1`) → Settings → Environment Variables  
**Add these 4 vars (NOT in Vercel — Convex reads them directly):**

| Variable | Value |
|---|---|
| `CLERK_FRONTEND_API_URL` | Your Clerk frontend API URL (e.g. `https://clerk.resurgo.life`) |
| `TELEGRAM_BOT_TOKEN` | From Step 5 below |
| `GROQ_API_KEY` | From [console.groq.com](https://console.groq.com) → API Keys → free key |
| `BILLING_WEBHOOK_SYNC_SECRET` | Random string — must match Vercel value |

---

## Step 3 — OpenRouter API Key

**Where:** [openrouter.ai](https://openrouter.ai) → API Keys → Create key (free tier)  
**Set:** `OPENROUTER_API_KEY=sk-or-v1-...`  
(in `.env` AND Vercel env vars)

---

## Step 4 — Hugging Face Access Token

**Where:** [huggingface.co](https://huggingface.co) → Profile → Access Tokens → New Token → **Read** permission  
**Set:** `HF_ACCESS_TOKEN=hf_...`  
(in `.env` AND Vercel env vars)

---

## Step 5 — Telegram Bot

**Where:** Telegram → chat with [@BotFather](https://t.me/BotFather)  
**Steps:**
1. Send `/newbot` → follow prompts → copy the **bot token**
2. Generate a random webhook secret: `openssl rand -hex 32` (or any random string)
3. Note your bot's username (e.g. `resurgo_bot`)

**Set 3 vars:**
| Variable | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | The token from BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | Your generated random string |
| `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` | Your bot username (no `@`) |

(Set in `.env`, Vercel, AND Convex Dashboard)

---

## Step 6 — Dodo Payments

**Where:** [Dodo Payments Dashboard](https://app.dodopayments.com)  
**Steps:**
1. Complete **KYC** (required before creating products)
2. Create **3 products:**
   - Pro Monthly — $4.99/month (recurring)
   - Pro Yearly — $29.99/year (recurring)
   - Lifetime — $49.99 (one-time)
3. Copy each product's **Checkout URL**
4. Copy your **Webhook Secret** from Webhooks settings

**Set 8 vars:**
| Variable | Value |
|---|---|
| `DODO_PAYMENTS_API_KEY` | Your Dodo API key |
| `DODO_WEBHOOK_SECRET` | Webhook signing secret |
| `NEXT_PUBLIC_DODO_PRO_MONTHLY_LINK` | Pro Monthly checkout URL |
| `NEXT_PUBLIC_DODO_PRO_YEARLY_LINK` | Pro Yearly checkout URL |
| `NEXT_PUBLIC_DODO_LIFETIME_LINK` | Lifetime checkout URL |
| `DODO_PRO_MONTHLY_PRODUCT_ID` | Pro Monthly product ID |
| `DODO_PRO_YEARLY_PRODUCT_ID` | Pro Yearly product ID |
| `DODO_LIFETIME_PRODUCT_ID` | Lifetime product ID |

---

## Step 7 — Give Yourself Admin + Lifetime Access

**Where:** [Convex Dashboard](https://dashboard.convex.dev) → Data Browser → `users` table  
**Find your row** (match by email) → edit directly:
```json
{
  "plan": "lifetime",
  "isAdmin": true
}
```

---

## Step 8 — Set All Vars in Vercel + Deploy

**Where:** [Vercel Dashboard](https://vercel.com) → Your Project → Settings → Environment Variables  
**Action:** Paste every variable from your `.env` file that is NOT Convex-only  
**Then deploy:**
```bash
vercel --prod
```

---

## Step 9 — Register Telegram Webhook (after deploy)

Run this curl command **after** step 8 deploy succeeds:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://resurgo.life/api/telegram/webhook&secret_token=<YOUR_WEBHOOK_SECRET>"
```

Replace `<YOUR_BOT_TOKEN>` and `<YOUR_WEBHOOK_SECRET>` with your actual values.

**Expected response:**
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

---

## Quick Status Tracker

| # | Action | Done? |
|---|---|---|
| 1 | Clerk `whsec_...` webhook secret set | ⬜ |
| 2 | Convex env vars (4 vars) set | ⬜ |
| 3 | OpenRouter API key set | ⬜ |
| 4 | HuggingFace token set | ⬜ |
| 5 | Telegram bot created + 3 vars set | ⬜ |
| 6 | Dodo KYC + 3 products + 8 vars set | ⬜ |
| 7 | Self granted lifetime + admin in Convex | ⬜ |
| 8 | All vars in Vercel + `vercel --prod` run | ⬜ |
| 9 | Telegram webhook registered via curl | ⬜ |
