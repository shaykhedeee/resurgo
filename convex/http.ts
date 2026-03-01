// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex HTTP Routes
// Registers the Dodo Payments webhook endpoint handled by the official component.
// Webhook URL: https://<deployment>.convex.cloud/dodo-webhook
// ═══════════════════════════════════════════════════════════════════════════════

import { httpRouter } from 'convex/server';
import { createDodoWebhookHandler } from '@dodopayments/convex';
import { internal } from './_generated/api';

const http = httpRouter();

// ─────────────────────────────────────────────────────────────────────────────
// DODO PAYMENTS WEBHOOK
// Uses the official @dodopayments/convex handler for signature verification
// and typed event dispatch. Register this URL in the Dodo dashboard.
// ─────────────────────────────────────────────────────────────────────────────

http.route({
  path: '/dodo-webhook',
  method: 'POST',
  handler: createDodoWebhookHandler({
    // ── Payment succeeded (one-time purchase or initial subscription payment) ──
    onPaymentSucceeded: async (ctx, payload) => {
      const { data } = payload;
      const clerkId =
        data.metadata?.clerkId ??
        data.metadata?.clerk_id ??
        null;
      const customerId = data.customer?.customer_id;
      const email = data.customer?.email;

      // Determine plan from product_cart
      const productIds = (data.product_cart ?? []).map((p) => p.product_id);
      const lifetimeId = process.env.DODO_PRODUCT_ID_LIFETIME ?? '';
      const proMonthlyId = process.env.DODO_PRODUCT_ID_PRO_MONTHLY ?? '';
      const proYearlyId = process.env.DODO_PRODUCT_ID_PRO_YEARLY ?? '';

      let plan: 'pro' | 'lifetime' = 'pro';
      if (lifetimeId && productIds.includes(lifetimeId)) {
        plan = 'lifetime';
      }

      // Resolve clerkId: try metadata first, then dodoCustomerId lookup, then email
      let resolvedClerkId = clerkId;
      if (!resolvedClerkId && customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }
      if (!resolvedClerkId && email) {
        const user = await ctx.runQuery(internal.users.getByEmailInternal, { email });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) {
        console.warn(
          `[dodo-webhook] payment.succeeded: Could not resolve clerkId. ` +
          `customer_id=${customerId}, email=${email}, payment_id=${data.payment_id}`
        );
        return;
      }

      // Store the dodoCustomerId mapping if we have one
      if (customerId) {
        await ctx.runMutation(internal.users.storeDodoCustomerId, {
          clerkId: resolvedClerkId,
          dodoCustomerId: customerId,
        });
      }

      // Apply plan update
      const syncSecret = process.env.BILLING_WEBHOOK_SYNC_SECRET;
      if (!syncSecret) {
        console.error('[dodo-webhook] BILLING_WEBHOOK_SYNC_SECRET not set');
        return;
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan,
        eventId: data.payment_id,
        eventType: 'payment.succeeded',
      });

      console.log(
        `[dodo-webhook] payment.succeeded → plan=${plan}, clerkId=${resolvedClerkId}, payment=${data.payment_id}`
      );
    },

    // ── Subscription active (initial activation or reactivation) ──
    onSubscriptionActive: async (ctx, payload) => {
      const { data } = payload;
      const customerId = data.customer?.customer_id;
      const email = data.customer?.email;
      const metadata = data.metadata as Record<string, string> | null;
      const clerkId = metadata?.clerkId ?? metadata?.clerk_id ?? null;

      let resolvedClerkId = clerkId;
      if (!resolvedClerkId && customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }
      if (!resolvedClerkId && email) {
        const user = await ctx.runQuery(internal.users.getByEmailInternal, { email });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) {
        console.warn(`[dodo-webhook] subscription.active: Could not resolve clerkId`);
        return;
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'pro',
        eventId: data.subscription_id,
        eventType: 'subscription.active',
      });
    },

    // ── Subscription renewed ──
    onSubscriptionRenewed: async (ctx, payload) => {
      const { data } = payload;
      const customerId = data.customer?.customer_id;
      const email = data.customer?.email;

      let resolvedClerkId: string | null = null;
      if (customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }
      if (!resolvedClerkId && email) {
        const user = await ctx.runQuery(internal.users.getByEmailInternal, { email });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) {
        console.warn(`[dodo-webhook] subscription.renewed: Could not resolve clerkId`);
        return;
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'pro',
        eventId: data.subscription_id,
        eventType: 'subscription.renewed',
      });
    },

    // ── Subscription cancelled ──
    onSubscriptionCancelled: async (ctx, payload) => {
      const { data } = payload;
      const customerId = data.customer?.customer_id;
      const email = data.customer?.email;

      let resolvedClerkId: string | null = null;
      if (customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }
      if (!resolvedClerkId && email) {
        const user = await ctx.runQuery(internal.users.getByEmailInternal, { email });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) {
        console.warn(`[dodo-webhook] subscription.cancelled: Could not resolve clerkId`);
        return;
      }

      // Check if user is lifetime before downgrading
      const user = await ctx.runQuery(internal.users.getByClerkIdInternal, {
        clerkId: resolvedClerkId,
      });
      if (user?.dodoCustomerId) {
        // Only downgrade if not lifetime
        const fullUser = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: user.dodoCustomerId,
        });
        if (fullUser?.plan === 'lifetime') {
          console.log(`[dodo-webhook] Skipping cancellation for lifetime user ${resolvedClerkId}`);
          return;
        }
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'free',
        eventId: data.subscription_id,
        eventType: 'subscription.cancelled',
      });
    },

    // ── Subscription expired ──
    onSubscriptionExpired: async (ctx, payload) => {
      const { data } = payload;
      const customerId = data.customer?.customer_id;

      let resolvedClerkId: string | null = null;
      if (customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) {
        console.warn(`[dodo-webhook] subscription.expired: Could not resolve clerkId`);
        return;
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'free',
        eventId: data.subscription_id,
        eventType: 'subscription.expired',
      });
    },

    // ── Subscription failed ──
    onSubscriptionFailed: async (ctx, payload) => {
      const { data } = payload;
      const customerId = data.customer?.customer_id;

      let resolvedClerkId: string | null = null;
      if (customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) {
        console.warn(`[dodo-webhook] subscription.failed: Could not resolve clerkId`);
        return;
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'free',
        eventId: data.subscription_id,
        eventType: 'subscription.failed',
      });
    },

    // ── Subscription paused ──
    onSubscriptionPaused: async (ctx, payload) => {
      const { data } = payload;
      const customerId = data.customer?.customer_id;

      let resolvedClerkId: string | null = null;
      if (customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) return;

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'free',
        eventId: data.subscription_id,
        eventType: 'subscription.paused',
      });
    },

    // ── Payment failed ──
    onPaymentFailed: async (ctx, payload) => {
      const { data } = payload;
      console.warn(
        `[dodo-webhook] payment.failed: payment_id=${data.payment_id}, ` +
        `error=${data.error_message ?? 'unknown'}`
      );
      // Don't downgrade on payment failure — Dodo will retry and eventually
      // fire subscription.cancelled / subscription.expired if it's unrecoverable
    },

    // ── Refund succeeded ──
    onRefundSucceeded: async (ctx, payload) => {
      const { data } = payload;
      const customerId = data.customer?.customer_id;

      let resolvedClerkId: string | null = null;
      if (customerId) {
        const user = await ctx.runQuery(internal.users.getByDodoCustomerIdInternal, {
          dodoCustomerId: customerId,
        });
        if (user) resolvedClerkId = user.clerkId;
      }

      if (!resolvedClerkId) {
        console.warn(`[dodo-webhook] refund.succeeded: Could not resolve clerkId`);
        return;
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'free',
        eventId: data.payment_id,
        eventType: 'refund.succeeded',
      });
    },

    // ── Catch-all for any unhandled event types ──
    onPayload: async (_ctx, payload) => {
      console.log(`[dodo-webhook] Unhandled event type: ${payload.type}`);
    },
  }),
});

export default http;
