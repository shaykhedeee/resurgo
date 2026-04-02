// =============================================================================
// RESURGO - Root Page
// Public landing page — all navigation via native <Link> tags.
// =============================================================================

import type { Metadata } from 'next';
import LandingPageV2 from '@/components/LandingPageV2';
import { MARKETING_SOCIAL_URLS } from '@/lib/marketing/social-links';

const APP_URL = 'https://resurgo.life';

// ─── METADATA ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Resurgo — AI Productivity Assistant & Life Command Center',
  description:
    'Resurgo is the AI productivity assistant for turning chaos into execution. Capture tasks, plan days, run focus sessions, track habits, and review progress from one life command center.',
  keywords: [
    'AI productivity assistant',
    'life command center',
    'AI habit tracker',
    'best habit tracker 2026',
    'ADHD productivity app',
    'AI goal planner',
    'AI daily planner',
    'task planning assistant',
    'offline productivity app',
    'productivity app',
    'daily planning app',
    'focus timer app',
    'Pomodoro timer',
    'AI coaching app',
    'brain dump app',
    'free productivity app',
    'habit streak tracker',
    'goal setting app',
    'focus planner',
    'personal operating system',
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
    title: 'Resurgo — AI Productivity Assistant & Life Command Center',
    description:
      'Capture, plan, focus, and follow through with one AI-powered operating system for your work and life.',
    type: 'website',
    url: APP_URL,
    siteName: 'Resurgo',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Resurgo dashboard showing tasks, planning, focus sessions, and AI assistance',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resurgo — AI Productivity Assistant',
    description:
      'Turn mental clutter into a clear plan. Tasks, focus, habits, AI guidance, and reviews in one system.',
    images: [`${APP_URL}/og-image.png`],
    creator: '@resurgolife',
    site: '@resurgolife',
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
    'AI productivity assistant for turning goals, tasks, habits, and reviews into one execution system.',
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
  alternateName: ['Resurgo App', 'Resurgo Productivity Assistant', 'Resurgo Life Command Center'],
  url: APP_URL,
  applicationCategory: 'ProductivityApplication',
  applicationSubCategory: 'Productivity Assistant',
  operatingSystem: 'Web, Android, Windows-ready PWA',
  browserRequirements: 'Requires JavaScript',
  description:
    'Resurgo is an AI productivity assistant and life command center. Capture tasks, organize goals, plan your day, run focus sessions, track habits, and review progress from one offline-friendly workspace.',
  featureList: [
    'AI task and goal breakdown into daily execution plans',
    'Offline-first task capture and queued brain dumps',
    'Habit tracking with streaks and consistency analytics',
    'Pomodoro, Deep Work, and Flowtime focus timers',
    'State-aware AI assistant with specialized coaches',
    'Gamification with XP, levels, and badges',
    'Wellness, sleep, nutrition, and review tracking',
    'Weekly AI-generated progress reviews',
    'Research mode with server-side web search',
    'Progressive Web App with Windows and Android packaging path',
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
        'Unlimited habits and goals, all focus timer modes, 2 AI coaches (Marcus and Titan), daily planning — free forever with no credit card.',
    },
    {
      '@type': 'Offer',
      name: 'Pro Monthly',
      price: '4.99',
      priceCurrency: 'USD',
      billingIncrement: 'Month',
      description: 'All 5 AI coaches, advanced analytics, weekly AI reviews, priority support, and Telegram bot.',
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
    'Resurgo builds AI-powered productivity software for planning, execution, and recovery. Free to start, privacy-first, and designed to reduce app sprawl.',
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    url: `${APP_URL}/help`,
    availableLanguage: 'English',
  },
  sameAs: MARKETING_SOCIAL_URLS,
};

/** HowTo — answers "how to build habits" queries */
const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to build better habits with Resurgo',
  description:
    'Use Resurgo to turn a goal or messy brain dump into a focused daily system you can actually execute.',
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
      text: 'Create a free Resurgo account and enter one clear priority — whether that is shipping work, recovering momentum, improving health, or organizing your week. No credit card required.',
      url: `${APP_URL}/sign-up`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Get your AI action plan',
      text: 'Resurgo\'s AI turns that priority into milestones, habits, tasks, and a day plan. Your roadmap appears in seconds with less guesswork and less friction.',
      url: `${APP_URL}/sign-up`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Execute daily and track progress',
      text: 'Capture tasks, run focus sessions, check off habits, use the AI coach when you are stuck, and review progress in weekly summaries that refine what comes next.',
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
        text: 'Resurgo is an AI productivity assistant and life command center. You can capture tasks, turn goals into daily execution plans, run focus sessions, track habits, and review progress from one system. The name comes from the Latin word for "to rise again."',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Resurgo free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The Resurgo free plan includes unlimited habits and goals, all three focus timer modes (Pomodoro, Deep Work, Flowtime), 2 AI coaches (Marcus and Titan), daily planning, and basic analytics — with no time limit and no credit card required. Pro plans start at $4.99/month.',
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
        text: 'Resurgo combines task capture, AI planning, focus sessions, habits, wellness, reviews, and guided recovery in one app. Most tools only handle one slice. Resurgo connects them into a single workflow so you can stop stitching together five different products.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Resurgo on my phone without downloading an app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Resurgo is a Progressive Web App (PWA). Install it from your browser on desktop or mobile for offline task capture, queued brain dumps, and quick relaunch access without an app store.',
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
        text: 'Resurgo has specialized AI coaches for systems, performance, wealth, resilience, strategy, and creativity. They respond using your tasks, habits, goals, and recent progress so guidance stays grounded in your actual state.',
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
        text: 'Resurgo is one of the strongest free AI productivity assistants for people who want planning plus execution. It combines AI planning, habits, focus, reviews, and offline capture in a single free workflow.',
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
