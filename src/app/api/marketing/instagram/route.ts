// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO :: Instagram Graph API Integration
// Handles: media publishing, story insights, carousel posts, engagement metrics
// Auth: Meta Graph API with Instagram permissions
// Docs: https://developers.facebook.com/docs/instagram-api
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

// ── Config ───────────────────────────────────────────────────────────────────
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || '';
const INSTAGRAM_BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || '';
const ADMIN_SECRET = process.env.ADMIN_SECRET || '';
const GRAPH_API_VERSION = 'v19.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

// ── Content templates (caption templates for different post types) ───────────
const CAPTION_TEMPLATES = {
  product_showcase: [
    `🖥️ Your goals deserve a command center.\n\nResurgo turns chaos into daily execution:\n\n→ 5 AI coaches that learn YOUR patterns\n→ Habit stacking engine\n→ Focus timer with streak protection\n→ Weekly AI reviews\n\nFree forever. Link in bio.\n\n#productivity #habits #AI #lifeOS #goalsetting #discipline #selfimprovement #buildinpublic`,
    `Stop restarting every Monday.\n\nResurgo gives you:\n✅ AI goal decomposition\n✅ 5 unique coach personalities\n✅ Streak protection (grace days)\n✅ Daily execution plans\n✅ Terminal-aesthetic UI\n\nFree at resurgo.life\n\n#habittracker #productivityapp #AIcoach #goalsetting #selfgrowth #motivation #discipline`,
  ],
  reel_caption: [
    `POV: Your productivity app actually works past week 2 🖥️⚡\n\n#resurgo #productivity #habits #AI #lifeOS #coding #discipline`,
    `The difference between a to-do list and a life OS ⚡\n\n→ Goals broken into daily actions by AI\n→ 5 coaches that adapt to you\n→ No more starting over on Monday\n\nresurgo.life — free forever\n\n#productivityhacks #habittracking #AIproductivity #motivation`,
  ],
  carousel_caption: [
    `5 AI coaches. 5 different ways to stay on track. Swipe →\n\n1️⃣ MARCUS — Stoic discipline\n2️⃣ AURORA — Wellness & creativity\n3️⃣ TITAN — Physical performance\n4️⃣ PHOENIX — Recovery & resilience\n5️⃣ NEXUS — Integration engine\n\nWhich one do you need? 👇\n\n#AIcoach #productivity #selfimprovement #habits #goalsetting #lifeOS #resurgo`,
  ],
  behind_the_scenes: [
    `Building an AI life OS from scratch.\n\nToday's commit: {feature}\n\nThe hardest part isn't writing code.\nIt's making something people use past day 14.\n\n#buildinpublic #indiehacker #startup #saas #developer #coding #productivity`,
  ],
};

// ── Optimal posting times (EST) for productivity content ────────────────────
const BEST_POSTING_TIMES = {
  weekday: ['6:30 AM', '12:00 PM', '5:30 PM', '8:00 PM'],
  weekend: ['9:00 AM', '11:00 AM', '7:00 PM'],
  hashtag_sets: {
    core: ['#productivity', '#habits', '#AI', '#lifeOS', '#goalsetting'],
    broad: ['#selfimprovement', '#discipline', '#motivation', '#growth', '#mindset'],
    niche: ['#habittracker', '#productivityapp', '#AIcoach', '#buildinpublic', '#indiehacker'],
  },
};

// ── Instagram Graph API Helpers ─────────────────────────────────────────────

/**
 * Step 1: Create a media container (image/video)
 * For images: provide image_url
 * For carousels: create children first, then parent container
 */
