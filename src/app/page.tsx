// =============================================================================
// RESURGO - Root Page
// Public landing page — all navigation via native <Link> tags.
// force-dynamic prevents Next.js from statically caching this page.
// =============================================================================

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import LandingPageV2 from '@/components/LandingPageV2';
const LandingPage = LandingPageV2;

export const metadata: Metadata = {
  title: 'Resurgo — Free AI Habit Tracker & Goal Planner | Build Better Habits',
  description:
    'Resurgo is a free AI habit tracker that breaks your goals into daily tasks. Track habits, build streaks, get AI coaching, and stay consistent. Set up in under 2 minutes.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Resurgo — Free AI Habit Tracker & Goal Planner',
    description: 'Break goals into daily tasks. Track habits, build streaks, and get AI coaching. Free to start.',
    type: 'website',
    url: '/',
  },
  twitter: {
    title: 'Resurgo — Free AI Habit Tracker & Goal Planner',
    description: 'Break goals into daily tasks, build streaks, and get AI coaching. Start free.',
  },
};

const landingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Resurgo Landing Page',
  description:
    'AI-powered habit tracker and goal planner with onboarding, focus sessions, and coaching.',
  mainEntity: {
    '@type': 'SoftwareApplication',
    name: 'Resurgo',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: [
      {
        '@type': 'Offer',
        name: 'Free',
        price: '0',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Pro Monthly',
        price: '4.99',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Pro Yearly',
        price: '29.99',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Lifetime',
        price: '49.99',
        priceCurrency: 'USD',
      },
    ],
  },
};

export default function Home() {
  // Show the marketing landing page for everyone on root.
  // Protected app routes (e.g. /dashboard) remain enforced by middleware.
  // All CTAs use native <Link href> — no router.push needed.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
