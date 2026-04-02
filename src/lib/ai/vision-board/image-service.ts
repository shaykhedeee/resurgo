// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Image Service (Section 24)
// Multi-provider image generation + stock image search cascade.
//
// GENERATION CASCADE ORDER (best quality first):
//   1. HuggingFace FLUX.1-schnell — Primary. Env: HF_ACCESS_TOKEN (REQUIRED)
//   2. HuggingFace SDXL           — HF fallback model. Same key.
//   3. HuggingFace SD-v1.5        — HF tertiary fallback. Same key.
//   4. ImagineArt                 — Premium. Env: IMAGINE_ART_API_KEY (optional)
//   5. Freepik AI                 — High quality. Env: FREEPIK_API_KEY (optional)
//   6. Pollinations.ai            — FREE fallback, no key, fetches as base64.
//   7. Stability AI               — Env: STABILITY_API_KEY (optional)
//   8. Gemini                     — Google free tier. Env: GOOGLE_AI_STUDIO_KEY
//
// STOCK IMAGE SEARCH CASCADE:
//   1. Pexels           — FREE. Env: PEXELS_API_KEY
//   2. Unsplash         — FREE. Env: UNSPLASH_ACCESS_KEY
//   3. Getty Images     — Premium. Env: GETTY_API_KEY
// ═══════════════════════════════════════════════════════════════════════════════

export type ImageProvider = 'imagineart' | 'freepik' | 'pollinations' | 'huggingface' | 'stability' | 'gemini' | 'pexels' | 'unsplash' | 'getty' | 'none';

