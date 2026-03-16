// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO :: X/Twitter Marketing Automation API
// Handles: automated posting, thread creation, engagement tracking, analytics
// Auth: Bearer token (App-only) + OAuth 1.0a (user context)
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ── Config ───────────────────────────────────────────────────────────────────
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || '';
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || '';
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || '';
const TWITTER_OAUTH2_CLIENT_ID = process.env.TWITTER_OAUTH2_CLIENT_ID || '';
const _TWITTER_OAUTH2_CLIENT_SECRET = process.env.TWITTER_OAUTH2_CLIENT_SECRET || '';
const TWITTER_ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN || '';
const TWITTER_ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

// ── OAuth 1.0a Signature Generator ──────────────────────────────────────────
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const sortedKeys = Object.keys(params).sort();
  const paramString = sortedKeys.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&');
  const signatureBase = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  return crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');
}

function buildOAuthHeader(method: string, url: string, extraParams: Record<string, string> = {}): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: TWITTER_CONSUMER_KEY,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: TWITTER_ACCESS_TOKEN,
    oauth_version: '1.0',
  };

  const allParams = { ...oauthParams, ...extraParams };
  const signature = generateOAuthSignature(method, url, allParams, TWITTER_CONSUMER_SECRET, TWITTER_ACCESS_TOKEN_SECRET);
  oauthParams['oauth_signature'] = signature;

  const headerParts = Object.keys(oauthParams)
    .sort()
    .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
    .join(', ');

  return `OAuth ${headerParts}`;
}

// ── Tweet Templates ─────────────────────────────────────────────────────────
const TWEET_TEMPLATES = {
  product_launch: [
    `🚀 Resurgo is live.\n\nAn AI life OS that turns goals → daily execution in minutes.\n\n8 AI coaches. Habit stacking. Focus timer. Weekly reviews.\n\nFree forever tier. No BS.\n\nresurgo.life`,
    `Most productivity apps fail you after week 2.\n\nResurgo doesn't.\n\n→ 8 AI coaches that adapt to you\n→ Habit stacking engine\n→ Streak protection (forgives your bad days)\n→ Weekly review wizard\n\nFree: resurgo.life`,
    `I kept restarting every Monday.\n\nNew planner. New app. New system.\n\nSo I built one that sticks.\n\nResurgo — AI habit tracker + life OS\n\n→ PHOENIX coach for restart recovery\n→ MARCUS for stoic discipline\n→ ORACLE for root-cause analysis\n\nresurgo.life`,
  ],
  build_in_public: [
    `Building an AI life OS in public.\n\nDay {day}:\n- {update}\n\nThe hardest part isn't the code. It's making something people actually use past week 2.\n\n#buildinpublic #indiehacker`,
    `Shipped {feature} today in Resurgo.\n\nWhat it does: {description}\n\nWhy it matters: most habit apps treat you like a robot. We treat you like a human who has bad days.\n\n#buildinpublic`,
  ],
  engagement: [
    `What's the one habit that changed your life?\n\n(Building something around this — genuinely curious)\n\n#productivity #habits`,
    `Unpopular opinion: streak counters cause MORE anxiety than motivation.\n\nThe fix isn't removing them. It's adding grace days + AI that detects when you're struggling.\n\nThoughts?`,
    `Name one productivity app you've used for more than 3 months.\n\nI'll wait.\n\n(Most people can't — and that's the problem I'm solving)`,
  ],
  value_thread: {
    opener: `Thread: 7 reasons your productivity system keeps failing (and how to fix each one) 🧵\n\n1/`,
    tweets: [
      `1/ You're tracking habits in isolation.\n\nHabits aren't solo performers — they're a chain.\n\nFix: Stack them. Morning routine = wake → water → 5min journal → stretch.\n\nOne trigger starts the whole sequence.`,
      `2/ Your app punishes you for missing a day.\n\nStreaks = shame spirals.\n\nFix: Build in "grace days." AI that detects struggle patterns and adjusts difficulty.\n\nBad days happen. Your system should expect them.`,
      `3/ You have goals but zero daily actions.\n\n"Get fit" isn't actionable.\n\nFix: AI goal decomposition.\nGoal → Milestones → Weekly objectives → Daily tasks.\n\nEvery morning, you know exactly what to do.`,
      `4/ You restart every Monday.\n\nNew app. New system. Same result.\n\nFix: A restart is data, not failure.\nTrack your restart patterns. Use them to build a more resilient system.\n\n(This is literally why I built Resurgo)`,
      `5/ Your weekly review is "look at numbers and feel bad."\n\nFix: AI-generated weekly reviews that:\n- Celebrate wins\n- Identify patterns\n- Suggest adjustments\n- Set next week's priorities\n\nNumbers → narrative → action.`,
      `6/ You use 5 different apps.\n\nTasks in Todoist. Habits in Habitify. Notes in Notion. Focus in Forest.\n\nFix: One system. Goals, habits, tasks, focus, coaching — all connected.\n\nContext-switching kills consistency.`,
      `7/ No one holds you accountable.\n\nFix: AI coaches that actually notice when you're slipping.\n\nNot generic "keep going!" messages.\n\nPersonalized interventions based on YOUR patterns.\n\nThat's what I'm building at resurgo.life`,
    ],
  },
};

// ── Post a tweet (OAuth 1.0a) ───────────────────────────────────────────────
async function postTweet(text: string, replyToId?: string): Promise<{ id: string; text: string } | null> {
  const url = 'https://api.twitter.com/2/tweets';
  const body: Record<string, unknown> = { text };
  if (replyToId) body.reply = { in_reply_to_tweet_id: replyToId };

  const authHeader = buildOAuthHeader('POST', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[X/Twitter] Post failed:', res.status, err);
    return null;
  }
  const json = await res.json();
  return json.data;
}

