import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — Resurgo Product Updates, New Features & Improvements',
  description: 'See every update to Resurgo — new features, improvements, and bug fixes. From v1.0 launch to v1.4 with AI coaching, business goals, referral system, and more.',
  keywords: [
    'Resurgo changelog', 'Resurgo updates', 'product updates', 'new features',
    'Resurgo version history', 'habit tracker updates', 'release notes',
  ],
  openGraph: {
    title: 'Resurgo Changelog — Product Updates & Release Notes',
    description: 'Every update, improvement, and fix — all logged. See what is new in Resurgo.',
    type: 'website',
    url: 'https://resurgo.life/changelog',
  },
  alternates: { canonical: 'https://resurgo.life/changelog' },
};

const RELEASES = [
  {
    version: '1.4.0',
    date: 'Feb 2026',
    type: 'MAJOR',
    changes: [
      { type: 'NEW', text: 'Business Goal Engine with AI task generation' },
      { type: 'NEW', text: 'AI Plan Builder with coach-guided goal decomposition' },
      { type: 'NEW', text: 'Integrations Hub: Webhooks + API Keys management' },
      { type: 'NEW', text: 'Ambient Sounds Player integrated into focus sessions' },
      { type: 'NEW', text: 'Referral system with pro reward milestones' },
    ],
  },
  {
    version: '1.3.0',
    date: 'Feb 2026',
    type: 'MAJOR',
    changes: [
      { type: 'NEW', text: 'Health Suite: Mood tracking, Journal, Sleep, Nutrition' },
      { type: 'NEW', text: 'Budget Tracker with category management and financial goals' },
      { type: 'NEW', text: '5 Action-Capable AI Coaches: Marcus, Aurora, Titan, Phoenix, Nexus — can create tasks, goals, habits & plans from chat' },
      { type: 'IMPROVED', text: 'Focus session distraction logging with analysis' },
    ],
  },
  {
    version: '1.2.0',
    date: 'Jan 2026',
    type: 'MINOR',
    changes: [
      { type: 'NEW', text: 'Telegram bot integration for on-the-go habit check-ins' },
      { type: 'NEW', text: 'Weekly review flow with reflection prompts' },
      { type: 'IMPROVED', text: 'Goal progress visualization with streak tracking' },
      { type: 'FIX', text: 'Fixed gamification XP calculation edge cases' },
    ],
  },
  {
    version: '1.1.0',
    date: 'Jan 2026',
    type: 'MINOR',
    changes: [
      { type: 'NEW', text: 'Habit stacking — chain habits together' },
      { type: 'NEW', text: 'Focus flow timer with Pomodoro, Deep Work, Flowtime modes' },
      { type: 'NEW', text: 'Gamification system: XP, levels, achievements' },
      { type: 'IMPROVED', text: 'Onboarding flow with goal-setting wizard' },
    ],
  },
  {
    version: '1.0.0',
    date: 'Dec 2025',
    type: 'LAUNCH',
    changes: [
      { type: 'NEW', text: 'Initial launch of Resurgo' },
      { type: 'NEW', text: 'Goal tracking with milestone management' },
      { type: 'NEW', text: 'Habit tracking with daily streaks' },
      { type: 'NEW', text: 'Task management with priority levels' },
      { type: 'NEW', text: 'Terminal-style dark UI' },
    ],
  },
];

const typeColors: Record<string, string> = {
  NEW: 'text-green-400 border-green-900 bg-green-950/20',
  IMPROVED: 'text-blue-400 border-blue-900 bg-blue-950/20',
  FIX: 'text-yellow-400 border-yellow-900 bg-yellow-950/20',
  BREAKING: 'text-red-400 border-red-900 bg-red-950/20',
};

const releaseTypeColor: Record<string, string> = {
  MAJOR: 'text-orange-400 border-orange-900',
  MINOR: 'text-blue-400 border-blue-900',
  PATCH: 'text-zinc-400 border-zinc-800',
  LAUNCH: 'text-green-400 border-green-900',
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: CHANGELOG</span>
          </div>
          <div className="p-6">
            <h1 className="font-mono text-2xl font-bold text-zinc-100">Product Changelog</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">Every update, improvement, and fix — all logged.</p>
          </div>
        </div>

        <div className="space-y-6">
          {RELEASES.map((release) => (
            <div key={release.version} className="border border-zinc-900 bg-zinc-950">
              <div className="flex items-center justify-between border-b border-zinc-900 px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-lg font-bold text-zinc-100">v{release.version}</span>
                  <span className={`border px-2 py-0.5 font-mono text-xs tracking-widest ${releaseTypeColor[release.type] || 'text-zinc-500 border-zinc-800'}`}>
                    {release.type}
                  </span>
                </div>
                <span className="font-mono text-xs text-zinc-400">{release.date}</span>
              </div>
              <ul className="divide-y divide-zinc-900/50">
                {release.changes.map((change, i) => (
                  <li key={i} className="flex items-center gap-3 px-5 py-3">
                    <span className={`shrink-0 border px-1.5 py-0.5 font-mono text-xs tracking-widest ${typeColors[change.type] || 'text-zinc-400 border-zinc-800'}`}>
                      {change.type}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">{change.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
