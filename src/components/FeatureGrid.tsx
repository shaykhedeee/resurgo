'use client';

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureGridProps {
  features?: FeatureItem[];
  title?: string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    icon: '🎯',
    title: 'AI Goal Decomposition',
    description: 'Break down big goals into actionable daily tasks using Atomic Habits principles',
  },
  {
    icon: '⚡',
    title: 'Habit Stacking',
    description: 'Link new habits to existing routines for faster adoption and better retention',
  },
  {
    icon: '🏆',
    title: 'Gamified Progress',
    description: 'Earn XP, level up, and unlock achievements as you build consistent habits',
  },
  {
    icon: '📊',
    title: 'Smart Analytics',
    description: 'AI-powered insights that show patterns and predict your success trajectory',
  },
  {
    icon: '🧠',
    title: 'AI Coaching',
    description: "Personalized coaching powered by James Clear's Atomic Habits framework",
  },
  {
    icon: '🔗',
    title: 'Identity System',
    description: 'Build habits around who you want to become, not just what you want to achieve',
  },
];

export function FeatureGrid({
  features = DEFAULT_FEATURES,
  title = 'Everything you need to build lasting habits',
}: FeatureGridProps) {
  return (
    <section className="w-full py-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">{title}</h2>
        <p className="text-lg text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Science-backed tools that help you build habits that stick — without relying on willpower alone.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
