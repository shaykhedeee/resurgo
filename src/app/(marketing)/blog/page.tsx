import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PixelIcon } from '@/components/PixelIcon';
import { BLOG_POST_INDEX, BLOG_TOPIC_CLUSTERS } from '@/lib/blog/post-index';
import { TermLinkButton } from '@/components/ui/TermButton';

export const metadata: Metadata = {
  title: 'Blog — Productivity Tips, Habit Science & Goal Setting | Resurgo',
  description: 'Read evidence-based articles on habit formation, procrastination fixes, AI coaching, goal tracking systems, and deep work strategies. Resurgo blog — insights that help you build better habits.',
  keywords: [
    'productivity blog', 'habit science', 'goal setting tips', 'procrastination help',
    'AI coaching blog', 'deep work strategies', 'habit tracker tips', 'Resurgo blog',
    'atomic habits tips', 'focus techniques', 'personal development blog', 'habit streaks',
  ],
  openGraph: {
    title: 'Resurgo Blog — Productivity Tips, Habit Science & Goal Setting',
    description: 'Evidence-based insights on habit formation, focus, and building the life you want.',
    type: 'website',
    url: 'https://resurgo.life/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resurgo Blog — Productivity & Habit Science',
    description: 'Evidence-based insights on habit formation, focus, and goal achievement.',
  },
  alternates: { canonical: 'https://resurgo.life/blog' },
};

const POSTS = [...BLOG_POST_INDEX].sort((a, b) => {
  const aTime = new Date(a.lastModified ?? a.date).getTime();
  const bTime = new Date(b.lastModified ?? b.date).getTime();
  return bTime - aTime;
});

function toIsoDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export default function BlogPage() {
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'Resurgo Blog',
        description: 'Evidence-based insights on productivity, habit science, goal tracking, and personal development.',
        url: 'https://resurgo.life/blog',
        publisher: { '@type': 'Organization', name: 'Resurgo', url: 'https://resurgo.life' },
        blogPost: POSTS.map((post) => ({
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.desc,
          datePublished: toIsoDate(post.lastModified ?? post.date),
          url: `https://resurgo.life/blog/${post.slug}`,
          image: `https://resurgo.life${post.heroImage}`,
          author: { '@type': 'Organization', name: 'Resurgo' },
          keywords: post.tags.join(', '),
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Latest Articles',
        numberOfItems: POSTS.length,
        itemListElement: POSTS.map((post, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://resurgo.life/blog/${post.slug}`,
          name: post.title,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-10 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">RESURGO :: BLOG</span>
          </div>
          <div className="p-6">
            <div className="inline-flex items-center gap-2 border border-zinc-800 bg-black/40 px-3 py-1 font-mono text-[10px] tracking-widest text-orange-500">
              <PixelIcon name="terminal" size={11} />
              SIGNAL_FEED
            </div>
            <div className="mt-2 inline-flex items-center gap-2 border border-orange-900/50 bg-orange-950/20 px-3 py-1 font-mono text-[10px] tracking-widest text-orange-400">
              <PixelIcon name="check" size={11} />
              BETA_READY_CONTENT
            </div>
            <h1 className="mt-3 font-mono text-2xl font-bold text-zinc-100">Dispatches from the Grind</h1>
            <p className="mt-1 font-mono text-xs text-zinc-500">
              Evidence-based insights on productivity, habit science, and human performance. Simple ideas that actually work.
            </p>
          </div>
        </div>

        <div className="mb-8 border border-zinc-900 bg-zinc-950 p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-xs tracking-widest text-orange-500">TOPICAL_CLUSTERS</p>
            <Link href="/blog/topics" className="font-mono text-xs text-zinc-400 hover:text-zinc-300">VIEW_ALL →</Link>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {BLOG_TOPIC_CLUSTERS.slice(0, 4).map((cluster) => (
              <Link
                key={cluster.slug}
                href={`/blog/topics/${cluster.slug}`}
                className="inline-flex items-center gap-2 border border-zinc-800 bg-black/40 px-3 py-2 font-mono text-xs text-zinc-300 transition hover:border-zinc-700"
              >
                <PixelIcon name="grid" size={10} className="text-orange-500" />
                {cluster.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="block border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700 hover:bg-zinc-900">
              <Image
                src={post.heroImage}
                alt={post.title}
                width={1200}
                height={630}
                className="mb-4 h-40 w-full border border-zinc-800 object-cover"
                loading="lazy"
              />
              <div className="mb-3 flex items-center gap-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 font-mono text-xs tracking-widest text-orange-600 border border-orange-900/50 px-2 py-0.5">
                    <PixelIcon name="sparkles" size={10} />
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
              <h2 className="font-mono text-base font-bold text-zinc-100 leading-snug">{post.title}</h2>
              <p className="mt-2 font-mono text-xs text-zinc-500 leading-relaxed">{post.desc}</p>
              <div className="mt-4 flex items-center gap-4 font-mono text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1"><PixelIcon name="calendar" size={11} className="text-orange-500" />{post.date}</span>
                <span>&middot;</span>
                <span className="inline-flex items-center gap-1"><PixelIcon name="timer" size={11} className="text-orange-500" />{post.readTime} read</span>
                {post.lastModified && (
                  <>
                    <span>&middot;</span>
                    <span className="inline-flex items-center gap-1 text-orange-400"><PixelIcon name="check" size={11} className="text-orange-500" />updated</span>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 border border-dashed border-zinc-800 bg-zinc-950/50 p-6 text-center">
          <p className="font-mono text-xs text-zinc-400">
            Want to put these ideas into action?
          </p>
          <TermLinkButton href="/sign-up" variant="primary" size="md" className="mt-3">
            [TRY_RESURGO_FREE]
          </TermLinkButton>
        </div>
      </div>
    </main>
  );
}