async function createMediaContainer(params: {
  imageUrl?: string;
  videoUrl?: string;
  caption: string;
  mediaType?: 'IMAGE' | 'VIDEO' | 'REELS' | 'CAROUSEL_ALBUM';
  children?: string[]; // Array of container IDs for carousel
}): Promise<string | null> {
  const url = `${GRAPH_BASE}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`;

  const body: Record<string, string | string[]> = {
    access_token: INSTAGRAM_ACCESS_TOKEN,
    caption: params.caption,
  };

  if (params.mediaType === 'CAROUSEL_ALBUM' && params.children) {
    body.media_type = 'CAROUSEL';
    body.children = params.children.join(',');
  } else if (params.mediaType === 'REELS' && params.videoUrl) {
    body.media_type = 'REELS';
    body.video_url = params.videoUrl;
  } else if (params.videoUrl) {
    body.media_type = 'VIDEO';
    body.video_url = params.videoUrl;
  } else if (params.imageUrl) {
    body.image_url = params.imageUrl;
  }

  const formBody = Object.entries(body)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Instagram] Create container failed:', res.status, err);
    return null;
  }

  const json = await res.json();
  return json.id;
}

/**
 * Step 2: Publish the container
 */
async function publishMedia(containerId: string): Promise<string | null> {
  const url = `${GRAPH_BASE}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `creation_id=${containerId}&access_token=${encodeURIComponent(INSTAGRAM_ACCESS_TOKEN)}`,
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[Instagram] Publish failed:', res.status, err);
    return null;
  }

  const json = await res.json();
  return json.id;
}

/**
 * Get account insights
 */
async function getAccountInsights(): Promise<Record<string, unknown> | null> {
  const url = `${GRAPH_BASE}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}?fields=id,username,name,followers_count,media_count,profile_picture_url,biography&access_token=${encodeURIComponent(INSTAGRAM_ACCESS_TOKEN)}`;

  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

/**
 * Get recent media with engagement metrics
 */
async function getRecentMedia(limit = 10): Promise<unknown[]> {
  const url = `${GRAPH_BASE}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,permalink&limit=${limit}&access_token=${encodeURIComponent(INSTAGRAM_ACCESS_TOKEN)}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

