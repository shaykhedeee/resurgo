'use client';

import { VisionBoard } from '@/components/VisionBoard';
import { usePlanGating } from '@/hooks/usePlanGating';

export default function VisionBoardPage() {
  const { isPro } = usePlanGating();

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">AI_MODULE :: VISION_BOARD_STUDIO_v1</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Vision Board Studio</h1>
            <p className="mt-1 font-mono text-xs tracking-widest text-zinc-500">
              Generate premium mood boards from your goals, psychology profile, and custom inspiration images.
            </p>
          </div>
        </div>

        <VisionBoard canRegenerate={isPro()} />
      </div>
    </div>
  );
}
