import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import OpenAI from 'openai';
import { z } from 'zod';
import { api } from '../../../../../convex/_generated/api';
import { pingSearchEngines } from '@/lib/marketing/seo-config';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type GoogleTrendSignal = {
  title: string;
  url?: string;
  traffic?: string;
};

type RedditSignal = {
  title: string;
  subreddit: string;
  url: string;
  score: number;
  comments: number;
};

type ResearchBundle = {
  googleTrends: GoogleTrendSignal[];
  redditSignals: RedditSignal[];
  selectedTopic: string;
  score: number;
};

type GeneratedArticle = {
  slug: string;
  title: string;
  desc: string;
  content: string;
  tags: string[];
  seoKeywords: string[];
  heroImage: string;
  readTime: string;
};

type QualityCheck = {
  passed: boolean;
  wordCount: number;
  sectionCount: number;
  hasRedditSection: boolean;
  hasResurgoSection: boolean;
  hasSourceSection: boolean;
};

type GeneratedBlogApiShape = {
  generatedBlogPosts?: {
    upsert?: unknown;
  };
};

const requestSchema = z.object({
  publish: z.boolean().optional(),
  dryRun: z.boolean().optional(),
  topic: z.string().trim().min(3).max(120).optional(),
  geo: z.string().trim().min(2).max(8).default('US'),
});

const articleSchema = z.object({
  title: z.string().min(20).max(110),
  desc: z.string().min(80).max(180),
  content: z.string().min(3000),
  tags: z.array(z.string().min(2).max(40)).min(3).max(8),
  seoKeywords: z.array(z.string().min(2).max(80)).min(4).max(12),
});

const RESURGO_TOPICS = [
  'ADHD focus',
  'AI productivity',
  'indie founder productivity',
  'habit tracker',
  'weekly planning',
  'procrastination',
  'goal setting',
  'deep work',
  'execution system',
  'life OS',
];

const SUBREDDITS = ['productivity', 'ADHD', 'indiehackers', 'Entrepreneur', 'SideProject'];

function authorize(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get('authorization');
  const adminHeader = request.headers.get('x-admin-secret');

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;
  if (adminSecret && adminHeader === adminSecret) return true;

  return process.env.NODE_ENV !== 'production';
}

function decodeXml(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function pickTag(item: string, tag: string): string | undefined {
  const match = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1]) : undefined;
}

async function fetchGoogleTrends(geo: string): Promise<GoogleTrendSignal[]> {
  const response = await fetch(`https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`, {
    headers: { 'User-Agent': 'ResurgoBot/1.0 (+https://resurgo.life)' },
  });
  if (!response.ok) return [];

  const xml = await response.text();
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) ?? [];

  return items.slice(0, 30).map((item) => ({
    title: pickTag(item, 'title') ?? 'Untitled trend',
    url: pickTag(item, 'link'),
    traffic: pickTag(item, 'ht:approx_traffic'),
  }));
}

function parseRedditChild(child: unknown): RedditSignal | null {
  if (!child || typeof child !== 'object') return null;
  const data = (child as Record<string, unknown>).data;
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title : '';
  const subreddit = typeof record.subreddit === 'string' ? record.subreddit : '';
  const permalink = typeof record.permalink === 'string' ? record.permalink : '';
  if (!title || !subreddit || !permalink) return null;

  return {
    title,
    subreddit,
    url: `https://www.reddit.com${permalink}`,
    score: typeof record.score === 'number' ? record.score : 0,
    comments: typeof record.num_comments === 'number' ? record.num_comments : 0,
  };
}

