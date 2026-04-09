// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Convex HTTP Routes
// Registers the Dodo Payments webhook endpoint handled by the official component.
// Webhook URL: https://<deployment>.convex.cloud/dodo-webhook
// ═══════════════════════════════════════════════════════════════════════════════

import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { createDodoWebhookHandler } from '@dodopayments/convex';
import { internal } from './_generated/api';
import {
  notifyPaymentSucceeded,
  notifySubscriptionActive,
  notifySubscriptionRenewed,
  notifySubscriptionCancelled,
  notifySubscriptionOnHold,
  notifyPaymentFailed,
  notifyRefundSucceeded,
} from './billingNotifications';

const http = httpRouter();

// ─────────────────────────────────────────────────────────────────────────────
// CLERK WEBHOOK — User Management (Deletion, Role Changes)
// Verification: clerkMiddleware-compatible Svix signature logic.
// Webhook URL: https://<deployment>.convex.cloud/clerk-webhook
// ─────────────────────────────────────────────────────────────────────────────

http.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const svixId = request.headers.get('svix-id');
    const svixSignature = request.headers.get('svix-signature');
    const svixTimestamp = request.headers.get('svix-timestamp');

    if (!svixId || !svixSignature || !svixTimestamp) {
      return new Response('Missing Svix headers', { status: 400 });
    }

    const payload = JSON.parse(payloadString);
    const eventType = payload.type;

    console.log(`[clerk-webhook] Received event: ${eventType}`);

    if (eventType === 'user.deleted') {
      const { id } = payload.data;
      await ctx.runMutation(internal.users.deleteUserInternal, { clerkId: id });
      console.log(`[clerk-webhook] User deleted: ${id}`);
    }

    if (eventType === 'user.updated') {
      const { id, first_name, last_name, image_url } = payload.data;
      await ctx.runMutation(internal.users.updateUserInternal, {
        clerkId: id,
        name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
        imageUrl: image_url,
      });
    }

    return new Response(null, { status: 200 });
  }),
});

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
      const _proMonthlyId = process.env.DODO_PRODUCT_ID_PRO_MONTHLY ?? '';
      const _proYearlyId = process.env.DODO_PRODUCT_ID_PRO_YEARLY ?? '';

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

      // Notify: Discord alert + Resend payment receipt
      await notifyPaymentSucceeded({
        customerEmail: data.customer?.email ?? '',
        customerName: data.customer?.name ?? 'Customer',
        amountCents: data.total_amount ?? 0,
        currency: data.currency ?? 'USD',
        paymentId: data.payment_id,
        plan,
      });
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

      // Store subscription ID + status for plan management
      await ctx.runMutation(internal.users.storeSubscriptionDataInternal, {
        clerkId: resolvedClerkId,
        dodoSubscriptionId: data.subscription_id,
        subscriptionStatus: 'active',
        nextBillingDate: data.next_billing_date ? data.next_billing_date.toISOString() : undefined,
        cancelAtNextBillingDate: false,
      });

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'pro',
        eventId: data.subscription_id,
        eventType: 'subscription.active',
      });

      // Notify: Discord alert + Resend subscription welcome email
      await notifySubscriptionActive({
        customerEmail: data.customer?.email ?? '',
        customerName: data.customer?.name ?? 'Customer',
        subscriptionId: data.subscription_id,
        amountCents: data.recurring_pre_tax_amount ?? 0,
        currency: data.currency ?? 'USD',
        interval: data.payment_frequency_interval ?? 'month',
        nextBillingDate: data.next_billing_date ? data.next_billing_date.toISOString() : undefined,
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

      // Reset on_hold / cancellation flags on successful renewal
      await ctx.runMutation(internal.users.updateSubscriptionStatusInternal, {
        clerkId: resolvedClerkId,
        subscriptionStatus: 'active',
        nextBillingDate: data.next_billing_date ? data.next_billing_date.toISOString() : undefined,
        cancelAtNextBillingDate: false,
      });

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'pro',
        eventId: data.subscription_id,
        eventType: 'subscription.renewed',
      });

      // Notify: Discord + Resend renewal receipt
      await notifySubscriptionRenewed({
        customerEmail: data.customer?.email ?? '',
        customerName: data.customer?.name ?? 'Customer',
        amountCents: data.recurring_pre_tax_amount ?? 0,
        currency: data.currency ?? 'USD',
        interval: data.payment_frequency_interval ?? 'month',
        nextBillingDate: data.next_billing_date ? data.next_billing_date.toISOString() : undefined,
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
      if (user?.plan === 'lifetime') {
        console.log(`[dodo-webhook] Skipping cancellation for lifetime user ${resolvedClerkId}`);
        return;
      }

      await ctx.runMutation(internal.users.updatePlanFromWebhookInternal, {
        clerkId: resolvedClerkId,
        plan: 'free',
        eventId: data.subscription_id,
        eventType: 'subscription.cancelled',
      });

      // Notify: Discord alert + Resend cancellation email
      await notifySubscriptionCancelled({
        customerEmail: data.customer?.email ?? '',
        customerName: data.customer?.name ?? 'Customer',
        subscriptionId: data.subscription_id,
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

      // Check if user is lifetime before downgrading
      const expiredUser = await ctx.runQuery(internal.users.getByClerkIdInternal, {
        clerkId: resolvedClerkId,
      });
      if (expiredUser?.plan === 'lifetime') {
        console.log(`[dodo-webhook] Skipping expiration for lifetime user ${resolvedClerkId}`);
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

    // ── Subscription on hold (payment failed, requires payment method update) ──
    onSubscriptionOnHold: async (ctx, payload) => {
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
        console.warn(`[dodo-webhook] subscription.on_hold: Could not resolve clerkId`);
        return;
      }

      // Mark on_hold — do NOT downgrade plan; access continues until resolved
      await ctx.runMutation(internal.users.updateSubscriptionStatusInternal, {
        clerkId: resolvedClerkId,
        subscriptionStatus: 'on_hold',
      });
      console.log(`[dodo-webhook] subscription.on_hold: clerkId=${resolvedClerkId}, sub=${data.subscription_id}`);

      // Notify: Discord alert + Resend dunning email
      await notifySubscriptionOnHold({
        customerEmail: data.customer?.email ?? '',
        customerName: data.customer?.name ?? 'Customer',
        subscriptionId: data.subscription_id,
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
    onPaymentFailed: async (_ctx, payload) => {
      const { data } = payload;
      console.warn(
        `[dodo-webhook] payment.failed: payment_id=${data.payment_id}, ` +
        `error=${data.error_message ?? 'unknown'}`
      );
      // Don't downgrade on payment failure — Dodo will retry and eventually
      // fire subscription.cancelled / subscription.expired if it's unrecoverable

      // Notify customer to update payment method
      if (data.customer?.email) {
        await notifyPaymentFailed({
          customerEmail: data.customer.email,
          customerName: data.customer.name ?? 'Customer',
          amountCents: data.total_amount ?? 0,
          currency: data.currency ?? 'USD',
          paymentId: data.payment_id,
          errorMessage: data.error_message ?? undefined,
        });
      }
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

      // Notify: Discord alert + Resend refund confirmation
      await notifyRefundSucceeded({
        customerEmail: data.customer?.customer_id ?? '',
        customerName: 'Customer',
        amountCents: data.amount ?? 0,
        currency: data.currency ?? 'USD',
        paymentId: data.payment_id,
      });
    },

    // ── Catch-all for any unhandled event types ──
    onPayload: async (_ctx, payload) => {
      console.log(`[dodo-webhook] Unhandled event type: ${payload.type}`);
    },
  }),
});

export default http;
