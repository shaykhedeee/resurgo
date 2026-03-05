// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump Parser
// 3-attempt AI pipeline: parse → repair → full-retry
// Uses the multi-provider callAI cascade for resilient parsing
// ═══════════════════════════════════════════════════════════════════════════════

import { callAI, type AIResponse } from '../provider-router';
import { BrainDumpResponseSchema, type BrainDumpResponse } from './schema';
import { buildBrainDumpSystemPrompt, type BrainDumpUserContext } from './prompt';

// ─────────────────────────────────────────────────────────────────────────────
// ERROR LOGGING
// ─────────────────────────────────────────────────────────────────────────────

interface ParseAttemptLog {
  timestamp: string;
  attempt: number;
  provider: string;
  rawResponsePreview: string;
  error: string | null;
  success: boolean;
  repairAttempted: boolean;
  latencyMs: number;
}

const parseLog: ParseAttemptLog[] = [];

function logAttempt(entry: ParseAttemptLog): void {
  parseLog.push(entry);
  if (parseLog.length > 100) parseLog.shift();
  if (!entry.success) {
    console.error('[BrainDump Parser] Failed attempt:', {
      attempt: entry.attempt,
      provider: entry.provider,
      error: entry.error,
    });
  }
}

export function getParseLog(): ParseAttemptLog[] {
  return [...parseLog];
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON EXTRACTION & CLEANING
// ─────────────────────────────────────────────────────────────────────────────

function extractJSON(raw: string): string {
  // Strategy 1: Already valid JSON
  try {
    JSON.parse(raw);
    return raw;
  } catch { /* continue */ }

  // Strategy 2: Markdown code block
  const codeBlockMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) return codeBlockMatch[1].trim();

  // Strategy 3: First { to last }
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return raw.substring(firstBrace, lastBrace + 1);
  }

  return raw;
}

