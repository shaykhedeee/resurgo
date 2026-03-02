// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Gentle Mode Settings Component
// ADHD & Anxiety-friendly configuration options
// Features: Flexible streaks, reduced notifications, self-compassion prompts
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import {
  Heart,
  Shield,
  BellOff,
  Clock,
  EyeOff,
  Sparkles,
  Zap,
  MessageSquare,
  Info,
  Brain,
  Leaf,
} from 'lucide-react';
import { GentleModeSettings, DEFAULT_GENTLE_MODE } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface GentleModeSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function GentleModeSettingsPanel({ isOpen }: GentleModeSettingsProps) {
  const { gentleModeSettings, updateGentleModeSettings, addToast } = useAscendStore();
  const [settings, setSettings] = useState<GentleModeSettings>(gentleModeSettings);

  if (!isOpen) return null;

  const handleToggle = (key: keyof GentleModeSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateGentleModeSettings(newSettings);
  };

  const handleGracePeriodChange = (hours: number) => {
    const newSettings = { ...settings, streakGracePeriod: hours };
    setSettings(newSettings);
    updateGentleModeSettings(newSettings);
  };

  const handleEnableAll = () => {
    const fullGentleMode: GentleModeSettings = {
      enabled: true,
      flexibleStreaks: true,
      streakGracePeriod: 36,
      reducedNotifications: true,
      softerLanguage: true,
      hideIncompleteCount: true,
      autoAdjustOnLowMood: true,
      showOnlyTopPriorities: true,
      celebrateSmallWins: true,
      selfCompassionPrompts: true,
    };
    setSettings(fullGentleMode);
    updateGentleModeSettings(fullGentleMode);
    addToast({
      type: 'success',
      title: 'Gentle Mode Enabled',
      message: 'Your experience is now optimized for wellbeing.',
    });
  };

  const settingItems = [
    {
      key: 'flexibleStreaks' as keyof GentleModeSettings,
      icon: <Shield className="w-5 h-5" />,
      title: 'Flexible Streaks',
      description: 'Complete 5 out of 7 days to maintain your streak. Life happens!',
      color: '#22C55E',
    },
    {
      key: 'reducedNotifications' as keyof GentleModeSettings,
      icon: <BellOff className="w-5 h-5" />,
      title: 'Reduced Notifications',
      description: 'Fewer, gentler reminders that don\'t feel demanding.',
      color: '#3B82F6',
    },
    {
      key: 'softerLanguage' as keyof GentleModeSettings,
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Encouraging Language',
      description: 'Use supportive phrasing instead of urgent or guilt-inducing language.',
      color: '#A855F7',
    },
    {
      key: 'hideIncompleteCount' as keyof GentleModeSettings,
      icon: <EyeOff className="w-5 h-5" />,
      title: 'Hide Incomplete Count',
      description: 'Don\'t show "X tasks remaining" to reduce overwhelm.',
      color: '#F59E0B',
    },
    {
      key: 'autoAdjustOnLowMood' as keyof GentleModeSettings,
      icon: <Heart className="w-5 h-5" />,
      title: 'Mood-Based Adjustments',
      description: 'Automatically reduce tasks when you log a low mood day.',
      color: '#EF4444',
    },
    {
      key: 'showOnlyTopPriorities' as keyof GentleModeSettings,
      icon: <Zap className="w-5 h-5" />,
      title: 'Focus Mode',
      description: 'On tough days, show only your top 3 priorities.',
      color: '#14B8A6',
    },
    {
      key: 'celebrateSmallWins' as keyof GentleModeSettings,
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Celebrate Small Wins',
      description: 'Extra encouragement for completing even tiny tasks.',
      color: '#F97316',
    },
    {
      key: 'selfCompassionPrompts' as keyof GentleModeSettings,
      icon: <Leaf className="w-5 h-5" />,
      title: 'Self-Compassion Prompts',
      description: 'Gentle reminders to be kind to yourself, especially on hard days.',
      color: '#10B981',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Master Toggle */}
      <div
        className="p-4 rounded-xl border"
        style={{
          backgroundColor: settings.enabled ? 'var(--ascend-500)/10' : 'var(--card-bg)',
          borderColor: settings.enabled ? 'var(--ascend-500)' : 'var(--border)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--ascend-500)/20' }}
            >
              <Brain className="w-5 h-5" style={{ color: 'var(--ascend-500)' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Gentle Mode
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Optimized for ADHD, anxiety, and mental health support. 
                Reduces pressure and increases encouragement.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleToggle('enabled')}
            className={cn(
              'w-12 h-6 rounded-full transition-all relative',
              settings.enabled ? 'bg-ascend-500' : 'bg-gray-300 dark:bg-gray-600'
            )}
          >
            <span
              className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                settings.enabled ? 'left-7' : 'left-1'
              )}
            />
          </button>
        </div>

        {!settings.enabled && (
          <button
            onClick={handleEnableAll}
            className="mt-3 w-full py-2 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
          >
            Enable All Gentle Mode Features
          </button>
        )}
      </div>

      {/* Info Box */}
      <div
        className="p-4 rounded-xl flex items-start gap-3"
        style={{ backgroundColor: 'var(--background-secondary)' }}
      >
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--ascend-500)' }} />
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
            Why Gentle Mode?
          </p>
          <p className="mt-1">
            Traditional productivity apps can increase anxiety and shame. 
            These settings prioritize your wellbeing over strict tracking, 
            because sustainable progress comes from self-compassion, not pressure.
          </p>
        </div>
      </div>

      {/* Individual Settings */}
      <div className="space-y-3">
        {settingItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-3 rounded-xl transition-all"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: item.color + '20' }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h4>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {item.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={cn(
                'w-10 h-5 rounded-full transition-all relative flex-shrink-0',
                settings[item.key] ? 'bg-ascend-500' : 'bg-gray-300 dark:bg-gray-600'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all',
                  settings[item.key] ? 'left-5' : 'left-0.5'
                )}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Streak Grace Period */}
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Clock className="w-5 h-5" style={{ color: 'var(--ascend-500)' }} />
          <div>
            <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Streak Grace Period
            </h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Hours before a streak is considered broken
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {[24, 36, 48, 72].map((hours) => (
            <button
              key={hours}
              onClick={() => handleGracePeriodChange(hours)}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-all',
                settings.streakGracePeriod === hours
                  ? 'bg-ascend-500 text-white'
                  : ''
              )}
              style={{
                backgroundColor: settings.streakGracePeriod === hours
                  ? 'var(--ascend-500)'
                  : 'var(--background-secondary)',
                color: settings.streakGracePeriod === hours
                  ? 'white'
                  : 'var(--text-secondary)',
              }}
            >
              {hours}h
            </button>
          ))}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Quick Presets
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const preset: GentleModeSettings = {
                ...DEFAULT_GENTLE_MODE,
                enabled: true,
                flexibleStreaks: true,
                reducedNotifications: true,
                celebrateSmallWins: true,
              };
              setSettings(preset);
              updateGentleModeSettings(preset);
            }}
            className="p-3 rounded-xl text-left transition-all hover:ring-2 ring-ascend-500"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <Leaf className="w-5 h-5 mb-1" style={{ color: '#22C55E' }} />
            <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
              Light Touch
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Minimal changes
            </span>
          </button>

          <button
            onClick={() => {
              const preset: GentleModeSettings = {
                enabled: true,
                flexibleStreaks: true,
                streakGracePeriod: 48,
                reducedNotifications: true,
                softerLanguage: true,
                hideIncompleteCount: true,
                autoAdjustOnLowMood: true,
                showOnlyTopPriorities: true,
                celebrateSmallWins: true,
                selfCompassionPrompts: true,
              };
              setSettings(preset);
              updateGentleModeSettings(preset);
            }}
            className="p-3 rounded-xl text-left transition-all hover:ring-2 ring-ascend-500"
            style={{ backgroundColor: 'var(--card-bg)' }}
          >
            <Heart className="w-5 h-5 mb-1" style={{ color: '#EF4444' }} />
            <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
              Full Support
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Maximum care
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// QUICK TOGGLE BUTTON (for header/sidebar)
// ─────────────────────────────────────────────────────────────────────────────────

