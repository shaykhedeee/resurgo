import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DemoSandbox from '@/components/marketing/DemoSandbox';
import EmailCapture from '@/components/marketing/EmailCapture';
import { getAllTools, getToolBySlug } from '@/lib/marketing/tools';

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) return {};

  return {
    title: `${tool.title} | Free Tool | RESURGO`,
    description: tool.summary,
    alternates: {
      canonical: `/tools/${slug}`,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) notFound();

  const allTools = await getAllTools();
  const otherTools = allTools.filter((item) => item.slug !== slug);
  const showSandbox = slug === 'free-brain-dump-to-task-list';

  return (
    <main className="min-h-screen bg-black">
      <article className="mx-auto max-w-5xl px-4 py-14">
        <p className="font-mono text-xs tracking-widest text-orange-500">FREE_TOOL</p>
        <h1 className="mt-2 font-mono text-3xl font-bold text-zinc-100">{tool.title}</h1>
        <p className="mt-4 max-w-3xl font-mono text-sm leading-relaxed text-zinc-300">{tool.summary}</p>

        <section className="mt-8 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Try it now</h2>

          <div className="mt-4">
            {showSandbox ? (
              <DemoSandbox />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded border border-zinc-800 bg-black p-4">
                  <p className="font-mono text-xs tracking-widest text-zinc-500">INPUT</p>
                  <h3 className="mt-2 font-mono text-sm font-semibold text-zinc-100">{tool.promptLabel}</h3>
                  <p className="mt-2 font-mono text-xs text-zinc-400">Drop your raw details here and preview how this tool structures the work.</p>
                </div>
                <div className="rounded border border-zinc-800 bg-black p-4">
                  <p className="font-mono text-xs tracking-widest text-zinc-500">OUTPUT</p>
                  <h3 className="mt-2 font-mono text-sm font-semibold text-zinc-100">{tool.outputLabel}</h3>
                  <p className="mt-2 font-mono text-xs text-zinc-400">Get a clean, action-ready result you can use immediately in your workflow.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 border border-zinc-900 bg-zinc-950 p-5">
          <h2 className="font-mono text-sm font-bold text-zinc-100">Free usage + unlock</h2>
          <p className="mt-3 font-mono text-xs text-zinc-400">
            Free limit: <span className="text-zinc-200">{tool.freeLimit}</span> uses. Want more?
          </p>
          <p className="mt-2 font-mono text-xs text-orange-400">{tool.cta}</p>

          <div className="mt-4 max-w-xl">
            <EmailCapture variant="inline" source={`tool_${slug}`} offer={tool.cta} />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="font-mono text-xs tracking-widest text-zinc-500">OTHER_TOOLS</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {otherTools.map((otherTool) => (
              <Link
                key={otherTool.slug}
                href={`/tools/${otherTool.slug}`}
                className="border border-zinc-800 px-3 py-1 font-mono text-xs text-zinc-400 hover:text-orange-400"
              >
                {otherTool.title}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
