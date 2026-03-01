// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dodo Payments Component Configuration
// Maps Clerk-authenticated users to Dodo Payments customers via Convex
// ═══════════════════════════════════════════════════════════════════════════════

import { DodoPayments, DodoPaymentsClientConfig } from '@dodopayments/convex';
import { components } from './_generated/api';
import { internal } from './_generated/api';

export const dodo = new DodoPayments(components.dodopayments, {
  // Maps the current Convex user → Dodo Payments customer
  identify: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Look up user by clerkId
    const user = await ctx.runQuery(internal.users.getByClerkIdInternal, {
      clerkId: identity.subject,
    });
    if (!user) return null;

    // If user already has a dodoCustomerId stored, return it
    if (user.dodoCustomerId) {
      return { dodoCustomerId: user.dodoCustomerId };
    }

    // First-time: no dodoCustomerId yet — return null so Dodo creates
    // the customer at checkout, and the webhook stores the mapping
    return null;
  },
  apiKey: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode',
} as DodoPaymentsClientConfig);

// Export API methods for use in actions + frontend
export const { checkout, customerPortal } = dodo.api();
