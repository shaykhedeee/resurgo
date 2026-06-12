// =============================================================================
// RESURGO - Root Page
// Public landing page — all navigation via native <Link> tags.
// =============================================================================

import type { Metadata } from 'next';
import LandingPageV2 from '@/components/LandingPageV2';
import { MARKETING_SOCIAL_URLS } from '@/lib/marketing/social-links';
import {
  FOUNDING_LIFETIME_COPY,
  FOUNDING_LIFETIME_END_DATE,
  FOUNDING_LIFETIME_PRICE_USD,
  FOUNDING_LIFETIME_REGULAR_PRICE_USD,
} from '@/lib/product-config';

import { siteUrl } from '@/lib/marketing/seo-config';
const APP_URL = siteUrl;

// ─── METADATA ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Resurgo for Indie Founders — Ship Weekly with AI Execution',
  description:
    'Resurgo is a retro-brutalist AI Life OS that turns messy brain dumps into daily execution plans, habits, and focus sessions with 5 specialized AI coaches.',
  keywords: [
    'AI productivity assistant',
    'indie hacker productivity app',
    'founder productivity system',
    'AI habit tracker',
    'best habit tracker 2026',
    'ship weekly app',
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
    'solo founder execution system',
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
    title: 'Resurgo for Indie Founders — Ship Weekly with AI',
    description:
      'From idea chaos to shipped work in under 10 minutes. Built for indie founders and solo builders.',
    type: 'website',
    url: APP_URL,
    siteName: 'Resurgo',
    images: [
      {
        url: `${APP_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: 'Resurgo dashboard showing tasks, planning, focus sessions, and AI assistance',
        type: 'image/svg+xml',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resurgo for Indie Founders',
    description:
      'Brain dump to execution plan in under 10 minutes. Built to help founders ship weekly.',
    images: [`${APP_URL}/og-image.svg`],
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

const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    // WebPage Schema
    {
      '@type': 'WebPage',
      '@id': `${APP_URL}/#webpage`,
      'url': APP_URL,
      'name': 'Resurgo | AI Life OS & Goal Tracker for Solo Operators',
      'description': 'Resurgo is a retro-brutalist AI Life OS that turns messy brain dumps into daily execution plans, habits, and tasks with 5 personalized coaches.',
      'isPartOf': {
        '@id': `${APP_URL}/#website`,
      },
      'about': {
        '@id': `${APP_URL}/#software`,
      },
      'speakable': {
        '@type': 'SpeakableSpecification',
        'xpath': [
          '/html/head/title',
          '/html/head/meta[@name="description"]',
        ],
      },
    },
    // SoftwareApplication Schema
    {
      '@type': 'SoftwareApplication',
      '@id': `${APP_URL}/#software`,
      'name': 'Resurgo',
      'alternateName': ['Resurgo App', 'Resurgo Productivity Assistant', 'Resurgo Life Command Center'],
      'url': APP_URL,
      'applicationCategory': 'ProductivityApplication',
      'applicationSubCategory': 'Productivity Assistant',
      'operatingSystem': 'Web, Android, Windows-ready PWA',
      'browserRequirements': 'Requires JavaScript',
      'description': 'Resurgo is an AI execution system for indie founders. Capture ideas, prioritize what moves revenue, and ship consistently from one workspace.',
      'featureList': [
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
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '2814',
        'bestRating': '5',
        'worstRating': '1',
      },
      'offers': [
        {
          '@type': 'Offer',
          'name': 'Free Plan',
          'price': '0',
          'priceCurrency': 'USD',
          'description': '3 active goals, 5 habit check-ins per day, 10 AI coach messages per day, all focus timer modes, and 2 AI coaches (Marcus and Titan) - free forever with no credit card.',
        },
        {
          '@type': 'Offer',
          'name': 'Pro Monthly',
          'price': '9.99',
          'priceCurrency': 'USD',
          'billingIncrement': 'Month',
          'description': 'All 5 AI coaches, advanced analytics, weekly AI reviews, priority support, and Telegram bot.',
        },
        {
          '@type': 'Offer',
          'name': 'Pro Yearly',
          'price': '95.88',
          'priceCurrency': 'USD',
          'billingIncrement': 'Year',
          'description': 'Everything in Pro — save 20% vs monthly billing ($7.99/mo effective). Early access to new features.',
        },
        {
          '@type': 'Offer',
          'name': 'Lifetime Access',
          'price': String(FOUNDING_LIFETIME_PRICE_USD),
          'priceCurrency': 'USD',
          'description': `Pay once, use forever. All future updates included. ${FOUNDING_LIFETIME_COPY}. Regular price $${FOUNDING_LIFETIME_REGULAR_PRICE_USD} after ${FOUNDING_LIFETIME_END_DATE}.`,
        },
      ],
      'screenshot': `${APP_URL}/og-image.svg`,
      'softwareVersion': '1.4',
      'releaseNotes': `${APP_URL}/changelog`,
      'datePublished': '2024-01-01',
      'dateModified': '2026-03-05',
      'isAccessibleForFree': true,
      'publisher': {
        '@id': `${APP_URL}/#organization`,
      },
    },
    // HowTo Schema
    {
      '@type': 'HowTo',
      '@id': `${APP_URL}/#howto`,
      'name': 'How to build better habits with Resurgo',
      'description': 'Use Resurgo to turn a goal or messy brain dump into a focused daily system you can actually execute.',
      'totalTime': 'PT2M',
      'estimatedCost': {
        '@type': 'MonetaryAmount',
        'currency': 'USD',
        'value': '0',
      },
      'tool': [
        {
          '@type': 'HowToTool',
          'name': 'Resurgo app',
        },
      ],
      'step': [
        {
          '@type': 'HowToStep',
          'position': 1,
          'name': 'Set your goal',
          'text': 'Create a free Resurgo account and enter one clear priority — whether that is shipping work, recovering momentum, improving health, or organizing your week. No credit card required.',
          'url': `${APP_URL}/sign-up`,
        },
        {
          '@type': 'HowToStep',
          'position': 2,
          'name': 'Get your AI action plan',
          'text': 'Resurgo\'s AI turns that priority into milestones, habits, tasks, and a day plan. Your roadmap appears in seconds with less guesswork and less friction.',
          'url': `${APP_URL}/sign-up`,
        },
        {
          '@type': 'HowToStep',
          'position': 3,
          'name': 'Execute daily and track progress',
          'text': 'Capture tasks, run focus sessions, check off habits, use the AI coach when you are stuck, and review progress in weekly summaries that refine what comes next.',
          'url': `${APP_URL}/sign-up`,
        },
      ],
    },
    // FAQ Schema
    {
      '@type': 'FAQPage',
      '@id': `${APP_URL}/#faq`,
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is Resurgo?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is an AI productivity assistant and life command center. You can capture tasks, turn goals into daily execution plans, run focus sessions, track habits, and review progress from one system. The name comes from the Latin word for "to rise again."',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is Resurgo free to use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. The Resurgo free plan includes 3 active goals, 5 habit check-ins per day, 10 AI coach messages per day, all three focus timer modes (Pomodoro, Deep Work, Flowtime), Marcus and Titan, daily planning, and basic analytics - with no time limit and no credit card required. Pro plans start at $9.99/month or $7.99/month (annual billing).',
          },
        },
        {
          '@type': 'Question',
          'name': 'How does the AI habit tracker work?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'You enter a goal and Resurgo\'s AI generates a complete action plan: milestones, daily habits, and a prioritized task list. As you log habits and complete sessions, the AI adjusts your plan and provides personalized coaching based on your actual progress.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What makes Resurgo different from other habit trackers like Habitica, Streaks, or Notion?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo combines task capture, AI planning, focus sessions, habits, wellness, reviews, and guided recovery in one app. Most tools only handle one slice. Resurgo connects them into a single workflow so you can stop stitching together five different products.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I use Resurgo on my phone without downloading an app?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. Resurgo is a Progressive Web App (PWA). Install it from your browser on desktop or mobile for offline task capture, queued brain dumps, and quick relaunch access without an app store.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What focus timer methods does Resurgo include?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo includes three focus timer modes: Pomodoro (25-minute work blocks with 5-minute breaks), Deep Work (configurable long blocks with no interruptions), and Flowtime (open-ended sessions that prompt breaks based on how long you\'ve worked). All modes track distractions, include ambient soundscapes, and log your total focus hours.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How does AI coaching work in Resurgo?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo has 5 specialized AI coaches for strategy, performance, wellness, resilience, and systems. They respond using your tasks, habits, goals, and recent progress so guidance stays grounded in your actual state.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Will I lose my habit data if I change plans?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'No. Your complete habit history, streak data, goals, and journal entries are fully preserved when you upgrade or downgrade plans. Nothing gets deleted or reset.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my personal data private and secure?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. Resurgo encrypts your data in transit and at rest. We do not sell or share personal data with third parties. Your information stays yours — always. Payments are processed securely by Dodo Payments, a PCI-compliant Merchant of Record.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the best free habit tracker in 2025?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is one of the strongest free AI productivity assistants for people who want planning plus execution. It combines AI planning, habits, focus, reviews, and offline capture in a single free workflow.',
          },
        },
      ],
    },
    // BreadcrumbList Schema
    {
      '@type': 'BreadcrumbList',
      '@id': `${APP_URL}/#breadcrumb`,
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Home',
          'item': APP_URL,
        },
      ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <LandingPageV2 />
    </>
  );
}
