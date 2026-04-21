// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — Local Agent Connector
// Probes and communicates with local AI inference engines:
//   • Ollama (ollama.ai)
//   • LM Studio (lmstudio.ai)
//   • Any OpenAI-compatible server (llama.cpp, vLLM, Jan.ai, etc.)
//
// The connector uses the Tauri `probe_ollama` command when running in the
// desktop shell (bypasses browser CORS), and falls back to a direct fetch
// in the browser (works when the local server allows CORS).
// ═══════════════════════════════════════════════════════════════════════════

import { isDesktop } from './detect';
import { getCredential, type LocalAgentProvider } from './credentials';

export interface LocalAgentStatus {
  provider: LocalAgentProvider | 'auto';
  baseUrl: string;
  reachable: boolean;
  models: string[];
  latencyMs?: number;
  error?: string;
}

export interface LocalAgentChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LocalAgentChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface LocalAgentChatResponse {
  content: string;
  model: string;
  provider: LocalAgentProvider | 'auto';
  tokensUsed?: number;
  durationMs: number;
}

// ── Default base URLs ─────────────────────────────────────────────────────────

const DEFAULTS: Record<LocalAgentProvider, string> = {
  ollama_url:   'http://localhost:11434',
  lmstudio_url: 'http://localhost:1234',
  custom_url:   'http://localhost:8080',
};

const DEFAULT_MODELS: Record<LocalAgentProvider, string> = {
  ollama_url:   'dolphin3:latest',
  lmstudio_url: 'local-model',
  custom_url:   'local-model',
};

// ── Tauri probe (desktop) ─────────────────────────────────────────────────────

interface ProbeResult {
  reachable: boolean;
  models: string[];
  error?: string;
}

type TauriInvoke = (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;

function getTauriInvoke(): TauriInvoke | null {
  if (!isDesktop()) return null;
  const w = window as Window & { __TAURI__?: { core?: { invoke?: TauriInvoke } } };
  return w.__TAURI__?.core?.invoke ?? null;
}

async function probeViaDesktop(baseUrl: string): Promise<ProbeResult> {
  const invoke = getTauriInvoke();
  if (!invoke) return { reachable: false, models: [], error: 'Tauri not available' };
  const result = await invoke('probe_ollama', { baseUrl });
  return result as ProbeResult;
}

async function probeViaFetch(baseUrl: string): Promise<ProbeResult> {
  try {
    const url = `${baseUrl.trim().replace(/\/$/, '')}/api/tags`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!resp.ok) return { reachable: false, models: [], error: `HTTP ${resp.status}` };
    const data = await resp.json() as { models?: { name: string }[] };
    const models = data.models?.map((m) => m.name) ?? [];
    return { reachable: true, models };
  } catch (e) {
    return { reachable: false, models: [], error: e instanceof Error ? e.message : String(e) };
  }
}

// ── Public: probe a single provider ──────────────────────────────────────────

/**
 * Check whether a local agent endpoint is reachable and list available models.
 * If no baseUrl is provided, reads it from the credential store with a default fallback.
 */
export async function probeLocalAgent(
  provider: LocalAgentProvider,
  baseUrl?: string,
): Promise<LocalAgentStatus> {
  const url = baseUrl ?? (await getCredential(provider)) ?? DEFAULTS[provider];
  const t0 = Date.now();
  const result = isDesktop()
    ? await probeViaDesktop(url)
    : await probeViaFetch(url);

  return {
    provider,
    baseUrl: url,
    reachable: result.reachable,
    models: result.models,
    latencyMs: Date.now() - t0,
    error: result.error,
  };
}

/**
 * Probe all local agents in parallel and return the first reachable one.
 * Returns null if none are reachable.
 */
export async function findFirstReachableAgent(): Promise<LocalAgentStatus | null> {
  const providers: LocalAgentProvider[] = ['ollama_url', 'lmstudio_url', 'custom_url'];
  const statuses = await Promise.all(providers.map((p) => probeLocalAgent(p)));
  return statuses.find((s) => s.reachable) ?? null;
}

// ── Local AI inference ────────────────────────────────────────────────────────

/**
 * Send a chat completion to a local OpenAI-compatible endpoint.
 * Works with Ollama (/api/chat), LM Studio (/v1/chat/completions), llama.cpp, etc.
 */
export async function callLocalAgent(
  messages: LocalAgentChatMessage[],
  provider: LocalAgentProvider,
  options: LocalAgentChatOptions = {},
): Promise<LocalAgentChatResponse> {
  const baseUrl = (await getCredential(provider)) ?? DEFAULTS[provider];
  const model = options.model ?? DEFAULT_MODELS[provider];
  const t0 = Date.now();

  // Ollama uses /api/chat; LM Studio + llama.cpp use /v1/chat/completions
  const isOllama = provider === 'ollama_url';
  const endpoint = isOllama
    ? `${baseUrl.trim().replace(/\/$/, '')}/api/chat`
    : `${baseUrl.trim().replace(/\/$/, '')}/v1/chat/completions`;

  const body = isOllama
    ? {
        model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: false,
        options: {
          num_predict: options.maxTokens ?? 1024,
          temperature: options.temperature ?? 0.7,
        },
      }
    : {
        model,
        messages,
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.7,
        stream: false,
      };

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });

  if (!resp.ok) {
    throw new Error(`Local agent ${provider} returned HTTP ${resp.status}: ${await resp.text()}`);
  }

  const data = await resp.json() as Record<string, unknown>;

  const content = isOllama
    ? String((data.message as Record<string, unknown>)?.content ?? '')
    : String(
        ((data.choices as Array<Record<string, unknown>>)?.[0]?.message as Record<string, unknown>)
          ?.content ?? ''
      );

  const tokensUsed = isOllama
    ? ((data.prompt_eval_count as number) ?? 0) + ((data.eval_count as number) ?? 0)
    : (data.usage as Record<string, number>)?.total_tokens;

  return {
    content,
    model,
    provider,
    tokensUsed,
    durationMs: Date.now() - t0,
  };
}
