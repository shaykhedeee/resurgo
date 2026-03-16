// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Payment Actions (Dodo Payments)
// Checkout session creation + Customer Portal + Subscription management
// ═══════════════════════════════════════════════════════════════════════════════

import { action } from './_generated/server';
import { v } from 'convex/values';
import { checkout, customerPortal } from './dodo';
import { internal } from './_generated/api';
import DodoPayments from 'dodopayments';

function getDodoClient() {
  return new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY!,
    environment: (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') ?? 'test_mode',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CHECKOUT — Returns a Dodo-hosted checkout URL
// Called from the frontend when user clicks "Upgrade" / "Buy"
// ─────────────────────────────────────────────────────────────────────────────
export const createCheckout = action({
  args: {
    productId: v.string(),
    quantity: v.optional(v.number()),
    returnUrl: v.optional(v.string()),
    discountCode: v.optional(v.string()),
  },
  returns: v.object({ checkout_url: v.string() }),
  handler: async (ctx, { productId, quantity, returnUrl, discountCode }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const result = await checkout(ctx, {
      payload: {
        product_cart: [
          {
            product_id: productId,
            quantity: quantity ?? 1,
          },
        ],
        customer: {
          email: identity.email!,
          name: identity.name ?? undefined,
        },
        metadata: {
          clerkId: identity.subject,
          ...(discountCode ? { promoCode: discountCode } : {}),
        },
        ...(discountCode ? { discount_code: discountCode } : {}),
        return_url: returnUrl ?? `${process.env.SITE_URL ?? 'https://resurgo.life'}/billing?success=true`,
        customization: {
          theme: 'dark',
          show_order_details: true,
        },
      },
    });

    return result;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET CUSTOMER PORTAL — Returns Dodo customer portal URL
// Called from billing page "Manage subscription" button
// ─────────────────────────────────────────────────────────────────────────────
export const getCustomerPortal = action({
  args: {},
  returns: v.object({ portal_url: v.string() }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const result = await customerPortal(ctx);
    return result;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// GET SUBSCRIPTION DETAILS — Fetch live subscription from Dodo
// Returns current status, next billing date, plan, cancel-at-period-end flag
// ─────────────────────────────────────────────────────────────────────────────
export const getSubscriptionDetails = action({
  args: {},
  returns: v.union(
    v.object({
      subscription_id: v.string(),
      status: v.string(),
      product_id: v.string(),
      plan_name: v.optional(v.string()),
      next_billing_date: v.optional(v.string()),
      cancel_at_next_billing_date: v.boolean(),
      trial_period_days: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.runQuery(internal.users.getByClerkIdInternal, {
      clerkId: identity.subject,
    });
    if (!user?.dodoSubscriptionId) return null;

    const client = getDodoClient();
    const sub = await client.subscriptions.retrieve(user.dodoSubscriptionId);
    return {
      subscription_id: sub.subscription_id,
      status: sub.status,
      product_id: sub.product_id,
      plan_name: undefined,
      next_billing_date: sub.next_billing_date ?? undefined,
      cancel_at_next_billing_date: sub.cancel_at_next_billing_date,
      trial_period_days: sub.trial_period_days ?? undefined,
    };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CANCEL SUBSCRIPTION — Schedules cancellation at end of billing period
// ─────────────────────────────────────────────────────────────────────────────
export const cancelSubscription = action({
  args: {
    immediately: v.optional(v.boolean()),
  },
  returns: v.object({ cancelled: v.boolean() }),
  handler: async (ctx, { immediately = false }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.runQuery(internal.users.getByClerkIdInternal, {
      clerkId: identity.subject,
    });
    if (!user?.dodoSubscriptionId) throw new Error('No active subscription found');

    const client = getDodoClient();

    if (immediately) {
      // Immediately cancel — sets status to cancelled
      await client.subscriptions.update(user.dodoSubscriptionId, {
        status: 'cancelled',
      });
      await ctx.runMutation(internal.users.updateSubscriptionStatusInternal, {
        clerkId: identity.subject,
        subscriptionStatus: 'cancelled',
      });
    } else {
      // Cancel at next billing date (graceful — user keeps access until period end)
      await client.subscriptions.update(user.dodoSubscriptionId, {
        cancel_at_next_billing_date: true,
      });
      await ctx.runMutation(internal.users.updateSubscriptionStatusInternal, {
        clerkId: identity.subject,
        subscriptionStatus: 'active',
        cancelAtNextBillingDate: true,
      });
    }

    return { cancelled: true };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CHANGE PLAN — Upgrade or downgrade subscription with proration
// ─────────────────────────────────────────────────────────────────────────────
export const changePlan = action({
  args: {
    newProductId: v.string(),
    quantity: v.optional(v.number()),
    prorationMode: v.optional(v.union(
      v.literal('prorated_immediately'),
      v.literal('difference_immediately'),
      v.literal('full_immediately'),
    )),
  },
  returns: v.object({ changed: v.boolean() }),
  handler: async (ctx, { newProductId, quantity = 1, prorationMode = 'prorated_immediately' }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.runQuery(internal.users.getByClerkIdInternal, {
      clerkId: identity.subject,
    });
    if (!user?.dodoSubscriptionId) throw new Error('No active subscription found');

    const client = getDodoClient();
    await client.subscriptions.changePlan(user.dodoSubscriptionId, {
      product_id: newProductId,
      quantity,
      proration_billing_mode: prorationMode,
    });

    return { changed: true };
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PAYMENT METHOD — Used to reactivate on_hold subscriptions
// Returns a hosted URL for the customer to update their card
// ─────────────────────────────────────────────────────────────────────────────
export const updatePaymentMethod = action({
  args: {
    returnUrl: v.optional(v.string()),
  },
  returns: v.object({
    payment_link: v.optional(v.string()),
    payment_id: v.optional(v.string()),
  }),
  handler: async (ctx, { returnUrl }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.runQuery(internal.users.getByClerkIdInternal, {
      clerkId: identity.subject,
    });
    if (!user?.dodoSubscriptionId) throw new Error('No active subscription found');

    const client = getDodoClient();
    const result = await client.subscriptions.updatePaymentMethod(user.dodoSubscriptionId, {
      type: 'new',
      return_url: returnUrl ?? `${process.env.SITE_URL ?? 'https://resurgo.life'}/billing?reactivated=true`,
    });

    return {
      payment_link: result.payment_link ?? undefined,
      payment_id: result.payment_id ?? undefined,
    };
  },
});
