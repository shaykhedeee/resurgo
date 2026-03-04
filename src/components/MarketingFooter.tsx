// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Shared Marketing Footer
// Used on every marketing page including the landing page (/) and all
// (marketing) layout routes: /features, /pricing, /about, /blog, etc.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import { LogoMark } from '@/components/Logo';

const FOOTER_SECTIONS = [
  {
    heading: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/templates', label: 'Templates' },
      { href: '/tools', label: 'Free Tools' },
      { href: '/download', label: 'Android App' },
      { href: '/changelog', label: 'Changelog' },
      { href: '/docs', label: 'API Docs' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
      { href: '/use-cases', label: 'Use Cases' },
      { href: '/compare', label: 'Compare' },
      { href: '/roadmap', label: 'Roadmap' },
      { href: '/learn', label: 'Learn' },
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

export function MarketingFooter() {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark className="h-8 w-8" />
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
                className="border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
              >
                𝕏 Twitter
              </a>
              <a
                href="https://t.me/ResurgoApp"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-zinc-300"
              >
                ✈ Telegram
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map(({ heading, links }) => (
            <div key={heading} className="space-y-3">
              <p className="font-mono text-xs font-bold tracking-widest text-zinc-400">
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
          <p className="font-mono text-xs text-zinc-400">
            © {new Date().getFullYear()} RESURGO.life. All rights reserved.
          </p>
          <p className="font-mono text-xs text-zinc-500">
            Built with ❤ in TypeScript. Running on Vercel + Convex.
          </p>
        </div>
      </div>
    </footer>
  );
}
