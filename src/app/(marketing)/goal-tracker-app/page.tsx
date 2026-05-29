import type { Metadata } from 'next';
import Link from 'next/link';
import EmailCapture from '@/components/marketing/EmailCapture';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';
import { TermLinkButton } from '@/components/ui/TermButton';

const PAGE_URL = 'https://resurgo.life/goal-tracker-app';

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

export const metadata: Metadata = {
  title: 'Goal Tracker App for Daily Execution, Not Just Progress Bars | Resurgo',
  description:
    'Looking for a goal tracker app that helps you follow through? Resurgo connects goals to tasks, habits, focus sessions, and AI coaching so progress keeps moving.',
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
  return (
    <main className="min-h-screen bg-black text-zinc-100">
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
          </div>
        </div>
      </section>
    </main>
  );
}
