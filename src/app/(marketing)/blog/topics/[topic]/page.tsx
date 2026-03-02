import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_TOPIC_CLUSTERS, getPostsForCluster } from '@/lib/blog/post-index';

export async function generateStaticParams() {
  return BLOG_TOPIC_CLUSTERS.map((cluster) => ({ topic: cluster.slug }));
}

export async function generateMetadata({ params }: { params: { topic: string } }): Promise<Metadata> {
  const cluster = BLOG_TOPIC_CLUSTERS.find((item) => item.slug === params.topic);
  if (!cluster) return { title: 'Not Found' };

  return {
    title: `${cluster.title} — Resurgo Blog Cluster`,
    description: cluster.description,
    keywords: cluster.keywords,
    openGraph: {
      title: `${cluster.title} — Resurgo`,
      description: cluster.description,
      url: `https://resurgo.life/blog/topics/${cluster.slug}`,
      type: 'website',
    },
    alternates: { canonical: `https://resurgo.life/blog/topics/${cluster.slug}` },
  };
}

export default function BlogTopicDetailPage({ params }: { params: { topic: string } }) {
  const cluster = BLOG_TOPIC_CLUSTERS.find((item) => item.slug === params.topic);
  if (!cluster) notFound();

  const posts = getPostsForCluster(cluster.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cluster.title,
    description: cluster.description,
    url: `https://resurgo.life/blog/topics/${cluster.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://resurgo.life/blog/${post.slug}`,
        name: post.title,
      })),
    },
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
      {
        '@type': 'ListItem',
        position: 4,
        name: cluster.title,
        item: `https://resurgo.life/blog/topics/${cluster.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <Link href="/blog/topics" className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-zinc-400 hover:text-zinc-300">
          ← BACK_TO_CLUSTERS
        </Link>

        <div className="mb-8 border border-zinc-900 bg-zinc-950 p-6">
          <p className="font-mono text-[10px] tracking-widest text-orange-500">TOPIC_CLUSTER</p>
          <h1 className="mt-2 font-mono text-2xl font-bold text-zinc-100">{cluster.title}</h1>
          <p className="mt-2 font-mono text-xs text-zinc-500">{cluster.description}</p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block border border-zinc-900 bg-zinc-950 p-5 transition hover:border-zinc-700">
              <Image
                src={post.heroImage}
                alt={post.title}
                width={1200}
                height={630}
                className="mb-3 h-40 w-full border border-zinc-800 object-cover"
                loading="lazy"
              />
              <h2 className="font-mono text-base font-bold text-zinc-100">{post.title}</h2>
              <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">{post.desc}</p>
              <p className="mt-3 font-mono text-[10px] text-zinc-400">{post.date} · {post.readTime}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
