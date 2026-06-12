import { Metadata } from 'next';
import Link from 'next/link';
import { GuideSubscribeForm } from '@/components/GuideSubscribeForm';
import { GuidesSearchBar } from '@/components/GuidesSearchBar';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { siteUrl } from '@/lib/marketing/seo-config';

// SEO METADATA — Guides Hub

export const metadata: Metadata = {
  title: 'Habit Building Guides & Goal Achievement Resources | RESURGO',
  description:
    'Free science-backed guides on building habits, achieving goals, and productivity. Learn Atomic Habits principles, habit stacking, and AI goal planning.',
  keywords: [
    'habit building guide', 'how to build habits', 'atomic habits summary',
    'goal setting guide', 'productivity tips', 'habit tracker guide',
    'daily routine optimization', 'habit stacking guide', 'two minute rule',
    'how to stick to habits', 'build better habits', 'AI goal planning',
    'focus techniques', 'sleep and recovery guide', 'evening routine guide',
    'journaling for goals', 'breaking bad habits', 'habit streak psychology',
  ],
  openGraph: {
    title: 'Free Habit Building Guides & Resources | RESURGO',
    description: 'Master habit building with comprehensive guides powered by Atomic Habits principles and AI coaching.',
    type: 'website',
  },
  alternates: { canonical: `${siteUrl}/guides` },
};

// DATA

const pillarPages = [
  {
    slug: 'atomic-habits-guide',
    title: 'The Complete Atomic Habits Guide',
    subtitle: 'Four laws of behavior change, habit loops, and identity shifts',
    description: 'Master the system behind Atomic Habits by James Clear — habit stacking, the Two-Minute Rule, environment design, and how to build habits that compound.',
    icon: 'HB',
    readTime: 25,
    category: 'Habits',
    featured: true,
  },
  {
    slug: 'goal-setting-system',
    title: 'The Ultimate Goal Achievement System',
    subtitle: 'Turn big ambitions into daily executable actions',
    description: 'SMART goals, OKRs, AI-driven goal decomposition, and milestone tracking. The complete framework for goals that you actually stick to.',
    icon: 'GS',
    readTime: 20,
    category: 'Goals',
    featured: true,
  },
  {
    slug: 'productivity-habits',
    title: 'Productivity Habits for High Performers',
    subtitle: 'Morning rituals, deep work, and time-blocking',
    description: 'Daily routines used by top performers — from CEO morning routines to Navy SEAL recovery protocols. Science-backed and easy to implement.',
    icon: 'PR',
    readTime: 18,
    category: 'Productivity',
    featured: true,
  },
  {
    slug: 'habit-tracking-statistics',
    title: 'Habit Tracking Statistics & Research 2026',
    subtitle: 'Data on streaks, relapse patterns, and what actually works',
    description: 'Original research on habit formation, streak psychology, and what the data says about tools that produce lasting change.',
    icon: 'RS',
    readTime: 15,
    category: 'Research',
    featured: false,
  },
];

const allGuides = [
  { title: 'How to Build a Morning Routine', slug: 'morning-routine', views: '45K', category: 'Productivity', readTime: 12 },
  { title: 'The Two-Minute Rule Explained', slug: 'two-minute-rule', views: '38K', category: 'Habits', readTime: 8 },
  { title: 'Habit Stacking: Complete Guide', slug: 'habit-stacking', views: '32K', category: 'Habits', readTime: 10 },
  { title: 'How to Break Bad Habits', slug: 'breaking-bad-habits', views: '28K', category: 'Habits', readTime: 11 },
  { title: 'Identity-Based Habits', slug: 'identity-habits', views: '25K', category: 'Habits', readTime: 9 },
  { title: 'Goal Decomposition with AI', slug: 'goal-decomposition', views: '22K', category: 'Goals', readTime: 14 },
  { title: 'Focus Techniques That Work', slug: 'focus-techniques', views: '19K', category: 'Productivity', readTime: 10 },
  { title: 'Building Your Evening Routine', slug: 'evening-routine', views: '17K', category: 'Productivity', readTime: 9 },
  { title: 'Sleep & Recovery for Performance', slug: 'sleep-recovery', views: '16K', category: 'Wellness', readTime: 13 },
  { title: 'Journaling for Goal Clarity', slug: 'journaling-goals', views: '14K', category: 'Goals', readTime: 8 },
  { title: 'Habit Streak Psychology', slug: 'streak-psychology', views: '13K', category: 'Research', readTime: 10 },
  { title: 'Your AI Coaching Guide', slug: 'ai-coaching-guide', views: '11K', category: 'Goals', readTime: 7 },
];

