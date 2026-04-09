import type { Metadata } from 'next';
import { getAllUseCases } from '@/lib/marketing/useCases';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'Use Cases — The Best Habit Tracker for Your Situation | RESURGO',
  description: 'Explore persona-specific Resurgo use cases for ADHD, students, entrepreneurs, remote workers, parents, and more.',
  keywords: [
    'habit tracker use cases', 'best habit tracker for ADHD', 'habit tracker for students',
    'habit tracker for entrepreneurs', 'habit tracker for remote workers', 'Resurgo use cases',
  ],
  alternates: { canonical: '/use-cases' },
  openGraph: {
    title: 'Resurgo Use Cases — Best Habit Tracker for Your Situation',
    description: 'Persona-specific habit tracker use cases for ADHD, students, entrepreneurs, remote workers, and more.',
    type: 'website',
    url: 'https://resurgo.life/use-cases',
  },
  twitter: {
    card: 'summary',
    title: 'Resurgo Use Cases',
    description: 'Best habit tracker for ADHD, students, entrepreneurs, remote workers, and more.',
  },
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
              <TermLinkButton href={`/use-cases/${page.slug}`} variant="secondary" size="sm" className="mt-4">
                READ_USE_CASE
              </TermLinkButton>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
