import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const MAX_PER_HOUR = 10;
const WINDOW_MS = 60 * 60 * 1000;
const ipThrottle = new Map<string, { count: number; resetAt: number }>();

type LeadsApiShape = {
  leads?: {
    capture?: unknown;
  };
};

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const current = ipThrottle.get(ip);

  if (!current || now > current.resetAt) {
    ipThrottle.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (current.count >= MAX_PER_HOUR) return true;
  current.count += 1;
  return false;
}

function parseUtmFromUrl(url: URL): Record<string, string> | null {
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const out: Record<string, string> = {};

  for (const key of keys) {
    const value = url.searchParams.get(key);
    if (value) out[key] = value;
  }

  return Object.keys(out).length ? out : null;
}

function getHeaderValue(req: NextRequest, name: string): string | null {
  const value = req.headers.get(name);
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

async function sendToButtondown(email: string): Promise<void> {
  const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
  const BUTTONDOWN_LIST_ID = process.env.BUTTONDOWN_LIST_ID;
  if (!BUTTONDOWN_API_KEY || !BUTTONDOWN_LIST_ID) return;

  try {
    await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Token ${BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, tags: [BUTTONDOWN_LIST_ID] }),
    });
  } catch {
    // Best-effort integration only.
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      source?: unknown;
      offer?: unknown;
      variant?: unknown;
      company?: unknown;
    };

    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const company = typeof body.company === 'string' ? body.company.trim() : '';

    if (company) {
      return NextResponse.json({ error: 'Rejected' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const utm = parseUtmFromUrl(req.nextUrl);
    const referrer = getHeaderValue(req, 'referer');
    const userAgent = getHeaderValue(req, 'user-agent');

    const typedApi = api as unknown as LeadsApiShape;
    const apiRef = typedApi.leads?.capture;

    if (convex && apiRef) {
      const invokeMutation = convex.mutation as unknown as (
        functionReference: unknown,
        args: Record<string, unknown>
      ) => Promise<unknown>;

      await invokeMutation(apiRef, {
        email,
        source: typeof body.source === 'string' ? body.source : 'unknown',
        offer: typeof body.offer === 'string' ? body.offer : null,
        variant: typeof body.variant === 'string' ? body.variant : null,
        referrer,
        userAgent,
        utmSource: utm?.utm_source ?? null,
        utmMedium: utm?.utm_medium ?? null,
        utmCampaign: utm?.utm_campaign ?? null,
        utmTerm: utm?.utm_term ?? null,
        utmContent: utm?.utm_content ?? null,
        capturedAt: Date.now(),
      });
    }

    await sendToButtondown(email);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
