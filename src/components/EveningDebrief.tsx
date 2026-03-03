'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Evening Debrief Component
// End-of-day reflection: mood, wins, challenges, gratitude, tomorrow focus
// Terminal-style pixel UI
// ═══════════════════════════════════════════════════════════════════════════════

import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useState, useEffect } from 'react';
import { Moon, Star, Trophy, AlertTriangle, Heart, ArrowRight, Check, Loader2, ChevronRight } from 'lucide-react';

interface EveningDebriefProps {
  onComplete?: () => void;
  userName?: string;
  tasksCompleted?: number;
  habitsCompleted?: number;
}

const MOOD_OPTIONS = [
  { value: 1, label: 'Rough', emoji: '😞' },
  { value: 2, label: 'Meh', emoji: '😕' },
  { value: 3, label: 'OK', emoji: '😌' },
  { value: 4, label: 'Good', emoji: '😊' },
  { value: 5, label: 'Great', emoji: '😁' },
];

const RATING_OPTIONS = [
  { value: 1, label: 'Lost', color: 'border-red-800 bg-red-950/30 text-red-400' },
  { value: 2, label: 'Struggled', color: 'border-orange-800 bg-orange-950/30 text-orange-400' },
  { value: 3, label: 'Decent', color: 'border-yellow-800 bg-yellow-950/30 text-yellow-400' },
  { value: 4, label: 'Productive', color: 'border-green-800 bg-green-950/30 text-green-400' },
  { value: 5, label: 'Crushed it', color: 'border-emerald-800 bg-emerald-950/30 text-emerald-400' },
];

type Step = 'rating' | 'mood' | 'wins' | 'gratitude' | 'tomorrow' | 'reflection' | 'done';

