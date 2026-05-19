'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Target, Zap, Activity, ArrowRight, Settings } from 'lucide-react';

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

  const handleNext = () => {
    onComplete({
      goals: selectedGoals,
      habits: selectedHabits,
      tasks: selectedTasks,
    });
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
