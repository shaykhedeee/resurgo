// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump Schema (Zod)
// Strict typing for AI-parsed brain dump responses
// ═══════════════════════════════════════════════════════════════════════════════

import { z } from 'zod';

export const TaskCategory = z.enum([
  'WORK', 'PERSONAL', 'HEALTH', 'FINANCE', 'LEARNING',
  'SOCIAL', 'HOME', 'CREATIVE', 'ADMIN', 'URGENT_LIFE',
]);

export const TaskPriority = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const EmotionTag = z.enum([
  'overwhelmed', 'anxious', 'frustrated', 'hopeful',
  'motivated', 'exhausted', 'confused', 'guilty',
  'neutral', 'excited',
]);

export const ParsedTaskSchema = z.object({
  title: z.string().min(2).max(200),
  category: TaskCategory,
  priority: TaskPriority,
  estimated_minutes: z.number().int().min(5).max(480).nullable(),
  suggested_due: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format')
    .nullable(),
  depends_on: z.string().nullable(),
  relates_to_goal: z.string().nullable(),
  energy_level: z.enum(['high', 'medium', 'low']),
  is_recurring: z.boolean(),
  recurrence_pattern: z.string().nullable(),
});

export const BrainDumpResponseSchema = z.object({
  emotions_detected: z.array(EmotionTag).min(1),
  emotional_acknowledgment: z.string().min(10).max(500),
  tasks: z.array(ParsedTaskSchema).min(0).max(50),
  habits_suggested: z.array(z.object({
    name: z.string(),
    frequency: z.enum(['daily', 'weekly', '3x_week', 'weekdays']),
    reason: z.string().max(150),
  })),
  patterns_observed: z.string().max(500).nullable(),
  quick_win: z.string().max(200),
  total_estimated_hours: z.number().nullable(),
  overcommitment_warning: z.boolean(),
  overcommitment_message: z.string().max(300).nullable(),
  // Neural map: task connections and clusters for flowchart visualization
  neural_map: z.object({
    clusters: z.array(z.object({
      id: z.string(),
      label: z.string(),
      tasks: z.array(z.string()),
      color: z.string(),
    })),
    connections: z.array(z.object({
      from: z.string(),
      to: z.string(),
      relationship: z.enum(['blocks', 'enables', 'relates_to', 'same_cluster']),
    })),
    root_priority: z.string().max(200),
  }).optional(),
});

export type ParsedTask = z.infer<typeof ParsedTaskSchema>;
export type BrainDumpResponse = z.infer<typeof BrainDumpResponseSchema>;
export type TaskCategoryType = z.infer<typeof TaskCategory>;
export type TaskPriorityType = z.infer<typeof TaskPriority>;
export type EmotionTagType = z.infer<typeof EmotionTag>;