async function fetchRedditSignals(topic: string): Promise<RedditSignal[]> {
  const searches = SUBREDDITS.map(async (subreddit) => {
    const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(topic)}&restrict_sr=1&sort=top&t=month&limit=6`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ResurgoContentResearch/1.0 (+https://resurgo.life)' },
    });
    if (!response.ok) return [];

    const json = (await response.json().catch(() => null)) as unknown;
    const listing = json && typeof json === 'object' ? (json as Record<string, unknown>).data : null;
    const children = listing && typeof listing === 'object' ? (listing as Record<string, unknown>).children : null;
    return Array.isArray(children) ? children.map(parseRedditChild).filter((item): item is RedditSignal => Boolean(item)) : [];
  });

  const results = (await Promise.all(searches)).flat();
  const redditResults = results
    .sort((a, b) => b.score + b.comments * 2 - (a.score + a.comments * 2))
    .slice(0, 12);
  if (redditResults.length > 0) return redditResults;

  return fetchPullPushRedditSignals(topic);
}

function parsePullPushItem(item: unknown): RedditSignal | null {
  if (!item || typeof item !== 'object') return null;
  const record = item as Record<string, unknown>;
  const title = typeof record.title === 'string' ? record.title : '';
  const subreddit = typeof record.subreddit === 'string' ? record.subreddit : '';
  const url = typeof record.url === 'string'
    ? record.url
    : typeof record.permalink === 'string'
      ? `https://www.reddit.com${record.permalink}`
      : '';
  if (!title || !subreddit || !url) return null;

  return {
    title,
    subreddit,
    url,
    score: typeof record.score === 'number' ? record.score : typeof record.ups === 'number' ? record.ups : 0,
    comments: typeof record.num_comments === 'number' ? record.num_comments : 0,
  };
}

async function fetchPullPushRedditSignals(topic: string): Promise<RedditSignal[]> {
  const searches = SUBREDDITS.map(async (subreddit) => {
    const url = `https://api.pullpush.io/reddit/search/submission/?q=${encodeURIComponent(topic)}&subreddit=${encodeURIComponent(subreddit)}&size=6&sort=desc&sort_type=score`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'ResurgoContentResearch/1.0 (+https://resurgo.life)' },
    });
    if (!response.ok) return [];

    const json = (await response.json().catch(() => null)) as unknown;
    const data = json && typeof json === 'object' ? (json as Record<string, unknown>).data : null;
    return Array.isArray(data) ? data.map(parsePullPushItem).filter((item): item is RedditSignal => Boolean(item)) : [];
  });

  return (await Promise.all(searches))
    .flat()
    .sort((a, b) => b.score + b.comments * 2 - (a.score + a.comments * 2))
    .slice(0, 12);
}

function scoreTopic(topic: string, trends: GoogleTrendSignal[], reddit: RedditSignal[]): number {
  const normalized = topic.toLowerCase();
  const trendScore = trends.reduce((score, trend) => {
    const title = trend.title.toLowerCase();
    return score + (title.includes(normalized) ? 30 : RESURGO_TOPICS.some((term) => title.includes(term.toLowerCase())) ? 8 : 0);
  }, 0);
  const redditScore = reddit.reduce((score, item) => {
    const title = item.title.toLowerCase();
    const relevance = title.includes(normalized) ? 20 : RESURGO_TOPICS.some((term) => title.includes(term.toLowerCase())) ? 7 : 0;
    return score + relevance + Math.min(item.score / 20, 15) + Math.min(item.comments / 10, 10);
  }, 0);
  return Math.round(trendScore + redditScore);
}

