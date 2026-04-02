'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Morning Check-In Component
// Quick mood/energy/sleep capture + intention setting + AI morning briefing
// Terminal-style pixel UI
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState, useEffect } from 'react';
import { Sun, Moon, Target, Brain, ChevronRight, Check, Loader2 } from 'lucide-react';

interface MorningCheckInProps {
  onComplete?: () => void;
  userName?: string;
  todayHabits?: string[];
  topTasks?: string[];
}

const MOOD_OPTIONS = [
  { value: 1, label: 'Drained', emoji: '😔', color: 'text-red-400 border-red-800 bg-red-950/30' },
  { value: 2, label: 'Low', emoji: '😐', color: 'text-orange-400 border-orange-800 bg-orange-950/30' },
  { value: 3, label: 'Neutral', emoji: '😊', color: 'text-yellow-400 border-yellow-800 bg-yellow-950/30' },
  { value: 4, label: 'Good', emoji: '🙂', color: 'text-green-400 border-green-800 bg-green-950/30' },
  { value: 5, label: 'Fired Up', emoji: '🔥', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/30' },
];

const ENERGY_OPTIONS = [
  { value: 1, label: 'Empty', icon: '▁' },
  { value: 2, label: 'Low', icon: '▂' },
  { value: 3, label: 'Mid', icon: '▄' },
  { value: 4, label: 'High', icon: '▆' },
  { value: 5, label: 'Peak', icon: '█' },
];

const SLEEP_OPTIONS = [
  { value: 1, label: 'Terrible' },
  { value: 2, label: 'Poor' },
  { value: 3, label: 'Ok' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Great' },
];

type Step = 'mood' | 'energy' | 'sleep' | 'intention' | 'briefing' | 'done';

export function MorningCheckIn({ onComplete, userName, todayHabits, topTasks }: MorningCheckInProps) {
  const saveMorning = useMutation(api.dailyCheckIns.saveMorning);

  const [step, setStep] = useState<Step>('mood');
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [intention, setIntention] = useState('');
  const [priorities, setPriorities] = useState<string[]>(['', '', '']);
  const [aiBriefing, setAiBriefing] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['mood', 'energy', 'sleep', 'intention', 'briefing', 'done'];
  const stepIndex = steps.indexOf(step);
  const progress = Math.round(((stepIndex) / (steps.length - 1)) * 100);

  // Generate AI briefing when we reach the briefing step
  useEffect(() => {
    if (step === 'briefing' && !aiBriefing && !isGenerating) {
      generateBriefing();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const generateBriefing = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/morning-briefing/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          energy,
          sleep,
          intention,
          priorities: priorities.filter(Boolean),
          userName,
        }),
      });
      const data = await res.json();
      setAiBriefing(data.briefing || 'Focus on your top priority today. Small wins build momentum.');
    } catch {
      setAiBriefing('Focus on your top priority today. Small wins build momentum.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await saveMorning({
        mood,
        energy,
        sleepQuality: sleep,
        intention: intention || undefined,
        topThreePriorities: priorities.filter(Boolean).length > 0 ? priorities.filter(Boolean) : undefined,
        aiBriefing: aiBriefing || undefined,
      });
      setStep('done');
      setTimeout(() => onComplete?.(), 1500);
    } catch (e) {
      console.error('Failed to save morning check-in:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePriority = (index: number, value: string) => {
    const next = [...priorities];
    next[index] = value;
    setPriorities(next);
  };

  if (step === 'done') {
    return (
      <div className="border border-emerald-900 bg-emerald-950/20 p-6 text-center animate-fade-in">
        <Check className="mx-auto h-6 w-6 text-emerald-400 mb-2" />
        <p className="font-pixel text-[0.65rem] tracking-widest text-emerald-400">MORNING_CHECK_IN_COMPLETE</p>
        <p className="mt-2 font-terminal text-sm text-zinc-400">You&apos;re locked in. Let&apos;s go.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span className="font-pixel text-[0.6rem] tracking-widest text-amber-400">MORNING_CHECK_IN</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-terminal text-xs text-zinc-500">Step {stepIndex + 1}/{steps.length - 1}</span>
          <div className="h-1 w-16 bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-amber-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* STEP: Mood */}
        {step === 'mood' && (
          <div className="animate-fade-in">
            <p className="font-terminal text-sm text-zinc-300 mb-1">How are you feeling this morning?</p>
            <p className="font-terminal text-xs text-zinc-500 mb-4">Be honest — this calibrates your AI briefing.</p>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMood(opt.value)}
                  className={`flex flex-col items-center gap-1 border p-3 transition ${
                    mood === opt.value
                      ? opt.color
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-400">{opt.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <button
              disabled={!mood}
              onClick={() => setStep('energy')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-terminal text-sm text-zinc-200 transition hover:border-amber-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* STEP: Energy */}
        {step === 'energy' && (
          <div className="animate-fade-in">
            <p className="font-terminal text-sm text-zinc-300 mb-1">Energy level right now?</p>
            <p className="font-terminal text-xs text-zinc-500 mb-4">This helps calibrate task difficulty for today.</p>
            <div className="flex gap-2">
              {ENERGY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setEnergy(opt.value)}
                  className={`flex-1 flex flex-col items-center gap-1 border p-3 transition ${
                    energy === opt.value
                      ? 'border-orange-700 bg-orange-950/30 text-orange-400'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 text-zinc-400'
                  }`}
                >
                  <span className="font-terminal text-2xl leading-none">{opt.icon}</span>
                  <span className="font-pixel text-[0.35rem] tracking-widest">{opt.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <button
              disabled={!energy}
              onClick={() => setStep('sleep')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-terminal text-sm text-zinc-200 transition hover:border-amber-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* STEP: Sleep */}
        {step === 'sleep' && (
          <div className="animate-fade-in">
            <p className="font-terminal text-sm text-zinc-300 mb-1">How did you sleep?</p>
            <p className="font-terminal text-xs text-zinc-500 mb-4">Sleep quality shapes your entire day.</p>
            <div className="flex gap-2">
              {SLEEP_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSleep(opt.value)}
                  className={`flex-1 flex flex-col items-center gap-1.5 border p-3 transition ${
                    sleep === opt.value
                      ? 'border-violet-700 bg-violet-950/30 text-violet-400'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 text-zinc-400'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span className="font-pixel text-[0.35rem] tracking-widest">{opt.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <button
              disabled={!sleep}
              onClick={() => setStep('intention')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-terminal text-sm text-zinc-200 transition hover:border-amber-700 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* STEP: Intention + Priorities */}
        {step === 'intention' && (
          <div className="animate-fade-in">
            {/* Today's scheduled habits & tasks context */}
            {(todayHabits?.length || topTasks?.length) ? (
              <div className="mb-4 border border-zinc-800 bg-zinc-900/30 p-3 space-y-2">
                <p className="font-pixel text-[0.5rem] tracking-widest text-zinc-500">TODAY&apos;S LINEUP</p>
                {todayHabits && todayHabits.length > 0 && (
                  <div>
                    <p className="font-terminal text-xs text-zinc-500 mb-1">Habits:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {todayHabits.slice(0, 5).map((h, i) => (
                        <span key={i} className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 font-terminal text-xs text-zinc-300">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
                {topTasks && topTasks.length > 0 && (
                  <div>
                    <p className="font-terminal text-xs text-zinc-500 mb-1">Top tasks:</p>
                    <div className="space-y-1">
                      {topTasks.slice(0, 3).map((t, i) => (
                        <p key={i} className="font-terminal text-xs text-zinc-300">
                          <Target className="inline h-3 w-3 text-orange-500 mr-1" />{t}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            <p className="font-terminal text-sm text-zinc-300 mb-1">Set your intention for today</p>
            <p className="font-terminal text-xs text-zinc-500 mb-3">One sentence. What matters most?</p>
            <input
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="e.g. Stay focused on deep work and exercise"
              className="w-full border border-zinc-800 bg-black px-3 py-2.5 font-terminal text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
            />

            <p className="mt-4 font-terminal text-sm text-zinc-300 mb-1">Top 3 priorities <span className="text-zinc-500">(optional)</span></p>
            <div className="space-y-2">
              {priorities.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                  <input
                    value={p}
                    onChange={(e) => updatePriority(i, e.target.value)}
                    placeholder={`Priority ${i + 1}`}
                    className="flex-1 border border-zinc-800 bg-black px-3 py-2 font-terminal text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('briefing')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-amber-700 bg-amber-950/30 px-4 py-2.5 font-terminal text-sm text-amber-400 transition hover:bg-amber-950/50"
            >
              <Brain className="h-3.5 w-3.5" /> Generate AI Briefing
            </button>
          </div>
        )}

        {/* STEP: AI Briefing */}
        {step === 'briefing' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-pixel text-[0.6rem] tracking-widest text-amber-400">AI_MORNING_BRIEFING</span>
            </div>

            {isGenerating ? (
              <div className="border border-amber-900/40 bg-amber-950/10 p-4 flex items-center gap-3">
                <Loader2 className="h-4 w-4 text-amber-500 animate-spin" />
                <div>
                  <p className="font-terminal text-sm text-amber-400 animate-pulse">Generating your briefing...</p>
                  <p className="font-terminal text-xs text-zinc-500">Analyzing mood, energy, sleep, and priorities</p>
                </div>
              </div>
            ) : (
              <div className="border border-amber-900/40 bg-amber-950/10 p-4">
                <p className="font-terminal text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">{aiBriefing}</p>
              </div>
            )}

            {/* Summary */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="border border-zinc-800 bg-zinc-900/50 p-2 text-center">
                <p className="font-pixel text-[0.55rem] tracking-widest text-zinc-500">MOOD</p>
                <p className="font-terminal text-lg">{MOOD_OPTIONS[mood - 1]?.emoji}</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/50 p-2 text-center">
                <p className="font-pixel text-[0.55rem] tracking-widest text-zinc-500">ENERGY</p>
                <p className="font-terminal text-lg text-orange-400">{ENERGY_OPTIONS[energy - 1]?.icon}</p>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/50 p-2 text-center">
                <p className="font-pixel text-[0.55rem] tracking-widest text-zinc-500">SLEEP</p>
                <p className="font-terminal text-sm text-violet-400">{SLEEP_OPTIONS[sleep - 1]?.label}</p>
              </div>
            </div>

            <button
              disabled={isGenerating || isSaving}
              onClick={handleFinish}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-emerald-700 bg-emerald-950/30 px-4 py-2.5 font-terminal text-sm text-emerald-400 transition hover:bg-emerald-950/50 disabled:opacity-40"
            >
              {isSaving ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
              ) : (
                <><Check className="h-3.5 w-3.5" /> Lock In & Start Day</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
