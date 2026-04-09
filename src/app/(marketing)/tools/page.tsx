import type { Metadata } from 'next';
import Link from 'next/link';
import DemoSandbox from '@/components/marketing/DemoSandbox';
import EmailCapture from '@/components/marketing/EmailCapture';
import { getAllTools } from '@/lib/marketing/tools';

export const metadata: Metadata = {
  title: 'Free AI Tools - Resurgo',
  description:
    'Try Resurgo\'s free planning tools: brain dump cleanup, goal planning, prioritization, weekly reviews, and more.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Free AI Productivity Tools — Resurgo',
    description: 'Free planning tools: brain dump cleanup, goal planning, prioritization, and weekly reviews.',
    type: 'website',
    url: 'https://resurgo.life/tools',
  },
  twitter: {
    card: 'summary',
    title: 'Free AI Tools — Resurgo',
    description: 'Free planning tools: brain dump cleanup, goal planning, prioritization, and weekly reviews.',
  },
};

export default async function ToolsPage() {
  const tools = await getAllTools();

  return (
    <main className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <section className="border border-zinc-900 bg-zinc-950">
          <div className="border-b border-zinc-900 px-5 py-2">
            <span className="font-mono text-xs tracking-widest text-orange-500">RESURGO :: FREE_TOOLS</span>
          </div>
          <div className="grid gap-8 p-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="font-mono text-4xl font-bold tracking-tight">Use the free tools that power our acquisition engine.</h1>
              <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-zinc-400">
                These are fast, no-fluff utilities for turning messy thinking into action. Try them standalone, then move the output into Resurgo when you want the full system.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 font-mono text-xs tracking-widest text-zinc-500">
                <span className="border border-zinc-800 px-3 py-2">{tools.length} FREE TOOLS</span>
                <span className="border border-zinc-800 px-3 py-2">NO CREDIT CARD</span>
                <span className="border border-zinc-800 px-3 py-2">BUILT FOR CHAOTIC INPUT</span>
              </div>
            </div>

            <div className="border border-zinc-900 bg-black p-5">
              <p className="font-mono text-xs tracking-widest text-zinc-500">GET NEW TOOLS + PROMPTS</p>
              <p className="mt-3 font-mono text-sm leading-relaxed text-zinc-400">
                Join the list for new workflow drops, launch offers, and prompt packs from the marketing system already wired into Resurgo.
              </p>
              <div className="mt-5">
                <EmailCapture variant="inline" source="tools_index" offer="Free tools and prompt drops" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <article key={tool.slug} className="flex h-full flex-col border border-zinc-900 bg-zinc-950 p-5">
              <p className="font-mono text-[11px] tracking-widest text-zinc-500">FREE LIMIT: {tool.freeLimit}</p>
              <h2 className="mt-3 font-mono text-xl font-semibold text-zinc-100">{tool.title}</h2>
              <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-zinc-400">{tool.summary}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-orange-400">{tool.cta}</span>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="border border-zinc-700 px-4 py-2 font-mono text-xs tracking-widest text-zinc-300 transition hover:border-orange-700 hover:text-orange-400"
                >
                  OPEN TOOL
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 border border-zinc-900 bg-zinc-950 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs tracking-widest text-zinc-500">LIVE DEMO</p>
              <h2 className="mt-2 font-mono text-2xl font-bold text-zinc-100">Brain dump to task list</h2>
              <p className="mt-2 max-w-2xl font-mono text-sm leading-relaxed text-zinc-400">
                Paste everything spinning in your head. The demo shows how Resurgo turns it into top priorities and grouped next actions.
              </p>
            </div>
            <Link href="/templates" className="font-mono text-xs tracking-widest text-orange-400 hover:text-orange-300">
              NEED A READY-MADE SYSTEM? OPEN TEMPLATES
            </Link>
          </div>

          <div className="mt-6">
            <DemoSandbox />
          </div>
        </section>
      </div>
    </main>
  );
}