async function buildResearch(topicOverride: string | undefined, geo: string): Promise<ResearchBundle> {
  const trends = await fetchGoogleTrends(geo).catch(() => []);
  const candidates = topicOverride ? [topicOverride] : RESURGO_TOPICS;
  const redditByTopic = await Promise.all(candidates.map(async (topic) => ({ topic, reddit: await fetchRedditSignals(topic).catch(() => []) })));
  const ranked = redditByTopic
    .map((item) => ({ ...item, score: scoreTopic(item.topic, trends, item.reddit) }))
    .sort((a, b) => b.score - a.score);
  const winner = ranked[0] ?? { topic: topicOverride ?? 'AI productivity', reddit: [], score: 0 };

  return {
    googleTrends: trends.slice(0, 10),
    redditSignals: winner.reddit,
    selectedTopic: winner.topic,
    score: winner.score,
  };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(4, Math.ceil(words / 220))} min`;
}

function buildFallbackArticle(research: ResearchBundle): GeneratedArticle {
  const topic = research.selectedTopic;
  const redditQuestions = research.redditSignals.slice(0, 5);
  const trendSignals = research.googleTrends.slice(0, 4);
  const title = `${topic}: A Calm Execution System for Founders and Busy Professionals`;
  const slug = `${slugify(topic)}-execution-system-${new Date().getUTCFullYear()}`;
  const sourceBullets = [
    ...trendSignals.map((signal) => `- Google Trends signal: ${signal.title}${signal.traffic ? ` (${signal.traffic})` : ''}`),
    ...redditQuestions.slice(0, 4).map((signal) => `- Reddit r/${signal.subreddit}: ${signal.title} (${signal.comments} comments)`),
  ];

  const content = `
## The short version

${topic} is not a motivation problem. For most people, it is an execution design problem: the next action is vague, the day has too many competing inputs, and the review loop arrives too late to correct drift.

The practical answer is a small operating system: one clear outcome, three executable tasks, one protected focus block, and a review that turns friction into tomorrow's plan. This is the structure Resurgo is built around.

## What the research signals show this week

The public signals point to a simple pattern: people are searching for better ways to turn intent into specific action, not more generic productivity advice.

${sourceBullets.join('\n')}

These signals are directional, not clinical evidence. They are useful because they show the live language people use when they are stuck: focus, overwhelm, procrastination, planning, consistency, and unfinished goals.

## What people are asking on Reddit

${redditQuestions.length ? redditQuestions.map((signal, index) => `${index + 1}. "${signal.title}"`).join('\n') : '1. How do I choose what to do first when everything feels urgent?\n2. How do I stay consistent when my energy changes day to day?\n3. How do I stop rebuilding my productivity system every week?'}

Underneath these questions is the same bottleneck: people do not need a bigger dashboard. They need a smaller decision surface. A good system should tell them what to do now, why it matters, and what done looks like.

The useful part of Reddit research is not that every comment is correct. It is that the complaints are specific. People describe the exact moment a system breaks: after a bad night of sleep, after a meeting-heavy day, after opening five tabs, after getting a new idea, or after missing one habit and deciding the week is already lost. A serious execution system has to survive those moments.

## The execution system

Start with one outcome for the next seven days. Not a life vision. Not a quarterly strategy. One outcome that would make the week feel meaningfully better.

Then translate that outcome into three tasks with this format:

- Action verb
- Specific output
- Time estimate
- Definition of done

Weak task: work on content.

Strong task: write a 300-word LinkedIn draft about the launch lesson from this week, then save it in the distribution queue. Time estimate: 30 minutes. Done means the draft has a hook, body, CTA, and scheduled publish slot.

This level of specificity is where productivity starts becoming execution.

The second rule is to keep the plan small enough to trust. A founder with ten priorities has no priorities. A professional with twelve habits has a maintenance burden. Three meaningful tasks and one review loop usually beat a complex board because they create feedback faster. When the task is finished, the system should record the win and make the next step easier to choose.

## A 10-minute setup

Use this when the day feels scattered:

1. Write the outcome you want by the end of today.
2. List every open loop currently pulling attention.
3. Mark the three loops that create the most business or life leverage.
4. Convert the first loop into a task small enough to complete in one focus block.
5. Start a timer before checking another tool.

The point is not to build a perfect system. The point is to lower the cost of starting.

If you cannot start after this setup, reduce the first task again. "Write launch copy" becomes "write three headline options." "Improve onboarding" becomes "watch one user session and list three points of friction." "Get healthier" becomes "walk for 10 minutes after lunch." Smaller is not weaker when it gets completed.

