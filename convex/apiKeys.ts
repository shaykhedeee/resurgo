import { v } from 'convex/values';
import { mutation, query, action, internalMutation } from './_generated/server';
import { api, internal } from './_generated/api';

async function requireUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Unauthenticated');
  const user = await ctx.db.query('users').withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject)).first();
  if (!user) throw new Error('User not found');
  return user;
}

function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'rsg_';
  for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];
  return key;
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const listApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const keys = await ctx.db.query('apiKeys').withIndex('by_userId', (q: any) => q.eq('userId', user._id)).collect();
    return keys
      .filter((k: any) => !k.revokedAt)
      .map((k: any) => ({
        _id: k._id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        createdAt: k.createdAt,
        lastUsedAt: k.lastUsedAt,
        rateLimitPerHour: k.rateLimitPerHour,
      }));
  },
});

export const generateKey = action({
  args: { name: v.string() },
  handler: async (ctx, { name }): Promise<{ keyPrefix: string; fullKey: string; id: any }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Unauthenticated');
    const user = await ctx.runQuery(api.users.current);
    if (!user) throw new Error('User not found');

    const fullKey = generateApiKey();
    const keyHash = await sha256(fullKey);
    const keyPrefix = fullKey.slice(0, 8);

    const id = await ctx.runMutation(internal.apiKeys.insertKey, {
      userId: user._id,
      name,
      keyHash,
      keyPrefix,
      rateLimitPerHour: user.plan === 'pro' ? 1000 : 100,
    });

    return { keyPrefix, fullKey, id };
  },
});

export const insertKey = internalMutation({
  args: {
    userId: v.id('users'),
    name: v.string(),
    keyHash: v.string(),
    keyPrefix: v.string(),
    rateLimitPerHour: v.number(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('apiKeys', { ...args, createdAt: Date.now() });
  },
});

export const revokeKey = mutation({
  args: { id: v.id('apiKeys') },
  handler: async (ctx, { id }) => {
    const user = await requireUser(ctx);
    const key = await ctx.db.get(id);
    if (!key || key.userId !== user._id) throw new Error('Access denied');
    await ctx.db.patch(id, { revokedAt: Date.now() });
  },
});

// Used by REST API v1 routes — validates API key hash and returns userId
export const validateByHash = query({
  args: { keyHash: v.string() },
  handler: async (ctx, { keyHash }) => {
    const key = await ctx.db
      .query('apiKeys')
      .withIndex('by_keyHash', (q: any) => q.eq('keyHash', keyHash))
      .first();
    if (!key || key.revokedAt) return null;
    return { userId: key._id, ownerId: key.userId, rateLimitPerHour: key.rateLimitPerHour };
  },
});

export const touchLastUsed = mutation({
  args: { keyHash: v.string() },
  handler: async (ctx, { keyHash }) => {
    const key = await ctx.db
      .query('apiKeys')
      .withIndex('by_keyHash', (q: any) => q.eq('keyHash', keyHash))
      .first();
    if (key && !key.revokedAt) await ctx.db.patch(key._id, { lastUsedAt: Date.now() });
  },
});
