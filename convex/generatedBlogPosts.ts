import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const researchValidator = v.object({
  googleTrends: v.array(v.object({
    title: v.string(),
    url: v.optional(v.string()),
    traffic: v.optional(v.string()),
  })),
  redditSignals: v.array(v.object({
    title: v.string(),
    subreddit: v.string(),
    url: v.string(),
    score: v.number(),
    comments: v.number(),
  })),
  selectedTopic: v.string(),
  score: v.number(),
});

const statusValidator = v.union(
  v.literal('draft'),
  v.literal('published'),
  v.literal('rejected'),
);

export const upsert = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    desc: v.string(),
    content: v.string(),
    status: statusValidator,
    tags: v.array(v.string()),
    seoKeywords: v.array(v.string()),
    heroImage: v.string(),
    readTime: v.string(),
    research: researchValidator,
  },
  returns: v.object({ slug: v.string(), status: statusValidator }),
  handler: async (ctx, args) => {
    const now = Date.now();
    const existing = await ctx.db
      .query('generatedBlogPosts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    const patch = {
      title: args.title,
      desc: args.desc,
      content: args.content,
      status: args.status,
      tags: args.tags,
      seoKeywords: args.seoKeywords,
      heroImage: args.heroImage,
      readTime: args.readTime,
      research: args.research,
      updatedAt: now,
      ...(args.status === 'published' ? { publishedAt: existing?.publishedAt ?? now } : {}),
    };

    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert('generatedBlogPosts', {
        slug: args.slug,
        generatedAt: now,
        ...patch,
      });
    }

    return { slug: args.slug, status: args.status };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      slug: v.string(),
      title: v.string(),
      desc: v.string(),
      content: v.string(),
      status: statusValidator,
      tags: v.array(v.string()),
      seoKeywords: v.array(v.string()),
      heroImage: v.string(),
      readTime: v.string(),
      generatedAt: v.number(),
      publishedAt: v.optional(v.number()),
      updatedAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query('generatedBlogPosts')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .first();

    if (!post || post.status !== 'published') return null;

    return {
      slug: post.slug,
      title: post.title,
      desc: post.desc,
      content: post.content,
      status: post.status,
      tags: post.tags,
      seoKeywords: post.seoKeywords,
      heroImage: post.heroImage,
      readTime: post.readTime,
      generatedAt: post.generatedAt,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
    };
  },
});

export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.object({
    slug: v.string(),
    title: v.string(),
    desc: v.string(),
    tags: v.array(v.string()),
    readTime: v.string(),
    heroImage: v.string(),
    publishedAt: v.optional(v.number()),
    updatedAt: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 20, 100));
    const posts = await ctx.db
      .query('generatedBlogPosts')
      .withIndex('by_status', (q) => q.eq('status', 'published'))
      .collect();

    return posts
      .sort((a, b) => (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt))
      .slice(0, limit)
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        desc: post.desc,
        tags: post.tags,
        readTime: post.readTime,
        heroImage: post.heroImage,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
      }));
  },
});
