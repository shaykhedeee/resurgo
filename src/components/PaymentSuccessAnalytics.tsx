'use client';

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import {
  FOUNDING_LIFETIME_PRICE_USD,
} from '@/lib/product-config';

interface PaymentSuccessAnalyticsProps {
  plan?: string;
}

const PLAN_VALUES: Record<string, number> = {
  pro: 9.99,
  pro_monthly: 9.99,
  yearly: 95.88,
  pro_yearly: 95.88,
  lifetime: FOUNDING_LIFETIME_PRICE_USD,
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
