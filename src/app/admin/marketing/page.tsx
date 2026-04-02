import Link from 'next/link';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import { BLOG_POST_INDEX, BLOG_TOPIC_CLUSTERS } from '@/lib/blog/post-index';

type MarketingEvent = {
  _id: string;
  event: string;
  path: string | null;
  createdAt: number;
};

type MarketingMetrics = {
  totalEvents: number;
  signupAssists: number;
  pricingClicks: number;
  ctaClicks: number;
  pageViews: number;
  leads: number;
  recentEvents: MarketingEvent[];
};

type Lead = {
  _id: string;
  email: string;
  source: string;
  utmCampaign: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  capturedAt: number;
};

type MetaHealth = {
  configured: boolean;
  tokenValid: boolean;
  adAccountAccessible: boolean;
  pixelConfigured: boolean;
};

type MetaInsightsSummary = {
  impressions?: string;
  clicks?: string;
  spend?: string;
  cpc?: string;
  ctr?: string;
  reach?: string;
};

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean);
const convex = process.env.NEXT_PUBLIC_CONVEX_URL ? new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL) : null;

const KEYWORDS: Array<{ keyword: string; intent: 'comparison' | 'solution' | 'how-to' | 'commercial' }> = [
  { keyword: 'ai productivity assistant', intent: 'solution' },
  { keyword: 'best habit tracker app 2026', intent: 'commercial' },
  { keyword: 'adhd productivity app', intent: 'commercial' },
  { keyword: 'ai daily planner', intent: 'solution' },
  { keyword: 'vision board app', intent: 'commercial' },
  { keyword: 'todoist alternative', intent: 'comparison' },
  { keyword: 'notion alternative for habits', intent: 'comparison' },
  { keyword: 'how to set goals and achieve them', intent: 'how-to' },
  { keyword: 'how to track habits on phone', intent: 'how-to' },
  { keyword: 'best productivity app for entrepreneurs', intent: 'commercial' },
];

function includesKeyword(post: { title: string; desc: string; tags: string[] }, keyword: string): boolean {
  const haystack = `${post.title} ${post.desc} ${post.tags.join(' ')}`.toLowerCase();
  return keyword
    .split(' ')
    .every((token) => haystack.includes(token));
}

