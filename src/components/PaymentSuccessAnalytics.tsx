'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';

interface PaymentSuccessAnalyticsProps {
  plan?: string;
}

const PLAN_VALUES: Record<string, number> = {
  pro: 4.99,
  yearly: 29.99,
  lifetime: 49.99,
};

export default function PaymentSuccessAnalytics({ plan }: PaymentSuccessAnalyticsProps) {
  useEffect(() => {
    const normalizedPlan = plan?.toLowerCase() ?? 'unknown';
    const value = PLAN_VALUES[normalizedPlan] ?? 0;
    analytics.completePurchase(normalizedPlan, value);
    analytics.upgradeCompleted(normalizedPlan, value);
  }, [plan]);

  return null;
}
