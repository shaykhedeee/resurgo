'use client';

import { useEffect } from 'react';
import { trackWebVitals } from '@/lib/analytics';

/**
 * Reports Core Web Vitals (LCP, FCP, CLS, TTFB, INP) to GA4.
 * Uses the native PerformanceObserver API — no external package required.
 */
export function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const report = (name: string, value: number) => {
      trackWebVitals({ id: `v4-${Date.now()}-${Math.random()}`, name, value });
    };

    // LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) report('LCP', last.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch { /* unsupported */ }

    // FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            report('FCP', entry.startTime);
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
    } catch { /* unsupported */ }

    // CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) {
            clsValue += (entry as PerformanceEntry & { value: number }).value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      // Report CLS on page hide
      addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') report('CLS', clsValue);
      }, { once: true });
    } catch { /* unsupported */ }

    // TTFB (Time to First Byte)
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      if (navEntry) report('TTFB', navEntry.responseStart - navEntry.requestStart);
    } catch { /* unsupported */ }

    // INP (Interaction to Next Paint)
    try {
      let maxINP = 0;
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = (entry as PerformanceEntry & { duration: number }).duration;
          if (duration > maxINP) maxINP = duration;
        }
      });
      inpObserver.observe({ type: 'event', buffered: true });
      addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && maxINP > 0) report('INP', maxINP);
      }, { once: true });
    } catch { /* unsupported */ }
  }, []);

  return null;
}
