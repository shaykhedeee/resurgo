// =============================================================================
// RESURGO - Root Page
// Public landing page — all navigation via native <Link> tags.
// force-dynamic prevents Next.js from statically caching this page.
// =============================================================================

export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import LandingPageV2 from '@/components/LandingPageV2';

const APP_URL = 'https://resurgo.life';

// ─── METADATA ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Resurgo — Free AI Habit Tracker & Goal Planner | Build Better Habits Daily',
  description:
    'Resurgo is the free AI habit tracker that turns any goal into a daily action plan. Track streaks, run focus sessions, get 24/7 AI coaching, and achieve more — set up in under 2 minutes. 50,000+ users.',
  keywords: [
    'AI habit tracker',
    'free habit tracker',
    'goal planner app',
    'AI goal planner',
    'habit tracking app',
    'productivity app',
    'daily habit tracker',
    'focus timer app',
    'Pomodoro timer',
    'AI coaching app',
    'build better habits',
    'free productivity app',
    'habit streak tracker',
    'goal setting app',
    'AI daily planner',
    'best habit tracker 2025',
  ],
  alternates: {
    canonical: APP_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Resurgo — Free AI Habit Tracker & Goal Planner',
    description:
      'Turn any goal into daily habits with AI. Track streaks, use focus timers, and get personalized AI coaching. Free plan available forever — no credit card needed.',
    type: 'website',
    url: APP_URL,
    siteName: 'Resurgo',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Resurgo — AI Habit Tracker & Goal Planner dashboard showing habits, goals, and focus sessions',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resurgo — Free AI Habit Tracker & Goal Planner',
    description:
      'Turn any goal into daily habits with AI. Track streaks, run focus sessions, get AI coaching. Start free in under 2 minutes — no trial that expires.',
    images: [`${APP_URL}/og-image.png`],
    creator: '@resurgoapp',
    site: '@resurgoapp',
  },
  authors: [{ name: 'Resurgo', url: APP_URL }],
  creator: 'Resurgo',
  publisher: 'Resurgo',
  category: 'productivity',
  classification: 'Productivity / Health & Fitness',
};

// ─── STRUCTURED DATA ─────────────────────────────────────────────────────────

/** WebSite — enables Google Sitelinks Search Box */
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${APP_URL}/#website`,
  name: 'Resurgo',
  url: APP_URL,
  description:
    'Free AI habit tracker and goal planner. Break any goal into daily tasks with AI coaching, focus timers, and wellness tracking.',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${APP_URL}/search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

/** SoftwareApplication — rich results in Google Search */
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${APP_URL}/#software`,
  name: 'Resurgo',
  alternateName: ['Resurgo App', 'Resurgo Habit Tracker', 'Resurgo Goal Planner'],
  url: APP_URL,
  applicationCategory: 'ProductivityApplication',
  applicationSubCategory: 'Habit Tracker',
  operatingSystem: 'Web, iOS, Android',
  browserRequirements: 'Requires JavaScript',
  description:
    'Resurgo is the free AI-powered habit tracker and goal planner. Set any goal, get an AI-generated daily action plan, track habits and streaks, run focus sessions, and get 24/7 AI coaching — all in one app. Install as a PWA on iOS and Android with no app store needed.',
  featureList: [
    'AI goal breakdown into milestones and daily tasks',
    'Habit tracker with streaks and consistency analytics',
    'Pomodoro, Deep Work, and Flowtime focus timers',
    '6 specialized AI coaches (NOVA, TITAN, SAGE, PHOENIX, ATLAS, EMBER)',
    'Gamification with XP, levels, and badges',
    'Wellness, sleep, and nutrition tracking',
    'Weekly AI-generated progress reviews',
    'Telegram bot integration for habit check-ins',
    'Progressive Web App — install on iOS and Android',
    'Free plan with no time limit',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2814',
    bestRating: '5',
    worstRating: '1',
  },
  offers: [
    {
      '@type': 'Offer',
      name: 'Free Plan',
      price: '0',
      priceCurrency: 'USD',
      description:
        'Unlimited habits and goals, all focus timer modes, 2 AI coaches (Nova and Phoenix), daily planning — free forever with no credit card.',
    },
    {
      '@type': 'Offer',
      name: 'Pro Monthly',
      price: '4.99',
      priceCurrency: 'USD',
      billingIncrement: 'Month',
      description: 'All 4 AI coaches, advanced analytics, weekly AI reviews, priority support, and Telegram bot.',
    },
    {
      '@type': 'Offer',
      name: 'Pro Yearly',
      price: '29.99',
      priceCurrency: 'USD',
      billingIncrement: 'Year',
      description: 'Everything in Pro — save 50% vs monthly billing. Early access to new features.',
    },
    {
      '@type': 'Offer',
      name: 'Lifetime Access',
      price: '49.99',
      priceCurrency: 'USD',
      description: 'Pay once, use forever. All future updates included. Founding member badge.',
    },
  ],
  screenshot: `${APP_URL}/og-image.png`,
  softwareVersion: '1.4',
  releaseNotes: `${APP_URL}/changelog`,
  datePublished: '2024-01-01',
  dateModified: '2026-03-05',
  isAccessibleForFree: true,
  author: {
    '@type': 'Organization',
    name: 'Resurgo',
    url: APP_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Resurgo',
    url: APP_URL,
  },
};

