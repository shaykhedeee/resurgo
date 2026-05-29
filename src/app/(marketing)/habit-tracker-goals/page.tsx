import type { Metadata } from 'next';
import EmailCapture from '@/components/marketing/EmailCapture';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';
import { TermLinkButton } from '@/components/ui/TermButton';

const PAGE_URL = 'https://resurgo.life/habit-tracker-goals';

const sections = [
  {
    title: 'Habits that point at a real goal',
    body:
      'Instead of tracking habits in isolation, Resurgo ties them back to broader outcomes so your routine has a visible reason to exist.',
  },
  {
    title: 'Tasks, habits, and focus stay connected',
    body:
      'Your habits support the same execution system as your daily tasks and focus sessions. That reduces the usual gap between planning and follow-through.',
  },
  {
    title: 'Weekly review closes the loop',
    body:
      'Resurgo does not stop at streaks. Weekly reviews help you decide whether the habits you are tracking are still pushing the right goal forward.',
  },
];

export const metadata: Metadata = {
  title: 'Habit Tracker for Goals That Actually Move You Forward | Resurgo',
  description:
    'Need a habit tracker for goals, not just streaks? Resurgo connects habits to milestones, tasks, and weekly reviews so your routine compounds toward a real outcome.',
  keywords: [
    'habit tracker for goals',
    'goal based habit tracker',
    'habit tracker with goals',
    'best habit tracker 2026',
    'habit tracking app for goals',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'Habit Tracker for Goals That Actually Move You Forward',
    description:
      'Track habits in the context of real goals with AI planning, streaks, and weekly review loops.',
    url: PAGE_URL,
    type: 'website',
  },
};

export default function HabitTrackerGoalsPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <MarketingPageBeacon
        event="marketing_page_view"
        properties={{ page: 'habit-tracker-goals', intent: 'seo' }}
      />

      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-black to-black">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
              HABIT TRACKER FOR GOALS
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Track habits that build something bigger than a streak.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              A habit tracker for goals should connect your daily actions to an actual
              destination. Resurgo links habits with goals, tasks, and reviews so
              consistency compounds into progress instead of becoming another isolated
              scorecard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TermLinkButton href="/sign-up" size="lg">
                Start Free
              </TermLinkButton>
              <TermLinkButton href="/blog/best-free-habit-tracker-app-2026" variant="secondary" size="lg">
                Read Comparison Guide
              </TermLinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
          {sections.map((section, index) => (
            <article key={section.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <p className="font-mono text-xs text-orange-400">0{index + 1}</p>
              <h2 className="mt-3 text-xl font-semibold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
            <h2 className="text-3xl font-bold text-white">What you get inside Resurgo</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
                Habit streak tracking with a larger goal context
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
                AI goal decomposition into milestones and daily tasks
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
                Focus sessions for deep work and follow-through
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black p-4 text-sm text-zinc-300">
                Weekly reviews to adapt your habit system over time
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-orange-900/60 bg-orange-950/20 p-8">
            <h2 className="text-2xl font-bold text-white">
              Join the list for habit system templates
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Get practical templates for building habits that support long-term goals.
            </p>
            <div className="mt-6">
              <EmailCapture
                variant="inline"
                source="habit-tracker-goals"
                offer="habit-system-templates"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