export interface ImageResult {
  success: boolean;
  imageData?: string; // base64 data URL  (data:image/jpeg;base64,...)
  imageUrl?: string;  // direct URL (for CDN / stock images)
  provider: ImageProvider;
  error?: string;
  attribution?: string;
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
// Sanitise prompt for safe URL encoding / API bodies
// ─────────────────────────────────────────────────────────────────────────────
function sanitise(prompt: string): string {
  return prompt
    .replace(/[^\w\s,.()\-–']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300);
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 1: ImagineArt — Premium AI image generation
// API Docs: https://api.imagineai.art/
// Env: IMAGINE_ART_API_KEY
// Best quality for vision boards — cinematic, photorealistic output
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithImagineArt(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.IMAGINE_ART_API_KEY;
  if (!apiKey) return { success: false, provider: 'imagineart', error: 'IMAGINE_ART_API_KEY not set' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    const response = await fetch('https://api.vyro.ai/v1/imagine/api/generations', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: sanitise(prompt),
        style_id: 32, // Photorealistic style — best for vision boards
        aspect_ratio: '1:1',
        high_res_results: 1,
      }),
    });

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`ImagineArt ${response.status}: ${await response.text().catch(() => '')}`);

    const data = await response.json() as {
      data?: Array<{ url?: string; b64_json?: string }>;
      url?: string;
    };

    const imgUrl = data?.data?.[0]?.url ?? data?.url;
    const b64 = data?.data?.[0]?.b64_json;

    if (b64) {
      return { success: true, imageData: `data:image/png;base64,${b64}`, provider: 'imagineart' };
    }
    if (imgUrl) {
      return { success: true, imageUrl: imgUrl, provider: 'imagineart' };
    }

    throw new Error('No image in ImagineArt response');
  } catch (err) {
    return { success: false, provider: 'imagineart', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 2: Freepik AI — High-quality AI image generation
// API Docs: https://api.freepik.com/
// Env: FREEPIK_API_KEY — model: mystic (best for vision boards)
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithFreepik(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.FREEPIK_API_KEY;
  if (!apiKey) return { success: false, provider: 'freepik', error: 'FREEPIK_API_KEY not set' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    // Step 1: Request image generation (async job)
    const req = await fetch('https://api.freepik.com/v1/ai/text-to-image', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'x-freepik-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        prompt: sanitise(prompt),
        image: { size: '1:1' },
        styling: {
          style: 'photographic',
          color: 'vibrant',
          lightning: 'cinematic',
          framing: 'portrait',
        },
        num_images: 1,
      }),
    });

    clearTimeout(timeout);
    if (!req.ok) throw new Error(`Freepik ${req.status}: ${await req.text().catch(() => '')}`);

    const data = await req.json() as {
      data?: Array<{ base64: string }>;
      meta?: { task_id?: string; generated_count?: number };
    };

    const base64 = data?.data?.[0]?.base64;
    if (base64) {
      return { success: true, imageData: `data:image/jpeg;base64,${base64}`, provider: 'freepik' };
    }

    throw new Error('No image data from Freepik');
  } catch (err) {
    return { success: false, provider: 'freepik', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMARY Provider: HuggingFace Inference API — FLUX.1-schnell (fast, quality)
// Falls back to SDXL then SD 1.5 within the same provider on model loading errors.
// Env: HF_ACCESS_TOKEN
// ─────────────────────────────────────────────────────────────────────────────

const HF_MODELS: Array<{ id: string; steps: number; guidance: number; width: number; height: number }> = [
  { id: 'black-forest-labs/FLUX.1-schnell', steps: 4,  guidance: 3.5, width: 1024, height: 1024 }, // FLUX fast — 4 steps
  { id: 'stabilityai/stable-diffusion-xl-base-1.0',    steps: 30, guidance: 7.5, width: 1024, height: 1024 }, // SDXL
  { id: 'runwayml/stable-diffusion-v1-5',              steps: 25, guidance: 7.5, width: 512,  height: 512  }, // SD v1.5 fallback
];

async function callHuggingFaceModel(
  apiKey: string,
  model: { id: string; steps: number; guidance: number; width: number; height: number },
  prompt: string
): Promise<ImageResult> {
  const MAX_RETRIES = 2;    // retry on 503 "model loading"
  const RETRY_DELAY = 8_000; // 8 seconds between retries

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model.id}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'x-wait-for-model': 'true', // ask HF to wait for model instead of 503
          },
          body: JSON.stringify({
            inputs: sanitise(prompt),
            parameters: {
              num_inference_steps: model.steps,
              guidance_scale: model.guidance,
              width: model.width,
              height: model.height,
            },
          }),
        }
      );

      clearTimeout(timeoutId);

      if (response.status === 503) {
        const bodyText = await response.text().catch(() => '');
        const isLoading = bodyText.includes('loading') || bodyText.includes('estimated_time');
        if (isLoading && attempt < MAX_RETRIES) {
          console.warn(`[HF] Model ${model.id} loading (attempt ${attempt + 1}/${MAX_RETRIES + 1}), retrying in ${RETRY_DELAY / 1000}s…`);
          await new Promise((r) => setTimeout(r, RETRY_DELAY));
          continue;
        }
        return { success: false, provider: 'huggingface', error: `HF 503 model loading: ${model.id}` };
      }

      if (!response.ok) {
        const errText = (await response.text().catch(() => '')).slice(0, 300);
        return { success: false, provider: 'huggingface', error: `HF ${response.status} ${model.id}: ${errText}` };
      }

      // Successful binary image response
      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.startsWith('image/')) {
        // Some models return JSON errors even with 200
        const text = await response.text();
        return { success: false, provider: 'huggingface', error: `HF non-image response: ${text.slice(0, 200)}` };
      }

      const buffer = await response.arrayBuffer();
      if (buffer.byteLength < 1000) {
        return { success: false, provider: 'huggingface', error: `HF response too small (${buffer.byteLength} bytes)` };
      }

      const base64 = Buffer.from(buffer).toString('base64');
      return { success: true, imageData: `data:${contentType};base64,${base64}`, provider: 'huggingface' };
    } catch (err) {
      clearTimeout(timeoutId);
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY));
        continue;
      }
      return { success: false, provider: 'huggingface', error: (err as Error).message };
    }
  }

  return { success: false, provider: 'huggingface', error: `HF model ${model.id} all retries exhausted` };
}

