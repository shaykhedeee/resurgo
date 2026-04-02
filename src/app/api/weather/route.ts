// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Weather API Proxy
// Server-side proxy for wttr.in to avoid CORS issues in production
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const location = searchParams.get('q') ?? 'auto';

  try {
    const url = `https://wttr.in/${encodeURIComponent(location)}?format=j1`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // cache for 1 hour
      headers: {
        'User-Agent': 'Resurgo/1.0 (weather proxy)',
      },
    });

    if (!res.ok) {
      return Response.json({ error: 'Weather service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (err) {
    console.error('[weather-proxy] error:', err);
    return Response.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
