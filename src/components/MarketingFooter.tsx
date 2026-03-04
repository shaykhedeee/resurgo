// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Shared Marketing Footer
// Used on every marketing page including the landing page (/) and all
// (marketing) layout routes: /features, /pricing, /about, /blog, etc.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/Logo';

const FOOTER_SECTIONS = [
  {
    heading: 'PRODUCT',
    icon: '◈',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/download', label: 'Install PWA' },
      { href: '/templates', label: 'Goal Templates' },
      { href: '/tools', label: 'Free Tools' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/roadmap', label: 'Roadmap' },
    ],
  },
  {
    heading: 'PLATFORM',
    icon: '◉',
    links: [
      { href: '/guides', label: 'Guides' },
      { href: '/learn', label: 'Learn' },
      { href: '/use-cases', label: 'Use Cases' },
      { href: '/compare', label: 'Compare' },
      { href: '/docs', label: 'API Docs' },
      { href: '/faq', label: 'FAQ' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'COMPANY',
    icon: '◆',
    links: [
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/security', label: 'Security' },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: '𝕏', label: 'Twitter', href: 'https://twitter.com/resurgolife' },
  { icon: '✈', label: 'Telegram', href: 'https://t.me/ResurgoApp' },
  { icon: 'in', label: 'LinkedIn', href: 'https://linkedin.com/company/resurgo' },
  { icon: '▶', label: 'YouTube', href: 'https://youtube.com/@resurgo' },
];

const TECH_STACK = [
  { label: 'Next.js', color: 'text-zinc-500' },
  { label: 'Convex', color: 'text-orange-700' },
  { label: 'Vercel', color: 'text-zinc-500' },
  { label: 'Clerk', color: 'text-zinc-500' },
  { label: 'TypeScript', color: 'text-zinc-600' },
];

export function MarketingFooter() {
  return (
    <footer className="border-t-2 border-zinc-800 bg-black">
      {/* ── System status bar ── */}
      <div className="border-b border-zinc-900 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="font-pixel text-[0.45rem] tracking-widest text-zinc-400">ALL_SYSTEMS_OPERATIONAL</span>
            <span className="hidden font-pixel text-[0.4rem] tracking-widest text-zinc-600 sm:inline">· 99.9% UPTIME</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-700">v1.4.0</span>
            <a
              href="https://status.resurgo.life"
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-[0.4rem] tracking-widest text-zinc-600 transition hover:text-orange-500"
            >
              STATUS_PAGE ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2.2fr_1fr_1fr_1fr]">
          {/* ── Brand column ── */}
          <div className="space-y-7">
            {/* Logo + name */}
            <Link href="/" className="group inline-flex items-center gap-3">
              <LogoMark className="h-10 w-10 transition group-hover:opacity-80" />
              <div>
                <span className="block font-pixel text-[0.75rem] tracking-[0.25em] text-orange-500">RESURGO</span>
                <span className="block font-terminal text-xs text-zinc-600">Rise Again. Build Better.</span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="max-w-xs font-terminal text-sm leading-relaxed text-zinc-500">
              AI-powered life management for people serious about their goals. One platform for habits, goals, focus sessions, AI coaching, and weekly progress reviews.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-zinc-800 px-3 py-1.5 font-terminal text-xs text-zinc-500 transition hover:border-orange-800 hover:bg-orange-950/20 hover:text-orange-400"
                >
                  <span className="text-[0.8rem]">{s.icon}</span>
                  {s.label}
                </a>
              ))}
            </div>

            {/* Newsletter sub */}
            <div>
              <p className="mb-2.5 font-pixel text-[0.45rem] tracking-widest text-zinc-500">
                SYSTEM_UPDATES → YOUR_INBOX
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 border-2 border-zinc-800 bg-black px-3 py-2 font-terminal text-sm text-zinc-300 placeholder-zinc-700 focus:border-orange-600 focus:outline-none"
                />
                <button
                  type="button"
                  className="border-2 border-l-0 border-orange-600 bg-orange-600 px-4 py-2 font-pixel text-[0.45rem] tracking-widest text-black transition hover:bg-orange-500 active:translate-y-[1px]"
                >
                  SUBSCRIBE
                </button>
              </div>
              <p className="mt-1.5 font-terminal text-xs text-zinc-700">No spam. Unsubscribe any time.</p>
            </div>
          </div>

          {/* ── Link columns ── */}
          {FOOTER_SECTIONS.map(({ heading, icon, links }) => (
            <div key={heading} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <span className="text-orange-600/70">{icon}</span>
                <p className="font-pixel text-[0.5rem] tracking-[0.2em] text-zinc-300">{heading}</p>
              </div>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 font-terminal text-sm text-zinc-600 transition-colors hover:text-orange-400"
                    >
                      <span className="font-pixel text-[0.4rem] text-zinc-800 transition group-hover:text-orange-700">›</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Pixel art divider ── */}
        <div aria-hidden="true" className="my-10 flex items-center gap-px overflow-hidden opacity-20">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className={cn('h-1 flex-1', i % 7 === 0 ? 'bg-orange-600' : i % 3 === 0 ? 'bg-zinc-700' : 'bg-zinc-900')}
            />
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          {/* Copyright */}
          <div className="space-y-1">
            <p className="font-terminal text-xs text-zinc-600">
              © {new Date().getFullYear()} Resurgo. All rights reserved.
            </p>
            <p className="font-terminal text-xs text-zinc-700">
              Built for people who refuse to stay stuck.
            </p>
          </div>

          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            {TECH_STACK.map((t) => (
              <span
                key={t.label}
                className={cn(
                  'border border-zinc-900 px-2 py-0.5 font-pixel text-[0.4rem] tracking-widest',
                  t.color,
                )}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

