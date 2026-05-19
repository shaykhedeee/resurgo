'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Daily Briefing
// Connected dashboard hero: synthesizes goals + habits + focus + mood
// into one prioritized action block
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react';
import { useUserIntelligence } from '@/hooks/useUserIntelligence';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { cn } from '@/lib/utils';
import {
  Target,
  CheckCircle2,
  Circle,
  Zap,
  Flame,
  Brain,
  ArrowRight,
  RefreshCw,
  BarChart2,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

// ── Animation helpers ────────────────────────────────────────────────────────

function staggerDelay(index: number, baseMs: number = 50): string {
  return `${index * baseMs + baseMs}ms`;
}

// ── Component ────────────────────────────────────────────────────────────────

export function DailyBriefing() {
  const { uim, isLoading } = useUserIntelligence();
  const [activeTab, setActiveTab] = useState<'action' | 'stats' | 'burnout'>('action');
  const [pulseKey, setPulseKey] = useState(0);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => setPulseKey((k) => k + 1), 30000); // 30s refresh
    return () => clearInterval(interval);
  }, []);

  // Action items derived from user state
  const actionItems = useCallback(() => {
    if (!uim) return [];
    const items: Array<{
      label: string;
      category: 'goal' | 'habit' | 'focus' | 'mood';
      priority: 'critical' | 'high' | 'medium' | 'low';
    }> = [];

    // Highest priority: incomplete goals approaching deadline
    if (uim.goals.nearestDeadline) {
      items.push({
        label: `Deadline approaching: ${uim.goals.primaryGoal || 'Active goal'}`,
        category: 'goal',
        priority: 'critical',
      });
    }

    // Habit streaks
    if (uim.habits.activeCount > 0) {
      items.push({
        label: `Maintain ${uim.habits.activeCount} active habits · Streak: ${uim.habits.currentStreak}d`,
        category: 'habit',
        priority: uim.habits.currentStreak >= 7 ? 'high' : 'medium',
      });
    }

    // Focus session prompt
    if (uim.focus.todayMinutes < 30) {
      items.push({
        label: `Only ${uim.focus.todayMinutes} min focused today — schedule a focus block`,
        category: 'focus',
        priority: 'high',
      });
    }

    // Onboarding nudge
    if (!uim.onboarding.complete) {
      items.push({
        label: 'Complete onboarding to unlock AI coaching',
        category: 'mood',
        priority: 'medium',
      });
    }

    // Default: celebrate wins
    if (items.length === 0) {
      items.push({
        label: `All systems go — ${uim.habits.todayCompleted} habits done, ${uim.goals.activeCount} goals active`,
        category: 'mood',
        priority: 'low',
      });
    }

    return items;
  }, [uim]);

  const items = actionItems();
  const criticalItems = items.filter((i) => i.priority === 'critical');
  const highItems = items.filter((i) => i.priority === 'high');
  const otherItems = items.filter((i) => i.priority !== 'critical' && i.priority !== 'high');

  // Priority score (0-100, higher = more urgent action needed)
  const priorityScore = criticalItems.length > 0 ? 90 : highItems.length > 0 ? 65 : otherItems.length > 0 ? 30 : 5;

  if (isLoading) {
    return (
      <div className="border border-zinc-800 bg-black p-6">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 bg-orange-600 animate-pulse rounded-full" />
          <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-500">LOADING INTELLIGENCE...</span>
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full animate-pulse bg-zinc-900 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
          <span className="font-pixel text-[0.55rem] tracking-widest text-orange-500">DAILY BRIEFING</span>
        </div>
        <button
          onClick={() => setPulseKey((k) => k + 1)}
          className="border border-zinc-800 px-2 py-1 font-pixel text-[0.5rem] tracking-widest text-zinc-500 hover:border-zinc-600 transition"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 mb-3 border-b border-zinc-900 pb-px">
        {[
          { key: 'action', label: 'ACTION', icon: <Target className="h-3 w-3" /> },
          { key: 'stats', label: 'STATS', icon: <BarChart2 className="h-3 w-3" /> },
          { key: 'burnout', label: 'WELLBEING', icon: <Brain className="h-3 w-3" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              'flex items-center gap-1.5 border-b-2 px-2 py-2 font-pixel text-[0.55rem] tracking-widest transition',
              activeTab === tab.key
                ? 'border-orange-600 text-orange-500'
                : 'border-transparent text-zinc-600 hover:text-zinc-400'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="min-h-[160px]">
        {/* ACTION TAB */}
        {activeTab === 'action' && (
          <div className="space-y-3">
            {/* Priority indicator */}
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-500">PRIORITY</span>
              <div className="flex-1 h-1.5 bg-zinc-900 overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-700',
                    priorityScore >= 70 ? 'bg-red-500' :
                    priorityScore >= 40 ? 'bg-orange-500' :
                    'bg-green-500'
                  )}
                  style={{ width: `${priorityScore}%` }}
                />
              </div>
              <span
                className={cn(
                  'font-pixel text-[0.5rem] tracking-widest',
                  priorityScore >= 70 ? 'text-red-500' :
                  priorityScore >= 40 ? 'text-orange-500' :
                  'text-green-500'
                )}
              >
                {priorityScore}/100
              </span>
            </div>

            {/* Critical items */}
            {criticalItems.map((item, i) => (
              <div
                key={`critical-${i}`}
                className={cn(
                  'border-l-4 border-red-500 bg-red-950/20 p-3 transition-all duration-300',
                  'hover:bg-red-950/30'
                )}
                style={{ animationDelay: staggerDelay(i) }}
              >
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-terminal text-sm text-zinc-200">{item.label}</p>
                    <p className="font-pixel text-[0.5rem] tracking-widest text-red-500 mt-1">CRITICAL</p>
                  </div>
                </div>
              </div>
            ))}

            {/* High items */}
            {highItems.map((item, i) => (
              <div
                key={`high-${i}`}
                className={cn(
                  'border-l-4 border-orange-500 bg-orange-950/10 p-3 transition-all duration-300',
                  'hover:bg-orange-950/20'
                )}
                style={{ animationDelay: staggerDelay(i + 1) }}
              >
                <div className="flex items-start gap-2">
                  <Flame className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-terminal text-sm text-zinc-200">{item.label}</p>
                    <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mt-1">HIGH</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Other items */}
            {otherItems.map((item, i) => (
              <div
                key={`other-${i}`}
                className={cn(
                  'border border-zinc-800 p-3 transition-all duration-300',
                  'hover:border-zinc-700'
                )}
                style={{ animationDelay: staggerDelay(i + 2) }}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-terminal text-sm text-zinc-300">{item.label}</p>
                    <p className="font-pixel text-[0.5rem] tracking-widest text-green-500 mt-1">
                      {item.priority.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA when nothing critical */}
            {items.length === 0 && (
              <div className="text-center py-6">
                <p className="font-terminal text-lg text-green-400 mb-2">✓</p>
                <p className="font-pop text-sm text-zinc-400">
                  Everything is on track. Keep the momentum going!
                </p>
              </div>
            )}
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                label: 'Active Goals',
                value: uim?.goals.activeCount ?? 0,
                icon: <Target className="h-3 w-3" />,
              },
              {
                label: 'Active Habits',
                value: uim?.habits.activeCount ?? 0,
                icon: <Flame className="h-3 w-3" />,
              },
              {
                label: 'Current Streak',
                value: `${uim?.habits.currentStreak ?? 0}d`,
                icon: <Zap className="h-3 w-3" />,
              },
              {
                label: 'Total XP',
                value: (uim?.engagement.xp ?? 0).toLocaleString(),
                icon: <TrendingUp className="h-3 w-3" />,
              },
              {
                label: 'Focus Today',
                value: `${uim?.focus.todayMinutes ?? 0}m`,
                icon: <Brain className="h-3 w-3" />,
              },
              {
                label: 'Goals Done',
                value: `${uim?.goals.completionRate.toFixed(0) ?? 0}%`,
                icon: <CheckCircle2 className="h-3 w-3" />,
              },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="border border-zinc-800 bg-zinc-950 p-3 transition-all duration-300 hover:border-zinc-700"
                style={{ animationDelay: staggerDelay(i, 30) }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-orange-500">{stat.icon}</span>
                  <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-500">{stat.label}</span>
                </div>
                <p className="font-mono text-xl font-bold text-zinc-100">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* BURNOUT/WELLBEING TAB */}
        {activeTab === 'burnout' && (
          <div className="space-y-3">
            {uim?.burnout.atRisk ? (
              <div className="border border-red-900/50 bg-red-950/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="font-pixel text-[0.6rem] tracking-widest text-red-500">
                    BURNOUT RISK DETECTED
                  </span>
                </div>
                <p className="font-terminal text-sm text-zinc-200 mb-2">
                  {uim.burnout.recommendation}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {uim.burnout.riskFactors.map((factor, i) => (
                    <span
                      key={i}
                      className="border border-red-800 bg-red-900/30 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest text-red-400"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border border-green-900/50 bg-green-950/10 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="font-pixel text-[0.6rem] tracking-widest text-green-500">
                    WELLBEING STABLE
                  </span>
                </div>
                <p className="font-terminal text-sm text-zinc-300 mt-1">
                  No burnout indicators detected. Maintain current rhythm.
                </p>
              </div>
            )}

            {/* Archetype badge */}
            {uim?.onboarding.archetype && (
              <div className="border border-zinc-800 bg-zinc-950 p-3">
                <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-500 mb-1 block">
                  USER ARCHETYPE
                </span>
                <p className="font-mono text-sm text-orange-400 font-bold">
                  {uim.onboarding.archetype}
                </p>
                {uim.onboarding.archetypeConfidence && (
                  <p className="font-pixel text-[0.5rem] text-zinc-600 mt-1">
                    Confidence: {Math.round(uim.onboarding.archetypeConfidence)}%
                  </p>
                )}
              </div>
            )}

            {/* Level & Tier */}
            <div className="border border-zinc-800 bg-zinc-950 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-500">XP PROGRESS</span>
                <span className="font-pixel text-[0.5rem] text-orange-500">
                  Level {uim?.engagement.level ?? 1} · {uim?.engagement.tier ?? 'beginner'}
                </span>
              </div>
              <div className="h-2 bg-zinc-900 overflow-hidden">
                <div
                  className="h-full bg-orange-600 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((uim?.engagement.xp ?? 0) % 100) / 1)}%`,
                  }}
                />
              </div>
              <p className="font-pixel text-[0.5rem] text-zinc-600 mt-1">
                {uim?.engagement.xp ?? 0} XP · {uim?.engagement.xpToNextLevel ?? 100} to next level
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