export function EveningDebrief({ onComplete, userName, tasksCompleted, habitsCompleted }: EveningDebriefProps) {
  const saveEvening = useMutation(api.dailyCheckIns.saveEvening);

  const [step, setStep] = useState<Step>('rating');
  const [dayRating, setDayRating] = useState(0);
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(3);
  const [biggestWin, setBiggestWin] = useState('');
  const [biggestChallenge, setBiggestChallenge] = useState('');
  const [gratitude, setGratitude] = useState<string[]>(['', '', '']);
  const [tomorrowFocus, setTomorrowFocus] = useState('');
  const [aiReflection, setAiReflection] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const steps: Step[] = ['rating', 'mood', 'wins', 'gratitude', 'tomorrow', 'reflection', 'done'];
  const stepIndex = steps.indexOf(step);
  const progress = Math.round((stepIndex / (steps.length - 1)) * 100);

  useEffect(() => {
    if (step === 'reflection' && !aiReflection && !isGenerating) {
      generateReflection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const generateReflection = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/evening-reflection/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayRating,
          mood,
          energy,
          biggestWin,
          biggestChallenge,
          gratitude: gratitude.filter(Boolean),
          tomorrowFocus,
          tasksCompleted,
          habitsCompleted,
          userName,
        }),
      });
      const data = await res.json();
      setAiReflection(data.reflection || 'Every day you show up is a win. Rest well — tomorrow is another chance to grow.');
    } catch {
      setAiReflection('Every day you show up is a win. Rest well — tomorrow is another chance to grow.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      await saveEvening({
        mood,
        energy,
        dayRating,
        biggestWin: biggestWin || undefined,
        biggestChallenge: biggestChallenge || undefined,
        gratitude: gratitude.filter(Boolean).length > 0 ? gratitude.filter(Boolean) : undefined,
        tomorrowFocus: tomorrowFocus || undefined,
        aiReflection: aiReflection || undefined,
      });
      setStep('done');
      setTimeout(() => onComplete?.(), 1500);
    } catch (e) {
      console.error('Failed to save evening debrief:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const updateGratitude = (index: number, value: string) => {
    const next = [...gratitude];
    next[index] = value;
    setGratitude(next);
  };

  if (step === 'done') {
    return (
      <div className="border border-violet-900 bg-violet-950/20 p-6 text-center animate-fade-in">
        <Moon className="mx-auto h-6 w-6 text-violet-400 mb-2" />
        <p className="font-pixel text-[0.5rem] tracking-widest text-violet-400">EVENING_DEBRIEF_COMPLETE</p>
        <p className="mt-2 font-terminal text-sm text-zinc-400">Day logged. Rest up — tomorrow awaits.</p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Moon className="h-3.5 w-3.5 text-violet-500" />
          <span className="font-pixel text-[0.4rem] tracking-widest text-violet-400">EVENING_DEBRIEF</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-terminal text-xs text-zinc-500">Step {stepIndex + 1}/{steps.length - 1}</span>
          <div className="h-1 w-16 bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-violet-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* STEP: Day Rating */}
        {step === 'rating' && (
          <div className="animate-fade-in">
            <p className="font-terminal text-sm text-zinc-300 mb-1">How would you rate today?</p>
            <p className="font-terminal text-xs text-zinc-500 mb-4">Overall productivity and fulfillment.</p>
            <div className="grid grid-cols-5 gap-2">
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDayRating(opt.value)}
                  className={`flex flex-col items-center gap-1 border p-3 transition ${
                    dayRating === opt.value
                      ? opt.color
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <Star className={`h-5 w-5 ${dayRating === opt.value ? '' : 'text-zinc-600'}`} />
                  <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-400">{opt.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <button
              disabled={!dayRating}
              onClick={() => setStep('mood')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-terminal text-sm text-zinc-200 transition hover:border-violet-700 hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* STEP: Evening Mood */}
        {step === 'mood' && (
          <div className="animate-fade-in">
            <p className="font-terminal text-sm text-zinc-300 mb-1">How are you feeling now?</p>
            <p className="font-terminal text-xs text-zinc-500 mb-4">End-of-day emotional state.</p>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMood(opt.value)}
                  className={`flex-1 flex flex-col items-center gap-1 border p-3 transition ${
                    mood === opt.value
                      ? 'border-violet-700 bg-violet-950/30 text-violet-400'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-400">{opt.label.toUpperCase()}</span>
                </button>
              ))}
            </div>
            <button
              disabled={!mood}
              onClick={() => setStep('wins')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-terminal text-sm text-zinc-200 transition hover:border-violet-700 hover:text-violet-400 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* STEP: Wins & Challenges */}
        {step === 'wins' && (
          <div className="animate-fade-in">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                  <p className="font-terminal text-sm text-zinc-300">Biggest win today</p>
                </div>
                <input
                  value={biggestWin}
                  onChange={(e) => setBiggestWin(e.target.value)}
                  placeholder="What went well? Even something small counts."
                  className="w-full border border-zinc-800 bg-black px-3 py-2.5 font-terminal text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                  <p className="font-terminal text-sm text-zinc-300">Biggest challenge</p>
                </div>
                <input
                  value={biggestChallenge}
                  onChange={(e) => setBiggestChallenge(e.target.value)}
                  placeholder="What held you back?"
                  className="w-full border border-zinc-800 bg-black px-3 py-2.5 font-terminal text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={() => setStep('gratitude')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-terminal text-sm text-zinc-200 transition hover:border-violet-700 hover:text-violet-400"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* STEP: Gratitude */}
        {step === 'gratitude' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <p className="font-terminal text-sm text-zinc-300">3 things you&apos;re grateful for</p>
            </div>
            <p className="font-terminal text-xs text-zinc-500 mb-3">Gratitude rewires the brain for growth.</p>
            <div className="space-y-2">
              {gratitude.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-terminal text-sm text-zinc-600">{i + 1}.</span>
                  <input
                    value={g}
                    onChange={(e) => updateGratitude(i, e.target.value)}
                    placeholder={i === 0 ? 'Something you appreciate...' : ''}
                    className="flex-1 border border-zinc-800 bg-black px-3 py-2 font-terminal text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('tomorrow')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-zinc-700 bg-zinc-900 px-4 py-2.5 font-terminal text-sm text-zinc-200 transition hover:border-violet-700 hover:text-violet-400"
            >
              Continue <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* STEP: Tomorrow Focus */}
        {step === 'tomorrow' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRight className="h-3.5 w-3.5 text-cyan-500" />
              <p className="font-terminal text-sm text-zinc-300">What&apos;s your #1 focus for tomorrow?</p>
            </div>
            <p className="font-terminal text-xs text-zinc-500 mb-3">Setting this now gives you a head start.</p>
            <input
              value={tomorrowFocus}
              onChange={(e) => setTomorrowFocus(e.target.value)}
              placeholder="e.g. Finish the proposal draft"
              className="w-full border border-zinc-800 bg-black px-3 py-2.5 font-terminal text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
            />

            {/* Quick stats */}
            {(tasksCompleted !== undefined || habitsCompleted !== undefined) && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {tasksCompleted !== undefined && (
                  <div className="border border-zinc-800 bg-zinc-900/50 p-2 text-center">
                    <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-500">TASKS_DONE</p>
                    <p className="font-terminal text-xl text-zinc-200">{tasksCompleted}</p>
                  </div>
                )}
                {habitsCompleted !== undefined && (
                  <div className="border border-zinc-800 bg-zinc-900/50 p-2 text-center">
                    <p className="font-pixel text-[0.3rem] tracking-widest text-zinc-500">HABITS_DONE</p>
                    <p className="font-terminal text-xl text-zinc-200">{habitsCompleted}</p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setStep('reflection')}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-violet-700 bg-violet-950/30 px-4 py-2.5 font-terminal text-sm text-violet-400 transition hover:bg-violet-950/50"
            >
              <Moon className="h-3.5 w-3.5" /> Generate AI Reflection
            </button>
          </div>
        )}

        {/* STEP: AI Reflection */}
        {step === 'reflection' && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <Moon className="h-3.5 w-3.5 text-violet-500" />
              <span className="font-pixel text-[0.4rem] tracking-widest text-violet-400">AI_EVENING_REFLECTION</span>
            </div>

            {isGenerating ? (
              <div className="border border-violet-900/40 bg-violet-950/10 p-4 flex items-center gap-3">
                <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                <div>
                  <p className="font-terminal text-sm text-violet-400 animate-pulse">Reflecting on your day...</p>
                  <p className="font-terminal text-xs text-zinc-500">Processing wins, challenges, and patterns</p>
                </div>
              </div>
            ) : (
              <div className="border border-violet-900/40 bg-violet-950/10 p-4">
                <p className="font-terminal text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">{aiReflection}</p>
              </div>
            )}

            {/* Summary line */}
            <div className="mt-4 flex items-center gap-4 border border-zinc-800 bg-zinc-900/50 px-3 py-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="font-terminal text-xs text-zinc-400">Day: {RATING_OPTIONS[dayRating - 1]?.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm">{MOOD_OPTIONS[mood - 1]?.emoji}</span>
                <span className="font-terminal text-xs text-zinc-400">{MOOD_OPTIONS[mood - 1]?.label}</span>
              </div>
              {biggestWin && (
                <div className="flex items-center gap-1 min-w-0">
                  <Trophy className="h-3 w-3 text-amber-500 shrink-0" />
                  <span className="font-terminal text-xs text-zinc-400 truncate">{biggestWin}</span>
                </div>
              )}
            </div>

            <button
              disabled={isGenerating || isSaving}
              onClick={handleFinish}
              className="mt-4 flex w-full items-center justify-center gap-2 border border-violet-700 bg-violet-950/30 px-4 py-2.5 font-terminal text-sm text-violet-400 transition hover:bg-violet-950/50 disabled:opacity-40"
            >
              {isSaving ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...</>
              ) : (
                <><Check className="h-3.5 w-3.5" /> Close Out Day</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
