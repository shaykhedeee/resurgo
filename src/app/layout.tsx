import type { Metadata, Viewport } from 'next';
import { Inter, Press_Start_2P, VT323, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import '@/lib/env'; // Env validation — runs at startup (server-side)
import { ThemeProvider } from '@/components/ThemeProvider';
import { GoogleAnalytics } from '@/lib/analytics';
import { MetaPixel } from '@/components/MetaPixel';
import { CustomCursor } from '@/components/Cursor';
import { ErrorTrackingInit } from '@/components/ErrorTrackingInit';
import { AccessibilityProvider } from '@/components/AccessibilityProvider';
import ConvexClientProvider from '@/components/ConvexClientProvider';
import ClerkProviderWrapper from '@/components/ClerkProviderWrapper';
import { CookieConsent } from '@/components/CookieConsent';
import OfflineSyncProvider from '@/components/OfflineSyncProvider';
import { MARKETING_SOCIAL_URLS } from '@/lib/marketing/social-links';


// Base URL for the application (update for production)
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Optimized font loading via next/font (eliminates render-blocking Google Fonts link)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Pixel fonts for 8-bit UI aesthetic
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixel',
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vt323',
});

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY SEO METADATA
  // ═══════════════════════════════════════════════════════════════════════════
  title: {
    default: 'Resurgo | AI Productivity Assistant & Life Command Center',
    template: '%s | Resurgo',
  },
  description: 'Resurgo is an AI productivity assistant for tasks, planning, focus, habits, and reviews. Capture what matters, stay organized offline, and keep execution in one command center.',
  keywords: [
    // Primary Keywords
    'AI productivity assistant', 'life command center', 'goal tracker', 'task planning assistant',
    'offline productivity app', 'smart goal setting app', 'gamified habit tracker',
    // Long-tail Keywords
    'daily planner free', 'best productivity app 2026',
    'habit tracker with streaks', 'goal decomposition tool',
    'brain dump app', 'AI assistant for planning',
    'goal planner app', 'daily routine tracker', 'streak tracker app',
    // Brand
    'resurgo', 'resurgo.life', 'resurgo app', 'resurgo productivity assistant',
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
    'app to help achieve goals', 'free productivity assistant',
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
    title: 'Resurgo | AI Productivity Assistant & Life Command Center',
    description: 'Capture tasks, plan your day, focus deeply, and stay consistent with one AI-powered operating system for work and life.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Resurgo dashboard for planning, tasks, focus sessions, and AI guidance',
        type: 'image/svg+xml',
      },
    ],
  },
  
  // ═══════════════════════════════════════════════════════════════════════════
  // TWITTER CARD
  // ═══════════════════════════════════════════════════════════════════════════
  twitter: {
    card: 'summary_large_image',
    site: '@resurgo_life',
    creator: '@resurgo_life',
    title: 'Resurgo | AI Productivity Assistant That Keeps You Moving',
    description: 'Transform mental clutter into clear execution. Tasks, focus, habits, reviews, and AI guidance in one place.',
    images: {
      url: '/twitter-image.svg',
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
        'AI Coaching with 5 Personas',
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
    },
    // Organization Schema
    {
      '@type': 'Organization',
      'name': 'Resurgo',
      'url': siteUrl,
      'logo': `${siteUrl}/icons/icon.svg`,
      'description': 'Resurgo builds AI-powered productivity tools that help people plan clearly, execute consistently, and recover momentum faster.',
      'sameAs': MARKETING_SOCIAL_URLS,
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
      'name': 'Resurgo Productivity Assistant',
      'url': siteUrl,
      'description': 'AI-powered productivity assistant with guided planning, task capture, focus support, offline sync, and actionable coaching.',
      'isPartOf': {
        '@type': 'WebSite',
        'url': siteUrl,
      },
      'about': [
        'Task management',
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
            'text': 'Resurgo is a free AI-powered habit tracker and goal planner. It breaks big goals into daily tasks, tracks your streaks, offers AI coaching from 5 specialized coach personas, and includes focus timers, wellness tracking, and gamified progress with XP and levels.',
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
            'text': 'Resurgo offers 5 AI coaches: Marcus (stoic strategist), Aurora (mindful catalyst), Titan (physical performance), Phoenix (comeback specialist), and Nexus (integration engine). Each coach can create tasks, goals, habits, and full plans directly from conversation.',
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
        {
          '@type': 'Question',
          'name': 'What is the best AI habit tracker in 2026?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is the best AI-powered habit tracker in 2026. It combines 5 AI coach personas with intelligent habit tracking, goal decomposition, focus sessions, and a Never Miss Twice streak system. Unlike generic habit apps, Resurgo remembers your patterns across sessions and provides personalized coaching. Free tier includes 2 AI coaches with no credit card required.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the best productivity tool for goal setting?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is the best productivity tool for goal setting and execution. It uses AI to decompose any life goal into 4 levels: ultimate goal, milestones, weekly objectives, and daily tasks. Combined with habit tracking, focus timers, and 5 AI coaching personas, it turns goals into consistent daily action. Available free at resurgo.life.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the best task tracker with AI?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is a top-rated AI task tracker that goes beyond simple task lists. It features AI goal decomposition, 5 personalized AI coach personas (stoic strategist, comeback specialist, physical performance, wellness guide, and integration engine), intelligent habit tracking with Never Miss Twice logic, focus sessions with distraction logging, and a Telegram bot for quick task capture. Free to use at resurgo.life.',
          },
        },
        {
          '@type': 'Question',
          'name': 'What is the best planning app for personal development?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': 'Resurgo is the best planning app for personal development. It combines AI goal decomposition, habit tracking, focus timers, wellness monitoring (sleep, mood, nutrition), budget tracking, and 5 AI coach personas into one unified system. Built for people who are tired of drifting and want real execution, not just planning theater. Start free at resurgo.life.',
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
    <html lang="en" className={`${inter.variable} ${pressStart2P.variable} ${vt323.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KWTBH8SB');
          `}
        </Script>
        {/* End Google Tag Manager */}
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        {/* Font loaded via next/font - no render-blocking link needed */}
        {/* Puter.js for FREE AI - No API key needed! */}
        <Script src="https://js.puter.com/v2/" strategy="afterInteractive" />
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('resurgo-theme') || localStorage.getItem('ascend-theme') || 'dark';
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
                    var CURRENT_CACHE = 'resurgo-v9';
                    caches.keys().then(function(keys) {
                      return Promise.all(keys.filter(function(k) { return k !== CURRENT_CACHE; }).map(function(k) { return caches.delete(k); }));
                    }).catch(function() {});
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script id="pwa-sw-registration" strategy="afterInteractive">
          {`
            (function() {
              try {
                var isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
                if (!isLocal && 'serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js', { scope: '/' })
                      .then(function() {
                        // SW registered successfully
                      })
                      .catch(function(err) {
                        console.warn('[PWA] Service worker registration failed:', err);
                      });
                  });
                }
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--text-primary)] pixel-mode crt-subtle">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWTBH8SB"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Error Tracking */}
        <ErrorTrackingInit />

        {/* Google Analytics */}
        <GoogleAnalytics />

        {/* Meta Pixel (Facebook) — Conversion Tracking */}
        <MetaPixel />

        {/* Custom Cursor - Desktop Only */}
        <CustomCursor />

        <ClerkProviderWrapper>
          <ConvexClientProvider>
            <ThemeProvider>
              <AccessibilityProvider>
                <OfflineSyncProvider />
                {children}
                <CookieConsent />
              </AccessibilityProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}