// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO.life — Billing Plans
// Central pricing + feature matrix used by billing and pricing surfaces.
// Pricing: $4.99/mo | $29.99/yr | $49.99 lifetime (raise lifetime to $99 after 100 users)
// ═══════════════════════════════════════════════════════════════════════════════

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
// - Free forever plan with 3-goal / 5-dump-per-day / 10-AI-message-per-day limits
// - Pro Monthly $4.99/mo — accessible pricing to undercut $12-$25 competitors
// - Pro Annual  $29.99/yr ($2.50/mo effective) — 50% discount drives conversions
// - Lifetime    $49.99 one-time — raise to $99 after first 100 users
// Target: ADHD users, developers, productivity-seekers priced-out of $20+/mo apps
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
      '5 brain dumps per day',
      '10 AI coach messages per day',
      'Basic habit tracking',
      'Telegram notifications (basic)',
      'Emergency Mode (always free)',
      'Community support',
    ],
  },
  {
    key: 'pro_monthly',
    title: 'Pro',
    badge: 'Most Flexible',
    description: 'Unlimited everything. All 6 AI coaches. Full Telegram power.',
    cadence: 'monthly',
    priceUsd: 4.99,
    yearlyEquivalentUsd: 59.88,
    ctaLabel: 'Start Pro Monthly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_DODO_CHECKOUT_PRO_MONTHLY',
    featureBullets: [
      'Unlimited goals & habits',
      'Unlimited brain dumps',
      'Unlimited AI coach messages',
      'All 6 AI coach personas',
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
    key: 'pro_yearly',
    title: 'Pro Yearly',
    badge: 'Best Value — Save 50%',
    description: 'Same Pro power, billed yearly at $2.50/mo effective.',
    cadence: 'yearly',
    priceUsd: 29.99,
    yearlyEquivalentUsd: 29.99,
    highlighted: true,
    ctaLabel: 'Start Pro Yearly',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_DODO_CHECKOUT_PRO_YEARLY',
    featureBullets: [
      'Everything in Pro Monthly',
      '$2.50/mo effective (vs $4.99 monthly)',
      'Priority roadmap voting',
      'Early access to new features',
    ],
  },
  {
    key: 'lifetime',
    title: 'Lifetime',
    badge: 'Founder Deal',
    description: 'Pay once. Use forever. Price goes up after 100 users.',
    cadence: 'lifetime',
    priceUsd: 49.99,
    yearlyEquivalentUsd: 49.99,
    ctaLabel: 'Get Lifetime Access',
    clerkCheckoutUrlEnv: 'NEXT_PUBLIC_DODO_CHECKOUT_LIFETIME',
    featureBullets: [
      'Everything in Pro — forever',
      'No recurring charges, ever',
      'Lifetime updates included',
      'Founder badge',
      'Direct founder access',
      'Price increases to $99 after 100 users',
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
