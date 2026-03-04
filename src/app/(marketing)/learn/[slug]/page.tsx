import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllLearnTerms, getLearnTermBySlug } from '@/lib/marketing/learn';

interface LearnProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllLearnTerms();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: LearnProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLearnTermBySlug(slug);
  if (!page) return {};
  return {
    title: `What is ${page.term}? | RESURGO Learn`,
    description: `${page.definition} ${page.whyItMatters}`,
    alternates: { canonical: `/learn/${slug}` },
  };
}

export default async function LearnPage({ params }: LearnProps) {
  const { slug } = await params;
  const page = await getLearnTermBySlug(slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-black">
      <article className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">What is {page.term}?</h1>
        <p className="mt-4 font-mono text-sm text-zinc-300">{page.definition}</p>

        <section className="mt-6 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Why it matters</h2>
          <p className="mt-2 font-mono text-xs text-zinc-400">{page.whyItMatters}</p>
        </section>

        <section className="mt-6 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">How RESURGO applies it</h2>
          <ul className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
            {page.howResurgoHelps.map((item) => <li key={item}>▸ {item}</li>)}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-mono text-xs tracking-widest text-zinc-500">RELATED_TERMS</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {page.relatedTerms.map((related) => (
              <Link key={related} href={`/learn/${related}`} className="border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-400 hover:text-orange-400">
                {related}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
