// ─────────────────────────────────────────────────────────────────────────────
// RESURGO.life — /pricing standalone page
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingPageBeacon from '@/components/marketing/MarketingPageBeacon';
import LandingChatWidget from '@/components/marketing/LandingChatWidget';
import EmailCapture from '@/components/marketing/EmailCapture';

export const metadata: Metadata = {
  title: 'Pricing — Resurgo Habit Tracker Plans | Free, Pro & Lifetime',
  description:
    'Compare Resurgo pricing plans. Start free with core habit tracking. Upgrade to Pro at $4.99/month for unlimited features, AI coaching, and analytics. Lifetime access for $49.99.',
  keywords: [
    'Resurgo pricing', 'habit tracker pricing', 'Resurgo Pro', 'Resurgo free plan',
    'AI habit tracker cost', 'Resurgo lifetime deal', 'habit tracker subscription',
    'productivity app pricing', 'Resurgo plans comparison',
  ],
  alternates: {
    canonical: '/pricing',
  },
  openGraph: {
    title: 'Pricing — Resurgo Habit Tracker | Free, Pro & Lifetime Plans',
    description: 'Start free. Upgrade to Pro at $4.99/month or get Lifetime access for $49.99. Compare all Resurgo plans.',
    type: 'website',
    url: '/pricing',
  },
};

const TIERS = [
  {
    tier: 'FREE',
    price: '$0',
    period: 'forever',
    highlight: false,
    badge: null,
    features: [
      '5 habit check-ins per day',
      'Up to 3 active goals',
      '10 AI coaching messages per day',
      'Core habit & task tracking',
      'Basic focus timer (Pomodoro)',
      'Community support',
    ],
    cta: 'Get Started Free',
    href: '/sign-up',
  },
  {
    tier: 'PRO',
    price: '$4.99',
    period: '/month',
    highlight: true,
    badge: 'MOST POPULAR',
    features: [
      'Unlimited habits, goals & tasks',
      'Full AI coaching – all 6 personas',
      'Advanced analytics & insights',
      'Business goal planner',
      'All focus timer modes',
      'Sleep, nutrition & mood tracking',
      'Telegram bot integration',
      'API access + webhooks',
      'Priority email support',
    ],
    cta: 'Start Pro',
    href: '/sign-up?plan=pro_monthly',
  },
  {
    tier: 'PRO YEARLY',
    price: '$29.99',
    period: '/year',
    highlight: false,
    badge: 'BEST VALUE — save 50%',
    features: [
      'Everything in Pro monthly',
      'Equivalent to ~$2.50/month',
      '50% savings vs monthly plan',
      'Annual receipt for expensing',
      'Cancel or downgrade anytime',
    ],
    cta: 'Save with Yearly',
    href: '/sign-up?plan=pro_yearly',
  },
  {
    tier: 'LIFETIME',
    price: '$49.99',
    period: 'one-time',
    highlight: false,
    badge: null,
    features: [
      'All Pro features, forever',
      'Every future feature included',
      'Pay once – never pay again',
      'Early-adopter founder badge',
      'Direct founder access for feedback',
    ],
    cta: 'Own It Forever',
    href: '/sign-up?plan=lifetime',
  },
];

const FAQ_PRICING = [
  {
    q: 'Can I start without a credit card?',
    a: 'Yes. The Free tier requires no card. You can upgrade any time from Settings → Billing.',
  },
  {
    q: 'What happens when I hit Free plan limits?',
    a: 'You will see a prompt to upgrade. Your existing data is never deleted — you just cannot add more until you upgrade or remove items.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes — 7-day money-back guarantee on all paid plans. Email support@resurgo.life within 7 days of your first charge for a full refund.',
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
    a: 'Resurgo accepts credit cards, debit cards, and other payment methods supported by our payment processor. All transactions are encrypted and secure.',
  },
  {
    q: 'Do Pro Yearly subscribers get the same features as monthly?',
    a: 'Yes. Pro Yearly and Pro Monthly include the exact same features. The yearly plan simply saves you 50% compared to paying monthly.',
  },
];

// JSON-LD Product + Offer structured data for rich snippets
const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      'name': 'Resurgo',
      'applicationCategory': 'ProductivityApplication',
      'operatingSystem': 'Web, iOS, Android',
      'offers': [
        {
          '@type': 'Offer',
          'name': 'Free Plan',
          'price': '0',
          'priceCurrency': 'USD',
          'description': 'Core habit tracking, 3 goals, focus timer, 10 AI messages/day',
        },
        {
          '@type': 'Offer',
          'name': 'Pro Monthly',
          'price': '4.99',
          'priceCurrency': 'USD',
          'priceValidUntil': '2026-12-31',
          'description': 'Unlimited habits, goals, AI coaching, analytics, API access',
        },
        {
          '@type': 'Offer',
          'name': 'Pro Yearly',
          'price': '29.99',
          'priceCurrency': 'USD',
          'priceValidUntil': '2026-12-31',
          'description': 'Everything in Pro billed yearly — save 50%',
        },
        {
          '@type': 'Offer',
          'name': 'Lifetime Access',
          'price': '49.99',
          'priceCurrency': 'USD',
          'description': 'All Pro features forever. One-time payment, no recurring fees.',
        },
      ],
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
              Simple, honest pricing for your habit tracker.
            </h1>
            <p className="mt-3 font-mono text-base text-zinc-400">
              Start free with core habit tracking. Upgrade to Pro for unlimited features, AI coaching, and analytics. No hidden fees.
            </p>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map(({ tier, price, period, highlight, badge, features, cta, href }) => (
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
                <Link
                  href={href}
                  className={`block w-full py-2.5 text-center font-mono text-xs font-bold tracking-widest transition ${
                    highlight
                      ? 'bg-orange-600 text-black hover:bg-orange-500'
                      : 'border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee banner */}
        <div className="mt-10 border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-center">
          <p className="font-mono text-sm font-bold text-zinc-200">7-day money-back guarantee</p>
          <p className="mt-1 font-mono text-xs text-zinc-500">
            Not happy? Email <span className="text-orange-400">support@resurgo.life</span> within 7
            days for a full refund — no questions asked.
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

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <section className="border border-zinc-900 bg-zinc-950 p-6">
            <h3 className="mb-4 font-mono text-sm font-bold tracking-widest text-zinc-200">
              Need help choosing?
            </h3>
            <LandingChatWidget />
          </section>

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
            Start building better habits today
          </h2>
          <p className="mt-2 font-mono text-sm text-zinc-400">
            Join thousands of people who set clear goals, build consistent habits, and track real progress.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-block border border-orange-700 bg-orange-600 px-10 py-3 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-orange-500"
          >
            [START_FREE_TODAY]
          </Link>
        </div>
      </div>
    </main>
  );
}
