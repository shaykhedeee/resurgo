// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Wellness Center Component
// Comprehensive mental health support hub
// Features: Mood tracking, breathing exercises, gratitude, self-compassion
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Heart,
  Brain,
  Smile,
  Wind,
  Sun,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Activity,
  ChevronRight,
  Phone,
  MessageCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import {
  MoodEntry,
  MoodFactor,
  MOOD_EMOJIS,
  ENERGY_LABELS,
  MOOD_FACTORS_INFO,
  BREATHING_EXERCISES,
  SELF_COMPASSION_PROMPTS,
  CRISIS_RESOURCES,
  GratitudeEntry,
} from '@/types';
import BreathingExercise from './BreathingExercise';
import MoodCheckIn from './MoodCheckIn';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface WellnessCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

type WellnessTab = 'overview' | 'mood' | 'breathing' | 'gratitude' | 'insights' | 'resources';

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function WellnessCenter({ isOpen, onClose }: WellnessCenterProps) {
  const [activeTab, setActiveTab] = useState<WellnessTab>('overview');
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<typeof BREATHING_EXERCISES[0] | null>(null);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);

  const {
    moodEntries,
    gratitudeEntries,
    addMoodEntry,
    addGratitudeEntry,
    gentleModeSettings: _gentleModeSettings,
    user: _user,
  } = useAscendStore();

  // Get today's mood
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMood = moodEntries.find(m => m.date === todayStr);

  // Calculate mood stats
  const last7Days = moodEntries.filter(m => {
    const date = new Date(m.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });

  const avgMood = last7Days.length > 0
    ? last7Days.reduce((sum, m) => sum + m.mood, 0) / last7Days.length
    : 0;

  const moodTrend = last7Days.length >= 2
    ? last7Days[last7Days.length - 1].mood - last7Days[0].mood > 0
      ? 'improving'
      : last7Days[last7Days.length - 1].mood - last7Days[0].mood < 0
        ? 'declining'
        : 'stable'
    : 'stable';

  if (!isOpen) return null;

  const tabs: { id: WellnessTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Heart className="w-4 h-4" /> },
    { id: 'mood', label: 'Mood', icon: <Smile className="w-4 h-4" /> },
    { id: 'breathing', label: 'Breathe', icon: <Wind className="w-4 h-4" /> },
    { id: 'gratitude', label: 'Gratitude', icon: <Sun className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'resources', label: 'Help', icon: <Phone className="w-4 h-4" /> },
  ];

  // Get a random self-compassion prompt
  const getRandomPrompt = () => {
    const category = todayMood && todayMood.mood <= 2 ? 'lowMoodDay' : 'dailyEncouragement';
    const prompts = SELF_COMPASSION_PROMPTS[category];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Panel */}
      <div
        className="fixed right-0 top-0 h-full w-full max-w-lg z-50 flex flex-col"
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--ascend-500)/10' }}
            >
              <Heart className="w-5 h-5" style={{ color: 'var(--ascend-500)' }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Wellness Center
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Your mental health companion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 p-2 border-b overflow-x-auto"
          style={{ borderColor: 'var(--border)' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-ascend-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
              style={{
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <OverviewTab
              todayMood={todayMood}
              avgMood={avgMood}
              moodTrend={moodTrend}
              onLogMood={() => setShowMoodCheckIn(true)}
              onStartBreathing={(exercise) => {
                setSelectedExercise(exercise);
                setShowBreathingExercise(true);
              }}
              compassionPrompt={getRandomPrompt()}
            />
          )}

          {activeTab === 'mood' && (
            <MoodTab
              moodEntries={moodEntries}
              onLogMood={() => setShowMoodCheckIn(true)}
            />
          )}

          {activeTab === 'breathing' && (
            <BreathingTab
              onStartExercise={(exercise) => {
                setSelectedExercise(exercise);
                setShowBreathingExercise(true);
              }}
            />
          )}

          {activeTab === 'gratitude' && (
            <GratitudeTab
              gratitudeEntries={gratitudeEntries}
              onAddEntry={addGratitudeEntry}
            />
          )}

          {activeTab === 'insights' && (
            <InsightsTab
              moodEntries={moodEntries}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesTab />
          )}
        </div>
      </div>

      {/* Mood Check-In Modal */}
      {showMoodCheckIn && (
        <MoodCheckIn
          isOpen={showMoodCheckIn}
          onClose={() => setShowMoodCheckIn(false)}
          onSubmit={(entry: Omit<MoodEntry, 'id'>) => {
            addMoodEntry(entry);
            setShowMoodCheckIn(false);
          }}
        />
      )}

      {/* Breathing Exercise Modal */}
      {showBreathingExercise && selectedExercise && (
        <BreathingExercise
          exercise={selectedExercise}
          isOpen={showBreathingExercise}
          onClose={() => {
            setShowBreathingExercise(false);
            setSelectedExercise(null);
          }}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ─────────────────────────────────────────────────────────────────────────────────

function OverviewTab({
  todayMood,
  avgMood,
  moodTrend,
  onLogMood,
  onStartBreathing,
  compassionPrompt,
}: {
  todayMood?: MoodEntry;
  avgMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  onLogMood: () => void;
  onStartBreathing: (exercise: typeof BREATHING_EXERCISES[0]) => void;
  compassionPrompt: string;
}) {
  return (
    <div className="space-y-4">
      {/* Self-Compassion Card */}
      <div
        className="p-4 rounded-xl border"
        style={{
          backgroundColor: 'var(--ascend-500)/5',
          borderColor: 'var(--ascend-500)/20',
        }}
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 mt-0.5" style={{ color: 'var(--ascend-500)' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Daily Reminder
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {compassionPrompt}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Mood */}
      <div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            Today&apos;s Mood
          </h3>
          {todayMood && (
            <span
              className="text-2xl"
              title={MOOD_EMOJIS[todayMood.mood].label}
            >
              {MOOD_EMOJIS[todayMood.mood].emoji}
            </span>
          )}
        </div>

        {todayMood ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: MOOD_EMOJIS[todayMood.mood].color + '20',
                  color: MOOD_EMOJIS[todayMood.mood].color,
                }}
              >
                {MOOD_EMOJIS[todayMood.mood].label}
              </span>
              {todayMood.energy && (
                <span
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {ENERGY_LABELS[todayMood.energy]}
                </span>
              )}
            </div>
            {todayMood.notes && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                &quot;{todayMood.notes}&quot;
              </p>
            )}
            <button
              onClick={onLogMood}
              className="text-sm text-ascend-500 hover:underline"
            >
              Update mood
            </button>
          </div>
        ) : (
          <button
            onClick={onLogMood}
            className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
          >
            Log Today&apos;s Mood
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3 rounded-xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              7-Day Average
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {avgMood > 0 ? avgMood.toFixed(1) : '—'}
            </span>
            <span className="text-lg">
              {avgMood >= 4 ? '😊' : avgMood >= 3 ? '🙂' : avgMood >= 2 ? '😐' : avgMood > 0 ? '😔' : ''}
            </span>
          </div>
        </div>

        <div
          className="p-3 rounded-xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            {moodTrend === 'improving' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : moodTrend === 'declining' ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <Minus className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            )}
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Trend
            </span>
          </div>
          <span
            className="text-sm font-medium capitalize"
            style={{
              color: moodTrend === 'improving' ? '#22C55E' : moodTrend === 'declining' ? '#EF4444' : 'var(--text-primary)',
            }}
          >
            {moodTrend}
          </span>
        </div>
      </div>

      {/* Quick Breathing */}
      <div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
      >
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Quick Calm
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BREATHING_EXERCISES.slice(0, 4).map(exercise => (
            <button
              key={exercise.id}
              onClick={() => onStartBreathing(exercise)}
              className="p-3 rounded-lg text-left transition-all hover:scale-[1.02]"
              style={{ backgroundColor: 'var(--background-secondary)' }}
            >
              <span className="text-xl mb-1 block">{exercise.icon}</span>
              <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                {exercise.name}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {exercise.cycles} cycles
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MOOD TAB
// ─────────────────────────────────────────────────────────────────────────────────

function MoodTab({
  moodEntries,
  onLogMood,
}: {
  moodEntries: MoodEntry[];
  onLogMood: () => void;
}) {
  // Get last 14 days
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  return (
    <div className="space-y-4">
      <button
        onClick={onLogMood}
        className="w-full py-3 rounded-lg font-medium transition-all hover:opacity-90"
        style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
      >
        + Log Mood
      </button>

      {/* Mood Pixels (last 14 days) */}
      <div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
      >
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Last 14 Days
        </h3>
        <div className="flex flex-wrap gap-2">
          {last14Days.map(dateStr => {
            const entry = moodEntries.find(m => m.date === dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            return (
              <div
                key={dateStr}
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all',
                  isToday && 'ring-2 ring-ascend-500'
                )}
                style={{
                  backgroundColor: entry
                    ? MOOD_EMOJIS[entry.mood].color + '30'
                    : 'var(--background-secondary)',
                }}
                title={`${dateStr}: ${entry ? MOOD_EMOJIS[entry.mood].label : 'No entry'}`}
              >
                {entry ? MOOD_EMOJIS[entry.mood].emoji : '·'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Entries */}
      <div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
      >
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Recent Entries
        </h3>
        <div className="space-y-3">
          {moodEntries.slice(0, 5).map(entry => (
            <div
              key={entry.id}
              className="flex items-start gap-3 p-2 rounded-lg"
              style={{ backgroundColor: 'var(--background-secondary)' }}
            >
              <span className="text-xl">{MOOD_EMOJIS[entry.mood].emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: MOOD_EMOJIS[entry.mood].color + '20',
                      color: MOOD_EMOJIS[entry.mood].color,
                    }}
                  >
                    {MOOD_EMOJIS[entry.mood].label}
                  </span>
                </div>
                {entry.notes && (
                  <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                    {entry.notes}
                  </p>
                )}
                {entry.factors && entry.factors.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {entry.factors.map(factor => (
                      <span key={factor} className="text-xs">
                        {MOOD_FACTORS_INFO[factor].icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {moodEntries.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>
              No mood entries yet. Start tracking to see patterns!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// BREATHING TAB
// ─────────────────────────────────────────────────────────────────────────────────

function BreathingTab({
  onStartExercise,
}: {
  onStartExercise: (exercise: typeof BREATHING_EXERCISES[0]) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Breathing exercises can help calm anxiety, improve focus, and reduce stress. Choose one that fits your needs.
      </p>

      {BREATHING_EXERCISES.map(exercise => (
        <button
          key={exercise.id}
          onClick={() => onStartExercise(exercise)}
          className="w-full p-4 rounded-xl border text-left transition-all hover:border-ascend-500"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{exercise.icon}</span>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {exercise.name}
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                {exercise.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {exercise.forConditions.map(condition => (
                  <span
                    key={condition}
                    className="text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-muted)' }}
                  >
                    {condition}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>Inhale: {exercise.inhale}s</span>
                {exercise.hold1 && <span>Hold: {exercise.hold1}s</span>}
                <span>Exhale: {exercise.exhale}s</span>
                {exercise.hold2 && <span>Hold: {exercise.hold2}s</span>}
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </div>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// GRATITUDE TAB
// ─────────────────────────────────────────────────────────────────────────────────

function GratitudeTab({
  gratitudeEntries,
  onAddEntry,
}: {
  gratitudeEntries: GratitudeEntry[];
  onAddEntry: (entry: Omit<GratitudeEntry, 'id'>) => void;
}) {
  const [newEntries, setNewEntries] = useState(['', '', '']);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = gratitudeEntries.find(e => e.date === todayStr);

  const handleSubmit = () => {
    const validEntries = newEntries.filter(e => e.trim().length > 0);
    if (validEntries.length === 0) return;

    onAddEntry({
      date: todayStr,
      entries: validEntries,
      timestamp: new Date().toISOString(),
    });
    setNewEntries(['', '', '']);
  };

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl border"
        style={{
          backgroundColor: 'var(--ascend-500)/5',
          borderColor: 'var(--ascend-500)/20',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          💡 Research shows that gratitude practice improves mood, sleep, and overall wellbeing. 
          Try to think of 3 things you&apos;re grateful for today—they can be big or small!
        </p>
      </div>

      {todayEntry ? (
        <div
          className="p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Today&apos;s Gratitude ✨
          </h3>
          <ul className="space-y-2">
            {todayEntry.entries.map((entry, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="text-green-500">✓</span>
                {entry}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          className="p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            What are you grateful for today?
          </h3>
          <div className="space-y-2">
            {newEntries.map((entry, i) => (
              <input
                key={i}
                type="text"
                value={entry}
                onChange={(e) => {
                  const updated = [...newEntries];
                  updated[i] = e.target.value;
                  setNewEntries(updated);
                }}
                placeholder={`${i + 1}. Something you're grateful for...`}
                className="w-full px-3 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              />
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={newEntries.every(e => e.trim().length === 0)}
            className="w-full mt-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
          >
            Save Gratitude
          </button>
        </div>
      )}

      {/* Past Entries */}
      {gratitudeEntries.length > 0 && (
        <div
          className="p-4 rounded-xl border"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Past Reflections
          </h3>
          <div className="space-y-3">
            {gratitudeEntries
              .filter(e => e.date !== todayStr)
              .slice(0, 5)
              .map(entry => (
                <div
                  key={entry.id}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--background-secondary)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                  <ul className="mt-1 space-y-1">
                    {entry.entries.map((e, i) => (
                      <li key={i} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        • {e}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// INSIGHTS TAB
// ─────────────────────────────────────────────────────────────────────────────────

function InsightsTab({
  moodEntries,
}: {
  moodEntries: MoodEntry[];
}) {
  // Calculate insights
  const last30Days = moodEntries.filter(m => {
    const date = new Date(m.date);
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    return date >= monthAgo;
  });

  // Factor analysis
  const factorMoods: Record<MoodFactor, number[]> = {} as any;
  last30Days.forEach(entry => {
    entry.factors?.forEach(factor => {
      if (!factorMoods[factor]) factorMoods[factor] = [];
      factorMoods[factor].push(entry.mood);
    });
  });

  const factorAverages = Object.entries(factorMoods)
    .map(([factor, moods]) => ({
      factor: factor as MoodFactor,
      avgMood: moods.reduce((a, b) => a + b, 0) / moods.length,
      count: moods.length,
    }))
    .filter(f => f.count >= 2)
    .sort((a, b) => b.avgMood - a.avgMood);

  // Day of week analysis
  const dayMoods: number[][] = [[], [], [], [], [], [], []];
  last30Days.forEach(entry => {
    const day = new Date(entry.date).getDay();
    dayMoods[day].push(entry.mood);
  });

  const dayAverages = dayMoods.map((moods, i) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
    avgMood: moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0,
    count: moods.length,
  }));

  const bestDay = dayAverages.filter(d => d.count > 0).sort((a, b) => b.avgMood - a.avgMood)[0];

  return (
    <div className="space-y-4">
      {last30Days.length < 7 ? (
        <div
          className="p-4 rounded-xl border text-center"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
        >
          <Brain className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Keep Tracking!
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Log your mood for at least 7 days to start seeing patterns and insights.
          </p>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            {last30Days.length}/7 days logged
          </p>
        </div>
      ) : (
        <>
          {/* Best Day */}
          {bestDay && (
            <div
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                🌟 Your Best Day
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                You tend to feel best on <strong>{bestDay.day}s</strong> (avg mood: {bestDay.avgMood.toFixed(1)})
              </p>
            </div>
          )}

          {/* Positive Factors */}
          {factorAverages.length > 0 && (
            <div
              className="p-4 rounded-xl border"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
            >
              <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                What Helps Your Mood
              </h3>
              <div className="space-y-2">
                {factorAverages.slice(0, 5).map(({ factor, avgMood, count }) => (
                  <div key={factor} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{MOOD_FACTORS_INFO[factor].icon}</span>
                      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                        {MOOD_FACTORS_INFO[factor].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {avgMood.toFixed(1)}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ({count} days)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Day of Week Chart */}
          <div
            className="p-4 rounded-xl border"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
          >
            <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Mood by Day of Week
            </h3>
            <div className="flex items-end justify-between h-24 gap-1">
              {dayAverages.map(({ day, avgMood, count }) => (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t transition-all"
                    style={{
                      height: `${count > 0 ? (avgMood / 5) * 100 : 10}%`,
                      backgroundColor: count > 0 ? 'var(--ascend-500)' : 'var(--background-secondary)',
                      opacity: count > 0 ? 1 : 0.3,
                    }}
                  />
                  <span className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    {day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// RESOURCES TAB
// ─────────────────────────────────────────────────────────────────────────────────

function ResourcesTab() {
  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded-xl border border-red-200 dark:border-red-900"
        style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
      >
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400">
              Need Immediate Help?
            </h3>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              If you&apos;re in crisis or having thoughts of self-harm, please reach out to these resources immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="space-y-3">
        {CRISIS_RESOURCES.map((resource, i) => (
          <a
            key={i}
            href={resource.type === 'call' ? `tel:${resource.contact}` : 
                  resource.type === 'text' ? '#' :
                  resource.contact}
            target={resource.type === 'website' ? '_blank' : undefined}
            rel={resource.type === 'website' ? 'noopener noreferrer' : undefined}
            className="block p-4 rounded-xl border transition-all hover:border-ascend-500"
            style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-start gap-3">
              {resource.type === 'call' && <Phone className="w-5 h-5 text-green-500" />}
              {resource.type === 'text' && <MessageCircle className="w-5 h-5 text-blue-500" />}
              {resource.type === 'website' && <ExternalLink className="w-5 h-5 text-purple-500" />}
              {resource.type === 'chat' && <MessageCircle className="w-5 h-5 text-orange-500" />}
              
              <div className="flex-1">
                <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {resource.name}
                </h4>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {resource.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: 'var(--ascend-500)' }}
                  >
                    {resource.contact}
                  </span>
                  {resource.country && (
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-muted)' }}>
                      {resource.country}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    • {resource.available}
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <div
        className="p-4 rounded-xl border"
        style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}
      >
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>Important:</strong> Resurgo is not a substitute for professional mental health care. 
          If you&apos;re struggling with your mental health, please reach out to a qualified healthcare provider. 
          The tools and features in this app are designed to support wellbeing, not diagnose or treat mental health conditions.
        </p>
      </div>
    </div>
  );
}

export default WellnessCenter;
