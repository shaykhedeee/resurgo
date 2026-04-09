import { mutation, query } from './_generated/server';
import type { QueryCtx, MutationCtx } from './_generated/server';
import { v } from 'convex/values';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function getAuthUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated');
  const user = await ctx.db
    .query('users')
    .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
    .unique();
  if (!user) throw new Error('User not found');
  return user;
}

const boardTypeValidator = v.optional(v.union(
  v.literal('goals'),
  v.literal('lifestyle'),
  v.literal('yearly'),
  v.literal('domain'),
  v.literal('gratitude'),
  v.literal('custom'),
));

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SAVE â€” Deactivates previous board then inserts the new one
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const save = mutation({
  args: {
    config: v.string(),
    version: v.number(),
    boardType: boardTypeValidator,
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  returns: v.id('visionBoards'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);

    // Deactivate all existing boards for this user
    const existing = await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();

    for (const board of existing) {
      await ctx.db.patch(board._id, { isActive: false, updatedAt: Date.now() });
    }

    return await ctx.db.insert('visionBoards', {
      userId: user._id,
      config: args.config,
      version: args.version,
      isActive: true,
      boardType: args.boardType,
      title: args.title,
      description: args.description,
      tags: args.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// GET ACTIVE BOARD for the authenticated user
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const getActive = query({
  args: {},
  returns: v.union(v.null(), v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .first() ?? null;
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// LIST ALL BOARDS for the authenticated user (history)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const list = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    return await ctx.db
      .query('visionBoards')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DELETE â€” Hard delete a board (GDPR)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const remove = mutation({
  args: { boardId: v.id('visionBoards') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== user._id) return false;
    await ctx.db.delete(args.boardId);
    return true;
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// UPDATE â€” Patch board metadata (title, tags, favorite, boardType)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const update = mutation({
  args: {
    boardId: v.id('visionBoards'),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isFavorite: v.optional(v.boolean()),
    boardType: boardTypeValidator,
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== user._id) return false;

    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    if (args.title !== undefined) patch.title = args.title;
    if (args.description !== undefined) patch.description = args.description;
    if (args.tags !== undefined) patch.tags = args.tags;
    if (args.isFavorite !== undefined) patch.isFavorite = args.isFavorite;
    if (args.boardType !== undefined) patch.boardType = args.boardType;

    await ctx.db.patch(args.boardId, patch);
    return true;
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ACTIVATE â€” Set a specific board as active
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const activate = mutation({
  args: { boardId: v.id('visionBoards') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== user._id) return false;

    // Deactivate all other boards
    const active = await ctx.db
      .query('visionBoards')
      .withIndex('by_user_active', (q) =>
        q.eq('userId', user._id).eq('isActive', true)
      )
      .collect();

    for (const b of active) {
      if (b._id !== args.boardId) {
        await ctx.db.patch(b._id, { isActive: false, updatedAt: Date.now() });
      }
    }

    await ctx.db.patch(args.boardId, { isActive: true, updatedAt: Date.now() });
    return true;
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DUPLICATE â€” Clone a board for variation
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const duplicate = mutation({
  args: { boardId: v.id('visionBoards') },
  returns: v.union(v.null(), v.id('visionBoards')),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== user._id) return null;

    return await ctx.db.insert('visionBoards', {
      userId: user._id,
      config: board.config,
      version: board.version,
      isActive: false,
      boardType: board.boardType,
      title: board.title ? `${board.title} (Copy)` : undefined,
      description: board.description,
      tags: board.tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PATCH PANEL â€” Replace one panel's imageData + affirmation in the active board
// Used by the per-panel regeneration endpoint
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const patchPanel = mutation({
  args: {
    boardId: v.id('visionBoards'),
    panelId: v.string(),
    imageData: v.optional(v.string()),
    imagePrompt: v.optional(v.string()),
    affirmation: v.optional(v.string()),
    goalTitle: v.optional(v.string()),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== user._id) return false;

    let config: Record<string, unknown>;
    try {
      config = JSON.parse(board.config as string) as Record<string, unknown>;
    } catch {
      return false;
    }

    const panels = config.panels as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(panels)) return false;

    const panelIndex = panels.findIndex((p) => p.id === args.panelId);
    if (panelIndex === -1) return false;

    const updatedPanel = { ...panels[panelIndex] };
    if (args.imageData !== undefined) updatedPanel.imageData = args.imageData;
    if (args.imagePrompt !== undefined) updatedPanel.imagePrompt = args.imagePrompt;
    if (args.affirmation !== undefined) updatedPanel.affirmation = args.affirmation;
    if (args.goalTitle !== undefined) updatedPanel.goalTitle = args.goalTitle;

    const updatedPanels = [...panels];
    updatedPanels[panelIndex] = updatedPanel;

    await ctx.db.patch(args.boardId, {
      config: JSON.stringify({ ...config, panels: updatedPanels }),
      updatedAt: Date.now(),
    });

    return true;
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PATCH AFFIRMATION â€” Quick-edit a panel affirmation in place
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const patchAffirmation = mutation({
  args: {
    boardId: v.id('visionBoards'),
    panelId: v.string(),
    affirmation: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== user._id) return false;

    let config: Record<string, unknown>;
    try {
      config = JSON.parse(board.config as string) as Record<string, unknown>;
    } catch { return false; }

    const panels = config.panels as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(panels)) return false;

    const panelIndex = panels.findIndex((p) => p.id === args.panelId);
    if (panelIndex === -1) return false;

    const updatedPanels = [...panels];
    updatedPanels[panelIndex] = { ...updatedPanels[panelIndex], affirmation: args.affirmation };

    await ctx.db.patch(args.boardId, {
      config: JSON.stringify({ ...config, panels: updatedPanels }),
      updatedAt: Date.now(),
    });
    return true;
  },
});

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// VISION BOARD IMAGE BOOKMARKS
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export const saveImage = mutation({
  args: {
    imageUrl: v.string(),
    thumbUrl: v.string(),
    alt: v.string(),
    photographer: v.optional(v.string()),
    provider: v.string(),
    attribution: v.string(),
    domain: v.optional(v.string()),
  },
  returns: v.id('visionBoardImages'),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.insert('visionBoardImages', {
      userId: user._id,
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const listSavedImages = query({
  args: { domain: v.optional(v.string()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    if (args.domain) {
      return await ctx.db
        .query('visionBoardImages')
        .withIndex('by_user_domain', (q) =>
          q.eq('userId', user._id).eq('domain', args.domain)
        )
        .collect();
    }
    return await ctx.db
      .query('visionBoardImages')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});

export const removeImage = mutation({
  args: { imageId: v.id('visionBoardImages') },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const img = await ctx.db.get(args.imageId);
    if (!img || img.userId !== user._id) return false;
    await ctx.db.delete(args.imageId);
    return true;
  },
});
