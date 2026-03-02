// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Mood Check-In Component
// Quick and gentle mood logging with factors and notes
// Designed for anxiety-friendly, low-pressure tracking
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import {
  MoodLevel,
  EnergyLevel,
  MoodEntry,
  MoodFactor,
  MOOD_EMOJIS,
  ENERGY_LABELS,
  MOOD_FACTORS_INFO,
  SELF_COMPASSION_PROMPTS,
} from '@/types';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface MoodCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<MoodEntry, 'id'>) => void;
  existingEntry?: MoodEntry;
}

type CheckInStep = 'mood' | 'energy' | 'factors' | 'notes' | 'complete';

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function MoodCheckIn({ isOpen, onClose, onSubmit, existingEntry }: MoodCheckInProps) {
  const [step, setStep] = useState<CheckInStep>('mood');
  const [mood, setMood] = useState<MoodLevel>(existingEntry?.mood || 3);
  const [energy, setEnergy] = useState<EnergyLevel | undefined>(existingEntry?.energy);
  const [factors, setFactors] = useState<MoodFactor[]>(existingEntry?.factors || []);
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [sleepHours, setSleepHours] = useState<number | undefined>(existingEntry?.sleepHours);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    onSubmit({
      date: todayStr,
      timestamp: new Date().toISOString(),
      mood,
      energy,
      factors: factors.length > 0 ? factors : undefined,
      notes: notes.trim() || undefined,
      sleepHours,
    });
    setStep('complete');
  };

  const handleComplete = () => {
    onClose();
    // Reset for next time
    setTimeout(() => {
      setStep('mood');
      setMood(3);
      setEnergy(undefined);
      setFactors([]);
      setNotes('');
    }, 300);
  };

  const toggleFactor = (factor: MoodFactor) => {
    setFactors(prev =>
      prev.includes(factor)
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  const getCompassionMessage = () => {
    if (mood <= 2) {
      const messages = SELF_COMPASSION_PROMPTS.lowMoodDay;
      return messages[Math.floor(Math.random() * messages.length)];
    }
    const messages = SELF_COMPASSION_PROMPTS.dailyEncouragement;
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {step === 'complete' ? '✨ Logged!' : 'How are you feeling?'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step: Mood */}
          {step === 'mood' && (
            <div className="space-y-6">
              <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                No right or wrong answer—just how you&apos;re feeling right now.
              </p>

              <div className="flex justify-center gap-2">
                {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setMood(level)}
                    className={cn(
                      'w-14 h-14 rounded-xl text-2xl transition-all hover:scale-110',
                      mood === level
                        ? 'ring-2 ring-offset-2 scale-110'
                        : 'opacity-50 hover:opacity-100'
                    )}
                    style={{
                      backgroundColor: MOOD_EMOJIS[level].color + '20',
                      ['--tw-ring-color' as string]: MOOD_EMOJIS[level].color,
                    }}
                  >
                    {MOOD_EMOJIS[level].emoji}
                  </button>
                ))}
              </div>

              <div className="text-center">
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: MOOD_EMOJIS[mood].color + '20',
                    color: MOOD_EMOJIS[mood].color,
                  }}
                >
                  {MOOD_EMOJIS[mood].label}
                </span>
              </div>

              <button
                onClick={() => setStep('energy')}
                className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleSubmit}
                className="w-full py-2 text-sm transition-all hover:underline"
                style={{ color: 'var(--text-secondary)' }}
              >
                Just log mood, skip details
              </button>
            </div>
          )}

          {/* Step: Energy */}
          {step === 'energy' && (
            <div className="space-y-6">
              <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                How&apos;s your energy level?
              </p>

              <div className="space-y-2">
                {([1, 2, 3, 4, 5] as EnergyLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setEnergy(level)}
                    className={cn(
                      'w-full p-3 rounded-xl text-left transition-all flex items-center justify-between',
                      energy === level
                        ? 'ring-2 ring-ascend-500'
                        : ''
                    )}
                    style={{
                      backgroundColor: energy === level
                        ? 'var(--ascend-500)/10'
                        : 'var(--background-secondary)',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>
                      {ENERGY_LABELS[level]}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-4 rounded-sm"
                          style={{
                            backgroundColor: i < level
                              ? 'var(--ascend-500)'
                              : 'var(--border)',
                          }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('mood')}
                  className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-primary)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep('factors')}
                  className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-2 text-sm transition-all hover:underline"
                style={{ color: 'var(--text-secondary)' }}
              >
                Skip remaining steps
              </button>
            </div>
          )}

          {/* Step: Factors */}
          {step === 'factors' && (
            <div className="space-y-4">
              <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                What&apos;s affecting your day? (Select any that apply)
              </p>

              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {(Object.keys(MOOD_FACTORS_INFO) as MoodFactor[]).map((factor) => {
                  const info = MOOD_FACTORS_INFO[factor];
                  const isSelected = factors.includes(factor);
                  return (
                    <button
                      key={factor}
                      onClick={() => toggleFactor(factor)}
                      className={cn(
                        'p-2 rounded-xl text-center transition-all',
                        isSelected ? 'ring-2 ring-ascend-500' : ''
                      )}
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--ascend-500)/10'
                          : 'var(--background-secondary)',
                      }}
                    >
                      <span className="text-xl block">{info.icon}</span>
                      <span
                        className="text-xs block mt-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {info.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('energy')}
                  className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-primary)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setStep('notes')}
                  className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step: Notes */}
          {step === 'notes' && (
            <div className="space-y-4">
              <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                Anything else on your mind? (Optional)
              </p>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="A few words about how you're feeling..."
                rows={4}
                className="w-full p-3 rounded-xl text-sm resize-none"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              />

              {/* Sleep tracking */}
              <div>
                <label className="text-sm block mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Hours of sleep last night (optional)
                </label>
                <div className="flex gap-2">
                  {[4, 5, 6, 7, 8, 9, 10].map((hours) => (
                    <button
                      key={hours}
                      onClick={() => setSleepHours(hours)}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-sm transition-all',
                        sleepHours === hours ? 'ring-2 ring-ascend-500' : ''
                      )}
                      style={{
                        backgroundColor: sleepHours === hours
                          ? 'var(--ascend-500)/10'
                          : 'var(--background-secondary)',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {hours}h
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('factors')}
                  className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-primary)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-xl font-medium transition-all"
                  style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
                >
                  Save Entry
                </button>
              </div>
            </div>
          )}

          {/* Step: Complete */}
          {step === 'complete' && (
            <div className="space-y-6 text-center">
              <div className="text-6xl">
                {MOOD_EMOJIS[mood].emoji}
              </div>

              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Mood Logged!
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Thank you for checking in with yourself.
                </p>
              </div>

              {/* Self-compassion message */}
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: 'var(--ascend-500)/5' }}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 mt-0.5" style={{ color: 'var(--ascend-500)' }} />
                  <p className="text-sm text-left" style={{ color: 'var(--text-secondary)' }}>
                    {getCompassionMessage()}
                  </p>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-3 rounded-xl font-medium transition-all"
                style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {step !== 'complete' && (
          <div className="px-6 pb-4">
            <div className="flex gap-1">
              {['mood', 'energy', 'factors', 'notes'].map((s, i) => {
                const steps = ['mood', 'energy', 'factors', 'notes'];
                const currentIndex = steps.indexOf(step);
                const isActive = i <= currentIndex;
                return (
                  <div
                    key={s}
                    className="flex-1 h-1 rounded-full transition-all"
                    style={{
                      backgroundColor: isActive
                        ? 'var(--ascend-500)'
                        : 'var(--border)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MoodCheckIn;