function numberFromString(value: string | undefined): number {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function getMetaData(baseUrl: string): Promise<{ health: MetaHealth | null; summary: MetaInsightsSummary | null }> {
  try {
    const [healthRes, summaryRes] = await Promise.all([
      fetch(`${baseUrl}/api/marketing/meta/health`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/marketing/meta/insights?summary=true&date_preset=last_30d`, { cache: 'no-store' }),
    ]);

    const health = healthRes.ok ? ((await healthRes.json()) as MetaHealth) : null;
    const summaryPayload = summaryRes.ok ? ((await summaryRes.json()) as { summary?: MetaInsightsSummary }) : null;

    return { health, summary: summaryPayload?.summary ?? null };
  } catch {
    return { health: null, summary: null };
  }
}

async function getConvexData(): Promise<{ metrics: MarketingMetrics | null; leads: Lead[] }> {
  if (!convex) return { metrics: null, leads: [] };

  const typedApi = api as unknown as {
    marketing?: { getMarketingMetrics?: unknown };
    leads?: { listRecent?: unknown };
  };

  const queryFn = convex.query as unknown as (
    fn: unknown,
    args: Record<string, unknown>
  ) => Promise<unknown>;

  const metricsRef = typedApi.marketing?.getMarketingMetrics;
  const leadsRef = typedApi.leads?.listRecent;

  try {
    const [metrics, leads] = await Promise.all([
      metricsRef ? (queryFn(metricsRef, { sinceDaysAgo: 30 }) as Promise<MarketingMetrics>) : Promise.resolve(null),
      leadsRef ? (queryFn(leadsRef, { limit: 100 }) as Promise<Lead[]>) : Promise.resolve([]),
    ]);

    return { metrics, leads };
  } catch {
    return { metrics: null, leads: [] };
  }
}

export default async function AdminMarketingDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/admin/marketing');

  const user = await currentUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const isAuthorized = ADMIN_EMAILS.length === 0 || ADMIN_EMAILS.includes(userEmail);
  if (!isAuthorized) redirect('/dashboard');

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const [{ health, summary }, { metrics, leads }] = await Promise.all([getMetaData(baseUrl), getConvexData()]);

  const leadsBySource = leads.reduce<Record<string, number>>((acc, lead) => {
    const key = lead.source || 'unknown';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const leadsByCampaign = leads.reduce<Record<string, number>>((acc, lead) => {
    const key = lead.utmCampaign || 'direct_or_unknown';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const blogPathViews = (metrics?.recentEvents ?? []).reduce<Record<string, number>>((acc, event) => {
    if (event.path?.startsWith('/blog/')) {
      acc[event.path] = (acc[event.path] ?? 0) + 1;
    }
    return acc;
  }, {});

  const keywordRows = KEYWORDS.map((entry) => {
    const matchingPosts = BLOG_POST_INDEX.filter((post) => includesKeyword(post, entry.keyword));
    const pathMatches = Object.entries(blogPathViews).filter(([path]) =>
      matchingPosts.some((post) => path.includes(post.slug))
    );
    const trafficSignal = pathMatches.reduce((sum, [, count]) => sum + count, 0);
    const rankSignal = matchingPosts.length >= 2
      ? 'strong'
      : matchingPosts.length === 1
        ? 'medium'
        : 'weak';

    return {
      ...entry,
      matchingPosts: matchingPosts.length,
      trafficSignal,
      rankSignal,
    };
  });

  const gaEnabled = !!process.env.NEXT_PUBLIC_GA_ID && process.env.NEXT_PUBLIC_GA_ID !== 'G-XXXXXXXXXX';
  const totalLeads = leads.length;
  const signups = metrics?.signupAssists ?? 0;
  const conversionRate = totalLeads > 0 ? ((signups / totalLeads) * 100).toFixed(1) : '0.0';

  return (
    <main className="min-h-screen bg-black px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="space-y-3 border border-zinc-800 bg-zinc-950 p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs tracking-[0.3em] text-orange-500">ADMIN_MARKETING_INTELLIGENCE</p>
            <Link href="/admin" className="font-mono text-xs text-zinc-400 hover:text-orange-400">← BACK_TO_ADMIN</Link>
          </div>
          <h1 className="font-mono text-2xl font-bold">Marketing Command Center</h1>
          <p className="font-mono text-xs text-zinc-400">
            Unified view across SEO/AEO/GEO content coverage, lead capture, conversion funnel signals, and ad platform readiness.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Card label="Leads Captured (100 recent)" value={String(totalLeads)} sub="Stored in Convex leads table" />
          <Card label="Signup Assists (30d)" value={String(signups)} sub="From marketing event stream" />
          <Card label="Lead→Signup Signal" value={`${conversionRate}%`} sub="Proxy conversion indicator" />
          <Card label="Blog Articles Indexed" value={String(BLOG_POST_INDEX.length)} sub="SEO corpus for Google + LLMs" />
          <Card label="Topic Clusters" value={String(BLOG_TOPIC_CLUSTERS.length)} sub="Internal-linking structure" />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            title="Google Analytics"
            ok={gaEnabled}
            detail={gaEnabled ? `Connected (${process.env.NEXT_PUBLIC_GA_ID})` : 'Missing NEXT_PUBLIC_GA_ID'}
          />
          <StatusCard
            title="Meta Ads Health"
            ok={!!health?.configured && !!health?.tokenValid}
            detail={health ? `Configured=${health.configured} Token=${health.tokenValid} Pixel=${health.pixelConfigured}` : 'No response'}
          />
          <StatusCard
            title="Meta 30d Spend"
            ok={numberFromString(summary?.spend) > 0}
            detail={`$${numberFromString(summary?.spend).toFixed(2)} spend · ${numberFromString(summary?.clicks)} clicks`}
          />
          <StatusCard
            title="Keyword Tracking"
            ok={true}
            detail="Coverage + traffic signals active"
          />
        </section>

        <section className="border border-zinc-800 bg-zinc-950 p-5">
          <p className="mb-3 font-mono text-xs tracking-widest text-orange-500">KEYWORD_PERFORMANCE (SEO + AEO + GEO)</p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500">
                  <th className="px-2 py-2 text-left">Keyword</th>
                  <th className="px-2 py-2 text-left">Intent</th>
                  <th className="px-2 py-2 text-right">Articles Targeting</th>
                  <th className="px-2 py-2 text-right">Recent Traffic Signal</th>
                  <th className="px-2 py-2 text-left">Rank Signal</th>
                </tr>
              </thead>
              <tbody>
                {keywordRows.map((row) => (
                  <tr key={row.keyword} className="border-b border-zinc-900 text-zinc-300">
                    <td className="px-2 py-2">{row.keyword}</td>
                    <td className="px-2 py-2 uppercase text-zinc-400">{row.intent}</td>
                    <td className="px-2 py-2 text-right">{row.matchingPosts}</td>
                    <td className="px-2 py-2 text-right">{row.trafficSignal}</td>
                    <td className="px-2 py-2">
                      <span className={`inline-block border px-2 py-0.5 uppercase ${row.rankSignal === 'strong' ? 'border-emerald-800 text-emerald-400' : row.rankSignal === 'medium' ? 'border-amber-800 text-amber-400' : 'border-red-800 text-red-400'}`}>
                        {row.rankSignal}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="border border-zinc-800 bg-zinc-950 p-5">
            <p className="mb-3 font-mono text-xs tracking-widest text-orange-500">LEADS_BY_SOURCE</p>
            <div className="space-y-2 font-mono text-xs">
              {Object.entries(leadsBySource).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between border border-zinc-900 px-3 py-2">
                  <span className="text-zinc-300">{source}</span>
                  <span className="text-orange-400">{count}</span>
                </div>
              ))}
              {Object.keys(leadsBySource).length === 0 && <p className="text-zinc-500">No lead source data yet.</p>}
            </div>
          </div>

          <div className="border border-zinc-800 bg-zinc-950 p-5">
            <p className="mb-3 font-mono text-xs tracking-widest text-orange-500">UTM_CAMPAIGN_SIGNAL</p>
            <div className="space-y-2 font-mono text-xs">
              {Object.entries(leadsByCampaign).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([campaign, count]) => (
                <div key={campaign} className="flex items-center justify-between border border-zinc-900 px-3 py-2">
                  <span className="text-zinc-300">{campaign}</span>
                  <span className="text-orange-400">{count}</span>
                </div>
              ))}
              {Object.keys(leadsByCampaign).length === 0 && <p className="text-zinc-500">No UTM campaign data yet.</p>}
            </div>
          </div>
        </section>

        <section className="border border-zinc-800 bg-zinc-950 p-5">
          <p className="mb-3 font-mono text-xs tracking-widest text-orange-500">MARKETING_TOOLS</p>
          <div className="grid gap-3 md:grid-cols-3">
            <a className="border border-zinc-800 px-3 py-3 font-mono text-xs text-zinc-300 hover:border-orange-700" href="https://analytics.google.com" target="_blank" rel="noreferrer">Google Analytics</a>
            <a className="border border-zinc-800 px-3 py-3 font-mono text-xs text-zinc-300 hover:border-orange-700" href="https://search.google.com/search-console" target="_blank" rel="noreferrer">Google Search Console</a>
            <a className="border border-zinc-800 px-3 py-3 font-mono text-xs text-zinc-300 hover:border-orange-700" href="https://business.facebook.com/adsmanager" target="_blank" rel="noreferrer">Meta Ads Manager</a>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-2 font-mono text-2xl font-bold text-zinc-100">{value}</p>
      <p className="mt-1 font-mono text-[10px] text-zinc-600">{sub}</p>
    </div>
  );
}

function StatusCard({ title, ok, detail }: { title: string; ok: boolean; detail: string }) {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">{title}</p>
      <p className={`mt-2 font-mono text-xs ${ok ? 'text-emerald-400' : 'text-red-400'}`}>{ok ? 'OK' : 'ATTENTION'}</p>
      <p className="mt-1 font-mono text-[10px] text-zinc-600">{detail}</p>
    </div>
  );
}
