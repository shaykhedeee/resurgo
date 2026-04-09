// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Admin Command Center (Terminal UI)
// Protected: Clerk auth required + ADMIN_USER_IDS check
// ═══════════════════════════════════════════════════════════════════════════════

import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);

async function getSystemMetrics() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const [health, meta, discord] = await Promise.allSettled([
      fetch(`${baseUrl}/api/health`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
      fetch(`${baseUrl}/api/marketing/meta/health`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
      fetch(`${baseUrl}/api/discord?action=status`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
    ]);
    return {
      health: health.status === 'fulfilled' ? health.value : null,
      meta: meta.status === 'fulfilled' ? meta.value : null,
      discord: discord.status === 'fulfilled' ? discord.value : null,
    };
  } catch {
    return { health: null, meta: null, discord: null };
  }
}

type NavItem = { href: string; label: string; desc: string; current?: boolean; external?: boolean };

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'OPERATIONS',
    items: [
      { href: '/admin', label: 'COMMAND_CENTER', desc: 'Overview + system status', current: true },
      { href: '/admin/system-status', label: 'SYSTEM_STATUS', desc: 'Launch readiness + health checks' },
    ],
  },
  {
    label: 'MARKETING',
    items: [
      { href: '/admin/marketing', label: 'MARKETING_OPS', desc: 'Campaigns, Meta, Reddit, Discord' },
      { href: '/admin/content', label: 'CONTENT_LAB', desc: 'Product content + SEO' },
    ],
  },
  {
    label: 'INTEGRATIONS',
    items: [
      { href: '/api/marketing/twitter', label: 'X_TWITTER', desc: 'OAuth status + templates', external: true },
      { href: '/api/marketing/linkedin', label: 'LINKEDIN', desc: 'Post API + profile', external: true },
      { href: '/api/marketing/instagram', label: 'INSTAGRAM', desc: 'Graph API + insights', external: true },
      { href: '/api/marketing/meta/health', label: 'META_PIXEL', desc: 'Pixel + CAPI status', external: true },
      { href: '/api/discord?action=status', label: 'DISCORD', desc: 'Webhook status', external: true },
      { href: '/api/marketing/reddit', label: 'REDDIT', desc: 'API status', external: true },
      { href: '/api/email/campaigns', label: 'EMAIL', desc: 'Resend campaigns', external: true },
      { href: '/api/telegram/setup?action=status', label: 'TELEGRAM', desc: 'Bot + webhook', external: true },
    ],
  },
];

const CHECKLIST = [
  { id: 'meta_pixel', label: 'Meta Pixel ID configured', env: 'NEXT_PUBLIC_META_PIXEL_ID' },
  { id: 'meta_token', label: 'Meta Conversions API token', env: 'META_ACCESS_TOKEN' },
  { id: 'twitter', label: 'X/Twitter Bearer Token', env: 'TWITTER_BEARER_TOKEN' },
  { id: 'twitter_oauth', label: 'X/Twitter OAuth (posting)', env: 'TWITTER_CONSUMER_KEY' },
  { id: 'linkedin', label: 'LinkedIn Access Token', env: 'LINKEDIN_ACCESS_TOKEN' },
  { id: 'instagram', label: 'Instagram Graph API', env: 'INSTAGRAM_ACCESS_TOKEN' },
  { id: 'discord_wh', label: 'Discord webhook connected', env: 'DISCORD_WEBHOOK_URL' },
  { id: 'resend', label: 'Resend email API configured', env: 'RESEND_API_KEY' },
  { id: 'telegram', label: 'Telegram bot token set', env: 'TELEGRAM_BOT_TOKEN' },
  { id: 'reddit', label: 'Reddit API configured', env: 'REDDIT_CLIENT_ID' },
  { id: 'groq', label: 'Groq AI (primary model)', env: 'GROQ_API_KEY' },
  { id: 'admin_secret', label: 'Admin secret key set', env: 'ADMIN_SECRET' },
  { id: 'admin_email', label: 'Admin emails configured', env: 'ADMIN_EMAILS' },
];

