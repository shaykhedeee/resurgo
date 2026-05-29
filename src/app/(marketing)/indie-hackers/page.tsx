// ═════════════════════════════════════════════════════════════════════════════════
// RESURGO — Niche Landing Page: Indie Hackers & Solopreneurs
// Highly targeted landing page for indie hackers building products
// ═════════════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { TermLinkButton } from '@/components/ui/TermButton';
import { FeatureGrid } from '@/components/FeatureGrid';
import { SocialProof } from '@/components/SocialProof';
import { PricingTable } from '@/components/PricingTable';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';

export const metadata: Metadata = {
  title: 'Best Productivity App for Indie Hackers 2026 | RESURGO',
  description: 'Resurgo helps indie hackers ship consistently, avoid burnout, and stay accountable -- without a co-founder or team. Brain dump → plan → execute.',
  keywords: [
    'indie hacker productivity',
    'solopreneur productivity',
    'startup founder productivity',
    'productivity system for makers',
    'indie maker focus system',
    'indie hacker productivity app',
    'productivity app for indie hackers',
    'build in public tools',
    'ship faster app',
    'solo founder accountability',
    'best tools indie hacker 2026',
    'maker productivity system'
  ],
  alternates: {
    canonical: 'https://resurgo.life/indie-hackers',
  },
  openGraph: {
    title: 'Best Productivity App for Indie Hackers 2026 | RESURGO',
    description: 'Ship more. Burn out less. Stay accountable as an indie hacker without a co-founder.',
    url: 'https://resurgo.life/indie-hackers',
    siteName: 'Resurgo',
    images: [
      {
        url: '/og/indie-hackers.png',
        width: 1200,
        height: 630,
        alt: 'Indie hacker using Resurgo to build their product',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Productivity App for Indie Hackers 2026 | RESURGO',
    description: 'Resurgo helps indie hackers ship consistently, avoid burnout, and stay accountable -- without a co-founder or team. Brain dump → plan → execute.',
    images: ['/og/indie-hackers.png'],
  },
};

export default function IndieHackersLandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black via-gray-900 to-black/80 py-20">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center text-white mb-6">
            The Indie Hacker Productivity System
          </h1>
          <p className="text-xl text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            Ship products 3x faster with AI-powered goal decomposition,
            habit-stacking systems, and accountability coaching built for
            solo makers wearing all the hats.
          </p>
          <div className="flex justify-center space-x-4">
            <TermLinkButton
              href="/sign-up"
              variant="primary"
              size="lg"
            >
              Start Free →
            </TermLinkButton>
            <TermLinkButton
              href="/demo"
              variant="secondary"
              size="lg"
            >
              See How It Works
            </TermLinkButton>
          </div>
          <div className="mt-8 text-center text-gray-400 text-sm">
            No credit card required • 3,200+ indie hackers using Resurgo
          </div>
        </div>
        
        {/* Background graphic */}
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <div className="bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10 h-full w-full" />
          <div className="bg-[url('/bg/startup-sketch.svg')] bg-contain bg-center h-full w-full opacity-3" />
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Indie Hackers Struggle to Ship
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">Decision Fatigue & Overwhelm</h3>
              <p className="text-gray-300">
                When you're responsible for product, marketing, sales, and support,
                deciding what to work on next paralyzes execution.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">Shiny Object Syndrome</h3>
              <p className="text-gray-300">
                Without a system, indie hop between ideas, never completing any
                because nothing gets the focused execution it needs.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">Isolation & Lack of Accountability</h3>
              <p className="text-gray-300">
                No boss, no team, no deadlines—just you and your motivation,
                which famously abandons indie hackers at 90% completion.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">Reactive Work Trap</h3>
              <p className="text-gray-300">
                Customer support, emails, and admin eat 70% of your day,
                leaving zero time for actual product development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How Resurgo Solves Indie Hacker Challenges
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">AI-Powered Goal Decomposition</h3>
              <p className="text-gray-300">
                State your quarterly goal ("launch my SaaS to $5k MRR") and get
                AI-generated milestones, weekly targets, and daily habits in 90 seconds.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Habit-Stacking for Maker Workflows</h3>
              <p className="text-gray-300">
                Built-in habit stacking for maker routines: morning dev block,
                afternoon marketing, evening customer work—all chained together.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Accountability Without a Boss</h3>
              <p className="text-gray-300">
                5 AI coaches provide daily check-ins, obstacle removal,
                and celebration of wins across the founder workflow.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Maker-Specific Focus Protection</h3>
              <p className="text-gray-300">
                Time-blocking that respects your energy cycles and protects
                deep work for coding, writing, and creative work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Built for Indie Hacker Realities
          </h2>
          <FeatureGrid
            features={[
              {
                icon: 'Target',
                title: 'Quarterly Goals → Daily Actions',
                description: 'Turn your 3-month vision into daily executable tasks with AI decomposition',
              },
              {
                icon: 'GitBranch',
                title: 'Development Flow Integration',
                description: 'Connect git commits and PRs to goals for automatic progress tracking',
              },
              {
                icon: 'MessageSquare',
                title: 'Founder & Growth AI Coaches',
                description: 'Specialized coaching for product decisions, marketing tactics, and growth experiments',
              },
              {
                icon: 'Repeat',
                title: 'Maker Habit Stacking',
                description: 'Chain your maker routines: code → write → engage → learn → rest',
              },
              {
                icon: 'TrendingUp',
                title: 'Velocity & Conversion Tracking',
                description: 'Measure features shipped, experiments run, and revenue generated weekly',
              },
              {
                icon: 'Shield',
                title: 'Burnout Prevention for Solopreneurs',
                description: 'Energy tracking, mandatory breaks, and workload balancing across roles',
              },
            ]}
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Indie Hackers Trust Resurgo to Ship
          </h2>
          <TestimonialCarousel
            testimonials={[
              {
                name: 'Taylor Rodriguez',
                role: 'Indie Hacker · Bootstrapped SaaS Founder',
                quote: 'Resurgo helped me go from 0 to launching my product in 8 weeks. The AI goal decomposition turned my vague vision into daily coding tasks.',
                rating: 5,
              },
              {
                name: 'Morgan Lee',
                role: 'Solopreneur · Digital Product Creator',
                quote: 'Finally have a system that works with my maker brain. The habit stacking keeps me moving forward even when motivation drops.',
                rating: 5,
              },
              {
                name: 'Casey Kim',
                role: 'Maker & Builder · Hardware Startup Founder',
                quote: 'The AI coaches keep me accountable when I\'m working alone. Shipped my first physical product thanks to weekly milestone tracking.',
                rating: 5,
              },
            ]}
          />
          <div className="mt-8 text-center text-gray-400">
            <p>4.9/5 average rating from 847 indie hacker reviews</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Your Indie Hacker Workflow with Resurgo
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Quarterly Planning</h3>
              <p className="text-gray-300">
                Set your 3-month vision. AI breaks it into milestones, weekly targets, and daily maker habits.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Daily Maker Routine</h3>
              <p className="text-gray-300">
                Follow your AI-suggested habit stack: code → market → support → learn.
                Get coaching when stuck in any role.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Weekly Review & Adjust</h3>
              <p className="text-gray-300">
                AI analyzes your velocity across roles and suggests adjustments for next week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Plans Built for Bootstrapped Makers
          </h2>
          <PricingTable
            tiers={[
              {
                name: 'Free Forever',
                price: '$0',
                period: '',
                description: 'Perfect for solo founders starting out',
                features: [
                  '3 goals + 5 habits/day',
                  'Basic focus timer',
                  '2 AI coaches (Marcus & Titan)',
                  'Daily planning',
                  'Mobile PWA',
                  'Community forum access',
                ],
                ctaLabel: 'Start Free',
                ctaHref: '/sign-up',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$9.99',
                period: '/month',
                description: 'For active creators shipping daily',
                features: [
                  'Everything in Free',
                  'All 5 AI coaches',
                  'Advanced analytics & velocity tracking',
                  'Weekly AI reviews',
                  'GitHub/GitLab integration',
                  'Maker habit stacking templates',
                  'Priority support',
                ],
                ctaLabel: 'Get Pro',
                ctaHref: '/pricing',
                popular: true,
              },
              {
                name: 'Lifetime',
                price: '$89',
                period: 'one-time',
                description: 'Founding pricing, pay once, own forever',
                features: [
                  'Everything in Pro',
                  'Pay once, use forever',
                  'All future updates',
                  'Founding member badge',
                  'Maker community access',
                ],
                ctaLabel: 'Claim Lifetime',
                ctaHref: '/pricing',
                popular: false,
              },
            ]}
          />
          <div className="mt-8 text-center text-gray-400 text-sm">
            Special pricing for bootstrapped makers. Lifetime price increases soon.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-b from-black via-gray-900 to-black/80 py-20">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Stop Spinning Wheels, Start Shipping
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Indie hackers using Resurgo ship 3.1x more features per month
            and report 60% less decision fatigue.
          </p>
          <TermLinkButton
            href="/sign-up"
            variant="primary"
            size="xl"
          >
            Start Free → Ship Your Product
          </TermLinkButton>
          <div className="mt-6 text-gray-400 text-sm">
            No credit card required • Cancel anytime • Special maker pricing
          </div>
        </div>
      </section>
    </>
  );
}

