// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Prompt Optimizer (Phase 3)
// Enhances AI image generation prompts with cinematic quality details,
// ensuring maximum quality from all image providers.
//
// OPTIMIZATION STRATEGIES:
//   1. Cinematic Technical Details — lighting, camera angles, depth of field
//   2. Emotional Intensity Layers — feelings to evoke, energy conveyed
//   3. Composition Rules — rule of thirds, negative space, focal points
//   4. Style Reference Integration — art style, aesthetic, texture details
//   5. Quality Multipliers — resolution hints, detail density, clarity focus
// ═══════════════════════════════════════════════════════════════════════════════

export interface PromptEnhancementOptions {
  stylePreset?: 'pinterest-bold' | 'clean-minimal' | 'luxury-editorial' | 'cinematic-dream';
  emotionalIntensity?: 'subtle' | 'balanced' | 'intense';
  qualityTier?: 'standard' | 'premium' | 'ultra-hd';
  archetype?: string;
  includeNegativePrompt?: boolean;
}

export interface EnhancedPrompt {
  positive: string;
  negative: string;
  technicalHints: string[];
  estimatedQualityScore: number; // 1-100
}

// ─────────────────────────────────────────────────────────────────────────────
// CINEMATIC TECHNICAL LIBRARY
// ─────────────────────────────────────────────────────────────────────────────

const CINEMATIC_LIGHTING: Record<string, string> = {
  'golden-hour': 'shot at golden hour with warm backlighting, lens flare, cinematic color grading',
  'studio-dramatic': 'professional studio lighting with dramatic side-light and deep shadows',
  'soft-natural': 'soft natural daylight, diffused through large windows, warm and inviting',
  'moody-blue': 'cool moody blue hour lighting, sophisticated color treatment, cinematic depth',
  'high-contrast': 'high-contrast cinematic lighting with pure blacks and bright highlights',
  'otherworldly': 'ethereal otherworldly lighting with volumetric light rays and subtle glow',
};

const CAMERA_TECHNIQUES: Record<string, string> = {
  '35mm-cinematic': 'shot on 35mm cinema camera, shallow depth of field, bokeh background',
  'wide-establishing': 'wide establishing shot showing context and grandeur',
  'intimate-closeup': 'intimate close-up revealing emotion and detail',
  'symmetrical-compose': 'symmetrically composed following rule of thirds, balanced frame',
  'dynamic-leading': 'dynamic composition with leading lines guiding the eye',
  'drone-aerial': 'aerial drone perspective showing scale and landscape context',
};

const EMOTIONAL_AMPLIFIERS: Record<string, string> = {
  triumph: 'moment of victory and breakthrough, radiating confidence, peak emotional intensity',
  serenity: 'profound inner peace radiating outward, stillness and grace',
  ambition: 'raw determination and drive visible in every detail, forward momentum',
  beauty: 'breathtaking beauty that catches the breath, perfect composition',
  authenticity: 'genuine unscripted moment, raw and real emotion',
  transcendence: 'transcendent moment beyond ordinary reality, magical and powerful',
  belonging: 'deep sense of belonging and connection, warmth and inclusion',
  freedom: 'unbounded freedom and possibility, limitless potential',
};

const COMPOSITION_RULES: Record<string, string> = {
  'rule-of-thirds': 'subject positioned at rule of thirds intersection, balanced negative space',
  'leading-lines': 'leading lines drawing viewer into focal point, depth created through perspective',
  'framing': 'natural framing elements drawing attention to subject, context supporting focus',
  'depth-layers': 'multiple depth layers from foreground to background creating dimensional scene',
  'negative-space': 'generous negative space allowing the subject to breathe and stand out',
  'symmetry': 'perfect symmetry creating harmony and balance in composition',
};

