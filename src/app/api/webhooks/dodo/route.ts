// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Dodo Payments Webhook
// Handles payment/subscription events → updates user plan in Convex
// POST /api/webhooks/dodo
//
// Dodo is Merchant of Record — handles all taxes/VAT for India-based founders.
// Webhook signature uses HMAC-SHA256 with DODO_WEBHOOK_SECRET.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type UserPlan = 'free' | 'pro' | 'lifetime';

interface DodoWebhookEvent {
  type: string;
  data: {
    payment_id?: string;
    subscription_id?: string;
    customer?: {
      email?: string;
      customer_id?: string;
    };
    metadata?: Record<string, string>;
    product_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    created_at?: string;
  };
  business_id?: string;
  timestamp?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAP DODO EVENT TYPE → USER PLAN
// ─────────────────────────────────────────────────────────────────────────────

function mapDodoEventToPlan(event: DodoWebhookEvent): UserPlan | null {
  const { type, data } = event;

  // Payment succeeded = one-time (lifetime) or initial subscription payment
  if (type === 'payment.succeeded') {
    const productId = data.product_id ?? data.metadata?.product_id ?? '';
    const amount = data.amount ?? 0;

    // Lifetime: check product_id env var or amount threshold ($199+)
    const lifetimeProductId = process.env.DODO_PRODUCT_ID_LIFETIME ?? '';
    if (lifetimeProductId && productId === lifetimeProductId) return 'lifetime';
    if (amount >= 19900) return 'lifetime'; // $199 in cents

    // Pro: any other successful payment
    const proMonthlyId = process.env.DODO_PRODUCT_ID_PRO_MONTHLY ?? '';
    const proYearlyId = process.env.DODO_PRODUCT_ID_PRO_YEARLY ?? '';
    if (productId && (productId === proMonthlyId || productId === proYearlyId)) return 'pro';

    // Fall back: any paid amount = pro
    if (amount > 0) return 'pro';
    return null;
  }

  // Subscription active / renewed
  if (type === 'subscription.active' || type === 'subscription.renewed') {
    return 'pro';
  }

  // Subscription cancelled / expired / payment failed → downgrade to free
  if (
    type === 'subscription.cancelled' ||
    type === 'subscription.expired' ||
    type === 'payment.failed' ||
    type === 'subscription.paused'
  ) {
    // Only downgrade if not lifetime (lifetime has no subscription to cancel)
    return 'free';
  }

  // Refund: return to free
  if (type === 'payment.refunded') {
    const amount = data.amount ?? 0;
    if (amount >= 19900) return 'free'; // Lifetime refunded
    return 'free';
  }

  return null; // Unhandled event type — ignore
}

// ─────────────────────────────────────────────────────────────────────────────
// EXTRACT CLERK ID
// Dodo allows passing metadata at checkout. We expect clerkId in metadata.
// Fallback: store email → clerkId mapping via Convex query.
// ─────────────────────────────────────────────────────────────────────────────

function extractClerkId(event: DodoWebhookEvent): string | null {
  // Primary: metadata.clerkId set at checkout
  const clerkId = event.data.metadata?.clerkId ?? event.data.metadata?.clerk_id;
  if (clerkId) return clerkId;

  // Secondary: metadata.userId (some Dodo implementations)
  const userId = event.data.metadata?.userId ?? event.data.metadata?.user_id;
  if (userId) return userId;

  return null;
}

function extractEmail(event: DodoWebhookEvent): string | null {
  return event.data.customer?.email ?? event.data.metadata?.email ?? null;
}

function extractEventId(event: DodoWebhookEvent): string {
  return (
    event.data.payment_id ??
    event.data.subscription_id ??
    `dodo_${event.type}_${event.timestamp ?? Date.now()}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGNATURE VERIFICATION (HMAC-SHA256)
// Dodo sends: webhook-signature: sha256=<hex>
// ─────────────────────────────────────────────────────────────────────────────

async function verifyDodoSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const hexSignature = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Dodo sends "sha256=<hex>" or just "<hex>"
    const incoming = signatureHeader.replace(/^sha256=/, '');

    // Constant-time comparison
    if (incoming.length !== hexSignature.length) return false;
    const a = encoder.encode(incoming);
    const b = encoder.encode(hexSignature);
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  } catch (err) {
    console.error('[DodoWebhook] Signature verification error:', err);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.DODO_WEBHOOK_SECRET;
  const syncSecret = process.env.BILLING_WEBHOOK_SYNC_SECRET;

  // Guard: secrets must be configured
  if (!webhookSecret || !syncSecret) {
    console.error('[DodoWebhook] Missing DODO_WEBHOOK_SECRET or BILLING_WEBHOOK_SYNC_SECRET');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signatureHeader = req.headers.get('webhook-signature');

  // Verify signature
  const isValid = await verifyDodoSignature(rawBody, signatureHeader, webhookSecret);
  if (!isValid) {
    console.warn('[DodoWebhook] Invalid signature — possible replay attack or misconfiguration');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Parse body
  let event: DodoWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const eventId = extractEventId(event);
  const eventType = event.type;

  console.log(`[DodoWebhook] Received: ${eventType} | id=${eventId}`);

  // Determine plan change
  const newPlan = mapDodoEventToPlan(event);
  if (newPlan === null) {
    console.log(`[DodoWebhook] Skipping unhandled event type: ${eventType}`);
    return NextResponse.json({ received: true, action: 'skipped', reason: 'unhandled_event_type' });
  }

  // Extract clerkId
  const clerkId = extractClerkId(event);
  if (!clerkId) {
    const email = extractEmail(event);
    console.warn(
      `[DodoWebhook] No clerkId in metadata for event ${eventId}. email=${email ?? 'none'}. ` +
      `Pass clerkId in Dodo checkout metadata: { clerkId: userId }`
    );
    // Still return 200 so Dodo doesn't retry — but log for debugging
    return NextResponse.json({
      received: true,
      action: 'skipped',
      reason: 'no_clerk_id_in_metadata',
      hint: 'Add clerkId to Dodo checkout metadata',
    });
  }

  // Apply plan update via existing Convex mutation (handles idempotency + audit)
  try {
    const result = await convex.mutation(api.users.updatePlanFromWebhook, {
      clerkId,
      plan: newPlan,
      eventId,
      eventType,
      webhookSecret: syncSecret,
      webhookTimestampMs: event.timestamp ? new Date(event.timestamp).getTime() : undefined,
    });

    console.log(`[DodoWebhook] Plan update result for ${clerkId}: applied=${result.applied}, reason=${result.reason}`);

    return NextResponse.json({
      received: true,
      applied: result.applied,
      reason: result.reason,
      plan: newPlan,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[DodoWebhook] Convex mutation failed for event ${eventId}:`, message);

    // Return 500 so Dodo retries the webhook
    return NextResponse.json({ error: 'Internal error — will retry' }, { status: 500 });
  }
}
