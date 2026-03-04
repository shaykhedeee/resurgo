import { Metadata } from 'next';
import Link from 'next/link';
import { KaiChatbot } from '@/components/KaiChatbot';
import { HelpSearchBar } from '@/components/HelpSearchBar';

// ═══════════════════════════════════════════════════════════════════════════════
// SEO METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const metadata: Metadata = {
  title: 'Help Center — Resurgo | Tutorials, FAQs & AI Support',
  description: 'Find answers to all your questions about Resurgo habit tracker. Browse tutorials, FAQs, troubleshooting guides, and get instant AI support from Kai. Learn habits, goals, focus sessions, and more.',
  keywords: [
    'Resurgo help', 'habit tracker help', 'Resurgo support', 'Resurgo FAQ',
    'how to use habit tracker', 'Resurgo tutorials', 'goal tracker help',
    'Resurgo getting started', 'habit stacking guide', 'focus timer help',
    'AI coaching help', 'Resurgo troubleshooting', 'productivity app help',
  ],
  openGraph: {
    title: 'Resurgo Help Center — Tutorials, FAQs & AI Support',
    description: 'Find answers, browse tutorials, and get instant AI support from Kai.',
    type: 'website',
    url: 'https://resurgo.life/help',
  },
  twitter: {
    card: 'summary',
    title: 'Resurgo Help Center',
    description: 'Tutorials, FAQs, troubleshooting guides, and AI support.',
  },
  alternates: { canonical: 'https://resurgo.life/help' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELP CENTER CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

const helpCategories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'New to RESURGO? Start here to learn the basics',
    icon: 'GS',
    articleCount: 8,
    articles: [
      'Creating your first habit',
      'Understanding habit stacking',
      'Setting up goals with AI',
      'Navigating the app',
    ],
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    id: 'features',
    title: 'Features Guide',
    description: 'Learn how to use every RESURGO feature',
    icon: 'FG',
    articleCount: 12,
    articles: [
      'Pomodoro timer',
      'Gamification & XP system',
      'Analytics dashboard',
      'Calendar & scheduling',
    ],
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    id: 'habits-goals',
    title: 'Habits & Goals',
    description: 'Master habit building with Atomic Habits principles',
    icon: 'HG',
    articleCount: 15,
    articles: [
      'The Four Laws of Behavior Change',
      'Two-Minute Rule explained',
      'Identity-based habits',
      'Breaking bad habits',
    ],
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    id: 'account',
    title: 'Account & Billing',
    description: 'Manage your subscription, profile, and settings',
    icon: 'AC',
    articleCount: 7,
    articles: [
      'Upgrading to Pro',
      'Managing subscription',
      'Data export',
      'Privacy settings',
    ],
    color: 'from-orange-500/20 to-yellow-500/20',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Solutions to common issues and problems',
    icon: 'TS',
    articleCount: 10,
    articles: [
      'Streaks not counting',
      'Notifications not working',
      'Sync issues',
      'Login problems',
    ],
    color: 'from-red-500/20 to-rose-500/20',
  },
  {
    id: 'api-integrations',
    title: 'Integrations',
    description: 'Connect RESURGO with other apps and services',
    icon: 'IN',
    articleCount: 5,
    articles: [
      'Calendar sync',
      'Apple Health',
      'Google Fit',
      'Zapier automation',
    ],
    color: 'from-indigo-500/20 to-violet-500/20',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// POPULAR ARTICLES
// ═══════════════════════════════════════════════════════════════════════════════

const popularArticles = [
  { title: 'How to create your first habit', category: 'Getting Started', views: '12.5k', href: '/help/getting-started' },
  { title: 'Understanding the Two-Minute Rule', category: 'Habits & Goals', views: '8.3k', href: '/help/habits-goals' },
  { title: 'Habit stacking: The complete guide', category: 'Habits & Goals', views: '7.1k', href: '/help/habits-goals' },
  { title: 'How to upgrade to Pro', category: 'Account', views: '5.9k', href: '/billing' },
  { title: 'Fix: Streaks not counting correctly', category: 'Troubleshooting', views: '4.2k', href: '/help/troubleshooting' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// QUICK LINKS
// ═══════════════════════════════════════════════════════════════════════════════

const quickLinks = [
  { title: 'Privacy Policy', href: '/privacy', icon: 'PP' },
  { title: 'Terms of Service', href: '/terms', icon: 'TS' },
  { title: 'Refund Policy', href: '/help/refund', icon: 'RF' },
  { title: 'Cookie Policy', href: '/help/cookies', icon: 'CK' },
  { title: 'Contact Support', href: '/support', icon: 'CS' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function HelpCenterPage() {
  const helpJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Resurgo Help Center',
    description: 'Find answers, tutorials, and guides for the Resurgo productivity platform.',
    url: 'https://resurgo.life/help',
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I create my first habit in Resurgo?', acceptedAnswer: { '@type': 'Answer', text: 'Go to the Habits tab, click Add Habit, enter a name, set frequency (daily or weekly), and save. Your streak tracking starts immediately.' } },
        { '@type': 'Question', name: 'What is habit stacking?', acceptedAnswer: { '@type': 'Answer', text: 'Habit stacking links a new habit to an existing one. Example: After I pour my morning coffee, I will meditate for 2 minutes. This creates powerful chains of behavior.' } },
        { '@type': 'Question', name: 'How does the focus timer work?', acceptedAnswer: { '@type': 'Answer', text: 'Resurgo offers Pomodoro (25/5), Deep Work (90 min), and Flowtime modes. Start a session, track distractions, and earn XP for focused work.' } },
        { '@type': 'Question', name: 'How do I contact Resurgo support?', acceptedAnswer: { '@type': 'Answer', text: 'Email support@resurgo.life or visit the Support page. Response time is within 24 hours, Monday to Friday.' } },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(helpJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 via-transparent to-[var(--accent-secondary)]/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--accent)]/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
            Find answers, tutorials, and guides to make the most of RESURGO. 
            Or ask Kai, our AI assistant, for instant help.
          </p>
          
          {/* Search Bar */}
          <HelpSearchBar
            categories={helpCategories.map((c) => ({
              id: c.id,
              title: c.title,
              description: c.description,
              articles: c.articles,
            }))}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        {/* Categories Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category) => (
              <Link
                key={category.id}
                href={`/help/${category.id}`}
                className="group glass-card p-6 hover:border-[var(--accent)]/50 transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  {category.description}
                </p>
                <span className="text-xs text-[var(--text-muted)]">
                  {category.articleCount} articles
                </span>
                
                {/* Preview articles */}
                <ul className="mt-4 space-y-1">
                  {category.articles.slice(0, 3).map((article, i) => (
                    <li key={i} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                      {article}
                    </li>
                  ))}
                </ul>
              </Link>
            ))}
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Articles */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
              Popular Articles
            </h2>
            <div className="glass-card divide-y divide-white/10">
              {popularArticles.map((article, i) => (
                <Link
                  key={i}
                  href={article.href}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">{article.category}</p>
                  </div>
                  <span className="text-sm text-[var(--text-muted)]">{article.views} views</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Links */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                    >
                      <span>{link.icon}</span>
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Card */}
            <div className="glass-card p-6 bg-gradient-to-br from-[var(--accent)]/10 to-[var(--accent-secondary)]/10">
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                Need more help?
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help.
              </p>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium transition-colors"
              >
                Contact Support
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            {/* Video Tutorials */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                Video Tutorials
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/help/getting-started" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    <span className="text-lg">▶️</span>
                    Getting Started in 5 Minutes
                  </Link>
                </li>
                <li>
                  <Link href="/help/habits-goals" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    <span className="text-lg">▶️</span>
                    Mastering Habit Stacking
                  </Link>
                </li>
                <li>
                  <Link href="/help/features" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                    <span className="text-lg">▶️</span>
                    AI Goal Decomposition Tutorial
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Ask Kai Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Ask Kai - Your AI Assistant
            </h2>
            <p className="text-[var(--text-secondary)]">
              Get instant answers to your questions about RESURGO
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <KaiChatbot variant="embedded" />
          </div>
        </section>
      </main>

      {/* Floating Chatbot */}
      <KaiChatbot variant="floating" />
    </div>
  );
}
