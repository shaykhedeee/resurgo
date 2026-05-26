import type { Metadata } from 'next';
import { EbookLandingClient } from '@/components/EbookLandingClient';
import { BookOpen, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'UNSHACKLED: Free Productivity & Habit Blueprint — Resurgo',
  description: 'Download the ultimate science-backed guide to habit loops, streak fatigue, ADHD executive function routines, chronobiology, and the Daily Synergy Score system. Free lead-magnet blueprint by Resurgo.',
  keywords: [
    'free productivity ebook', 'Atomic Habits guide', 'ADHD productivity blueprint',
    'habit tracker systems', 'streak fatigue recovery', 'Daily Synergy Score formula', 'Resurgo Life OS',
  ],
  openGraph: {
    title: 'UNSHACKLED: The Connected Productivity Blueprint — Free Ebook',
    description: 'Break streak fatigue, consolidate app subscriptions, and master behavior loops with this science-backed blueprint.',
    type: 'article',
    url: 'https://resurgo.life/ebook',
    images: [{ url: 'https://resurgo.life/og-image.svg' }],
  },
  alternates: { canonical: 'https://resurgo.life/ebook' },
};

export default function EbookLandingPage() {
  const bookJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'UNSHACKLED: The Connected Cockpit for High-Output Solopreneurs, Devs, & Neurodivergent Builders',
    author: {
      '@type': 'Person',
      name: 'Shay',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Resurgo',
      url: 'https://resurgo.life',
    },
    genre: 'Productivity, Personal Development, Behavioral Psychology',
    description: 'A comprehensive, science-backed guide to breaking streak fatigue, managing ADHD executive function loads, chronobiology focus syncing, and consolidating fragmented app subscriptions.',
    url: 'https://resurgo.life/ebook',
    bookFormat: 'https://schema.org/EBook',
  };

  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        {/* -- HERO CONTAINER -- */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-start">
          {/* LEFT: MOCKUP & KEY TAKEAWAYS */}
          <div className="space-y-6 md:col-span-7">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600 animate-pulse" />
                <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: LEAD_MAGNET</span>
              </div>
              <div className="p-6">
                <span className="surface-chip-accent inline-block mb-3">FREE_OPERATOR_RESOURCE</span>
                <h1 className="font-mono text-3xl font-extrabold tracking-tight text-zinc-100 uppercase sm:text-4xl">
                  UNSHACKLED
                </h1>
                <p className="mt-2 font-mono text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  The Connected Cockpit for Solopreneurs, Devs, & Neurodivergent Builders
                </p>
                <p className="mt-4 font-mono text-[11px] leading-relaxed text-zinc-500">
                  Stop tracking your own inadequacy. This free 5-chapter blueprint bridges the gaps between the behavior loops of <span className="text-zinc-300 font-bold">Atomic Habits</span>, the ability scaling of <span className="text-zinc-300 font-bold">Tiny Habits</span>, and chronobiological performance to build an unbreakable daily cockpit.
                </p>
              </div>
            </div>

            {/* Simulated terminal book cover */}
            <div className="border border-dashed border-zinc-800 bg-zinc-950/20 p-6 font-mono text-center">
              <pre className="text-[7px] text-zinc-700 leading-none select-none overflow-x-auto whitespace-pre">
{`+-----------------------------------------------------------+
|  _______________________________________________          |
|  [ UNSHACKLED :: THE_CONNECTED_PRODUCTIVITY_OS ]          |
|  :::::::::::::::::::::::::::::::::::::::::::::::          |
|                                                           |
|       "Willpower is a finite metabolic resource.          |
|        Consistent execution is a system design."          |
|                                                           |
|                                                           |
|  * Atomic Habits Integration                              |
|  * Streak Reset Penalty Mechanics                         |
|  * Daily Synergy Score (DSS) Formula                      |
|  * ADHD Executive Load Optimization                       |
|  * Cal Newport Deep Work Scoping                          |
|                                                           |
|  [ RESURGO_PUBLICATIONS_::__2026 ]                        |
+-----------------------------------------------------------+`}
              </pre>
            </div>

            {/* Quick check points */}
            <div className="space-y-3">
              <h3 className="font-mono text-[10px] tracking-widest text-zinc-400 font-bold uppercase">
                // SYSTEMIC_INSIGHTS_INCLUDED
              </h3>
              <ul className="space-y-2">
                {[
                  'Why streak resets trigger the Abandonment Shame Spiral (and how to fix it)',
                  'BJ Foggs B=MAP action equation tailored specifically for developer burnout',
                  'Consolidating isolated calorie, finance, habit, and task tracking into one score',
                  'The exact mathematical variables driving the Daily Synergy Score (DSS)',
                  'Protecting focus limits through Cal Newport deep work partitioning',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 font-mono text-[10px] text-zinc-400 leading-relaxed uppercase">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT: REGISTRATION FORM */}
          <div className="md:col-span-5 md:sticky md:top-24">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
                <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
                <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase">ACCESS_KEYPORT</span>
              </div>
              <div className="p-4 sm:p-6">
                <EbookLandingClient />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
