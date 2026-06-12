import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';

export type GeneratedBlogPost = {
  slug: string;
  title: string;
  desc: string;
  content: string;
  status: 'published';
  tags: string[];
  seoKeywords: string[];
  heroImage: string;
  readTime: string;
  generatedAt: number;
  publishedAt?: number;
  updatedAt: number;
};

export type GeneratedBlogPostSummary = Omit<GeneratedBlogPost, 'content' | 'status' | 'generatedAt' | 'seoKeywords'>;

type GeneratedBlogApiShape = {
  generatedBlogPosts?: {
    getBySlug?: unknown;
    listPublished?: unknown;
  };
};

function getConvexClient(): ConvexHttpClient | null {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  return convexUrl ? new ConvexHttpClient(convexUrl) : null;
}

function asQuery(client: ConvexHttpClient): (reference: unknown, args: Record<string, unknown>) => Promise<unknown> {
  return client.query.bind(client) as unknown as (reference: unknown, args: Record<string, unknown>) => Promise<unknown>;
}

function isGeneratedPost(value: unknown): value is GeneratedBlogPost {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.slug === 'string' &&
    typeof record.title === 'string' &&
    typeof record.desc === 'string' &&
    typeof record.content === 'string' &&
    record.status === 'published' &&
    Array.isArray(record.tags) &&
    Array.isArray(record.seoKeywords) &&
    typeof record.heroImage === 'string' &&
    typeof record.readTime === 'string' &&
    typeof record.generatedAt === 'number' &&
    typeof record.updatedAt === 'number'
  );
}

function isGeneratedSummary(value: unknown): value is GeneratedBlogPostSummary {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.slug === 'string' &&
    typeof record.title === 'string' &&
    typeof record.desc === 'string' &&
    Array.isArray(record.tags) &&
    typeof record.heroImage === 'string' &&
    typeof record.readTime === 'string' &&
    typeof record.updatedAt === 'number'
  );
}

export async function getGeneratedBlogPost(slug: string): Promise<GeneratedBlogPost | null> {
  const client = getConvexClient();
  const apiRef = (api as unknown as GeneratedBlogApiShape).generatedBlogPosts?.getBySlug;
  if (!client || !apiRef) return null;

  try {
    const result = await asQuery(client)(apiRef, { slug });
    return isGeneratedPost(result) ? result : null;
  } catch {
    return null;
  }
}

export async function listGeneratedBlogPosts(limit = 50): Promise<GeneratedBlogPostSummary[]> {
  const client = getConvexClient();
  const apiRef = (api as unknown as GeneratedBlogApiShape).generatedBlogPosts?.listPublished;
  if (!client || !apiRef) return [];

  try {
    const result = await asQuery(client)(apiRef, { limit });
    return Array.isArray(result) ? result.filter(isGeneratedSummary) : [];
  } catch {
    return [];
  }
}
