import type { Metadata } from 'next';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';

import EmailCapture from '@/components/marketing/EmailCapture';
import { BILLING_PLANS } from '@/lib/billing/plans';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'Pricing - Resurgo AI Productivity Assistant Plans',
  description:
    'Compare Resurgo pricing plans for your AI command center. Start free, upgrade for unlimited AI coaching and execution tools, or lock in the founder lifetime deal.',
  keywords: [
    'Resurgo pricing', 'AI productivity assistant pricing', 'Resurgo Pro', 'Resurgo free plan',
    'goal planner pricing', 'lifetime productivity app deal', 'AI planner subscription',
    'productivity app pricing', 'Resurgo plans comparison',
  ],
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing - Resurgo | Free, Pro, Yearly, and Lifetime',
    description: 'Start free. Upgrade for unlimited AI planning, coaching, dashboards, and premium workflows.',
    type: 'website',
    url: '/pricing',
  },
};

const FAQ_PRICING = [
  {
    q: 'Can I start without a credit card?',
    a: 'Yes. The Free tier requires no card. You can upgrade any time from Settings > Billing.',
  },
  {
    q: 'What happens when I hit Free plan limits?',
    a: 'You will see an upgrade prompt, but nothing is deleted. Upgrade or trim back usage and your workspace stays intact.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes. Pro subscriptions have a 14-day money-back guarantee, and Lifetime purchases have a 30-day guarantee. Email support@resurgo.life for help.',
  },
  {
    q: 'Can I switch between plans?',
    a: 'Yes. Upgrade or downgrade at any time. Changes take effect at the end of your current billing period. No data is lost.',
  },
  {
    q: 'Is the Lifetime deal a limited offer?',
    a: 'Yes. Lifetime pricing will increase as the platform grows. The current $49.99 is the early-adopter rate and includes all future features forever.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Resurgo accepts the payment methods supported by our checkout provider, including major credit and debit cards. Transactions are encrypted and secure.',
  },
  {
    q: 'Do Pro Yearly subscribers get the same features as monthly?',
    a: 'Yes. Pro Yearly and Pro Monthly unlock the same product. Yearly just gives you the lower effective monthly rate.',
  },
];

const tierHrefFallbacks = {
  free: '/sign-up',
  pro_monthly: '/sign-up?plan=pro_monthly',
  pro_yearly: '/sign-up?plan=pro_yearly',
  lifetime: '/sign-up?plan=lifetime',
} as const;

