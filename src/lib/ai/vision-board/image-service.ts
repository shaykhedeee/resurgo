// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Image Service (Section 24)
// Multi-provider image generation + stock image search cascade.
//
// GENERATION CASCADE ORDER:
//   1. Pollinations.ai   — Completely FREE. No API key. No sign-up. Public API.
//   2. Hugging Face      — FREE inference API. Requires HF_ACCESS_TOKEN env var.
//                          Model: black-forest-labs/FLUX.1-schnell (fast + quality)
//   3. Stability AI      — Stable Image Ultra. Very cheap (~$0.008/image).
//                          Env: STABILITY_API_KEY (get at platform.stability.ai)
//   4. Gemini            — Google free tier via GOOGLE_AI_STUDIO_KEY.
//
// STOCK IMAGE SEARCH CASCADE (for curated/inspirational images):
//   1. Getty Images      — Premium stock. Env: GETTY_API_KEY
//   2. Unsplash          — FREE. Env: UNSPLASH_ACCESS_KEY
//   3. Pexels            — FREE. Env: PEXELS_API_KEY
//
// SETUP:
//   - Pollinations:  nothing, works out of the box.
//   - HuggingFace:   get free token at huggingface.co/settings/tokens
//                    HF_ACCESS_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//   - Stability AI:  $10 free credits at platform.stability.ai
//                    STABILITY_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//   - Gemini:        already in your .env as GOOGLE_AI_STUDIO_KEY
//   - Getty:         developer.gettyimages.com → GETTY_API_KEY
//   - Unsplash:      unsplash.com/developers → UNSPLASH_ACCESS_KEY
//   - Pexels:        pexels.com/api → PEXELS_API_KEY
// ═══════════════════════════════════════════════════════════════════════════════

export type ImageProvider = 'pollinations' | 'huggingface' | 'stability' | 'gemini' | 'getty' | 'unsplash' | 'pexels' | 'none';

export interface ImageResult {
  success: boolean;
  imageData?: string; // base64 data URL  (data:image/jpeg;base64,...)
  imageUrl?: string;  // direct URL (for stock images)
  provider: ImageProvider;
  error?: string;
  attribution?: string; // credit for stock photos
}

