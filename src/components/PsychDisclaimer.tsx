'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Brain, ShieldX, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// PsychDisclaimer
// Drop this into the Settings page to explain the Psychology Engine and give the
// user full GDPR-compliant control over their psychological profile data.
// ─────────────────────────────────────────────────────────────────────────────
export function PsychDisclaimer() {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const deleteProfile = useMutation(api.psychology.deleteProfile);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    await deleteProfile({});
    setDeleted(true);
    setConfirming(false);
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-3">
      {/* Header */}
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-indigo-500 shrink-0" />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Adaptive Coaching Profile
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              How Resurgo personalises your coaching experience
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-gray-400 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-gray-400 shrink-0" />
        )}
      </button>

      {/* Expandable detail */}
      {expanded && (
        <div className="space-y-4 pt-1 border-t border-gray-100 dark:border-gray-800">
          {/* What it is */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">What we track</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              As you chat with your AI coach, Resurgo builds a private model of how you communicate,
              what motivates you, and what coaching style helps you most. This uses the Big Five
              personality model, cognitive reframing patterns (CBT), and motivational stage theory (SDT).
            </p>
          </div>

          {/* What it is NOT */}
          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 flex gap-2">
            <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Important disclaimer
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                This is a coaching tool, not a clinical assessment. Resurgo does not diagnose, treat,
                or assess any mental health condition. If you are experiencing a mental health crisis,
                please contact a qualified professional or a crisis helpline.
              </p>
            </div>
          </div>

          {/* Storage */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">How it&apos;s stored</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Your profile is stored encrypted in your Convex database and is never shared with
              third parties or used to train AI models. You can delete it at any time below.
            </p>
          </div>

          {/* Delete CTA */}
          {!deleted ? (
            <div className="pt-1">
              <button
                onClick={handleDelete}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  confirming
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <ShieldX size={14} />
                {confirming ? 'Confirm — delete my profile permanently' : 'Delete my coaching profile'}
              </button>
              {confirming && (
                <p className="text-xs text-gray-400 mt-1">
                  Click again to confirm. This cannot be undone.
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-3">
              <p className="text-xs text-green-700 dark:text-green-400">
                ✓ Your coaching profile has been deleted. Resurgo will start fresh on your next conversation.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PsychDisclaimer;