// JSON-LD Product + Offer structured data for rich snippets
const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      'name': 'Resurgo',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web, iOS, Android',
      'offers': BILLING_PLANS.map((plan) => ({
        '@type': 'Offer',
        'name': plan.title,
        'price': String(plan.priceUsd),
        'priceCurrency': 'USD',
        ...(plan.priceUsd > 0 ? { priceValidUntil: '2026-12-31' } : {}),
        'description': plan.description,
      })),
    },
    {
      '@type': 'FAQPage',
      'mainEntity': FAQ_PRICING.map((faq) => ({
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

export default function PricingPage() {
  const tiers = BILLING_PLANS.map((plan) => {
    const envHref = plan.clerkCheckoutUrlEnv
      ? process.env[plan.clerkCheckoutUrlEnv as keyof NodeJS.ProcessEnv]
      : undefined;

    return {
      tier: plan.title.toUpperCase(),
      price: plan.priceUsd === 0 ? '$0' : `$${plan.priceUsd.toFixed(2)}`,
      period:
        plan.key === 'free'
          ? 'forever'
          : plan.cadence === 'monthly'
            ? '/month'
            : plan.cadence === 'yearly'
              ? '/year'
              : 'one-time',
      highlight: Boolean(plan.highlighted),
      badge: plan.badge ?? null,
      summary: plan.description,
      features: plan.featureBullets,
      cta: plan.ctaLabel,
      href: envHref || tierHrefFallbacks[plan.key],
    };
  });

  return (
    <main className="min-h-screen bg-black">
      <MarketingPageBeacon
        event="pricing_viewed"
        properties={{ placement: 'pricing_page' }}
      />

      {/* JSON-LD Pricing + FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-14 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">
              RESURGO :: PRICING
            </span>
          </div>
          <div className="p-10 text-center">
            <h1 className="font-mono text-4xl font-bold tracking-tight text-zinc-100">
              Simple pricing for your AI execution system.
            </h1>
            <p className="mt-3 font-mono text-base text-zinc-400">
              Start free, prove the workflow, then upgrade only when you want unlimited AI coaching, premium dashboards, and full automation.
            </p>
            <p className="mt-4 font-mono text-xs tracking-widest text-zinc-500">
              FREE FOREVER · NO CREDIT CARD · FOUNDER PRICING LIVE NOW
            </p>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map(({ tier, price, period, highlight, badge, summary, features, cta, href }) => (
            <div
              key={tier}
              className={`flex flex-col border bg-zinc-950 ${
                highlight
                  ? 'border-orange-600 shadow-[0_0_24px_-4px_rgba(234,88,12,0.30)]'
                  : 'border-zinc-900'
              }`}
            >
              {/* Tier header */}
              <div
                className={`border-b px-5 py-4 ${
                  highlight ? 'border-orange-900/60 bg-orange-950/20' : 'border-zinc-900'
                }`}
              >
                {badge && (
                  <p className="mb-1 font-mono text-xs font-bold tracking-widest text-orange-500">
                    {badge}
                  </p>
                )}
                <p className="font-mono text-xs font-bold tracking-widest text-zinc-400">{tier}</p>
                <div className="mt-2 flex items-baseline gap-1">
                  <span
                    className={`font-mono text-3xl font-bold ${
                      highlight ? 'text-orange-500' : 'text-zinc-100'
                    }`}
                  >
                    {price}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">{period}</span>
                </div>
                <p className="mt-3 font-mono text-xs leading-relaxed text-zinc-500">{summary}</p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-2 p-5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-mono text-xs text-zinc-400">
                    <span className="mt-0.5 shrink-0 text-orange-600">▸</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="p-4">
                <TermLinkButton
                  href={href}
                  variant={highlight ? 'primary' : 'secondary'}
                  size="md"
                  fullWidth
                >
                  {cta}
                </TermLinkButton>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee banner */}
        <div className="mt-10 border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-center">
          <p className="font-mono text-sm font-bold text-zinc-200">14-day Pro guarantee · 30-day Lifetime guarantee</p>
          <p className="mt-1 font-mono text-xs text-zinc-500">
            If it is not a fit, email <span className="text-orange-400">support@resurgo.life</span> and we will sort it out fast.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 space-y-3">
          <h2 className="mb-6 font-mono text-lg font-bold tracking-widest text-zinc-200">
            BILLING_FAQ
          </h2>
          {FAQ_PRICING.map(({ q, a }, i) => (
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

        <div className="mt-12">
          <section className="border border-zinc-900 bg-zinc-950 p-6">
            <h3 className="mb-4 font-mono text-sm font-bold tracking-widest text-zinc-200">
              Get pricing updates
            </h3>
            <EmailCapture
              variant="inline"
              source="pricing_page"
              offer="Pricing updates"
            />
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 border border-orange-900/40 bg-orange-950/10 p-10 text-center">
          <h2 className="font-mono text-2xl font-bold text-zinc-100">
            Start running your days with less chaos
          </h2>
          <p className="mt-2 font-mono text-sm text-zinc-400">
            Capture the mess, turn it into a plan, and keep execution moving from one dashboard.
          </p>
          <TermLinkButton href="/sign-up" variant="primary" size="lg" className="mt-6">
            [START_FREE_TODAY]
          </TermLinkButton>
        </div>
      </div>
    </main>
  );
}
