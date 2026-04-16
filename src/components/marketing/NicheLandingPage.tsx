// ─────────────────────────────────────────────────────────────────────────────
// NicheLandingPage — Shared template for niche persona landing pages
// Used by /solopreneurs, /indie-hackers, /freelance-developers,
//         /content-creators, /digital-nomads, /adhd
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link';
import type { UseCasePage } from '@/lib/marketing/types';

export interface NicheFaq {
  question: string;
  answer: string;
}

interface Props {
  page: UseCasePage;
  keywords: string[];
  heroHeadline: string;
  heroCta: string;
  faq?: NicheFaq[];
  stats?: Array<{ value: string; label: string }>;
}

export default function NicheLandingPage({ page, keywords, heroHeadline, heroCta, faq, stats }: Props) {
  const defaultStats = stats ?? [
    { value: '10,000+', label: 'Goals Tracked' },
    { value: '94%', label: 'Habit Consistency Rate' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '3 min', label: 'Daily Check-in Time' },
  ];

  const faqJsonLd = faq && faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  } : null;

  return (
    <main className="min-h-screen bg-black">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <article className="mx-auto max-w-4xl px-4 pb-20 pt-14">

        {/* ── HERO ── */}
        <header className="mb-12 border-b border-zinc-900 pb-10">
          <p className="mb-3 font-pixel text-[0.6rem] tracking-widest text-orange-600">
            RESURGO FOR {page.persona.toUpperCase()}
          </p>
          <h1 className="font-mono text-3xl font-bold leading-snug text-zinc-100 md:text-4xl">
            {heroHeadline}
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-zinc-400">
            {page.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/sign-up?ref=${page.slug}`}
              className="min-h-[44px] border border-orange-700 bg-orange-600 px-5 py-2.5 font-pixel text-[0.65rem] tracking-widest text-black transition hover:bg-orange-500"
            >
              {heroCta}
            </Link>
            <Link
              href="/pricing"
              className="min-h-[44px] border border-zinc-800 px-5 py-2.5 font-pixel text-[0.65rem] tracking-widest text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
            >
              SEE PRICING
            </Link>
          </div>
        </header>

        {/* ── PAIN → SOLUTION ── */}
        <section className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="mb-4 font-mono text-xs font-bold tracking-widest text-red-500">THE_PROBLEM</h2>
            <ul className="space-y-3 font-mono text-xs leading-relaxed text-zinc-400">
              {page.pains.map((pain) => (
                <li key={pain} className="flex gap-2">
                  <span className="shrink-0 text-zinc-600">▸</span>
                  {pain}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-orange-900/40 bg-orange-950/10 p-5">
            <h2 className="mb-4 font-mono text-xs font-bold tracking-widest text-orange-500">THE_RESURGO_FIX</h2>
            <ul className="space-y-3 font-mono text-xs leading-relaxed text-zinc-300">
              {page.solutions.map((solution) => (
                <li key={solution} className="flex gap-2">
                  <span className="shrink-0 text-orange-600">✓</span>
                  {solution}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SAMPLE SETUP ── */}
        <section className="mb-10 border border-zinc-900 bg-zinc-950 p-6">
          <h2 className="mb-4 font-mono text-sm font-bold tracking-widest text-zinc-100">SUGGESTED_SETUP_FOR_{page.persona.toUpperCase().replace(/\s+/g, '_')}</h2>
          <ol className="space-y-3 font-mono text-xs leading-relaxed text-zinc-400">
            {page.sampleSetup.map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="shrink-0 font-bold text-orange-600">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* ── TESTIMONIAL ── */}
        <blockquote className="mb-10 border-l-2 border-orange-600 bg-zinc-950 px-6 py-5">
          <p className="font-mono text-sm leading-relaxed text-zinc-300">
            {page.testimonial.quote.replace(/^"|"$/g, '')}
          </p>
          <footer className="mt-3 font-mono text-xs text-zinc-500">
            — {page.testimonial.role}
          </footer>
        </blockquote>

        {/* ── STATS BAR ── */}
        <section className="mb-10 grid grid-cols-2 gap-px border border-zinc-900 bg-zinc-900 md:grid-cols-4">
          {defaultStats.map((stat) => (
            <div key={stat.label} className="bg-black px-4 py-5 text-center">
              <p className="font-mono text-xl font-bold text-orange-500">{stat.value}</p>
              <p className="mt-1 font-mono text-[0.6rem] tracking-widest text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* ── KEYWORDS ── */}
        <section className="mb-10 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="mb-3 font-mono text-xs font-bold tracking-widest text-zinc-500">RESURGO_FOR</h2>
          <div className="flex flex-wrap gap-2">
            {keywords.map((kw) => (
              <span key={kw} className="border border-zinc-800 px-2 py-1 font-mono text-[0.65rem] text-zinc-500">{kw}</span>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        {faq && faq.length > 0 && (
          <section className="mb-10" aria-label="Frequently Asked Questions">
            <h2 className="mb-6 font-mono text-sm font-bold tracking-widest text-zinc-100">
              FREQUENTLY_ASKED_QUESTIONS
            </h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <details
                  key={item.question}
                  className="group border border-zinc-900 bg-zinc-950"
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-mono text-xs font-semibold text-zinc-200 marker:content-none">
                    {item.question}
                    <span className="shrink-0 text-orange-600 transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="border-t border-zinc-900 px-5 py-4 font-mono text-xs leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ── */}
        <div className="border border-orange-900/60 bg-orange-950/10 p-6 text-center">
          <p className="mb-2 font-pixel text-[0.6rem] tracking-widest text-orange-500">FREE PLAN AVAILABLE</p>
          <p className="mb-4 font-mono text-sm text-zinc-300">
            3 goals, 5 habits, AI coaching, full dashboard. No credit card.
          </p>
          <Link
            href={`/sign-up?ref=${page.slug}`}
            className="inline-block min-h-[44px] border border-orange-700 bg-orange-600 px-8 py-3 font-pixel text-[0.65rem] tracking-widest text-black transition hover:bg-orange-500"
          >
            START FREE — {page.persona.toUpperCase()}
          </Link>
        </div>

        {/* ── INTERNAL LINKS §12.1 ── */}
        <div className="mt-10 border-t border-zinc-900 pt-8">
          <p className="mb-4 font-mono text-[10px] tracking-widest text-zinc-600">ALSO_FOR</p>
          <div className="flex flex-wrap gap-2">
            {([
              { href: '/solopreneurs', label: 'Solopreneurs' },
              { href: '/indie-hackers', label: 'Indie Hackers' },
              { href: '/freelance-developers', label: 'Freelance Developers' },
              { href: '/content-creators', label: 'Content Creators' },
              { href: '/digital-nomads', label: 'Digital Nomads' },
            ] as { href: string; label: string }[])
              .filter((l) => !l.href.includes(page.slug))
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-orange-400"
                >
                  {link.label} →
                </Link>
              ))}
            <Link
              href="/features"
              className="border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-orange-400"
            >
              All Features →
            </Link>
            <Link
              href="/blog"
              className="border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-500 transition hover:border-zinc-600 hover:text-orange-400"
            >
              Blog →
            </Link>
          </div>
        </div>

      </article>
    </main>
  );
}
