// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Payment Actions (Dodo Payments)
// Checkout session creation + Customer Portal for billing management
// ═══════════════════════════════════════════════════════════════════════════════

import { action } from './_generated/server';
import { v } from 'convex/values';
import { checkout, customerPortal } from './dodo';

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CHECKOUT — Returns a Dodo-hosted checkout URL
// Called from the frontend when user clicks "Upgrade" / "Buy"
// ─────────────────────────────────────────────────────────────────────────────
export const createCheckout = action({
  args: {
    productId: v.string(),
    quantity: v.optional(v.number()),
    returnUrl: v.optional(v.string()),
  },
  returns: v.object({ checkout_url: v.string() }),
  handler: async (ctx, { productId, quantity, returnUrl }) => {
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
        },
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
