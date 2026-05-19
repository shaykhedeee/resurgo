import type { Metadata } from 'next';
import { getAllComparisons } from '@/lib/marketing/compare';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'Resurgo Alternatives — Best Productivity Tools for Indie Founders',
  description: 'High-intent comparison pages: Resurgo vs alternatives for founders who want to ship weekly with less planning overhead.',
  alternates: { canonical: '/compare' },
};

export default async function CompareIndexPage() {
  const pages = await getAllComparisons();
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">RESURGO vs Alternatives</h1>
        <p className="mt-3 font-mono text-sm text-zinc-400">Decision pages for high-intent buyers evaluating alternatives before purchase.</p>

        <section className="mt-6 border border-orange-900/60 bg-orange-950/20 p-5">
          <p className="font-mono text-[11px] tracking-widest text-orange-400">FOUNDERS_DECISION_GUIDE</p>
          <h2 className="mt-2 font-mono text-lg font-bold text-zinc-100">Best App for Indie Founders in 2026</h2>
          <p className="mt-2 max-w-3xl font-mono text-xs leading-relaxed text-zinc-300">
            High-intent BOFU page comparing Resurgo, Motion, Notion, and Todoist for one outcome: weekly shipped output with lower planning overhead.
          </p>
          <TermLinkButton href="/best-app-for-indie-founders" variant="primary" size="sm" className="mt-4">
            OPEN_FOUNDER_GUIDE
          </TermLinkButton>
        </section>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <article key={page.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="font-mono text-base font-semibold text-zinc-100">RESURGO vs {page.competitor}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{page.summary}</p>
              <TermLinkButton href={`/compare/${page.slug}`} variant="secondary" size="sm" className="mt-4">
                VIEW_COMPARISON
              </TermLinkButton>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
