'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — OnboardingGuard
// NEW BEHAVIOR (Phase 1): Single quick-start entry point for all new users
// All unauthenticated or incomplete users → /quick-start
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreUser } from '@/hooks/useStoreUser';
import { Loader2 } from 'lucide-react';

type OnboardingStep = 'quick-start' | 'dashboard' | 'none';

export interface OnboardingGuardProps {
  children: React.ReactNode;
  fallbackStep?: OnboardingStep;
}

export function OnboardingGuard({ children, fallbackStep = 'quick-start' }: OnboardingGuardProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useStoreUser();
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    let targetStep: OnboardingStep = fallbackStep;

    if (!user) {
      // Not authenticated — don't redirect here, let auth handle it
      targetStep = 'none';
    } else if (!user.onboardingComplete) {
      // User exists but hasn't completed onboarding → send to quick-start
      targetStep = 'quick-start';
    } else if (user.onboardingComplete) {
      // User finished onboarding → proceed normally
      targetStep = 'none';
    }

    // Execute redirect
    switch (targetStep) {
      case 'quick-start':
        router.replace('/quick-start');
        break;
      case 'dashboard':
        router.replace('/dashboard');
        break;
      case 'none':
      default:
        // No redirect needed
        break;
    }

    setDecided(true);
  }, [authLoading, user, router, fallbackStep]);

  if (!decided || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 text-orange-600 animate-spin" />
          <span className="font-mono text-xs tracking-widest text-zinc-500">
            Checking onboarding status...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}