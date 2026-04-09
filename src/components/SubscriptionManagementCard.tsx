'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Subscription Management Card
// Shows live Dodo subscription status, next billing date, and lets users
// cancel, reactivate, or update their payment method — all without leaving the app.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import CancellationSurvey from './CancellationSurvey';

type SubscriptionStatus = 'pending' | 'active' | 'on_hold' | 'cancelled' | 'failed' | 'expired';

interface SubDetails {
  subscription_id: string;
  status: string;
  product_id: string;
  next_billing_date?: string;
  cancel_at_next_billing_date: boolean;
  trial_period_days?: number;
}

const STATUS_CONFIG: Record<SubscriptionStatus, {
  label: string;
  icon: typeof CheckCircle;
  color: string;
  bg: string;
}> = {
  active: { label: 'Active', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
  pending: { label: 'Pending', icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  on_hold: { label: 'On Hold', icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
  failed: { label: 'Failed', icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
  expired: { label: 'Expired', icon: XCircle, color: 'text-zinc-400', bg: 'bg-zinc-400/10 border-zinc-400/30' },
};

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function SubscriptionManagementCard() {
  const [details, setDetails] = useState<SubDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);

  const getSubscriptionDetails = useAction(api.payments.getSubscriptionDetails);
  const cancelSubscription = useAction(api.payments.cancelSubscription);
  const updatePaymentMethod = useAction(api.payments.updatePaymentMethod);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSubscriptionDetails({});
      setDetails(result);
    } catch (err) {
      console.error('[SubscriptionManagementCard] fetch error:', err);
      setError('Could not load subscription details.');
    } finally {
      setLoading(false);
    }
  }, [getSubscriptionDetails]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleCancel = useCallback(async () => {
    if (!confirmCancel) {
      setShowSurvey(true);
      return;
    }
    setActionLoading('cancel');
    setError(null);
    try {
      await cancelSubscription({ immediately: false });
      setConfirmCancel(false);
      setShowSurvey(false);
      await fetchDetails();
    } catch (_err) {
      setError('Failed to cancel. Please try again or use the billing portal.');
    } finally {
      setActionLoading(null);
    }
  }, [cancelSubscription, confirmCancel, fetchDetails]);

  const handleUpdatePaymentMethod = useCallback(async () => {
    setActionLoading('payment');
    setError(null);
    try {
      const result = await updatePaymentMethod({
        returnUrl: `${window.location.origin}/billing?reactivated=true`,
      });
      if (result.payment_link) {
        window.location.href = result.payment_link;
      } else {
        await fetchDetails();
      }
    } catch (_err) {
      setError('Failed to start payment method update. Please try again.');
    } finally {
      setActionLoading(null);
    }
  }, [updatePaymentMethod, fetchDetails]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 animate-pulse">
        <div className="h-4 w-32 rounded bg-[var(--border)] mb-3" />
        <div className="h-3 w-48 rounded bg-[var(--border)]" />
      </div>
    );
  }

  if (!details) {
    // No active subscription — nothing to show here
    return null;
  }

  const status = details.status as SubscriptionStatus;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const StatusIcon = cfg.icon;
  const isCancelling = details.cancel_at_next_billing_date;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Header row */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--surface-hover)] transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-[var(--text-muted)]" />
          <span className="font-semibold text-[var(--text-primary)]">Subscription</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
            <StatusIcon className="w-3 h-3" />
            {isCancelling ? 'Cancels at period end' : cfg.label}
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-[var(--border)]">
          {/* Details grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[var(--text-muted)] text-xs mb-0.5">Subscription ID</p>
              <p className="font-mono text-[var(--text-secondary)] text-xs truncate">{details.subscription_id}</p>
            </div>
            {details.next_billing_date && (
              <div>
                <p className="text-[var(--text-muted)] text-xs mb-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {isCancelling ? 'Access until' : 'Next billing'}
                </p>
                <p className="text-[var(--text-primary)] font-medium">{formatDate(details.next_billing_date)}</p>
              </div>
            )}
            {details.trial_period_days != null && details.trial_period_days > 0 && (
              <div>
                <p className="text-[var(--text-muted)] text-xs mb-0.5">Trial period</p>
                <p className="text-[var(--text-primary)] font-medium">{details.trial_period_days} days</p>
              </div>
            )}
          </div>

          {/* On-hold banner */}
          {status === 'on_hold' && (
            <div className="mt-4 rounded-xl border border-orange-400/30 bg-orange-400/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-orange-300">Payment issue</p>
                  <p className="text-xs text-orange-300/80 mt-0.5">
                    Your subscription is paused due to a failed payment. Update your payment method to restore access.
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpdatePaymentMethod}
                disabled={actionLoading === 'payment'}
                className="mt-3 w-full rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white text-sm font-semibold py-2 transition-colors"
              >
                {actionLoading === 'payment' ? 'Redirecting…' : 'Update payment method'}
              </button>
            </div>
          )}

          {error && (
            <p className="mt-3 text-xs text-red-400">{error}</p>
          )}

          {/* Actions */}
          {status === 'active' && !isCancelling && (
            <div className="mt-4 flex flex-col gap-2">
              {confirmCancel ? (
                <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4">
                  <p className="text-sm text-red-300 font-semibold mb-1">Are you sure?</p>
                  <p className="text-xs text-red-300/80 mb-3">
                    You&apos;ll keep Pro access until <strong>{formatDate(details.next_billing_date)}</strong>, then drop to Free.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={actionLoading === 'cancel'}
                      className="flex-1 rounded-lg bg-red-500 hover:bg-red-400 disabled:opacity-60 text-white text-sm font-semibold py-2 transition-colors"
                    >
                      {actionLoading === 'cancel' ? 'Cancelling…' : 'Yes, cancel'}
                    </button>
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="flex-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] text-sm py-2 hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      Keep Pro
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCancel}
                  className="text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors text-left"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          )}

          {isCancelling && (
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              Your subscription will end on {formatDate(details.next_billing_date)}. No further charges will occur.
            </p>
          )}
        </div>
      )}

      {/* Cancellation survey modal */}
      {showSurvey && (
        <CancellationSurvey
          onComplete={() => {
            setShowSurvey(false);
            setConfirmCancel(true);
          }}
          onDismiss={() => {
            setShowSurvey(false);
            setConfirmCancel(false);
          }}
        />
      )}
    </div>
  );
}
