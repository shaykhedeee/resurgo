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

const SLUG_KEYWORDS: Record<string, string[]> = {
  adhd: ['best productivity app for ADHD 2026', 'ADHD daily planner app', 'ADHD goal tracker app', 'productivity system for ADHD adults', 'habit tracker for ADHD brains'],
  solopreneurs: ['productivity app for solopreneurs', 'AI goal tracker for solopreneurs', 'habit tracker solo founder'],
  'indie-hackers': ['productivity app indie hacker', 'goal tracker indie founder', 'habit system maker'],
  'freelance-developers': ['habit tracker for freelancers', 'AI productivity app freelance developer', 'freelance goal system'],
  'content-creators': ['productivity app for content creators', 'content creator habit tracker', 'AI coach for creators'],
  'digital-nomads': ['habit tracker digital nomad', 'productivity app remote worker', 'AI coach nomads'],
};

export async function generateMetadata({ params }: UseCaseProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getUseCaseBySlug(slug);
  if (!page) return {};

  const title = `The Best Habit Tracker for ${page.persona} | RESURGO`;
  const description = page.summary;
  const url = `https://resurgo.life/use-cases/${slug}`;
  const keywords = SLUG_KEYWORDS[slug] ?? [`habit tracker for ${page.persona}`, `productivity app ${page.persona}`, 'AI life coach'];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/use-cases/${slug}` },
    openGraph: {
      title,
      description,
      url,
      siteName: 'RESURGO',
      type: 'article',
      images: [{ url: 'https://resurgo.life/og-image.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://resurgo.life/og-image.png'],
    },
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
