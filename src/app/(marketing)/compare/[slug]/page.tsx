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

  const title = `Resurgo vs ${page.competitor} (2026): Full Comparison`;
  const description = `${page.summary} See feature comparison, pricing, and our full verdict.`;

  return {
    title,
    description,
    keywords: page.seoKeywords ?? [`resurgo vs ${page.competitor.toLowerCase()}`, `${page.competitor.toLowerCase()} alternative`, `best ${page.competitor.toLowerCase()} alternative 2026`],
    alternates: { canonical: `https://resurgo.life/compare/${slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://resurgo.life/compare/${slug}`,
      siteName: 'Resurgo',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ComparisonPage({ params }: ComparisonProps) {
  const { slug } = await params;
  const page = await getComparisonBySlug(slug);
  if (!page) notFound();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://resurgo.life' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://resurgo.life/compare' },
      { '@type': 'ListItem', position: 3, name: `Resurgo vs ${page.competitor}`, item: `https://resurgo.life/compare/${slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="mx-auto max-w-5xl px-4 py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-xs text-zinc-600">
          <Link href="/" className="hover:text-zinc-400">HOME</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-zinc-400">COMPARE</Link>
          <span>/</span>
          <span className="text-zinc-400">VS {page.competitor.toUpperCase()}</span>
        </nav>

        <h1 className="font-mono text-3xl font-bold text-zinc-100">
          Resurgo vs {page.competitor} <span className="text-zinc-500">(2026)</span>
        </h1>
        <p className="mt-3 font-mono text-sm leading-relaxed text-zinc-300">{page.summary}</p>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'AI Coaching', resurgo: true, them: false },
            { label: 'Habit Tracking', resurgo: true, them: page.competitor !== 'Trello' && page.competitor !== 'Things 3' },
            { label: 'Free Plan', resurgo: true, them: true },
            { label: 'Cross-Platform', resurgo: true, them: page.competitor !== 'Streaks' && page.competitor !== 'Things 3' },
          ].map((stat) => (
            <div key={stat.label} className="border border-zinc-900 bg-zinc-950 p-3">
              <p className="font-mono text-xs text-zinc-500">{stat.label}</p>
              <p className="mt-1 font-mono text-xs">
                <span className={stat.resurgo ? 'text-green-500' : 'text-red-500'}>{stat.resurgo ? '✓ Resurgo' : '✗ Resurgo'}</span>
                <span className="mx-2 text-zinc-700">·</span>
                <span className={stat.them ? 'text-zinc-400' : 'text-zinc-600'}>{stat.them ? `✓ ${page.competitor}` : `✗ ${page.competitor}`}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Feature Comparison</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-3 py-2 text-left">Feature</th>
                  <th className="px-3 py-2 text-left text-orange-500">RESURGO</th>
                  <th className="px-3 py-2 text-left">{page.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {page.categories.map((row) => (
                  <tr key={row.name} className="border-b border-zinc-900 text-zinc-300 hover:bg-zinc-900/30">
                    <td className="px-3 py-2 text-zinc-400">{row.name}</td>
                    <td className="px-3 py-2 text-zinc-200">{row.resurgo}</td>
                    <td className="px-3 py-2 text-zinc-400">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing + Best For */}
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">Who It&apos;s Best For</h2>
            <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-400">{page.bestFor}</p>
          </div>
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">Pricing</h2>
            <div className="mt-2 space-y-2">
              <div>
                <p className="font-mono text-xs text-orange-500">RESURGO</p>
                <p className="font-mono text-xs text-zinc-300">{page.pricing.resurgo}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-zinc-500">{page.competitor}</p>
                <p className="font-mono text-xs text-zinc-400">{page.pricing.competitor}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Verdict */}
        {page.verdict && (
          <section className="mt-6 border border-orange-900/40 bg-orange-950/10 p-5">
            <h2 className="font-mono text-sm font-bold text-orange-400">Our Verdict</h2>
            <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-300">{page.verdict}</p>
          </section>
        )}

        {/* CTA */}
        <section className="mt-6 border border-zinc-800 bg-zinc-950 p-6 text-center">
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Ready to switch?</p>
          <h2 className="mt-2 font-mono text-lg font-bold text-zinc-100">Start with Resurgo — free, no credit card needed</h2>
          <p className="mt-1 font-mono text-xs text-zinc-400">Unlimited habits · AI goal planning · 2 coaches on the free plan</p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/sign-up"
              className="border border-orange-900 bg-orange-950/30 px-5 py-2 font-mono text-xs tracking-widest text-orange-500 hover:bg-orange-950/50 transition-colors"
            >
              TRY_RESURGO_FREE →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-6 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Frequently Asked Questions</h2>
          <div className="mt-3 space-y-2">
            {page.faq.map((faq) => (
              <details key={faq.question} className="border border-zinc-900 bg-black p-3 group">
                <summary className="cursor-pointer font-mono text-xs text-zinc-200 hover:text-zinc-100">{faq.question}</summary>
                <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/sign-up" className="border border-orange-900 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500">TRY_RESURGO_FREE</Link>
          <Link href="/compare" className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400">ALL_COMPARISONS</Link>
          <Link href="/features" className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400">SEE_ALL_FEATURES</Link>
        </div>
      </article>
    </main>
  );
}
