import type { Metadata } from 'next';
import { TermLinkButton } from '@/components/ui/TermButton';
import { siteUrl } from '@/lib/marketing/seo-config';

export const metadata: Metadata = {
  title: 'About Resurgo — The Story Behind the Habit Tracker',
  description:
    'Learn why Resurgo was built: a productivity app for people who want one clear system to set goals, track habits, and execute daily without the clutter.',
  keywords: [
    'about Resurgo', 'Resurgo story', 'why Resurgo', 'habit tracker origin',
    'productivity app mission', 'Resurgo team', 'Resurgo philosophy',
  ],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Resurgo — The Story Behind the Habit Tracker',
    description: 'Why we built Resurgo and the philosophy behind simple, effective habit tracking.',
    type: 'website',
    url: '/about',
  },
};

// JSON-LD AboutPage schema connected to layout organization & website
const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${siteUrl}/about/#webpage`,
      'isPartOf': {
        '@id': `${siteUrl}/#website`,
      },
      'about': {
        '@id': `${siteUrl}/#organization`,
      },
      'name': 'About Resurgo',
      'description': 'The origin story, philosophy, and mission behind Resurgo — an AI-powered habit tracker and goal planner.',
      'url': `${siteUrl}/about`,
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* JSON-LD AboutPage + Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Terminal header */}
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: ABOUT</span>
          </div>
          <div className="p-8 text-center">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              We built the tool<br />we needed ourselves
            </h1>
            <p className="mt-3 font-mono text-sm text-zinc-500">
              Resurgo (Latin: to rise again) was born from frustration with productivity apps that only work for already-productive people.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 font-mono text-sm text-zinc-400">
          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_ORIGIN</h2>
            <p>
              Most productivity apps assume you already have discipline and just need a fancier to-do list. 
              They skip the hard part — figuring out what to do each day and how to stay consistent.
            </p>
            <p>
              Resurgo was made for real people. The student cramming at midnight. The entrepreneur who keeps 
              putting off the important work. The professional who sets goals every January and forgets them by March.
            </p>
            <p>
              We built Resurgo because we were that person. We needed a single app that would help us plan clearly, 
              execute daily, and actually stick with it.
            </p>
          </section>

          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_PHILOSOPHY</h2>
            <p>
              Discipline is a skill, not a personality trait. Progress compounds. The gap between where you 
              are and where you want to be closes one day at a time — one habit at a time.
            </p>
            <p>
              Resurgo is built on principles from Atomic Habits: make it obvious, make it easy, make it 
              satisfying, and track your progress. The app handles the planning so you can focus on doing.
            </p>
            <p className="text-orange-400">
              Your only competition is who you were yesterday.
            </p>
          </section>

          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_STACK</h2>
            <p>Built on a modern, privacy-first technology stack:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Frontend', 'Next.js 14 + TypeScript'],
                ['Backend', 'Convex (real-time sync)'],
                ['Auth', 'Clerk (SOC2 compliant)'],
                ['AI', 'Groq + Puter.js'],
                ['Hosting', 'Vercel (edge network)'],
                ['Design', 'Tailwind + Terminal UI'],
                ['Payments', 'Dodo Payments'],
                ['Bot', 'Telegram integration'],
              ].map(([tech, desc]) => (
                <div key={tech} className="flex gap-2 border border-zinc-800 p-2">
                  <span className="text-orange-600">&gt;</span>
                  <div>
                    <p className="text-xs tracking-widest text-zinc-400">{tech}</p>
                    <p className="text-xs text-zinc-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_MISSION</h2>
            <p>
              Help 1 million people rise again. Build a life through clear goals, consistent habits, and 
              daily action — not luck. Give everyone access to the productivity tools that used to require 
              expensive coaches and complex systems.
            </p>
            <div className="border border-dashed border-zinc-800 p-4 text-center">
              <p className="text-zinc-400 italic text-xs">
                &ldquo;The best project you&apos;ll ever work on is you.&rdquo;
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="border border-orange-900/50 bg-orange-950/10 p-8 text-center">
            <h2 className="font-mono text-xl font-bold text-zinc-100">Ready to start building?</h2>
            <p className="mt-2 font-mono text-sm text-zinc-400">
              Create your free account in under 2 minutes. No credit card needed.
            </p>
            <TermLinkButton href="/sign-up" variant="primary" size="lg" className="mt-4">
              [START_FREE]
            </TermLinkButton>
          </div>
        </div>
      </div>
    </main>
  );
}
