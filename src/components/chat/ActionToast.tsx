'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, Zap, Brain, DollarSign, Heart, BellRing, Target } from 'lucide-react';
import type { ActionResult } from '@/lib/ai/actions/executor';

// ─────────────────────────────────────────────────────────────────────────────
// Maps an action type to a display-friendly label + icon
// ─────────────────────────────────────────────────────────────────────────────
const ACTION_META: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  create_task: { label: 'Task created', icon: <CheckCircle2 size={16} />, color: 'text-emerald-500' },
  update_task: { label: 'Task updated', icon: <CheckCircle2 size={16} />, color: 'text-blue-500' },
  create_habit: { label: 'Habit added', icon: <Zap size={16} />, color: 'text-violet-500' },
  update_goal: { label: 'Goal updated', icon: <Target size={16} />, color: 'text-amber-500' },
  log_mood: { label: 'Mood logged', icon: <Heart size={16} />, color: 'text-pink-500' },
  emergency_mode: { label: 'Emergency mode activated', icon: <AlertCircle size={16} />, color: 'text-red-500' },
  schedule_reminder: { label: 'Reminder set', icon: <BellRing size={16} />, color: 'text-sky-500' },
  log_expense: { label: 'Expense logged', icon: <DollarSign size={16} />, color: 'text-orange-500' },
  suggest: { label: 'Suggestion', icon: <Brain size={16} />, color: 'text-indigo-500' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────
interface ActionToastProps {
  actionResults: ActionResult[];
  pendingSuggestions?: ActionResult[];
  onConfirmSuggestion?: (suggestionText: string, confirmAction?: string) => void;
  onDismissSuggestion?: (suggestionText: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// ActionToast — shows rich notifications for AI-executed actions.
// Mount this at the root of your chat component and pass `actionResults` down.
// ─────────────────────────────────────────────────────────────────────────────
export function ActionToast({
  actionResults,
  pendingSuggestions = [],
  onConfirmSuggestion,
  onDismissSuggestion,
}: ActionToastProps) {
  const shownIds = useRef(new Set<string>());

  // ── Show completed-action toasts ────────────────────────────────────────
  useEffect(() => {
    for (const result of actionResults) {
      if (result.requiresConfirmation) continue;

      const key = `${result.actionType}-${JSON.stringify(result.data)}-${Date.now()}`;
      if (shownIds.current.has(key)) continue;
      shownIds.current.add(key);

      const meta = ACTION_META[result.actionType] ?? {
        label: result.actionType.replace(/_/g, ' '),
        icon: <CheckCircle2 size={16} />,
        color: 'text-gray-500',
      };

      if (result.success) {
        toast.success(meta.label, {
          description: result.error ? undefined : undefined,
          icon: <span className={meta.color}>{meta.icon}</span>,
          duration: 4000,
        });
      } else {
        toast.error(`${meta.label} failed`, {
          description: result.error ?? 'Unknown error',
          duration: 6000,
        });
      }
    }
  }, [actionResults]);

  // ── Show suggestion toasts that need confirmation ───────────────────────
  useEffect(() => {
    for (const suggestion of pendingSuggestions) {
      const key = `suggest-${suggestion.suggestionText}`;
      if (shownIds.current.has(key)) continue;
      shownIds.current.add(key);

      toast(
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            💡 {suggestion.suggestionText}
          </p>
          {(suggestion.data as any)?.reason && (
            <p className="text-xs text-gray-500">{(suggestion.data as any).reason}</p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                onConfirmSuggestion?.(
                  suggestion.suggestionText ?? '',
                  (suggestion.data as any)?.confirmAction
                );
                toast.dismiss(key);
              }}
              className="px-3 py-1 text-xs rounded-md bg-orange-600 text-white hover:bg-orange-700 transition-colors"
            >
              Yes, do it
            </button>
            <button
              onClick={() => {
                onDismissSuggestion?.(suggestion.suggestionText ?? '');
                toast.dismiss(key);
              }}
              className="px-3 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>,
        {
          id: key,
          duration: Infinity, // stays until user acts
          icon: <Brain size={16} className="text-indigo-500" />,
        }
      );
    }
  }, [pendingSuggestions, onConfirmSuggestion, onDismissSuggestion]);

  // This component is purely side-effect — renders nothing
  return null;
}

export default ActionToast;
