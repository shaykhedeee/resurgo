import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTemplates } from '../../../lib/marketing/templates';

export const metadata: Metadata = {
  title: 'Goal Templates — Free AI Planning Blueprints | RESURGO',
  description: 'Browse free goal templates for fitness, career, finance, learning, and burnout recovery. Start with structure, then let AI adapt your plan.',
  keywords: [
    'goal templates', 'free goal planner', 'habit templates', 'AI planning blueprints',
    'fitness goal template', 'career goal template', 'productivity templates', 'Resurgo templates',
  ],
  alternates: { canonical: '/templates' },
  openGraph: {
    title: 'Free Goal Templates — AI Planning Blueprints | Resurgo',
    description: 'Browse free goal templates for fitness, career, finance, and learning. AI adapts the plan to you.',
    type: 'website',
    url: 'https://resurgo.life/templates',
  },
  twitter: {
    card: 'summary',
    title: 'Free Goal Templates — Resurgo',
    description: 'Free AI planning blueprints for fitness, career, finance, and learning.',
  },
};

export default async function TemplatesIndexPage() {
  const templates = await getAllTemplates();

  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="font-mono text-3xl font-bold text-zinc-100">Goal Templates</h1>
        <p className="mt-3 max-w-2xl font-mono text-sm text-zinc-400">
          Programmatic template library for high-intent planning use cases. Pick a template,
          launch fast, and personalize in your dashboard.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article key={template.slug} className="border border-zinc-900 bg-zinc-950 p-5">
              <p className="font-mono text-xs tracking-widest text-orange-500">{template.category.toUpperCase()}</p>
              <h2 className="mt-2 font-mono text-base font-semibold text-zinc-100">{template.title}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-400">{template.metaDescription}</p>
              <p className="mt-3 font-mono text-xs text-zinc-500">
                {template.durationWeeks} weeks · {template.difficulty}
              </p>
              <Link
                href={`/templates/${template.slug}`}
                className="mt-4 inline-block border border-orange-900 bg-orange-950/30 px-3 py-2 font-mono text-xs tracking-widest text-orange-500 hover:bg-orange-950/50"
              >
                OPEN_TEMPLATE
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
