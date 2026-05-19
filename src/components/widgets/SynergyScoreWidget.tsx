'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Daily Synergy Score (DSS) Widget (Dashboard)
// Displays a premium real-time Life OS Pulse score (0-100) and subscores
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Shield, Sparkles, AlertTriangle, Battery, CheckSquare, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function SynergyScoreWidget() {
  const synergyData = useQuery(api.coachAI.getDailySynergyDetails);

  if (!synergyData) {
    return (
      <div className="border border-zinc-900 bg-zinc-950 p-4 animate-pulse">
        <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
          <Activity className="h-3.5 w-3.5 text-zinc-500" />
          <span className="font-pixel text-[0.6rem] tracking-widest text-zinc-500">LIFE OS PULSE</span>
        </div>
        <div className="py-8 text-center font-terminal text-xs text-zinc-500">
          Calculating Synapse Resonance...
        </div>
      </div>
    );
  }

  const {
    dailySynergyScore,
    wellnessSubscore,
    taskSubscore,
    habitSubscore,
    budgetSubscore,
    sleepDebtWarning,
    budgetOverrunWarning,
    completedTasks,
    totalTasks,
    completedHabits,
    totalHabits,
  } = synergyData;

  // Get color for overall score
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return 'text-purple-400 border-purple-500/30 bg-purple-950/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]';
    if (score >= 70) return 'text-orange-400 border-orange-500/30 bg-orange-950/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-950/10';
    return 'text-red-400 border-red-500/30 bg-red-950/10';
  };

  const getSubscoreColorClass = (score: number) => {
    if (score >= 85) return 'bg-purple-500';
    if (score >= 70) return 'bg-orange-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950 transition-all duration-300 hover:border-orange-500/30">
      {/* Title Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Activity className="h-3.5 w-3.5 text-orange-500 animate-pulse" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-orange-500">LIFE OS RESIDUE</span>
        <span className="ml-auto font-terminal text-[0.65rem] text-zinc-500 uppercase tracking-widest">
          RESURGO v2.1
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Unified Synergy Score Display */}
        <div className={`border p-4 flex items-center justify-between transition-all duration-300 ${getScoreColorClass(dailySynergyScore)}`}>
          <div>
            <span className="block font-pixel text-[0.55rem] tracking-wider text-zinc-400">DAILY RESILIENCE SYNERGY</span>
            <span className="block font-terminal text-2xl font-bold tracking-tight mt-1">
              {dailySynergyScore}%
            </span>
            <span className="block font-terminal text-[0.65rem] text-zinc-500 mt-0.5">
              {dailySynergyScore >= 85 ? 'SYSTEM STATE: OPTIMAL FLOW' :
               dailySynergyScore >= 70 ? 'SYSTEM STATE: STEADY VELOCITY' :
               dailySynergyScore >= 50 ? 'SYSTEM STATE: DEVIATION DETECTED' :
               'SYSTEM STATE: CRITICAL RECOVERY REQUIRED'}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-between">
            {dailySynergyScore >= 85 ? (
              <Sparkles className="h-7 w-7 text-purple-400 animate-spin-slow" />
            ) : dailySynergyScore >= 50 ? (
              <Zap className="h-7 w-7 text-orange-400 animate-pulse" />
            ) : (
              <Shield className="h-7 w-7 text-red-500 animate-bounce" />
            )}
          </div>
        </div>

        {/* Warnings / Alerts Section */}
        {(sleepDebtWarning || budgetOverrunWarning) && (
          <div className="space-y-1.5">
            {sleepDebtWarning && (
              <div className="flex items-center gap-2 border border-red-500/20 bg-red-950/20 px-3 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                <span className="font-terminal text-[0.65rem] text-red-400 uppercase tracking-wider">
                  Aurora: SLEEP INSUFFICIENCY (under 6h). Recommend recovery mode.
                </span>
              </div>
            )}
            {budgetOverrunWarning && (
              <div className="flex items-center gap-2 border border-amber-500/20 bg-amber-950/20 px-3 py-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-terminal text-[0.65rem] text-amber-400 uppercase tracking-wider">
                  Nova: SPENDING BOUNDARY OVERFLOW. Substitutions recommended.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Subscores Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Wellness subscore */}
          <div className="border border-zinc-900 bg-zinc-900/30 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.65rem] font-bold text-zinc-300">WELLNESS</span>
              <span className="font-terminal text-xs text-zinc-400">{wellnessSubscore}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getSubscoreColorClass(wellnessSubscore)}`} 
                style={{ width: `${wellnessSubscore}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[0.6rem] font-terminal text-zinc-500">
              <span className="flex items-center gap-0.5">
                <Battery className="h-2.5 w-2.5" /> Sleep/Mood
              </span>
            </div>
          </div>

          {/* Tasks subscore */}
          <div className="border border-zinc-900 bg-zinc-900/30 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.65rem] font-bold text-zinc-300">TASKS</span>
              <span className="font-terminal text-xs text-zinc-400">{taskSubscore}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getSubscoreColorClass(taskSubscore)}`} 
                style={{ width: `${taskSubscore}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[0.6rem] font-terminal text-zinc-500">
              <span className="flex items-center gap-0.5">
                <CheckSquare className="h-2.5 w-2.5" /> {completedTasks}/{totalTasks} Done
              </span>
            </div>
          </div>

          {/* Habits subscore */}
          <div className="border border-zinc-900 bg-zinc-900/30 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.65rem] font-bold text-zinc-300">HABITS</span>
              <span className="font-terminal text-xs text-zinc-400">{habitSubscore}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getSubscoreColorClass(habitSubscore)}`} 
                style={{ width: `${habitSubscore}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[0.6rem] font-terminal text-zinc-500">
              <span className="flex items-center gap-0.5">
                <Zap className="h-2.5 w-2.5" /> {completedHabits}/{totalHabits} Done
              </span>
            </div>
          </div>

          {/* Budget subscore */}
          <div className="border border-zinc-900 bg-zinc-900/30 p-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-[0.65rem] font-bold text-zinc-300">FINANCES</span>
              <span className="font-terminal text-xs text-zinc-400">{budgetSubscore}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${getSubscoreColorClass(budgetSubscore)}`} 
                style={{ width: `${budgetSubscore}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[0.6rem] font-terminal text-zinc-500">
              <span className="flex items-center gap-0.5">
                <Shield className="h-2.5 w-2.5" /> Budget Cap
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/coach"
          className="mt-1 block text-center font-pixel text-[0.35rem] tracking-widest text-zinc-500 transition hover:text-orange-400"
        >
          [DECODE PULSE WITH COACHES]
        </Link>
      </div>
    </div>
  );
}
