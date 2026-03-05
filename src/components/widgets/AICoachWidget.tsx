'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Coach Insight Widget (Dashboard)
// Shows contextual AI suggestion based on current user state
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Brain, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const TIPS: string[] = [
  "You haven't completed any tasks yet today. Start with the smallest one to build momentum.",
  "Your consistency is improving! Keep showing up and the results will compound.",
  "Consider blocking out 25 minutes of deep focus time. Your best work happens in flow state.",
  "You're on a strong streak. Protect it by completing your habits before noon.",
  "Review your goals weekly. Small course corrections prevent big detours.",
  "Your evening debrief data shows you're most productive in the morning. Schedule key tasks early.",
  "Break large goals into weekly milestones — they feel more achievable and keep momentum high.",
  "You've been consistent with hydration. Try pairing water intake with your focus sessions.",
  "Great work on your habit streaks! Consider adding one new micro-habit this week.",
  "Your energy tends to dip after lunch. Schedule lighter tasks for 2-4 PM.",
  "Celebrate small wins. Every completed task is proof you're building a better system.",
  "Focus on systems, not goals. The right daily habits make outcomes inevitable.",
];

export default function AICoachWidget() {
  const [tipIndex, setTipIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [customInsight, setCustomInsight] = useState<string | null>(null);

  const gamification = useQuery(api.gamification.getProfile);
  const todayCheckIn = useQuery(api.dailyCheckIns.getToday);
  const habits = useQuery(api.habits.listActive);
  const tasks = useQuery(api.tasks.list, { status: 'todo' });

  // Contextual insight selection
  const contextualTip = useMemo(() => {
    if (customInsight) return customInsight;

    const hour = new Date().getHours();
    const morningDone = !!todayCheckIn?.morningCompletedAt;
    const taskCount = tasks?.length ?? 0;
    const activeStreaks = (habits ?? []).filter((h: any) => h.streakCurrent > 0).length;
    const totalHabits = habits?.length ?? 0;
    const level = gamification?.level ?? 1;

    // Contextual responses
    if (!morningDone && hour < 12)
      return "Start your day with a morning check-in. It takes 2 minutes and powers your AI coaching all day.";
    if (taskCount === 0)
      return "Your task queue is empty — either you're crushing it or it's time to plan tomorrow. Head to Tasks to load up.";
    if (taskCount > 10)
      return `${taskCount} tasks pending. Consider batching similar ones together. Focus on the top 3 most impactful.`;
    if (activeStreaks >= 3)
      return `${activeStreaks} active streaks! You're building serious momentum. Don't break the chain.`;
    if (totalHabits === 0)
      return "You have no habits tracked yet. Start with just ONE tiny habit and build from there.";
    if (level >= 10)
      return "Level " + level + " — you're in the top tier. Time to set bigger goals and push your limits.";
    if (hour >= 20)
      return "Evening mode: review today's wins, log gratitude, and set tomorrow's top 3 priorities.";

    return TIPS[tipIndex % TIPS.length];
  }, [customInsight, todayCheckIn, tasks, habits, gamification, tipIndex]);

  const fetchAIInsight = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Give me one quick, specific, actionable tip for right now based on my current state. Keep it under 50 words.',
          personality: 'titan',
        }),
      });
      const data = await res.json();
      if (data.response) {
        setCustomInsight(data.response);
      }
    } catch {
      // Fallback to local tips
      setTipIndex((i) => (i + 1) % TIPS.length);
    }
    setLoading(false);
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-violet-500">AI_COACH</span>
        <span className="ml-auto border border-violet-900 bg-violet-950/30 px-2 py-0.5 font-pixel text-[0.5rem] tracking-widest text-violet-400">
          TITAN
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="border-l-2 border-violet-700 pl-3">
          <p className="font-terminal text-sm leading-relaxed text-zinc-300">
            {loading ? (
              <span className="flex items-center gap-2 text-zinc-500">
                <RefreshCw className="h-3 w-3 animate-spin" /> Thinking...
              </span>
            ) : (
              contextualTip
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAIInsight}
            disabled={loading}
            className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-3 py-1.5 font-terminal text-xs text-zinc-400 transition hover:border-violet-700 hover:text-violet-400 disabled:opacity-40"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            New Tip
          </button>
          <Link
            href="/coach"
            className="flex items-center gap-1.5 border border-violet-700 bg-violet-950/30 px-3 py-1.5 font-terminal text-xs text-violet-400 transition hover:bg-violet-950/50"
          >
            <Brain className="h-3 w-3" />
            Full Coach
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
