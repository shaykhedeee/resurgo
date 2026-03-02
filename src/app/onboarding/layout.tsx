import { ReactNode, Suspense } from 'react';

function OnboardingLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="border border-zinc-900 bg-zinc-950 p-8">
        <div className="flex items-center gap-2 font-mono text-xs text-orange-500">
          <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
          INITIALIZING...
        </div>
      </div>
    </div>
  );
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<OnboardingLoadingSpinner />}>
      {children}
    </Suspense>
  );
}
