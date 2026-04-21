// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — Desktop Brain Router
// Controls how the Resurgo AI brain routes inference:
//
//   CLOUD    — uses server-side provider cascade (Groq → Gemini → …)
//              Keys live on the server. No user config needed.
//              Requires internet + Clerk auth.
//
//   LOCAL    — uses a locally-running agent (Ollama / LM Studio / custom).
//              100% private, 100% offline. No account needed for inference.
//              Requires a local server to be running.
//
//   BYOK     — user supplies their own cloud API keys (stored in OS keychain).
//              Calls cloud providers directly from the browser/desktop.
//              No Resurgo server in the loop. Keys never sent to Resurgo.
//
//   HYBRID   — try LOCAL first, fall back to BYOK, fall back to CLOUD.
//              Best of all worlds: private when possible, cloud when needed.
//
// The chosen policy is persisted in localStorage so it survives restarts.
// ═══════════════════════════════════════════════════════════════════════════

import { getCredential, type BYOKProvider, type LocalAgentProvider } from './credentials';
import { callLocalAgent, findFirstReachableAgent, type LocalAgentChatMessage } from './local-agent';
import type { AIMessage, AIResponse, AICallOptions } from '@/lib/ai/provider-router';

export type BrainPolicy = 'cloud' | 'local' | 'byok' | 'hybrid';

export interface BrainRouterState {
  policy: BrainPolicy;
  localAgentReachable: boolean;
  byokProvidersConfigured: BYOKProvider[];
  lastCheckedAt: number | null;
}

const POLICY_KEY = 'resurgo-brain-policy';
const DEFAULT_POLICY: BrainPolicy = 'hybrid';

// ── Policy persistence ────────────────────────────────────────────────────────

export function loadBrainPolicy(): BrainPolicy {
  if (typeof localStorage === 'undefined') return DEFAULT_POLICY;
  const stored = localStorage.getItem(POLICY_KEY) as BrainPolicy | null;
  if (stored && ['cloud', 'local', 'byok', 'hybrid'].includes(stored)) return stored;
  return DEFAULT_POLICY;
}

export function saveBrainPolicy(policy: BrainPolicy): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(POLICY_KEY, policy);
}

// ── BYOK cloud inference ──────────────────────────────────────────────────────
// Calls a cloud provider directly from the client using a user-supplied key.
// The request goes browser → provider API (never touches Resurgo servers).

const BYOK_ENDPOINTS: Record<BYOKProvider, string> = {
  groq:       'https://api.groq.com/openai/v1/chat/completions',
  gemini:     'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  cerebras:   'https://api.cerebras.ai/v1/chat/completions',
  together:   'https://api.together.xyz/v1/chat/completions',
  aiml:       'https://api.aimlapi.com/v1/chat/completions',
  openai:     'https://api.openai.com/v1/chat/completions',
};

const BYOK_DEFAULT_MODELS: Record<BYOKProvider, string> = {
  groq:       'llama-3.3-70b-versatile',
  gemini:     'gemini-2.0-flash-exp',
  openrouter: 'google/gemma-2-9b-it:free',
  cerebras:   'llama-3.3-70b',
  together:   'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
  aiml:       'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
  openai:     'gpt-4o-mini',
};

