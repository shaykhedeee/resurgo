// ─────────────────────────────────────────────────────────────────────────────
// RESURGO.life — Marketing Section Layout
// Wraps all /about, /features, /docs, /changelog, /blog, /faq, /contact pages
// with consistent terminal-style navigation + footer + scroll-to-top.
// ─────────────────────────────────────────────────────────────────────────────

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ScrollToTop } from '@/components/ScrollToTop';

const NAV_LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/docs', label: 'Docs' },
];

const FOOTER_SECTIONS = [
  {
    heading: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/docs', label: 'API Docs' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  },
];

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/icons/pixel-logo.svg"
              alt="RESURGO logo"
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
          <span className="font-mono text-[10px] tracking-widest text-zinc-600">
            RESURGO.life :: {new Date().getFullYear()} :: ALL_SYSTEMS_NOMINAL
          </span>
        </div>
      </header>

      {/* ── PAGE CONTENT ── */}
      <div className="min-h-[calc(100vh-14rem)]">{children}</div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <img
                  src="/icons/pixel-logo.svg"
                  alt="RESURGO logo"
                  className="h-8 w-8"
                  style={{ imageRendering: 'pixelated' }}
                />
                <span className="font-mono text-base font-bold text-orange-500">RESURGO.life</span>
              </Link>
              <p className="font-mono text-xs leading-relaxed text-zinc-500">
                AI-powered life management for people who are serious about their goals.
                Rise again. Build better.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/resurgolife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-zinc-800 px-3 py-1.5 font-mono text-[10px] text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
                >
                  𝕏 Twitter
                </a>
                <a
                  href="https://t.me/ResurgoApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-zinc-800 px-3 py-1.5 font-mono text-[10px] text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
                >
                  ✈ Telegram
                </a>
              </div>
            </div>

            {/* Link columns */}
            {FOOTER_SECTIONS.map(({ heading, links }) => (
              <div key={heading} className="space-y-3">
                <p className="font-mono text-[10px] font-bold tracking-widest text-zinc-400">
                  {heading.toUpperCase()}
                </p>
                <ul className="space-y-2">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="font-mono text-sm text-zinc-500 transition hover:text-orange-400"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-900 pt-6 sm:flex-row">
            <p className="font-mono text-[10px] text-zinc-600">
              © {new Date().getFullYear()} RESURGO.life. All rights reserved.
            </p>
            <p className="font-mono text-[10px] text-zinc-700">
              Built with ❤ in TypeScript. Running on Vercel + Convex.
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  );
}