export interface StockImageResult {
  id: string;
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer?: string;
  provider: 'getty' | 'unsplash' | 'pexels';
  attribution: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sanitise prompt for safe URL encoding (Pollinations) or API body
// ─────────────────────────────────────────────────────────────────────────────
function sanitise(prompt: string): string {
  return prompt
    .replace(/[^\w\s,.()\-–']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 1: Pollinations.ai — 100% free, no key, returns PNG from URL
// https://image.pollinations.ai/prompt/{encodedPrompt}
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithPollinations(prompt: string): Promise<ImageResult> {
  try {
    const encoded = encodeURIComponent(sanitise(prompt));
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&model=flux`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Pollinations HTTP ${response.status}`);

    // Response is binary PNG — read as arrayBuffer → base64
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = response.headers.get('content-type') ?? 'image/jpeg';

    return {
      success: true,
      imageData: `data:${mimeType};base64,${base64}`,
      provider: 'pollinations',
    };
  } catch (err) {
    return { success: false, provider: 'pollinations', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 2: HuggingFace Inference API — free tier
// Model: black-forest-labs/FLUX.1-schnell (fast, high quality)
// Sign up at huggingface.co → Settings → Access Tokens (free account)
// Env var: HF_ACCESS_TOKEN
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithHuggingFace(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.HF_ACCESS_TOKEN;
  if (!apiKey) return { success: false, provider: 'huggingface', error: 'HF_ACCESS_TOKEN not set' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40_000);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: sanitise(prompt) }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`HuggingFace ${response.status}: ${body.slice(0, 200)}`);
    }

    // Response is binary image blob
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = response.headers.get('content-type') ?? 'image/jpeg';

    return {
      success: true,
      imageData: `data:${mimeType};base64,${base64}`,
      provider: 'huggingface',
    };
  } catch (err) {
    return { success: false, provider: 'huggingface', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 3: Stability AI — Stable Image Core ($0.003/image, incredible quality)
// Env: STABILITY_API_KEY — get at platform.stability.ai ($10 free credits)
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithStability(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) return { success: false, provider: 'stability', error: 'STABILITY_API_KEY not set' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40_000);

    const formData = new FormData();
    formData.append('prompt', sanitise(prompt));
    formData.append('output_format', 'jpeg');
    formData.append('aspect_ratio', '1:1');

    const response = await fetch(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'image/*',
        },
        body: formData,
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Stability ${response.status}: ${body.slice(0, 200)}`);
    }

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');

    return {
      success: true,
      imageData: `data:image/jpeg;base64,${base64}`,
      provider: 'stability',
    };
  } catch (err) {
    return { success: false, provider: 'stability', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 4: Google Gemini — free tier via AI Studio
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithGemini(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.GOOGLE_AI_KEY || process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) return { success: false, provider: 'gemini', error: 'GOOGLE_AI_STUDIO_KEY not configured' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a motivational, visually striking image for a vision board: ${prompt}` }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Gemini ${response.status}: ${await response.text()}`);

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { mimeType: string; data: string } }> } }>;
    };

    const imagePart = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    if (!imagePart?.inlineData) throw new Error('No image in Gemini response');

    return {
      success: true,
      imageData: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      provider: 'gemini',
    };
  } catch (err) {
    return { success: false, provider: 'gemini', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entrypoint: cascade through providers
// ─────────────────────────────────────────────────────────────────────────────
export async function generateImage(prompt: string): Promise<ImageResult> {
  // 1. Pollinations — free, no setup
  const p = await generateWithPollinations(prompt);
  if (p.success) return p;
  console.warn('[ImageGen] Pollinations failed:', p.error, '— trying HuggingFace');

  // 2. HuggingFace — free tier (requires HF_ACCESS_TOKEN)
  const hf = await generateWithHuggingFace(prompt);
  if (hf.success) return hf;
  console.warn('[ImageGen] HuggingFace failed:', hf.error, '— trying Stability AI');

  // 3. Stability AI — very cheap ($0.003/image)
  const stability = await generateWithStability(prompt);
  if (stability.success) return stability;
  console.warn('[ImageGen] Stability failed:', stability.error, '— trying Gemini');

  // 4. Gemini — free tier
  const gemini = await generateWithGemini(prompt);
  if (gemini.success) return gemini;
  console.warn('[ImageGen] Gemini failed:', gemini.error, '— no image available');

  return { success: false, provider: 'none', error: 'All image providers failed' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate all panel images with adaptive rate limiting.
// Pollinations handles ~1 req/s safely; add 1.5s between requests.
// Returns Map<panelId, base64DataUrl> for successful generations only.
// ─────────────────────────────────────────────────────────────────────────────
export async function generateBoardImages(
  panels: Array<{ id: string; imagePrompt: string }>
): Promise<Map<string, string>> {
  const images = new Map<string, string>();

  for (let i = 0; i < panels.length; i++) {
    const panel = panels[i];
    const result = await generateImage(panel.imagePrompt);

    if (result.success && result.imageData) {
      images.set(panel.id, result.imageData);
      console.log(`[ImageGen] Panel ${i + 1}/${panels.length} generated via ${result.provider}`);
    } else {
      console.warn(`[ImageGen] Panel ${i + 1}/${panels.length} failed — panel will show icon placeholder`);
    }

    // Adaptive delay: Pollinations is free but rate-limited; 1.5s is safe
    if (i < panels.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  return images;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STOCK IMAGE SEARCH — For curated/inspirational vision board images
// Uses Getty Images, Unsplash, and Pexels APIs with cascade fallback.
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// Getty Images — Premium stock photography
// Env: GETTY_API_KEY (developer.gettyimages.com)
// ─────────────────────────────────────────────────────────────────────────────
async function searchGettyImages(query: string, limit = 12): Promise<StockImageResult[]> {
  const apiKey = process.env.GETTY_API_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const params = new URLSearchParams({
      phrase: query,
      page_size: String(limit),
      sort_order: 'best_match',
      orientations: 'Square,Horizontal',
      graphical_styles: 'photography',
      exclude_nudity: 'true',
      fields: 'id,title,display_sizes,artist',
    });

    const response = await fetch(
      `https://api.gettyimages.com/v3/search/images/creative?${params.toString()}`,
      {
        signal: controller.signal,
        headers: { 'Api-Key': apiKey },
      }
    );
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Getty HTTP ${response.status}`);

    const data = await response.json() as {
      images?: Array<{
        id: string;
        title: string;
        artist: string;
        display_sizes: Array<{ name: string; uri: string; width?: number; height?: number }>;
      }>;
    };

    return (data.images ?? []).map((img) => {
      const comp = img.display_sizes?.find((d) => d.name === 'comp') ?? img.display_sizes?.[0];
      const thumb = img.display_sizes?.find((d) => d.name === 'thumb') ?? comp;
      return {
        id: img.id,
        url: comp?.uri ?? '',
        thumbUrl: thumb?.uri ?? comp?.uri ?? '',
        width: comp?.width ?? 600,
        height: comp?.height ?? 400,
        alt: img.title ?? query,
        photographer: img.artist,
        provider: 'getty' as const,
        attribution: `© ${img.artist ?? 'Getty Images'} / Getty Images`,
      };
    }).filter((img) => img.url);
  } catch (err) {
    console.warn('[StockSearch] Getty failed:', (err as Error).message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Unsplash — FREE, high-quality photography
// Env: UNSPLASH_ACCESS_KEY (unsplash.com/developers — free tier: 50 req/hr)
// ─────────────────────────────────────────────────────────────────────────────
async function searchUnsplashImages(query: string, limit = 12): Promise<StockImageResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const params = new URLSearchParams({
      query,
      per_page: String(limit),
      orientation: 'squarish',
      content_filter: 'high',
    });

    const response = await fetch(
      `https://api.unsplash.com/search/photos?${params.toString()}`,
      {
        signal: controller.signal,
        headers: { Authorization: `Client-ID ${accessKey}` },
      }
    );
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Unsplash HTTP ${response.status}`);

    const data = await response.json() as {
      results?: Array<{
        id: string;
        alt_description: string | null;
        urls: { regular: string; small: string; thumb: string };
        width: number;
        height: number;
        user: { name: string; links: { html: string } };
      }>;
    };

    return (data.results ?? []).map((img) => ({
      id: img.id,
      url: img.urls.regular,
      thumbUrl: img.urls.small,
      width: img.width,
      height: img.height,
      alt: img.alt_description ?? query,
      photographer: img.user.name,
      provider: 'unsplash' as const,
      attribution: `Photo by ${img.user.name} on Unsplash`,
    }));
  } catch (err) {
    console.warn('[StockSearch] Unsplash failed:', (err as Error).message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pexels — FREE, curated photography
// Env: PEXELS_API_KEY (pexels.com/api — free tier: 200 req/hr)
// ─────────────────────────────────────────────────────────────────────────────
async function searchPexelsImages(query: string, limit = 12): Promise<StockImageResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const params = new URLSearchParams({
      query,
      per_page: String(limit),
      orientation: 'square',
    });

    const response = await fetch(
      `https://api.pexels.com/v1/search?${params.toString()}`,
      {
        signal: controller.signal,
        headers: { Authorization: apiKey },
      }
    );
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Pexels HTTP ${response.status}`);

    const data = await response.json() as {
      photos?: Array<{
        id: number;
        alt: string;
        width: number;
        height: number;
        photographer: string;
        src: { large: string; medium: string; small: string };
      }>;
    };

    return (data.photos ?? []).map((img) => ({
      id: String(img.id),
      url: img.src.large,
      thumbUrl: img.src.medium,
      width: img.width,
      height: img.height,
      alt: img.alt || query,
      photographer: img.photographer,
      provider: 'pexels' as const,
      attribution: `Photo by ${img.photographer} on Pexels`,
    }));
  } catch (err) {
    console.warn('[StockSearch] Pexels failed:', (err as Error).message);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main stock image search — cascade across all providers
// Returns combined results from available providers, merged and deduplicated.
// ─────────────────────────────────────────────────────────────────────────────
export async function searchStockImages(query: string, limit = 12): Promise<StockImageResult[]> {
  // Try all providers in parallel (each handles its own errors)
  const [getty, unsplash, pexels] = await Promise.all([
    searchGettyImages(query, limit),
    searchUnsplashImages(query, limit),
    searchPexelsImages(query, limit),
  ]);

  // Merge: prioritize Getty (premium), then Unsplash, then Pexels
  const combined = [...getty, ...unsplash, ...pexels];

  // Return up to the requested limit
  return combined.slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// Search curated images for a specific vision board domain/category
// ─────────────────────────────────────────────────────────────────────────────
const DOMAIN_SEARCH_QUERIES: Record<string, string[]> = {
  HEALTH: ['fitness motivation aesthetic', 'healthy lifestyle wellness', 'athletic body workout'],
  CAREER: ['business success modern', 'entrepreneur office inspiration', 'professional achievement'],
  WEALTH: ['luxury lifestyle modern', 'financial freedom abundance', 'dream home interior design'],
  RELATIONSHIP: ['happy couple love', 'family connection warmth', 'deep friendships joy'],
  LEARNING: ['education books knowledge', 'creative workspace study', 'personal growth reading'],
  TRAVEL: ['travel adventure destination', 'exotic beach paradise', 'mountain adventure exploration'],
  MINDSET: ['meditation peace zen', 'mindfulness calm nature', 'spiritual wellness serenity'],
  CREATIVITY: ['artistic studio creative', 'music art passion', 'creative expression design'],
};

export async function searchDomainImages(domain: string, limit = 8): Promise<StockImageResult[]> {
  const queries = DOMAIN_SEARCH_QUERIES[domain] ?? [`${domain} motivation inspiration`];
  // Pick a random query for variety
  const query = queries[Math.floor(Math.random() * queries.length)];
  return searchStockImages(query, limit);
}
