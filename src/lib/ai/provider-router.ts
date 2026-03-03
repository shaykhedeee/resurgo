// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Unified AI Provider Router
// Multi-provider cascade: Groq → Gemini → OpenRouter → AIML → fallback
//
// COST STRATEGY: Free-tier first, paid only as last resort.
// Free tiers used: Groq (generous free), Gemini Flash (free tier),
//   OpenRouter free models (google/gemma-2-9b-it:free), AIML API (free tier).
// No OpenAI unless OPENAI_API_KEY is explicitly set (most expensive).
//
// TASK TYPES determine model selection:
//   'quick'    → smallest/fastest models (FAQ, simple responses)
//   'coaching' → balanced models (chat, coaching sessions)
//   'analyze'  → powerful models (psychology profile, decomposition)
//   'json'     → balanced models with JSON mode forced
// ═══════════════════════════════════════════════════════════════════════════════

export type AIProvider = 'groq' | 'cerebras' | 'gemini' | 'together' | 'openrouter' | 'aiml' | 'mistral' | 'fireworks' | 'scaleway' | 'openai';
export type TaskType = 'quick' | 'coaching' | 'analyze' | 'json' | 'creative' | 'synthesize';

// ─────────────────────────────────────────────────────────────────────────────
// CIRCUIT BREAKER
// Tracks failures per provider. Skips a provider for 5 min after 3 consecutive
// failures to prevent hammering a down endpoint and slowing the cascade.
// ─────────────────────────────────────────────────────────────────────────────
interface ProviderHealth { failures: number; lastFailureAt: number; }
const _health = new Map<AIProvider, ProviderHealth>();
const CIRCUIT_OPEN_MS = 5 * 60 * 1000;  // 5 minutes
const MAX_FAILURES    = 3;

function isCircuitOpen(provider: AIProvider): boolean {
  const h = _health.get(provider);
  if (!h || h.failures < MAX_FAILURES) return false;
  if (Date.now() - h.lastFailureAt > CIRCUIT_OPEN_MS) {
    _health.delete(provider); // reset after cooldown
    return false;
  }
  return true;
}

function recordFailure(provider: AIProvider): void {
  const h = _health.get(provider) ?? { failures: 0, lastFailureAt: 0 };
  _health.set(provider, { failures: h.failures + 1, lastFailureAt: Date.now() });
}

function recordSuccess(provider: AIProvider): void {
  _health.delete(provider);
}

// ─────────────────────────────────────────────────────────────────────────────
// PER-CALL TIMEOUT WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const PROVIDER_TIMEOUT_MS: Record<TaskType, number> = {
  quick: 12_000,
  json:  15_000,
  coaching: 25_000,
  analyze: 40_000,
  creative: 30_000,
  synthesize: 45_000,
};

