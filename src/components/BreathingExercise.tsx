// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Breathing Exercise Component
// Animated, guided breathing exercises for anxiety and stress relief
// Features: Visual animation, audio cues, multiple exercise types
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Check, Sparkles } from 'lucide-react';
import { BreathingExercise as BreathingExerciseType } from '@/types';
import { useAscendStore } from '@/lib/store';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface BreathingExerciseProps {
  exercise: BreathingExerciseType;
  isOpen: boolean;
  onClose: () => void;
}

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2' | 'complete';

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function BreathingExercise({ exercise, isOpen, onClose }: BreathingExerciseProps) {
  const { addXP, addToast } = useAscendStore();
  
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(exercise.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get phase duration
  const getPhaseDuration = useCallback((p: BreathPhase): number => {
    switch (p) {
      case 'inhale': return exercise.inhale;
      case 'hold1': return exercise.hold1 || 0;
      case 'exhale': return exercise.exhale;
      case 'hold2': return exercise.hold2 || 0;
      default: return 0;
    }
  }, [exercise]);

  // Get next phase
  const getNextPhase = useCallback((currentPhase: BreathPhase): BreathPhase => {
    switch (currentPhase) {
      case 'inhale':
        return exercise.hold1 ? 'hold1' : 'exhale';
      case 'hold1':
        return 'exhale';
      case 'exhale':
        return exercise.hold2 ? 'hold2' : 'inhale';
      case 'hold2':
        return 'inhale';
      default:
        return 'inhale';
    }
  }, [exercise]);

  // Play sound effect
  const playSound = useCallback((type: 'inhale' | 'exhale' | 'hold' | 'complete') => {
    if (!soundEnabled) return;
    
    // Simple audio feedback using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different tones for different phases
      switch (type) {
        case 'inhale':
          oscillator.frequency.value = 440; // A4
          break;
        case 'exhale':
          oscillator.frequency.value = 330; // E4
          break;
        case 'hold':
          oscillator.frequency.value = 392; // G4
          break;
        case 'complete':
          oscillator.frequency.value = 523; // C5
          break;
      }
      
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start(audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // Audio not supported, ignore
    }
  }, [soundEnabled]);

  // Timer effect
  useEffect(() => {
    if (!isRunning || hasCompleted) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Move to next phase
          const nextPhase = getNextPhase(phase);
          
          // Check if we completed a cycle
          if (phase === (exercise.hold2 ? 'hold2' : 'exhale')) {
            if (currentCycle >= exercise.cycles) {
              // Exercise complete!
              setIsRunning(false);
              setHasCompleted(true);
              setPhase('complete');
              playSound('complete');
              
              // Award XP
              addXP(15, 'Completed breathing exercise');
              addToast({
                type: 'success',
                title: 'Breathing Complete! +15 XP',
                message: `Great job completing ${exercise.name}!`,
              });
              
              return 0;
            }
            setCurrentCycle(c => c + 1);
          }
          
          setPhase(nextPhase);
          playSound(nextPhase === 'inhale' ? 'inhale' : nextPhase === 'exhale' ? 'exhale' : 'hold');
          return getPhaseDuration(nextPhase);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, phase, currentCycle, exercise, getNextPhase, getPhaseDuration, playSound, hasCompleted, addXP, addToast]);

  // Start exercise
  const handleStart = () => {
    setIsRunning(true);
    playSound('inhale');
  };

  // Pause/Resume
  const togglePause = () => {
    setIsRunning(!isRunning);
  };

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setPhase('inhale');
    setSecondsLeft(exercise.inhale);
    setCurrentCycle(1);
    setHasCompleted(false);
  };

  // Close handler
  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  // Calculate circle scale based on phase
  const getCircleScale = () => {
    if (hasCompleted) return 1;
    
    const totalDuration = getPhaseDuration(phase);
    const progress = (totalDuration - secondsLeft) / totalDuration;
    
    switch (phase) {
      case 'inhale':
        return 0.5 + (progress * 0.5); // 0.5 -> 1.0
      case 'hold1':
      case 'hold2':
        return phase === 'hold1' ? 1 : 0.5; // Stay at current size
      case 'exhale':
        return 1 - (progress * 0.5); // 1.0 -> 0.5
      default:
        return 1;
    }
  };

  // Get instruction text
  const getInstruction = () => {
    if (hasCompleted) return 'Complete!';
    
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold1':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'hold2':
        return 'Hold';
      default:
        return 'Ready';
    }
  };

  // Get phase color
  const getPhaseColor = () => {
    if (hasCompleted) return 'var(--ascend-500)';
    
    switch (phase) {
      case 'inhale':
        return '#3B82F6'; // Blue
      case 'hold1':
      case 'hold2':
        return '#A855F7'; // Purple
      case 'exhale':
        return '#22C55E'; // Green
      default:
        return 'var(--ascend-500)';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <div
          className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--card-bg)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {exercise.icon} {exercise.name}
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Cycle {currentCycle} of {exercise.cycles}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                title={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                ) : (
                  <VolumeX className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Breathing Animation */}
          <div className="p-8 flex flex-col items-center">
            {/* Animated Circle */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-6">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-full transition-all duration-1000"
                style={{
                  backgroundColor: getPhaseColor() + '10',
                  transform: `scale(${getCircleScale()})`,
                }}
              />
              
              {/* Inner circle */}
              <div
                className="absolute w-32 h-32 rounded-full transition-all duration-1000 flex items-center justify-center"
                style={{
                  backgroundColor: getPhaseColor() + '30',
                  transform: `scale(${getCircleScale()})`,
                }}
              >
                {/* Center content */}
                <div className="text-center">
                  {hasCompleted ? (
                    <Check className="w-12 h-12 mx-auto" style={{ color: getPhaseColor() }} />
                  ) : (
                    <span
                      className="text-4xl font-bold"
                      style={{ color: getPhaseColor() }}
                    >
                      {secondsLeft}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Pulse ring animation */}
              {isRunning && !hasCompleted && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-20"
                  style={{ backgroundColor: getPhaseColor() }}
                />
              )}
            </div>

            {/* Instruction */}
            <p
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {getInstruction()}
            </p>

            {/* Pattern display */}
            {!hasCompleted && !isRunning && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span>{exercise.inhale}s in</span>
                {exercise.hold1 && <span>• {exercise.hold1}s hold</span>}
                <span>• {exercise.exhale}s out</span>
                {exercise.hold2 && <span>• {exercise.hold2}s hold</span>}
              </div>
            )}

            {/* Progress bar */}
            {!hasCompleted && (
              <div className="w-full mt-6">
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: 'var(--background-secondary)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      backgroundColor: 'var(--ascend-500)',
                      width: `${((currentCycle - 1) / exercise.cycles) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Completion message */}
            {hasCompleted && (
              <div
                className="mt-4 p-4 rounded-xl text-center"
                style={{ backgroundColor: 'var(--ascend-500)/10' }}
              >
                <Sparkles className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--ascend-500)' }} />
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Well done! Taking time to breathe is a powerful act of self-care.
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div
            className="flex items-center justify-center gap-3 p-4 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            {!isRunning && !hasCompleted && (
              <button
                onClick={handleStart}
                className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
              >
                <Play className="w-5 h-5" />
                Start
              </button>
            )}

            {isRunning && !hasCompleted && (
              <>
                <button
                  onClick={togglePause}
                  className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-primary)' }}
                >
                  <Pause className="w-5 h-5" />
                  Pause
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl font-medium transition-all"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-secondary)' }}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}

            {hasCompleted && (
              <>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--background-secondary)', color: 'var(--text-primary)' }}
                >
                  <RotateCcw className="w-5 h-5" />
                  Do Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl font-medium transition-all"
                  style={{ backgroundColor: 'var(--ascend-500)', color: 'white' }}
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BreathingExercise;
