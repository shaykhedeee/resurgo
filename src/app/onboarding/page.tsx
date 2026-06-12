'use client';

import { QuickStartFlow } from '@/components/QuickStartFlow';
import { BlogFunnelTracker } from '@/components/BlogFunnelTracker';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <BlogFunnelTracker event="onboarding_page_view" />
      <QuickStartFlow />
    </div>
  );
}
