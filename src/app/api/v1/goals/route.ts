// ═══════════════════════════════════════════════════════════════════════════════
// GET /api/v1/goals — list active goals
// Authorization: Bearer rsg_<key>
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { resolveApiKey, convexClient } from '../_lib/auth';
import { api } from '../../../../../convex/_generated/api';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const goals = await convexClient.query(api.restApi.listGoals, { userId: auth.ownerId }).catch(() => []);
  return NextResponse.json({ goals });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await resolveApiKey(req.headers.get('authorization'));
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { title, category, description, targetDate, lifeDomain, whyImportant } = body;

  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (typeof category !== 'string' || !category.trim()) {
    return NextResponse.json({ error: 'category is required' }, { status: 400 });
  }

  const validDomains = ['health', 'career', 'finance', 'learning', 'relationships', 'creativity', 'mindfulness', 'personal_growth'] as const;
  const domainVal = typeof lifeDomain === 'string' && (validDomains as readonly string[]).includes(lifeDomain)
    ? lifeDomain as typeof validDomains[number]
    : undefined;

  const result = await convexClient.mutation(api.restApi.createGoal, {
    userId: auth.ownerId,
    title: title.trim(),
    category: category.trim(),
    description: typeof description === 'string' ? description : undefined,
    targetDate: typeof targetDate === 'string' ? targetDate : undefined,
    lifeDomain: domainVal,
    whyImportant: typeof whyImportant === 'string' ? whyImportant : undefined,
  });

  return NextResponse.json(result, { status: 201 });
}