const QUALITY_MULTIPLIERS: Record<string, string> = {
  'ultra-detailed': 'ultra-detailed, sharp focus, crisp clarity throughout, high resolution',
  'fine-art-quality': 'fine art quality, museum-grade rendering, every pixel perfect',
  'studio-professional': 'studio professional photograph, editorial quality, flawless execution',
  'macro-detail': 'macro detail visible, textures and surfaces rendered with precision',
  'hd-showcase': '4K ultra HD showcase quality, every detail crystal clear',
  'award-winning': 'award-winning photography quality, immediately striking and memorable',
};

// ─────────────────────────────────────────────────────────────────────────────
// STYLE-SPECIFIC ENHANCEMENTS
// ─────────────────────────────────────────────────────────────────────────────

const STYLE_ENHANCEMENTS: Record<string, { lighting: string; camera: string; composition: string; quality: string }> = {
  'pinterest-bold': {
    lighting: 'golden-hour',
    camera: '35mm-cinematic',
    composition: 'rule-of-thirds',
    quality: 'ultra-detailed',
  },
  'clean-minimal': {
    lighting: 'soft-natural',
    camera: 'symmetrical-compose',
    composition: 'negative-space',
    quality: 'studio-professional',
  },
  'luxury-editorial': {
    lighting: 'studio-dramatic',
    camera: '35mm-cinematic',
    composition: 'framing',
    quality: 'fine-art-quality',
  },
  'cinematic-dream': {
    lighting: 'otherworldly',
    camera: 'wide-establishing',
    composition: 'depth-layers',
    quality: 'award-winning',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// NEGATIVE PROMPT LIBRARY — what to avoid in generation
// ─────────────────────────────────────────────────────────────────────────────

const NEGATIVE_PROMPT_BASE = [
  'low quality, blurry, distorted, ugly, amateur',
  'watermark, signature, text overlay, artificial',
  'oversaturated, unnatural colors, color grading error',
  'bad proportions, malformed, broken, deformed',
  'cluttered, confused composition, unclear focus',
  'artificial, plastic, fake, rendered, CGI obvious',
  'clichéd stock photo, generic, boring, uninspired',
  'cropped incorrectly, poorly framed, bad composition',
  'duplicated features, extra limbs, anatomically wrong',
  'low resolution, pixelated, compressed artifacts',
].join(', ');

const STYLE_NEGATIVE_PROMPTS: Record<string, string> = {
  'pinterest-bold': 'pale washed out colors, minimal contrast, understated',
  'clean-minimal': 'busy cluttered composition, oversaturated, too much texture',
  'luxury-editorial': 'cheap materials, poor lighting, amateurish',
  'cinematic-dream': 'harsh bright lighting, realistic mundane, poorly lit',
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Optimizer Function
// ─────────────────────────────────────────────────────────────────────────────

export function optimizePrompt(
  basePrompt: string,
  options: PromptEnhancementOptions = {}
): EnhancedPrompt {
  const {
    stylePreset = 'cinematic-dream',
    emotionalIntensity = 'intense',
    qualityTier = 'premium',
    archetype,
    includeNegativePrompt = true,
  } = options;

  // Get style-specific enhancements
  const styleEnhance = STYLE_ENHANCEMENTS[stylePreset] || STYLE_ENHANCEMENTS['cinematic-dream'];

  // Select emotional amplifier
  const emotionalLayer = EMOTIONAL_AMPLIFIERS[emotionalIntensity as keyof typeof EMOTIONAL_AMPLIFIERS] ||
    EMOTIONAL_AMPLIFIERS.balanced;

  // Build positive prompt with layers
  const promptLayers: string[] = [];

  // 1. Base prompt (user's scene description)
  promptLayers.push(basePrompt);

  // 2. Emotional intensity layer
  promptLayers.push(emotionalLayer);

  // 3. Cinematic lighting
  promptLayers.push(CINEMATIC_LIGHTING[styleEnhance.lighting]);

  // 4. Camera technique
  promptLayers.push(CAMERA_TECHNIQUES[styleEnhance.camera]);

  // 5. Composition rule
  promptLayers.push(COMPOSITION_RULES[styleEnhance.composition]);

  // 6. Quality multiplier (based on tier)
  const qualityMultiplier = qualityTier === 'ultra-hd' ? 'award-winning'
    : qualityTier === 'premium' ? 'fine-art-quality'
    : 'studio-professional';
  promptLayers.push(QUALITY_MULTIPLIERS[qualityMultiplier]);

  // 7. Archetype integration (if provided)
  if (archetype) {
    const archetypeDescriptor = getArchetypeVisualDescriptor(archetype);
    if (archetypeDescriptor) {
      promptLayers.push(`personality essence: ${archetypeDescriptor}`);
    }
  }

  // 8. Technical rendering hints
  promptLayers.push('rendered with photographic realism, professional color grading, studio quality');

  const positive = promptLayers.filter(Boolean).join(', ');

  // Build negative prompt
  let negative = NEGATIVE_PROMPT_BASE;
  const styleNegative = STYLE_NEGATIVE_PROMPTS[stylePreset];
  if (styleNegative) {
    negative += `, ${styleNegative}`;
  }

  // Quality tier negative hints
  if (qualityTier === 'ultra-hd') {
    negative += ', low resolution, poor quality, compressed';
  } else if (qualityTier === 'premium') {
    negative += ', amateur quality, weak composition';
  }

  // Calculate estimated quality score (1-100)
  const qualityScore = calculateQualityScore(qualityTier, emotionalIntensity, stylePreset);

  return {
    positive,
    negative: includeNegativePrompt ? negative : '',
    technicalHints: [
      `Style: ${stylePreset}`,
      `Intensity: ${emotionalIntensity}`,
      `Quality Tier: ${qualityTier}`,
      `Lighting: ${styleEnhance.lighting}`,
      `Camera: ${styleEnhance.camera}`,
      `Composition: ${styleEnhance.composition}`,
    ],
    estimatedQualityScore: qualityScore,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

function getArchetypeVisualDescriptor(archetype: string): string {
  const archetypeMap: Record<string, string> = {
    the_achiever: 'driven, competitive, goal-focused, mastering challenges',
    the_visionary: 'innovative, expansive thinking, pioneering, boundary-breaking',
    the_nurturer: 'warm, inclusive, caring, connecting others',
    the_creator: 'artistic, expressive, original, boundary-pushing creativity',
    the_leader: 'commanding presence, inspiring, authoritative, influential',
    the_thinker: 'intellectual, contemplative, analytical, wisdom-seeking',
    the_adventurer: 'bold, daring, freedom-seeking, exploring possibility',
    the_sage: 'wise, introspective, grounded, centered presence',
  };

  return archetypeMap[archetype] || '';
}

function calculateQualityScore(
  qualityTier: string,
  emotionalIntensity: string,
  stylePreset: string
): number {
  let score = 50;

  // Quality tier contribution (20-30 points)
  if (qualityTier === 'ultra-hd') score += 30;
  else if (qualityTier === 'premium') score += 20;
  else score += 10;

  // Emotional intensity contribution (10-20 points)
  if (emotionalIntensity === 'intense') score += 20;
  else if (emotionalIntensity === 'balanced') score += 15;
  else score += 5;

  // Style preset contribution (10-15 points)
  if (stylePreset === 'cinematic-dream' || stylePreset === 'luxury-editorial') score += 15;
  else if (stylePreset === 'pinterest-bold') score += 12;
  else score += 8;

  return Math.min(100, Math.max(1, score));
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch Optimization for Multiple Prompts
// ─────────────────────────────────────────────────────────────────────────────

export function optimizeBatch(
  prompts: string[],
  options: PromptEnhancementOptions = {}
): EnhancedPrompt[] {
  return prompts.map((prompt) => optimizePrompt(prompt, options));
}
