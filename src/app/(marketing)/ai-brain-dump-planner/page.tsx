import type { Metadata } from 'next';
import Link from 'next/link';
import EmailCapture from '@/components/marketing/EmailCapture';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';
import { TermLinkButton } from '@/components/ui/TermButton';
import { siteUrl } from '@/lib/marketing/seo-config';

const PAGE_URL = `${siteUrl}/ai-brain-dump-planner`;

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

const relatedGuides = [
  {
    href: '/blog/ai-brain-dump-planner-guide',
    title: 'AI Brain Dump Planner Guide',
    description: 'Answer-first breakdown of how to turn scattered thoughts into a daily plan.',
  },
  {
    href: '/blog/goal-decomposition-examples',
    title: 'Goal Decomposition Examples',
    description: 'Concrete examples for turning a messy brain dump into milestones and today tasks.',
  },
  {
    href: '/blog/best-ai-daily-planner-for-adhd',
    title: 'Best AI Daily Planner for ADHD',
    description: 'Useful follow-up if the real problem is executive function and task initiation.',
  },
];

const faqItems = [
  {
    question: 'What is the best AI brain dump planner for messy thoughts and planning overwhelm?',
    answer:
      'The best AI brain dump planner should capture unstructured thoughts, separate goals from tasks, and hand you one calm next action. Resurgo is built around that workflow instead of expecting you to clean the mess manually first.',
  },
  {
    question: 'Can an AI brain dump planner turn thoughts into goals, habits, and tasks automatically?',
    answer:
      'Yes. Resurgo classifies brain-dump input into outcomes, milestones, tasks, and supporting habits so the same capture session becomes an execution plan instead of another notes archive.',
  },
  {
    question: 'Who benefits most from an AI brain dump planner?',
    answer:
      'Founders, ADHD adults, students, and overloaded solo operators benefit most because they often have high idea volume but low clarity on what should happen today.',
  },
];

export const metadata: Metadata = {
  title: 'AI Brain Dump Planner That Turns Chaos Into Today’s Plan | Resurgo',
  description:
    'Looking for an AI brain dump planner? Resurgo turns scattered thoughts, tasks, and chaotic goals into a prioritized execution plan in minutes.',
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
        'name': 'AI Brain Dump Planner That Turns Chaos Into Today\'s Plan | Resurgo',
        'description': 'Looking for an AI brain dump planner? Resurgo turns scattered thoughts, tasks, and chaotic goals into a prioritized execution plan in minutes.',
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
            <div className="mt-6 rounded-2xl border border-orange-900/50 bg-orange-950/10 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
                Quick Answer
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-200">
                If you are searching for an AI brain dump planner, the practical need is
                simple: capture mental clutter, identify the real priority, and leave with
                one visible next step. Resurgo does that by converting the dump into goals,
                tasks, habits, and a daily plan in the same workflow.
              </p>
            </div>

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

      <section className="border-b border-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">
                Internal Guides
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Best next reads for brain-dump searchers
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
              . If you are ready to turn the dump into a working system, start with{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/goal-tracker-app">
                goal tracking
              </Link>{' '}
              and{' '}
              <Link className="text-orange-400 hover:text-orange-300" href="/habit-tracker-goals">
                habit support
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
