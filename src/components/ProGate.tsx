'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — ProGate Component
// Shows an upgrade prompt when a free-tier user tries to use a paid feature
// ═══════════════════════════════════════════════════════════════════════════════

import { usePlanGating, Feature } from '@/hooks/usePlanGating';
import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

interface ProGateProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProGate({ feature, children, fallback }: ProGateProps) {
  const { canUse, isLoading } = usePlanGating();

  if (isLoading) return null;

  if (canUse(feature)) {
    return <>{children}</>;
  }

  // Custom fallback
  if (fallback) return <>{fallback}</>;

  // Default upgrade prompt
  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 px-3 py-1 text-xs font-bold text-white">
          <Sparkles className="h-3 w-3" />
          PRO
        </span>
      </div>

      <Lock className="mx-auto mb-3 h-8 w-8 text-[var(--text-tertiary)]" />

      <h3 className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
        Unlock this feature
      </h3>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">
        Upgrade to Pro to unlock{' '}
        {feature.replace(/([A-Z])/g, ' $1').toLowerCase()} and all premium features.
      </p>

      <Link
        href="/billing"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ascend-500 to-gold-400 px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
      >
        <Sparkles className="h-4 w-4" />
        Upgrade to Pro
      </Link>
    </div>
  );
}
