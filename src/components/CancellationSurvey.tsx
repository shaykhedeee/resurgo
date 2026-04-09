'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Cancellation Survey Modal
// Collects churn reasons before cancellation proceeds
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { X } from 'lucide-react';

const REASONS = [
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'not_using', label: "I'm not using it enough" },
  { value: 'missing_features', label: 'Missing features I need' },
  { value: 'found_alternative', label: 'Found a better alternative' },
  { value: 'too_complex', label: 'Too complicated to use' },
  { value: 'temporary', label: 'Just need a break' },
  { value: 'other', label: 'Other' },
] as const;

interface CancellationSurveyProps {
  onComplete: () => void;
  onDismiss: () => void;
}

export default function CancellationSurvey({ onComplete, onDismiss }: CancellationSurveyProps) {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [wouldReturn, setWouldReturn] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [retentionOffer, setRetentionOffer] = useState<{ offerType: string; offerMessage: string } | null>(null);

  const submitSurvey = useMutation(api.cancellationSurveys.submit);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      const result = await submitSurvey({
        reason,
        otherReason: reason === 'other' ? otherReason : undefined,
        feedback: feedback.trim() || undefined,
        wouldReturn: wouldReturn ?? undefined,
      });
      if (result?.showRetentionOffer && result.offerType && result.offerMessage) {
        setRetentionOffer({ offerType: result.offerType, offerMessage: result.offerMessage });
        setSubmitting(false);
        return; // Show offer instead of proceeding to cancel
      }
    } catch {
      // Best effort — proceed with cancellation even if survey fails
    }
    setSubmitting(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
          We&apos;re sorry to see you go
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-5">
          Help us improve by sharing why you&apos;re leaving.
        </p>

        {/* Reason selection */}
        <div className="space-y-2 mb-5">
          {REASONS.map((r) => (
            <label
              key={r.value}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                reason === r.value
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                  : 'border-[var(--border)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              <input
                type="radio"
                name="cancel-reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
                className="accent-[var(--accent)]"
              />
              <span className="text-sm text-[var(--text-primary)]">{r.label}</span>
            </label>
          ))}
        </div>

        {/* Other reason text */}
        {reason === 'other' && (
          <input
            type="text"
            placeholder="Please specify…"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            maxLength={200}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
          />
        )}

        {/* Feedback */}
        <textarea
          placeholder="Anything else you'd like to share? (optional)"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={500}
          rows={2}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
        />

        {/* Would return? */}
        <div className="mb-5">
          <p className="text-xs text-[var(--text-muted)] mb-2">Would you consider coming back if we improved?</p>
          <div className="flex gap-2">
            {[
              { val: true, label: 'Yes' },
              { val: false, label: 'No' },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => setWouldReturn(opt.val)}
                className={`flex-1 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  wouldReturn === opt.val
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        {retentionOffer ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/5 p-4">
              <p className="text-sm font-semibold text-[var(--accent)] mb-1">Before you go — a better deal</p>
              <p className="text-sm text-[var(--text-secondary)]">{retentionOffer.offerMessage}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onDismiss();
                  window.location.href = '/pricing';
                }}
                className="flex-1 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white text-sm font-semibold py-2.5 transition-colors"
              >
                Switch to annual
              </button>
              <button
                onClick={onComplete}
                className="flex-1 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] text-sm font-semibold py-2.5 transition-colors"
              >
                Cancel anyway
              </button>
            </div>
          </div>
        ) : (
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!reason || submitting}
            className="flex-1 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white text-sm font-semibold py-2.5 transition-colors"
          >
            {submitting ? 'Submitting…' : 'Continue cancellation'}
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white text-sm font-semibold py-2.5 transition-colors"
          >
            Keep Pro
          </button>
        </div>
        )}
      </div>
    </div>
  );
}
