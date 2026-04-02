// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — /demo  →  Product Hunt Interactive Demo Page
// Full-page, no-nav, no-footer experience for Product Hunt visitors.
// Share URL:  https://resurgo.life/demo
// ═══════════════════════════════════════════════════════════════════════════

import type { Metadata } from 'next';
import ProductHuntDemo from '@/components/marketing/ProductHuntDemo';

export const metadata: Metadata = {
  title: 'Interactive Demo — Resurgo | AI Productivity & Life Command Center',
  description:
    'Try Resurgo interactively — AI goal planning, habit tracking, focus sessions, 5 AI coaches, XP levels, and weekly reviews. All in one life command center. Free to start.',
  openGraph: {
    title: 'Resurgo Interactive Demo — AI Productivity Assistant',
    description:
      'See how Resurgo turns chaos into execution. AI goal breakdown, habit streaks, deep focus, and 5 specialized coaches — all free to start.',
    url: 'https://resurgo.life/demo',
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
    canonical: 'https://resurgo.life/demo',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Full-bleed page — bypass the marketing layout's header/footer so the demo
// is fully immersive (just like Arcade.software's embed experience).
export default function DemoPage() {
  return <ProductHuntDemo />;
}
