import type { Metadata } from 'next';
import Link from 'next/link';
import EmailCapture from '@/components/marketing/EmailCapture';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';

const PAGE_URL = 'https://resurgo.life/ai-productivity-assistant';

export const metadata: Metadata = {
  title: 'AI Productivity Assistant for ADHD, Habits, and Goals | Resurgo',
  description:
    'Resurgo is an AI productivity assistant that helps you plan your day, track habits, run focus sessions, and execute goals without overwhelm.',
  keywords: [
    'ai productivity assistant',
    'adhd productivity app',
    'ai habit tracker',
    'ai daily planner',
    'goal tracking app',
    'focus timer app',
    'best productivity app for entrepreneurs',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'AI Productivity Assistant for ADHD, Habits, and Goals',
    description: 'One simple command center for tasks, habits, focus, and AI coaching.',
    url: PAGE_URL,
    type: 'website',
  },
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Resurgo',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  url: PAGE_URL,
  description:
    'AI productivity assistant for daily planning, focus sessions, habit tracking, and goal execution.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'AI goal decomposition',
    'Daily planning',
    'Habit streak tracking',
    'Pomodoro and deep work timers',
    'Weekly execution reviews',
  ],
};

export default function AiProductivityAssistantLandingPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-12 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <MarketingPageBeacon event="landing_viewed" properties={{ page: '/ai-productivity-assistant', template: 'simple-seo' }} />

      <div className="mx-auto max-w-4xl space-y-8">
        <header className="border border-zinc-800 bg-zinc-950 p-6">
          <p className="font-mono text-xs tracking-[0.3em] text-orange-500">AI_PRODUCTIVITY_ASSISTANT</p>
          <h1 className="mt-3 font-mono text-3xl font-bold leading-tight">
            The simple AI productivity assistant for people who are tired of app overload
          </h1>
          <p className="mt-3 max-w-3xl font-mono text-sm leading-6 text-zinc-400">
            Plan your day, track habits, run focus sessions, and execute goals in one command center.
            Designed for founders, creators, and ADHD brains who need clarity and momentum.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px] text-zinc-400">
            <span className="border border-zinc-700 px-2 py-1">AI daily planner</span>
            <span className="border border-zinc-700 px-2 py-1">ADHD-friendly workflow</span>
            <span className="border border-zinc-700 px-2 py-1">Habit tracker + streaks</span>
            <span className="border border-zinc-700 px-2 py-1">Focus timer + deep work</span>
          </div>
        </header>

        <section className="border border-zinc-800 bg-zinc-950 p-6">
          <p className="font-mono text-xs tracking-widest text-orange-500">START_FREE</p>
          <p className="mt-2 font-mono text-sm text-zinc-300">Get the free AI productivity blueprint and weekly execution templates.</p>
          <div className="mt-4">
            <EmailCapture variant="inline" source="seo_ai_productivity_assistant" offer="ai-productivity-blueprint" />
          </div>
          <div className="mt-4 flex flex-wrap gap-3 font-mono text-xs">
            <Link href="/sign-up" className="border border-orange-700 bg-orange-950/30 px-4 py-2 text-orange-400 hover:bg-orange-950/50">
              [CREATE_FREE_ACCOUNT]
            </Link>
            <Link href="/pricing" className="border border-zinc-700 px-4 py-2 text-zinc-300 hover:border-zinc-500">
              [VIEW_PRICING]
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Feature
            title="Plan in minutes"
            body="Tell the AI your goal and get a weekly plan plus daily actions instantly."
          />
          <Feature
            title="Stay consistent"
            body="Use streaks, XP, and recovery prompts so one bad day does not break momentum."
          />
          <Feature
            title="Focus deeply"
            body="Run Pomodoro or deep-work sessions and measure execution, not just intentions."
          />
        </section>

        <section className="border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="font-mono text-lg font-bold">Who this is for</h2>
          <ul className="mt-3 space-y-2 font-mono text-sm text-zinc-400">
            <li>• Founders who need one place for goals, tasks, and execution.</li>
            <li>• Professionals with ADHD who want low-friction daily structure.</li>
            <li>• Students and creators who struggle with procrastination and follow-through.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <article className="border border-zinc-800 bg-zinc-950 p-4">
      <p className="font-mono text-xs tracking-widest text-orange-500">FEATURE</p>
      <h3 className="mt-2 font-mono text-base font-bold text-zinc-100">{title}</h3>
      <p className="mt-2 font-mono text-xs leading-6 text-zinc-400">{body}</p>
    </article>
  );
}
