'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Discover More Panel
// Shows locked feature tiers with unlock criteria for newcomer/explorer users.
// Motivates progress by making the growth path visible.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import {
  BookOpen, Apple, Droplets, StickyNote, Moon, TrendingUp,
  Zap, Image, CalendarDays, Trophy, ChevronDown, ChevronUp, Lock,
} from 'lucide-react';
import type { DisclosureTier } from '@/hooks/useProgressiveDisclosure';

// ── Icon map (subset of Lucide used only here) ──
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen, Apple, Droplets, StickyNote, Moon, TrendingUp,
  Zap, Image, CalendarDays, Trophy,
};

interface LockedWidgetDef {
  id: string;
  label: string;
  icon: string;
  description: string;
  unlockHint: string;
}

// ── Explorer tier additions (visible after Day 4 or 2+ habits) ──
const EXPLORER_LOCKED: LockedWidgetDef[] = [
  { id: 'quick-journal',  label: 'Quick Journal',   icon: 'BookOpen',    description: 'Capture wins and reflections in 30 seconds.', unlockHint: 'Use Resurgo for 4 days' },
  { id: 'calorie-tracker',label: 'Calorie Tracker', icon: 'Apple',       description: 'Log meals and hit your nutrition targets.',    unlockHint: 'Add 2 habits' },
  { id: 'water-tracker',  label: 'Hydration',       icon: 'Droplets',    description: 'Stay on top of your daily water intake.',     unlockHint: 'Add 2 habits' },
  { id: 'quick-note',     label: 'Quick Note',      icon: 'StickyNote',  description: 'Save any thought before it disappears.',      unlockHint: 'Use Resurgo for 4 days' },
  { id: 'sleep',          label: 'Sleep Tracker',   icon: 'Moon',        description: 'Track sleep quality and spot patterns.',      unlockHint: 'Use Resurgo for 4 days' },
  { id: 'activity-feed',  label: 'Activity Feed',   icon: 'TrendingUp',  description: 'See everything you\'ve done at a glance.',    unlockHint: 'Add 1 goal' },
];

// ── Builder tier additions (visible after Day 15 or 7-day streak) ──
const BUILDER_LOCKED: LockedWidgetDef[] = [
  { id: 'quick-actions',  label: 'Quick Actions',  icon: 'Zap',         description: 'One-tap shortcuts for your most-used flows.',  unlockHint: '7-day streak or 15 days in' },
  { id: 'vision-board',   label: 'Vision Board',   icon: 'Image',       description: 'Keep your "why" visible on the dashboard.',   unlockHint: '7-day streak or 15 days in' },
  { id: 'streak-heatmap', label: 'Streak Heatmap', icon: 'CalendarDays',description: 'GitHub-style grid of your consistency.',       unlockHint: '5+ habits tracked' },
  { id: 'xp-leaderboard', label: 'XP Leaderboard', icon: 'Trophy',      description: 'See how you rank against other builders.',    unlockHint: '7-day streak or 15 days in' },
];

interface DiscoverMorePanelProps {
  tier: DisclosureTier;
}

export function DiscoverMorePanel({ tier }: DiscoverMorePanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (tier === 'builder') return null;

  const groups: { label: string; color: string; items: LockedWidgetDef[] }[] = [];

  if (tier === 'newcomer') {
    groups.push({ label: 'Explorer unlocks', color: 'blue', items: EXPLORER_LOCKED });
    groups.push({ label: 'Builder unlocks',  color: 'purple', items: BUILDER_LOCKED });
  } else {
    // explorer
    groups.push({ label: 'Builder unlocks', color: 'purple', items: BUILDER_LOCKED });
  }

  const totalLocked = groups.reduce((n, g) => n + g.items.length, 0);

  const colorMap: Record<string, { border: string; badge: string; icon: string }> = {
    blue:   { border: 'border-blue-800/40',   badge: 'border-blue-700/50 bg-blue-950/30 text-blue-400',   icon: 'text-blue-500/60' },
    purple: { border: 'border-violet-800/40', badge: 'border-violet-700/50 bg-violet-950/30 text-violet-400', icon: 'text-violet-500/60' },
  };

  return (
    <div className="mb-6 border border-zinc-800 bg-zinc-950">
      {/* Header — always visible */}
      <button
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-zinc-900/50 transition"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-zinc-500" />
          <span className="font-terminal text-sm text-zinc-400">
            {totalLocked} features unlock as you grow
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-terminal text-xs text-zinc-600">
            {expanded ? 'hide' : 'show'}
          </span>
          {expanded
            ? <ChevronUp className="h-3.5 w-3.5 text-zinc-600" />
            : <ChevronDown className="h-3.5 w-3.5 text-zinc-600" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-4 space-y-5">
          {groups.map((group) => {
            const c = colorMap[group.color];
            return (
              <div key={group.label}>
                <p className="mb-2 font-terminal text-xs uppercase tracking-widest text-zinc-600">
                  {group.label}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((w) => {
                    const Icon = ICON_MAP[w.icon];
                    return (
                      <div
                        key={w.id}
                        className={`flex flex-col gap-1 border ${c.border} bg-zinc-900/30 p-3 opacity-70`}
                      >
                        <div className="flex items-center gap-2">
                          {Icon && <Icon className={`h-3.5 w-3.5 shrink-0 ${c.icon}`} />}
                          <span className="font-terminal text-sm text-zinc-400">{w.label}</span>
                        </div>
                        <p className="font-terminal text-xs text-zinc-600 leading-snug">
                          {w.description}
                        </p>
                        <div className={`mt-1 inline-flex w-fit items-center gap-1 border px-2 py-0.5 ${c.badge}`}>
                          <Lock className="h-2.5 w-2.5" />
                          <span className="font-terminal text-[10px]">{w.unlockHint}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="font-terminal text-[10px] text-zinc-700">
            Widgets unlock automatically — no action needed. Keep building.
          </p>
        </div>
      )}
    </div>
  );
}