async function callBYOKProvider(
  provider: BYOKProvider,
  messages: AIMessage[],
  options: AICallOptions,
): Promise<AIResponse> {
  const apiKey = await getCredential(provider);
  if (!apiKey) throw new Error(`No key configured for ${provider}`);

  const model = BYOK_DEFAULT_MODELS[provider];
  const maxTokens = options.maxTokens ?? 1024;
  const temperature = options.temperature ?? 0.7;

  // Gemini has a different request format
  if (provider === 'gemini') {
    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');
    const geminiMessages = conversationMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    if (systemMessage) {
      geminiMessages.unshift(
        { role: 'user', parts: [{ text: `System:\n${systemMessage.content}` }] },
        { role: 'model', parts: [{ text: 'Understood.' }] }
      );
    }
    const body = {
      contents: geminiMessages,
      generationConfig: { maxOutputTokens: maxTokens, temperature },
    };
    const resp = await fetch(`${BYOK_ENDPOINTS.gemini}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(`Gemini BYOK error ${resp.status}: ${await resp.text()}`);
    const data = await resp.json() as Record<string, unknown>;
    const text = (data.candidates as Array<Record<string, unknown>>)?.[0]?.content;
    const content = (text as { parts?: Array<{ text: string }> })?.parts?.[0]?.text ?? '';
    return { content, provider: 'gemini', model };
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://resurgo.life';
    headers['X-Title'] = 'Resurgo';
  }

  const resp = await fetch(BYOK_ENDPOINTS[provider], {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature }),
  });
  if (!resp.ok) throw new Error(`${provider} BYOK error ${resp.status}: ${await resp.text()}`);
  const data = await resp.json() as Record<string, unknown>;
  const content = String(
    ((data.choices as Array<Record<string, unknown>>)?.[0]?.message as Record<string, unknown>)
      ?.content ?? ''
  );
  return {
    content,
    provider: provider as AIResponse['provider'],
    model,
    tokensUsed: (data.usage as Record<string, number>)?.total_tokens,
  };
}

// ── Main router ───────────────────────────────────────────────────────────────

/**
 * Route an AI call according to the current brain policy.
 * Falls back gracefully at each step.
 *
 * This function is called from UI components that want AI inference without
 * knowing which backend is being used.
 */
export async function routeBrainCall(
  messages: AIMessage[],
  options: AICallOptions = {},
  policy?: BrainPolicy,
): Promise<AIResponse & { source: 'cloud' | 'local' | 'byok' }> {
  const resolvedPolicy = policy ?? loadBrainPolicy();

  const tryLocal = async () => {
    const agent = await findFirstReachableAgent();
    if (!agent) throw new Error('No local agent reachable');
    const localMsgs: LocalAgentChatMessage[] = messages.map((m) => ({
      role: m.role as 'system' | 'user' | 'assistant',
      content: m.content,
    }));
    const result = await callLocalAgent(localMsgs, agent.provider as LocalAgentProvider, {
      maxTokens: options.maxTokens,
      temperature: options.temperature,
    });
    return {
      content: result.content,
      provider: result.provider as AIResponse['provider'],
      model: result.model,
      tokensUsed: result.tokensUsed,
      source: 'local' as const,
    };
  };

  const tryBYOK = async () => {
    const byokOrder: BYOKProvider[] = [
      'groq', 'cerebras', 'gemini', 'openrouter', 'together', 'aiml', 'openai',
    ];
    const errors: string[] = [];
    for (const provider of byokOrder) {
      const key = await getCredential(provider);
      if (!key) continue;
      try {
        const result = await callBYOKProvider(provider, messages, options);
        return { ...result, source: 'byok' as const };
      } catch (e) {
        errors.push(`${provider}: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
    throw new Error(`All BYOK providers failed: ${errors.join(' | ')}`);
  };

  const tryCloud = async () => {
    // Delegate to the server-side /api/coach route (standard cloud path)
    // This is a lightweight shim — the actual multi-provider cascade runs
    // server-side via provider-router.ts.
    throw new Error(
      'Cloud routing must be done through the Next.js API routes (/api/coach, etc.). ' +
      'Use callAI() from provider-router.ts in server components / API routes.'
    );
  };

  switch (resolvedPolicy) {
    case 'local': {
      return tryLocal();
    }
    case 'byok': {
      return tryBYOK();
    }
    case 'cloud': {
      await tryCloud(); // always throws — cloud is handled server-side
      throw new Error('unreachable');
    }
    case 'hybrid':
    default: {
      // Try local → BYOK → cloud (cloud path is server-side, so just throw if BYOK also fails)
      const errors: string[] = [];
      try { return await tryLocal(); } catch (e) { errors.push(`local: ${e instanceof Error ? e.message : String(e)}`); }
      try { return await tryBYOK(); } catch (e) { errors.push(`byok: ${e instanceof Error ? e.message : String(e)}`); }
      throw new Error(
        `Hybrid routing: all client-side providers exhausted. ` +
        `Errors: ${errors.join(' | ')}. ` +
        `For cloud fallback, use the standard /api/coach endpoint.`
      );
    }
  }
}

/**
 * Test all reachable sources and return a snapshot of what is available.
 * Used by the Desktop AI Settings panel.
 */
export async function getAvailableSources(): Promise<{
  local: Awaited<ReturnType<typeof findFirstReachableAgent>>;
  byokProviders: BYOKProvider[];
}> {
  const [local, ...byokChecks] = await Promise.all([
    findFirstReachableAgent(),
    ...(['groq', 'cerebras', 'gemini', 'openrouter', 'together', 'aiml', 'openai'] as BYOKProvider[])
      .map(async (p) => ({ provider: p, has: !!(await getCredential(p)) })),
  ]);

  const byokProviders = byokChecks
    .filter((b) => b.has)
    .map((b) => b.provider) as BYOKProvider[];

  return { local, byokProviders };
}
