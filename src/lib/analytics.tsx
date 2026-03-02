// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Analytics & Tracking
// Google Analytics 4, Plausible, and custom event tracking
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Google Analytics Measurement ID - Replace with your actual ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Whether analytics is enabled
const ANALYTICS_ENABLED = process.env.NODE_ENV === 'production' && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────────

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// GOOGLE ANALYTICS SCRIPT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function GoogleAnalytics() {
  if (!ANALYTICS_ENABLED) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// TRACKING FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Track a page view
 */
export function pageview(url: string, title?: string): void {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title,
  });
}

/**
 * Track a custom event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: EventParams
): void {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...params,
  });
}

// ─────────────────────────────────────────────────────────────────────────────────
// PREDEFINED EVENT TRACKERS
// ─────────────────────────────────────────────────────────────────────────────────

export const analytics = {
  // User Actions
  signUp: (method: string = 'email') => {
    trackEvent('sign_up', 'engagement', method);
  },
  
  login: (method: string = 'email') => {
    trackEvent('login', 'engagement', method);
  },
  
  // Onboarding
  completeOnboarding: (step: number) => {
    trackEvent('complete_onboarding', 'engagement', `step_${step}`, step);
  },
  
  // Habits
  createHabit: (category: string) => {
    trackEvent('create_habit', 'habits', category);
  },
  
  completeHabit: (habitName: string, streakDays: number) => {
    trackEvent('complete_habit', 'habits', habitName, streakDays);
  },
  
  achieveStreak: (days: number) => {
    trackEvent('achieve_streak', 'milestones', `${days}_days`, days);
  },
  
  // Goals
  createGoal: (timeframe: number) => {
    trackEvent('create_goal', 'goals', `${timeframe}_weeks`, timeframe);
  },
  
  completeGoal: (goalTitle: string) => {
    trackEvent('complete_goal', 'milestones', goalTitle);
  },
  
  useAIDecomposition: () => {
    trackEvent('use_ai_decomposition', 'ai_features');
  },
  
  // Gamification
  levelUp: (newLevel: number) => {
    trackEvent('level_up', 'gamification', `level_${newLevel}`, newLevel);
  },
  
  earnXP: (amount: number, source: string) => {
    trackEvent('earn_xp', 'gamification', source, amount);
  },
  
  unlockAchievement: (achievementId: string) => {
    trackEvent('unlock_achievement', 'gamification', achievementId);
  },
  
  // Conversion
  viewPricing: () => {
    trackEvent('view_pricing', 'conversion');
  },
  
  startTrial: (plan: string) => {
    trackEvent('begin_checkout', 'conversion', plan);
  },
  
  completePurchase: (plan: string, value: number) => {
    trackEvent('purchase', 'conversion', plan, value, {
      currency: 'USD',
    });
  },
  
  // Engagement
  shareProgress: (platform: string) => {
    trackEvent('share', 'engagement', platform);
  },
  
  installPWA: () => {
    trackEvent('install_pwa', 'engagement');
  },
  
  useVoiceInput: () => {
    trackEvent('use_voice_input', 'features');
  },
  
  enableNotifications: () => {
    trackEvent('enable_notifications', 'engagement');
  },
  
  exportData: (format: string) => {
    trackEvent('export_data', 'features', format);
  },
  
  // AI Features
  getAICoaching: () => {
    trackEvent('get_ai_coaching', 'ai_features');
  },
  
  getAISuggestions: () => {
    trackEvent('get_ai_suggestions', 'ai_features');
  },
  
  getAIInsights: () => {
    trackEvent('get_ai_insights', 'ai_features');
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// ROUTE CHANGE TRACKER HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function usePageTracking(): void {
  useEffect(() => {
    if (!ANALYTICS_ENABLED) return;
    
    // Track initial page view
    pageview(window.location.pathname, document.title);
    
    // For SPAs, you might want to track route changes
    // This is a simple implementation - for Next.js App Router,
    // you might want to use a more sophisticated approach
    
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────────
// PERFORMANCE TRACKING
// ─────────────────────────────────────────────────────────────────────────────────

export function trackWebVitals(metric: {
  id: string;
  name: string;
  value: number;
}): void {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return;
  
  window.gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
  });
}
