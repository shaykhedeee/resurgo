import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTemplates, getTemplateBySlug } from '@/lib/marketing/templates';

interface TemplatePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const templates = await getAllTemplates();
  return templates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: TemplatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);
  if (!template) return {};

  return {
    title: `${template.title} — Free Template | RESURGO.life`,
    description: template.metaDescription,
    alternates: {
      canonical: `/templates/${template.slug}`,
    },
    openGraph: {
      title: `${template.title} | RESURGO Templates`,
      description: template.metaDescription,
      type: 'article',
      url: `/templates/${template.slug}`,
    },
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);
  if (!template) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: template.title,
    description: template.description,
    step: template.milestones.map((milestone, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: milestone.title,
      text: milestone.description,
    })),
  };

  return (
    <main className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="mx-auto max-w-4xl px-4 py-14">
        <p className="font-mono text-xs tracking-widest text-orange-500">FREE_GOAL_TEMPLATE</p>
        <h1 className="mt-2 font-mono text-3xl font-bold text-zinc-100">{template.title} — Free Template</h1>
        <p className="mt-4 font-mono text-sm leading-relaxed text-zinc-300">{template.description}</p>

        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Milestones</h2>
          <ul className="mt-3 space-y-2">
            {template.milestones.map((milestone) => (
              <li key={milestone.title} className="border border-zinc-900 bg-black p-3">
                <p className="font-mono text-xs tracking-widest text-orange-500">WEEK {milestone.weekNumber}</p>
                <p className="mt-1 font-mono text-sm text-zinc-100">{milestone.title}</p>
                <p className="mt-1 font-mono text-xs text-zinc-400">{milestone.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">Suggested Habits</h2>
            <ul className="mt-3 space-y-2">
              {template.suggestedHabits.map((habit) => (
                <li key={habit.name} className="font-mono text-xs text-zinc-300">
                  <span className="text-orange-500">▸</span> {habit.name} <span className="text-zinc-500">({habit.frequency})</span>
                  <p className="text-zinc-500">{habit.why}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-zinc-900 bg-zinc-950 p-5">
            <h2 className="font-mono text-sm font-bold text-zinc-100">First 7 Days</h2>
            <ul className="mt-3 space-y-2">
              {template.firstWeekTasks.map((task) => (
                <li key={`${task.day}-${task.title}`} className="font-mono text-xs text-zinc-300">
                  <span className="text-orange-500">Day {task.day}:</span> {task.title}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">FAQ</h2>
          <div className="mt-3 space-y-2">
            {template.faq.map((item) => (
              <details key={item.question} className="border border-zinc-900 bg-black p-3">
                <summary className="cursor-pointer font-mono text-xs text-zinc-200">{item.question}</summary>
                <p className="mt-2 font-mono text-xs text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href={`/sign-up?template=${template.slug}`} className="border border-orange-900 bg-orange-950/30 px-4 py-2 font-mono text-xs tracking-widest text-orange-500">
            START_THIS_GOAL_FREE
          </Link>
          <Link href="/templates" className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400">
            BACK_TO_TEMPLATES
          </Link>
        </div>

        <section className="mt-8">
          <h2 className="font-mono text-xs tracking-widest text-zinc-500">RELATED_TEMPLATES</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {template.relatedTemplates.map((relatedSlug) => (
              <Link key={relatedSlug} href={`/templates/${relatedSlug}`} className="border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-400 hover:text-orange-400">
                {relatedSlug}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
