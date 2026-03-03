'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Adaptive Difficulty Widget
// Dashboard component showing current difficulty zone & AI recommendations
// ═══════════════════════════════════════════════════════════════════════════════

import { useMemo, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import {
  assessDifficulty,
  buildSnapshot,
  getZoneEmoji,
  getZoneDescription,
  type DifficultyAssessment,
  type DifficultyRecommendation,
  type RawUserData,
} from '@/lib/ai/adaptive-difficulty';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Zap,
  Shield,
  Target,
} from 'lucide-react';

export default function AdaptiveDifficultyWidget() {
  const [expanded, setExpanded] = useState(false);

  // Fetch user data from Convex
  const allTasks = useQuery(api.tasks.list, {});
  const habits = useQuery(api.habits.listAll);
  const checkIns = useQuery(api.dailyCheckIns.getRecent, { days: 7 });
  const goals = useQuery(api.goals.listAll);
  const user = useQuery(api.users.current);

  // Build assessment
  const assessment: DifficultyAssessment | null = useMemo(() => {
    if (!allTasks || !habits || !goals || !user) return null;

    const rawData: RawUserData = {
      tasks: (allTasks as Array<{ status: string; completedAt?: number | null; createdAt: number }>),
      habits: (habits as Array<{ isActive: boolean; streakCurrent: number; streakLongest: number; completionRate7Day?: number | null; completionRate30Day?: number | null }>),
      checkIns: (checkIns as Array<{ date: string; morningMood?: number | null; morningEnergy?: number | null; eveningMood?: number | null; eveningEnergy?: number | null }>) ?? [],
      goals: (goals as Array<{ status: string; progress: number }>),
      user: { lastActiveAt: (user as unknown as { lastActiveAt?: number | null }).lastActiveAt ?? null },
    };

    const snapshot = buildSnapshot(rawData);
    return assessDifficulty(snapshot);
  }, [allTasks, habits, checkIns, goals, user]);

  if (!assessment) {
    return (
      <div className="border border-zinc-800 bg-zinc-950 p-4 animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-2" />
        <div className="h-3 w-48 bg-zinc-900 rounded" />
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-900/50 transition"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded border text-sm"
            style={{ borderColor: `${assessment.color}40`, backgroundColor: `${assessment.color}15` }}
          >
            {getZoneEmoji(assessment.zone)}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[0.4rem] tracking-widest" style={{ color: assessment.color }}>
                {assessment.label}_ZONE
              </span>
              <span className="font-terminal text-xs text-zinc-500">
                {assessment.score}/100
              </span>
            </div>
            <p className="font-terminal text-[10px] text-zinc-500 mt-0.5">
              {getZoneDescription(assessment.zone)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Zone bar visualization */}
          <div className="hidden md:flex items-center gap-0.5">
            {['recovery', 'comfort', 'growth', 'stretch', 'overload'].map((z) => (
              <div
                key={z}
                className={cn(
                  'h-2 w-5 rounded-sm transition-all',
                  z === assessment.zone ? 'opacity-100 scale-y-125' : 'opacity-30'
                )}
                style={{ backgroundColor: z === assessment.zone ? assessment.color : '#3f3f46' }}
              />
            ))}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-zinc-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-zinc-600" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-zinc-900 px-4 py-3 space-y-4 animate-fade-in">
          {/* Score meter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-500">DIFFICULTY_SCORE</span>
              <span className="font-terminal text-xs" style={{ color: assessment.color }}>
                {assessment.score}
              </span>
            </div>
            <div className="relative h-2 w-full bg-zinc-900 rounded-sm overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full transition-all duration-500 rounded-sm"
                style={{
                  width: `${assessment.score}%`,
                  backgroundColor: assessment.color,
                }}
              />
              {/* Optimal zone marker */}
              <div className="absolute top-0 h-full w-px bg-emerald-500/50" style={{ left: '50%' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-terminal text-[8px] text-zinc-700">UNDER</span>
              <span className="font-terminal text-[8px] text-emerald-600">OPTIMAL</span>
              <span className="font-terminal text-[8px] text-zinc-700">OVER</span>
            </div>
          </div>

          {/* Adjustments summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <AdjustmentCard
              icon={Target}
              label="DAILY TASKS"
              value={`${assessment.adjustments.suggestedDailyTasks.min}-${assessment.adjustments.suggestedDailyTasks.max}`}
              color={assessment.color}
            />
            <AdjustmentCard
              icon={Zap}
              label="FOCUS"
              value={`${assessment.adjustments.suggestedFocusMinutes}m`}
              color={assessment.color}
            />
            <AdjustmentCard
              icon={Shield}
              label="STREAK GUARD"
              value={assessment.adjustments.streakProtectionActive ? 'ON' : 'OFF'}
              color={assessment.adjustments.streakProtectionActive ? '#22c55e' : '#52525b'}
            />
            <AdjustmentCard
              icon={AlertTriangle}
              label="REST DAY"
              value={assessment.adjustments.restDayRecommended ? 'YES' : 'NO'}
              color={assessment.adjustments.restDayRecommended ? '#f59e0b' : '#52525b'}
            />
          </div>

          {/* Insights */}
          {assessment.insights.length > 0 && (
            <div>
              <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500 mb-2">INSIGHTS</p>
              <div className="space-y-1.5">
                {assessment.insights.map((insight, i) => (
                  <p key={i} className="font-terminal text-[11px] text-zinc-400 leading-relaxed pl-3 border-l border-zinc-800">
                    {insight}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {assessment.recommendations.length > 0 && (
            <div>
              <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-500 mb-2">RECOMMENDATIONS</p>
              <div className="space-y-2">
                {assessment.recommendations.map((rec, i) => (
                  <RecommendationCard key={i} rec={rec} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function AdjustmentCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="border border-zinc-900 bg-black px-3 py-2">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="h-3 w-3" style={{ color }} />
        <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">{label}</span>
      </div>
      <p className="font-terminal text-sm" style={{ color }}>{value}</p>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: DifficultyRecommendation }) {
  const typeConfig = {
    increase: { icon: TrendingUp, color: '#22c55e', badge: 'INCREASE' },
    decrease: { icon: TrendingDown, color: '#f59e0b', badge: 'DECREASE' },
    maintain: { icon: Minus, color: '#3b82f6', badge: 'MAINTAIN' },
    alert: { icon: AlertTriangle, color: '#ef4444', badge: 'ALERT' },
  };
  const config = typeConfig[rec.type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex items-start gap-3 border px-3 py-2',
      rec.priority === 'high' ? 'border-zinc-700 bg-zinc-900/50' : 'border-zinc-900 bg-black'
    )}>
      <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: config.color }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-terminal text-xs text-zinc-300">{rec.title}</span>
          <span
            className="font-pixel text-[0.25rem] tracking-widest px-1.5 py-0.5 rounded"
            style={{ color: config.color, backgroundColor: `${config.color}15` }}
          >
            {config.badge}
          </span>
        </div>
        <p className="font-terminal text-[10px] text-zinc-500 leading-relaxed">{rec.description}</p>
      </div>
    </div>
  );
}
