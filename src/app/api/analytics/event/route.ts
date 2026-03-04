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

export async function POST(req: NextRequest) {
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
