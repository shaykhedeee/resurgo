// ═══════════════════════════════════════════════════════════════════════════════
// Resurgo - Advanced AI Chatbot API Route
// Multi-provider intelligent chatbot with Ollama-first cascade + cloud fallback
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import {
  buildChatbotSystemPrompt,
  detectIntent,
  getQuickResponse,
  getFollowUpSuggestions,
  getIntentCta,
  FAQ,
  CHATBOT_PERSONA,
  UserIntent,
} from '@/lib/ascend-knowledge-base';

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const AIML_API_KEY = process.env.AIML_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const CHATBOT_SYNC_SECRET = process.env.BILLING_WEBHOOK_SYNC_SECRET;
// Ollama local AI — defaults to localhost:11434 when running locally.
// In production (Vercel) set OLLAMA_BASE_URL to an empty string or omit it to
// skip Ollama and fall straight through to the cloud cascade.
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL ?? 'http://localhost:3210');

const MODELS = {
  // ─── Ollama local models (C:\Users\USER\.ollama\models) ──────────────────
  // free  → dolphin-phi:latest  (1.6 GB — fastest, lowest RAM)
  // premium → dolphin3:latest   (4.9 GB — most capable local model)
  // Also available: aeline/phil:latest, aeline/halo:latest, llama2-uncensored:7b
  ollama: {
    free: 'dolphin-phi:latest',
    premium: 'dolphin3:latest',
  },
  aiml: {
    free: 'mistralai/Mistral-7B-Instruct-v0.2',
    premium: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
  },
  groq: {
    free: 'llama-3.1-8b-instant',
    premium: 'llama-3.3-70b-versatile',
  },
  gemini: {
    free: 'gemini-1.5-flash',
    premium: 'gemini-1.5-pro',
  },
};

const MAX_MESSAGE_LENGTH = 1500;
const MAX_RESPONSE_LENGTH = 4000;

type ChatbotEventName = 'intent_detected' | 'cta_shown' | 'cta_clicked' | 'resolution_confirmed';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  conversationId?: string;
  userContext?: {
    plan?: 'free' | 'pro' | 'lifetime';
    habitsCount?: number;
    currentStreak?: number;
    daysActive?: number;
    recentActivity?: string;
    completionRatio7d?: number;
    recentMisses7d?: number;
    streakTrend?: 'up' | 'flat' | 'down';
  };
}

interface ChatResponse {
  success: boolean;
  message?: string;
  intent?: UserIntent;
  source?: 'quick' | 'ai' | 'fallback';
  suggestions?: Array<{ label: string; prompt: string }>;
  cta?: { label: string; href: string } | null;
  error?: string;
}

