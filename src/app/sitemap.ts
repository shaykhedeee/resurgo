// ═══════════════════════════════════════════════════════════════════════════════
// AscendifyIFY - Sitemap Configuration
// Dynamic sitemap for SEO optimization
// ═══════════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';
import { BLOG_POST_INDEX, BLOG_TOPIC_CLUSTERS } from '@/lib/blog/post-index';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function getIsoTimestamp(input?: string): string | null {
  if (!input) return null;
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  const latestBlogTimestamp = BLOG_POST_INDEX
    .map((post) => getIsoTimestamp(post.lastModified) ?? getIsoTimestamp(post.date))
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => (a < b ? 1 : -1))[0] ?? currentDate;

  const blogUrls: MetadataRoute.Sitemap = BLOG_POST_INDEX.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: getIsoTimestamp(post.lastModified) ?? getIsoTimestamp(post.date) ?? currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blogTopicUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/blog/topics`,
      lastModified: latestBlogTimestamp,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...BLOG_TOPIC_CLUSTERS.map((cluster) => ({
      url: `${siteUrl}/blog/topics/${cluster.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
  ];
  
  // Static pages with their SEO priority and change frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // ─────────────────────────────────────────────────────────────────────────
    // GUIDES (High SEO Value - Pillar Content)
    // ─────────────────────────────────────────────────────────────────────────
    {
      url: `${siteUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/guides/atomic-habits-guide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // ─────────────────────────────────────────────────────────────────────────
    // BLOG (High SEO Value - Content Marketing)
    // ─────────────────────────────────────────────────────────────────────────
    {
      url: `${siteUrl}/blog`,
      lastModified: latestBlogTimestamp,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog/rss.xml`,
      lastModified: latestBlogTimestamp,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/llms.txt`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // ─────────────────────────────────────────────────────────────────────────
    // HELP CENTER
    // ─────────────────────────────────────────────────────────────────────────
    {
      url: `${siteUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/help/getting-started`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/help/features`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/help/habits-goals`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/help/account`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/help/troubleshooting`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/help/refund`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/help/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // ─────────────────────────────────────────────────────────────────────────
    // KEY MARKETING PAGES
    // ─────────────────────────────────────────────────────────────────────────
    {
      url: `${siteUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/changelog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/billing`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/sign-up`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/sign-in`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // ─────────────────────────────────────────────────────────────────────────
    // LEGAL & SUPPORT
    // ─────────────────────────────────────────────────────────────────────────
    {
      url: `${siteUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Future: Add dynamic pages (blog posts, user profiles, etc.)
  // const blogPosts = await getBlogPosts();
  // const blogUrls = blogPosts.map((post) => ({
  //   url: `${siteUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }));

  return [...staticPages, ...blogTopicUrls, ...blogUrls];
}
