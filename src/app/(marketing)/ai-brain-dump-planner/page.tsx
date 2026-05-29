import type { Metadata } from 'next';
import Link from 'next/link';
import EmailCapture from '@/components/marketing/EmailCapture';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';
import { TermLinkButton } from '@/components/ui/TermButton';

const PAGE_URL = 'https://resurgo.life/ai-brain-dump-planner';

const planningSteps = [
  {
    title: 'Dump everything without organizing it first',
    body:
      'Type your goal, half-finished ideas, blockers, and random tasks into one place. Resurgo is designed for messy input, not perfect planning behavior.',
  },
  {
    title: 'Let AI turn chaos into structure',
    body:
      'Resurgo breaks the dump into milestones, habits, weekly targets, and today priorities so you can stop manually designing a system every morning.',
  },
  {
    title: 'Execute one calm plan for today',
    body:
      'Focus sessions, streaks, and coach guidance keep the plan connected to real follow-through instead of becoming another abandoned dashboard.',
  },
];

const proofPoints = [
  'AI goal decomposition for goals, tasks, and habits',
  '5 AI coaches with free access to Marcus and Titan',
  'Focus timer, streak tracking, and weekly reviews in one workflow',
  'Free plan available with no credit card required',
];

export const metadata: Metadata = {
  title: 'AI Brain Dump Planner That Turns Chaos Into Today’s Plan | Resurgo',
  description:
    'Need an AI brain dump planner that turns scattered thoughts into a real execution plan? Resurgo converts messy goals, tasks, and ideas into today’s priorities in minutes.',
  keywords: [
    'ai brain dump planner',
    'brain dump planner',
    'goal planner ai',
    'ai daily planner',
    'intelligent goal planner',
    'turn brain dump into plan',
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: 'AI Brain Dump Planner That Turns Chaos Into Today’s Plan',
    description:
      'Drop your messy ideas into Resurgo and get milestones, habits, and a daily execution plan automatically.',
    url: PAGE_URL,
    type: 'website',
  },
};

export default function AIBrainDumpPlannerPage() {
  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <MarketingPageBeacon
        event="marketing_page_view"
        properties={{ page: 'ai-brain-dump-planner', intent: 'seo' }}
      />

      <section className="border-b border-zinc-800 bg-gradient-to-b from-zinc-950 via-black to-black">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
              AI BRAIN DUMP PLANNER
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Turn your brain dump into today&apos;s plan.
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              Most planners expect you to arrive organized. Resurgo does the opposite.
              It takes your messy goal notes, random tasks, and half-clear priorities and
              turns them into one calm execution plan you can actually follow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <TermLinkButton href="/sign-up" size="lg">
                Start Free
              </TermLinkButton>
              <TermLinkButton href="/pricing" variant="secondary" size="lg">
                View Pricing
              </TermLinkButton>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {proofPoints.map((item) => (
                <div key={item} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {planningSteps.map((step, index) => (
              <article key={step.title} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
                <p className="font-mono text-xs text-orange-400">0{index + 1}</p>
                <h2 className="mt-3 text-xl font-semibold text-white">{step.title}</h2>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
              WHY RESURGO
            </p>
            <h2 className="mt-4 text-3xl font-bold text-white">
              A brain dump planner only matters if it changes what you do next.
            </h2>
            <p className="mt-4 text-base leading-8 text-zinc-300">
              Resurgo goes beyond capture. The same system that receives your brain dump
              also tracks the habits, focus blocks, and reviews required to keep your plan
              alive after Day 1.
            </p>
            <div className="mt-8 rounded-xl border border-zinc-800 bg-black p-5 font-mono text-sm text-zinc-300">
              <p>&gt; goal &quot;launch my startup in 90 days&quot;</p>
              <p className="mt-2 text-zinc-500">Analyzing chaos...</p>
              <p className="mt-2">- 4 milestones generated</p>
              <p>- 12 weekly targets created</p>
              <p>- Day 1 plan ready</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-orange-900/60 bg-orange-950/20 p-8">
            <h2 className="text-2xl font-bold text-white">
              Get the launch checklist and execution emails
            </h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Join the Resurgo list for practical planning frameworks, launch checklists,
              and product updates.
            </p>
            <div className="mt-6">
              <EmailCapture
                variant="inline"
                source="ai-brain-dump-planner"
                offer="execution-checklist"
              />
            </div>
            <p className="mt-4 text-xs text-zinc-500">
              Prefer reading first? Visit the{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/blog">
                blog
              </Link>{' '}
              or compare Resurgo against other tools on the{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/compare">
                alternatives page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
