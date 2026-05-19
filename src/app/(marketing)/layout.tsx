// ─────────────────────────────────────────────────────────────────────────────
// RESURGO.life — Marketing Section Layout
// Wraps all /about, /features, /docs, /changelog, /blog, /faq, /contact pages
// with consistent terminal-style navigation + footer + scroll-to-top.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react';
import { ScrollToTop } from '@/components/ScrollToTop';
import { MarketingFooter } from '@/components/MarketingFooter';
import { MarketingHeader } from '@/components/MarketingHeader';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/app', label: 'Get App', highlight: true },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/docs', label: 'Docs' },
];

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      <MarketingHeader
        navLinks={NAV_LINKS.map((link) => ({
          ...link,
          icon:
            link.label === 'Features'
              ? 'grid'
              : link.label === 'Pricing'
                ? 'star'
                : link.label === 'Get App'
                  ? 'download'
                  : link.label === 'About'
                    ? 'sparkles'
                    : link.label === 'Blog'
                      ? 'terminal'
                      : 'plan',
        }))}
        tickerText={`RESURGO.life :: ${new Date().getFullYear()} :: PIXEL_EXECUTION_LAYER_ACTIVE`}
      />

      {/* ── PAGE CONTENT ── */}
      <div className="min-h-[calc(100vh-14rem)]">{children}</div>

      {/* ── FOOTER ── */}
      <MarketingFooter />

      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  );
}
