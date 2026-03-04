import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllComparisons } from '@/lib/marketing/compare';

export const metadata: Metadata = {
  title: 'RESURGO Comparisons — Resurgo vs Alternatives',
  description: 'Compare RESURGO with other productivity and habit tools to choose the best fit for your workflow.',
  alternates: { canonical: '/compare' },
};

export default async function CompareIndexPage() {
  const pages = await getAllComparisons();
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">RESURGO vs Alternatives</h1>
        <p className="mt-3 font-mono text-sm text-zinc-400">Decision pages for high-intent comparison traffic.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <article key={page.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="font-mono text-base font-semibold text-zinc-100">RESURGO vs {page.competitor}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{page.summary}</p>
              <Link href={`/compare/${page.slug}`} className="mt-4 inline-block border border-orange-900 bg-orange-950/30 px-3 py-2 font-mono text-xs tracking-widest text-orange-500">
                VIEW_COMPARISON
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