// ── GET: Status & engagement ────────────────────────────────────────────────
export async function GET() {
  const hasToken = !!INSTAGRAM_ACCESS_TOKEN;
  const hasAccountId = !!INSTAGRAM_BUSINESS_ACCOUNT_ID;

  let account = null;
  let recentPosts: unknown[] = [];

  if (hasToken && hasAccountId) {
    [account, recentPosts] = await Promise.all([getAccountInsights(), getRecentMedia(5)]);
  }

  return NextResponse.json({
    status: 'INSTAGRAM_INTEGRATION_ONLINE',
    auth: {
      access_token: hasToken ? '✅ Set' : '❌ Missing',
      business_account_id: hasAccountId ? '✅ Set' : '❌ Missing',
    },
    account: account || 'Cannot fetch — credentials missing',
    recentPosts: recentPosts.length ? recentPosts : 'No posts or credentials missing',
    bestPostingTimes: BEST_POSTING_TIMES,
    templates: {
      product_showcase: CAPTION_TEMPLATES.product_showcase.length,
      reel_caption: CAPTION_TEMPLATES.reel_caption.length,
      carousel_caption: CAPTION_TEMPLATES.carousel_caption.length,
      behind_the_scenes: CAPTION_TEMPLATES.behind_the_scenes.length,
    },
    endpoints: {
      'POST /api/marketing/instagram': {
        actions: ['publish', 'carousel', 'insights', 'templates'],
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
  const { action, imageUrl, videoUrl, caption, templateType, templateIndex, mediaType, childImageUrls, dryRun, replacements } = body;

  switch (action) {
    // ── Publish a single image/reel ──────────────────────────────────
    case 'publish': {
      let postCaption = caption;

      if (!postCaption && templateType) {
        const templates = CAPTION_TEMPLATES[templateType as keyof typeof CAPTION_TEMPLATES];
        if (Array.isArray(templates)) {
          const idx = templateIndex ?? Math.floor(Math.random() * templates.length);
          postCaption = templates[idx];
        }
      }

      // Apply caller-supplied replacements to fill {placeholder} tokens
      if (postCaption && replacements && typeof replacements === 'object') {
        for (const [key, value] of Object.entries(replacements)) {
          postCaption = postCaption.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
        }
      }

      if (!postCaption) {
        return NextResponse.json({ error: 'No caption or valid templateType' }, { status: 400 });
      }

      // Block posting if template placeholders remain unfilled
      const unfilledPlaceholders = postCaption.match(/\{[a-zA-Z_]+\}/g);
      if (unfilledPlaceholders && !dryRun) {
        return NextResponse.json({
          error: `Template contains unfilled placeholders: ${unfilledPlaceholders.join(', ')}. Pass replacements:{feature:"food search"} to fill them.`,
        }, { status: 400 });
      }

      if (!imageUrl && !videoUrl) {
        return NextResponse.json({ error: 'imageUrl or videoUrl required' }, { status: 400 });
      }

      if (dryRun) {
        return NextResponse.json({
          dryRun: true,
          wouldPublish: { caption: postCaption, imageUrl, videoUrl, mediaType: mediaType || 'IMAGE' },
          captionLength: postCaption.length,
          unfilledPlaceholders: unfilledPlaceholders ?? [],
        });
      }

      const containerId = await createMediaContainer({
        imageUrl,
        videoUrl,
        caption: postCaption,
        mediaType: mediaType || (videoUrl ? 'REELS' : 'IMAGE'),
      });

      if (!containerId) {
        return NextResponse.json({ error: 'Failed to create media container' }, { status: 500 });
      }

      // Wait for media processing (Instagram needs time for video)
      if (videoUrl) {
        await new Promise((r) => setTimeout(r, 5000));
      }

      const mediaId = await publishMedia(containerId);
      return NextResponse.json(mediaId ? { success: true, mediaId } : { error: 'Publish failed' }, {
        status: mediaId ? 200 : 500,
      });
    }

    // ── Publish a carousel ───────────────────────────────────────────
    case 'carousel': {
      if (!childImageUrls || !Array.isArray(childImageUrls) || childImageUrls.length < 2) {
        return NextResponse.json({ error: 'childImageUrls array (min 2 images) required' }, { status: 400 });
      }

      const postCaption = caption || CAPTION_TEMPLATES.carousel_caption[0];

      if (dryRun) {
        return NextResponse.json({
          dryRun: true,
          wouldPublish: { caption: postCaption, images: childImageUrls.length, type: 'CAROUSEL_ALBUM' },
        });
      }

      // Create child containers
      const childIds: string[] = [];
      for (const imgUrl of childImageUrls) {
        const childId = await createMediaContainer({ imageUrl: imgUrl, caption: '' });
        if (childId) childIds.push(childId);
        await new Promise((r) => setTimeout(r, 300));
      }

      // Create parent carousel container
      const containerId = await createMediaContainer({
        caption: postCaption,
        mediaType: 'CAROUSEL_ALBUM',
        children: childIds,
      });

      if (!containerId) {
        return NextResponse.json({ error: 'Failed to create carousel container' }, { status: 500 });
      }

      const mediaId = await publishMedia(containerId);
      return NextResponse.json(mediaId ? { success: true, mediaId, childCount: childIds.length } : { error: 'Publish failed' }, {
        status: mediaId ? 200 : 500,
      });
    }

    // ── Get insights ─────────────────────────────────────────────────
    case 'insights': {
      const [account, posts] = await Promise.all([getAccountInsights(), getRecentMedia(25)]);
      return NextResponse.json({ account, recentPosts: posts });
    }

    // ── List templates ───────────────────────────────────────────────
    case 'templates': {
      return NextResponse.json({ templates: CAPTION_TEMPLATES, bestTimes: BEST_POSTING_TIMES });
    }

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  }
}
