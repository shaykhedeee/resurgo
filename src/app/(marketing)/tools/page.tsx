import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTools } from '@/lib/marketing/tools';

export const metadata: Metadata = {
  title: 'Free Productivity Tools | RESURGO',
  description: 'Use free AI productivity tools: brain dump converter, task prioritizer, goal planner, streak calculator, and more.',
  alternates: { canonical: '/tools' },
};

export default async function ToolsIndexPage() {
  const tools = await getAllTools();
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">Free Tools</h1>
        <p className="mt-3 font-mono text-sm text-zinc-400">Functional lead magnets with free usage and optional signup unlock.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <article key={tool.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="font-mono text-base font-semibold text-zinc-100">{tool.title}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{tool.summary}</p>
              <p className="mt-2 font-mono text-xs text-zinc-500">Free uses: {tool.freeLimit}</p>
              <Link href={`/tools/${tool.slug}`} className="mt-4 inline-block border border-orange-900 bg-orange-950/30 px-3 py-2 font-mono text-xs tracking-widest text-orange-500">
                OPEN_TOOL
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
