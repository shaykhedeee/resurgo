import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllLearnTerms } from '@/lib/marketing/learn';

export const metadata: Metadata = {
  title: 'Learn — Productivity Glossary | RESURGO',
  description: 'Learn productivity and habit-building concepts through practical, plain-language explainers linked to real execution.',
  alternates: { canonical: '/learn' },
};

export default async function LearnIndexPage() {
  const pages = await getAllLearnTerms();
  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">Learn</h1>
        <p className="mt-3 font-mono text-sm text-zinc-400">Glossary pages for informational search intent.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {pages.map((page) => (
            <article key={page.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <h2 className="font-mono text-base font-semibold text-zinc-100">What is {page.term}?</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{page.definition}</p>
              <Link href={`/learn/${page.slug}`} className="mt-4 inline-block border border-orange-900 bg-orange-950/30 px-3 py-2 font-mono text-xs tracking-widest text-orange-500">
                READ_ARTICLE
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
