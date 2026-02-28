// ═══════════════════════════════════════════════════════════════════════════════
// ASCENDIFY — Clerk Billing Webhook
// Handles subscription changes → updates user plan in Convex
// POST /api/webhooks/clerk-billing
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';
import { mapClerkPlanToUserPlan } from '@/lib/billing/plans';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://localhost:3210');
const WEBHOOK_MAX_AGE_SECONDS = Number(process.env.CLERK_WEBHOOK_MAX_AGE_SECONDS ?? '300');
const WEBHOOK_MAX_RETRIES = 3;

type UserPlan = 'free' | 'pro' | 'lifetime';
type BillingAuditStatus = 'received' | 'applied' | 'ignored' | 'failed';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function logBillingEventBestEffort(args: {
  eventId: string;
  eventType: string;
  clerkId: string;
  status: BillingAuditStatus;
  plan?: UserPlan;
  reason?: string;
  details?: unknown;
}) {
  const syncSecret = process.env.BILLING_WEBHOOK_SYNC_SECRET;
  if (!syncSecret) return;

  try {
    const apiRef = (api as unknown as { users?: { logBillingEvent?: unknown } }).users?.logBillingEvent;
    if (!apiRef) return;

    const invokeMutation = convex.mutation as unknown as (
      functionReference: unknown,
      args: Record<string, unknown>
    ) => Promise<unknown>;

    await invokeMutation(apiRef, {
      userId: undefined,
      clerkId: args.clerkId,
      eventId: args.eventId,
      eventType: args.eventType,
      source: 'webhook',
      status: args.status,
      plan: args.plan,
      reason: args.reason,
      details: args.details,
      webhookSecret: syncSecret,
    });
  } catch (error) {
    console.error('[WebhookTelemetry] Failed to write billing audit event', {
      eventId: args.eventId,
      eventType: args.eventType,
      clerkId: args.clerkId,
      status: args.status,
      reason: args.reason,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function getRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function isWebhookTimestampStale(timestampHeader: string): boolean {
  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) return true;

  const now = Math.floor(Date.now() / 1000);
  const age = Math.abs(now - timestamp);
  return age > WEBHOOK_MAX_AGE_SECONDS;
}

async function applyPlanWithRetry(args: {
  clerkId: string;
  plan: UserPlan;
  eventId: string;
  eventType: string;
  webhookSecret: string;
  webhookTimestampMs?: number;
}) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= WEBHOOK_MAX_RETRIES; attempt++) {
    const startedAt = Date.now();

    try {
      const result = await convex.mutation(api.users.updatePlanFromWebhook, args);

      console.log(
        '[WebhookTelemetry]',
        JSON.stringify({
          level: 'info',
          event: 'plan_update_attempt',
          eventId: args.eventId,
          eventType: args.eventType,
          clerkId: args.clerkId,
          plan: args.plan,
          attempt,
          durationMs: Date.now() - startedAt,
          applied: result.applied,
          reason: result.reason,
        })
      );

      return result;
    } catch (err) {
      lastError = err;

      console.error(
        '[WebhookTelemetry]',
        JSON.stringify({
          level: 'error',
          event: 'plan_update_attempt_failed',
          eventId: args.eventId,
          eventType: args.eventType,
          clerkId: args.clerkId,
          plan: args.plan,
          attempt,
          durationMs: Date.now() - startedAt,
          error: err instanceof Error ? err.message : String(err),
        })
      );

      if (attempt < WEBHOOK_MAX_RETRIES) {
        await sleep(200 * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Webhook plan update failed after retries');
}

function extractClerkPlanIdentifier(data: Record<string, unknown>): string | null {
  const plan = getRecord(data.plan);
  const subscription = getRecord(data.subscription);
  const subscriptionPlan = subscription ? getRecord(subscription.plan) : null;
  const subscriptionItem = getRecord(data.subscription_item);
  const subscriptionItemPlan = subscriptionItem ? getRecord(subscriptionItem.plan) : null;
  const publicMetadata = getRecord(data.public_metadata);
  const privateMetadata = getRecord(data.private_metadata);

  const candidates: Array<unknown> = [
    data.plan_id,
    plan?.id,
    plan?.slug,
    plan?.name,
    subscription?.plan_id,
    subscriptionPlan?.id,
    subscriptionPlan?.slug,
    subscriptionPlan?.name,
    subscriptionItemPlan?.slug,
    subscriptionItemPlan?.name,
    subscriptionItemPlan?.id,
    publicMetadata?.plan,
    privateMetadata?.plan,
  ];

  for (const value of candidates) {
    const candidate = getString(value);
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

/** Extract user ID from various Clerk webhook payload shapes */
function extractClerkUserId(data: Record<string, unknown>): string | undefined {
  const user = getRecord(data.user);
  const subscriber = getRecord(data.subscriber);
  const subscription = getRecord(data.subscription);
  const subscriptionSubscriber = subscription ? getRecord(subscription.subscriber) : null;

  const candidates: Array<unknown> = [
    data.user_id,
    user?.id,
    subscriber?.user_id,
    subscriptionSubscriber?.user_id,
    subscription?.user_id,
  ];

  for (const value of candidates) {
    const candidate = getString(value);
    if (candidate) {
      return candidate;
    }
  }

  return undefined;
}

export async function POST(req: NextRequest) {
  // ────────────────────────────────────────────────────────────────────────
  // 1) Verify webhook signature (Clerk uses Svix)
  // ────────────────────────────────────────────────────────────────────────
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET env variable');
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  const svix_id = req.headers.get('svix-id');
  const svix_timestamp = req.headers.get('svix-timestamp');
  const svix_signature = req.headers.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    await logBillingEventBestEffort({
      eventId: svix_id ?? `missing-${Date.now()}`,
      eventType: 'webhook.invalid',
      clerkId: 'unknown',
      status: 'failed',
      reason: 'missing_svix_headers',
    });
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }

  // Replay-window guard: reject stale webhook timestamps.
  if (isWebhookTimestampStale(svix_timestamp)) {
    console.error('[Webhook] Stale or invalid timestamp', {
      svix_id,
      svix_timestamp,
      maxAgeSeconds: WEBHOOK_MAX_AGE_SECONDS,
    });
    await logBillingEventBestEffort({
      eventId: svix_id,
      eventType: 'webhook.invalid',
      clerkId: 'unknown',
      status: 'failed',
      reason: 'stale_webhook_timestamp',
      details: {
        svix_timestamp,
        maxAgeSeconds: WEBHOOK_MAX_AGE_SECONDS,
      },
    });
    return NextResponse.json({ error: 'Stale webhook timestamp' }, { status: 400 });
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: { type: string; data: Record<string, unknown> };
  try {
    event = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    console.error('Webhook verification failed:', err);
    await logBillingEventBestEffort({
      eventId: svix_id,
      eventType: 'webhook.invalid',
      clerkId: 'unknown',
      status: 'failed',
      reason: 'invalid_signature',
      details: {
        message: err instanceof Error ? err.message : String(err),
      },
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // ────────────────────────────────────────────────────────────────────────
  // 2) Handle billing events
  // ────────────────────────────────────────────────────────────────────────
  const { type, data } = event;
  const eventId = svix_id;
  const syncSecret = process.env.BILLING_WEBHOOK_SYNC_SECRET;

  if (!syncSecret) {
    console.error('Missing BILLING_WEBHOOK_SYNC_SECRET env variable');
    return NextResponse.json({ error: 'Server config error' }, { status: 500 });
  }

  console.log(`[Webhook] Received: ${type}`);

  try {
    switch (type) {
      // Subscription created or updated (legacy + new Clerk Billing events)
      case 'billing.subscription.created':
      case 'billing.subscription.updated':
      case 'subscription.created':
      case 'subscription.updated':
      case 'subscription.active':
      case 'subscriptionItem.active':
      case 'subscriptionItem.updated': {
        const clerkId = extractClerkUserId(data);
        const planIdentifier = extractClerkPlanIdentifier(data);

        if (!clerkId) {
          console.error('[Webhook] Missing user id in billing webhook payload');
          await logBillingEventBestEffort({
            eventId,
            eventType: type,
            clerkId: 'unknown',
            status: 'failed',
            reason: 'missing_user_id',
          });
          return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
        }

        const plan = mapClerkPlanToUserPlan(planIdentifier);

        // Validate plan is one of the allowed values
        if (!['free', 'pro', 'lifetime'].includes(plan)) {
          console.error(`[Webhook] Invalid plan value: ${plan} from identifier: ${planIdentifier}`);
          await logBillingEventBestEffort({
            eventId,
            eventType: type,
            clerkId,
            status: 'failed',
            reason: 'invalid_plan_value',
            details: { planIdentifier },
          });
          return NextResponse.json({ error: 'Invalid plan value' }, { status: 400 });
        }

        console.log(`[Webhook] Updating plan for ${clerkId} → ${plan} (${planIdentifier ?? 'unknown-plan'})`);

        try {
          const result = await applyPlanWithRetry({
            clerkId,
            plan,
            eventId,
            eventType: type,
            webhookSecret: syncSecret,
            // Convert svix_timestamp (seconds string) to milliseconds for stale-event guard
            webhookTimestampMs: svix_timestamp ? parseInt(svix_timestamp, 10) * 1000 : undefined,
          });

          if (!result.applied && result.reason === 'duplicate_event') {
            console.log(`[Webhook] Duplicate event ignored: ${eventId}`);
          } else {
            console.log(`[Webhook] Successfully updated plan for ${clerkId}`);
          }
        } catch (updateErr: unknown) {
          console.error(`[Webhook] CRITICAL: Failed to update plan for ${clerkId}:`, updateErr);
          const updateErrMessage = updateErr instanceof Error ? updateErr.message : String(updateErr);
          await logBillingEventBestEffort({
            eventId,
            eventType: type,
            clerkId,
            status: 'failed',
            plan,
            reason: 'plan_update_failed',
            details: {
              message: updateErrMessage,
            },
          });
          // Return 500 so Clerk retries the webhook
          return NextResponse.json(
            { error: 'Failed to process plan update', details: updateErrMessage },
            { status: 500 }
          );
        }

        break;
      }

      // Subscription cancelled / ended (legacy + new Clerk Billing events)
      case 'billing.subscription.deleted':
      case 'subscription.deleted':
      case 'subscriptionItem.canceled':
      case 'subscriptionItem.ended': {
        const clerkId = extractClerkUserId(data);
        if (!clerkId) {
          console.error('[Webhook] Missing user id in cancellation payload');
          await logBillingEventBestEffort({
            eventId,
            eventType: type,
            clerkId: 'unknown',
            status: 'failed',
            reason: 'missing_user_id',
          });
          return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
        }

        console.log(`[Webhook] Subscription cancelled for ${clerkId}`);
        try {
          const result = await applyPlanWithRetry({
            clerkId,
            plan: 'free',
            eventId,
            eventType: type,
            webhookSecret: syncSecret,
          });

          if (!result.applied && result.reason === 'duplicate_event') {
            console.log(`[Webhook] Duplicate cancellation event ignored: ${eventId}`);
          } else {
            console.log(`[Webhook] Successfully downgraded ${clerkId} to free plan`);
          }
        } catch (updateErr: unknown) {
          console.error(`[Webhook] CRITICAL: Failed to downgrade ${clerkId}:`, updateErr);
          const updateErrMessage = updateErr instanceof Error ? updateErr.message : String(updateErr);
          await logBillingEventBestEffort({
            eventId,
            eventType: type,
            clerkId,
            status: 'failed',
            plan: 'free',
            reason: 'cancellation_update_failed',
            details: {
              message: updateErrMessage,
            },
          });
          return NextResponse.json(
            { error: 'Failed to process cancellation', details: updateErrMessage },
            { status: 500 }
          );
        }

        break;
      }

      // User created in Clerk
      case 'user.created': {
        console.log(`[Webhook] New user: ${(data.id as string | undefined) ?? 'unknown'}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event: ${type}`);
        await logBillingEventBestEffort({
          eventId,
          eventType: type,
          clerkId: extractClerkUserId(data) ?? 'unknown',
          status: 'ignored',
          reason: 'unhandled_event_type',
        });
    }
  } catch (err: unknown) {
    console.error(`[Webhook] Unexpected error processing ${type}:`, err);
    await logBillingEventBestEffort({
      eventId,
      eventType: type,
      clerkId: extractClerkUserId(data) ?? 'unknown',
      status: 'failed',
      reason: 'unexpected_processing_error',
      details: {
        message: err instanceof Error ? err.message : String(err),
      },
    });
    return NextResponse.json(
      { error: 'Processing error', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
