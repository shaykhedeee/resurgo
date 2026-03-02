import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
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

// Optimized font loading via next/font (eliminates render-blocking Google Fonts link)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY SEO METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  title: {
    default: 'Resurgo | AI-Powered Habit Tracker & Goal Achievement App',
    template: '%s | Resurgo - Smart Habit Tracker',
  },
  description: 'Resurgo is a free AI habit tracker and goal planner. Break big goals into daily tasks, build streaks, track wellness, and get AI coaching. Start in under 2 minutes.',
  keywords: [
    // Primary Keywords
    'habit tracker', 'habit tracking app', 'goal tracker', 'habit builder',
    'AI habit tracker', 'smart goal setting app', 'gamified habit tracker',
    // Long-tail Keywords
    'daily habit tracker free', 'best habit tracking app 2026',
    'habit tracker with streaks', 'goal decomposition tool',
    'free habit tracker app', 'habit tracker with AI coaching',
    'goal planner app', 'daily routine tracker', 'streak tracker app',
    // Brand
    'resurgo', 'resurgo.life', 'resurgo app', 'resurgo habit tracker',
    // Feature Keywords
    'life operating system', 'goal decomposition engine',
    'focus timer app', 'pomodoro tracker', 'deep work timer',
    'mood tracker', 'sleep tracker', 'nutrition tracker',
    'AI coaching app', 'personal development app',
    'habit stacking app', 'atomic habits tracker',
    'business goal planner', 'budget tracker app',
    // Related Terms
    'productivity app', 'self improvement app', 'personal development',
    'routine builder', 'daily planner', 'wellness tracker',
    'journaling app', 'mindfulness app', 'accountability app',
    // Voice Search / AEO Queries
    'how to build good habits', 'track my daily habits',
    'app to help achieve goals', 'free habit tracker',
    'best app for building habits', 'how to stick to habits',
    'how to track goals with AI', 'what is the best habit tracker',
    'how to build a morning routine', 'how to stay consistent with habits',
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
          'price': '4.99',
          'priceCurrency': 'USD',
          'name': 'Pro Plan',
          'priceValidUntil': '2026-12-31',
          'description': 'Unlimited habits, AI goal decomposition, advanced analytics',
        },
        {
          '@type': 'Offer',
          'price': '29.99',
          'priceCurrency': 'USD',
          'name': 'Pro Yearly',
          'priceValidUntil': '2026-12-31',
          'description': 'Full Pro access billed yearly with 50% savings vs monthly',
        },
        {
          '@type': 'Offer',
          'price': '49.99',
          'priceCurrency': 'USD',
          'name': 'Lifetime Access',
          'description': 'One-time payment for lifetime access to all features',
        },
      ],
      'description': 'AI-powered habit tracker with goal decomposition, gamified progress tracking, focus timers, wellness monitoring, and personalized AI coaching.',
      'featureList': [
        'AI Goal Decomposition',
        'Habit Streak Tracking',
        'Gamified Progress with XP and Levels',
        'Advanced Analytics Dashboard',
        'Calendar View',
        'Focus Timer (Pomodoro, Deep Work, Flowtime)',
        'AI Coaching with 6 Personas',
        'Habit Stacking',
        'Sleep and Mood Tracking',
        'Nutrition Tracker',
        'Budget Tracker',
        'Business Goal Planner',
        'Telegram Bot Integration',
        'REST API and Webhooks',
        'Data Export',
        'Weekly Review System',
        'Dark/Light Theme',
      ],
      'screenshot': `${siteUrl}/screenshots/dashboard.png`,
      'softwareVersion': '1.4.0',
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.8',
        'ratingCount': '1250',
        'bestRating': '5',
        'worstRating': '1',
      },
    },
    // Organization Schema
    {
      '@type': 'Organization',
      'name': 'Resurgo',
      'url': siteUrl,
      'logo': `${siteUrl}/icons/icon.svg`,
      'description': 'Resurgo builds AI-powered productivity tools that help people build better habits, achieve goals, and stay consistent.',
      'sameAs': [
        'https://twitter.com/ResurgoApp',
        'https://t.me/ResurgoApp',
      ],
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'customer support',
        'email': 'support@resurgo.life',
        'availableLanguage': 'English',
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
    // FAQ Schema for common questions (AEO-optimized for voice search & rich snippets)
    {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'What is Resurgo?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is a free AI-powered habit tracker and goal planner. It breaks big goals into daily tasks, tracks your streaks, offers AI coaching from 6 coach personas, and includes focus timers, wellness tracking, and gamified progress with XP and levels.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is Resurgo free to use?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. Resurgo has a free plan that includes habit tracking, goal setting, focus timers, and AI coaching messages. Paid plans are Pro at $4.99/month, Pro Yearly at $29.99/year (save 50%), and Lifetime access at $49.99 one-time.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How does AI goal decomposition work?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Enter your main goal and the AI breaks it into milestones, weekly targets, and daily tasks. It considers your timeline and available time to create a plan you can follow every day.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Can I use Resurgo on my phone?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. Resurgo is a Progressive Web App (PWA) that works on any modern phone or tablet. Install it from your browser to your home screen for a native app experience. There is also a Telegram bot for quick habit check-ins.',
          },
        },
        {
          '@type': 'Question',
          'name': 'How do focus sessions work in Resurgo?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Choose from Pomodoro (25/5), Deep Work (90 min), Flowtime, or custom timers. Set your intention, start the session, and the app tracks your focus time, logs distractions, and saves your data. Ambient sounds are available during sessions.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Is my data private and secure?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. Your data is encrypted in transit and at rest. Resurgo never sells your data or uses it for advertising. Authentication is handled by Clerk (SOC2 compliant) and data is stored in Convex (EU-West-1).',
          },
        },
        {
          '@type': 'Question',
          'name': 'What AI coaches are available?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo offers 6 AI coach personas: Marcus (discipline-focused), Aurora (mindfulness and balance), Titan (performance-driven), Sage (wisdom and reflection), Phoenix (resilience and comeback), and Nova (creative and exploratory). Each has a unique coaching style.',
          },
        },
        {
          '@type': 'Question',
          'name': 'Does Resurgo have a referral program?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Yes. Share your referral link and when 3 friends join and complete onboarding, you earn 30 days of Pro free. There is no limit on how many referrals you can make.',
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-F1VLMSS8FB" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F1VLMSS8FB');
          `}
        </Script>
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