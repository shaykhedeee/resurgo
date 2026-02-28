import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://localhost:3210');
const CHATBOT_SYNC_SECRET = process.env.BILLING_WEBHOOK_SYNC_SECRET;

const ALLOWED_EVENT_NAMES = [
  'cta_clicked',
  'resolution_confirmed',
] as const;

type ClientEventName = typeof ALLOWED_EVENT_NAMES[number];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isClientEventName(value: unknown): value is ClientEventName {
  return typeof value === 'string' && ALLOWED_EVENT_NAMES.includes(value as ClientEventName);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!CHATBOT_SYNC_SECRET) {
    return NextResponse.json({ success: true, skipped: true });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!isObject(body) || !isClientEventName(body.eventName)) {
    return NextResponse.json({ success: false, error: 'Invalid event payload' }, { status: 400 });
  }

  const conversationId =
    typeof body.conversationId === 'string' && body.conversationId.trim().length > 0
      ? body.conversationId.trim().slice(0, 80)
      : undefined;

  const intent =
    body.intent === 'greeting' ||
    body.intent === 'help_feature' ||
    body.intent === 'troubleshooting' ||
    body.intent === 'pricing_question' ||
    body.intent === 'upgrade_interest' ||
    body.intent === 'habit_advice' ||
    body.intent === 'motivation_needed' ||
    body.intent === 'feedback' ||
    body.intent === 'cancel_subscription' ||
    body.intent === 'unknown'
      ? body.intent
      : undefined;

  const cta = isObject(body.cta) && typeof body.cta.label === 'string' && typeof body.cta.href === 'string'
    ? {
        label: body.cta.label.trim().slice(0, 48),
        href: body.cta.href.trim().slice(0, 160),
      }
    : undefined;

  try {
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    const clerkId = clerkUser?.id ?? userId;

    const apiRef = (api as unknown as { chatbotAnalytics?: { logChatbotEvent?: unknown } })
      .chatbotAnalytics
      ?.logChatbotEvent;

    if (!apiRef) {
      return NextResponse.json({ success: true, skipped: true });
    }

    const invokeMutation = convex.mutation as unknown as (
      functionReference: unknown,
      mutationArgs: Record<string, unknown>
    ) => Promise<unknown>;

    await invokeMutation(apiRef, {
      clerkId,
      eventName: body.eventName,
      intent,
      source: 'client',
      conversationId,
      cta,
      details: isObject(body.details) ? body.details : undefined,
      syncSecret: CHATBOT_SYNC_SECRET,
    });

    if (
      body.eventName === 'resolution_confirmed' &&
      (intent === 'troubleshooting' || intent === 'motivation_needed')
    ) {
      const scheduleRef = (api as unknown as { chatbotAnalytics?: { scheduleResolutionFollowUps?: unknown } })
        .chatbotAnalytics
        ?.scheduleResolutionFollowUps;

      if (scheduleRef) {
        await invokeMutation(scheduleRef, {
          syncSecret: CHATBOT_SYNC_SECRET,
          clerkId,
          intent,
          conversationId,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('[ChatbotTelemetry] Client event logging failed', {
      eventName: body.eventName,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: true, skipped: true });
  }
}
