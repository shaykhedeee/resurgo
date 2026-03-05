// ─────────────────────────────────────────────────────────────────────────────
// RESURGO.life — Marketing Section Layout
// Wraps all /about, /features, /docs, /changelog, /blog, /faq, /contact pages
// with consistent terminal-style navigation + footer + scroll-to-top.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ScrollToTop } from '@/components/ScrollToTop';
import { MarketingFooter } from '@/components/MarketingFooter';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/docs', label: 'Docs' },
];

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/icons/pixel-logo.svg"
              alt="RESURGO logo"
              width={28}
              height={28}
              className="h-7 w-7"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="font-mono text-sm font-bold tracking-widest text-orange-500">
              RESURGO.life
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 font-mono text-sm text-zinc-400 transition-colors hover:text-orange-400"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="font-mono text-sm text-zinc-400 transition hover:text-zinc-200"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="border border-orange-600 bg-orange-950/30 px-4 py-1.5 font-mono text-sm font-bold text-orange-500 transition hover:bg-orange-600 hover:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Terminal sub-bar */}
        <div className="border-t border-zinc-900 bg-zinc-950 px-5 py-1">
          <span className="font-mono text-[10px] tracking-widest text-zinc-400">
            RESURGO.life :: {new Date().getFullYear()} :: ALL_SYSTEMS_NOMINAL
          </span>
        </div>

        {/* Mobile quick nav */}
        <nav className="border-t border-zinc-900 bg-black px-3 py-2 lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="shrink-0 border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-300 transition hover:border-zinc-600 hover:text-orange-400"
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* ── PAGE CONTENT ── */}
      <div className="min-h-[calc(100vh-14rem)]">{children}</div>

      {/* ── FOOTER ── */}
      <MarketingFooter />

      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  );
}
