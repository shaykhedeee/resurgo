import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Resurgo Habit Tracker | AI Coaching, Focus Timers, Wellness & More',
  description:
    'Explore all Resurgo features: AI goal decomposition, habit tracking with streaks, 6 AI coach personas, Pomodoro and Deep Work timers, mood and sleep tracking, budget planner, Telegram bot, REST API, and more.',
  keywords: [
    'Resurgo features', 'habit tracker features', 'AI goal decomposition',
    'habit stacking app', 'focus timer app', 'Pomodoro tracker',
    'AI coaching app', 'mood tracker', 'sleep tracker', 'budget planner',
    'Telegram habit bot', 'productivity app features', 'wellness tracker features',
  ],
  alternates: {
    canonical: '/features',
  },
  openGraph: {
    title: 'Features — Resurgo Habit Tracker',
    description: 'AI goal decomposition, habit tracking, focus timers, wellness monitoring, and more. See everything Resurgo offers.',
    type: 'website',
    url: '/features',
  },
};

const FEATURES = [
  {
    category: 'GOAL_SYSTEM',
    icon: '🎯',
    features: [
      { name: 'AI Goal Decomposition', desc: 'Enter a goal and AI creates milestones, weekly targets, and daily tasks automatically' },
      { name: 'Progress Visualization', desc: 'Real-time progress bars, completion percentages, and streak tracking' },
      { name: 'Goal Templates', desc: 'Start fast with pre-built templates for fitness, career, finance, learning, and more' },
      { name: 'Business Goal Engine', desc: 'Revenue targets, client goals, and launch plans with AI-generated task lists' },
    ],
  },
  {
    category: 'HABIT_BUILDER',
    icon: '🔁',
    features: [
      { name: 'Daily Habit Tracking', desc: 'Check off habits with one tap and build unbreakable consistency streaks' },
      { name: 'Habit Stacking', desc: 'Chain habits together using Atomic Habits principles for compound behavior change' },
      { name: 'Streak Analytics', desc: 'View your longest streaks, completion rates, and daily patterns at a glance' },
      { name: 'Smart Reminders', desc: 'Get notifications via app and Telegram bot at the right time for each habit' },
    ],
  },
  {
    category: 'AI_COACHING',
    icon: '🤖',
    features: [
      { name: '4 Action-Capable AI Coaches', desc: 'Nova (Systems Architect), Titan (Performance Engine), Sage (Wealth Architect), Phoenix (Resilience Forge) — each can create tasks, goals, habits & plans from chat' },
      { name: 'Context-Aware Intelligence', desc: 'Your coach knows your real goals, tasks, habits, and streaks — delivering hyper-personalized advice based on actual data' },
      { name: 'AI Plan Builder', desc: 'AI breaks any goal into phases, weekly actions, and daily steps you can follow immediately' },
      { name: 'Anti-Procrastination', desc: 'Daily intention setting, Two-Minute Rule prompts, and accountability check-ins' },
    ],
  },
  {
    category: 'FOCUS_ENGINE',
    icon: '⏱️',
    features: [
      { name: 'Multiple Timer Modes', desc: 'Pomodoro 25/5, Deep Work 90 min, Flowtime (flexible), and fully custom timers' },
      { name: 'Distraction Logging', desc: 'Track and categorize interruptions during sessions so you can eliminate them' },
      { name: 'Ambient Sounds', desc: 'Rain, Forest, Ocean, Campfire, White Noise, and Typing sounds to help you focus' },
      { name: 'Session History', desc: 'Full log of every focus session with minutes tracked, trends, and weekly stats' },
    ],
  },
  {
    category: 'HEALTH_SUITE',
    icon: '💚',
    features: [
      { name: 'Mood Tracking', desc: 'Log daily mood scores with tags, notes, and track emotional patterns over time' },
      { name: 'Journal', desc: 'Structured journaling with 4 types: daily reflection, gratitude, planning, and free-form' },
      { name: 'Sleep Monitor', desc: 'Log sleep and wake times, rate sleep quality, and spot patterns affecting your energy' },
      { name: 'Nutrition Tracker', desc: 'Log meals, hydration, macros, and daily steps to maintain a balanced lifestyle' },
    ],
  },
  {
    category: 'GAMIFICATION',
    icon: '🏆',
    features: [
      { name: 'XP and Leveling', desc: 'Earn experience points for completing habits, tasks, and milestones. Level up over time' },
      { name: 'Achievements', desc: 'Unlock badges for milestones like 7-day streaks, 30-day streaks, and completing goals' },
      { name: 'Weekly Reviews', desc: 'AI-generated weekly summaries with reflection prompts and performance insights' },
      { name: 'Leaderboard-Free', desc: 'No competitive leaderboards — your progress is measured against your own past, not others' },
    ],
  },
  {
    category: 'INTEGRATIONS',
    icon: '🔌',
    features: [
      { name: 'Telegram Bot', desc: 'Quick habit check-ins, reminders, and progress updates directly from Telegram' },
      { name: 'Webhooks', desc: 'Send real-time events to any URL when habits complete or goals are reached' },
      { name: 'REST API', desc: 'Full API access with key management and rate limiting for Pro users' },
      { name: 'Referral System', desc: 'Earn days of Pro access by inviting friends who join and complete onboarding' },
    ],
  },
];

