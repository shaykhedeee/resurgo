import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import type { AICoachResponse, AIActionType } from '../actions/schema';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface ActionResult {
  actionType: string;
  success: boolean;
  data?: unknown;
  error?: string;
  requiresConfirmation?: boolean;
  suggestionText?: string;
  durationMs?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION DEDUPLICATION
// Prevents the AI from creating duplicate tasks/habits in the same session
// (e.g. if the user sends two near-identical messages).
// Key = `${actionType}::${normalised title}`. Resets per process instance.
// ─────────────────────────────────────────────────────────────────────────────
const _sessionDedup = new Map<string, number>(); // key → Unix ms of first execution
const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isDuplicate(actionType: string, title: string): boolean {
  const key = `${actionType}::${title.toLowerCase().trim()}`;
  const ts = _sessionDedup.get(key);
  if (!ts) return false;
  if (Date.now() - ts > DEDUP_WINDOW_MS) {
    _sessionDedup.delete(key);
    return false;
  }
  return true;
}

function markExecuted(actionType: string, title: string): void {
  const key = `${actionType}::${title.toLowerCase().trim()}`;
  _sessionDedup.set(key, Date.now());
}

// ─────────────────────────────────────────────────────────────────────────────
// MUTATION TIMEOUT WRAPPER
// Convex mutations should resolve quickly; abort if >10 s to prevent hangs.
// ─────────────────────────────────────────────────────────────────────────────
const MUTATION_TIMEOUT_MS = 10_000;

async function withMutationTimeout<T>(label: string, promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`Convex mutation "${label}" timed out after ${MUTATION_TIMEOUT_MS}ms`)),
      MUTATION_TIMEOUT_MS
    );
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

