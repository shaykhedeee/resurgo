import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import '@/lib/env'; // Env validation — runs at startup (server-side)
import { ThemeProvider } from '@/components/ThemeProvider';
import { GoogleAnalytics } from '@/lib/analytics';
import { CustomCursor } from '@/components/Cursor';
import { ErrorTrackingInit } from '@/components/ErrorTrackingInit';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper';

// Base URL for the application (update for production)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY SEO METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  title: {
    default: 'Resurgo | AI-Powered Habit Tracker & Goal Achievement App',
    template: '%s | Resurgo - Smart Habit Tracker',
  },
  description: 'Build better habits with AI-powered goal decomposition. Track habits, achieve goals, and level up your life with gamified progress tracking. Free habit tracker app with smart analytics.',
  keywords: [
    // Primary Keywords
    'habit tracker', 'habit tracking app', 'goal tracker', 'habit builder',
    // Long-tail Keywords  
    'AI habit tracker', 'smart goal setting app', 'gamified habit tracker',
    'daily habit tracker free', 'best habit tracking app 2026',
    'habit tracker with streaks', 'goal decomposition tool', 'resurgo',
    'resurgo.life',
    'life operating system', 'goal decomposition engine',
    // Related Terms
    'productivity app', 'self improvement app', 'personal development',
    'routine builder', 'streak tracker', 'daily planner',
    // Voice Search Queries
    'how to build good habits', 'track my daily habits',
    'app to help achieve goals', 'free habit tracker',
  ],
  authors: [{ name: 'Resurgo Team', url: siteUrl }],
  creator: 'Resurgo',
  publisher: 'Resurgo',
  
  // ═══════════════════════════════════════════════════════════════════════════
  // CANONICAL & ALTERNATE URLs
  // ═══════════════════════════════════════════════════════════════════════════
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // PWA & APP METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Resurgo',
    startupImage: [
      {
        url: '/icons/splash-1170x2532.png',
        media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  applicationName: 'Resurgo',
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OPEN GRAPH (FACEBOOK, LINKEDIN, ETC.)
  // ═══════════════════════════════════════════════════════════════════════════
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Resurgo',
    title: 'Resurgo | AI-Powered Habit Tracker & Goal Achievement',
    description: 'Build lasting habits with AI goal decomposition. Track progress, earn XP, and level up your life. Join 50K+ users achieving their goals.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resurgo - AI-Powered Habit Tracker with gamified progress tracking',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'Resurgo Habit Tracker App',
        type: 'image/png',
      },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TWITTER CARD
  // ═══════════════════════════════════════════════════════════════════════════
  twitter: {
    card: 'summary_large_image',
    site: '@resurgolife',
    creator: '@resurgolife',
    title: 'Resurgo | AI Habit Tracker That Makes Goals Achievable',
    description: 'Transform big goals into daily wins. AI-powered decomposition + gamified tracking = unstoppable progress. Try free!',
    images: {
      url: '/twitter-image.png',
      alt: 'Resurgo - Build Better Habits with AI',
    },
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // ROBOTS & INDEXING
  // ═══════════════════════════════════════════════════════════════════════════
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Verification codes — add when available
  // verification: { google: '...', yandex: '...' },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  category: 'productivity',
  classification: 'Habit Tracking Software',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // iTunes app metadata — add when app is published
  // itunes: { appId: 'your-app-store-id', appArgument: siteUrl },
  
  // Additional metadata
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#F97316',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#F97316' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, // Better accessibility
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

// ═══════════════════════════════════════════════════════════════════════════════
// JSON-LD STRUCTURED DATA
// ═══════════════════════════════════════════════════════════════════════════════
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // Software Application Schema
    {
      '@type': 'SoftwareApplication',
      'name': 'Resurgo',
      'applicationCategory': 'LifestyleApplication',
      'applicationSubCategory': 'Productivity',
      'operatingSystem': 'Web, iOS, Android',
      'offers': [
        {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'name': 'Free Plan',
          'description': 'Basic habit tracking with up to 10 habits',
        },
        {
          '@type': 'Offer',
          'price': '12',
          'priceCurrency': 'USD',
          'name': 'Pro Plan',
          'priceValidUntil': '2026-12-31',
          'description': 'Unlimited habits, AI goal decomposition, advanced analytics',
        },
        {
          '@type': 'Offer',
          'price': '199',
          'priceCurrency': 'USD',
          'name': 'Lifetime Access',
          'description': 'One-time payment for lifetime access to all features',
        },
      ],
      'description': 'AI-powered habit tracker with goal decomposition, gamified progress tracking, and detailed analytics.',
      'featureList': [
        'AI Goal Decomposition',
        'Habit Streak Tracking',
        'Gamified Progress with XP and Levels',
        'Advanced Analytics Dashboard',
        'Calendar View',
        'Data Export',
        'Dark/Light Theme',
      ],
      'screenshot': `${siteUrl}/screenshots/dashboard.png`,
      'softwareVersion': '2.0',
    },
    // Organization Schema
    {
      '@type': 'Organization',
      'name': 'Resurgo',
      'url': siteUrl,
      'logo': `${siteUrl}/icons/icon.svg`,
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'email': 'support@resurgo.life',
      },
    },
    // WebSite Schema
    {
      '@type': 'WebSite',
      'name': 'Resurgo',
      'url': siteUrl,
      'inLanguage': 'en-US',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${siteUrl}/guides?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    // Web Page Schema for answer engines
    {
      '@type': 'WebPage',
      'name': 'Resurgo Habit Tracker',
      'url': siteUrl,
      'description': 'AI-powered habit tracker with guided goal decomposition, streak support, and actionable coaching.',
      'isPartOf': {
        '@type': 'WebSite',
        'url': siteUrl,
      },
      'about': [
        'Habit tracking',
        'Goal setting',
        'Behavior change',
        'Productivity',
      ],
      'speakable': {
        '@type': 'SpeakableSpecification',
        'xpath': [
          '/html/head/title',
          '/html/head/meta[@name="description"]',
        ],
      },
    },
    // FAQ Schema for common questions
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is Resurgo?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is an AI-powered habit tracking app that helps you break down big goals into achievable daily tasks. It features gamified progress tracking with XP and levels, detailed analytics, and privacy-first design.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is Resurgo free to use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes! Resurgo offers a free plan with up to 10 habits and basic analytics. Pro plans start at $12/month for unlimited features, and lifetime access is available for a one-time payment of $199.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How does AI goal decomposition work?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Our AI analyzes your ultimate goal and breaks it down into achievable milestones, weekly objectives, and daily tasks. This makes even the most ambitious goals feel manageable and actionable.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        {/* Font loaded via next/font - no render-blocking link needed */}
        {/* Puter.js for FREE AI - No API key needed! */}
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ascend-theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
                  
                  // On localhost: unregister all SW and clear caches entirely
                  if (isLocal && 'serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      return Promise.all(regs.map(function(reg) { return reg.unregister(); }));
                    }).catch(function() {});

                    if ('caches' in window) {
                      caches.keys().then(function(keys) {
                        return Promise.all(keys.map(function(key) { return caches.delete(key); }));
                      }).catch(function() {});
                    }
                  }

                  // On all hosts: clear old (non-current) SW caches to prevent stale pages
                  if (!isLocal && 'caches' in window) {
                    var CURRENT_CACHE = 'ascend-v4';
                    caches.keys().then(function(keys) {
                      return Promise.all(keys.filter(function(k) { return k !== CURRENT_CACHE; }).map(function(k) { return caches.delete(k); }));
                    }).catch(function() {});
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
        {/* Error Tracking */}
        <ErrorTrackingInit />

        {/* Google Analytics */}
        <GoogleAnalytics />

        {/* Custom Cursor - Desktop Only */}
        <CustomCursor />

        <ClerkProviderWrapper>
          <ConvexClientProvider>
            <ThemeProvider>
              <AccessibilityProvider>
                {children}
              </AccessibilityProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}