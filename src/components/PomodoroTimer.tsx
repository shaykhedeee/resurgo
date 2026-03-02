// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Pomodoro Timer Component
// Focus timer with work/break intervals
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain,
  Settings,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

type TimerMode = 'work' | 'short_break' | 'long_break';

interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  soundEnabled: boolean;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
};

export function PomodoroTimer() {
  const { addToast, addXP } = useAscendStore();
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);

  // Get duration based on current mode
  const getDuration = useCallback((timerMode: TimerMode): number => {
    switch (timerMode) {
      case 'work': return settings.workDuration * 60;
      case 'short_break': return settings.shortBreakDuration * 60;
      case 'long_break': return settings.longBreakDuration * 60;
    }
  }, [settings]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        if (mode === 'work') {
          setTotalFocusMinutes(prev => prev + 1/60);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode]);

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(getDuration(mode));
  }, [mode, getDuration]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play sound if enabled
    if (settings.soundEnabled) {
      // Audio notification (would need actual audio file)
      try {
        const audio = new Audio('/sounds/timer-complete.mp3');
        audio.play().catch(() => {});
      } catch {}
    }

    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Award XP for completing a focus session
      addXP(25, 'Completed Pomodoro session');
      addToast({
        type: 'success',
        title: 'Focus Session Complete! +25 XP',
        message: `Great work! You've completed ${newSessionsCompleted} sessions today.`,
      });

      // Determine next break type
      if (newSessionsCompleted % settings.sessionsBeforeLongBreak === 0) {
        setMode('long_break');
        addToast({
          type: 'info',
          title: 'Time for a Long Break!',
          message: 'You earned it! Take 15-20 minutes to recharge.',
        });
      } else {
        setMode('short_break');
      }

      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    } else {
      // Break completed
      setMode('work');
      addToast({
        type: 'info',
        title: 'Break Over!',
        message: 'Ready to focus again?',
      });

      // Auto-start work if enabled
      if (settings.autoStartWork) {
        setTimeout(() => setIsRunning(true), 1000);
      }
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const skipToNext = () => {
    if (mode === 'work') {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      if (newSessions % settings.sessionsBeforeLongBreak === 0) {
        setMode('long_break');
      } else {
        setMode('short_break');
      }
    } else {
      setMode('work');
    }
    setIsRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    const total = getDuration(mode);
    return ((total - timeLeft) / total) * 100;
  };

  const getModeColor = (): string => {
    switch (mode) {
      case 'work': return 'from-ascend-500 to-ascend-600';
      case 'short_break': return 'from-green-500 to-emerald-600';
      case 'long_break': return 'from-blue-500 to-indigo-600';
    }
  };

  const getModeLabel = (): string => {
    switch (mode) {
      case 'work': return 'Focus Time';
      case 'short_break': return 'Short Break';
      case 'long_break': return 'Long Break';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'work': return <Brain className="w-6 h-6" />;
      case 'short_break': return <Coffee className="w-6 h-6" />;
      case 'long_break': return <Coffee className="w-6 h-6" />;
    }
  };

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br",
            getModeColor()
          )}>
            {getModeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-themed">{getModeLabel()}</h3>
            <p className="text-xs text-themed-muted">
              Session {sessionsCompleted + 1} of {settings.sessionsBeforeLongBreak}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-themed-muted
                     min-w-[44px] min-h-[44px] flex items-center justify-center
                     focus-visible:ring-2 focus-visible:ring-ascend-500"
            title={settings.soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
            aria-label={settings.soundEnabled ? 'Mute timer sounds' : 'Unmute timer sounds'}
            aria-pressed={settings.soundEnabled}
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5" aria-hidden="true" /> : <VolumeX className="w-5 h-5" aria-hidden="true" />}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-themed-muted
                     min-w-[44px] min-h-[44px] flex items-center justify-center
                     focus-visible:ring-2 focus-visible:ring-ascend-500"
            title="Timer settings"
            aria-label="Open timer settings"
            aria-expanded={showSettings}
          >
            <Settings className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        {(['work', 'short_break', 'long_break'] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setIsRunning(false);
            }}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
              mode === m
                ? `bg-gradient-to-r ${getModeColor()} text-white`
                : "bg-white/5 text-themed-muted hover:bg-white/10"
            )}
          >
            {m === 'work' ? 'Focus' : m === 'short_break' ? 'Short' : 'Long'}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative py-8">
        {/* Circular Progress */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/10"
            />
            {/* Progress circle */}
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * getProgress()) / 100}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={mode === 'work' ? '#14B899' : mode === 'short_break' ? '#22C55E' : '#3B82F6'} />
                <stop offset="100%" stopColor={mode === 'work' ? '#0D9488' : mode === 'short_break' ? '#10B981' : '#6366F1'} />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-mono font-bold text-themed">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-themed-muted mt-1">
              {isRunning ? 'Running' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4" role="group" aria-label="Timer controls">
        <button
          onClick={resetTimer}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-themed-muted
                   min-w-[48px] min-h-[48px] flex items-center justify-center
                   focus-visible:ring-2 focus-visible:ring-ascend-500"
          title="Reset timer"
          aria-label="Reset timer to start"
        >
          <RotateCcw className="w-5 h-5" aria-hidden="true" />
        </button>
        
        <button
          onClick={toggleTimer}
          className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
            "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2",
            `bg-gradient-to-br ${getModeColor()} hover:opacity-90 shadow-lg`,
            mode === 'work' ? 'shadow-ascend-500/25' : mode === 'short_break' ? 'shadow-green-500/25' : 'shadow-blue-500/25'
          )}
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? (
            <Pause className="w-8 h-8 text-white" aria-hidden="true" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" aria-hidden="true" />
          )}
        </button>

        <button
          onClick={skipToNext}
          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-themed-muted
                   min-w-[48px] min-h-[48px] flex items-center justify-center
                   focus-visible:ring-2 focus-visible:ring-ascend-500"
          title="Skip to next session"
          aria-label={mode === 'work' ? 'Skip to break' : 'Skip to focus session'}
        >
          <ChevronUp className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-themed">{sessionsCompleted}</p>
            <p className="text-xs text-themed-muted">Sessions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-ascend-400">
              {Math.round(totalFocusMinutes)}m
            </p>
            <p className="text-xs text-themed-muted">Focus Time</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold-400">
              {sessionsCompleted * 25}
            </p>
            <p className="text-xs text-themed-muted">XP Earned</p>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
          <h4 className="font-medium text-themed text-sm">Timer Settings</h4>
          
          {/* Duration Settings */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label id="focus-duration-label" className="text-xs text-themed-muted block mb-2">Focus (min)</label>
              <div className="flex items-center gap-2" role="group" aria-labelledby="focus-duration-label">
                <button
                  onClick={() => setSettings(s => ({ ...s, workDuration: Math.max(5, s.workDuration - 5) }))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Decrease focus duration"
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-themed font-medium w-8 text-center" aria-live="polite">{settings.workDuration}</span>
                <button
                  onClick={() => setSettings(s => ({ ...s, workDuration: Math.min(60, s.workDuration + 5) }))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Increase focus duration"
                >
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div>
              <label id="short-break-label" className="text-xs text-themed-muted block mb-2">Short (min)</label>
              <div className="flex items-center gap-2" role="group" aria-labelledby="short-break-label">
                <button
                  onClick={() => setSettings(s => ({ ...s, shortBreakDuration: Math.max(1, s.shortBreakDuration - 1) }))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Decrease short break duration"
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-themed font-medium w-8 text-center" aria-live="polite">{settings.shortBreakDuration}</span>
                <button
                  onClick={() => setSettings(s => ({ ...s, shortBreakDuration: Math.min(15, s.shortBreakDuration + 1) }))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Increase short break duration"
                >
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div>
              <label id="long-break-label" className="text-xs text-themed-muted block mb-2">Long (min)</label>
              <div className="flex items-center gap-2" role="group" aria-labelledby="long-break-label">
                <button
                  onClick={() => setSettings(s => ({ ...s, longBreakDuration: Math.max(5, s.longBreakDuration - 5) }))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Decrease long break duration"
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="text-themed font-medium w-8 text-center" aria-live="polite">{settings.longBreakDuration}</span>
                <button
                  onClick={() => setSettings(s => ({ ...s, longBreakDuration: Math.min(30, s.longBreakDuration + 5) }))}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 min-w-[32px] min-h-[32px] flex items-center justify-center"
                  aria-label="Increase long break duration"
                >
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Toggle Settings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="auto-start-breaks" className="text-sm text-themed-secondary">Auto-start breaks</label>
              <button
                id="auto-start-breaks"
                role="switch"
                aria-checked={settings.autoStartBreaks}
                onClick={() => setSettings(s => ({ ...s, autoStartBreaks: !s.autoStartBreaks }))}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative",
                  "focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2",
                  settings.autoStartBreaks ? "bg-ascend-500" : "bg-white/20"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                  settings.autoStartBreaks ? "left-5" : "left-1"
                )} aria-hidden="true" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="auto-start-work" className="text-sm text-themed-secondary">Auto-start work</label>
              <button
                id="auto-start-work"
                role="switch"
                aria-checked={settings.autoStartWork}
                onClick={() => setSettings(s => ({ ...s, autoStartWork: !s.autoStartWork }))}
                className={cn(
                  "w-10 h-6 rounded-full transition-colors relative",
                  "focus-visible:ring-2 focus-visible:ring-ascend-500 focus-visible:ring-offset-2",
                  settings.autoStartWork ? "bg-ascend-500" : "bg-white/20"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full bg-white absolute top-1 transition-all",
                  settings.autoStartWork ? "left-5" : "left-1"
                )} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
