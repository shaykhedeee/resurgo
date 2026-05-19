import type { Metadata } from 'next';
import Link from 'next/link';
import { TermLinkButton } from '@/components/ui/TermButton';

const APP_URL = 'https://resurgo.life';

const DECISION_ROWS = [
  {
    category: 'Weekly Shipping System',
    resurgo: 'AI decomposes chaos into daily must-ship actions',
    motion: 'Strong scheduling, weaker behavior and habit layer',
    notion: 'Flexible workspace, high manual setup overhead',
    todoist: 'Excellent task manager, limited strategy context',
  },
  {
    category: 'Founder Context Awareness',
    resurgo: 'Coach references your habits, streaks, and execution trend',
    motion: 'Calendar optimization first',
    notion: 'No built-in behavioral coaching',
    todoist: 'Task-first, no execution coaching',
  },
  {
    category: 'Time to First Value',
    resurgo: 'Under 10 minutes to first actionable founder plan',
    motion: 'Good if your pain is calendar load',
    notion: 'Can take hours to build a useful system',
    todoist: 'Fast to capture tasks, slower to build full system',
  },
  {
    category: 'Execution + Retention Loop',
    resurgo: 'Tasks + habits + weekly review in one loop',
    motion: 'Great scheduling, less habit progression',
    notion: 'Requires custom databases and discipline',
    todoist: 'Tasks are clear, weekly execution loop is manual',
  },
];

const FAQS = [
  {
    q: 'Is Resurgo the best app for every founder?',
    a: 'No tool is best for every workflow. Resurgo is strongest for founders who need execution clarity, not just task storage or calendar automation.',
  },
  {
    q: 'Should I choose Motion or Resurgo?',
    a: 'Choose Motion if calendar collision is your main pain. Choose Resurgo if your main pain is inconsistency, planning drift, and low weekly shipping output.',
  },
  {
    q: 'Can I use Notion and Resurgo together?',
    a: 'Yes. Many founders use Notion as a knowledge base and Resurgo as the daily execution engine.',
  },
  {
    q: 'How fast can I validate if Resurgo works for me?',
    a: 'Usually within the first week. Use one weekly outcome, one daily must-ship task, and one end-of-day review loop.',
  },
];

export const metadata: Metadata = {
  title: 'Best App for Indie Founders in 2026 | Resurgo',
  description:
    'High-intent founder comparison: Resurgo vs Motion, Notion, and Todoist. See which app helps you ship weekly with less planning overhead.',
  keywords: [
    'best app for indie founders',
    'best productivity app for founders',
    'motion alternative for founders',
    'notion alternative for startup founders',
    'founder execution system',
    'ship weekly productivity app',
  ],
  alternates: {
    canonical: `${APP_URL}/best-app-for-indie-founders`,
  },
  openGraph: {
    title: 'Best App for Indie Founders in 2026',
    description:
      'A practical founder-focused comparison of Resurgo, Motion, Notion, and Todoist for weekly execution.',
    type: 'article',
    url: `${APP_URL}/best-app-for-indie-founders`,
    siteName: 'Resurgo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best App for Indie Founders in 2026',
    description:
      'Compare Resurgo, Motion, Notion, and Todoist for one outcome: shipping meaningful work every week.',
  },
};

export default function BestAppForIndieFoundersPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Best App for Indie Founders in 2026',
    description:
      'Founder-oriented comparison of Resurgo, Motion, Notion, and Todoist based on shipping consistency and execution clarity.',
    author: {
      '@type': 'Organization',
      name: 'Resurgo',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Resurgo',
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/icon-512.png`,
      },
    },
    dateModified: new Date().toISOString(),
    mainEntityOfPage: `${APP_URL}/best-app-for-indie-founders`,
  };

  return (
    <main className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <article className="mx-auto max-w-5xl px-4 py-14">
        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">HOME</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-zinc-400">COMPARE</Link>
          <span>/</span>
          <span className="text-zinc-400">BEST APP FOR INDIE FOUNDERS</span>
        </nav>

        <h1 className="font-mono text-3xl font-bold leading-tight text-zinc-100">
          Best App for Indie Founders in 2026
        </h1>
        <p className="mt-3 font-mono text-sm leading-relaxed text-zinc-300">
          If your real goal is shipping meaningful work every week, not just organizing tasks, this page helps you choose the right system fast.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="border border-zinc-900 bg-zinc-950 p-4">
            <p className="font-mono text-[11px] tracking-wider text-zinc-500">PRIMARY OUTCOME</p>
            <p className="mt-1 font-mono text-sm text-zinc-200">Weekly shipped output</p>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-4">
            <p className="font-mono text-[11px] tracking-wider text-zinc-500">TIME TO FIRST VALUE</p>
            <p className="mt-1 font-mono text-sm text-zinc-200">Under 10 minutes</p>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-4">
            <p className="font-mono text-[11px] tracking-wider text-zinc-500">BEST FIT</p>
            <p className="mt-1 font-mono text-sm text-zinc-200">Solo founders and indie builders</p>
          </div>
        </div>

        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Founder Decision Matrix</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left text-orange-400">Resurgo</th>
                  <th className="px-3 py-2 text-left">Motion</th>
                  <th className="px-3 py-2 text-left">Notion</th>
                  <th className="px-3 py-2 text-left">Todoist</th>
                </tr>
              </thead>
              <tbody>
                {DECISION_ROWS.map((row) => (
                  <tr key={row.category} className="border-b border-zinc-900 align-top">
                    <td className="px-3 py-3 text-zinc-300">{row.category}</td>
                    <td className="px-3 py-3 text-zinc-100">{row.resurgo}</td>
                    <td className="px-3 py-3 text-zinc-400">{row.motion}</td>
                    <td className="px-3 py-3 text-zinc-400">{row.notion}</td>
                    <td className="px-3 py-3 text-zinc-400">{row.todoist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Bottom Line</h2>
          <p className="mt-3 font-mono text-sm leading-relaxed text-zinc-300">
            Use Resurgo if you want a daily execution engine tied to weekly outcomes. Use Motion if your core issue is calendar conflicts. Use Notion if you need documentation depth. Use Todoist if your pain is task capture only.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TermLinkButton href="/sign-up" variant="primary" size="md">
              START FREE
            </TermLinkButton>
            <TermLinkButton href="/compare/motion" variant="secondary" size="md">
              VIEW RESURGO VS MOTION
            </TermLinkButton>
            <TermLinkButton href="/pricing" variant="ghost" size="md">
              SEE PRICING
            </TermLinkButton>
          </div>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-mono text-sm font-bold text-zinc-100">FAQ</h2>
          {FAQS.map((faq) => (
            <details key={faq.q} className="border border-zinc-900 bg-zinc-950">
              <summary className="cursor-pointer px-4 py-3 font-mono text-xs text-zinc-200">
                {faq.q}
              </summary>
              <p className="border-t border-zinc-900 px-4 py-3 font-mono text-xs leading-relaxed text-zinc-400">
                {faq.a}
              </p>
            </details>
          ))}
        </section>
      </article>
    </main>
  );
}

