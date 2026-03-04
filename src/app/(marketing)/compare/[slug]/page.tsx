import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllComparisons, getComparisonBySlug } from '@/lib/marketing/compare';

interface ComparisonProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllComparisons();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: ComparisonProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getComparisonBySlug(slug);
  if (!page) return {};

  return {
    title: `RESURGO vs ${page.competitor}: Which Is Right For You?`,
    description: page.summary,
    alternates: { canonical: `/compare/${slug}` },
    openGraph: {
      title: `RESURGO vs ${page.competitor}`,
      description: page.summary,
      type: 'article',
      url: `/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonProps) {
  const { slug } = await params;
  const page = await getComparisonBySlug(slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-black">
      <article className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">RESURGO vs {page.competitor}: Which Is Right For You?</h1>
        <p className="mt-3 font-mono text-sm text-zinc-300">{page.summary}</p>

        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Quick comparison</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">RESURGO</th>
                  <th className="px-3 py-2 text-left">{page.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {page.categories.map((row) => (
                  <tr key={row.name} className="border-b border-zinc-900 text-zinc-300">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.resurgo}</td>
                    <td className="px-3 py-2">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">Best for</h2>
            <p className="mt-2 font-mono text-xs text-zinc-400">{page.bestFor}</p>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">Pricing</h2>
            <p className="mt-2 font-mono text-xs text-zinc-300">RESURGO: {page.pricing.resurgo}</p>
            <p className="mt-1 font-mono text-xs text-zinc-300">{page.competitor}: {page.pricing.competitor}</p>
          </div>
        </section>

        <section className="mt-6 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">FAQ</h2>
          <div className="mt-2 space-y-2">
            {page.faq.map((faq) => (
              <details key={faq.question} className="border border-zinc-900 bg-black p-3">
                <summary className="cursor-pointer font-mono text-xs text-zinc-200">{faq.question}</summary>
                <p className="mt-2 font-mono text-xs text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-8 flex gap-3">
          <Link href="/sign-up" className="border border-orange-900 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500">TRY_RESURGO_FREE</Link>
          <Link href="/compare" className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400">BACK_TO_COMPARISONS</Link>
        </div>
      </article>
    </main>
  );
}
