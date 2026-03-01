import { Metadata } from 'next';
import { Fragment } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { BILLING_PLANS } from '@/lib/billing/plans';
import {
  Check,
  X,
  Shield,
  Zap,
  Crown,
  Star,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  Download,
  Headphones,
  Palette,
  Timer,
  Heart,
  Calendar,
  Mountain,
  Users,
} from 'lucide-react';

const BillingCheckoutCTA = dynamic(
  () => import('@/components/BillingCTA').then((m) => m.BillingCheckoutCTA),
  { ssr: false }
);
const BillingPortalCTA = dynamic(
  () => import('@/components/BillingCTA').then((m) => m.BillingPortalCTA),
  { ssr: false }
);

export const metadata: Metadata = {
  title: 'Pricing & Billing — Plans That Grow With You',
  description:
    'Choose the perfect Resurgo plan. Free with 10 habits & AI insights, or go Pro for unlimited everything. 30-day money-back guarantee.',
  robots: { index: false, follow: false },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Comprehensive Feature Comparison Matrix
// ═══════════════════════════════════════════════════════════════════════════════
const COMPARISON_SECTIONS = [
  {
    category: 'Core Tracking',
    features: [
      { name: 'Active habits', free: '10', pro: 'Unlimited', icon: Sparkles },
      { name: 'Active goals', free: '3', pro: 'Unlimited', icon: Target },
      { name: 'Daily task management', free: true, pro: true, icon: Check },
      { name: 'Streak tracking & reminders', free: true, pro: true, icon: Zap },
      { name: 'Calendar view', free: true, pro: true, icon: Calendar },
      { name: 'Focus timer', free: 'Basic', pro: 'Advanced', icon: Timer },
      { name: 'Mood & wellness tracking', free: true, pro: true, icon: Heart },
    ],
  },
  {
    category: 'AI & Intelligence',
    features: [
      { name: 'AI-powered insights', free: true, pro: true, icon: Sparkles },
      { name: 'AI goal decomposition', free: false, pro: true, icon: Target },
      { name: 'Adaptive AI coaching', free: false, pro: true, icon: TrendingUp },
      { name: 'Smart nudges & suggestions', free: false, pro: true, icon: Zap },
      { name: 'Weekly AI review wizard', free: false, pro: true, icon: BarChart3 },
    ],
  },
  {
    category: 'Analytics & Insights',
    features: [
      { name: 'Analytics history', free: '7 days', pro: 'Unlimited', icon: BarChart3 },
      { name: 'Contribution heatmap', free: false, pro: true, icon: TrendingUp },
      { name: 'Long-range trend analysis', free: false, pro: true, icon: TrendingUp },
      { name: 'Performance reports', free: false, pro: true, icon: BarChart3 },
    ],
  },
  {
    category: 'Advanced Features',
    features: [
      { name: 'Habit stacking builder', free: false, pro: true, icon: Layers },
      { name: 'Identity-based habit system', free: false, pro: true, icon: Crown },
      { name: 'Custom habit templates', free: false, pro: true, icon: Palette },
      { name: 'Deep onboarding flow', free: false, pro: true, icon: Users },
    ],
  },
  {
    category: 'Data & Support',
    features: [
      { name: 'Data export', free: false, pro: 'CSV & PDF', icon: Download },
      { name: 'Priority email support', free: false, pro: true, icon: Headphones },
      { name: 'Priority roadmap voting', free: false, pro: 'Yearly+', icon: Star },
      { name: 'Founder badge & community', free: false, pro: 'Lifetime', icon: Crown },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ Data
// ═══════════════════════════════════════════════════════════════════════════════
const FAQS = [
  {
    q: 'Can I use Resurgo for free?',
    a: 'Absolutely! The free plan includes 10 habits, 3 goals, AI insights, streak tracking, calendar view, focus timer, and mood tracking. No credit card required, no time limit.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards (Visa, Mastercard, Amex) via Dodo Payments — our Merchant of Record. Dodo handles all taxes, VAT, and compliance automatically. All transactions are encrypted and PCI-compliant.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. You can upgrade, downgrade, or cancel anytime from your billing portal. Upgrades take effect immediately, and downgrades apply at the end of your current billing period.',
  },
  {
    q: 'What happens when I cancel?',
    a: "You keep Pro access until the end of your paid period. After that, you're moved to the Free plan with all your data intact — nothing is deleted. You can re-subscribe anytime.",
  },
  {
    q: 'Is the lifetime plan really forever?',
    a: "Yes. One payment, permanent access to every Pro feature including all future updates. This is limited-time founder pricing that will increase as we grow.",
  },
  {
    q: 'Do you offer a money-back guarantee?',
    a: "Yes! All paid plans come with a 30-day money-back guarantee. If Resurgo isn't right for you, contact support for a full refund — no questions asked.",
  },
  {
    q: 'Do you offer student or team discounts?',
    a: 'Yes! Students get 50% off Pro plans. Contact support@resurgo.life with your .edu email. Team pricing is coming soon.',
  },
  {
    q: 'Is my data secure?',
    a: 'Your data is encrypted in transit and at rest. We use Clerk for authentication (SOC 2 Type II certified) and Convex for our database (enterprise-grade security). We never sell your data.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// Helper: render comparison cell value
// ═══════════════════════════════════════════════════════════════════════════════
function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-[var(--text-muted)]/40 mx-auto" />;
  return <span className="text-sm font-medium">{value}</span>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Page Component
// ═══════════════════════════════════════════════════════════════════════════════
export default async function BillingPage() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const manageUrl = process.env.NEXT_PUBLIC_DODO_CUSTOMER_PORTAL_URL || '';

  const plans = BILLING_PLANS.map((plan) => {
    const checkoutUrl = plan.clerkCheckoutUrlEnv
      ? process.env[plan.clerkCheckoutUrlEnv]
      : null;
    return { ...plan, checkoutUrl };
  });

  const RestoreArchivedCTA = dynamic(() => import('@/components/RestoreArchivedCTA'), { ssr: false });

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      {/* ═══════════════════════ HEADER ═══════════════════════ */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ascend-500 to-ascend-600 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block">RESURGO</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-[var(--text-muted)] hidden sm:block">
                  {user.emailAddresses?.[0]?.emailAddress}
                </span>
                <Link
                  href="/dashboard"
                  className="text-sm px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] font-medium"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="text-sm px-4 py-2 rounded-xl bg-gradient-to-r from-ascend-500 to-ascend-600 text-white font-semibold"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* ═══════════════════════ HERO ═══════════════════════ */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-ascend-500/10 blur-3xl" />
            <div className="absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-gold-400/8 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ascend-500/10 border border-ascend-500/20 text-sm text-ascend-400 font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Limited-time founder pricing
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Plans that grow{' '}
              <span className="bg-gradient-to-r from-ascend-400 to-gold-400 bg-clip-text text-transparent">
                with you
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-6">
              Start free with 10 habits, 3 goals, and AI insights. Upgrade when you&apos;re ready
              for unlimited power.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                30-day money-back guarantee
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                No credit card for free plan
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ PLAN CARDS ═══════════════════════ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
          {/* Subscription management bar (signed-in users) */}
          {user && (
            <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Your subscription
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Manage billing, payment methods, invoices, and cancellations.
                </p>
              </div>
              {manageUrl ? (
                <div className="flex items-center gap-4">
                  <BillingPortalCTA />
                  {/* Client-side restore CTA; dynamic import to keep page server-rendered */}
                  <RestoreArchivedCTA />
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <BillingPortalCTA />
                  <RestoreArchivedCTA />
                </div>
              )}
            </div>
          )}

          {/* Plan Cards Grid */}
          <div className="grid gap-6 lg:grid-cols-4">
            {plans.map((plan) => {
              const isFree = plan.key === 'free';
              const isHighlighted = plan.highlighted;
              const isLifetime = plan.key === 'lifetime';

              return (
                <article
                  key={plan.key}
                  className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                    isHighlighted
                      ? 'border-ascend-500 bg-gradient-to-b from-ascend-500/5 to-transparent shadow-xl shadow-ascend-500/10 ring-1 ring-ascend-500/30 lg:scale-[1.03]'
                      : 'border-[var(--border)] bg-[var(--surface)]'
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                        isHighlighted
                          ? 'bg-gradient-to-r from-ascend-500 to-gold-400 text-white'
                          : isLifetime
                          ? 'bg-gradient-to-r from-gold-400 to-orange-500 text-white'
                          : 'bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]'
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Title */}
                  <h2 className="text-xl font-bold mt-2 mb-1">{plan.title}</h2>
                  <p className="text-sm text-[var(--text-muted)] mb-5 min-h-[40px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">${plan.priceUsd}</span>
                      {plan.cadence === 'monthly' && plan.priceUsd > 0 && (
                        <span className="text-sm text-[var(--text-muted)]">/mo</span>
                      )}
                      {plan.cadence === 'yearly' && (
                        <span className="text-sm text-[var(--text-muted)]">/yr</span>
                      )}
                    </div>
                    {plan.key === 'pro_yearly' && (
                      <p className="text-xs text-emerald-400 mt-1 font-medium">
                        = $8/mo · Save $48/year vs monthly
                      </p>
                    )}
                    {isFree && (
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Free forever — no credit card
                      </p>
                    )}
                    {isLifetime && (
                      <p className="text-xs text-gold-400 mt-1 font-medium">
                        One-time payment · No renewals
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  {isFree ? (
                    user ? (
                      <Link
                        href="/dashboard"
                        className="block w-full text-center rounded-xl px-4 py-3 font-semibold border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] transition-colors mb-6"
                      >
                        Go to Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/sign-up"
                        className="block w-full text-center rounded-xl px-4 py-3 font-semibold border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-hover)] transition-colors mb-6"
                      >
                        Get Started Free
                      </Link>
                    )
                  ) : user ? (
                    <BillingCheckoutCTA
                      planKey={plan.key}
                      ctaLabel={plan.ctaLabel}
                      isHighlighted={isHighlighted}
                      isLifetime={isLifetime}
                    />
                  ) : (
                    <Link
                      href="/sign-up"
                      className={`block w-full text-center rounded-xl px-4 py-3 font-semibold transition-all mb-6 ${
                        isHighlighted
                          ? 'bg-gradient-to-r from-ascend-500 to-ascend-600 text-white hover:shadow-lg hover:shadow-ascend-500/25'
                          : isLifetime
                          ? 'bg-gradient-to-r from-gold-400 to-orange-500 text-white hover:shadow-lg hover:shadow-gold-400/25'
                          : 'bg-ascend-500/10 text-ascend-400 hover:bg-ascend-500/20 border border-ascend-500/30'
                      }`}
                    >
                      {plan.ctaLabel}
                    </Link>
                  )}

                  {/* Feature list */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.featureBullets.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isHighlighted
                              ? 'text-ascend-400'
                              : isLifetime
                              ? 'text-gold-400'
                              : 'text-emerald-400'
                          }`}
                        />
                        <span className="text-[var(--text-secondary)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════ FEATURE COMPARISON TABLE ═══════════════════════ */}
        <section className="bg-[var(--surface)]/50 border-y border-[var(--border)] py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Compare every feature
              </h2>
              <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
                See exactly what&apos;s included in each plan. No hidden limits, no surprises.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--background)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-4 px-5 font-semibold w-[55%]">Feature</th>
                    <th className="text-center py-4 px-5 font-semibold w-[22%]">
                      <span className="text-[var(--text-secondary)]">Free</span>
                      <p className="text-xs text-[var(--text-muted)] font-normal mt-0.5">$0</p>
                    </th>
                    <th className="text-center py-4 px-5 font-semibold w-[23%]">
                      <span className="text-ascend-400">Pro</span>
                      <p className="text-xs text-[var(--text-muted)] font-normal mt-0.5">
                        from $8/mo
                      </p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_SECTIONS.map((section) => (
                    <Fragment key={section.category}>
                      <tr>
                        <td
                          colSpan={3}
                          className="py-3 px-5 text-xs uppercase tracking-wider text-[var(--text-muted)] bg-[var(--surface)]/50 font-semibold border-b border-[var(--border)]"
                        >
                          {section.category}
                        </td>
                      </tr>
                      {section.features.map((feat, i) => (
                        <tr
                          key={feat.name}
                          className={`border-b border-[var(--border)] ${
                            i % 2 === 0 ? '' : 'bg-[var(--surface)]/20'
                          }`}
                        >
                          <td className="py-3 px-5 text-[var(--text-secondary)]">
                            <span className="flex items-center gap-2">
                              <feat.icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                              {feat.name}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-center">
                            <CellValue value={feat.free} />
                          </td>
                          <td className="py-3 px-5 text-center">
                            <CellValue value={feat.pro} />
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ TRUST SIGNALS ═══════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold mb-2">30-Day Money Back</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Not satisfied? Get a full refund within 30 days — no questions asked.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold mb-2">Secure Payments</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                All transactions are encrypted and processed through PCI-compliant payment infrastructure.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold mb-2">Cancel Anytime</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                No lock-in contracts. Downgrade or cancel with one click from your billing portal.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════ FAQ ═══════════════════════ */}
        <section className="bg-[var(--surface)]/50 border-y border-[var(--border)] py-16 sm:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Frequently asked questions
              </h2>
              <p className="text-[var(--text-secondary)]">
                Everything you need to know about Resurgo pricing.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-[var(--border)] bg-[var(--background)]"
                >
                  <summary className="cursor-pointer py-4 px-5 font-medium flex justify-between items-center list-none">
                    {faq.q}
                    <span className="text-[var(--text-muted)] group-open:rotate-180 transition-transform ml-4 shrink-0">
                      ▾
                    </span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ BOTTOM CTA ═══════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to build habits that stick?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
            Join thousands of people using Resurgo to track habits, achieve goals, and
            transform their routines — starting today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-ascend-500 to-ascend-600 text-white shadow-xl shadow-ascend-500/20 hover:shadow-ascend-500/40 transition-all"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              Explore features
            </Link>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-4">
            No credit card required · Free forever plan available
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>&copy; {new Date().getFullYear()} Resurgo. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[var(--text-secondary)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--text-secondary)]">
              Terms
            </Link>
            <Link href="/support" className="hover:text-[var(--text-secondary)]">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
