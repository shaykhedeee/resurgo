// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Actions Schema (Zod)
// The Living System: AI conversation → real-time Convex mutations.
// Every AI coaching response can include structured actions that mutate DB.
// ═══════════════════════════════════════════════════════════════════════════════

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// INDIVIDUAL ACTION TYPES
// ─────────────────────────────────────────────────────────────────────────────

const CreateTaskAction = z.object({
  action: z.literal('create_task'),
  data: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(500).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    dueDate: z.string().optional(), // ISO date string YYYY-MM-DD
    energyRequired: z.enum(['low', 'medium', 'high']).optional(),
    tags: z.array(z.string()).max(5).optional(),
  }),
});

const UpdateTaskAction = z.object({
  action: z.literal('update_task'),
  data: z.object({
    titleMatch: z.string().min(1), // Fuzzy match by title
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    dueDate: z.string().optional(),
    completed: z.boolean().optional(),
  }),
});

const CreateHabitAction = z.object({
  action: z.literal('create_habit'),
  data: z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(300).optional(),
    frequency: z.enum(['daily', 'weekdays', 'weekends', '3x_week', 'weekly']).default('daily'),
    timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'anytime']).default('anytime'),
    category: z.string().default('personal_growth'),
    identityLabel: z.string().max(100).optional(), // "I am someone who..."
    cueDescription: z.string().max(200).optional(), // If-then trigger
    estimatedMinutes: z.number().min(1).max(240).optional(),
  }),
});

const UpdateGoalAction = z.object({
  action: z.literal('update_goal'),
  data: z.object({
    titleMatch: z.string().min(1),
    progressIncrement: z.number().optional(), // % to add
    status: z.enum(['active', 'completed', 'paused']).optional(),
    note: z.string().max(300).optional(),
  }),
});

const LogMoodAction = z.object({
  action: z.literal('log_mood'),
  data: z.object({
    score: z.number().min(1).max(5),
    notes: z.string().max(300).optional(),
    tags: z.array(z.string()).max(5).optional(),
    // date defaults to today if not provided
    date: z.string().optional(),
  }),
});

const TriggerEmergencyModeAction = z.object({
  action: z.literal('emergency_mode'),
  data: z.object({
    reason: z.string().max(200).optional(),
    severity: z.enum(['mild', 'moderate', 'severe']).default('moderate'),
  }),
});

const ScheduleReminderAction = z.object({
  action: z.literal('schedule_reminder'),
  data: z.object({
    message: z.string().min(1).max(300),
    scheduledFor: z.string(), // ISO datetime
    type: z.enum(['task', 'habit', 'general', 'health', 'custom']).default('general'),
    relatedTitle: z.string().optional(),
  }),
});

const LogExpenseAction = z.object({
  action: z.literal('log_expense'),
  data: z.object({
    amount: z.number().min(0),
    currency: z.string().length(3).default('USD'),
    category: z.string().default('general'),
    description: z.string().max(200).optional(),
    date: z.string().optional(),
  }),
});

// just_start: ADHD-friendly micro-task mode — one absurdly tiny action
const JustStartAction = z.object({
  action: z.literal('just_start'),
  data: z.object({
    microTask: z.string().min(1).max(200), // The tiny 1-2 minute action step
    fullTask: z.string().max(200).optional(), // The real task they are avoiding
    nextMicroTask: z.string().max(200).optional(), // Optional: what comes right after
  }),
});

// Suggest requires user confirmation before executing
const SuggestAction = z.object({
  action: z.literal('suggest'),
  data: z.object({
    type: z.enum(['task', 'habit', 'goal', 'reminder', 'break', 'custom']),
    title: z.string().min(1).max(200),
    reason: z.string().max(300), // Why the AI is suggesting this
    urgency: z.enum(['low', 'medium', 'high']).default('low'),
    // If confirmed, which action to execute:
    confirmAction: z.enum(['create_task', 'create_habit', 'schedule_reminder']).optional(),
  }),
});

// ─────────────────────────────────────────────────────────────────────────────
// DISCRIMINATED UNION — all action types
// ─────────────────────────────────────────────────────────────────────────────

export const AIAction = z.discriminatedUnion('action', [
  CreateTaskAction,
  UpdateTaskAction,
  CreateHabitAction,
  UpdateGoalAction,
  LogMoodAction,
  TriggerEmergencyModeAction,
  ScheduleReminderAction,
  LogExpenseAction,
  JustStartAction,
  SuggestAction,
]);

export type AIActionType = z.infer<typeof AIAction>;

// ─────────────────────────────────────────────────────────────────────────────
// FULL AI COACH RESPONSE SCHEMA
// The AI must ALWAYS return this shape when called from the coach route.
// ─────────────────────────────────────────────────────────────────────────────

export const AICoachResponseSchema = z.object({
  message: z.string().min(1).max(1500),
  actions: z.array(AIAction).max(5).default([]),
  // Indices in actions[] that need user confirmation before executing
  requiresConfirmation: z.array(z.number().int().min(0)).default([]),
  // Short memory patch — what the AI wants to remember for next session (max 200 chars)
  memoryPatch: z.string().max(200).optional(),
});

export type AICoachResponse = z.infer<typeof AICoachResponseSchema>;
