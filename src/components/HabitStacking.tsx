// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Habit Stacking Component
// "After I [CURRENT HABIT], I will [NEW HABIT]" - Atomic Habits
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { HabitStack } from '@/types';
import { 
  Link2, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Sparkles,
  GripVertical,
  X,
  Zap,
  Clock,
} from 'lucide-react';

// Default starter stacks for new users
const DEFAULT_STACKS: Omit<HabitStack, 'id'>[] = [
  {
    name: 'Morning Routine',
    habits: [
      { habitId: 'h1a', order: 1, duration: 2, transitionCue: 'After I wake up, I will...' },
      { habitId: 'h1b', order: 2, duration: 1, transitionCue: 'After making my bed, I will...' },
      { habitId: 'h1c', order: 3, duration: 5, transitionCue: 'After drinking water, I will...' },
      { habitId: 'h1d', order: 4, duration: 3, transitionCue: 'After stretching, I will...' },
    ],
    timeOfDay: 'morning',
    triggerCue: 'After I wake up',
    totalDuration: 11,
    currentStreak: 0,
    isActive: true,
    createdAt: new Date(),
  },
  {
    name: 'Work Deep Focus',
    habits: [
      { habitId: 'h2a', order: 1, duration: 1, transitionCue: 'When I sit at my desk, I will...' },
      { habitId: 'h2b', order: 2, duration: 1, transitionCue: 'After silencing phone, I will...' },
      { habitId: 'h2c', order: 3, duration: 2, transitionCue: 'After closing tabs, I will...' },
      { habitId: 'h2d', order: 4, duration: 25, transitionCue: 'After writing priorities, I will...' },
    ],
    timeOfDay: 'morning',
    triggerCue: 'When I sit at my desk',
    totalDuration: 29,
    currentStreak: 0,
    isActive: true,
    createdAt: new Date(),
  },
];

// Human-readable habit titles for display
const HABIT_TITLES: Record<string, string> = {
  'h1a': 'Make my bed',
  'h1b': 'Drink a glass of water',
  'h1c': '5 minutes of stretching',
  'h1d': 'Meditate for 3 minutes',
  'h2a': 'Put phone on silent',
  'h2b': 'Close all social media tabs',
  'h2c': 'Write down top 3 priorities',
  'h2d': 'Start first Pomodoro',
};

// Suggested habit combinations
const SUGGESTIONS = [
  { trigger: 'After I wake up', habits: ['Drink water', 'Make bed', 'Stretch'] },
  { trigger: 'After I pour my coffee', habits: ['Read for 10 minutes', 'Journal', 'Review goals'] },
  { trigger: 'After I finish lunch', habits: ['Take a short walk', 'Practice gratitude', 'Breathwork'] },
  { trigger: 'After I get home', habits: ['Change clothes', 'Review day', 'Plan tomorrow'] },
  { trigger: 'After I put on pajamas', habits: ['No phone zone', 'Read', 'Wind down routine'] },
];