interface DueFollowUp {
  _id: string;
  reason: 'checkback_24h' | 'checkback_72h';
  intent: 'troubleshooting' | 'motivation_needed';
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function normalizeUserContext(raw: unknown): ChatRequest['userContext'] {
  if (!isObject(raw)) return undefined;

  const planRaw = raw.plan;
  const plan = planRaw === 'free' || planRaw === 'pro' || planRaw === 'lifetime' ? planRaw : undefined;
  const completionRatio7d = asFiniteNumber(raw.completionRatio7d);
  const currentStreak = asFiniteNumber(raw.currentStreak);
  const daysActive = asFiniteNumber(raw.daysActive);
  const habitsCount = asFiniteNumber(raw.habitsCount);
  const recentMisses7d = asFiniteNumber(raw.recentMisses7d);
  const streakTrendRaw = raw.streakTrend;
  const streakTrend = streakTrendRaw === 'up' || streakTrendRaw === 'flat' || streakTrendRaw === 'down'
    ? streakTrendRaw
    : undefined;

  return {
    plan,
    completionRatio7d,
    currentStreak,
    daysActive,
    habitsCount,
    recentMisses7d,
    streakTrend,
    recentActivity: typeof raw.recentActivity === 'string' ? raw.recentActivity.slice(0, 240) : undefined,
  };
}

function validateChatRequest(raw: unknown): { ok: true; value: ChatRequest } | { ok: false; error: string } {
  if (!isObject(raw)) {
    return { ok: false, error: 'Invalid request payload' };
  }

  if (typeof raw.message !== 'string') {
    return { ok: false, error: 'Message is required' };
  }

  const message = raw.message.trim().slice(0, MAX_MESSAGE_LENGTH);
  if (!message) {
    return { ok: false, error: 'Message is required' };
  }

  const historyRaw = Array.isArray(raw.history) ? raw.history : [];
  const history: ChatMessage[] = historyRaw
    .filter(isObject)
    .map((entry): ChatMessage => {
      const role: ChatMessage['role'] =
        entry.role === 'user' || entry.role === 'assistant' || entry.role === 'system'
          ? entry.role
          : 'user';
      return {
        role,
        content: typeof entry.content === 'string' ? entry.content.slice(0, MAX_MESSAGE_LENGTH) : '',
      };
    })
    .filter((entry) => entry.content.length > 0)
    .slice(-30);

  const conversationId = typeof raw.conversationId === 'string' && raw.conversationId.trim().length > 0
    ? raw.conversationId.trim().slice(0, 80)
    : undefined;

  return {
    ok: true,
    value: {
      message,
      history,
      conversationId,
      userContext: normalizeUserContext(raw.userContext),
    },
  };
}

function sanitizeSuggestions(
  suggestions: unknown
): Array<{ label: string; prompt: string }> | undefined {
  if (!Array.isArray(suggestions)) return undefined;
  const cleaned = suggestions
    .filter(isObject)
    .map((entry) => ({
      label: typeof entry.label === 'string' ? entry.label.trim().slice(0, 60) : '',
      prompt: typeof entry.prompt === 'string' ? entry.prompt.trim().slice(0, 240) : '',
    }))
    .filter((entry) => entry.label.length > 0 && entry.prompt.length > 0)
    .slice(0, 6);

  return cleaned.length > 0 ? cleaned : undefined;
}

function buildFollowUpSuggestion(
  dueFollowUps: DueFollowUp[]
): Array<{ label: string; prompt: string }> {
  if (dueFollowUps.length === 0) return [];

  const reasons = new Set(dueFollowUps.map((f) => f.reason));
  const suggestions: Array<{ label: string; prompt: string }> = [];

  if (reasons.has('checkback_24h')) {
    suggestions.push({
      label: '24h check-in',
      prompt: 'Quick check-in: how did my plan go over the last day?',
    });
  }

  if (reasons.has('checkback_72h')) {
    suggestions.push({
      label: '72h reset review',
      prompt: 'Let’s do my 72-hour recovery review and adjust my next steps.',
    });
  }

  return suggestions;
}

function mergeSuggestions(
  primary: Array<{ label: string; prompt: string }>,
  additional: Array<{ label: string; prompt: string }>
): Array<{ label: string; prompt: string }> {
  const merged: Array<{ label: string; prompt: string }> = [];
  for (const item of [...additional, ...primary]) {
    if (merged.some((existing) => existing.label === item.label || existing.prompt === item.prompt)) {
      continue;
    }
    merged.push(item);
    if (merged.length >= 6) break;
  }
  return merged;
}

function shouldShowUpsellCta(args: {
  intent: UserIntent;
  userPlan: 'free' | 'pro' | 'lifetime';
  message: string;
  userContext?: ChatRequest['userContext'];
}): boolean {
  if (args.userPlan !== 'free') return false;

  const intentEligible = args.intent === 'pricing_question' || args.intent === 'upgrade_interest';
  if (intentEligible) return true;

  const messageSuggestsLimit = /(limit|capped|max|cannot create|can\'t create|hit\s+the\s+limit)/i.test(args.message);
  const habitsAtLimit = typeof args.userContext?.habitsCount === 'number' && args.userContext.habitsCount >= 10;

  return messageSuggestsLimit || habitsAtLimit;
}

function sanitizeCta(raw: unknown): { label: string; href: string } | null {
  if (!isObject(raw)) return null;
  const label = typeof raw.label === 'string' ? raw.label.trim().slice(0, 48) : '';
  const href = typeof raw.href === 'string' ? raw.href.trim() : '';

  if (!label || !href.startsWith('/')) {
    return null;
  }

  return {
    label,
    href: href.slice(0, 160),
  };
}

function createResponse(payload: ChatResponse): ChatResponse {
  return {
    success: payload.success,
    message: typeof payload.message === 'string' ? payload.message.slice(0, MAX_RESPONSE_LENGTH) : payload.message,
    intent: payload.intent,
    source: payload.source,
    suggestions: sanitizeSuggestions(payload.suggestions),
    cta: payload.cta === undefined ? null : sanitizeCta(payload.cta),
    error: payload.error,
  };
}

function approximateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

function buildConversationMemory(history: ChatMessage[], isPremium: boolean): {
  safeHistory: ChatMessage[];
  topicSummary: string | null;
} {
  const tokenBudget = isPremium ? 2200 : 1200;
  let tokenCount = 0;
  const reversed: ChatMessage[] = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const entry = history[i];
    if (entry.role !== 'user' && entry.role !== 'assistant') continue;

    const messageCost = approximateTokenCount(entry.content) + 10;
    if (tokenCount + messageCost > tokenBudget) break;

    reversed.push(entry);
    tokenCount += messageCost;
  }

  const safeHistory = reversed.reverse();
  const recentUserMessages = safeHistory
    .filter((entry) => entry.role === 'user')
    .slice(-6)
    .map((entry) => entry.content.toLowerCase());

  const stopWords = new Set([
    'what', 'when', 'where', 'which', 'would', 'could', 'should', 'have', 'with', 'from',
    'that', 'this', 'your', 'about', 'there', 'they', 'them', 'just', 'into', 'like',
  ]);
  const keywords: string[] = [];

  for (const text of recentUserMessages) {
    const words = text.match(/\b[a-z][a-z0-9_-]{3,}\b/g) ?? [];
    for (const word of words) {
      if (stopWords.has(word) || keywords.includes(word)) continue;
      keywords.push(word);
      if (keywords.length >= 6) break;
    }
    if (keywords.length >= 6) break;
  }

  return {
    safeHistory,
    topicSummary: keywords.length > 0 ? keywords.join(', ') : null,
  };
}

function applyDeterministicSafetyFilter(message: string): string {
  const blockedPatterns = [
    /stop\s+eating\s+for\s+(days|weeks)/i,
    /starv(?:e|ing)\s+(yourself|for)/i,
    /hurt\s+yourself/i,
    /self\s*-?\s*harm/i,
    /dangerous\s+crash\s+diet/i,
  ];

  if (blockedPatterns.some((pattern) => pattern.test(message))) {
    return 'I can’t help with harmful or extreme advice. I can help you with a safe, sustainable plan instead — for example, starting with one small healthy action today and building from there.';
  }

  return message.slice(0, MAX_RESPONSE_LENGTH).trim();
}

async function logChatbotEventBestEffort(args: {
  clerkId: string;
  eventName: ChatbotEventName;
  intent?: UserIntent;
  conversationId?: string;
  messageLength?: number;
  cta?: { label: string; href: string } | null;
  source: 'api' | 'client' | 'system';
  details?: unknown;
}) {
  if (!CHATBOT_SYNC_SECRET) return;

  try {
    const apiRef = (api as unknown as { chatbotAnalytics?: { logChatbotEvent?: unknown } })
      .chatbotAnalytics
      ?.logChatbotEvent;
    if (!apiRef) return;

    const invokeMutation = convex.mutation as unknown as (
      functionReference: unknown,
      mutationArgs: Record<string, unknown>
    ) => Promise<unknown>;

    await invokeMutation(apiRef, {
      clerkId: args.clerkId,
      eventName: args.eventName,
      intent: args.intent,
      source: args.source,
      conversationId: args.conversationId,
      messageLength: args.messageLength,
      cta: args.cta ?? undefined,
      details: args.details,
      syncSecret: CHATBOT_SYNC_SECRET,
    });
  } catch (error) {
    console.warn('[ChatbotTelemetry] Failed to write chatbot analytics event', {
      eventName: args.eventName,
      clerkId: args.clerkId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

async function getDueFollowUpsBestEffort(clerkId: string): Promise<DueFollowUp[]> {
  if (!CHATBOT_SYNC_SECRET) return [];

  try {
    const apiRef = (api as unknown as { chatbotAnalytics?: { getDueFollowUps?: unknown } })
      .chatbotAnalytics
      ?.getDueFollowUps;
    if (!apiRef) return [];

    const invokeQuery = convex.query as unknown as (
      functionReference: unknown,
      queryArgs: Record<string, unknown>
    ) => Promise<unknown>;

    const result = await invokeQuery(apiRef, {
      syncSecret: CHATBOT_SYNC_SECRET,
      clerkId,
      limit: 3,
    });

    if (!Array.isArray(result)) return [];

    return result
      .filter((row): row is Record<string, unknown> => isObject(row))
      .map((row): DueFollowUp => {
        const reason: DueFollowUp['reason'] =
          row.reason === 'checkback_72h' ? 'checkback_72h' : 'checkback_24h';
        const intent: DueFollowUp['intent'] =
          row.intent === 'motivation_needed' ? 'motivation_needed' : 'troubleshooting';

        return {
          _id: typeof row._id === 'string' ? row._id : '',
          reason,
          intent,
        };
      })
      .filter((row) => row._id.length > 0);
  } catch {
    return [];
  }
}

async function markFollowUpsSentBestEffort(followUpIds: string[]) {
  if (!CHATBOT_SYNC_SECRET || followUpIds.length === 0) return;

  try {
    const apiRef = (api as unknown as { chatbotAnalytics?: { markFollowUpsSent?: unknown } })
      .chatbotAnalytics
      ?.markFollowUpsSent;
    if (!apiRef) return;

    const invokeMutation = convex.mutation as unknown as (
      functionReference: unknown,
      mutationArgs: Record<string, unknown>
    ) => Promise<unknown>;

    await invokeMutation(apiRef, {
      syncSecret: CHATBOT_SYNC_SECRET,
      followUpIds,
    });
  } catch {
    // best effort only
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI PROVIDERS
// ─────────────────────────────────────────────────────────────────────────────────

// ── Ollama (local, zero-cost) ─────────────────────────────────────────────────
// The Ollama /api/chat endpoint follows the OpenAI-compatible messages schema.
// We use a 10-second request timeout so a cold-start or heavy model doesn't
// block the request for too long before falling back to cloud providers.

const OLLAMA_TIMEOUT_MS = 10_000;

async function isOllamaReachable(): Promise<boolean> {
  if (!OLLAMA_BASE_URL) return false;
  try {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), 2_000);
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: ctrl.signal });
    clearTimeout(tid);
    return res.ok;
  } catch {
    return false;
  }
}

async function callOllama(messages: ChatMessage[], isPremium: boolean): Promise<string> {
  if (!OLLAMA_BASE_URL) throw new Error('Ollama not configured (OLLAMA_BASE_URL is empty)');

  const model = isPremium ? MODELS.ollama.premium : MODELS.ollama.free;

  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), OLLAMA_TIMEOUT_MS);

  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: ctrl.signal,
      body: JSON.stringify({
        model,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: isPremium ? 1024 : 512,
        },
      }),
    });

    clearTimeout(tid);

    if (!response.ok) {
      throw new Error(`Ollama error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json() as { message?: { content?: string } };
    const content = data.message?.content ?? '';
    if (!content) throw new Error('Ollama returned empty response');
    return content;
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
}

async function callAIML(messages: ChatMessage[], isPremium: boolean): Promise<string> {
  if (!AIML_API_KEY) throw new Error('AIML API key not configured');
  const model = isPremium ? MODELS.aiml.premium : MODELS.aiml.free;

  const response = await fetch('https://api.aimlapi.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AIML_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: isPremium ? 1024 : 512,
    }),
  });

  if (!response.ok) {
    throw new Error(`AIML API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callGroq(messages: ChatMessage[], isPremium: boolean): Promise<string> {
  if (!GROQ_API_KEY) throw new Error('Groq API key not configured');
  const model = isPremium ? MODELS.groq.premium : MODELS.groq.free;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: isPremium ? 1024 : 512,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callGemini(messages: ChatMessage[], isPremium: boolean): Promise<string> {
  if (!GOOGLE_AI_KEY) throw new Error('Google AI key not configured');
  const model = isPremium ? MODELS.gemini.premium : MODELS.gemini.free;

  const contents = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const systemMessage = messages.find((m) => m.role === 'system');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_AI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: systemMessage
          ? { parts: [{ text: systemMessage.content }] }
          : undefined,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: isPremium ? 1024 : 512,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API key not configured');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://resurgo.life',
      'X-Title': 'Resurgo Chatbot',
    },
    body: JSON.stringify({
      model: 'google/gemma-2-9b-it:free',
      messages,
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${await response.text()}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function findFAQAnswer(message: string): string | null {
  const lower = message.toLowerCase();
  const allFAQs = [...FAQ.gettingStarted, ...FAQ.features, ...FAQ.account, ...FAQ.troubleshooting];

  for (const faq of allFAQs) {
    const questionWords = faq.q.toLowerCase().split(/\s+/);
    const messageWords = lower.split(/\s+/);
    const matches = questionWords.filter(
      (w) => w.length >= 3 && messageWords.some((m) => m.includes(w) || w.includes(m))
    );
    if (matches.length >= questionWords.filter((w) => w.length >= 3).length * 0.3) {
      return faq.a;
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN HANDLER
// ─────────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<ChatResponse>> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(createResponse({ success: false, error: 'Unauthorized' }), { status: 401 });
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(createResponse({ success: false, error: 'Invalid JSON payload' }), { status: 400 });
    }

    const validation = validateChatRequest(rawBody);
    if (!validation.ok) {
      return NextResponse.json(createResponse({ success: false, error: validation.error }), { status: 400 });
    }

    const payload = validation.value;

    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    const userPlanRaw = (clerkUser?.publicMetadata as Record<string, unknown> | undefined)?.plan;
    const userPlan = userPlanRaw === 'pro' || userPlanRaw === 'lifetime' ? userPlanRaw : 'free';
    const isPremium = userPlan === 'pro' || userPlan === 'lifetime';
    const clerkId = clerkUser?.id ?? userId;

    const { safeHistory, topicSummary } = buildConversationMemory(payload.history, isPremium);
    const intent = detectIntent(payload.message);
    const dueFollowUps = await getDueFollowUpsBestEffort(clerkId);
    const scheduledSuggestions = buildFollowUpSuggestion(dueFollowUps);
    const baseSuggestions = getFollowUpSuggestions(intent, userPlan);
    const suggestions = mergeSuggestions(baseSuggestions, scheduledSuggestions);
    const ctaCandidate = getIntentCta(intent, userPlan);
    const cta = ctaCandidate && shouldShowUpsellCta({
      intent,
      userPlan,
      message: payload.message,
      userContext: payload.userContext,
    })
      ? ctaCandidate
      : null;

    if (dueFollowUps.length > 0) {
      await markFollowUpsSentBestEffort(dueFollowUps.map((item) => item._id));
    }

    await logChatbotEventBestEffort({
      clerkId,
      eventName: 'intent_detected',
      intent,
      source: 'api',
      conversationId: payload.conversationId,
      messageLength: payload.message.length,
      details: {
        userPlan,
      },
    });

    if (cta) {
      await logChatbotEventBestEffort({
        clerkId,
        eventName: 'cta_shown',
        intent,
        source: 'api',
        conversationId: payload.conversationId,
        cta,
      });
    }

    const quickResponse = getQuickResponse(intent);
    if (quickResponse) {
      return NextResponse.json(
        createResponse({
          success: true,
          message: applyDeterministicSafetyFilter(quickResponse),
          intent,
          source: 'quick',
          suggestions,
          cta,
        })
      );
    }

    const faqAnswer = findFAQAnswer(payload.message);
    if (faqAnswer) {
      return NextResponse.json(
        createResponse({
          success: true,
          message: applyDeterministicSafetyFilter(faqAnswer),
          intent,
          source: 'quick',
          suggestions,
          cta,
        })
      );
    }

    const systemPrompt = buildChatbotSystemPrompt({
      ...payload.userContext,
      plan: userPlan,
    });

    const enhancedSystemPrompt = topicSummary
      ? `${systemPrompt}\n\nCONVERSATION CONTINUITY:\n- Recent user topic keywords: ${topicSummary}`
      : systemPrompt;

    const messages: ChatMessage[] = [
      { role: 'system', content: enhancedSystemPrompt },
      ...safeHistory,
      { role: 'user', content: payload.message },
    ];

    let aiResponse = '';

    // ── Provider cascade: Ollama (local, free) → AIML → Groq → Gemini → OpenRouter ──
    // Ollama is tried first whenever it's reachable. Cloud providers are fallbacks.

    let ollamaAvailable = false;
    try {
      ollamaAvailable = await isOllamaReachable();
    } catch {
      ollamaAvailable = false;
    }

    try {
      if (!ollamaAvailable) throw new Error('Ollama not reachable — skipping to cloud');
      aiResponse = await callOllama(messages, isPremium);
      console.info('[AI] Responded via Ollama');
    } catch (ollamaError) {
      console.warn('Ollama skipped/failed:', (ollamaError as Error).message);
      try {
        aiResponse = await callAIML(messages, isPremium);
      } catch (aimlError) {
        console.warn('AIML failed:', (aimlError as Error).message);
        try {
          aiResponse = await callGroq(messages, isPremium);
        } catch (groqError) {
          console.warn('Groq failed:', (groqError as Error).message);
          try {
            aiResponse = await callGemini(messages, isPremium);
          } catch (geminiError) {
            console.warn('Gemini failed:', (geminiError as Error).message);
            try {
              aiResponse = await callOpenRouter(messages);
            } catch (openRouterError) {
              console.warn('All AI providers failed:', (openRouterError as Error).message);
              const fallback = CHATBOT_PERSONA.fallbacks[
                Math.floor(Math.random() * CHATBOT_PERSONA.fallbacks.length)
              ];
              return NextResponse.json(
                createResponse({
                  success: true,
                  message: applyDeterministicSafetyFilter(fallback),
                  intent,
                  source: 'fallback',
                  suggestions,
                  cta,
                })
              );
            }
          }
        }
      }
    }

    return NextResponse.json(
      createResponse({
        success: true,
        message: applyDeterministicSafetyFilter(aiResponse),
        intent,
        source: 'ai',
        suggestions,
        cta,
      })
    );
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      createResponse({
        success: false,
        error: 'Something went wrong. Please try again.',
        message: CHATBOT_PERSONA.fallbacks[0],
      }),
      { status: 500 }
    );
  }
}