export function GentleModeQuickToggle() {
  const { gentleModeSettings, updateGentleModeSettings, addToast } = useAscendStore();

  const handleToggle = () => {
    const newEnabled = !gentleModeSettings.enabled;
    updateGentleModeSettings({
      ...gentleModeSettings,
      enabled: newEnabled,
    });
    addToast({
      type: 'info',
      title: newEnabled ? 'Gentle Mode On' : 'Gentle Mode Off',
      message: newEnabled
        ? 'Taking a gentler approach today 💚'
        : 'Standard mode activated',
    });
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all',
        gentleModeSettings.enabled
          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
      title={gentleModeSettings.enabled ? 'Gentle Mode is on' : 'Enable Gentle Mode'}
    >
      <Leaf className="w-4 h-4" />
      <span className="hidden sm:inline">
        {gentleModeSettings.enabled ? 'Gentle' : 'Standard'}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// WALL OF AWFUL HELPER
// ─────────────────────────────────────────────────────────────────────────────────

import { TaskBarrier, TASK_BARRIERS } from '@/types';

interface WallOfAwfulHelperProps {
  isOpen: boolean;
  onClose: () => void;
  taskName: string;
  onBarrierIdentified: (barrier: TaskBarrier, suggestion: string) => void;
}

export function WallOfAwfulHelper({ isOpen, onClose, taskName, onBarrierIdentified }: WallOfAwfulHelperProps) {
  const [selectedBarrier, setSelectedBarrier] = useState<TaskBarrier | null>(null);

  if (!isOpen) return null;

  const handleSelect = (barrier: TaskBarrier) => {
    setSelectedBarrier(barrier);
    onBarrierIdentified(barrier, TASK_BARRIERS[barrier].suggestion);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto rounded-2xl p-6"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          What&apos;s Making This Hard?
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          &quot;{taskName}&quot; seems tough. That&apos;s okay! Let&apos;s figure out what&apos;s in the way.
        </p>

        {!selectedBarrier ? (
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {(Object.entries(TASK_BARRIERS) as [TaskBarrier, typeof TASK_BARRIERS[TaskBarrier]][]).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className="p-3 rounded-xl text-left transition-all hover:ring-2 ring-ascend-500"
                style={{ backgroundColor: 'var(--background-secondary)' }}
              >
                <span className="text-xl block mb-1">{value.icon}</span>
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {value.label}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--ascend-500)/10' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{TASK_BARRIERS[selectedBarrier].icon}</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {TASK_BARRIERS[selectedBarrier].label}
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    💡 {TASK_BARRIERS[selectedBarrier].suggestion}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedBarrier(null)}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-primary)' }}
              >
                Pick Different
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
              >
                Thanks, Got It!
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GentleModeSettingsPanel;