async function generateWithHuggingFace(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.HF_ACCESS_TOKEN;
  if (!apiKey) return { success: false, provider: 'huggingface', error: 'HF_ACCESS_TOKEN not set' };

  for (const model of HF_MODELS) {
    const result = await callHuggingFaceModel(apiKey, model, prompt);
    if (result.success) {
      console.log(`[HF] Success with model: ${model.id}`);
      return result;
    }
    console.warn(`[HF] Model ${model.id} failed:`, result.error, '— trying next model…');
  }

  return { success: false, provider: 'huggingface', error: 'All HuggingFace models failed' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fallback: Pollinations.ai — free, no key.
// Fetches image as base64 so it renders reliably without CORS or domain issues.
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithPollinations(prompt: string): Promise<ImageResult> {
  try {
    const seed = Math.floor(Math.random() * 1_000_000);
    const encoded = encodeURIComponent(sanitise(prompt));
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&model=flux&seed=${seed}&enhance=true`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45_000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Pollinations ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      // Not an image response — fall back to returning URL optimistically
      return { success: true, imageUrl: url, provider: 'pollinations' };
    }

    const buffer = await response.arrayBuffer();
    if (buffer.byteLength < 1000) {
      throw new Error('Pollinations response too small');
    }
    const base64 = Buffer.from(buffer).toString('base64');
    return { success: true, imageData: `data:${contentType};base64,${base64}`, provider: 'pollinations' };
  } catch (err) {
    return { success: false, provider: 'pollinations', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 5: Stability AI — Stable Image Core
// Env: STABILITY_API_KEY — platform.stability.ai
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
        headers: { Authorization: `Bearer ${apiKey}`, Accept: 'image/*' },
        body: formData,
      }
    );

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Stability ${response.status}: ${(await response.text().catch(() => '')).slice(0, 200)}`);

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return { success: true, imageData: `data:image/jpeg;base64,${base64}`, provider: 'stability' };
  } catch (err) {
    return { success: false, provider: 'stability', error: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 6: Google Gemini — free tier
// ─────────────────────────────────────────────────────────────────────────────
async function generateWithGemini(prompt: string): Promise<ImageResult> {
  const apiKey = process.env.GOOGLE_AI_KEY || process.env.GOOGLE_AI_STUDIO_KEY;
  if (!apiKey) return { success: false, provider: 'gemini', error: 'GOOGLE_AI_STUDIO_KEY not configured' };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35_000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate a single photorealistic, inspirational vision board panel image. No text, no words, no logos. Scene: ${sanitise(prompt)}` }] }],
          generationConfig: { responseModalities: ['IMAGE'] },
        }),
      }
    );

    clearTimeout(timeout);
    if (!response.ok) throw new Error(`Gemini ${response.status}`);

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
// Main entrypoint: cascade through providers (best quality first)
// HuggingFace (FLUX/SDXL/SD) → ImagineArt → Freepik → Pollinations → Stability → Gemini
// ─────────────────────────────────────────────────────────────────────────────
export async function generateImage(prompt: string): Promise<ImageResult> {
  // 1. HuggingFace — primary provider (FLUX.1-schnell → SDXL → SD-v1.5)
  //    Uses HF_ACCESS_TOKEN. Produces high-quality photorealistic base64 images.
  const hf = await generateWithHuggingFace(prompt);
  if (hf.success) return hf;
  console.warn('[ImageGen] HuggingFace failed:', hf.error, '— trying ImagineArt');

  // 2. ImagineArt — premium quality (requires IMAGINE_ART_API_KEY)
  if (process.env.IMAGINE_ART_API_KEY) {
    const ia = await generateWithImagineArt(prompt);
    if (ia.success) return ia;
    console.warn('[ImageGen] ImagineArt failed:', ia.error, '— trying Freepik');
  }

  // 3. Freepik — high quality (requires FREEPIK_API_KEY)
  if (process.env.FREEPIK_API_KEY) {
    const fp = await generateWithFreepik(prompt);
    if (fp.success) return fp;
    console.warn('[ImageGen] Freepik failed:', fp.error, '— trying Pollinations');
  }

  // 4. Pollinations — free fallback, fetches actual image as base64
  const p = await generateWithPollinations(prompt);
  if (p.success) return p;
  console.warn('[ImageGen] Pollinations failed:', p.error, '— trying Stability AI');

  // 5. Stability AI (requires STABILITY_API_KEY)
  if (process.env.STABILITY_API_KEY) {
    const stability = await generateWithStability(prompt);
    if (stability.success) return stability;
    console.warn('[ImageGen] Stability failed:', stability.error, '— trying Gemini');
  }

  // 6. Gemini — last resort (uses GOOGLE_AI_STUDIO_KEY)
  const gemini = await generateWithGemini(prompt);
  if (gemini.success) return gemini;
  console.warn('[ImageGen] All providers exhausted');

  return { success: false, provider: 'none', error: 'All image providers failed' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Generate all panel images — parallel batches of 3 with provider cascade
// ─────────────────────────────────────────────────────────────────────────────
export async function generateBoardImages(
  panels: Array<{ id: string; imagePrompt: string }>
): Promise<Map<string, string>> {
  const images = new Map<string, string>();

  // Concurrency 2 to stay within HF free-tier rate limits while keeping speed
  const CONCURRENCY = 2;
  for (let i = 0; i < panels.length; i += CONCURRENCY) {
    const batch = panels.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((panel) => generateImage(panel.imagePrompt))
    );

    results.forEach((outcome, batchIdx) => {
      const panel = batch[batchIdx];
      if (outcome.status === 'fulfilled') {
        const result = outcome.value;
        const imageSrc = result.imageData ?? result.imageUrl;
        if (result.success && imageSrc) {
          images.set(panel.id, imageSrc);
          console.log(`[ImageGen] Panel ${i + batchIdx + 1}/${panels.length} via ${result.provider}`);
        } else {
          console.warn(`[ImageGen] Panel ${i + batchIdx + 1}/${panels.length} failed:`, result.error);
        }
      } else {
        console.warn(`[ImageGen] Panel ${i + batchIdx + 1}/${panels.length} rejected:`, outcome.reason);
      }
    });

    if (i + CONCURRENCY < panels.length) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return images;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STOCK IMAGE SEARCH — Pexels → Unsplash → Getty cascade
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// Pexels — FREE. Env: PEXELS_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function searchPexelsImages(query: string, limit = 12): Promise<StockImageResult[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const params = new URLSearchParams({ query, per_page: String(limit), orientation: 'square' });
    const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      signal: controller.signal,
      headers: { Authorization: apiKey },
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Pexels HTTP ${response.status}`);

    const data = await response.json() as {
      photos?: Array<{
        id: number; alt: string; width: number; height: number;
        photographer: string;
        src: { large: string; medium: string };
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
// Unsplash — FREE. Env: UNSPLASH_ACCESS_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function searchUnsplashImages(query: string, limit = 12): Promise<StockImageResult[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const params = new URLSearchParams({ query, per_page: String(limit), orientation: 'squarish', content_filter: 'high' });
    const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      signal: controller.signal,
      headers: { Authorization: `Client-ID ${accessKey}` },
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Unsplash HTTP ${response.status}`);

    const data = await response.json() as {
      results?: Array<{
        id: string; alt_description: string | null;
        urls: { regular: string; small: string }; width: number; height: number;
        user: { name: string };
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
// Getty Images — Premium. Env: GETTY_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function searchGettyImages(query: string, limit = 12): Promise<StockImageResult[]> {
  const apiKey = process.env.GETTY_API_KEY;
  if (!apiKey) return [];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const params = new URLSearchParams({
      phrase: query, page_size: String(limit), sort_order: 'best_match',
      orientations: 'Square,Horizontal', graphical_styles: 'photography',
      exclude_nudity: 'true', fields: 'id,title,display_sizes,artist',
    });

    const response = await fetch(`https://api.gettyimages.com/v3/search/images/creative?${params}`, {
      signal: controller.signal,
      headers: { 'Api-Key': apiKey },
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`Getty HTTP ${response.status}`);

    const data = await response.json() as {
      images?: Array<{
        id: string; title: string; artist: string;
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
// Main stock image search — all providers in parallel, Pexels prioritised
// ─────────────────────────────────────────────────────────────────────────────
export async function searchStockImages(query: string, limit = 12): Promise<StockImageResult[]> {
  const [pexels, unsplash, getty] = await Promise.all([
    searchPexelsImages(query, limit),
    searchUnsplashImages(query, limit),
    searchGettyImages(query, limit),
  ]);

  // Merge: Pexels first (free, high quality), then Unsplash, then Getty
  const combined = [...pexels, ...unsplash, ...getty];
  return combined.slice(0, limit * 2);
}
