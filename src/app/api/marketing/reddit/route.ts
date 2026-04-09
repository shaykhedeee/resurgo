// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Reddit Marketing Automation
// Schedule + post to relevant subreddits using Reddit API (OAuth 2.0)
// Reddit App: https://www.reddit.com/prefs/apps → create "script" type app
// Env needed: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID || '';
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET || '';
const REDDIT_USERNAME = process.env.REDDIT_USERNAME || '';
const REDDIT_PASSWORD = process.env.REDDIT_PASSWORD || '';
const REDDIT_BASE = 'https://oauth.reddit.com';

// Target subreddits for Resurgo
const RELEVANT_SUBREDDITS = [
  { sub: 'productivity', flair: 'App Recommendation', minKarma: 1000 },
  { sub: 'getdisciplined', flair: null, minKarma: 500 },
  { sub: 'HabitTracker', flair: null, minKarma: 0 },
  { sub: 'selfimprovement', flair: null, minKarma: 500 },
  { sub: 'ADHD_Productivity', flair: null, minKarma: 0 },
  { sub: 'nosurf', flair: null, minKarma: 0 },
  { sub: 'Habit', flair: null, minKarma: 0 },
  { sub: 'lifeadvice', flair: null, minKarma: 0 },
];

// -- Content templates for different subreddits --
const POST_TEMPLATES: Record<string, { title: string; text: string }[]> = {
  productivity: [
    {
      title: 'Built an AI life OS that actually broke my restart cycle — feedback welcome',
      text: `I've been building Resurgo for the past few months as a personal solution to a real problem: I'd set big goals, have a great week, then completely fall off and restart from zero. Again and again.

The core insight I coded into it: most productivity apps track what you did, but don't adapt to why you failed. So I added AI coaching that reads your data and gives context-aware advice — not generic tips.

Key features I'm most proud of:
- 5 AI coach personas (each with different philosophy: stoic, performance, creative systems, resilience, integration)
- AI that reads your habit/goal data before responding so it's actually relevant
- Deep Scan protocol — weekly psychological assessment that adapts your system
- Terminal-style UI because I hate bloated dashboards

It launched recently and I'm at [X] signups. Looking for genuine feedback from productive people who have tried every app.

Free plan has everything you need to test it: resurgo.life

What's the hardest part of your productivity system right now?`,
    },
  ],
  getdisciplined: [
    {
      title: 'How I stopped my 3-month restart cycle using AI coaching (built the app myself)',
      text: `The restart cycle almost broke me. Set a goal → crush it for 2 weeks → miss one day → give up → repeat.

I built Resurgo specifically to address this. Instead of just tracking streaks, it has a "comeback protocol" — when you miss, an AI coach (called Phoenix) activates and frames your comeback strategically instead of making you feel like a failure.

The psychology behind it: most productivity systems reward streaks (which punishes missing) rather than resilience. I flipped that.

Free at resurgo.life — I'd love to know if the Phoenix coach resonates with anyone else who struggles with restarts.`,
    },
  ],
  HabitTracker: [
    {
      title: 'Resurgo — AI habit tracker with 5 coaching personas (free to try)',
      text: `Hey r/HabitTracker — I've been building a habit tracker that goes deeper than streaks.

What makes it different from Habitica/Streaks/Loop:
✓ AI coaches that read your actual data before advising
✓ Habit stacking wizard with dependency chains  
✓ Psychological profiling that adapts your system
✓ Terminal-style UI (minimal, no gamification bloat)
✓ Pixelated design for a clean visual experience

Built with Next.js + Convex, hosted at resurgo.life

Would appreciate honest feedback from habit tracking enthusiasts. What feature do you wish your current app had?`,
    },
  ],
};

// -- Reddit OAuth token --
interface RedditToken {
  access_token: string;
  expires_at: number;
}

let cachedToken: RedditToken | null = null;

async function getToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }

  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET || !REDDIT_USERNAME || !REDDIT_PASSWORD) {
    return null;
  }

  try {
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Resurgo/1.0 (marketing bot; /u/resurgo_app)',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: REDDIT_USERNAME,
        password: REDDIT_PASSWORD,
        scope: 'submit read identity',
      }),
    });
    const data = await res.json();
    if (!data.access_token) return null;
    cachedToken = {
      access_token: data.access_token,
      expires_at: Date.now() + (data.expires_in - 60) * 1000,
    };
    return cachedToken.access_token;
  } catch {
    return null;
  }
}

async function submitPost(token: string, subreddit: string, title: string, text: string) {
  const res = await fetch(`${REDDIT_BASE}/api/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Resurgo/1.0 (marketing bot)',
    },
    body: new URLSearchParams({
      sr: subreddit,
      kind: 'self',
      title,
      text,
      nsfw: 'false',
      spoiler: 'false',
      resubmit: 'true',
      sendreplies: 'true',
    }),
  });
  return res.json();
}

export async function GET(request: NextRequest) {
  const adminSecret = request.headers.get('x-admin-secret');
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'status') {
    const configured = !!(REDDIT_CLIENT_ID && REDDIT_CLIENT_SECRET && REDDIT_USERNAME && REDDIT_PASSWORD);
    const token = configured ? await getToken() : null;
    return NextResponse.json({
      configured,
      authenticated: !!token,
      targetSubreddits: RELEVANT_SUBREDDITS.map(s => s.sub),
      setupInstructions: [
        '1. Go to https://www.reddit.com/prefs/apps',
        '2. Create a new "script" type app named "resurgo-marketing"',
        '3. Set redirect URI to http://localhost:8080',
        '4. Copy Client ID (shown under app name) → REDDIT_CLIENT_ID',
        '5. Copy Secret → REDDIT_CLIENT_SECRET',
        '6. Set REDDIT_USERNAME and REDDIT_PASSWORD (your Reddit account)',
        '7. Build up karma in target subreddits before posting',
      ],
    });
  }

  return NextResponse.json({ message: 'Reddit Marketing API', endpoints: ['GET ?action=status', 'POST to submit'] });
}

export async function POST(request: NextRequest) {
  // Admin-only check
  const adminSecret = request.headers.get('x-admin-secret');
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { subreddit, customTitle, customText, dryRun = true } = body;

  const token = await getToken();
  if (!token) {
    return NextResponse.json({
      error: 'Reddit not configured. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD',
    }, { status: 503 });
  }

  const subInfo = RELEVANT_SUBREDDITS.find(s => s.sub === subreddit);
  if (!subInfo && !customTitle) {
    return NextResponse.json({ error: 'Unknown subreddit or missing customTitle' }, { status: 400 });
  }

  const templates = POST_TEMPLATES[subreddit] || [];
  const template = templates[0];
  const title = customTitle || template?.title || 'Check out Resurgo — AI life OS';
  const text = customText || template?.text || 'Check out resurgo.life for AI-powered goal execution.';

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      wouldPost: { subreddit, title, text: text.substring(0, 200) + '...' },
      warning: 'Set dryRun: false to actually post. Build karma before posting to avoid bans.',
    });
  }

  try {
    const result = await submitPost(token, subreddit, title, text);
    return NextResponse.json({ success: true, reddit: result });
  } catch (err) {
    return NextResponse.json({ error: 'Post failed', details: String(err) }, { status: 500 });
  }
}