const FAQS = [
  {
    q: 'How long does it take to build a habit?',
    a: 'Research shows an average of 66 days, ranging 18–254 days depending on complexity. Consistent repetition matters more than perfection.',
  },
  {
    q: 'What is the Two-Minute Rule?',
    a: 'Any new habit should take less than two minutes to start. This removes the friction of beginning and builds the identity of showing up every day.',
  },
  {
    q: 'What is habit stacking?',
    a: '"After [CURRENT HABIT], I will [NEW HABIT]." Linking new behaviors to existing ones leverages neural pathways to make change stick faster.',
  },
  {
    q: 'How does AI improve habit tracking?',
    a: 'AI analyses your completion patterns, energy levels, and progress data to adapt your plan weekly — so your system evolves as you do.',
  },
  {
    q: 'How do I break a bad habit?',
    a: 'Invert the Four Laws: make cues invisible, make it unattractive, add friction, and add immediate costs. Remove the environment that triggers it.',
  },
  {
    q: 'What is identity-based habit change?',
    a: 'Instead of targeting outcomes, you target beliefs. "I am a runner" is more durable than "I want to run." Each habit vote reinforces the identity.',
  },
];

// JSON-LD structured data connected to layout organization & website
const connectedJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/guides/#webpage`,
      'url': `${siteUrl}/guides`,
      'name': 'Habit Building Guides & Goal Achievement Resources | RESURGO',
      'description': 'Free science-backed guides on building habits, achieving goals, and productivity. Learn Atomic Habits principles, habit stacking, and AI goal planning.',
      'isPartOf': {
        '@id': `${siteUrl}/#website`,
      },
      'publisher': {
        '@id': `${siteUrl}/#organization`,
      },
    },
    {
      '@type': 'CollectionPage',
      '@id': `${siteUrl}/guides/#collection`,
      'isPartOf': {
        '@id': `${siteUrl}/guides/#webpage`,
      },
      'name': 'Habit Building Guides & Resources | RESURGO',
      'description': 'Free guides on building habits, achieving goals, and personal development.',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': pillarPages.map((page, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'url': `${siteUrl}/guides/${page.slug}`,
          'name': page.title,
        })),
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteUrl}/guides/#faq`,
      'isPartOf': {
        '@id': `${siteUrl}/guides/#webpage`,
      },
      'mainEntity': FAQS.map((f) => ({
        '@type': 'Question',
        'name': f.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.a,
        },
      })),
    },
  ],
};

// PAGE COMPONENT