function EnvStatus({ value }: { value: string | undefined }) {
  const isSet = !!value && value !== 'your-key' && value !== 'REPLACE_ME';
  return (
    <span
      className={`inline-block font-mono text-[8px] tracking-widest px-2 py-0.5 border ${
        isSet
          ? 'border-emerald-900 bg-emerald-950/30 text-emerald-400'
          : 'border-red-900 bg-red-950/30 text-red-400'
      }`}
    >
      {isSet ? '✓ CONFIGURED' : '✗ MISSING'}
    </span>
  );
}

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in?redirect_url=/admin');

  const user = await currentUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const isAuthorized = ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail);
  if (!isAuthorized) redirect('/dashboard');

  const metrics = await getSystemMetrics();
  const now = new Date().toISOString();

  // Check env vars server-side
  const envStatus: Record<string, boolean> = {
    NEXT_PUBLIC_META_PIXEL_ID: !!(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    META_ACCESS_TOKEN: !!(process.env.META_ACCESS_TOKEN),
    DISCORD_WEBHOOK_URL: !!(process.env.DISCORD_WEBHOOK_URL),
    RESEND_API_KEY: !!(process.env.RESEND_API_KEY),
    TELEGRAM_BOT_TOKEN: !!(process.env.TELEGRAM_BOT_TOKEN),
    REDDIT_CLIENT_ID: !!(process.env.REDDIT_CLIENT_ID),
    TWITTER_BEARER_TOKEN: !!(process.env.TWITTER_BEARER_TOKEN),
    TWITTER_CONSUMER_KEY: !!(process.env.TWITTER_CONSUMER_KEY),
    LINKEDIN_ACCESS_TOKEN: !!(process.env.LINKEDIN_ACCESS_TOKEN),
    INSTAGRAM_ACCESS_TOKEN: !!(process.env.INSTAGRAM_ACCESS_TOKEN),
    GROQ_API_KEY: !!(process.env.GROQ_API_KEY),
    ADMIN_SECRET: !!(process.env.ADMIN_SECRET),
    ADMIN_EMAILS: !!(process.env.ADMIN_EMAILS),
  };

  const configuredCount = Object.values(envStatus).filter(Boolean).length;

  return (
    <main className="min-h-screen bg-black text-zinc-200 font-mono">
      {/* ── TOP BAR ── */}
      <div className="border-b border-zinc-900 bg-[#0a0a0a] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500" />
          <span className="text-[9px] tracking-[4px] text-orange-500">RESURGO :: ADMIN_CONSOLE</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] tracking-widest text-zinc-500">
          <span>OPERATOR: {userEmail}</span>
          <span className="text-zinc-700">|</span>
          <span>{now.split('T')[0]} {now.split('T')[1]?.slice(0, 8)} UTC</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        {/* ── SIDEBAR NAV ── */}
        <aside className="space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="border border-zinc-900 bg-[#0a0a0a]">
              <div className="border-b border-zinc-900 px-3 py-2">
                <p className="text-[8px] tracking-[3px] text-zinc-500">{section.label}</p>
              </div>
              <div className="space-y-px p-1">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    className={`block px-3 py-2 border transition hover:border-zinc-700 hover:bg-zinc-900/50 ${
                      item.current ? 'border-orange-900/50 bg-orange-950/20' : 'border-transparent'
                    }`}
                  >
                    <p className={`text-[9px] tracking-widest ${item.current ? 'text-orange-400' : 'text-zinc-300'}`}>
                      {item.label}
                    </p>
                    <p className="text-[8px] text-zinc-600 mt-0.5">{item.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="space-y-5">
          {/* Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'SYSTEM', value: metrics.health ? 'ONLINE' : 'UNKNOWN', color: metrics.health ? '#22c55e' : '#6b7280' },
              { label: 'META_ADS', value: metrics.meta?.configured ? 'ACTIVE' : 'NOT_SET', color: metrics.meta?.configured ? '#FF6B35' : '#ef4444' },
              { label: 'ENV_VARS', value: `${configuredCount}/${CHECKLIST.length}`, color: configuredCount >= 6 ? '#22c55e' : '#f97316' },
              { label: 'DISCORD', value: metrics.discord?.webhookConfigured ? 'LIVE' : 'NOT_SET', color: metrics.discord?.webhookConfigured ? '#a855f7' : '#6b7280' },
            ].map((s) => (
              <div key={s.label} className="border border-zinc-900 bg-[#0a0a0a] p-4">
                <p className="text-[8px] tracking-[3px] text-zinc-500">{s.label}</p>
                <p className="text-lg font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Integration Checklist */}
          <div className="border border-zinc-900 bg-[#0a0a0a]">
            <div className="border-b border-zinc-900 px-4 py-2 flex items-center justify-between">
              <p className="text-[9px] tracking-[3px] text-zinc-400">INTEGRATION_CHECKLIST</p>
              <p className="text-[8px] tracking-widest text-zinc-600">{configuredCount}/{CHECKLIST.length} CONFIGURED</p>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {CHECKLIST.map((item) => (
                <div key={item.id} className="flex items-center justify-between border border-zinc-900 px-3 py-2">
                  <div>
                    <p className="text-[10px] text-zinc-300">{item.label}</p>
                    <p className="text-[8px] text-zinc-600">{item.env}</p>
                  </div>
                  <EnvStatus value={process.env[item.env]} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-zinc-900 bg-[#0a0a0a]">
            <div className="border-b border-zinc-900 px-4 py-2">
              <p className="text-[9px] tracking-[3px] text-zinc-400">QUICK_ACTIONS</p>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { label: 'VIEW_MARKETING', href: '/admin/marketing', desc: 'Meta campaigns + email ads' },
                { label: 'SYSTEM_STATUS', href: '/admin/system-status', desc: 'Launch readiness check' },
                { label: 'CONTENT_LAB', href: '/admin/content', desc: 'Blog + SEO content' },
                { label: 'API_HEALTH', href: '/api/health', desc: 'Backend health check', external: true },
                { label: 'EMAIL_STATUS', href: '/api/email/campaigns', desc: 'Resend campaigns config', external: true },
                { label: 'VIEW_SITE', href: '/', desc: 'Public landing page', external: true },
              ].map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  target={a.external ? '_blank' : undefined}
                  className="border border-zinc-800 px-3 py-3 hover:border-orange-900/60 hover:bg-orange-950/10 transition"
                >
                  <p className="text-[9px] tracking-widest text-orange-400">&gt; {a.label}</p>
                  <p className="text-[8px] text-zinc-600 mt-1">{a.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick API Tester */}
          <div className="border border-zinc-900 bg-[#0a0a0a]">
            <div className="border-b border-zinc-900 px-4 py-2">
              <p className="text-[9px] tracking-[3px] text-zinc-400">SYSTEM_READINESS :: LOG</p>
            </div>
            <div className="p-4 space-y-1">
              {[
                `[${now.split('T')[1]?.slice(0, 8)}] ADMIN_CONSOLE :: Online`,
                `[${now.split('T')[1]?.slice(0, 8)}] ENV_CHECK :: ${configuredCount}/${CHECKLIST.length} variables configured`,
                `[${now.split('T')[1]?.slice(0, 8)}] COACHES :: 8 agents (6 standard + 2 premium ORACLE/NEXUS)`,
                `[${now.split('T')[1]?.slice(0, 8)}] SOCIAL :: twitter, linkedin, instagram, reddit, discord, telegram`,
                `[${now.split('T')[1]?.slice(0, 8)}] API_ROUTES :: food, recipes, meal-plan, weather, share-cards, email`,
                `[${now.split('T')[1]?.slice(0, 8)}] MARKETING :: meta-pixel, capi, og-cards, 28 blog posts, 6 clusters`,
                `[${now.split('T')[1]?.slice(0, 8)}] HEALTH :: ${metrics.health ? 'OK' : 'CHECK /api/health'}`,
                `[${now.split('T')[1]?.slice(0, 8)}] READY_FOR_LAUNCH :: ${configuredCount >= 8 ? 'YES' : 'PENDING CONFIGURATION'}`,
              ].map((line, i) => (
                <p key={i} className={`text-[9px] ${i === 5 ? 'text-orange-400' : 'text-zinc-500'}`}>
                  &gt; {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
