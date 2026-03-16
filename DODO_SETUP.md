# Dodo Payments — Setup & Product Creation Guide

This doc walks you through creating products in the Dodo dashboard, wiring environment variables into Convex, and confirming the full billing flow works end-to-end.

---

## 1. Create Products in Dodo Dashboard

Go to **https://app.dodopayments.com/** → Products → New Product.  
Create the following three products:

### Product 1: Pro Monthly

| Field | Value |
|---|---|
| Product Name | Resurgo Pro (Monthly) |
| Description | Unlimited goals, habits, and AI coaching. Cancel anytime. |
| Tax Category | SaaS |
| Pricing Type | Subscription |
| Price | $4.99 USD |
| Repeat every | 1 Month |
| Subscription Period | 10 Years |
| Trial Period Days | 7 |

After saving, copy the **Product ID** (format: `pdt_...`).  
This is your `NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY`.

---

### Product 2: Pro Yearly

| Field | Value |
|---|---|
| Product Name | Resurgo Pro (Yearly) |
| Description | Same Pro access at $2.50/month effective. Best value. |
| Tax Category | SaaS |
| Pricing Type | Subscription |
| Price | $29.99 USD |
| Repeat every | 1 Year |
| Subscription Period | 10 Years |
| Trial Period Days | 7 |

Copy the Product ID → `NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY`.

---

### Product 3: Lifetime

| Field | Value |
|---|---|
| Product Name | Resurgo Lifetime Access |
| Description | One payment. All Pro features forever. Founding price. |
| Tax Category | SaaS |
| Pricing Type | Single Payment |
| Price | $49.99 USD |

Copy the Product ID → `NEXT_PUBLIC_DODO_PRODUCT_LIFETIME`.

---

## 2. Set Convex Environment Variables

Go to your Convex dashboard → **Settings → Environment Variables** and set:

```
DODO_PAYMENTS_API_KEY          = dodo_test_...  (or dodo_live_... in production)
DODO_PAYMENTS_ENVIRONMENT      = test_mode       (change to live_mode in production)
DODO_PAYMENTS_WEBHOOK_SECRET   = whsec_...       (from step 3 below)
DODO_PRODUCT_ID_PRO_MONTHLY    = pdt_...         (from Product 1)
DODO_PRODUCT_ID_PRO_YEARLY     = pdt_...         (from Product 2)
DODO_PRODUCT_ID_LIFETIME       = pdt_...         (from Product 3)
BILLING_WEBHOOK_SYNC_SECRET    = any-random-secret-string
```

> **Where to find your API key**: Dodo Dashboard → Developer → API → Generate Key

---

## 3. Register the Webhook in Dodo

Your Convex webhook URL is:
```
https://<your-deployment>.convex.cloud/dodo-webhook
```

Find your deployment URL in the Convex dashboard. Then:

1. Go to **Dodo Dashboard → Developer → Webhooks → Add Endpoint**
2. Paste the URL above
3. Select all subscription and payment events
4. Copy the **Signing Secret** (`whsec_...`) and save it as `DODO_PAYMENTS_WEBHOOK_SECRET` in Convex env vars

---

## 4. Update Frontend Product IDs

The fallback product IDs are hardcoded in [src/components/BillingCTA.tsx](src/components/BillingCTA.tsx).  
Update those defaults once you have your live product IDs:

```ts
const PRODUCT_IDS: Record<string, string> = {
  pro_monthly: process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY ?? 'pdt_YOUR_MONTHLY_ID',
  pro_yearly:  process.env.NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY  ?? 'pdt_YOUR_YEARLY_ID',
  lifetime:    process.env.NEXT_PUBLIC_DODO_PRODUCT_LIFETIME    ?? 'pdt_YOUR_LIFETIME_ID',
};
```

Also add to your `.env.local`:
```
NEXT_PUBLIC_DODO_PRODUCT_PRO_MONTHLY=pdt_...
NEXT_PUBLIC_DODO_PRODUCT_PRO_YEARLY=pdt_...
NEXT_PUBLIC_DODO_PRODUCT_LIFETIME=pdt_...
```

---

## 5. Test the Flow

1. Run `npx convex dev` — verify the Dodo component initialize without errors
2. Navigate to `/billing` and click "Start Pro Monthly"
3. You should be redirected to the Dodo-hosted checkout
4. Use Dodo's test card: **4111 1111 1111 1111**, any future expiry, any CVV
5. After payment, you should be redirected to `/billing?success=true`
6. The webhook fires → your user row in Convex should have `plan: "pro"`

---

## 6. Architecture Summary

```
Frontend                Convex                 Dodo Payments
─────────               ──────                 ─────────────
BillingCTA.tsx          payments.ts            Hosted Checkout
  │                       │                         │
  └─ DodoCheckoutButton   └─ createCheckout ────────┘
       (useAction)              (action)
                                  │
                            dodo.ts (checkout)
                                  │
                            @dodopayments/convex
```

**Webhook flow (subscription lifecycle):**
```
Dodo Payments ──POST──▶ /dodo-webhook (convex/http.ts)
                              │
                    createDodoWebhookHandler
                    onPaymentSucceeded / onSubscriptionActive / ...
                              │
                    users.updatePlanFromWebhookInternal
                              │
                    users table: plan = "pro" | "free" | "lifetime"
```

**Clerk → Convex → Dodo linkage:**
```
Clerk User (clerkId)
   │
   ├─ dodo.ts identify()  ──▶ users table (by_clerkId)
   │                               │
   │                          dodoCustomerId (stored on first checkout)
   │
   └─ Metadata on checkout: { clerkId }
         │
         ▼
   Dodo webhook payload.data.metadata.clerkId
         │
         ▼
   Resolves → user row → plan update
```

---

## 7. MCP Server (VS Code Copilot)

The Dodo Payments MCP server is configured in [.vscode/mcp.json](.vscode/mcp.json):

- **`dodopayments`** — Execute API calls (create products, list subscriptions, etc.)  
  Uses OAuth — you'll be prompted to authenticate on first use.
- **`dodo-knowledge`** — Semantic search over Dodo documentation.

Both use the remote hosted servers via `mcp-remote`, so no local installation needed.

---

## 8. Going Live Checklist

- [ ] Create products in Dodo **live mode** dashboard
- [ ] Switch `DODO_PAYMENTS_ENVIRONMENT=live_mode` in Convex
- [ ] Replace test API key with live API key in Convex
- [ ] Update `NEXT_PUBLIC_DODO_PRODUCT_*` env vars to live product IDs
- [ ] Register live webhook URL in Dodo dashboard
- [ ] Test a real $1 purchase end-to-end
- [ ] Enable Customer Portal in Dodo dashboard settings
