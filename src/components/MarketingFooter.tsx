// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Shared Marketing Footer
// Used on every marketing page including the landing page (/) and all
// (marketing) layout routes: /features, /pricing, /about, /blog, etc.
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/Logo';
import { MARKETING_SOCIAL_LINKS } from '@/lib/marketing/social-links';

const FOOTER_SECTIONS = [
  {
    heading: 'PRODUCT',
    icon: '◈',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/download', label: 'Download App' },
      { href: '/templates', label: 'Goal Templates' },
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

const TECH_STACK = [
  { label: 'Next.js', color: 'text-zinc-500' },
  { label: 'Convex', color: 'text-orange-700' },
  { label: 'Vercel', color: 'text-zinc-500' },
  { label: 'Clerk', color: 'text-zinc-500' },
  { label: 'TypeScript', color: 'text-zinc-600' },
];

export function MarketingFooter() {
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleFooterSubscribe() {
    const email = footerEmail.trim();
    if (!email || footerStatus === 'loading') return;
    setFooterStatus('loading');
    try {
      const res = await fetch('/api/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer_newsletter', offer: 'newsletter' }),
      });
      setFooterStatus(res.ok ? 'done' : 'error');
    } catch {
      setFooterStatus('error');
    }
  }
  return (
    <footer className="border-t-2 border-zinc-800 bg-black">
      {/* ── Version bar ── */}
      <div className="border-b border-zinc-900 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-2.5 sm:px-6">
          <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-700">v1.4.0</span>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="mx-auto max-w-7xl px-4 pt-5 pb-3 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[2.2fr_1fr_1fr_1fr]">
          {/* ── Brand column ── */}
          <div className="space-y-7">
            {/* Logo + name */}
            <Link href="/" className="group inline-flex items-center gap-3">
              <LogoMark className="h-10 w-10 transition group-hover:opacity-80" />
              <div>
                <span className="block font-pixel text-[0.75rem] tracking-[0.25em] text-orange-500">RESURGO</span>
                <span className="block font-terminal text-xs text-zinc-600">AI assistant for execution, clarity, and follow-through.</span>
              </div>
            </Link>

            {/* Tagline */}
            <p className="max-w-xs font-terminal text-sm leading-relaxed text-zinc-500">
              Your life command center for tasks, planning, focus, habits, reviews, and AI guidance. One system when the rest of your stack feels noisy.
            </p>

            {/* Social links */}
            <div className="flex flex-wrap gap-2">
              {MARKETING_SOCIAL_LINKS.map((s) => (
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
              <p className="mb-2.5 font-pixel text-[0.55rem] tracking-widest text-zinc-500">
                SYSTEM_UPDATES → YOUR_INBOX
              </p>
              {footerStatus === 'done' ? (
                <p className="font-terminal text-sm text-green-500">✓ Subscribed — watch your inbox.</p>
              ) : (
                <div className="flex">
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleFooterSubscribe()}
                    placeholder="your@email.com"
                    disabled={footerStatus === 'loading'}
                    className="flex-1 border-2 border-zinc-800 bg-black px-3 py-2 font-terminal text-sm text-zinc-300 placeholder-zinc-700 focus:border-orange-600 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleFooterSubscribe}
                    disabled={footerStatus === 'loading'}
                    className="min-h-[44px] border-2 border-l-0 border-orange-600 bg-orange-600 px-4 py-2 font-pixel text-[0.55rem] tracking-widest text-black transition hover:bg-orange-500 active:translate-y-[1px] disabled:opacity-50"
                  >
                    {footerStatus === 'loading' ? '...' : 'SUBSCRIBE'}
                  </button>
                </div>
              )}
              {footerStatus === 'error' && (
                <p className="mt-1 font-terminal text-xs text-red-500">Something went wrong. Try again.</p>
              )}
              <p className="mt-1.5 font-terminal text-xs text-zinc-700">No spam. Unsubscribe any time.</p>
            </div>
          </div>

          {/* ── Link columns ── */}
          {FOOTER_SECTIONS.map(({ heading, icon, links }) => (
            <div key={heading} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                <span className="text-orange-600/70">{icon}</span>
                <p className="font-pixel text-[0.6rem] tracking-[0.2em] text-zinc-300">{heading}</p>
              </div>
              <ul className="space-y-2.5">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="group flex items-center gap-2 font-terminal text-sm text-zinc-500 transition-colors hover:text-orange-400"
                    >
                      <span className="font-pixel text-[0.5rem] text-zinc-800 transition group-hover:text-orange-700">›</span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Pixel art divider ── */}
        <div aria-hidden="true" className="my-6 flex items-center gap-px overflow-hidden opacity-20">
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
                  'border border-zinc-900 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest',
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

