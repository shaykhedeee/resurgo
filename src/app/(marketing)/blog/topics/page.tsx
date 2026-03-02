import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_TOPIC_CLUSTERS, getPostsForCluster } from '@/lib/blog/post-index';

export const metadata: Metadata = {
  title: 'Blog Topic Clusters — Resurgo',
  description: 'Explore topical content clusters on habits, deep work, procrastination, AI coaching, goal systems, and founder execution.',
  keywords: [
    'topic clusters',
    'productivity blog topics',
    'habit focus AI coaching content',
    'semantic SEO cluster pages',
  ],
  openGraph: {
    title: 'Resurgo Blog Topic Clusters',
    description: 'Explore structured topic clusters to learn habits, focus, AI coaching, and execution systems.',
    url: 'https://resurgo.life/blog/topics',
    type: 'website',
  },
  alternates: { canonical: 'https://resurgo.life/blog/topics' },
};

export default function BlogTopicsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Resurgo Blog Topic Clusters',
    itemListElement: BLOG_TOPIC_CLUSTERS.map((cluster, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: cluster.title,
      url: `https://resurgo.life/blog/topics/${cluster.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://resurgo.life/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://resurgo.life/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Topic Clusters',
        item: 'https://resurgo.life/blog/topics',
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-zinc-300">
          ← BACK_TO_BLOG
        </Link>

        <div className="mb-8 border border-zinc-900 bg-zinc-950 p-6">
          <h1 className="font-mono text-2xl font-bold text-zinc-100">Topical Cluster Pages</h1>
          <p className="mt-2 font-mono text-xs text-zinc-500">Browse content by topic to build depth faster and improve semantic relevance.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {BLOG_TOPIC_CLUSTERS.map((cluster) => {
            const postCount = getPostsForCluster(cluster.slug).length;
            return (
              <Link
                key={cluster.slug}
                href={`/blog/topics/${cluster.slug}`}
                className="block border border-zinc-900 bg-zinc-950 p-5 transition hover:border-zinc-700"
              >
                <p className="font-mono text-[10px] tracking-widest text-orange-500">CLUSTER</p>
                <h2 className="mt-2 font-mono text-base font-bold text-zinc-100">{cluster.title}</h2>
                <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">{cluster.description}</p>
                <p className="mt-3 font-mono text-[10px] text-zinc-400">{postCount} related articles</p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
