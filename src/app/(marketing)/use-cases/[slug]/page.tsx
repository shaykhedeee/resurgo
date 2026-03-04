import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllUseCases, getUseCaseBySlug } from '@/lib/marketing/useCases';

interface UseCaseProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await getAllUseCases();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: UseCaseProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getUseCaseBySlug(slug);
  if (!page) return {};
  return {
    title: `The Best Habit Tracker for ${page.persona} | RESURGO`,
    description: page.summary,
    alternates: { canonical: `/use-cases/${slug}` },
  };
}

export default async function UseCasePage({ params }: UseCaseProps) {
  const { slug } = await params;
  const page = await getUseCaseBySlug(slug);
  if (!page) notFound();

  return (
    <main className="min-h-screen bg-black">
      <article className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">The Best Habit Tracker for {page.persona}</h1>
        <p className="mt-3 font-mono text-sm text-zinc-300">{page.summary}</p>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">Pain points</h2>
            <ul className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
              {page.pains.map((pain) => <li key={pain}>▸ {pain}</li>)}
            </ul>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">How RESURGO solves them</h2>
            <ul className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
              {page.solutions.map((solution) => <li key={solution}>▸ {solution}</li>)}
            </ul>
          </div>
        </section>

        <section className="mt-6 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Suggested setup</h2>
          <ol className="mt-3 space-y-2 font-mono text-xs text-zinc-400">
            {page.sampleSetup.map((step, index) => <li key={step}>{index + 1}. {step}</li>)}
          </ol>
        </section>

        <blockquote className="mt-6 border-l-2 border-orange-600 bg-zinc-950 p-5 font-mono text-sm text-zinc-300">
          “{page.testimonial.quote}”
          <footer className="mt-2 text-xs text-zinc-500">— {page.testimonial.role}</footer>
        </blockquote>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/sign-up?useCase=${page.slug}`} className="border border-orange-900 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500">
            START_FREE_FOR_{page.slug.toUpperCase()}
          </Link>
          {page.related.map((related) => (
            <Link key={related} href={`/use-cases/${related}`} className="border border-zinc-800 px-3 py-2 font-mono text-xs text-zinc-400">{related}</Link>
          ))}
        </div>
      </article>
    </main>
  );
}
