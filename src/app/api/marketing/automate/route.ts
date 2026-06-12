// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO :: Marketing Automation Cron Dispatcher
// Automates: Twitter, LinkedIn, Reddit, and Instagram posting on a schedule.
// Triggered via Vercel Cron.
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

function authorize(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const adminSecretEnv = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get('authorization');
  const adminHeader = request.headers.get('x-admin-secret');

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (adminSecretEnv && adminHeader === adminSecretEnv) return true;

  // Allow in development/preview if not explicitly blocked
  return process.env.NODE_ENV !== 'production';
}

export async function POST(request: NextRequest) {
  return handleAutomate(request);
}

export async function GET(request: NextRequest) {
  return handleAutomate(request);
}

async function handleAutomate(request: NextRequest): Promise<NextResponse> {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const dryRunParam = searchParams.get('dryRun');
  
  // Parse body if present, fallback to empty object
  let body: any = {};
  if (request.method === 'POST') {
    body = await request.json().catch(() => ({}));
  }

  // dryRun is true by default to prevent accidental live postings during testing
  const dryRun = dryRunParam === 'false' || body.dryRun === false ? false : true;
  const requestedPlatform = searchParams.get('platform') || body.platform || 'all';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const results: Record<string, any> = {};

  // 1. Twitter posting automation
  const isTwitterConfigured = !!(process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_ACCESS_TOKEN);
  if (isTwitterConfigured && (requestedPlatform === 'all' || requestedPlatform === 'twitter')) {
    try {
      // Randomly choose between a product launch tweet (60%) or value thread (40%)
      const isThread = Math.random() < 0.4;
      const payload = isThread
        ? { action: 'thread', dryRun }
        : { action: 'tweet', templateType: Math.random() < 0.5 ? 'product_launch' : 'engagement', dryRun };

      const res = await fetch(`${baseUrl}/api/marketing/twitter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`,
        },
        body: JSON.stringify(payload),
      });

      results.twitter = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.twitter = { error: err.message };
    }
  } else if (requestedPlatform === 'twitter') {
    results.twitter = { error: 'Twitter keys not configured' };
  }

  // 2. LinkedIn posting automation
  const isLinkedinConfigured = !!(process.env.LINKEDIN_ACCESS_TOKEN && process.env.LINKEDIN_PERSON_URN);
  if (isLinkedinConfigured && (requestedPlatform === 'all' || requestedPlatform === 'linkedin')) {
    try {
      // Pick a random template type
      const templates = ['founder_story', 'value_post', 'milestone'];
      const templateType = templates[Math.floor(Math.random() * templates.length)];

      const res = await fetch(`${baseUrl}/api/marketing/linkedin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`,
        },
        body: JSON.stringify({
          action: 'post',
          templateType,
          dryRun,
        }),
      });

      results.linkedin = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.linkedin = { error: err.message };
    }
  } else if (requestedPlatform === 'linkedin') {
    results.linkedin = { error: 'LinkedIn keys not configured' };
  }

  // 3. Reddit posting automation
  const isRedditConfigured = !!process.env.REDDIT_CLIENT_ID;
  if (isRedditConfigured && (requestedPlatform === 'all' || requestedPlatform === 'reddit')) {
    try {
      // Pick a random subreddit that has templates
      const subs = ['productivity', 'getdisciplined', 'HabitTracker'];
      const subreddit = subs[Math.floor(Math.random() * subs.length)];

      const res = await fetch(`${baseUrl}/api/marketing/reddit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': ADMIN_SECRET,
        },
        body: JSON.stringify({
          subreddit,
          dryRun,
        }),
      });

      results.reddit = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.reddit = { error: err.message };
    }
  } else if (requestedPlatform === 'reddit') {
    results.reddit = { error: 'Reddit keys not configured' };
  }

  // 4. Instagram posting automation
  const isInstagramConfigured = !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID);
  if (isInstagramConfigured && (requestedPlatform === 'all' || requestedPlatform === 'instagram')) {
    try {
      const res = await fetch(`${baseUrl}/api/marketing/instagram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ADMIN_SECRET}`,
        },
        body: JSON.stringify({
          action: 'publish',
          templateType: 'product_showcase',
          imageUrl: `${baseUrl}/og-image.png`,
          dryRun,
        }),
      });

      results.instagram = {
        status: res.status,
        data: await res.json().catch(() => ({})),
      };
    } catch (err: any) {
      results.instagram = { error: err.message };
    }
  } else if (requestedPlatform === 'instagram') {
    results.instagram = { error: 'Instagram keys not configured' };
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    dryRun,
    requestedPlatform,
    results,
  });
}
