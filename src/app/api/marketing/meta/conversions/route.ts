// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Conversions API Route (Server-Side Events)
// POST: receive client-side events and forward to Meta CAPI
// This provides server-to-server event delivery that bypasses ad-blockers
// and maximizes attribution quality for iOS 14.5+ and privacy browsers.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  sendEvents,
  hashUserData,
  generateEventId,
  type ServerEvent,
} from '@/lib/marketing/meta-conversions';

// Standard events that are valid on Meta CAPI
const ALLOWED_EVENTS = new Set([
  // Meta Standard Events
  'AddPaymentInfo',
  'AddToCart',
  'AddToWishlist',
  'CompleteRegistration',
  'Contact',
  'CustomizeProduct',
  'Donate',
  'FindLocation',
  'InitiateCheckout',
  'Lead',
  'PageView',
  'Purchase',
  'Schedule',
  'Search',
  'StartTrial',
  'SubmitApplication',
  'Subscribe',
  'ViewContent',
  // Resurgo Custom Events
  'AppInstall',
  'CTAClick',
  'CompleteOnboarding',
  'CreateFirstGoal',
  'WeekStreak',
  'MonthStreak',
  'ActivateUser',
  'ReferralSent',
  'BlogRead',
]);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { event_name, params, fbc, fbp, source_url, email, user_id } = body;

    if (!event_name) {
      return NextResponse.json({ error: 'event_name required' }, { status: 400 });
    }

    if (!ALLOWED_EVENTS.has(event_name)) {
      return NextResponse.json(
        { error: `Event '${event_name}' not allowed. Allowed: ${[...ALLOWED_EVENTS].join(', ')}` },
        { status: 400 }
      );
    }

    // Extract IP and User-Agent from the request for attribution
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = req.headers.get('user-agent') || '';

    // Try to get authenticated user info
    const authEmail = email;
    let authUserId = user_id;
    try {
      const { userId } = await auth();
      if (userId) authUserId = userId;
    } catch {
      // Not authenticated — that's fine for marketing events
    }

    const userData = hashUserData({
      email: authEmail,
      externalId: authUserId,
      ipAddress,
      userAgent,
      fbc: fbc || undefined,
      fbp: fbp || undefined,
    });

    const event: ServerEvent = {
      event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: generateEventId(),
      event_source_url: source_url || 'https://resurgo.life',
      action_source: 'website',
      user_data: userData,
      custom_data: params || {},
    };

    // Send to Meta CAPI
    const result = await sendEvents([event]);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Meta CAPI] ${event_name} → received: ${result.events_received}`);
    }

    return NextResponse.json({
      success: true,
      events_received: result.events_received,
      event_id: event.event_id,
    });
  } catch (error) {
    // Log but don't fail the request — analytics should never block UX
    console.error('[Meta CAPI Route]', (error as Error).message);

    return NextResponse.json(
      { error: (error as Error).message, success: false },
      { status: 500 }
    );
  }
}