const FEATURE_FAQS = [
  {
    q: 'How many habits can I track on the free plan?',
    a: 'The free plan allows 5 habit check-ins per day and up to 3 active goals. Upgrade to Pro for unlimited habits, goals, and tasks.',
  },
  {
    q: 'What makes Resurgo different from other habit trackers?',
    a: 'Resurgo combines AI goal decomposition, 6 AI coaching personas, focus timers, habit stacking, sleep and mood tracking, a budget planner, and gamification — all in one app. Most trackers only cover one or two of these areas.',
  },
  {
    q: 'Can I track business goals alongside personal habits?',
    a: 'Yes. The Business Goal Engine lets you set revenue targets, client goals, and launch plans with AI-generated task lists. All business and personal data lives in the same dashboard.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. Resurgo works in your browser. You can also install it as a Progressive Web App on iOS, Android, or desktop for faster access and offline support.',
  },
];

// JSON-LD ItemList + FAQPage structured data
const featuresJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      'name': 'Resurgo Features',
      'description': 'Complete list of Resurgo habit tracker features across goal setting, habit building, AI coaching, focus timers, wellness, gamification, and integrations.',
      'numberOfItems': FEATURES.reduce((acc, cat) => acc + cat.features.length, 0),
      'itemListElement': FEATURES.flatMap((cat, catIdx) =>
        cat.features.map((feat, featIdx) => ({
          '@type': 'ListItem',
          'position': catIdx * 4 + featIdx + 1,
          'name': feat.name,
          'description': feat.desc,
        }))
      ),
    },
    {
      '@type': 'FAQPage',
      'mainEntity': FEATURE_FAQS.map((faq) => ({
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a,
        },
      })),
    },
  ],
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* JSON-LD Features + FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(featuresJsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: FEATURES</span>
          </div>
          <div className="p-8 text-center">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              Every productivity tool you need.<br />
              <span className="text-orange-500">Nothing you don&apos;t.</span>
            </h1>
            <p className="mt-3 font-mono text-sm text-zinc-500">
              Goals, habits, focus, wellness, AI coaching, and analytics — all in one place.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {FEATURES.map(({ category, icon, features }) => (
            <div key={category} className="border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-3 border-b border-zinc-900 px-5 py-3">
                <span className="text-xl">{icon}</span>
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-200">{category}</span>
              </div>
              <div className="grid gap-px bg-zinc-900 md:grid-cols-2">
                {features.map(({ name, desc }) => (
                  <div key={name} className="bg-zinc-950 p-5 space-y-1">
                    <h3 className="font-mono text-sm font-bold text-zinc-200">{name}</h3>
                    <p className="font-mono text-xs text-zinc-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features FAQ */}
        <div className="mt-16 space-y-3">
          <h2 className="mb-6 font-mono text-lg font-bold tracking-widest text-zinc-200">
            FEATURE_FAQ
          </h2>
          {FEATURE_FAQS.map(({ q, a }, i) => (
            <details key={i} className="group border border-zinc-900 bg-zinc-950">
              <summary className="flex cursor-pointer select-none items-center justify-between px-5 py-4 font-mono text-sm font-bold text-zinc-200 hover:text-zinc-100">
                {q}
                <span className="ml-4 shrink-0 font-mono text-xs text-zinc-500 transition group-open:text-orange-600">
                  ▼
                </span>
              </summary>
              <div className="border-t border-zinc-900 px-5 py-4 font-mono text-sm leading-relaxed text-zinc-400">
                {a}
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 border border-orange-900/50 bg-orange-950/10 p-8 text-center">
          <h2 className="font-mono text-xl font-bold text-zinc-100">Start tracking your habits for free</h2>
          <p className="mt-2 font-mono text-sm text-zinc-400">No credit card needed. Set up in under 2 minutes.</p>
          <a href="/sign-up"
            className="mt-4 inline-block border border-orange-900 bg-orange-950/30 px-8 py-3 font-mono text-xs font-bold tracking-widest text-orange-500 transition hover:bg-orange-950/50">
            [START_FOR_FREE]
          </a>
        </div>
      </div>
    </main>
  );
}
