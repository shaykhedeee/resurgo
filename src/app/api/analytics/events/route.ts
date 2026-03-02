import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const ANALYTICS_SYNC_SECRET = process.env.BILLING_WEBHOOK_SYNC_SECRET;

const ALLOWED_EVENT_NAMES = [
  'vision_board_viewed',
  'vision_board_generate_clicked',
  'vision_board_generation_success',
  'vision_board_generation_failed',
  'vision_board_pro_gate_hit',
  'upgrade_clicked',
] as const;

type ClientGrowthEventName = typeof ALLOWED_EVENT_NAMES[number];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isClientGrowthEventName(value: unknown): value is ClientGrowthEventName {
  return typeof value === 'string' && ALLOWED_EVENT_NAMES.includes(value as ClientGrowthEventName);
}

export async function POST(request: NextRequest) {
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  if (!ANALYTICS_SYNC_SECRET) {
    return NextResponse.json({ success: true, skipped: true });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!isObject(body) || !isClientGrowthEventName(body.eventName)) {
    return NextResponse.json({ success: false, error: 'Invalid event payload' }, { status: 400 });
  }

  let token: string;
  try {
    const t = await getToken({ template: 'convex' });
    if (!t) throw new Error('no token');
    token = t;
  } catch {
    return NextResponse.json({ success: true, skipped: true });
  }

  convex.setAuth(token);

  const page = typeof body.page === 'string' ? body.page.trim().slice(0, 120) : undefined;
  const conversationId =
    typeof body.conversationId === 'string' && body.conversationId.trim().length > 0
      ? body.conversationId.trim().slice(0, 80)
      : undefined;
  const details = isObject(body.details) ? body.details : undefined;

  try {
    const clerkUser = await currentUser();
    const clerkId = clerkUser?.id ?? userId;

    const apiRef = (api as unknown as { growthAnalytics?: { logGrowthEvent?: unknown } })
      .growthAnalytics
      ?.logGrowthEvent;

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
      source: 'client',
      page,
      conversationId,
      details,
      syncSecret: ANALYTICS_SYNC_SECRET,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.warn('[GrowthTelemetry] Client event logging failed', {
      eventName: body.eventName,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ success: true, skipped: true });
  }
}
