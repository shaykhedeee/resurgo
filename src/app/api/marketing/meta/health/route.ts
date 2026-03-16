// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Meta Marketing API: Health Check Route
// GET: verify token, ad account access, and pixel configuration
// ═══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { checkMetaApiHealth } from '@/lib/marketing/meta-api';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'shaykhede2005@gmail.com').split(',').map(e => e.trim());

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;
  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const health = await checkMetaApiHealth();
    return NextResponse.json(health);
  } catch (error) {
    console.error('[Meta Health GET]', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
