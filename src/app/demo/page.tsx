// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — /demo  →  Product Hunt Interactive Demo Page
// Full-page, no-nav, no-footer experience for Product Hunt visitors.
// Share URL:  https://resurgo.life/demo
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import ProductHuntDemo from '@/components/marketing/ProductHuntDemo';
import { siteUrl } from '@/lib/marketing/seo-config';

export const metadata: Metadata = {
  title: 'Interactive Demo — Resurgo | AI Productivity & Life Command Center',
  description:
    'Try the interactive Resurgo demo. Test AI goal decomposition, habit tracking, focus sessions, 5 AI coaches, and weekly reviews with no registration.',
  openGraph: {
    title: 'Resurgo Interactive Demo — AI Productivity Assistant',
    description:
      'See how Resurgo turns chaos into execution. AI goal breakdown, habit streaks, deep focus, and 5 specialized coaches — all free to start.',
    url: `${siteUrl}/demo`,
    siteName: 'Resurgo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resurgo Interactive Demo',
    description:
      'Your AI life command center — habit tracking, goal planning, focus sessions, and 5 AI coaches. Free forever.',
  },
  alternates: {
    canonical: `${siteUrl}/demo`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Connected WebPage JSON-LD schema
const demoJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${siteUrl}/demo/#webpage`,
      'url': `${siteUrl}/demo`,
      'name': 'Interactive Demo — Resurgo | AI Productivity & Life Command Center',
      'description': 'Try the interactive Resurgo demo. Test AI goal decomposition, habit tracking, focus sessions, 5 AI coaches, and weekly reviews with no registration.',
      'isPartOf': {
        '@id': `${siteUrl}/#website`,
      },
      'publisher': {
        '@id': `${siteUrl}/#organization`,
      },
    },
  ],
};

// Full-bleed page — bypass the marketing layout's header/footer so the demo
// is fully immersive (just like Arcade.software's embed experience).
export default function DemoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(demoJsonLd) }}
      />
      <ProductHuntDemo />
    </>
  );
}
