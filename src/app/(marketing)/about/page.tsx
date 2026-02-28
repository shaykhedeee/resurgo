import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Resurgo',
  description: 'The story behind Resurgo: built for people who are tired of drifting and ready to take their lives back.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Terminal header */}
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-[9px] tracking-widest text-orange-600">RESURGO :: ABOUT</span>
          </div>
          <div className="p-8 text-center">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-zinc-100">
              We built the tool<br />we needed ourselves
            </h1>
            <p className="mt-3 font-mono text-sm text-zinc-500">
              Resurgo (Latin: to rise again) was born from frustration.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 font-mono text-sm text-zinc-400">
          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_ORIGIN</h2>
            <p>
              Most productivity apps are built for people who are already productive. They assume you have discipline, 
              a clear vision, and just need a fancy to-do list. But what about everyone else?
            </p>
            <p>
              What about the person who wakes up at noon feeling behind on life? The entrepreneur who can&apos;t stop 
              procrastinating? The professional drowning in vague &quot;someday&quot; goals?
            </p>
            <p>
              Resurgo was built for that person. Because we were that person.
            </p>
          </section>

          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_PHILOSOPHY</h2>
            <p>
              We believe discipline is a skill, not a personality trait. We believe progress compounds. 
              We believe the gap between where you are and where you want to be closes one day at a time.
            </p>
            <p className="text-orange-400">
              Your only competition is who you were yesterday.
            </p>
          </section>

          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_STACK</h2>
            <p>Built entirely on modern open stack:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Frontend', 'Next.js 14 + TypeScript'],
                ['Backend', 'Convex (real-time)'],
                ['Auth', 'Clerk'],
                ['AI', 'Groq (inference)'],
                ['Hosting', 'Vercel'],
                ['Design', 'Tailwind + Terminal UI'],
              ].map(([tech, desc]) => (
                <div key={tech} className="flex gap-2 border border-zinc-800 p-2">
                  <span className="text-orange-600">&gt;</span>
                  <div>
                    <p className="text-[9px] tracking-widest text-zinc-400">{tech}</p>
                    <p className="text-xs text-zinc-300">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-zinc-900 bg-zinc-950 p-6 space-y-4">
            <h2 className="text-base font-bold text-zinc-200 tracking-widest">THE_MISSION</h2>
            <p>
              Help 1 million people rise again. To get off the couch, out of their heads, and into a life they 
              actually built. Not a life that happened to them.
            </p>
            <div className="border border-dashed border-zinc-800 p-4 text-center">
              <p className="text-zinc-400 italic text-xs">
                &quot;The best project you&apos;ll ever work on is you.&quot;
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
