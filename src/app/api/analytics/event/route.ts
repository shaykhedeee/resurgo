import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

type AnalyticsApiShape = {
  marketing?: {
    logEvent?: unknown;
  };
};

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// IP rate limit: 30 events per minute
const rateMap = new Map<string, { count: number; resetAt: number }>();
function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
  if (!checkRate(ip)) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as {
      event?: unknown;
      properties?: Record<string, unknown>;
      path?: string;
    };

    const event = typeof body.event === 'string' ? body.event.trim() : '';
    if (event.length < 1 || event.length > 80) {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    const typedApi = api as unknown as AnalyticsApiShape;
    const apiRef = typedApi.marketing?.logEvent;

    if (convex && apiRef) {
      const invokeMutation = convex.mutation as unknown as (
        functionReference: unknown,
        args: Record<string, unknown>
      ) => Promise<unknown>;

      await invokeMutation(apiRef, {
        event,
        path: typeof body.path === 'string' ? body.path : req.nextUrl.pathname,
        properties: body.properties ?? {},
        sessionId:
          typeof body.properties?.sessionId === 'string' ? body.properties.sessionId : undefined,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