## The weekly review loop

Once a week, review the system without guilt. Ask four questions:

1. What got finished?
2. What kept getting deferred?
3. What task was too vague?
4. What should be removed before next week starts?

This is where compounding starts. You are not trying to become a different person every Monday. You are tuning the environment so the next correct action is easier to take. For ${topic.toLowerCase()}, that usually means fewer open loops, clearer task language, and a visible definition of done.

## How Resurgo fits

Resurgo is designed for this exact workflow. The product turns a messy brain dump into a daily execution stream, then keeps narrowing the next action until it is specific enough to do.

That matters because most productivity tools store commitments. Resurgo is aimed at converting commitments into finished outputs: written drafts, shipped features, completed reviews, planned workouts, sent emails, and closed loops.

For founders and indie builders, this is especially important. A founder does not lose because they lack ideas. They lose when too many half-valid ideas compete for attention and none become shipped work.

The useful product loop is simple: dump the chaos, extract the real goals, generate specific actions, finish the first visible task, and review the week. If the tool cannot help with that loop, it is probably storing work instead of moving work.

## Quality checklist

Use this checklist before trusting any productivity system:

- Does it create a first win in under 10 minutes?
- Does it turn goals into specific tasks without vague verbs?
- Does it keep habits, tasks, and focus sessions in one daily view?
- Does it review the week without guilt or noise?
- Does it make the next action obvious when energy is low?

If the answer is no, the tool is probably adding management overhead instead of reducing it.

## Bottom line

The best ${topic.toLowerCase()} system is not the most complex one. It is the one that repeatedly turns unclear intention into visible progress.

Start with one outcome. Write three specific tasks. Complete the first one. Review what happened. Repeat next week with less friction.

That is the operating loop worth protecting.
`.trim();

  return {
    slug,
    title,
    desc: `A research-backed execution playbook for ${topic.toLowerCase()} using Google Trends, Reddit questions, and Resurgo's calm Life OS approach.`,
    content,
    tags: ['AI productivity', 'execution system', 'focus systems', topic],
    seoKeywords: [topic, `${topic} system`, 'AI productivity system', 'Resurgo Life OS', 'execution planning', 'founder productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
    readTime: estimateReadTime(content),
  };
}

async function generateWithOpenAI(research: ResearchBundle): Promise<GeneratedArticle | null> {
  const hasOpenAI = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith('SET_REAL');
  const hasGroq = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.startsWith('SET_REAL');

  if (!hasOpenAI && !hasGroq) return null;

  const client = hasOpenAI
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });

  const model = hasOpenAI
    ? (process.env.BLOG_GENERATION_MODEL ?? 'gpt-4o-mini')
    : 'llama-3.3-70b-versatile';

  const prompt = `
Create a premium Resurgo blog post from this research.

Audience: indie founders, ADHD professionals, and busy operators.
Tone: calm, specific, practical, no hype.
Promise: clarity and execution, not generic productivity.
Constraints:
- 900 to 1400 words.
- Use Markdown.
- Include these H2 sections exactly: "The short version", "What the research signals show this week", "What people are asking on Reddit", "The execution system", "How Resurgo fits", "Bottom line".
- No medical diagnosis or guaranteed outcomes.
- Include specific tasks and definitions of done.
- Return JSON only with title, desc, content, tags, seoKeywords.

Research:
${JSON.stringify(research, null, 2)}
`;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.65,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a senior SaaS content strategist and editor. Return valid JSON only.' },
        { role: 'user', content: prompt },
      ],
    });

    const raw = completion.choices[0]?.message.content;
    if (!raw) return null;
    const parsed = articleSchema.safeParse(JSON.parse(raw) as unknown);
    if (!parsed.success) return null;

    const slug = `${slugify(parsed.data.title)}-${new Date().toISOString().slice(0, 10)}`;
    return {
      ...parsed.data,
      slug,
      heroImage: '/blog/default-productivity-hero.svg',
      readTime: estimateReadTime(parsed.data.content),
    };
  } catch {
    return null;
  }
}

