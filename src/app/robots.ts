// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Robots.txt Configuration
// SEO-optimized robots configuration for Next.js
// ═══════════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // Protect API routes
          '/(dashboard)/',   // Authenticated app shell
          '/onboarding',     // Personal setup flow
          '/callback',       // Auth callback routes
          '/sign-in',
          '/sign-up',
          '/login',
          '/private/',       // Private pages
          '/_next/',         // Next.js internals
          '/admin/',         // Admin pages if any
          '/*.json$',        // Protect JSON files except manifest
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/', '/guides', '/help', '/features', '/pricing', '/about', '/blog', '/blog/topics', '/blog/rss.xml', '/llms.txt'],
        disallow: ['/api/', '/(dashboard)/', '/onboarding', '/sign-in', '/sign-up', '/callback'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/', '/guides', '/help', '/features', '/pricing', '/about', '/blog', '/blog/topics', '/blog/rss.xml', '/llms.txt'],
        disallow: ['/api/', '/(dashboard)/', '/onboarding', '/sign-in', '/sign-up', '/callback'],
      },
      // Block aggressive crawlers
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
