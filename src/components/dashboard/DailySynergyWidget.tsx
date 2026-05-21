"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Zap, Brain, CheckCircle2, TrendingUp, Flame } from "lucide-react";

export function DailySynergyWidget() {
  const details = useQuery(api.coachAI.getDailySynergyDetails);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (details === undefined) {
    return (
      <div className="surface-panel mb-6 flex h-24 animate-pulse items-center justify-center p-4">
        <span className="font-terminal text-sm text-zinc-600">
          Calculating Synapse Cohesion...
        </span>
      </div>
    );
  }
  if (details === null) return null;

  const score = details.dailySynergyScore;
  let scoreColor = "text-emerald-400";
  let ringColor = "stroke-emerald-500/50";
  let glowClass = "shadow-emerald-900/20";
  let statusText = "OPTIMAL COHESION";

  if (score < 50) {
    scoreColor = "text-red-400";
    ringColor = "stroke-red-500/50";
    glowClass = "shadow-red-900/20";
    statusText = "DYSREGULATED";
  } else if (score < 80) {
    scoreColor = "text-orange-400";
    ringColor = "stroke-orange-500/50";
    glowClass = "shadow-orange-900/20";
    statusText = "BUILDING MOMENTUM";
  }

  return (
    <div className={`surface-panel mb-6 overflow-hidden shadow-lg ${glowClass}`}>
      <div className="surface-header flex items-center justify-between border-b border-zinc-800/50 bg-black/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <Zap className={`h-4 w-4 ${scoreColor}`} />
          <span className="font-pixel text-[0.6rem] tracking-widest text-zinc-400">
            SYNAPSE CORE
          </span>
        </div>
        <span className={`font-pixel text-[0.55rem] tracking-widest ${scoreColor}`}>
          [{statusText}]
        </span>
      </div>
      
      <div className="flex flex-col gap-6 p-5 md:flex-row md:items-center">
        {/* Circular Progress Indicator */}
        <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="stroke-zinc-800"
              strokeWidth="6"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className={`${ringColor} transition-all duration-1000 ease-out`}
              strokeWidth="6"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * score) / 100}
              strokeLinecap="square"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-terminal text-3xl font-bold ${scoreColor}`}>
              {score}
            </span>
            <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-500">
              DSS
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-4">
          <div className="border border-zinc-800 bg-black/20 p-3">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-xs text-zinc-400">Tasks</span>
              <CheckCircle2 className="h-3 w-3 text-zinc-500" />
            </div>
            <p className="mt-1 font-terminal text-lg text-zinc-200">
              {details.completedTasks}/{details.totalTasks}
            </p>
            <div className="mt-1 h-1 w-full bg-zinc-900">
              <div 
                className="h-full bg-orange-500 transition-all duration-500" 
                style={{ width: `${details.totalTasks > 0 ? (details.completedTasks / details.totalTasks) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="border border-zinc-800 bg-black/20 p-3">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-xs text-zinc-400">Habits</span>
              <Flame className="h-3 w-3 text-emerald-500" />
            </div>
            <p className="mt-1 font-terminal text-lg text-zinc-200">
              {details.completedHabits}/{details.totalHabits}
            </p>
            <div className="mt-1 h-1 w-full bg-zinc-900">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${details.totalHabits > 0 ? (details.completedHabits / details.totalHabits) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="border border-zinc-800 bg-black/20 p-3">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-xs text-zinc-400">Wellness</span>
              <Brain className="h-3 w-3 text-purple-500" />
            </div>
            <p className="mt-1 font-terminal text-lg text-zinc-200">
              {details.wellnessSubscore}%
            </p>
            <div className="mt-1 h-1 w-full bg-zinc-900">
              <div 
                className="h-full bg-purple-500 transition-all duration-500" 
                style={{ width: `${details.wellnessSubscore}%` }}
              />
            </div>
          </div>

          <div className="border border-zinc-800 bg-black/20 p-3">
            <div className="flex items-center justify-between">
              <span className="font-terminal text-xs text-zinc-400">Budget</span>
              <TrendingUp className="h-3 w-3 text-blue-500" />
            </div>
            <p className="mt-1 font-terminal text-lg text-zinc-200">
              {details.budgetSubscore}%
            </p>
            <div className="mt-1 h-1 w-full bg-zinc-900">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${details.budgetSubscore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Warnings Strip */}
      {(details.sleepDebtWarning || details.budgetOverrunWarning) && (
        <div className="flex border-t border-zinc-800 bg-zinc-950/50">
          {details.sleepDebtWarning && (
            <div className="flex-1 border-r border-zinc-800 p-2 text-center font-pixel text-[0.5rem] tracking-widest text-purple-400">
              ⚠️ SLEEP DEBT DETECTED — RECOVERY REQUIRED
            </div>
          )}
          {details.budgetOverrunWarning && (
            <div className="flex-1 p-2 text-center font-pixel text-[0.5rem] tracking-widest text-red-400">
              ⚠️ BUDGET BREACH — DISCRETIONARY LOCKDOWN
            </div>
          )}
        </div>
      )}
    </div>
  );
}
