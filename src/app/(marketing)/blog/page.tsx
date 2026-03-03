import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_TOPIC_CLUSTERS } from '@/lib/blog/post-index';

export const metadata: Metadata = {
  title: 'Blog — Productivity Tips, Habit Science & Goal Setting | Resurgo',
  description: 'Read evidence-based articles on habit formation, procrastination fixes, AI coaching, goal tracking systems, and deep work strategies. Resurgo blog — insights that help you build better habits.',
  keywords: [
    'productivity blog', 'habit science', 'goal setting tips', 'procrastination help',
    'AI coaching blog', 'deep work strategies', 'habit tracker tips', 'Resurgo blog',
    'atomic habits tips', 'focus techniques', 'personal development blog', 'habit streaks',
  ],
  openGraph: {
    title: 'Resurgo Blog — Productivity Tips, Habit Science & Goal Setting',
    description: 'Evidence-based insights on habit formation, focus, and building the life you want.',
    type: 'website',
    url: 'https://resurgo.life/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resurgo Blog — Productivity & Habit Science',
    description: 'Evidence-based insights on habit formation, focus, and goal achievement.',
  },
  alternates: { canonical: 'https://resurgo.life/blog' },
};

const POSTS = [
  {
    slug: 'ai-growth-system-2026-ultimate-playbook',
    title: 'The AI Growth System for 2026: The Ultimate Playbook to Turn Attention into Revenue',
    desc: 'A research-backed operating system for founders and creators who want to convert AI-era discovery into pipeline, trust, and sales using one unified weekly execution loop.',
    date: 'March 2, 2026',
    readTime: '18 min',
    tags: ['marketing strategy', 'AEO', 'conversion optimization'],
    heroImage: '/blog/ultimate-ai-growth-system-2026.svg',
  },
  {
    slug: 'why-vision-boards-fail-and-how-ai-fixes-it',
    title: 'Why Vision Boards Fail (and How AI Turns Them Into Execution Systems)',
    desc: 'Most vision boards are aesthetic inspiration with no behavior engine. Here is a practical framework to convert visuals into daily execution, measurable milestones, and real momentum.',
    date: 'March 2, 2026',
    readTime: '12 min',
    tags: ['vision board', 'AI productivity', 'goal execution'],
    heroImage: '/blog/vision-board-ai-execution.svg',
  },
  {
    slug: 'stop-restarting-goals-every-monday',
    title: 'Stop Restarting Your Goals Every Monday: The Anti-Reset System',
    desc: 'If you are excellent at restarting but inconsistent at finishing, this operating system gives you a weekly structure that protects momentum through bad days.',
    date: 'March 1, 2026',
    readTime: '11 min',
    tags: ['consistency', 'goal setting', 'weekly planning'],
    heroImage: '/blog/anti-reset-system.svg',
  },
  {
    slug: 'founder-weekly-planning-system',
    title: 'The Founder Weekly Planning System: Turn Chaos Into Shipped Work',
    desc: 'A practical planning framework for founders and builders who juggle product, marketing, operations, and personal execution without burning out.',
    date: 'February 28, 2026',
    readTime: '13 min',
    tags: ['founder productivity', 'planning', 'execution'],
    heroImage: '/blog/founder-weekly-planning.svg',
  },
  {
    slug: 'seven-day-consistency-reset',
    title: 'The 7-Day Consistency Reset: Recover Fast After Falling Off Track',
    desc: 'Missed habits, late starts, and broken streaks do not need a dramatic comeback. This 7-day protocol rebuilds trust, structure, and momentum quickly.',
    date: 'February 27, 2026',
    readTime: '10 min',
    tags: ['habit reset', 'comeback', 'self discipline'],
    heroImage: '/blog/seven-day-reset.svg',
  },
  {
    slug: 'ai-accountability-system-daily-execution',
    title: 'Build an AI Accountability System for Daily Execution (Not Just Motivation)',
    desc: 'Use AI as a consistency partner: plan decomposition, check-ins, friction alerts, and behavior-based nudges that convert intention into completed work.',
    date: 'February 26, 2026',
    readTime: '12 min',
    tags: ['AI coaching', 'accountability', 'productivity'],
    heroImage: '/blog/ai-accountability-system.svg',
  },
  {
    slug: 'habit-stacking-examples-that-actually-work',
    title: 'Habit Stacking Examples That Actually Work (By Time, Location, and Trigger)',
    desc: 'Most habit stacks fail because the trigger is weak. These examples show how to design stacks that survive travel, stress, and schedule changes.',
    date: 'February 25, 2026',
    readTime: '9 min',
    tags: ['habit stacking', 'behavior design', 'atomic habits'],
    heroImage: '/blog/habit-stacking-examples.svg',
  },
  {
    slug: 'goal-decomposition-for-big-projects',
    title: 'Goal Decomposition for Big Projects: From Overwhelm to Actionable Steps',
    desc: 'A tactical method to break intimidating goals into clear milestones and next actions so progress happens daily instead of staying conceptual.',
    date: 'February 24, 2026',
    readTime: '11 min',
    tags: ['goal decomposition', 'planning', 'project execution'],
    heroImage: '/blog/goal-decomposition.svg',
  },
  {
    slug: 'morning-routine-for-focus-and-energy',
    title: 'A Morning Routine for Focus and Energy (Without Waking at 5AM)',
    desc: 'You do not need an extreme routine. You need a repeatable sequence that protects attention, energy, and strategic action before reactive work begins.',
    date: 'February 23, 2026',
    readTime: '8 min',
    tags: ['morning routine', 'focus', 'energy management'],
    heroImage: '/blog/morning-focus-routine.svg',
  },
  {
    slug: 'procrastination-triggers-and-fast-interventions',
    title: 'Procrastination Triggers and Fast Interventions: A Field Guide',
    desc: 'Learn your top procrastination triggers and map each one to a rapid intervention so you can recover in minutes instead of losing entire days.',
    date: 'February 22, 2026',
    readTime: '10 min',
    tags: ['procrastination', 'focus', 'mental performance'],
    heroImage: '/blog/procrastination-interventions.svg',
  },
  {
    slug: 'how-to-build-weekly-review-that-improves-retention',
    title: 'How to Build a Weekly Review That Improves Retention and Results',
    desc: 'A weekly review is the compounding loop behind long-term consistency. Here is a step-by-step format that drives better decisions and higher follow-through.',
    date: 'February 21, 2026',
    readTime: '9 min',
    tags: ['weekly review', 'retention', 'habit tracking'],
    heroImage: '/blog/weekly-review-system.svg',
  },
  {
    slug: 'habit-science-why-streaks-work',
    title: 'The Neuroscience of Habit Streaks: Why Consecutive Days Actually Matter',
    desc: "Your brain on a habit loop isn't just repetition — it's identity construction. Here's the science behind why streaks work and how to use them without the shame spiral.",
    date: 'February 12, 2026',
    readTime: '6 min',
    tags: ['habits', 'neuroscience', 'psychology'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'procrastination-is-not-laziness',
    title: 'Procrastination Is Not a Time Management Problem (And How to Actually Fix It)',
    desc: "Procrastination is an emotional regulation failure, not a discipline one. Understanding this distinction is the first step to eliminating it permanently.",
    date: 'February 8, 2026',
    readTime: '8 min',
    tags: ['procrastination', 'focus', 'psychology'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'ai-coaching-vs-human-coaching',
    title: 'AI Coaching vs Human Coaching: A Brutally Honest Comparison',
    desc: "We pitted 6 AI personas against traditional coaching approaches across accountability, cost, availability, and emotional intelligence. The results might surprise you.",
    date: 'February 3, 2026',
    readTime: '10 min',
    tags: ['AI', 'coaching', 'productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'goal-tracking-systems-compared',
    title: 'SMART Goals Are Dead. Here\'s What Actually Works in 2026.',
    desc: "SMART goals were designed for organizations in the 1980s. Here's why they fail for personal achievement — and the modern frameworks that actually move the needle.",
    date: 'January 28, 2026',
    readTime: '7 min',
    tags: ['goals', 'systems', 'productivity'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
  {
    slug: 'deep-work-in-the-age-of-notifications',
    title: 'Deep Work Is Becoming a Superpower (And How to Build It in 30 Days)',
    desc: "The ability to focus deeply is increasingly rare and increasingly valuable. Here's a 30-day protocol for rebuilding your attention span in the age of infinite distraction.",
    date: 'January 21, 2026',
    readTime: '9 min',
    tags: ['focus', 'deep work', 'discipline'],
    heroImage: '/blog/default-productivity-hero.svg',
  },
];

export default function BlogPage() {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'Resurgo Blog',
        description: 'Evidence-based insights on productivity, habit science, goal tracking, and personal development.',
        url: 'https://resurgo.life/blog',
        publisher: { '@type': 'Organization', name: 'Resurgo', url: 'https://resurgo.life' },
        blogPost: POSTS.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.desc,
          datePublished: post.date,
          url: `https://resurgo.life/blog/${post.slug}`,
          image: `https://resurgo.life${post.heroImage}`,
          author: { '@type': 'Organization', name: 'Resurgo' },
          keywords: post.tags.join(', '),
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Latest Articles',
        numberOfItems: POSTS.length,
        itemListElement: POSTS.map((post, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://resurgo.life/blog/${post.slug}`,
          name: post.title,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: BLOG</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Dispatches from the Grind</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              Evidence-based insights on productivity, habit science, and human performance. Simple ideas that actually work.
            </p>
          </div>
        </div>

        <div className="mb-8 border border-zinc-900 bg-zinc-950 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-orange-500">TOPICAL_CLUSTERS</p>
            <Link href="/blog/topics" className="font-mono text-xs text-zinc-400 hover:text-zinc-300">VIEW_ALL →</Link>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {BLOG_TOPIC_CLUSTERS.slice(0, 4).map((cluster) => (
              <Link
                key={cluster.slug}
                href={`/blog/topics/${cluster.slug}`}
                className="border border-zinc-800 bg-black/40 px-3 py-2 font-mono text-xs text-zinc-300 transition hover:border-zinc-700"
              >
                {cluster.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700 hover:bg-zinc-900">
              <Image
                src={post.heroImage}
                alt={post.title}
                width={1200}
                height={630}
                className="mb-4 h-40 w-full border border-zinc-800 object-cover"
                loading="lazy"
              />
              <div className="mb-3 flex items-center gap-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="font-mono text-xs tracking-widest text-orange-600 border border-orange-900/50 px-2 py-0.5">
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
              <h2 className="font-mono text-base font-bold text-zinc-100 leading-snug">{post.title}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-500 leading-relaxed">{post.desc}</p>
              <div className="mt-4 flex items-center gap-4 font-mono text-xs text-zinc-400">
                <span>{post.date}</span>
                <span>&middot;</span>
                <span>{post.readTime} read</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-center">
          <p className="font-mono text-xs text-zinc-400">
            Want to put these ideas into action?
          </p>
          <Link href="/sign-up"
            className="mt-3 inline-block border border-orange-900 bg-orange-950/30 px-6 py-2 font-mono text-xs font-bold tracking-widest text-orange-500 transition hover:bg-orange-950/50">
            [TRY_RESURGO_FREE]
          </Link>
        </div>
      </div>
    </main>
  );
}
