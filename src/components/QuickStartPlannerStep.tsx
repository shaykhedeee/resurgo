'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Target, Zap, Activity, ArrowRight, Settings, AlertTriangle } from 'lucide-react';

interface QuickStartPlannerStepProps {
  parsedData: {
    suggestedGoals: string[];
    suggestedHabits: Array<{ title: string; frequency: string; domain: string }>;
    suggestedTasks: Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>;
  };
  onComplete: (selected: {
    goals: string[];
    habits: Array<{ title: string; frequency: string; domain: string }>;
    tasks: Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>;
  }) => void;
}

export function QuickStartPlannerStep({ parsedData, onComplete }: QuickStartPlannerStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(parsedData.suggestedGoals || []);
  const [selectedHabits, setSelectedHabits] = useState<Array<{ title: string; frequency: string; domain: string }>>(
    parsedData.suggestedHabits || []
  );
  const [selectedTasks, setSelectedTasks] = useState<Array<{ title: string; priority: 'high' | 'medium' | 'low'; dueDate: string }>>(
    parsedData.suggestedTasks || []
  );

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleHabit = (habitTitle: string) => {
    setSelectedHabits((prev) =>
      prev.some((h) => h.title === habitTitle)
        ? prev.filter((h) => h.title !== habitTitle)
        : [...prev, parsedData.suggestedHabits.find((h) => h.title === habitTitle)!]
    );
  };

  const toggleTask = (taskTitle: string) => {
    setSelectedTasks((prev) =>
      prev.some((t) => t.title === taskTitle)
        ? prev.filter((t) => t.title !== taskTitle)
        : [...prev, parsedData.suggestedTasks.find((t) => t.title === taskTitle)!]
    );
  };

  const calculateRealismScore = () => {
    // 1. Calculate focus hours
    const highTasks = selectedTasks.filter(t => t.priority === 'high').length;
    const medTasks = selectedTasks.filter(t => t.priority === 'medium').length;
    const lowTasks = selectedTasks.filter(t => t.priority === 'low').length;
    const habitCount = selectedHabits.length;

    const estimatedHours = (highTasks * 2) + (medTasks * 1) + (lowTasks * 0.5) + (habitCount * 0.5);

    let score = 100;
    const alerts: string[] = [];

    // Specificity Check
    const activeVerbs = ['build', 'code', 'ship', 'write', 'configure', 'launch', 'test', 'deploy', 'debug', 'install'];
    const totalTasks = selectedTasks.length;
    if (totalTasks > 0) {
      const activeTasksCount = selectedTasks.filter(t => 
        activeVerbs.some(verb => t.title.toLowerCase().includes(verb))
      ).length;
      const pct = (activeTasksCount / totalTasks) * 100;
      if (pct < 50) {
        score -= 20;
        alerts.push("Vague task goals. Use precise action verbs like 'build' or 'code' to ensure success.");
      }
    }

    // Recovery Check
    const wellnessAnchors = ['sleep', 'rest', 'breathe', 'walk', 'gym', 'hydrate', 'meditate'];
    const hasWellness = selectedHabits.some(h => 
      wellnessAnchors.some(anchor => h.title.toLowerCase().includes(anchor))
    );
    if (selectedHabits.length > 0 && !hasWellness) {
      score -= 15;
      alerts.push("Recovery buffer missing. Add a rest or wellness habit to prevent burnout.");
    }

    // Capacity Penalty
    if (estimatedHours > 4) {
      const excess = estimatedHours - 4;
      score -= Math.round(excess * 15);
      alerts.push(`You planned ${estimatedHours} hours of work into a 4-hour day. Choose high-leverage tasks or simplify.`);
    }

    const finalScore = Math.max(0, Math.min(100, score));
    return {
      score: finalScore,
      hours: estimatedHours,
      alerts: alerts
    };
  };

  const handleNext = () => {
    onComplete({
      goals: selectedGoals,
      habits: selectedHabits,
      tasks: selectedTasks,
    });
  };

  const realism = calculateRealismScore();

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-950 bg-emerald-950/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]';
    if (score >= 60) return 'text-amber-400 border-amber-950 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
    return 'text-rose-400 border-rose-950 bg-rose-950/15 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
    if (score >= 60) return 'bg-amber-500 shadow-[0_0_8px_#f59e0b]';
    return 'bg-rose-500 shadow-[0_0_8px_#f43f5e]';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-orange-500 animate-spin-slow" />
          Neural Planner Engineered
        </h2>
        <p className="text-zinc-400">
          I've translated your thoughts into concrete daily systems. Select the ones you want to commit to today.
        </p>
      </div>

      <div className="space-y-6">
        {/* Goals Section */}
        {parsedData.suggestedGoals && parsedData.suggestedGoals.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-orange-500 uppercase tracking-widest flex items-center gap-2">
              <Target className="w-4 h-4" /> Recommended Goals
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {parsedData.suggestedGoals.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-950 bg-opacity-20 text-white'
                        : 'border-zinc-800 bg-zinc-900 bg-opacity-50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-orange-500 bg-orange-600'
                          : 'border-zinc-700 bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-sm font-medium">{goal}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Habits Section */}
        {parsedData.suggestedHabits && parsedData.suggestedHabits.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4" /> Daily Habit Routines
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {parsedData.suggestedHabits.map((habit) => {
                const isSelected = selectedHabits.some((h) => h.title === habit.title);
                return (
                  <button
                    key={habit.title}
                    onClick={() => toggleHabit(habit.title)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-950 bg-opacity-20 text-white'
                        : 'border-zinc-800 bg-zinc-900 bg-opacity-50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-purple-500 bg-purple-600'
                          : 'border-zinc-700 bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{habit.title}</p>
                      <p className="text-xs text-zinc-500 capitalize">{habit.domain} • {habit.frequency}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tasks Section */}
        {parsedData.suggestedTasks && parsedData.suggestedTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Immediate Directives (Tasks)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {parsedData.suggestedTasks.map((task) => {
                const isSelected = selectedTasks.some((t) => t.title === task.title);
                return (
                  <button
                    key={task.title}
                    onClick={() => toggleTask(task.title)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950 bg-opacity-20 text-white'
                        : 'border-zinc-800 bg-zinc-900 bg-opacity-50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600'
                          : 'border-zinc-700 bg-zinc-800'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 flex justify-between items-center gap-4">
                      <div>
                        <p className="text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-zinc-500">Due: {task.dueDate}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-mono border ${
                          task.priority === 'high'
                            ? 'border-red-900 text-red-400 bg-red-950 bg-opacity-30'
                            : task.priority === 'medium'
                            ? 'border-yellow-900 text-yellow-400 bg-yellow-950 bg-opacity-30'
                            : 'border-green-900 text-green-400 bg-green-950 bg-opacity-30'
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Execution Realism Panel */}
      <div className={`p-5 rounded-xl border backdrop-blur-md transition-all ${getScoreColorClass(realism.score)}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            <h4 className="font-mono text-xs uppercase tracking-widest font-bold">Execution Realism Score</h4>
          </div>
          <span className="font-mono text-lg font-black">{realism.score}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-zinc-900/60 overflow-hidden mb-4 border border-zinc-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${realism.score}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full ${getProgressColor(realism.score)}`}
          />
        </div>

        {/* Diagnostic logs */}
        <div className="space-y-2 font-mono text-[0.7rem]">
          {realism.alerts.length > 0 ? (
            realism.alerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-2 text-zinc-300">
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className="leading-normal">{alert}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="shrink-0 font-bold">✓</span>
              <p>Optimum capacity & balanced specificity detected. Execution greenlit.</p>
            </div>
          )}
        </div>

        {/* Focus Hours Summary */}
        <div className="mt-4 pt-3 border-t border-zinc-800/40 flex items-center justify-between text-[0.7rem] text-zinc-500 font-mono">
          <span>Planned focus load:</span>
          <span className="font-semibold text-zinc-300">{realism.hours} Hours</span>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg transition-colors"
      >
        Compile Life OS & Continue
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