// ─────────────────────────────────────────────────────────────────────────────
// TELEMETRY — structured console log for action execution
// ─────────────────────────────────────────────────────────────────────────────
function logAction(type: string, success: boolean, durationMs: number, detail?: string): void {
  const icon = success ? '✓' : '✗';
  console.log(
    `[Actions] ${icon} ${type.padEnd(20)} ${durationMs}ms${detail ? `  (${detail})` : ''}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRE-MUTATION VALIDATION
// Basic sanity checks to avoid sending bad data to Convex.
// ─────────────────────────────────────────────────────────────────────────────
function validateTitle(title: unknown, maxLen = 200): string {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('title is required and must be a non-empty string');
  }
  return title.trim().slice(0, maxLen);
}

// ─────────────────────────────────────────────────────────────────────────────
// Execute all AI-generated actions for a single coach turn.
// Pass the Clerk JWT (from getToken({ template:'convex' })) to authenticate.
// ─────────────────────────────────────────────────────────────────────────────
export async function executeActions(
  clerkToken: string,
  response: AICoachResponse,
  skipIndices: Set<number> = new Set()
): Promise<ActionResult[]> {
  convex.setAuth(clerkToken);

  const results: ActionResult[] = [];

  for (let i = 0; i < response.actions.length; i++) {
    const action = response.actions[i] as AIActionType;

    // Suggestions always require confirmation — return info without executing
    if (action.action === 'suggest' || skipIndices.has(i)) {
      if (action.action === 'suggest') {
        results.push({
          actionType: 'suggest',
          success: true,
          requiresConfirmation: true,
          suggestionText: action.data.title,
          data: {
            reason: action.data.reason,
            confirmAction: action.data.confirmAction,
            urgency: action.data.urgency,
          },
        });
      }
      continue;
    }

    const t0 = Date.now();

    try {
      switch (action.action) {
        case 'create_task': {
          const title = validateTitle(action.data.title);
          if (isDuplicate('create_task', title)) {
            logAction('create_task', true, 0, `dedup skip: "${title}"`);
            results.push({ actionType: 'create_task', success: true, data: { deduped: true } });
            break;
          }
          const id = await withMutationTimeout('create_task', convex.mutation(api.tasks.createFromAI, {
            title,
            priority: action.data.priority,
            dueDate: action.data.dueDate,
            energyRequired: action.data.energyRequired,
            tags: action.data.tags,
          }));
          markExecuted('create_task', title);
          logAction('create_task', true, Date.now() - t0, `"${title}"`);
          results.push({ actionType: 'create_task', success: true, data: { id }, durationMs: Date.now() - t0 });
          break;
        }
        case 'update_task': {
          const titleMatch = validateTitle(action.data.titleMatch);
          await withMutationTimeout('update_task', convex.mutation(api.tasks.updateByTitle, {
            titleMatch,
            priority: action.data.priority,
            dueDate: action.data.dueDate,
            completed: action.data.completed,
          }));
          logAction('update_task', true, Date.now() - t0, `"${titleMatch}"`);
          results.push({ actionType: 'update_task', success: true, durationMs: Date.now() - t0 });
          break;
        }
        case 'create_habit': {
          const title = validateTitle(action.data.title);
          if (isDuplicate('create_habit', title)) {
            logAction('create_habit', true, 0, `dedup skip: "${title}"`);
            results.push({ actionType: 'create_habit', success: true, data: { deduped: true } });
            break;
          }
          const id = await withMutationTimeout('create_habit', convex.mutation(api.habits.createFromAI, {
            title,
            frequency: action.data.frequency,
            timeOfDay: (action.data.timeOfDay as 'morning' | 'afternoon' | 'evening' | 'anytime') ?? 'anytime',
            category: action.data.category,
          }));
          markExecuted('create_habit', title);
          logAction('create_habit', true, Date.now() - t0, `"${title}"`);
          results.push({ actionType: 'create_habit', success: true, data: { id }, durationMs: Date.now() - t0 });
          break;
        }
        case 'log_mood': {
          const score = Number(action.data.score);
          if (isNaN(score) || score < 1 || score > 5) throw new Error(`Invalid mood score: ${action.data.score}`);
          await withMutationTimeout('log_mood', convex.mutation(api.wellness.logMoodFromAI, {
            score,
            notes: action.data.notes,
            date: action.data.date,
          }));
          logAction('log_mood', true, Date.now() - t0, `score=${score}`);
          results.push({ actionType: 'log_mood', success: true, durationMs: Date.now() - t0 });
          break;
        }
        case 'emergency_mode': {
          const isActive = action.data.severity !== 'mild';
          await withMutationTimeout('emergency_mode', convex.mutation(api.users.setEmergencyMode, {
            active: isActive,
            reason: action.data.reason,
          }));
          logAction('emergency_mode', true, Date.now() - t0, `active=${isActive}`);
          results.push({ actionType: 'emergency_mode', success: true, data: { active: isActive }, durationMs: Date.now() - t0 });
          break;
        }
        case 'log_expense': {
          const amount = Number(action.data.amount);
          if (isNaN(amount) || amount < 0) throw new Error(`Invalid expense amount: ${action.data.amount}`);
          const id = await withMutationTimeout('log_expense', convex.mutation(api.budget.logExpenseFromAI, {
            amount,
            currency: action.data.currency,
            category: action.data.category,
            description: action.data.description,
            date: action.data.date,
          }));
          logAction('log_expense', true, Date.now() - t0, `${amount} ${action.data.currency}`);
          results.push({ actionType: 'log_expense', success: true, data: { id }, durationMs: Date.now() - t0 });
          break;
        }
        case 'schedule_reminder': {
          try {
            const remindersApi = (api as Record<string, unknown>).reminders as { create?: unknown } | undefined;
            if (remindersApi?.create) {
              await withMutationTimeout('schedule_reminder', convex.mutation(
                remindersApi.create as Parameters<typeof convex.mutation>[0],
                {
                  title: action.data.message,
                  scheduledFor: action.data.scheduledFor,
                  type: action.data.type,
                }
              ));
            }
          } catch { /* non-critical */ }
          logAction('schedule_reminder', true, Date.now() - t0);
          results.push({ actionType: 'schedule_reminder', success: true, durationMs: Date.now() - t0 });
          break;
        }
        case 'update_goal': {
          try {
            const goalsApi = (api as Record<string, unknown>).goals as { updateProgress?: unknown } | undefined;
            if (goalsApi?.updateProgress) {
              await withMutationTimeout('update_goal', convex.mutation(
                goalsApi.updateProgress as Parameters<typeof convex.mutation>[0], {
                titleQuery: action.data.titleMatch,
                progressIncrement: action.data.progressIncrement,
                status: action.data.status,
                note: action.data.note,
              }));
            }
          } catch { /* non-critical */ }
          logAction('update_goal', true, Date.now() - t0);
          results.push({ actionType: 'update_goal', success: true, durationMs: Date.now() - t0 });
          break;
        }

        case 'just_start': {
          // Create a micro-task tagged as a "just start" item — ultra-low friction
          const microTask = validateTitle(action.data.microTask, 200);
          if (isDuplicate('just_start', microTask)) {
            logAction('just_start', true, 0, `dedup skip: "${microTask}"`);
            results.push({ actionType: 'just_start', success: true, data: { deduped: true } });
            break;
          }
          const id = await withMutationTimeout('just_start', convex.mutation(api.tasks.createFromAI, {
            title: microTask,
            priority: 'high' as const,
            energyRequired: 'low' as const,
            tags: ['just-start', '⚡ 2-min'],
          }));
          markExecuted('just_start', microTask);
          logAction('just_start', true, Date.now() - t0, `"${microTask}"`);
          results.push({
            actionType: 'just_start',
            success: true,
            data: { id, microTask, fullTask: action.data.fullTask, nextMicroTask: action.data.nextMicroTask },
            durationMs: Date.now() - t0,
          });
          break;
        }
        default:
          results.push({ actionType: (action as { action: string }).action, success: false, error: 'Unknown action type' });
      }
    } catch (err) {
      const actionType = (action as { action?: string }).action ?? 'unknown';
      const error = err instanceof Error ? err.message : String(err);
      logAction(actionType, false, Date.now() - t0, error);
      console.error(`[ActionExecutor] Failed to execute ${actionType}:`, error);
      results.push({ actionType, success: false, error, durationMs: Date.now() - t0 });
    }
  }

  return results;
}
