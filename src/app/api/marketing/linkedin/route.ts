// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO :: LinkedIn Marketing Automation API
// Handles: article sharing, profile posts, company page updates, analytics
// Auth: OAuth 2.0 (3-legged) with refresh token
// API Docs: https://learn.microsoft.com/en-us/linkedin/marketing/
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

// ── Config ───────────────────────────────────────────────────────────────────
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN || '';
const LINKEDIN_PERSON_URN = process.env.LINKEDIN_PERSON_URN || ''; // urn:li:person:XXXX
const LINKEDIN_ORG_URN = process.env.LINKEDIN_ORG_URN || ''; // urn:li:organization:XXXX (if you create a company page)
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';

const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const _LINKEDIN_COMMUNITY_API = 'https://api.linkedin.com/rest';

// ── Post templates ──────────────────────────────────────────────────────────
const POST_TEMPLATES = {
  founder_story: [
    `I kept restarting every Monday.\n\nNew planner. New app. New system. Same result by Friday.\n\nAfter years of this cycle, I built something different.\n\nResurgo is an AI life OS that:\n→ Breaks goals into daily actions automatically\n→ Has 5 AI coaches that adapt to YOUR personality\n→ Protects your streaks on bad days\n→ Runs weekly reviews that actually improve things\n\nIt's free. No credit card. No BS.\n\nresurgo.life\n\n#productivity #buildinpublic #startup #habits`,
    `Most productivity apps fail after 2 weeks.\n\nHere's why — and what I built instead.\n\nThe problem isn't willpower. It's that apps treat every user the same.\n\nResurgo uses 5 different AI coaching personalities:\n• MARCUS — Stoic discipline\n• TITAN — Performance & fitness\n• AURORA — Creativity & wellness\n• PHOENIX — Restart recovery\n• NEXUS — Integration & flow states\n\nEach learns YOUR patterns.\n\nFree at resurgo.life\n\n#ai #productivitytools #indiehacker`,
  ],
  value_post: [
    `The #1 reason people break habits isn't laziness.\n\nIt's the shame spiral:\n1. Miss one day\n2. Feel guilty\n3. Avoid the app\n4. Miss more days\n5. Start over on Monday\n\nThe fix? Systems with built-in recovery.\n\n→ Grace days (not zero tolerance)\n→ AI that detects struggle patterns early\n→ "Restart" reframed as data, not failure\n→ Adaptive difficulty (easier goals on hard days)\n\nThis is what I'm building.\n\n#habits #productivity #mentalhealth`,
    `5 apps → 1 system.\n\nI replaced:\n• Todoist (tasks) → Resurgo daily execution\n• Habitify (habits) → Resurgo habit stacking\n• Notion (planning) → Resurgo AI goal decomposition\n• Forest (focus) → Resurgo focus timer\n• Daylio (wellness) → Resurgo mood + wellness tracking\n\nOne dashboard. One data source. Zero context switching.\n\nThat's the whole idea behind an AI life OS.\n\n#productivity #buildinpublic`,
  ],
  milestone: [
    `🚀 Milestone: Resurgo now has 5 AI coaches.\n\nEach one has a distinct personality, communication style, and expertise:\n\n1. MARCUS — Stoic discipline & mental toughness\n2. AURORA — Wellness, mindfulness & creativity\n3. TITAN — Physical fitness & performance\n4. PHOENIX — Recovery, resilience & finance\n5. NEXUS — Integration engine & cognitive optimization\n\nNo other habit app has this.\n\nresurgo.life`,
  ],
};

// ── LinkedIn API Helpers ────────────────────────────────────────────────────

interface LinkedInPost {
  author: string;
  lifecycleState: string;
  specificContent: {
    'com.linkedin.ugc.ShareContent': {
      shareCommentary: { text: string };
      shareMediaCategory: string;
      media?: Array<{
        status: string;
        originalUrl: string;
        title: { text: string };
        description: { text: string };
      }>;
    };
  };
  visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': string };
}

