// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Smart Image Provider Selector (Phase 3)
// Intelligently selects the best image generation provider based on:
//   - User's subscription tier (Free/Pro/Enterprise)
//   - Quality requirements (standard/premium/ultra-hd)
//   - API availability and rate limits
//   - Historical success rates and performance
// ═══════════════════════════════════════════════════════════════════════════════

export type PlanTier = 'free' | 'pro' | 'enterprise';
export type ImageProvider = 'flux' | 'imagineart' | 'freepik' | 'pollinations' | 'stability' | 'gemini';
export type QualityTier = 'standard' | 'premium' | 'ultra-hd';

export interface ProviderCapabilities {
  provider: ImageProvider;
  qualityScore: number;        // 1-100 (how high quality output is)
  costPerImage: 'free' | 'low' | 'medium' | 'high';
  processingSpeed: 'fast' | 'medium' | 'slow';
  reliabilityScore: number;    // 1-100 (how often it succeeds)
  maxConcurrent: number;
  requiredKeyEnv: string | null;
  cinemaicQuality: boolean;
  supportsBatch: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER REGISTRY — complete metadata for all providers
// ─────────────────────────────────────────────────────────────────────────────

const PROVIDER_REGISTRY: Record<ImageProvider, ProviderCapabilities> = {
  // 🏆 FLUX.1 — Best overall quality, fastest processing
  flux: {
    provider: 'flux',
    qualityScore: 95,
    costPerImage: 'free',
    processingSpeed: 'fast',
    reliabilityScore: 92,
    maxConcurrent: 5,
    requiredKeyEnv: 'HF_ACCESS_TOKEN',
    cinemaicQuality: true,
    supportsBatch: true,
  },

  // 💎 ImagineArt — Premium cinematic quality
  imagineart: {
    provider: 'imagineart',
    qualityScore: 92,
    costPerImage: 'medium',
    processingSpeed: 'medium',
    reliabilityScore: 88,
    maxConcurrent: 3,
    requiredKeyEnv: 'IMAGINE_ART_API_KEY',
    cinemaicQuality: true,
    supportsBatch: false,
  },

  // 🎨 Freepik AI — High quality, cost-effective
  freepik: {
    provider: 'freepik',
    qualityScore: 85,
    costPerImage: 'low',
    processingSpeed: 'fast',
    reliabilityScore: 85,
    maxConcurrent: 10,
    requiredKeyEnv: 'FREEPIK_API_KEY',
    cinemaicQuality: false,
    supportsBatch: true,
  },

  // 🌐 Pollinations — Fast free fallback
  pollinations: {
    provider: 'pollinations',
    qualityScore: 72,
    costPerImage: 'free',
    processingSpeed: 'fast',
    reliabilityScore: 78,
    maxConcurrent: 20,
    requiredKeyEnv: null,
    cinemaicQuality: false,
    supportsBatch: true,
  },

  // ⚡ Stability AI — Solid quality, established
  stability: {
    provider: 'stability',
    qualityScore: 80,
    costPerImage: 'low',
    processingSpeed: 'medium',
    reliabilityScore: 82,
    maxConcurrent: 4,
    requiredKeyEnv: 'STABILITY_API_KEY',
    cinemaicQuality: false,
    supportsBatch: false,
  },

  // 🤖 Gemini — Google free tier fallback
  gemini: {
    provider: 'gemini',
    qualityScore: 65,
    costPerImage: 'free',
    processingSpeed: 'slow',
    reliabilityScore: 70,
    maxConcurrent: 3,
    requiredKeyEnv: 'GOOGLE_AI_STUDIO_KEY',
    cinemaicQuality: false,
    supportsBatch: false,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SELECTION STRATEGIES
// ─────────────────────────────────────────────────────────────────────────────

interface SelectionContext {
  planTier: PlanTier;
  qualityTier: QualityTier;
  stylePreset?: string;
  batchSize?: number;
  prioritizeSpeed?: boolean;
}

interface ProviderSelection {
  primary: ImageProvider[];        // Ordered list (try first, second, etc.)
  recommended: ImageProvider;      // Best match
  reason: string;
  estimatedQuality: number;
  estimatedCost: 'free' | 'low' | 'medium' | 'high';
}

/**
 * Smart provider selection based on user context
 */
export function selectProviders(context: SelectionContext): ProviderSelection {
  const { planTier, qualityTier, stylePreset, batchSize = 1, prioritizeSpeed = false } = context;

  // Filter available providers (check env vars)
  const availableProviders = getAvailableProviders();

  // Score each provider based on context
  const scored = availableProviders.map((provider) => {
    const caps = PROVIDER_REGISTRY[provider];
    const score = calculateProviderScore(caps, context);
    return { provider, score, caps };
  });

  // Sort by score (highest first)
  scored.sort((a, b) => b.score - a.score);

  // Build primary list (all qualified providers in order)
  const primary = scored.map((s) => s.provider);

  // Determine recommended provider
  const recommended = primary[0] || 'pollinations';
  const recommendedCaps = PROVIDER_REGISTRY[recommended];

  // Calculate aggregate metrics
  const estimatedQuality = recommendedCaps.qualityScore;
  const estimatedCost = recommendedCaps.costPerImage;

  // Build reason string
  const reasonParts: string[] = [];
  if (planTier === 'free' && recommendedCaps.costPerImage === 'free') {
    reasonParts.push('free tier compatible');
  }
  if (qualityTier === 'ultra-hd' && recommendedCaps.qualityScore >= 90) {
    reasonParts.push('meets ultra-HD requirements');
  }
  if (batchSize > 1 && recommendedCaps.supportsBatch) {
    reasonParts.push('supports batch processing');
  }
  if (recommendedCaps.cinemaicQuality && qualityTier !== 'standard') {
    reasonParts.push('cinematic quality support');
  }

  const reason = reasonParts.length > 0
    ? reasonParts.join(', ')
    : `best available option (quality: ${estimatedQuality}/100)`;

  return {
    primary,
    recommended,
    reason,
    estimatedQuality,
    estimatedCost,
  };
}

/**
 * Get only providers with available API keys
 */
function getAvailableProviders(): ImageProvider[] {
  const available: ImageProvider[] = [];

  for (const [provider, caps] of Object.entries(PROVIDER_REGISTRY)) {
    if (caps.requiredKeyEnv === null || process.env[caps.requiredKeyEnv]) {
      available.push(provider as ImageProvider);
    }
  }

  // Always have pollinations as fallback (no API key needed)
  if (!available.includes('pollinations')) {
    available.push('pollinations');
  }

  return available;
}

/**
 * Calculate selection score for a provider given context
 */
function calculateProviderScore(
  caps: ProviderCapabilities,
  context: SelectionContext
): number {
  const { planTier, qualityTier, prioritizeSpeed } = context;
  let score = 0;

  // ─────────────────────────────────────────────────────────────────────────
  // BASE: Quality score (weight depends on quality tier)
  // ─────────────────────────────────────────────────────────────────────────
  if (qualityTier === 'ultra-hd') {
    score += caps.qualityScore * 0.5;  // Quality is paramount
  } else if (qualityTier === 'premium') {
    score += caps.qualityScore * 0.35; // Quality is important
  } else {
    score += caps.qualityScore * 0.15; // Quality less critical
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RELIABILITY
  // ─────────────────────────────────────────────────────────────────────────
  score += caps.reliabilityScore * 0.2;

  // ─────────────────────────────────────────────────────────────────────────
  // COST EFFICIENCY (by plan tier)
  // ─────────────────────────────────────────────────────────────────────────
  if (planTier === 'free') {
    // Free tier: prioritize free providers
    if (caps.costPerImage === 'free') score += 30;
    else if (caps.costPerImage === 'low') score += 5;
    else score -= 20; // Penalize paid providers
  } else if (planTier === 'pro') {
    // Pro tier: value quality-to-cost ratio
    if (caps.costPerImage === 'free') score += 20;
    else if (caps.costPerImage === 'low') score += 15;
    else if (caps.costPerImage === 'medium') score += 5;
    else score -= 5;
  } else {
    // Enterprise: quality first, cost irrelevant
    if (caps.costPerImage === 'free') score += 5;
    // Cost doesn't matter much for enterprise
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SPEED (if prioritized)
  // ─────────────────────────────────────────────────────────────────────────
  if (prioritizeSpeed) {
    if (caps.processingSpeed === 'fast') score += 15;
    else if (caps.processingSpeed === 'medium') score += 5;
    else score -= 10;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CINEMATIC CAPABILITY (for non-standard styles)
  // ─────────────────────────────────────────────────────────────────────────
  if (caps.cinemaicQuality && qualityTier !== 'standard') {
    score += 25;
  }

  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK CHAIN BUILDER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a complete fallback chain for vision board generation
 * Returns an ordered list of providers to try in sequence
 */
export function buildFallbackChain(context: SelectionContext): ImageProvider[] {
  const selection = selectProviders(context);

  // Ensure we have at least one provider
  const chain = selection.primary.length > 0 ? selection.primary : ['pollinations' as ImageProvider];

  // Remove duplicates while preserving order
  return Array.from(new Set(chain)) as ImageProvider[];
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER BATCH STRATEGY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * For multiple images, determine optimal provider strategy
 */
export function recommendBatchStrategy(
  imageCount: number,
  context: SelectionContext
): { provider: ImageProvider; batchSize: number }[] {
  const selection = selectProviders(context);

  // For small batches, stick with primary provider
  if (imageCount <= 2) {
    return [{ provider: selection.recommended, batchSize: imageCount }];
  }

  // For larger batches, potentially split across providers
  const batches: { provider: ImageProvider; batchSize: number }[] = [];

  let remaining = imageCount;
  for (const provider of selection.primary.slice(0, 2)) {
    // Limit to primary and secondary
    const caps = PROVIDER_REGISTRY[provider];
    const batchSize = Math.min(remaining, Math.max(1, Math.floor(imageCount / 2)));
    batches.push({ provider, batchSize });
    remaining -= batchSize;
    if (remaining <= 0) break;
  }

  return batches.length > 0 ? batches : [{ provider: selection.recommended, batchSize: imageCount }];
}