const CAT_COLOR: Record<string, string> = {
  Habits: 'text-orange-400 border-orange-900/50 bg-orange-950/20',
  Goals: 'text-green-400 border-green-900/50 bg-green-950/20',
  Productivity: 'text-cyan-400 border-cyan-900/50 bg-cyan-950/20',
  Research: 'text-purple-400 border-purple-900/50 bg-purple-950/20',
  Wellness: 'text-yellow-400 border-yellow-900/50 bg-yellow-950/20',
};

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(connectedJsonLd) }} />

      <MarketingHeader
        navLinks={[
          { href: '/', label: 'Home', icon: 'home' },
          { href: '/guides', label: 'Guides', icon: 'plan' },
          { href: '/templates', label: 'Templates', icon: 'grid' },
          { href: '/pricing', label: 'Pricing', icon: 'star' },
          { href: '/blog', label: 'Blog', icon: 'terminal' },
        ]}
        tickerText="RESURGO.life :: GUIDES_HUB_INDEXED :: ANSWER_FIRST_CONTENT_READY"
      />

      {/* Hero */}
      <section className="border-b-2 border-zinc-800 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Terminal chrome */}
          <div className="mb-6 inline-flex items-center gap-2 border-2 border-zinc-800 bg-zinc-950 px-4 py-2">
            <span className="h-1.5 w-1.5 bg-red-700" />
            <span className="h-1.5 w-1.5 bg-yellow-700" />
            <span className="h-1.5 w-1.5 bg-green-700" />
              <span className="ml-2 font-pixel text-[0.35rem] tracking-widest text-zinc-500">
                resurgo :: guides_hub — knowledge_base v2026
            </span>
          </div>

          <p className="font-pixel text-[0.5rem] tracking-widest text-orange-600">KNOWLEDGE_BASE</p>
          <h1 className="mt-3 font-pixel text-2xl leading-tight text-zinc-100 sm:text-3xl">
            Build Better Habits.<br />
            <span className="text-orange-400">Achieve any goal.</span>
          </h1>
          <p className="mt-4 max-w-2xl font-terminal text-lg text-zinc-400">
            Free, science-backed guides on habit formation, AI goal planning, focus, and performance — built for people who want a system, not just motivation.
          </p>

          <div className="mt-6">
            <GuidesSearchBar
              guides={[...pillarPages, ...allGuides].map((p) => ({
                slug: p.slug,
                title: p.title,
                subtitle: 'subtitle' in p ? p.subtitle : '',
                category: p.category,
              }))}
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Pillar pages */}
        <section className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs text-orange-600">$</span>
            <h2 className="font-pixel text-[0.55rem] tracking-widest text-zinc-300">CORE_GUIDES</h2>
            <div className="flex-1 border-t border-zinc-800" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillarPages.filter((p) => p.featured).map((page) => (
              <Link
                key={page.slug}
                href={`/guides/${page.slug}`}
                className="group block border-2 border-zinc-800 bg-black p-5 transition hover:border-orange-900/60 hover:bg-zinc-950"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className={`border px-2 py-0.5 font-pixel text-[0.32rem] tracking-widest ${CAT_COLOR[page.category] ?? 'text-zinc-400 border-zinc-700'}`}>
                    {page.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-600">{page.readTime} min</span>
                </div>
                <h3 className="font-terminal text-base font-semibold text-zinc-200 transition-colors group-hover:text-orange-300">
                  {page.title}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-zinc-500">{page.subtitle}</p>
                <div className="mt-3 h-0.5 w-0 bg-orange-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </section>

        {/* All guides + sidebar */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* All guides list */}
          <section className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <span className="font-mono text-xs text-orange-600">$</span>
              <h2 className="font-pixel text-[0.55rem] tracking-widest text-zinc-300">ALL_GUIDES</h2>
              <div className="flex-1 border-t border-zinc-800" />
            </div>
            <div className="space-y-2">
              {allGuides.map((guide, i) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group flex items-center gap-4 border-2 border-zinc-800 bg-black p-4 transition hover:border-zinc-700 hover:bg-zinc-950"
                >
                  <span className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 w-6 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-terminal text-sm text-zinc-300 transition-colors group-hover:text-zinc-100 truncate">
                      {guide.title}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className={`border px-1.5 py-0 font-pixel text-[0.28rem] tracking-widest ${CAT_COLOR[guide.category] ?? 'text-zinc-500 border-zinc-700'}`}>
                        {guide.category.toUpperCase()}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-600">{guide.readTime} min read</span>
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-zinc-600">{guide.views}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Categories */}
            <div className="border-2 border-zinc-800 bg-black">
              <div className="border-b border-zinc-800 px-4 py-2.5">
                <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-400">CATEGORIES</p>
              </div>
              <div className="p-4 space-y-1.5">
                {(['All', 'Habits', 'Goals', 'Productivity', 'Wellness', 'Research'] as const).map((cat) => (
                  <div key={cat} className="flex items-center justify-between py-1.5 font-mono text-xs text-zinc-500 border-b border-zinc-900 last:border-0">
                    <span>{cat}</span>
                    <span className="text-zinc-700">→</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="border-2 border-zinc-800 bg-black">
              <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-2.5">
                <p className="font-pixel text-[0.38rem] tracking-widest text-orange-600">WEEKLY_DISPATCH</p>
              </div>
              <div className="p-5">
                <p className="font-terminal text-sm text-zinc-300 mb-1">Weekly Habit Tips</p>
                <p className="font-mono text-[11px] text-zinc-500 mb-4">
                  One actionable habit tip per week. No spam, unsubscribe anytime.
                </p>
                <GuideSubscribeForm />
              </div>
            </div>

            {/* CTA */}
            <div className="border-2 border-orange-900/40 bg-orange-950/10">
              <div className="p-5">
                <p className="font-pixel text-[0.4rem] tracking-widest text-orange-600 mb-2">READY_TO_START</p>
                <p className="font-terminal text-sm text-zinc-300 mb-1">Put guides into practice</p>
                <p className="font-mono text-[11px] text-zinc-500 mb-4">
                  Resurgo connects these principles to your actual goals with AI coaching.
                </p>
                <Link
                  href="/sign-up"
                  className="block text-center border-2 border-orange-600 bg-orange-600 py-2.5 font-pixel text-[0.38rem] tracking-widest text-black transition hover:bg-orange-500"
                >
                  [ TRY FREE ] →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* FAQ section */}
        <section
          className="mt-20"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-xs text-orange-600">$</span>
            <h2 className="font-pixel text-[0.55rem] tracking-widest text-zinc-300">FAQ_DATABASE</h2>
            <div className="flex-1 border-t border-zinc-800" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border-2 border-zinc-800 bg-black p-5"
                itemProp="mainEntity"
                itemScope
                itemType="https://schema.org/Question"
              >
                <h3
                  itemProp="name"
                  className="font-terminal text-sm font-semibold text-zinc-200 mb-2"
                >
                  {faq.q}
                </h3>
                <div
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <p itemProp="text" className="font-mono text-[11px] leading-relaxed text-zinc-500">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <MarketingFooter />
    </div>
  );
}

