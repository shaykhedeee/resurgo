// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo REST API v1 — API Key Authentication Helper
// All v1 routes call resolveApiKey() to get the authenticated userId.
// API keys are prefixed "rsg_" and stored as SHA-256 hashes in Convex.
// ═══════════════════════════════════════════════════════════════════════════════

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function resolveApiKey(
  authHeader: string | null,
): Promise<{ ownerId: string; rateLimitPerHour: number } | null> {
  if (!authHeader?.startsWith('Bearer rsg_')) return null;
  const rawKey = authHeader.slice('Bearer '.length);
  const keyHash = await sha256(rawKey);
  const result = await convex.query(api.apiKeys.validateByHash, { keyHash });
  if (!result) return null;
  // Fire-and-forget last-used update
  void convex.mutation(api.apiKeys.touchLastUsed, { keyHash });
  return { ownerId: String(result.ownerId), rateLimitPerHour: result.rateLimitPerHour };
}

export const convexClient = convex;