/** Organization — brand entity for knowledge panel */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${APP_URL}/#organization`,
  name: 'Resurgo',
  url: APP_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${APP_URL}/icon-512.png`,
    width: 512,
    height: 512,
  },
  description:
    'Resurgo builds AI-powered productivity tools to help individuals build consistent habits and achieve meaningful goals. Free to start, with no hidden fees or data selling.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${APP_URL}/help`,
    availableLanguage: 'English',
  },
  sameAs: [],
};

/** HowTo — answers "how to build habits" queries */
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to build better habits with Resurgo',
  description:
    'Use the Resurgo AI habit tracker to turn any goal into a daily system you can follow consistently — set up in under 2 minutes.',
  totalTime: 'PT2M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'USD',
    value: '0',
  },
  tool: [
    {
      '@type': 'HowToTool',
      name: 'Resurgo app',
    },
  ],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Set your goal',
      text: 'Create a free Resurgo account and enter one clear goal — whether that is losing weight, building a business, learning a skill, or improving your sleep. No credit card required.',
      url: `${APP_URL}/sign-up`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Get your AI action plan',
      text: 'Resurgo\'s AI breaks your goal into weekly milestones, suggested daily habits, and a prioritized task list. Your personalized roadmap is generated in seconds.',
      url: `${APP_URL}/sign-up`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Execute daily and track progress',
      text: 'Check off habits, run focus sessions (Pomodoro, Deep Work, or Flowtime), chat with your AI coach when you\'re stuck, and review your progress in weekly AI-generated summaries.',
      url: `${APP_URL}/sign-up`,
    },
  ],
};

/** FAQPage — answers PAA (People Also Ask) in search results */
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Resurgo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resurgo is a free AI habit tracker and goal planner. You enter a goal, the AI breaks it into milestones and daily habits, and you track progress with focus sessions, streaks, and AI coaching — all in one app. The name comes from the Latin word for "to rise again."',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Resurgo free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Resurgo free plan includes unlimited habits and goals, all three focus timer modes (Pomodoro, Deep Work, Flowtime), 2 AI coaches (Nova and Phoenix), daily planning, and basic analytics — with no time limit and no credit card required. Pro plans start at $4.99/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI habit tracker work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You enter a goal and Resurgo\'s AI generates a complete action plan: milestones, daily habits, and a prioritized task list. As you log habits and complete sessions, the AI adjusts your plan and provides personalized coaching based on your actual progress.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Resurgo different from other habit trackers like Habitica, Streaks, or Notion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resurgo combines AI goal planning, habit tracking with streaks, Pomodoro/Deep Work focus timers, 6 specialized AI coaches, wellness tracking, gamification with XP and levels, and weekly AI reviews — all in one app. Most tools only handle one or two of these. Resurgo connects them into a single daily workflow so you never need to switch apps.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Resurgo on my phone without downloading an app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Resurgo is a Progressive Web App (PWA). On iOS, open Safari, visit resurgo.life, tap the Share button, then "Add to Home Screen." On Android, open Chrome, visit resurgo.life, and tap "Add to Home Screen" from the menu. The app installs instantly, works offline, and feels like a native app — no app store needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What focus timer methods does Resurgo include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resurgo includes three focus timer modes: Pomodoro (25-minute work blocks with 5-minute breaks), Deep Work (configurable long blocks with no interruptions), and Flowtime (open-ended sessions that prompt breaks based on how long you\'ve worked). All modes track distractions, include ambient soundscapes, and log your total focus hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does AI coaching work in Resurgo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resurgo has 6 specialized AI coaches: NOVA (Systems Architect), TITAN (Performance Engine), SAGE (Wealth Architect), PHOENIX (Resilience Forge), ATLAS (Strategic Planner), and EMBER (Creative Catalyst). Each coach has a distinct personality and approach. Nova and Phoenix are free. Upgrade to Pro to unlock all six. Coaches respond based on your goals, habits, and recent progress.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I lose my habit data if I change plans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your complete habit history, streak data, goals, and journal entries are fully preserved when you upgrade or downgrade plans. Nothing gets deleted or reset.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my personal data private and secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Resurgo encrypts your data in transit and at rest. We do not sell or share personal data with third parties. Your information stays yours — always. Payments are processed securely by Dodo Payments, a PCI-compliant Merchant of Record.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best free habit tracker in 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Resurgo is one of the top free habit trackers in 2025. It combines AI goal planning, unlimited habit tracking, Pomodoro focus timers, AI coaching, and wellness monitoring — all free with no time limit. Unlike most free habit trackers, Resurgo uses AI to automatically break down your goals into daily actions.',
      },
    },
  ],
};

/** BreadcrumbList — enhances SERP appearance */
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: APP_URL,
    },
  ],
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function Home() {
  // Show the marketing landing page for everyone on root.
  // Protected app routes (e.g. /dashboard) remain enforced by middleware.
  // All CTAs use native <Link href> — no router.push needed.
  return (
    <>
      {/* ── Advanced structured data for rich results ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <LandingPageV2 />
    </>
  );
}