async function createPost(
  text: string,
  linkUrl?: string,
  linkTitle?: string,
  options?: { useOrg?: boolean }
): Promise<{ id: string } | null> {
  const authorUrn = options?.useOrg && LINKEDIN_ORG_URN ? LINKEDIN_ORG_URN : LINKEDIN_PERSON_URN;

  if (!authorUrn) {
    console.error('[LinkedIn] No author URN configured');
    return null;
  }

  const postBody: LinkedInPost = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: linkUrl ? 'ARTICLE' : 'NONE',
        ...(linkUrl
          ? {
              media: [
                {
                  status: 'READY',
                  originalUrl: linkUrl,
                  title: { text: linkTitle || 'Resurgo — AI Life OS' },
                  description: { text: 'Turn goals into daily execution with AI coaching.' },
                },
              ],
            }
          : {}),
      },
    },
    visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
  };

  const res = await fetch(`${LINKEDIN_API_BASE}/ugcPosts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202401',
    },
    body: JSON.stringify(postBody),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[LinkedIn] Post failed:', res.status, err);
    return null;
  }

  const location = res.headers.get('x-restli-id') || res.headers.get('location') || '';
  return { id: location };
}

async function getProfile(): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${LINKEDIN_API_BASE}/me?projection=(id,firstName,lastName,vanityName,profilePicture)`, {
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });
  if (!res.ok) return null;
  return res.json();
}

// ── GET: Status ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const adminSecret = req.headers.get('x-admin-secret');
  if (adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const hasToken = !!LINKEDIN_ACCESS_TOKEN;
  const hasPersonUrn = !!LINKEDIN_PERSON_URN;
  const hasOrgUrn = !!LINKEDIN_ORG_URN;

  let profile = null;
  if (hasToken) {
    profile = await getProfile();
  }

  return NextResponse.json({
    status: 'LINKEDIN_INTEGRATION_ONLINE',
    auth: {
      access_token: hasToken ? '✅ Set' : '❌ Missing',
      person_urn: hasPersonUrn ? '✅ Set' : '❌ Missing',
      org_urn: hasOrgUrn ? '✅ Set (company page)' : '⚠️ Not set (posting as personal)',
    },
    profile: profile || 'Cannot fetch — token missing or expired',
    recommendation: !hasOrgUrn
      ? 'Post from your personal LinkedIn first. Create a company page later when you have traction.'
      : 'Company page ready. You can post as brand or personal.',
    templates: {
      founder_story: POST_TEMPLATES.founder_story.length,
      value_post: POST_TEMPLATES.value_post.length,
      milestone: POST_TEMPLATES.milestone.length,
    },
    endpoints: {
      'POST /api/marketing/linkedin': {
        actions: ['post', 'template', 'profile'],
        auth: 'ADMIN_SECRET in Authorization header',
      },
    },
  });
}

// ── POST: Execute actions ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!ADMIN_SECRET || authHeader !== `Bearer ${ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const body = await req.json();
  const { action, text, templateType, templateIndex, linkUrl, linkTitle, useOrg, dryRun } = body;

  switch (action) {
    case 'post': {
      let postText = text;

      if (!postText && templateType) {
        const templates = POST_TEMPLATES[templateType as keyof typeof POST_TEMPLATES];
        if (Array.isArray(templates)) {
          const idx = templateIndex ?? Math.floor(Math.random() * templates.length);
          postText = templates[idx];
        }
      }

      if (!postText) {
        return NextResponse.json({ error: 'No text or valid templateType provided' }, { status: 400 });
      }

      if (dryRun) {
        return NextResponse.json({
          dryRun: true,
          wouldPost: postText,
          charCount: postText.length,
          postingAs: useOrg ? 'organization' : 'personal',
          link: linkUrl || null,
        });
      }

      const result = await createPost(postText, linkUrl, linkTitle, { useOrg });
      return NextResponse.json(result ? { success: true, post: result } : { error: 'Post failed' }, {
        status: result ? 200 : 500,
      });
    }

    case 'templates': {
      return NextResponse.json(POST_TEMPLATES);
    }

    case 'profile': {
      const profile = await getProfile();
      return NextResponse.json(profile || { error: 'Could not fetch profile' });
    }

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}
