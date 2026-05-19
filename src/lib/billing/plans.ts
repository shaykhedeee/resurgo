// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO.life — Billing Plans
// Central pricing + feature matrix used by billing and pricing surfaces.
// Pricing: Free | Pro Monthly $9.99/mo | Pro Yearly $7.99/mo ($95.88/yr) | Lifetime $89 (first 100 relaunch signups, then $199)
// ═══════════════════════════════════════════════════════════════════════════════

import {
  CANONICAL_COACH_NAMES,
  FOUNDING_LIFETIME_COPY,
  FOUNDING_LIFETIME_END_DATE,
  FOUNDING_LIFETIME_PRICE_USD,
  FOUNDING_LIFETIME_REGULAR_PRICE_USD,
} from '@/lib/product-config';

export type BillingCadence = 'monthly' | 'yearly' | 'lifetime';
export type BillingPlanKey = 'free' | 'pro_monthly' | 'pro_yearly' | 'lifetime';

export interface BillingPlan {
  key: BillingPlanKey;
  title: string;
  badge?: string;
  description: string;
  cadence: BillingCadence;
  priceUsd: number;
  yearlyEquivalentUsd?: number;
  highlighted?: boolean;
  ctaLabel: string;
  clerkCheckoutUrlEnv?: string;
  featureBullets: string[];
}

// Pricing strategy (2026):
// - Free forever plan with 3 goals, 5 habit check-ins/day, and 10 AI messages/day
// - Pro Monthly $9.99/mo — full access to all features
// - Pro Annual  $95.88/yr ($7.99/mo effective) - 20% discount for annual commitment
// - Lifetime    $89 one-time - first 100 relaunch signups. After that: $199
// Target: ADHD users, developers, productivity-seekers
export const BILLING_PLANS: BillingPlan[] = [
  {
    key: 'free',
    title: 'Free',
    description: 'Start getting organized. No credit card. No BS.',
    cadence: 'monthly',
    priceUsd: 0,
    ctaLabel: 'Get Started Free',
    featureBullets: [
      'Up to 3 active goals',
      '5 habit check-ins per day',
      '10 AI coach messages per day',
      '2 AI coaches (Marcus & Titan)',
      'Telegram notifications (basic)',
      'Emergency Mode (always free)',
      'Community support',
    ],
  },
  {
    key: 'pro_yearly',
    title: 'Pro Yearly',
    badge: 'Save 20% — Billed Annually',
    description: 'All Pro features, billed annually at $7.99/mo effective.',
    cadence: 'yearly',
    priceUsd: 95.88,
    yearlyEquivalentUsd: 7.99,
    highlighted: true,
    ctaLabel: 'Start Pro Yearly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_DODO_CHECKOUT_PRO_YEARLY',
    featureBullets: [
      'Everything in Pro Monthly',
      '=$7.99/mo (save $24 vs monthly)',
      'All 5 AI coaches unlocked',
      'Priority roadmap voting',
      'Early access to new features',
    ],
  },
  {
    key: 'pro_monthly',
    title: 'Pro',
    badge: 'Most Flexible',
    description: 'Unlimited everything. All 5 AI coaches. Full Telegram power.',
    cadence: 'monthly',
    priceUsd: 9.99,
    yearlyEquivalentUsd: 119.88,
    ctaLabel: 'Start Pro Monthly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_DODO_CHECKOUT_PRO_MONTHLY',
    featureBullets: [
      'Unlimited goals & habits',
      'Unlimited habit check-ins',
      'Unlimited AI coach messages',
      `All 5 AI coaches (${CANONICAL_COACH_NAMES})`,
      'Advanced analytics & patterns',
      'Budget & wellness tracking',
      'Weekly AI review (auto-generated)',
      'Full Telegram integration',
      'Vision Board Studio (AI + hybrid uploads)',
      'Premium style presets (Pinterest, cinematic, editorial)',
      'Data export (CSV)',
      'Priority support',
    ],
  },
  {
    key: 'lifetime',
    title: 'Lifetime',
    badge: 'Founder Deal - first 100',
    description: `${FOUNDING_LIFETIME_COPY}. Pay once for full lifetime access to all Pro features.`,
    cadence: 'lifetime',
    priceUsd: FOUNDING_LIFETIME_PRICE_USD,
    yearlyEquivalentUsd: FOUNDING_LIFETIME_PRICE_USD,
    highlighted: true,
    ctaLabel: 'Lock In Founding Lifetime Price',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_DODO_CHECKOUT_LIFETIME',
    featureBullets: [
      'Everything in Pro — forever',
      'All 5 AI coaches unlocked',
      'No recurring charges, ever',
      'Lifetime updates included',
      'Founder badge + direct founder access',
      `Founding price: $${FOUNDING_LIFETIME_PRICE_USD} one-time (${FOUNDING_LIFETIME_COPY.toLowerCase()}; price increases to $${FOUNDING_LIFETIME_REGULAR_PRICE_USD} after ${FOUNDING_LIFETIME_END_DATE})`,
    ],
  },
];

export function mapClerkPlanToUserPlan(planIdentifier: string | null | undefined): 'free' | 'pro' | 'lifetime' {
  if (!planIdentifier) return 'free';
  const normalized = planIdentifier.toLowerCase();
  if (normalized.includes('lifetime')) return 'lifetime';
  if (normalized.includes('pro') || normalized.includes('premium') || normalized.includes('yearly') || normalized.includes('monthly')) return 'pro';
  return 'free';
}
