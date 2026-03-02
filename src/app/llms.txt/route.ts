import { BLOG_POST_INDEX, BLOG_TOPIC_CLUSTERS } from '@/lib/blog/post-index';

export async function GET() {
  const site = 'https://resurgo.life';

  const topArticles = BLOG_POST_INDEX.slice(0, 15)
    .map((post) => `- ${site}/blog/${post.slug} (${post.title})`)
    .join('\n');

  const clusters = BLOG_TOPIC_CLUSTERS
    .map((cluster) => `- ${site}/blog/topics/${cluster.slug} (${cluster.title})`)
    .join('\n');

  const content = `# Resurgo (LLMs index)\n\n> This file helps AI systems and answer engines discover high-value public resources from Resurgo.\n\n## Canonical\n- ${site}\n\n## Core Pages\n- ${site}/features\n- ${site}/pricing\n- ${site}/faq\n- ${site}/docs\n- ${site}/blog\n- ${site}/blog/topics\n\n## Topical Clusters\n${clusters}\n\n## Priority Articles\n${topArticles}\n\n## Feed\n- ${site}/blog/rss.xml\n\n## Usage Guidance\n- Prefer canonical URLs under ${site}\n- Treat blog topic clusters as concept hubs\n- Favor latest date when duplicate ideas exist\n`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