export function HabitStacking() {
  const { 
    habitStacks, 
    addHabitStack, 
    updateHabitStack, 
    deleteHabitStack,
    addToast, 
    addXP 
  } = useAscendStore();
  
  // Track daily completion state (persisted per session)
  const [completedTodayMap, setCompletedTodayMap] = useState<Record<string, boolean>>({});
  const [habitCompletionMap, setHabitCompletionMap] = useState<Record<string, Set<string>>>({});
  
  const [showCreate, setShowCreate] = useState(false);
  const [newStackName, setNewStackName] = useState('');
  const [newStackTime, setNewStackTime] = useState('');
  const [newStackLocation, setNewStackLocation] = useState('');
  const [newHabits, setNewHabits] = useState<string[]>(['']);

  // Initialize with default stacks if store is empty
  useEffect(() => {
    if (habitStacks.length === 0) {
      DEFAULT_STACKS.forEach(stack => {
        addHabitStack({
          ...stack,
          id: `stack_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
        });
      });
    }
  }, [habitStacks.length, addHabitStack]);

  // Initialize completion maps
  useEffect(() => {
    const initialMap: Record<string, Set<string>> = {};
    habitStacks.forEach(stack => {
      initialMap[stack.id] = new Set();
    });
    setHabitCompletionMap(prev => ({...initialMap, ...prev}));
  }, [habitStacks]);

  const getHabitTitle = (habitId: string, fallbackIdx: number): string => {
    return HABIT_TITLES[habitId] || `Habit ${fallbackIdx + 1}`;
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 1) return '30 sec';
    return `${minutes} min`;
  };

  const getTimeLabel = (timeOfDay: string): string => {
    switch (timeOfDay) {
      case 'morning': return '7:00 AM';
      case 'afternoon': return '12:00 PM';
      case 'evening': return '6:00 PM';
      default: return 'Anytime';
    }
  };

  const toggleHabitInStack = (stackId: string, habitId: string) => {
    const stack = habitStacks.find(s => s.id === stackId);
    if (!stack) return;

    setHabitCompletionMap(prev => {
      const newMap = { ...prev };
      const completedSet = new Set(newMap[stackId] || []);
      
      const wasCompleted = completedSet.has(habitId);
      if (wasCompleted) {
        completedSet.delete(habitId);
      } else {
        completedSet.add(habitId);
        // Award XP for completing a habit in the stack
        addXP(5, 'Completed stacked habit');
      }
      
      newMap[stackId] = completedSet;

      // Check if all habits are now completed
      const allCompleted = stack.habits.every(h => completedSet.has(h.habitId));
      
      if (allCompleted && !completedTodayMap[stackId]) {
        // Bonus XP for completing entire stack
        addXP(20, `Completed habit stack: ${stack.name}`);
        addToast({
          type: 'success',
          title: 'Stack Completed! +25 XP',
          message: `"${stack.name}" chain is unbroken! 🔗`,
        });
        setCompletedTodayMap(prev => ({ ...prev, [stackId]: true }));
        
        // Update streak in store
        updateHabitStack(stackId, { currentStreak: stack.currentStreak + 1 });
      }

      return newMap;
    });
  };

  const isHabitCompleted = (stackId: string, habitId: string): boolean => {
    return habitCompletionMap[stackId]?.has(habitId) || false;
  };

  const getStackProgress = (stack: HabitStack): number => {
    const completed = habitCompletionMap[stack.id]?.size || 0;
    return (completed / stack.habits.length) * 100;
  };

  const addNewStack = () => {
    if (!newStackName.trim() || newHabits.filter(h => h.trim()).length === 0) {
      addToast({
        type: 'error',
        title: 'Missing Information',
        message: 'Please add a stack name and at least one habit.',
      });
      return;
    }

    const newStack: HabitStack = {
      id: `stack_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
      name: newStackName,
      habits: newHabits.filter(h => h.trim()).map((title, idx) => ({
        habitId: `custom_${Date.now()}_${idx}`,
        order: idx + 1,
        duration: 5, // Default 5 min
        transitionCue: idx === 0 
          ? `When I start ${newStackName}, I will...`
          : `After completing the previous habit, I will...`,
      })),
      timeOfDay: newStackTime ? 
        (parseInt(newStackTime.split(':')[0]) < 12 ? 'morning' : 
         parseInt(newStackTime.split(':')[0]) < 17 ? 'afternoon' : 'evening') 
        : 'anytime',
      triggerCue: `When I start ${newStackName}`,
      totalDuration: newHabits.filter(h => h.trim()).length * 5,
      currentStreak: 0,
      isActive: true,
      createdAt: new Date(),
    };

    // Store custom habit titles
    newHabits.filter(h => h.trim()).forEach((title, idx) => {
      HABIT_TITLES[`custom_${Date.now() - (newHabits.length - idx)}_${idx}`] = title;
    });

    addHabitStack(newStack);
    setShowCreate(false);
    setNewStackName('');
    setNewStackTime('');
    setNewStackLocation('');
    setNewHabits(['']);
    
    addToast({
      type: 'success',
      title: 'Stack Created!',
      message: 'Your new habit stack is ready to use.',
    });
    addXP(10, 'Created new habit stack');
  };

  const handleDeleteStack = (stackId: string) => {
    deleteHabitStack(stackId);
    addToast({
      type: 'info',
      title: 'Stack Deleted',
      message: 'Your habit stack has been removed.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-themed">Habit Stacking</h2>
            <p className="text-xs text-themed-muted">
              &quot;After I [X], I will [Y]&quot; — Chain habits together
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Stack
        </button>
      </div>

      {/* Info Card */}
      <div className="glass-card p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
          <div>
            <p className="text-sm text-themed font-medium">The Power of Habit Stacking</p>
            <p className="text-xs text-themed-muted mt-1">
              Link new habits to existing ones: &quot;After I [CURRENT HABIT], I will [NEW HABIT].&quot; 
              This leverages your brain&apos;s natural pattern recognition to build habits faster.
            </p>
          </div>
        </div>
      </div>

      {/* Habit Stacks */}
      <div className="space-y-4">
        {habitStacks.map((stack) => (
          <div
            key={stack.id}
            className={cn(
              "glass-card p-4 transition-all",
              completedTodayMap[stack.id] && "ring-2 ring-green-500/50"
            )}
          >
            {/* Stack Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-themed">{stack.name}</h3>
                  {completedTodayMap[stack.id] && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      ✓ Complete
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-themed-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {getTimeLabel(stack.timeOfDay)}
                  </span>
                  {stack.currentStreak > 0 && (
                    <span className="flex items-center gap-1 text-orange-400">
                      🔥 {stack.currentStreak} day streak
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteStack(stack.id)}
                title="Delete stack"
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-themed-muted hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/5 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${getStackProgress(stack)}%` }}
              />
            </div>

            {/* Habit Chain */}
            <div className="space-y-2">
              {stack.habits.map((habit, idx) => {
                const habitCompleted = isHabitCompleted(stack.id, habit.habitId);
                const habitTitle = getHabitTitle(habit.habitId, idx);
                return (
                  <div key={habit.habitId} className="flex items-center gap-3">
                    {/* Chain Link Indicator */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => toggleHabitInStack(stack.id, habit.habitId)}
                        title={habitCompleted ? "Mark incomplete" : "Mark complete"}
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                          habitCompleted
                            ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                            : "border-2 border-white/20 hover:border-purple-400"
                        )}
                      >
                        {habitCompleted && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      {idx < stack.habits.length - 1 && (
                        <div className={cn(
                          "w-0.5 h-6",
                          habitCompleted ? "bg-gradient-to-b from-purple-500 to-pink-500" : "bg-white/10"
                        )} />
                      )}
                    </div>

                    {/* Habit Content */}
                    <div className={cn(
                      "flex-1 py-2 px-3 rounded-lg transition-all",
                      habitCompleted ? "bg-purple-500/10" : "bg-white/5"
                    )}>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-sm",
                          habitCompleted ? "text-themed-muted line-through" : "text-themed"
                        )}>
                          {idx > 0 && <span className="text-purple-400 mr-2">Then →</span>}
                          {habitTitle}
                        </span>
                        <span className="text-xs text-themed-muted">{formatDuration(habit.duration)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stack Action */}
            {!completedTodayMap[stack.id] && (
              <button
                onClick={() => {
                  // Mark first uncompleted habit
                  const firstUncompleted = stack.habits.find(h => !isHabitCompleted(stack.id, h.habitId));
                  if (firstUncompleted) {
                    toggleHabitInStack(stack.id, firstUncompleted.habitId);
                  }
                }}
                className="w-full mt-4 py-2 text-sm font-medium text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Start Next Habit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Quick Suggestions */}
      <div className="glass-card p-4">
        <h3 className="font-medium text-themed mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Suggested Stacks
        </h3>
        <div className="space-y-2">
          {SUGGESTIONS.slice(0, 3).map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setShowCreate(true);
                setNewStackName(suggestion.trigger.replace('After I ', ''));
                setNewHabits(suggestion.habits);
              }}
              className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
            >
              <p className="text-sm text-themed-muted">{suggestion.trigger}</p>
              <p className="text-sm text-themed">
                {suggestion.habits.join(' → ')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Create Stack Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-themed">Create Habit Stack</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-themed-muted" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Stack Name */}
              <div>
                <label className="text-sm text-themed-secondary block mb-2">Stack Name</label>
                <input
                  type="text"
                  value={newStackName}
                  onChange={(e) => setNewStackName(e.target.value)}
                  placeholder="e.g., Morning Routine"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-themed"
                />
              </div>

              {/* Time & Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-themed-secondary block mb-2">Time (optional)</label>
                  <input
                    type="time"
                    value={newStackTime}
                    onChange={(e) => setNewStackTime(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-themed"
                  />
                </div>
                <div>
                  <label className="text-sm text-themed-secondary block mb-2">Location (optional)</label>
                  <input
                    type="text"
                    value={newStackLocation}
                    onChange={(e) => setNewStackLocation(e.target.value)}
                    placeholder="e.g., Kitchen"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 text-themed"
                  />
                </div>
              </div>

              {/* Habits */}
              <div>
                <label className="text-sm text-themed-secondary block mb-2">
                  Habits in Order (drag to reorder)
                </label>
                <div className="space-y-2">
                  {newHabits.map((habit, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-themed-muted" />
                      <input
                        type="text"
                        value={habit}
                        onChange={(e) => {
                          const updated = [...newHabits];
                          updated[idx] = e.target.value;
                          setNewHabits(updated);
                        }}
                        placeholder={`Habit ${idx + 1}`}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-purple-500 text-themed text-sm"
                      />
                      {newHabits.length > 1 && (
                        <button
                          onClick={() => setNewHabits(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 hover:bg-red-500/10 rounded text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setNewHabits(prev => [...prev, ''])}
                  className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Another Habit
                </button>
              </div>

              {/* Preview */}
              {newHabits.some(h => h.trim()) && (
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <p className="text-xs text-purple-400 mb-2">Preview:</p>
                  <p className="text-sm text-themed">
                    {newHabits.filter(h => h.trim()).map((h, i, arr) => (
                      <span key={i}>
                        &quot;{h}&quot;{i < arr.length - 1 && <span className="text-purple-400"> → </span>}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-themed"
              >
                Cancel
              </button>
              <button
                onClick={addNewStack}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                Create Stack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