async function withTimeout<T>(promise: Promise<T>, ms: number, provider: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${provider} timed out after ${ms}ms`)), ms);
  });
  try {
    const result = await Promise.race([promise, timeout]);
    clearTimeout(timer!);
    return result;
  } catch (err) {
    clearTimeout(timer!);
    throw err;
  }
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICallOptions {
  taskType?: TaskType;
  maxTokens?: number;
  temperature?: number;
  requireJson?: boolean; // Forces JSON response parsing + retries
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MODEL REGISTRY
// ─────────────────────────────────────────────────────────────────────────────

const MODELS = {
  cerebras: {
    // cloud.cerebras.ai — free, extremely fast (1000+ tok/sec)
    quick:    'llama3.1-8b',
    coaching: 'llama-3.3-70b',
    analyze:  'llama-3.3-70b',
    json:     'llama3.1-8b',
    creative: 'llama-3.3-70b',
    synthesize: 'llama-3.3-70b',
  },
  groq: {
    quick: 'llama-3.1-8b-instant',        // Fastest, ~$0.05/1M tokens (essentially free tier)
    coaching: 'llama-3.3-70b-versatile',   // High quality, $0.59/1M tokens
    analyze: 'llama-3.3-70b-versatile',
    json: 'llama-3.1-8b-instant',
    creative: 'llama-3.3-70b-versatile',
    synthesize: 'llama-3.3-70b-versatile',
  },
  gemini: {
    quick: 'gemini-2.0-flash-exp',         // FREE tier
    coaching: 'gemini-1.5-flash',          // Low cost
    analyze: 'gemini-1.5-pro',             // More capable
    json: 'gemini-1.5-flash',
    creative: 'gemini-1.5-pro',
    synthesize: 'gemini-1.5-pro',
  },
  openrouter: {
    quick: 'google/gemma-2-9b-it:free',   // Completely FREE
    coaching: 'google/gemma-2-9b-it:free',
    analyze: 'meta-llama/llama-3.2-3b-instruct:free',
    json: 'google/gemma-2-9b-it:free',
    creative: 'google/gemma-2-9b-it:free',
    synthesize: 'meta-llama/llama-3.2-3b-instruct:free',
  },
  together: {
    // api.together.xyz — free $5 credit, then very cheap
    quick:    'meta-llama/Llama-3.2-3B-Instruct-Turbo',
    coaching: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    analyze:  'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    json:     'meta-llama/Llama-3.2-3B-Instruct-Turbo',
    creative: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
    synthesize: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
  },
  aiml: {
    quick: 'mistralai/Mistral-7B-Instruct-v0.2',
    coaching: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    analyze: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    json: 'mistralai/Mistral-7B-Instruct-v0.2',
    creative: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    synthesize: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
  },
  mistral: {
    // api.mistral.ai — free tier available, strong reasoning
    quick:      'mistral-small-latest',
    coaching:   'mistral-large-latest',
    analyze:    'mistral-large-latest',
    json:       'mistral-small-latest',
    creative:   'mistral-large-latest',
    synthesize: 'mistral-large-latest',
  },
  fireworks: {
    // fireworks.ai — very fast inference, competitive pricing
    quick:      'accounts/fireworks/models/llama-v3p1-8b-instruct',
    coaching:   'accounts/fireworks/models/llama-v3p1-70b-instruct',
    analyze:    'accounts/fireworks/models/llama-v3p1-70b-instruct',
    json:       'accounts/fireworks/models/llama-v3p1-8b-instruct',
    creative:   'accounts/fireworks/models/llama-v3p1-70b-instruct',
    synthesize: 'accounts/fireworks/models/llama-v3p1-70b-instruct',
  },
  scaleway: {
    // api.scaleway.ai — EU-hosted, OpenAI-compatible
    quick:      'llama-3.1-8b-instruct',
    coaching:   'llama-3.1-70b-instruct',
    analyze:    'llama-3.1-70b-instruct',
    json:       'llama-3.1-8b-instruct',
    creative:   'llama-3.1-70b-instruct',
    synthesize: 'llama-3.1-70b-instruct',
  },
  openai: {
    quick: 'gpt-4o-mini',
    coaching: 'gpt-4o-mini',
    analyze: 'gpt-4o',
    json: 'gpt-4o-mini',
    creative: 'gpt-4o',
    synthesize: 'gpt-4o',
  },
};

const DEFAULT_MAX_TOKENS: Record<TaskType, number> = {
  quick: 512,
  coaching: 1024,
  analyze: 2048,
  json: 1024,
  creative: 1536,
  synthesize: 2048,
};

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER IMPLEMENTATIONS
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Cerebras — extremely fast free inference (1000+ tok/sec)
// Sign up at cloud.cerebras.ai — env var: CEREBRAS_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function callCerebras(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number,
  requireJson: boolean
): Promise<AIResponse> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) throw new Error('CEREBRAS_API_KEY not configured');

  const body: Record<string, unknown> = { model, messages, max_tokens: maxTokens, temperature };
  if (requireJson) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Cerebras error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'cerebras',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Together AI — free tier + cheap paid models
// Sign up at api.together.xyz — env var: TOGETHER_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function callTogether(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error('TOGETHER_API_KEY not configured');

  const res = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  });
  if (!res.ok) throw new Error(`Together error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'together',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
async function callGroq(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number,
  requireJson: boolean
): Promise<AIResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY not configured');

  const body: Record<string, unknown> = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature,
  };
  if (requireJson) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Groq error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'groq',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

