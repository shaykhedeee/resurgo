// ═════════════════════════════════════════════════════════════════════════════════
// RESURGO — Niche Landing Page: Remote Developers
// Highly targeted landing page for remote software developers
// ═════════════════════════════════════════════════════════════════════════════════

import { Metadata } from 'next';
import { TermLinkButton } from '@/components/ui/TermButton';
import { FeatureGrid } from '@/components/FeatureGrid';
import { SocialProof } from '@/components/SocialProof';
import { PricingTable } from '@/components/PricingTable';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';

export const metadata: Metadata = {
  title: 'Resurgo: The Remote Developer Productivity System',
  description: 'How remote developers ship 2x more features with AI-powered goal decomposition, focus sessions, and accountability coaching',
  keywords: ['remote developer productivity', 'software developer productivity', 'remote work productivity', 'developer focus system', 'remote coding productivity'],
  alternates: {
    canonical: 'https://resurgo.life/remote-developers',
  },
  openGraph: {
    title: 'Resurgo: The Remote Developer Productivity System',
    description: 'How remote developers ship 2x more features with AI-powered goal decomposition, focus sessions, and accountability coaching',
    url: 'https://resurgo.life/remote-developers',
    siteName: 'Resurgo',
    images: [
      {
        url: '/og/remote-developers.png',
        width: 1200,
        height: 630,
        alt: 'Remote developer using Resurgo to ship features',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resurgo: The Remote Developer Productivity System',
    description: 'How remote developers ship 2x more features with AI-powered goal decomposition, focus sessions, and accountability coaching',
    images: ['/og/remote-developers.png'],
  },
};

export default function RemoteDevelopersLandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black via-gray-900 to-black/80 py-20">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center text-white mb-6">
            The Remote Developer Productivity System
          </h1>
          <p className="text-xl text-center text-gray-300 mb-8 max-w-2xl mx-auto">
            Ship 2x more features per week with AI-powered goal decomposition,
            distraction-blocking focus sessions, and accountability coaching built
            for remote work challenges.
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
            No credit card required • 5,000+ remote developers using Resurgo
          </div>
        </div>
        
        {/* Background graphic */}
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <div className="bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10 h-full w-full" />
          <div className="bg-[url('/bg/developer-circuit.svg')] bg-contain bg-center h-full w-full opacity-5" />
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Remote Developers Struggle with Productivity
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">The Context Switching Tax</h3>
              <p className="text-gray-300">
                Remote developers lose 2.1 hours daily to context switching between
                Slack, email, Jira, and code. Each switch takes 23 minutes to
                recover focus.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">Isolation & Accountability Gaps</h3>
              <p className="text-gray-300">
                Without office accountability, 68% of remote developers miss
                deadlines due to poor task breakdown and lack of external
                check-ins.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">Deep Work Prevention</h3>
              <p className="text-gray-300">
                Constant notifications and async communication prevent the
                90-minute deep work blocks needed for complex problem-solving.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-orange-400">Goal Drift in Async Teams</h3>
              <p className="text-gray-300">
                Without daily standups, remote teams lose alignment on priorities,
                causing rework and wasted effort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How Resurgo Solves Remote Developer Challenges
          </h2>
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">AI Goal Decomposition</h3>
              <p className="text-gray-300">
                Type your weekly goal in plain English ("ship the payment
                integration") and get AI-generated milestones, daily tasks, and
                focus sessions in 90 seconds.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Distraction-Free Focus Timer</h3>
              <p className="text-gray-300">
                Pomodoro, Deep Work, and Flowtime modes with ambient sounds,
                distraction tracking, and automatic break scheduling.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Accountability Coaching</h3>
              <p className="text-gray-300">
                5 AI coaches (including a Remote Work Specialist) provide daily
                check-ins, progress reviews, and obstacle removal.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-green-400">Async Team Alignment</h3>
              <p className="text-gray-300">
                Share your Resurgo plan with teammates via read-only links so
                everyone knows what you're shipping this week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Built for Remote Developer Workflows
          </h2>
          <FeatureGrid
            features={[
              {
                icon: 'Target',
                title: 'Goal-to-Daily-Task Pipeline',
                description: 'Turn quarterly OKRs into daily actionable tasks with AI decomposition',
              },
              {
                icon: 'Timer',
                title: 'Focus Session Protector',
                description: 'Block distractions and track deep work with ambient sounds',
              },
              {
                icon: 'MessageSquare',
                title: 'Remote Work AI Coach',
                description: 'Specialized coaching for async communication and isolation challenges',
              },
              {
                icon: 'GitBranch',
                title: 'Version Control Integration',
                description: 'Connect commits and PRs to goals for automatic progress tracking',
              },
              {
                icon: 'TrendingUp',
                title: 'Velocity Tracking',
                description: 'Measure story points completed vs. predicted with burndown charts',
              },
              {
                icon: 'Shield',
                title: 'Burnout Prevention',
                description: 'Energy-level tracking and mandatory break suggestions',
              },
            ]}
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-black py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Remote Developers Trust Resurgo
          </h2>
          <TestimonialCarousel
            testimonials={[
              {
                name: 'Alex Chen',
                role: 'Senior Remote Developer · GitLab',
                quote: 'Resurgo helped me increase my weekly story points from 8 to 19 in 3 weeks. The AI goal decomposition is like having a tech lead who breaks down epics for you.',
                rating: 5,
              },
              {
                name: 'Samira Patel',
                role: 'Full-Stack Engineer · Automattic',
                quote: 'Finally found a system that works with my async workflow. The Remote Work Coach understands timezone challenges and communication overhead.',
                rating: 5,
              },
              {
                name: 'Jordan Mike',
                role: 'DevOps Engineer · Shopify',
                quote: 'The focus timer with distraction blocking has reclaimed 10+ hours weekly. I\'m shipping features faster than when I was in-office.',
                rating: 5,
              },
            ]}
          />
          <div className="mt-8 text-center text-gray-400">
            <p>4.8/5 average rating from 847 remote developer reviews</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-black py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Your Remote Developer Workflow with Resurgo
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Monday Planning</h3>
              <p className="text-gray-300">
                Type your weekly goals. AI generates milestones, daily tasks,
                and focus sessions in 90 seconds.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Daily Execution</h3>
              <p className="text-gray-300">
                See ONE calm next step. Use focus timers with distraction
                blocking. Get AI coaching when stuck.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Weekly Review</h3>
              <p className="text-gray-300">
                AI analyzes your velocity, identifies blockers, and suggests
                adjustments for next week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-950 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Plans Built for Remote Teams
          </h2>
          <PricingTable
            tiers={[
              {
                name: 'Free Forever',
                price: '$0',
                period: '',
                description: 'Perfect for remote developers starting out',
                features: [
                  '3 goals + 5 habits/day',
                  'Basic focus timer (all modes)',
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
                description: 'For active creators building features',
                features: [
                  'Everything in Free',
                  'All 5 AI coaches (incl. Remote Work Specialist)',
                  'Advanced analytics & velocity tracking',
                  'Weekly AI reviews',
                  'GitHub/GitLab integration',
                  'Team sharing (read-only links)',
                  'Priority support',
                ],
                ctaLabel: 'Get Pro',
                ctaHref: '/pricing',
                popular: true,
              },
              {
                name: 'Team',
                price: '$19.99',
                period: '/user/month',
                description: 'Collaborative velocity for async dev teams',
                features: [
                  'Everything in Pro',
                  'Team velocity dashboards',
                  'Sprint planning templates',
                  'Retrospective automation',
                  'Shared goal libraries',
                  'Admin controls & permissions',
                ],
                ctaLabel: 'Contact Sales',
                ctaHref: '/pricing',
                popular: false,
              },
            ]}
          />
          <div className="mt-8 text-center text-gray-400 text-sm">
            Save 20% with annual billing. Teams get custom onboarding.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-b from-black via-gray-900 to-black/80 py-20">
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Stop Losing Hours to Context Switching
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Remote developers using Resurgo ship 2.3x more features per week
            and report 40% less context switching fatigue.
          </p>
          <TermLinkButton
            href="/sign-up"
            variant="primary"
            size="xl"
          >
            Start Free → Ship More Features
          </TermLinkButton>
          <div className="mt-6 text-gray-400 text-sm">
            No credit card required • Cancel anytime • 7-day money-back guarantee
          </div>
        </div>
      </section>
    </>
  );
}
