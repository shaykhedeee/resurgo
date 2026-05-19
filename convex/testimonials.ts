import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submit a testimonial (for users)
export const submitTestimonial = mutation({
  args: {
    name: v.string(),
    roleOrICP: v.string(),
    outcomeHeadline: v.string(),
    quote: v.string(),
    metricBadge: v.optional(v.string()),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    // Basic validation
    if (!args.name.trim() || !args.roleOrICP.trim() || !args.outcomeHeadline.trim() || !args.quote.trim()) {
      throw new Error("Name, role/ICP, outcome headline, and quote are required");
    }
    
    // Sanitize inputs (basic)
    const sanitizedArgs = {
      ...args,
      name: args.name.trim(),
      roleOrICP: args.roleOrICP.trim(),
      outcomeHeadline: args.outcomeHeadline.trim(),
      quote: args.quote.trim(),
      metricBadge: args.metricBadge?.trim() ?? undefined,
    };

    const testimonialId = await ctx.db.insert("testimonials", {
      ...sanitizedArgs,
      featured: false, // Default to not featured
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return testimonialId;
  }
});

// Get featured testimonials for display
export const getTestimonials = query({
  args: {
    limit: v.optional(v.number()), // Optional limit
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query("testimonials")
      .filter((q: any) => q.eq(q.field("featured"), true))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  }
});

// Get single testimonial by ID
export const getTestimonialById = query({
  args: {
    id: v.id("testimonials"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

// Feature a testimonial (admin function)
export const featureTestimonial = mutation({
  args: {
    id: v.id("testimonials"),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      featured: args.featured,
      updatedAt: Date.now(),
    });
    
    return args.id;
  }
});