async function callGemini(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number,
  requireJson: boolean
): Promise<AIResponse> {
  const apiKey = process.env.GOOGLE_AI_STUDIO_KEY ?? process.env.GOOGLE_AI_STUDIO_KEY_BACKUP;
  if (!apiKey) throw new Error('GOOGLE_AI_STUDIO_KEY not configured');

  // Convert OpenAI-style messages to Gemini format
  const systemMessage = messages.find((m) => m.role === 'system');
  const conversationMessages = messages.filter((m) => m.role !== 'system');

  const geminiMessages = conversationMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Inject system message as a preamble user turn
  if (systemMessage) {
    geminiMessages.unshift(
      { role: 'user', parts: [{ text: `System:\n${systemMessage.content}` }] },
      { role: 'model', parts: [{ text: 'Understood. I will follow these instructions.' }] }
    );
  }

  const body: Record<string, unknown> = {
    contents: geminiMessages,
    generationConfig: { maxOutputTokens: maxTokens, temperature },
  };
  if (requireJson) {
    (body.generationConfig as Record<string, unknown>).responseMimeType = 'application/json';
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
  );
  if (!res.ok) throw new Error(`Gemini error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty response');

  return {
    content: text,
    provider: 'gemini',
    model,
    tokensUsed: data.usageMetadata?.totalTokenCount,
  };
}

async function callOpenRouter(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY not configured');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://resurgo.life',
      'X-Title': 'Resurgo',
    },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  });
  if (!res.ok) throw new Error(`OpenRouter error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'openrouter',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

async function callAIML(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number
): Promise<AIResponse> {
  const apiKey = process.env.AIML_API_KEY;
  if (!apiKey) throw new Error('AIML_API_KEY not configured');

  const res = await fetch('https://api.aimlapi.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  });
  if (!res.ok) throw new Error(`AIML error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'aiml',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mistral AI — Strong reasoning, multilingual, free tier available
// Sign up at console.mistral.ai — env var: MISTRAL_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function callMistral(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number,
  requireJson: boolean
): Promise<AIResponse> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('MISTRAL_API_KEY not configured');

  const body: Record<string, unknown> = {
    model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    max_tokens: maxTokens,
    temperature,
  };
  if (requireJson) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Mistral error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'mistral',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fireworks AI — Very fast inference, competitive pricing
// Sign up at fireworks.ai — env var: FIREWORKS_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function callFireworks(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number,
  requireJson: boolean
): Promise<AIResponse> {
  const apiKey = process.env.FIREWORKS_API_KEY;
  if (!apiKey) throw new Error('FIREWORKS_API_KEY not configured');

  const body: Record<string, unknown> = { model, messages, max_tokens: maxTokens, temperature };
  if (requireJson) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Fireworks error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'fireworks',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Scaleway AI — EU-hosted, OpenAI-compatible API
// Sign up at console.scaleway.com — env var: SCALEWAY_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
async function callScaleway(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number,
  requireJson: boolean
): Promise<AIResponse> {
  const apiKey = process.env.SCALEWAY_API_KEY;
  if (!apiKey) throw new Error('SCALEWAY_API_KEY not configured');

  const body: Record<string, unknown> = { model, messages, max_tokens: maxTokens, temperature };
  if (requireJson) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.scaleway.ai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Scaleway error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'scaleway',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
async function callOpenAI(
  messages: AIMessage[],
  model: string,
  maxTokens: number,
  temperature: number,
  requireJson: boolean
): Promise<AIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured');

  const body: Record<string, unknown> = { model, messages, max_tokens: maxTokens, temperature };
  if (requireJson) body.response_format = { type: 'json_object' };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    provider: 'openai',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENTRYPOINT — callAI()
// Tries providers in priority order. Logs failures and falls through.
// ─────────────────────────────────────────────────────────────────────────────

export async function callAI(
  messages: AIMessage[],
  options: AICallOptions = {}
): Promise<AIResponse> {
  const taskType: TaskType = options.taskType ?? 'coaching';
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS[taskType];
  const temperature = options.temperature ?? 0.7;
  const requireJson = options.requireJson ?? false;
  const timeoutMs = PROVIDER_TIMEOUT_MS[taskType];

  // Provider cascade — priority order (free tiers first; paid last resort)
  const providers: Array<{ id: AIProvider; call: () => Promise<AIResponse> }> = [
    // 1. Groq — fastest + most generous free tier
    { id: 'groq',       call: () => callGroq(messages, MODELS.groq[taskType], maxTokens, temperature, requireJson) },
    // 2. Cerebras — extremely fast, free tier
    { id: 'cerebras',   call: () => callCerebras(messages, MODELS.cerebras[taskType], maxTokens, temperature, requireJson) },
    // 3. Gemini — Google free tier
    { id: 'gemini',     call: () => callGemini(messages, MODELS.gemini[taskType], maxTokens, temperature, requireJson) },
    // 4. OpenRouter — completely free models
    { id: 'openrouter', call: () => callOpenRouter(messages, MODELS.openrouter[taskType], maxTokens, temperature) },
    // 5. Together AI — free credit + cheap
    { id: 'together',   call: () => callTogether(messages, MODELS.together[taskType], maxTokens, temperature) },
    // 6. AIML API — free tier
    { id: 'aiml',       call: () => callAIML(messages, MODELS.aiml[taskType], maxTokens, temperature) },
    // 7. Mistral — strong reasoning, free tier
    { id: 'mistral',    call: () => callMistral(messages, MODELS.mistral[taskType], maxTokens, temperature, requireJson) },
    // 8. Fireworks — very fast inference
    { id: 'fireworks',  call: () => callFireworks(messages, MODELS.fireworks[taskType], maxTokens, temperature, requireJson) },
    // 9. Scaleway — EU-hosted fallback
    { id: 'scaleway',   call: () => callScaleway(messages, MODELS.scaleway[taskType], maxTokens, temperature, requireJson) },
    // 10. OpenAI — last resort, only if key configured (most expensive)
    { id: 'openai',     call: () => callOpenAI(messages, MODELS.openai[taskType], maxTokens, temperature, requireJson) },
  ];

  const errors: string[] = [];

  for (const { id, call } of providers) {
    // Skip providers whose circuit is open (too many recent failures)
    if (isCircuitOpen(id)) {
      errors.push(`${id}: circuit open (too many recent failures)`);
      continue;
    }

    try {
      const result = await withTimeout(call(), timeoutMs, id);
      recordSuccess(id);
      if (errors.length > 0) {
        console.warn(`[AI Router] Fell through ${errors.length} provider(s) before success via ${id}/${result.model}`);
      }
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${id}: ${msg}`);
      recordFailure(id);
      console.warn(`[AI Router] ${id} failed: ${msg}`);
    }
  }

  throw new Error(
    `[AI Router] All providers exhausted. Errors: ${errors.join(' | ')}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// callAIJson() — Wraps callAI and parses the JSON response
// Strips markdown code fences if present (some models add them)
// ─────────────────────────────────────────────────────────────────────────────

export async function callAIJson<T = unknown>(
  messages: AIMessage[],
  options: Omit<AICallOptions, 'requireJson'> = {}
): Promise<{ data: T; provider: AIProvider; model: string }> {
  const result = await callAI(messages, { ...options, requireJson: true, taskType: options.taskType ?? 'json' });

  // Strip markdown code fences
  let text = result.content.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  const data = JSON.parse(text) as T;
  return { data, provider: result.provider, model: result.model };
}

// ─────────────────────────────────────────────────────────────────────────────
// callAIWithProvider() — Call a SPECIFIC provider directly (skip cascade)
// Used by the orchestrator to target sub-tasks at specialized providers
// Falls back to regular cascade if the target provider fails
// ─────────────────────────────────────────────────────────────────────────────

type ProviderCallFn = (
  msgs: AIMessage[], model: string, maxTok: number, temp: number, json: boolean
) => Promise<AIResponse>;

const PROVIDER_FNS: Record<AIProvider, ProviderCallFn> = {
  groq:       (m, mod, mt, t, j) => callGroq(m, mod, mt, t, j),
  cerebras:   (m, mod, mt, t, j) => callCerebras(m, mod, mt, t, j),
  gemini:     (m, mod, mt, t, j) => callGemini(m, mod, mt, t, j),
  openrouter: (m, mod, mt, t, _j) => callOpenRouter(m, mod, mt, t),
  together:   (m, mod, mt, t, _j) => callTogether(m, mod, mt, t),
  aiml:       (m, mod, mt, t, _j) => callAIML(m, mod, mt, t),
  mistral:    (m, mod, mt, t, j) => callMistral(m, mod, mt, t, j),
  fireworks:  (m, mod, mt, t, j) => callFireworks(m, mod, mt, t, j),
  scaleway:   (m, mod, mt, t, j) => callScaleway(m, mod, mt, t, j),
  openai:     (m, mod, mt, t, j) => callOpenAI(m, mod, mt, t, j),
};

export async function callAIWithProvider(
  provider: AIProvider,
  messages: AIMessage[],
  options: AICallOptions = {}
): Promise<AIResponse> {
  const taskType: TaskType = options.taskType ?? 'coaching';
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS[taskType];
  const temperature = options.temperature ?? 0.7;
  const requireJson = options.requireJson ?? false;
  const timeoutMs = PROVIDER_TIMEOUT_MS[taskType];

  const model = MODELS[provider]?.[taskType];
  if (!model) {
    console.warn(`[AI Router] No model for ${provider}/${taskType}, falling back to cascade`);
    return callAI(messages, options);
  }

  const fn = PROVIDER_FNS[provider];
  if (!fn || isCircuitOpen(provider)) {
    console.warn(`[AI Router] ${provider} unavailable, falling back to cascade`);
    return callAI(messages, options);
  }

  try {
    const result = await withTimeout(fn(messages, model, maxTokens, temperature, requireJson), timeoutMs, provider);
    recordSuccess(provider);
    return result;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[AI Router] Direct call to ${provider} failed: ${msg}, falling back to cascade`);
    recordFailure(provider);
    return callAI(messages, options);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getAvailableProviders() — Returns list of providers with configured API keys
// Used by orchestrator to know which providers can be targeted
// ─────────────────────────────────────────────────────────────────────────────
export function getAvailableProviders(): AIProvider[] {
  const keyMap: Record<AIProvider, string> = {
    groq: 'GROQ_API_KEY',
    cerebras: 'CEREBRAS_API_KEY',
    gemini: 'GOOGLE_AI_STUDIO_KEY',
    openrouter: 'OPENROUTER_API_KEY',
    together: 'TOGETHER_API_KEY',
    aiml: 'AIML_API_KEY',
    mistral: 'MISTRAL_API_KEY',
    fireworks: 'FIREWORKS_API_KEY',
    scaleway: 'SCALEWAY_API_KEY',
    openai: 'OPENAI_API_KEY',
  };

  return (Object.entries(keyMap) as [AIProvider, string][])
    .filter(([provider, envVar]) => !!process.env[envVar] && !isCircuitOpen(provider))
    .map(([provider]) => provider);
}
