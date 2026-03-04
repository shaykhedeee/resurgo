import { Metadata } from 'next';
import Link from 'next/link';
import { GuideSubscribeForm } from '@/components/GuideSubscribeForm';
import { GuidesSearchBar } from '@/components/GuidesSearchBar';

// ═══════════════════════════════════════════════════════════════════════════════
// SEO-OPTIMIZED BLOG/GUIDES HUB - Pillar Content Strategy
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Habit Building Guides & Resources | RESURGO',
  description: 'Free guides on building habits, achieving goals, and personal development. Learn Atomic Habits principles, goal-setting frameworks, and productivity techniques.',
  keywords: [
    'habit building guide', 'how to build habits', 'atomic habits summary',
    'goal setting guide', 'productivity tips', 'habit tracker guide',
    'daily routine optimization', 'habit stacking guide', 'two minute rule',
    'how to stick to habits', 'build better habits', 'personal development',
  ],
  openGraph: {
    title: 'Free Habit Building Guides & Resources | RESURGO',
    description: 'Master habit building with our comprehensive guides based on Atomic Habits principles.',
    type: 'website',
  },
  alternates: {
    canonical: '/guides',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PILLAR PAGES DATA (for internal linking and SEO)
// ═══════════════════════════════════════════════════════════════════════════════

const pillarPages = [
  {
    slug: 'atomic-habits-guide',
    title: 'The Complete Atomic Habits Guide',
    subtitle: 'Everything you need to know about building habits that stick',
    description: 'A comprehensive guide to Atomic Habits by James Clear. Learn the Four Laws of Behavior Change, habit stacking, the Two-Minute Rule, and more.',
    icon: 'HB',
    readTime: 25,
    category: 'Habits',
    featured: true,
    clusters: ['habit-stacking', 'two-minute-rule', 'identity-habits', 'breaking-bad-habits'],
  },
  {
    slug: 'goal-setting-system',
    title: 'The Ultimate Goal Achievement System',
    subtitle: 'Turn dreams into daily actions with AI-powered decomposition',
    description: 'Learn how to set goals that actually work. Discover SMART goals, OKRs, goal decomposition, and how to break big goals into tiny daily habits.',
    icon: 'GS',
    readTime: 20,
    category: 'Goals',
    featured: true,
    clusters: ['smart-goals', 'goal-decomposition', 'milestone-tracking'],
  },
  {
    slug: 'productivity-habits',
    title: 'Productivity Habits for High Performers',
    subtitle: 'Daily routines used by successful people',
    description: 'Discover the morning routines, evening rituals, and work habits used by top performers. Backed by science and easy to implement.',
    icon: 'PR',
    readTime: 18,
    category: 'Productivity',
    featured: true,
    clusters: ['morning-routine', 'evening-routine', 'deep-work', 'time-blocking'],
  },
  {
    slug: 'habit-tracking-statistics',
    title: 'Habit Tracking Statistics & Research 2026',
    subtitle: 'Data-driven insights on what works',
    description: 'Original research on habit formation success rates, streak psychology, and what the data says about building lasting habits.',
    icon: 'RS',
    readTime: 15,
    category: 'Research',
    featured: false,
    clusters: [],
  },
];

const popularGuides = [
  { title: 'How to Build a Morning Routine', slug: 'morning-routine', views: '45K', category: 'Productivity' },
  { title: 'The Two-Minute Rule Explained', slug: 'two-minute-rule', views: '38K', category: 'Habits' },
  { title: 'Habit Stacking: Complete Guide', slug: 'habit-stacking', views: '32K', category: 'Habits' },
  { title: 'How to Break Bad Habits', slug: 'breaking-bad-habits', views: '28K', category: 'Habits' },
  { title: 'Identity-Based Habits', slug: 'identity-habits', views: '25K', category: 'Habits' },
  { title: 'Goal Decomposition with AI', slug: 'goal-decomposition', views: '22K', category: 'Goals' },
];

const categories = [
  { name: 'All', count: 24 },
  { name: 'Habits', count: 12 },
  { name: 'Goals', count: 6 },
  { name: 'Productivity', count: 4 },
  { name: 'Research', count: 2 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// JSON-LD STRUCTURED DATA
// ═══════════════════════════════════════════════════════════════════════════════

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': 'Habit Building Guides & Resources',
  'description': 'Free guides on building habits, achieving goals, and personal development.',
  'publisher': {
    '@type': 'Organization',
    'name': 'RESURGO',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://resurgo.life/icons/icon.svg',
    },
  },
  'mainEntity': {
    '@type': 'ItemList',
    'itemListElement': pillarPages.map((page, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': `https://resurgo.life/guides/${page.slug}`,
      'name': page.title,
    })),
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-secondary)]/10" />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[var(--accent)]/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm mb-6">
            <span>Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] mb-6">
            Build Better Habits.<br />
            <span className="text-[var(--accent)]">Achieve Any Goal.</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mb-8">
            Free, science-backed guides on habit formation, goal achievement, and personal 
            productivity. Based on Atomic Habits principles.
          </p>
          
          {/* Search */}
          <GuidesSearchBar
            guides={pillarPages.map((p) => ({
              slug: p.slug,
              title: p.title,
              subtitle: p.subtitle,
              category: p.category,
            }))}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-20">
        {/* Featured Pillar Pages */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            Comprehensive Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillarPages.filter(p => p.featured).map((page) => (
              <Link
                key={page.slug}
                href={`/guides/${page.slug}`}
                className="group glass-card p-6 hover:border-[var(--accent)]/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{page.icon}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                    {page.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-2">
                  {page.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {page.subtitle}
                </p>
                <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <span>{page.readTime} min read</span>
                  <span className="text-[var(--accent)] group-hover:translate-x-1 transition-transform">
                    Read →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Guides */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              Most Popular
            </h2>
            <div className="space-y-4">
              {popularGuides.map((guide, i) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="flex items-center gap-4 glass-card p-4 hover:border-[var(--accent)]/50 transition-all group"
                >
                  <span className="text-2xl font-bold text-[var(--text-muted)] w-8">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                      {guide.title}
                    </h3>
                    <span className="text-sm text-[var(--text-muted)]">{guide.category}</span>
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">{guide.views} reads</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Categories */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <span>{cat.name}</span>
                    <span className="text-sm text-[var(--text-muted)]">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter CTA */}
            <div className="glass-card p-6 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-secondary)]/10">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                Weekly Habit Tips
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Get one actionable habit tip every week. No spam, unsubscribe anytime.
              </p>
              <GuideSubscribeForm />
            </div>

            {/* CTA */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                Ready to start tracking?
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Put these guides into practice with RESURGO&apos;s AI-powered habit tracker.
              </p>
              <Link
                href="/"
                className="block text-center py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors"
              >
                Try RESURGO Free
              </Link>
            </div>
          </aside>
        </div>

        {/* FAQ Section for Featured Snippets */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'How long does it take to build a habit?',
                a: 'Research shows it takes an average of 66 days to form a new habit, though this varies from 18 to 254 days depending on complexity. The key is consistent repetition, not perfection.',
              },
              {
                q: 'What is the Two-Minute Rule?',
                a: 'The Two-Minute Rule from Atomic Habits states: "When you start a new habit, it should take less than two minutes to do." This removes the barrier of starting and builds the habit of showing up.',
              },
              {
                q: 'What is habit stacking?',
                a: 'Habit stacking links a new habit to an existing one using the formula: "After [CURRENT HABIT], I will [NEW HABIT]." This leverages existing neural pathways to make new habits easier.',
              },
              {
                q: 'How do I break a bad habit?',
                a: 'Invert the Four Laws: Make it invisible (remove cues), make it unattractive (reframe benefits), make it difficult (add friction), and make it unsatisfying (add immediate costs).',
              },
            ].map((faq, i) => (
              <div key={i} className="glass-card p-6">
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  {faq.q}
                </h3>
                <p className="text-[var(--text-secondary)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