function sanitizeJSON(jsonStr: string): string {
  return jsonStr
    .replace(/,\s*([}\]])/g, '$1')           // Trailing commas
    .replace(/[\x00-\x1F\x7F]/g, (char) => { // Control chars
      if (['\n', '\r', '\t'].includes(char)) return char;
      return '';
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

interface ValidationResult {
  success: boolean;
  data?: BrainDumpResponse;
  errors?: string[];
}

function validateResponse(raw: string): ValidationResult {
  try {
    const jsonStr = extractJSON(raw);
    const sanitized = sanitizeJSON(jsonStr);

    let parsed: unknown;
    try {
      parsed = JSON.parse(sanitized);
    } catch (jsonError) {
      return { success: false, errors: [`Invalid JSON: ${(jsonError as Error).message}`] };
    }

    const result = BrainDumpResponseSchema.safeParse(parsed);
    if (result.success) return { success: true, data: result.data };

    return {
      success: false,
      errors: result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`),
    };
  } catch (error) {
    return { success: false, errors: [`Unexpected: ${(error as Error).message}`] };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REPAIR PROMPT
// ─────────────────────────────────────────────────────────────────────────────

function buildRepairPrompt(original: string, errors: string[]): string {
  return `
The previous JSON response had validation errors.
Fix ONLY the errors below and return corrected JSON.
No text before or after the JSON.

ERRORS:
${errors.map((e, i) => `${i + 1}. ${e}`).join('\n')}

ORIGINAL (fix this):
${original}
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PARSER
// ─────────────────────────────────────────────────────────────────────────────

export interface BrainDumpInput {
  rawText: string;
  userContext: BrainDumpUserContext;
}

export interface BrainDumpResult {
  success: boolean;
  data?: BrainDumpResponse;
  error?: string;
  provider?: string;
  totalLatencyMs: number;
  attempts: number;
}

export async function parseBrainDump(input: BrainDumpInput): Promise<BrainDumpResult> {
  const { rawText, userContext } = input;
  const startTime = Date.now();
  const today = new Date().toISOString().split('T')[0];

  // Guards
  if (!rawText || rawText.trim().length < 3) {
    return { success: false, error: 'Too short. Tell me more.', totalLatencyMs: 0, attempts: 0 };
  }

  const truncatedText = rawText.length > 5000
    ? rawText.substring(0, 5000) + '\n[...truncated]'
    : rawText;

  const systemPrompt = buildBrainDumpSystemPrompt(userContext, today);

  // ── ATTEMPT 1: Fresh parse ──
  let aiResponse: AIResponse;
  try {
    aiResponse = await callAI(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: truncatedText },
      ],
      { taskType: 'json', temperature: 0.3, maxTokens: 4096, requireJson: true }
    );
  } catch (error) {
    logAttempt({
      timestamp: new Date().toISOString(), attempt: 1,
      provider: 'all-failed', rawResponsePreview: '',
      error: (error as Error).message, success: false,
      repairAttempted: false, latencyMs: Date.now() - startTime,
    });
    return {
      success: false,
      error: 'AI temporarily unavailable. Please try again.',
      totalLatencyMs: Date.now() - startTime, attempts: 1,
    };
  }

  const v1 = validateResponse(aiResponse.content);
  logAttempt({
    timestamp: new Date().toISOString(), attempt: 1,
    provider: aiResponse.provider,
    rawResponsePreview: aiResponse.content.substring(0, 300),
    error: v1.errors?.join('; ') || null, success: v1.success,
    repairAttempted: false, latencyMs: Date.now() - startTime,
  });

  if (v1.success && v1.data) {
    return {
      success: true, data: v1.data, provider: aiResponse.provider,
      totalLatencyMs: Date.now() - startTime, attempts: 1,
    };
  }

  // ── ATTEMPT 2: Repair ──
  try {
    const repairResponse = await callAI(
      [
        { role: 'system', content: 'You are a JSON repair assistant. Return ONLY valid JSON.' },
        { role: 'user', content: buildRepairPrompt(aiResponse.content, v1.errors || []) },
      ],
      { taskType: 'json', temperature: 0.1, maxTokens: 4096, requireJson: true }
    );

    const v2 = validateResponse(repairResponse.content);
    logAttempt({
      timestamp: new Date().toISOString(), attempt: 2,
      provider: repairResponse.provider,
      rawResponsePreview: repairResponse.content.substring(0, 300),
      error: v2.errors?.join('; ') || null, success: v2.success,
      repairAttempted: true, latencyMs: Date.now() - startTime,
    });

    if (v2.success && v2.data) {
      return {
        success: true, data: v2.data, provider: repairResponse.provider,
        totalLatencyMs: Date.now() - startTime, attempts: 2,
      };
    }
  } catch { /* continue to attempt 3 */ }

  // ── ATTEMPT 3: Complete re-parse ──
  try {
    const retry = await callAI(
      [
        { role: 'system', content: systemPrompt + '\n\nCRITICAL: Be EXTREMELY careful with JSON. Double-check every comma and bracket.' },
        { role: 'user', content: truncatedText },
      ],
      { taskType: 'json', temperature: 0.2, maxTokens: 4096, requireJson: true }
    );

    const v3 = validateResponse(retry.content);
    logAttempt({
      timestamp: new Date().toISOString(), attempt: 3,
      provider: retry.provider,
      rawResponsePreview: retry.content.substring(0, 300),
      error: v3.errors?.join('; ') || null, success: v3.success,
      repairAttempted: false, latencyMs: Date.now() - startTime,
    });

    if (v3.success && v3.data) {
      return {
        success: true, data: v3.data, provider: retry.provider,
        totalLatencyMs: Date.now() - startTime, attempts: 3,
      };
    }
  } catch { /* all failed */ }

  // ── ALL FAILED ──
  return {
    success: false,
    error: 'Had trouble parsing your brain dump. Try breaking it into shorter points.',
    totalLatencyMs: Date.now() - startTime, attempts: 3,
  };
}
