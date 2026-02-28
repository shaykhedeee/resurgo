import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Resurgo',
  description: 'Everything included in Resurgo: goal tracking, habit building, AI coaching, focus sessions, business planning, and more.',
};

const FEATURES = [
  {
    category: 'GOAL_SYSTEM',
    icon: '🎯',
    features: [
      { name: 'Smart Goal Creation', desc: 'Set goals with targets, deadlines, and auto-generated milestones' },
      { name: 'Progress Visualization', desc: 'Real-time progress bars, completion %, and streak tracking' },
      { name: 'Goal Templates', desc: 'Pre-built templates for fitness, career, finance, learning, and more' },
      { name: 'Business Goal Engine', desc: 'Revenue targets, client goals, launch plans with AI task generation' },
    ],
  },
  {
    category: 'HABIT_BUILDER',
    icon: '🔁',
    features: [
      { name: 'Daily Habit Tracking', desc: 'Check off habits with one tap and build unbreakable streaks' },
      { name: 'Habit Stacking', desc: 'Chain habits together for compound behavior building' },
      { name: 'Streak Analytics', desc: 'See your longest streaks, completion rates, and patterns' },
      { name: 'Reminders', desc: 'Smart notifications via app and Telegram bot' },
    ],
  },
  {
    category: 'AI_COACHING',
    icon: '🤖',
    features: [
      { name: '6 Coach Personas',  desc: 'Marcus (Stoic), Aurora (Flow), Titan (Discipline), Sage (Mindful), Phoenix (Recovery), Nova (Innovation)' },
      { name: 'Context Memory', desc: 'Your coach remembers your goals, challenges, and recent conversations' },
      { name: 'Plan Builder', desc: 'AI decomposes any goal into actionable phases and weekly tasks' },
      { name: 'Anti-Procrastination', desc: 'Daily intention setting and the 2-minute rule prompts' },
    ],
  },
  {
    category: 'FOCUS_ENGINE',
    icon: '⏱️',
    features: [
      { name: 'Multiple Timer Modes', desc: 'Pomodoro 25/5, Time Box 50/10, Deep Work 90min, Flowtime, Custom' },
      { name: 'Distraction Logging', desc: 'Track and categorize interruptions to eliminate them' },
      { name: 'Ambient Sounds', desc: 'Rain, Forest, Ocean, Campfire, White Noise, Typing sounds' },
      { name: 'Session History', desc: 'Full log of every focus session with stats and trends' },
    ],
  },
  {
    category: 'HEALTH_SUITE',
    icon: '💚',
    features: [
      { name: 'Mood Tracking', desc: 'Daily mood scores with tags and pattern analysis' },
      { name: 'Journal', desc: 'Structured journaling with 4 types: daily, gratitude, reflection, planning' },
      { name: 'Sleep Monitor', desc: 'Log sleep/wake times, quality scores, and identify patterns' },
      { name: 'Nutrition Tracker', desc: 'Log meals, track macros, hydration, and daily steps' },
    ],
  },
  {
    category: 'INTEGRATIONS',
    icon: '🔌',
    features: [
      { name: 'Telegram Bot', desc: 'Quick habit check-ins and updates directly from Telegram' },
      { name: 'Webhooks', desc: 'Send real-time events to any URL when habits complete, goals hit' },
      { name: 'REST API', desc: 'Full API access with key management and rate limiting (Pro)' },
      { name: 'Referral System', desc: 'Earn Pro time by inviting friends to join the platform' },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: FEATURES</span>
          </div>
          <div className="p-8 text-center">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              Every tool you need.<br />
              <span className="text-orange-500">Nothing you don&apos;t.</span>
            </h1>
            <p className="mt-3 font-mono text-sm text-zinc-500">
              Built for serious people building serious lives.
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

        <div className="mt-10 border border-orange-900/50 bg-orange-950/10 p-8 text-center">
          <h2 className="font-mono text-xl font-bold text-zinc-100">Ready to rise?</h2>
          <p className="mt-2 font-mono text-sm text-zinc-400">Start free. Upgrade when you&apos;re ready.</p>
          <a href="/sign-up"
            className="mt-4 inline-block border border-orange-900 bg-orange-950/30 px-8 py-3 font-mono text-xs font-bold tracking-widest text-orange-500 transition hover:bg-orange-950/50">
            [START_FOR_FREE]
          </a>
        </div>
      </div>
    </main>
  );
}
