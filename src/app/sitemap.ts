// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Sitemap Configuration
// Dynamic sitemap for SEO optimization
// ═══════════════════════════════════════════════════════════════════════════════

import { MetadataRoute } from 'next';
import { BLOG_POST_INDEX, BLOG_TOPIC_CLUSTERS } from '@/lib/blog/post-index';
import { getAllTemplates } from '../lib/marketing/templates';
import { getAllComparisons } from '@/lib/marketing/compare';
import { getAllUseCases } from '@/lib/marketing/useCases';
import { getAllLearnTerms } from '@/lib/marketing/learn';
import { getAllTools } from '@/lib/marketing/tools';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

function getIsoTimestamp(input?: string): string | null {
  if (!input) return null;
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const [templates, comparisons, useCases, learnTerms, tools] = await Promise.all([
    getAllTemplates(),
    getAllComparisons(),
    getAllUseCases(),
    getAllLearnTerms(),
    getAllTools(),
  ]);

  const templateUrls: MetadataRoute.Sitemap = templates.map((template) => ({
    url: `${siteUrl}/templates/${template.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const comparisonUrls: MetadataRoute.Sitemap = comparisons.map((comparison) => ({
    url: `${siteUrl}/compare/${comparison.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.72,
  }));

  const useCaseUrls: MetadataRoute.Sitemap = useCases.map((useCase) => ({
    url: `${siteUrl}/use-cases/${useCase.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.74,
  }));

  const learnTermUrls: MetadataRoute.Sitemap = learnTerms.map((term) => ({
    url: `${siteUrl}/learn/${term.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.68,
  }));

  const toolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.76,
  }));
  
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
    // KEYWORD LANDING PAGES (niche audiences)
    // ─────────────────────────────────────────────────────────────────────────
    {
      url: `${siteUrl}/adhd`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${siteUrl}/solopreneurs`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.87,
    },
    {
      url: `${siteUrl}/indie-hackers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${siteUrl}/freelance-developers`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.86,
    },
    {
      url: `${siteUrl}/digital-nomads`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/content-creators`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${siteUrl}/ai-productivity-assistant`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.88,
    },
    {
      url: `${siteUrl}/vision-board-studio`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
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
      url: `${siteUrl}/templates`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.78,
    },
    {
      url: `${siteUrl}/use-cases`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.79,
    },
    {
      url: `${siteUrl}/learn`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.72,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/roadmap`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
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
      url: `${siteUrl}/download`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
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

  return [
    ...staticPages,
    ...blogTopicUrls,
    ...blogUrls,
    ...templateUrls,
    ...comparisonUrls,
    ...useCaseUrls,
    ...learnTermUrls,
    ...toolUrls,
  ];
}
