@echo off
cd /d "c:\Users\USER\Documents\GOAKL RTRACKER"
git add src/components/WebVitalsReporter.tsx src/app/layout.tsx src/lib/analytics.tsx src/components/LandingPageV2.tsx
echo === STAGED ===
git status --porcelain
echo === COMMITTING ===
git commit --no-gpg-sign -m "perf: Web Vitals reporting, lazy-load below-fold, DNS prefetch, GA4 purchase event"
echo === DONE ===
