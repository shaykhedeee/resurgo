'use client';

import { useEffect, useMemo } from 'react';
import { Clock, Crown, Shield, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { getExperimentVariant, trackExperimentExposure } from '@/lib/marketing/experiments';

const EXPERIMENT_ID = 'experiment_pricing_layout_v1' as const;
const FUNNEL_STEP = 'pricing_page_hero';

export default function BillingHeroExperiment() {
  const variant = useMemo(
    () =>
      getExperimentVariant(
        EXPERIMENT_ID,
        [
          { id: 'control', weight: 1 },
          { id: 'social_proof', weight: 1 },
        ],
        FUNNEL_STEP,
      ),
    [],
  );

  useEffect(() => {
    trackExperimentExposure(EXPERIMENT_ID, variant, FUNNEL_STEP);
  }, [variant]);

  if (variant === 'social_proof') {
    return (
      <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-orange-500/20 bg-[var(--surface)]/80 p-4 sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/80 p-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-orange-400">
              operator proof
            </p>
            <p className="text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
              “I used the free plan for a month. When I hit the AI limit for the third time, I upgraded.
              No regrets.”
            </p>
            <p className="mt-3 font-mono text-xs text-[var(--text-muted)]">
              Elena V. <span className="text-[var(--text-muted)]/60">// solopreneur</span>
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-left">
              <div className="mb-1 flex items-center gap-2 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">best value</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Yearly drops Pro to $2.50/mo.</p>
            </div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-left">
              <div className="mb-1 flex items-center gap-2 text-amber-400">
                <Crown className="h-4 w-4" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">founder pricing</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Lifetime is still $49.99 for the first 1,000 operators.</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-left">
              <div className="mb-1 flex items-center gap-2 text-blue-400">
                <Shield className="h-4 w-4" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">low risk</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">30-day refund policy. Cancel anytime.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left">
        <div className="mb-2 flex items-center gap-2 text-emerald-400">
          <Shield className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">safe upgrade</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">30-day money-back guarantee on all paid plans.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left">
        <div className="mb-2 flex items-center gap-2 text-blue-400">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">no lock-in</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">Start free now. Upgrade only when you outgrow the limits.</p>
      </div>
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left">
        <div className="mb-2 flex items-center gap-2 text-orange-400">
          <Zap className="h-4 w-4" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em]">clear value</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">Pro unlocks unlimited habits, goals, AI messages, and all 5 coaches.</p>
      </div>
    </div>
  );
}