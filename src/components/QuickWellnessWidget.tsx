// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Quick Wellness Widget
// Small sidebar widget for quick access to wellness features
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Heart,
  Wind,
  Smile,
  Sun,
  ChevronRight,
  Sparkles,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import { MOOD_EMOJIS, BREATHING_EXERCISES, SELF_COMPASSION_PROMPTS } from '@/types';
import { WellnessCenter } from './WellnessCenter';
import { MoodCheckIn } from './MoodCheckIn';
import { BreathingExercise } from './BreathingExercise';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface QuickWellnessWidgetProps {
  variant?: 'compact' | 'expanded';
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function QuickWellnessWidget({ variant = 'compact', className = '' }: QuickWellnessWidgetProps) {
  const [showWellnessCenter, setShowWellnessCenter] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(BREATHING_EXERCISES[0]);

  const {
    moodEntries,
    addMoodEntry,
    getMoodTrend,
    gentleModeSettings: _gentleModeSettings,
    streakFreezeCount,
    wellnessStats,
  } = useAscendStore();

  // Get today's mood
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMood = moodEntries.find(m => m.date === todayStr);
  const moodTrend = getMoodTrend();

  // Random self-compassion prompt
  const getRandomPrompt = () => {
    const prompts = todayMood && todayMood.mood <= 2
      ? SELF_COMPASSION_PROMPTS.lowMoodDay
      : SELF_COMPASSION_PROMPTS.dailyEncouragement;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  // Quick breathing exercise
  const handleQuickBreathing = () => {
    setSelectedExercise(BREATHING_EXERCISES.find(e => e.id === 'simple') || BREATHING_EXERCISES[0]);
    setShowBreathing(true);
  };

  if (variant === 'compact') {
    return (
      <>
        <div
          className={cn(
            'p-3 rounded-xl border cursor-pointer transition-all hover:border-ascend-500',
            className
          )}
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
          onClick={() => setShowWellnessCenter(true)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" style={{ color: 'var(--ascend-500)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Wellness
              </span>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="flex items-center gap-3">
            {/* Today's mood indicator */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                {todayMood ? MOOD_EMOJIS[todayMood.mood].emoji : 'LOG'}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {todayMood ? MOOD_EMOJIS[todayMood.mood].label : 'Log mood'}
              </span>
            </div>

            {/* Trend indicator */}
            {moodEntries.length >= 3 && (
              <div className="flex items-center gap-1">
                {moodTrend === 'improving' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : moodTrend === 'declining' ? (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                ) : (
                  <Minus className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                )}
              </div>
            )}

            {/* Streak freeze indicator */}
            {streakFreezeCount > 0 && (
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
                style={{ backgroundColor: 'var(--background-secondary)' }}
                title={`${streakFreezeCount} streak freezes available`}
              >
                <Shield className="w-3 h-3" style={{ color: '#22C55E' }} />
                <span style={{ color: 'var(--text-secondary)' }}>{streakFreezeCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <WellnessCenter isOpen={showWellnessCenter} onClose={() => setShowWellnessCenter(false)} />
      </>
    );
  }

  // Expanded variant
  return (
    <>
      <div
        className={cn('p-4 rounded-xl border', className)}
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--ascend-500)/10' }}
            >
              <Heart className="w-4 h-4" style={{ color: 'var(--ascend-500)' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Wellness Hub
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Take care of yourself
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowWellnessCenter(true)}
            className="text-xs px-2 py-1 rounded-lg"
            style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-secondary)' }}
          >
            Full View
          </button>
        </div>

        {/* Daily Compassion Message */}
        <div
          className="p-3 rounded-lg mb-4"
          style={{ backgroundColor: 'var(--ascend-500)/5' }}
        >
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ascend-500)' }} />
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {getRandomPrompt()}
            </p>
          </div>
        </div>

        {/* Mood Check */}
        <div className="mb-4">
          {todayMood ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-hover)] text-[var(--text-secondary)]">
                  {MOOD_EMOJIS[todayMood.mood].emoji}
                </span>
                <div>
                  <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                    {MOOD_EMOJIS[todayMood.mood].label}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Today&apos;s mood
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowMoodCheckIn(true)}
                className="text-xs px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: 'var(--ascend-500)' }}
              >
                Update
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowMoodCheckIn(true)}
              className="w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
            >
              <Smile className="w-4 h-4" />
              How are you feeling?
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleQuickBreathing}
            className="p-2 rounded-lg text-left transition-all hover:ring-1 ring-ascend-500"
            style={{ backgroundColor: 'var(--background-secondary)' }}
          >
            <Wind className="w-4 h-4 mb-1" style={{ color: '#3B82F6' }} />
            <span className="text-xs block" style={{ color: 'var(--text-primary)' }}>
              Quick Breathe
            </span>
          </button>
          <button
            onClick={() => setShowWellnessCenter(true)}
            className="p-2 rounded-lg text-left transition-all hover:ring-1 ring-ascend-500"
            style={{ backgroundColor: 'var(--background-secondary)' }}
          >
            <Sun className="w-4 h-4 mb-1" style={{ color: '#F59E0B' }} />
            <span className="text-xs block" style={{ color: 'var(--text-primary)' }}>
              Gratitude
            </span>
          </button>
        </div>

        {/* Wellness Stats */}
        {(wellnessStats.totalBreathingSessions > 0 || moodEntries.length > 0) && (
          <div
            className="mt-4 pt-3 border-t flex items-center justify-around text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <span className="text-lg font-semibold block" style={{ color: 'var(--text-primary)' }}>
                {wellnessStats.totalBreathingSessions}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Breathing
              </span>
            </div>
            <div>
              <span className="text-lg font-semibold block" style={{ color: 'var(--text-primary)' }}>
                {moodEntries.length}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Mood Logs
              </span>
            </div>
            <div>
              <span className="text-lg font-semibold block" style={{ color: 'var(--text-primary)' }}>
                {streakFreezeCount}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Freezes
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <WellnessCenter isOpen={showWellnessCenter} onClose={() => setShowWellnessCenter(false)} />
      <MoodCheckIn
        isOpen={showMoodCheckIn}
        onClose={() => setShowMoodCheckIn(false)}
        onSubmit={(entry) => {
          addMoodEntry(entry);
          setShowMoodCheckIn(false);
        }}
      />
      <BreathingExercise
        exercise={selectedExercise}
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// FLOATING BREATHE BUTTON
// Accessible from any screen
// ─────────────────────────────────────────────────────────────────────────────────

export function FloatingBreatheButton() {
  const [showBreathing, setShowBreathing] = useState(false);
  const [selectedExercise] = useState(BREATHING_EXERCISES.find(e => e.id === 'simple') || BREATHING_EXERCISES[0]);

  return (
    <>
      <button
        onClick={() => setShowBreathing(true)}
        className="fixed bottom-24 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-30"
        style={{ backgroundColor: 'var(--ascend-500)' }}
        title="Take a breath"
      >
        <Wind className="w-5 h-5 text-white" />
      </button>

      <BreathingExercise
        exercise={selectedExercise}
        isOpen={showBreathing}
        onClose={() => setShowBreathing(false)}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// GENTLE REMINDER COMPONENT
// Shows contextual, compassionate reminders
// ─────────────────────────────────────────────────────────────────────────────────

export function GentleReminder({ context }: { context?: 'morning' | 'evening' | 'missed_task' | 'low_mood' }) {
  const { gentleModeSettings } = useAscendStore();

  if (!gentleModeSettings.selfCompassionPrompts) return null;

  const getPrompt = () => {
    switch (context) {
      case 'morning':
        return "Good morning! What's one kind thing you can do for yourself today?";
      case 'evening':
        return "Day's winding down. What went well today, even if small?";
      case 'missed_task':
        return SELF_COMPASSION_PROMPTS.afterMissedTask[
          Math.floor(Math.random() * SELF_COMPASSION_PROMPTS.afterMissedTask.length)
        ];
      case 'low_mood':
        return SELF_COMPASSION_PROMPTS.lowMoodDay[
          Math.floor(Math.random() * SELF_COMPASSION_PROMPTS.lowMoodDay.length)
        ];
      default:
        return SELF_COMPASSION_PROMPTS.dailyEncouragement[
          Math.floor(Math.random() * SELF_COMPASSION_PROMPTS.dailyEncouragement.length)
        ];
    }
  };

  return (
    <div
      className="p-3 rounded-lg flex items-start gap-2"
      style={{ backgroundColor: 'var(--ascend-500)/5' }}
    >
      <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ascend-500)' }} />
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {getPrompt()}
      </p>
    </div>
  );
}

export default QuickWellnessWidget;
