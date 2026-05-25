'use client';

import { cn } from '@/lib/utils';

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
    name: 'Free Forever',
    price: '$0',
    period: '',
    description: 'Perfect for solo founders starting out',
    features: [
      'Up to 5 daily habits',
      'Up to 3 active goals',
      '10 AI messages/day',
      '2 AI Coaches (Marcus + Titan)',
      'Gamification & streaks',
      '3 vision board panels',
    ],
    ctaLabel: 'Start Free',
    ctaHref: '/sign-up',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Unlock the full power of AI-driven habit building',
    features: [
      'Unlimited habits & goals',
      'All 5 AI Coaches (incl. Founder & Growth Specialist)',
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
    period: 'one-time',
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
    <section className="w-full py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-2 text-center">
          <p className="font-pixel text-[0.55rem] tracking-widest text-orange-500">ACCESS_TIERS</p>
        </div>
        <h2 className="text-center font-pixel text-lg text-zinc-100 sm:text-xl mb-4">{heading}</h2>
        <p className="mx-auto mt-2 max-w-xl text-center font-terminal text-sm text-zinc-400 mb-10">
          Start free forever. Upgrade only when you&apos;re ready. No credit card required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {tiers.map((tier, i) => (
            <article
              key={i}
              className={cn(
                'flex flex-col p-5 sm:p-6 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] border-2 transition-all duration-200',
                tier.popular
                  ? 'border-orange-900 bg-orange-950/20 relative shadow-[4px_4px_0px_rgba(234,88,12,0.15)]'
                  : 'border-zinc-800 bg-black hover:border-zinc-700'
              )}
            >
              {tier.popular && (
                <p className="absolute top-0 left-4 -translate-y-1/2 border border-orange-500 bg-black px-2 py-0.5 font-pixel text-[0.55rem] tracking-widest text-orange-500 uppercase">
                  ★ MOST POPULAR
                </p>
              )}
              <h3 className="font-pixel text-[0.6rem] tracking-widest text-zinc-300 uppercase mb-2">{tier.name}</h3>
              <div className="mt-2 mb-2 flex items-baseline">
                <span className="font-pixel text-base text-zinc-100">{tier.price}</span>
                {tier.period && (
                  <span className="font-terminal text-sm text-zinc-500 ml-1 uppercase">{tier.period}</span>
                )}
              </div>
              <p className="font-terminal text-xs text-zinc-500 mb-6 leading-relaxed">{tier.description}</p>
              <ul className="mt-4 flex-1 space-y-2.5 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 font-terminal text-xs sm:text-sm leading-snug text-zinc-300">
                    <span className="mt-0.5 shrink-0 text-green-500 font-mono">&#10003;</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref}
                className={cn(
                  'block w-full text-center py-2.5 font-pixel text-[0.6rem] tracking-widest uppercase border-2 transition-all duration-150',
                  tier.popular
                    ? 'border-orange-600 bg-orange-600 text-black font-bold hover:bg-orange-500 hover:border-orange-500'
                    : 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                )}
              >
                {tier.ctaLabel}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