function qualityCheck(article: GeneratedArticle): QualityCheck {
  const words = article.content.trim().split(/\s+/).filter(Boolean);
  const sectionCount = (article.content.match(/^##\s+/gm) ?? []).length;
  const hasRedditSection = /what people are asking on reddit/i.test(article.content);
  const hasResurgoSection = /how resurgo fits/i.test(article.content);
  const hasSourceSection = /research signals|google trends|reddit/i.test(article.content);

  return {
    passed: words.length >= 800 && sectionCount >= 5 && hasRedditSection && hasResurgoSection && hasSourceSection,
    wordCount: words.length,
    sectionCount,
    hasRedditSection,
    hasResurgoSection,
    hasSourceSection,
  };
}

async function persistArticle(article: GeneratedArticle, research: ResearchBundle, publish: boolean): Promise<void> {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const apiRef = (api as unknown as GeneratedBlogApiShape).generatedBlogPosts?.upsert;
  if (!convexUrl || !apiRef) throw new Error('Convex generatedBlogPosts.upsert is unavailable');

  const convex = new ConvexHttpClient(convexUrl);
  const invokeMutation = convex.mutation.bind(convex) as unknown as (reference: unknown, args: Record<string, unknown>) => Promise<unknown>;

  await invokeMutation(apiRef, {
    slug: article.slug,
    title: article.title,
    desc: article.desc,
    content: article.content,
    status: publish ? 'published' : 'draft',
    tags: article.tags,
    seoKeywords: article.seoKeywords,
    heroImage: article.heroImage,
    readTime: article.readTime,
    research,
  });
}

async function handleGenerate(request: NextRequest): Promise<NextResponse> {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawBody = request.method === 'GET'
    ? Object.fromEntries(request.nextUrl.searchParams.entries())
    : await request.json().catch(() => ({}));
  const body = rawBody && typeof rawBody === 'object' ? rawBody as Record<string, unknown> : {};
  const parsed = requestSchema.safeParse({
    ...body,
    publish: typeof body.publish === 'string' ? body.publish === 'true' : body.publish,
    dryRun: typeof body.dryRun === 'string' ? body.dryRun === 'true' : body.dryRun,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  const publish = parsed.data.publish ?? process.env.BLOG_AUTO_PUBLISH === 'true';
  const research = await buildResearch(parsed.data.topic, parsed.data.geo);
  const aiArticle = await generateWithOpenAI(research);
  let article = aiArticle || buildFallbackArticle(research);
  let checks = qualityCheck(article);

  if (aiArticle && !checks.passed) {
    console.warn('[Blog Generate] AI generated article did not pass quality check. Falling back to static template.');
    article = buildFallbackArticle(research);
    checks = qualityCheck(article);
  }

  let pingResults: { google: boolean; bing: boolean } | undefined = undefined;

  if (!parsed.data.dryRun) {
    await persistArticle(article, research, publish);
    try {
      pingResults = await pingSearchEngines();
    } catch (err) {
      console.error('[Blog Generate] Failed to ping search engines:', err);
    }
  }

  return NextResponse.json({
    status: parsed.data.dryRun ? 'dry_run' : publish ? 'published' : 'draft',
    slug: article.slug,
    title: article.title,
    quality: checks,
    pingResults,
    research: {
      selectedTopic: research.selectedTopic,
      score: research.score,
      googleTrendCount: research.googleTrends.length,
      redditSignalCount: research.redditSignals.length,
    },
  });
}

export async function GET(request: NextRequest) {
  return handleGenerate(request);
}

export async function POST(request: NextRequest) {
  return handleGenerate(request);
}
