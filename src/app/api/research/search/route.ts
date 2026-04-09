import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { searchBrave } from '@/lib/research/brave';

const payloadSchema = z.object({
  query: z.string().min(2).max(300),
  count: z.number().int().min(1).max(10).optional(),
});

function parseRequest(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q');
  const count = request.nextUrl.searchParams.get('count');
  if (q) {
    return payloadSchema.parse({
      query: q,
      count: count ? Number(count) : undefined,
    });
  }
  return null;
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const parsed = parseRequest(request);
    if (!parsed) {
      return NextResponse.json({ error: 'Missing query parameter q' }, { status: 400 });
    }

    const result = await searchBrave(parsed.query, parsed.count ?? 5);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[research/search] GET failed:', error);
    return NextResponse.json({ error: 'Research request failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = payloadSchema.parse(body);
    const result = await searchBrave(parsed.query, parsed.count ?? 5);
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[research/search] POST failed:', error);
    return NextResponse.json({ error: 'Research request failed' }, { status: 500 });
  }
}
