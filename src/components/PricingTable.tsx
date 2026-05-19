'use client';

import { Check, Zap } from 'lucide-react';

interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  popular?: boolean;
}

interface PricingTableProps {
  tiers?: PricingTier[];
  heading?: string;
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started with habit tracking',
    features: [
      'Up to 5 daily habits',
      'Up to 3 active goals',
      '10 AI messages/day',
      '2 AI Coaches (Marcus + Titan)',
      'Gamification & streaks',
      '3 vision board panels',
    ],
    ctaLabel: 'Start Free',
    ctaHref: '/quick-start',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Unlock the full power of AI-driven habit building',
    features: [
      'Unlimited habits & goals',
      'All 5 AI Coaches',
      'Unlimited AI messages',
      'Advanced analytics & insights',
      'Unlimited vision boards',
      'Full AI goal decomposition',
      'All integrations',
      'Priority support',
    ],
    ctaLabel: 'Go Pro →',
    ctaHref: '/pricing',
    popular: true,
  },
  {
    name: 'Lifetime',
    price: '$89',
    period: '/once',
    description: 'Founding member pricing — unlimited lifetime access',
    features: [
      'Everything in Pro, forever',
      'Early access to new features',
      'Founding member badge',
      'No recurring billing ever',
      'Priority support forever',
      'Future updates included',
    ],
    ctaLabel: 'Get Lifetime',
    ctaHref: '/pricing',
  },
];

export function PricingTable({
  tiers = DEFAULT_TIERS,
  heading = 'Choose Your Plan',
}: PricingTableProps) {
  return (
    <section className="w-full py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">{heading}</h2>
        <p className="text-lg text-zinc-400 text-center mb-12 max-w-xl mx-auto">
          Start free and upgrade when you are ready. No credit card required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-8 ${
                tier.popular
                  ? 'border-orange-500 bg-gradient-to-b from-orange-600/10 to-transparent relative'
                  : 'border-zinc-800 bg-zinc-900/50'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-xs text-white font-medium">
                    <Zap className="w-3 h-3" /> Most Popular
                  </div>
                </div>
              )}
              <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
              <div className="mb-2">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-zinc-500">{tier.period}</span>}
              </div>
              <p className="text-sm text-zinc-400 mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-zinc-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref}
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                  tier.popular
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'border border-zinc-700 text-white hover:bg-white/5'
                }`}
              >
                {tier.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
