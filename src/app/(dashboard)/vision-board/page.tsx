'use client';

import dynamic from 'next/dynamic';
import { usePlanGating } from '@/hooks/usePlanGating';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

// VisionBoard is large (canvas + image generation) — load it only when the route is visited
const VisionBoard = dynamic(
  () => import('@/components/VisionBoard').then((m) => ({ default: m.VisionBoard })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 w-2 bg-orange-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">LOADING_VISION_MODULE...</p>
        </div>
      </div>
    ),
  }
);

export default function VisionBoardPage() {
  const { isPro } = usePlanGating();
  const boards = useQuery(api.visionBoards.list);
  const active = boards?.find((b) => b.isActive);

  // Parse stats from active board
  let panelCount = 0;
  let avgProgress = 0;
  if (active?.config) {
    try {
      const cfg = JSON.parse(active.config);
      const panels = cfg.panels ?? [];
      panelCount = panels.length;
      avgProgress = panels.length > 0
        ? Math.round(panels.reduce((s: number, p: { progress?: number }) => s + (p.progress ?? 0), 0) / panels.length)
        : 0;
    } catch { /* skip */ }
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />

      <div className="mx-auto max-w-6xl">
        <div className="mb-5 border border-zinc-900 bg-zinc-950 overflow-hidden">
          {/* Traffic light dots + module label */}
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-500/60" />
              <span className="h-1.5 w-1.5 rounded-full bg-green-500/60" />
            </div>
            <span className="ml-2 font-pixel text-[0.4rem] tracking-widest text-zinc-700">terminal://vision-studio</span>
            <div className="flex-1" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-pixel text-[0.4rem] tracking-widest text-orange-600">AI_MODULE :: VISION_BOARD_STUDIO_v2</span>
          </div>

          <div className="px-5 py-4">
            <h1 className="font-pixel text-base md:text-lg tracking-tight text-zinc-100">Vision Board Studio</h1>
            <p className="mt-1 font-pixel text-[0.4rem] tracking-widest text-zinc-500">
              Generate premium AI mood boards from goals &middot; psychology profile &middot; custom inspiration
            </p>

            {/* Live stats readout */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-pixel text-[0.35rem] tracking-widest text-zinc-700">
              <span>
                BOARDS: <span className="text-zinc-400">{boards?.length ?? '—'}</span>
              </span>
              <span>
                PANELS: <span className="text-zinc-400">{active ? panelCount : '—'}</span>
              </span>
              <span>
                PROGRESS: <span className={avgProgress > 0 ? 'text-orange-500' : 'text-zinc-400'}>{active ? `${avgProgress}%` : '—'}</span>
              </span>
              <span>
                STATUS: <span className={isPro ? 'text-green-500' : 'text-zinc-500'}>{isPro ? 'PRO_ACTIVE' : 'FREE_TIER'}</span>
              </span>
            </div>
          </div>
        </div>

        <VisionBoard canRegenerate={isPro()} />
      </div>
    </div>
  );
}
