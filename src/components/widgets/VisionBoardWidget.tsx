'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Vision Board Widget (Dashboard)
// Thumbnail preview of active vision board panels; link to full studio
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';

interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imageData: string | null;
  affirmation: string;
  category: string;
  progress: number;
}

interface VisionBoardConfig {
  title?: string;
  panels?: VisionBoardPanel[];
  centerAffirmation?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  HEALTH: '💪', CAREER: '🚀', PERSONAL: '🌱', FINANCE: '💰',
  LEARNING: '📚', RELATIONSHIP: '❤️', WEALTH: '💰', TRAVEL: '✈️',
  MINDSET: '🧘', CREATIVITY: '🎨',
};

function PanelTile({ panel }: { panel: VisionBoardPanel }) {
  if (panel.imageData) {
    return (
      <div className="relative aspect-square overflow-hidden border border-zinc-900 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={panel.imageData}
          alt={panel.goalTitle}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-300"
        />
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900">
          <div className="h-full bg-orange-500 transition-all" style={{ width: `${panel.progress}%` }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-1 py-0.5">
          <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-400 truncate">
            {CATEGORY_ICONS[panel.category] ?? '🎯'} {panel.goalTitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-square border border-zinc-900 flex flex-col items-center justify-center gap-1 bg-zinc-900/50">
      <span className="text-sm">{CATEGORY_ICONS[panel.category] ?? '🎯'}</span>
      <p className="font-pixel text-[0.25rem] tracking-widest text-zinc-600 text-center px-1 leading-tight">{panel.goalTitle}</p>
    </div>
  );
}

export default function VisionBoardWidget() {
  const boards = useQuery(api.visionBoards.list);

  const active = boards?.find((b) => b.isActive) ?? boards?.[0];
  let panels: VisionBoardPanel[] = [];
  let boardTitle = '';
  let avgProgress = 0;
  if (active?.config) {
    try {
      const cfg = JSON.parse(active.config) as VisionBoardConfig;
      boardTitle = cfg.title ?? '';
      panels = (cfg.panels ?? []).slice(0, 3);
      if (cfg.panels && cfg.panels.length > 0) {
        avgProgress = Math.round(cfg.panels.reduce((sum, p) => sum + (p.progress ?? 0), 0) / cfg.panels.length);
      }
    } catch {
      panels = [];
      boardTitle = '';
    }
  }

  const hasPanels = panels.length > 0;

  return (
    <div className="border border-zinc-900 bg-black h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-3 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">VISION_BOARD</span>
        </div>
        <Link
          href="/vision-board"
          className="font-pixel text-[0.4rem] tracking-widest text-zinc-700 hover:text-orange-500 transition-colors"
        >
          OPEN_STUDIO →
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 flex flex-col gap-3">
        {boards === undefined ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 animate-pulse">LOADING_MODULE...</p>
          </div>
        ) : !active ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600 text-center">[ NO_VISION_BOARD ]</p>
            <Link
              href="/vision-board"
              className="font-pixel text-[0.4rem] tracking-widest px-3 py-1.5 border border-zinc-800 text-zinc-500 hover:border-orange-800 hover:text-orange-500 transition-colors"
            >
              CREATE_BOARD
            </Link>
          </div>
        ) : (
          <>
            {boardTitle && (
              <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-500 truncate">{boardTitle}</p>
            )}

            {hasPanels ? (
              <>
                <div className="grid grid-cols-3 gap-1">
                  {panels.map((panel, i) => (
                    <PanelTile key={panel.id ?? i} panel={panel} />
                  ))}
                </div>
                {/* Overall progress */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500/70 rounded-full transition-all" style={{ width: `${avgProgress}%` }} />
                  </div>
                  <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">{avgProgress}%</span>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-700 text-center">[ BOARD_EMPTY ]</p>
              </div>
            )}

            <Link
              href="/vision-board"
              className="mt-auto w-full text-center font-pixel text-[0.4rem] tracking-widest py-1.5 border border-zinc-800 text-zinc-600 hover:border-orange-800 hover:text-orange-500 transition-colors block"
            >
              [ OPEN_STUDIO ]
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
