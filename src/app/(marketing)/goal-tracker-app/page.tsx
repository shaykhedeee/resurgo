import type { Metadata } from 'next';
import Link from 'next/link';
import EmailCapture from '@/components/marketing/EmailCapture';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';
import { TermLinkButton } from '@/components/ui/TermButton';
import { siteUrl } from '@/lib/marketing/seo-config';

const PAGE_URL = `${siteUrl}/goal-tracker-app`;

const comparisonRows = [
  {
    feature: 'Goal breakdown',
    resurgo: 'AI turns one goal into milestones, tasks, and habits',
    typical: 'You manually create all structure',
  },
  {
    feature: 'Daily follow-through',
    resurgo: 'Focus sessions, streaks, and AI coaching stay connected',
    typical: 'Goals live separately from execution',
  },
  {
    feature: 'Weekly adaptation',
    resurgo: 'Weekly reviews help adjust the plan based on real behavior',
    typical: 'Static goal dashboard with little feedback',
  },
];

const relatedGuides = [
  {
    href: '/blog/goal-tracker-app-complete-buyers-guide',
    title: 'Goal Tracker App Buyer Guide',
    description: 'Commercial-intent guide for choosing a tracker that actually drives execution.',
  },
  {
    href: '/blog/weekly-review-template-for-goal-tracking',
    title: 'Weekly Review Template for Goal Tracking',
    description: 'Answer-first support content for maintaining goals after setup.',
  },
  {
    href: '/blog/habit-tracker-for-goals',
    title: 'Habit Tracker for Goals',
    description: 'Support article for connecting streaks, habits, and measurable outcomes.',
  },
];

const faqItems = [
  {
    question: 'What makes a goal tracker app actually useful?',
    answer:
      'A useful goal tracker connects goals to milestones, daily actions, habits, and weekly reviews instead of only showing a progress bar. The key test is whether the app reduces ambiguity about what to do next.',
  },
  {
    question: 'Can one app track goals, habits, and daily execution together?',
    answer:
      'Yes. Resurgo is designed to connect long-term goals with daily tasks, supporting habits, focus sessions, and AI coaching in one system, which means the same plan can move from idea to execution without tool switching.',
  },
  {
    question: 'Who is Resurgo best for as a goal tracker app?',
    answer:
      'Resurgo is a strong fit for founders, students, ADHD users, and solo operators who need a single execution system rather than separate planning tools. It is especially useful when goals fail because the next step stays vague.',
  },
];

export const metadata: Metadata = {
  title: 'Goal Tracker App for Daily Execution, Not Just Progress Bars | Resurgo',
  description:
    'Looking for a goal tracker app that works? Resurgo connects goals to tasks, habits, focus sessions, and AI coaching to keep your progress moving.',
  keywords: [
    'goal tracker app',
    'best goal tracking app',
    'online goal tracker',
    'smart goal tracker',
    'goal app with habits',
    'daily goal planner app',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Goal Tracker App for Daily Execution, Not Just Progress Bars',
    description:
      'Track goals with the tasks, habits, focus blocks, and weekly reviews needed to actually finish them.',
    url: PAGE_URL,
    type: 'website',
  },
};

export default function GoalTrackerAppPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${PAGE_URL}/#faq`,
        'isPartOf': {
          '@id': `${PAGE_URL}/#webpage`,
        },
        'mainEntity': faqItems.map((item) => ({
          '@type': 'Question',
          'name': item.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': item.answer,
          },
        })),
      },
      {
        '@type': 'WebPage',
        '@id': `${PAGE_URL}/#webpage`,
        'isPartOf': {
          '@id': `${siteUrl}/#website`,
        },
        'name': 'Goal Tracker App for Daily Execution, Not Just Progress Bars | Resurgo',
        'description': 'Looking for a goal tracker app that works? Resurgo connects goals to tasks, habits, focus sessions, and AI coaching to keep your progress moving.',
        'url': PAGE_URL,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MarketingPageBeacon
        event="marketing_page_view"
        properties={{ page: 'goal-tracker-app', intent: 'seo' }}
      />

      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-black to-black">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
              GOAL TRACKER APP
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              A goal tracker app should tell you what to do today.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Resurgo is built for people who do not need another progress bar. You need
              a system that links goals to habits, tasks, and focus time so momentum does
              not disappear after the first burst of motivation.
            </p>
            <div className="mt-6 rounded-2xl border border-orange-900/50 bg-orange-950/10 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
                Quick Answer
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-200">
                The best goal tracker app should tell you what matters today, not just
                display a future outcome. Resurgo connects the goal to milestones, tasks,
                habits, and reviews so the plan survives after setup.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TermLinkButton href="/sign-up" size="lg">
                Start Free
              </TermLinkButton>
              <TermLinkButton href="/compare" variant="secondary" size="lg">
                Compare Alternatives
              </TermLinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">How Resurgo differs from a typical goal tracker</h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
              <thead className="bg-zinc-950/80 text-zinc-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Feature</th>
                  <th className="px-4 py-3 font-medium">Resurgo</th>
                  <th className="px-4 py-3 font-medium">Typical tracker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 bg-black">
                {comparisonRows.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-4 py-4 text-zinc-100">{row.feature}</td>
                    <td className="px-4 py-4 text-zinc-300">{row.resurgo}</td>
                    <td className="px-4 py-4 text-zinc-500">{row.typical}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-8">
            <h2 className="text-2xl font-bold text-white">Built for execution, not admin work</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Resurgo takes one goal and generates the layers most people never build on
              their own: milestones, daily tasks, supporting habits, and weekly reviews.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-400">
              <li>AI goal decomposition</li>
              <li>Habit and streak tracking</li>
              <li>Pomodoro and deep-work timers</li>
              <li>Weekly AI review loop</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-8">
            <h2 className="text-2xl font-bold text-white">Useful for founders, students, and ADHD users</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300">
              The product already supports multiple use cases across the site, but the
              common need is the same: fewer decisions, clearer next actions, and less
              tool-switching.
            </p>
            <p className="mt-6 text-sm text-zinc-400">
              Explore niche pages for{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/indie-hackers">
                indie hackers
              </Link>
              ,{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/adhd">
                ADHD planning
              </Link>
              , and{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/remote-developers">
                remote developers
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
                Internal Guides
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Best next reads for goal-tracker buyers
              </h2>
            </div>
            <TermLinkButton href="/blog" variant="secondary" size="sm">
              Browse Blog
            </TermLinkButton>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6 transition hover:border-zinc-700"
              >
                <h3 className="text-base font-semibold text-white">{guide.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Frequently asked questions</h2>
          <div className="mt-8 space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/50"
              >
                <summary className="cursor-pointer px-6 py-5 text-left text-sm font-semibold text-white">
                  {item.question}
                </summary>
                <p className="border-t border-zinc-800 px-6 py-5 text-sm leading-7 text-zinc-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-orange-900/60 bg-orange-950/20 p-8">
            <h2 className="text-2xl font-bold text-white">
              Get the goal planning checklist
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Join the email list for goal-setting frameworks, launch planning content,
              and product updates from Resurgo.
            </p>
            <div className="mt-6">
              <EmailCapture
                variant="inline"
                source="goal-tracker-app"
                offer="goal-planning-checklist"
              />
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Need more proof before signing up? Read the{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/blog/goal-tracker-app-complete-buyers-guide">
                buyer guide
              </Link>{' '}
              or compare plans on{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/pricing">
                pricing
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
