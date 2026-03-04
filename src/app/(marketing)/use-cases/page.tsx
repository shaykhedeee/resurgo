import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllUseCases } from '@/lib/marketing/useCases';

export const metadata: Metadata = {
  title: 'Use Cases — The Best Habit Tracker for Your Situation | RESURGO',
  description: 'Explore persona-specific Resurgo use cases for ADHD, students, entrepreneurs, remote workers, parents, and more.',
  alternates: { canonical: '/use-cases' },
};

export default async function UseCasesIndexPage() {
  const pages = await getAllUseCases();
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">Use Cases</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <article key={page.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="font-mono text-base font-semibold text-zinc-100">Best Habit Tracker for {page.persona}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{page.summary}</p>
              <Link href={`/use-cases/${page.slug}`} className="mt-4 inline-block border border-orange-900 bg-orange-950/30 px-3 py-2 font-mono text-xs tracking-widest text-orange-500">
                READ_USE_CASE
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