// ── Post a thread ───────────────────────────────────────────────────────────
async function postThread(tweets: string[]): Promise<string[]> {
  const postedIds: string[] = [];
  let lastId: string | undefined;

  for (const text of tweets) {
    const result = await postTweet(text, lastId);
    if (result) {
      postedIds.push(result.id);
      lastId = result.id;
    }
    // Rate limit safety: 200ms between posts
    await new Promise((r) => setTimeout(r, 200));
  }

  return postedIds;
}

// ── Get account metrics (Bearer token) ──────────────────────────────────────
async function getAccountMetrics(): Promise<Record<string, unknown> | null> {
  // Get authenticated user's info
  const res = await fetch('https://api.twitter.com/2/users/me?user.fields=public_metrics,description,profile_image_url', {
    headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

// ── Search recent mentions ──────────────────────────────────────────────────
async function searchMentions(query: string, maxResults = 10): Promise<unknown[]> {
  const url = new URL('https://api.twitter.com/2/tweets/search/recent');
  url.searchParams.set('query', query);
  url.searchParams.set('max_results', String(maxResults));
  url.searchParams.set('tweet.fields', 'created_at,public_metrics,author_id');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

// ── GET: Status & templates ─────────────────────────────────────────────────
export async function GET() {
  const hasBearer = !!TWITTER_BEARER_TOKEN;
  const hasOAuth = !!TWITTER_CONSUMER_KEY && !!TWITTER_ACCESS_TOKEN;
  const hasOAuth2 = !!TWITTER_OAUTH2_CLIENT_ID;

  let account = null;
  if (hasBearer) {
    account = await getAccountMetrics();
  }

  return NextResponse.json({
    status: 'TWITTER_INTEGRATION_ONLINE',
    auth: {
      bearer_token: hasBearer ? '✅ Set' : '❌ Missing',
      oauth_1_0a: hasOAuth ? '✅ Set' : '❌ Missing',
      oauth_2_0: hasOAuth2 ? '✅ Set' : '❌ Missing',
    },
    account: account || 'No bearer token — cannot fetch',
    templates: {
      product_launch: TWEET_TEMPLATES.product_launch.length,
      build_in_public: TWEET_TEMPLATES.build_in_public.length,
      engagement: TWEET_TEMPLATES.engagement.length,
      value_thread: '1 opener + 7 thread tweets',
    },
    endpoints: {
      'POST /api/marketing/twitter': {
        actions: ['tweet', 'thread', 'search', 'template'],
        auth: 'ADMIN_SECRET required in Authorization header',
      },
    },
  });
}

// ── POST: Execute actions ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Admin auth check
  const authHeader = req.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await req.json();
  const { action, text, templateType, templateIndex, replyToId, searchQuery, threadTweets, dryRun, replacements } = body;

  switch (action) {
    // ── Post a single tweet ──────────────────────────────────────────
    case 'tweet': {
      let tweetText = text;

      // Use template if no custom text
      if (!tweetText && templateType) {
        const templates = TWEET_TEMPLATES[templateType as keyof typeof TWEET_TEMPLATES];
        if (Array.isArray(templates)) {
          const idx = templateIndex ?? Math.floor(Math.random() * templates.length);
          tweetText = templates[idx];
        }
      }

      // Apply caller-supplied replacements to fill {placeholder} tokens
      if (tweetText && replacements && typeof replacements === 'object') {
        for (const [key, value] of Object.entries(replacements)) {
          tweetText = tweetText.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
        }
      }

      if (!tweetText) {
        return NextResponse.json({ error: 'No text or valid templateType provided' }, { status: 400 });
      }

      // Block posting if template placeholders remain unfilled
      const unfilledPlaceholders = tweetText.match(/\{[a-zA-Z_]+\}/g);
      if (unfilledPlaceholders && !dryRun) {
        return NextResponse.json({
          error: `Template contains unfilled placeholders: ${unfilledPlaceholders.join(', ')}. Pass replacements:{day:"42",update:"..."} to fill them.`,
        }, { status: 400 });
      }

      if (dryRun) {
        return NextResponse.json({ dryRun: true, wouldPost: tweetText, charCount: tweetText.length, unfilledPlaceholders: unfilledPlaceholders ?? [] });
      }

      const result = await postTweet(tweetText, replyToId);
      return NextResponse.json(result ? { success: true, tweet: result } : { error: 'Post failed' }, {
        status: result ? 200 : 500,
      });
    }

    // ── Post a thread ────────────────────────────────────────────────
    case 'thread': {
      let tweets: string[] = threadTweets;

      // Use value_thread template if no custom thread
      if (!tweets) {
        const tmpl = TWEET_TEMPLATES.value_thread;
        tweets = [tmpl.opener, ...tmpl.tweets];
      }

      if (dryRun) {
        return NextResponse.json({
          dryRun: true,
          threadLength: tweets.length,
          tweets: tweets.map((t: string, i: number) => ({ index: i, text: t, chars: t.length })),
        });
      }

      const postedIds = await postThread(tweets);
      return NextResponse.json({ success: true, postedIds, count: postedIds.length });
    }

    // ── Search mentions / keywords ───────────────────────────────────
    case 'search': {
      const query = searchQuery || 'resurgo.life OR @ResurgoLife OR "resurgo app"';
      const results = await searchMentions(query);
      return NextResponse.json({ query, results, count: results.length });
    }

    // ── List templates ───────────────────────────────────────────────
    case 'templates': {
      return NextResponse.json({
        product_launch: TWEET_TEMPLATES.product_launch,
        build_in_public: TWEET_TEMPLATES.build_in_public,
        engagement: TWEET_TEMPLATES.engagement,
        value_thread: TWEET_TEMPLATES.value_thread,
      });
    }

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}
