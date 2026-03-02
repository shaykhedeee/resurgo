// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Sound Effects System
// Premium audio feedback for task completion and achievements
// ═══════════════════════════════════════════════════════════════════════════════

// Sound effect types
export type SoundEffect = 
  | 'taskComplete'
  | 'habitComplete'
  | 'streakMilestone'
  | 'levelUp'
  | 'achievement'
  | 'goalComplete'
  | 'click'
  | 'success'
  | 'celebration';

// Web Audio API context (lazy initialized)
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Create a pleasant tone using Web Audio API
function createTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.3,
  fadeOut: boolean = true
): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    }
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio is not available
  }
}

// Play a sequence of notes (for melodies)
function playMelody(notes: { freq: number; duration: number; delay: number }[], volume: number = 0.2): void {
  notes.forEach(({ freq, duration, delay }) => {
    setTimeout(() => createTone(freq, duration, 'sine', volume), delay * 1000);
  });
}

// Sound effect implementations
const soundEffects: Record<SoundEffect, () => void> = {
  // Soft, satisfying click
  click: () => {
    createTone(800, 0.05, 'sine', 0.1, false);
  },

  // Task completion - gentle ascending tone
  taskComplete: () => {
    playMelody([
      { freq: 523, duration: 0.1, delay: 0 },    // C5
      { freq: 659, duration: 0.15, delay: 0.08 }, // E5
    ], 0.25);
  },

  // Habit completion - warm chord
  habitComplete: () => {
    playMelody([
      { freq: 392, duration: 0.2, delay: 0 },     // G4
      { freq: 523, duration: 0.2, delay: 0 },     // C5
      { freq: 659, duration: 0.25, delay: 0.05 }, // E5
    ], 0.2);
  },

  // Streak milestone - ascending arpeggio
  streakMilestone: () => {
    playMelody([
      { freq: 523, duration: 0.12, delay: 0 },     // C5
      { freq: 659, duration: 0.12, delay: 0.1 },   // E5
      { freq: 784, duration: 0.12, delay: 0.2 },   // G5
      { freq: 1047, duration: 0.3, delay: 0.3 },   // C6
    ], 0.2);
  },

  // Level up - triumphant fanfare
  levelUp: () => {
    playMelody([
      { freq: 523, duration: 0.1, delay: 0 },      // C5
      { freq: 659, duration: 0.1, delay: 0.1 },    // E5
      { freq: 784, duration: 0.1, delay: 0.2 },    // G5
      { freq: 1047, duration: 0.15, delay: 0.3 },  // C6
      { freq: 784, duration: 0.1, delay: 0.45 },   // G5
      { freq: 1047, duration: 0.4, delay: 0.55 },  // C6
    ], 0.25);
  },

  // Achievement unlocked - sparkle effect
  achievement: () => {
    playMelody([
      { freq: 880, duration: 0.08, delay: 0 },     // A5
      { freq: 1100, duration: 0.08, delay: 0.08 }, // ~C#6
      { freq: 1320, duration: 0.1, delay: 0.16 },  // E6
      { freq: 1760, duration: 0.2, delay: 0.26 },  // A6
      { freq: 2200, duration: 0.3, delay: 0.36 },  // ~C#7
    ], 0.15);
  },

  // Goal complete - majestic celebration
  goalComplete: () => {
    playMelody([
      { freq: 392, duration: 0.2, delay: 0 },      // G4
      { freq: 523, duration: 0.2, delay: 0.15 },   // C5
      { freq: 659, duration: 0.2, delay: 0.3 },    // E5
      { freq: 784, duration: 0.3, delay: 0.45 },   // G5
      { freq: 1047, duration: 0.5, delay: 0.65 },  // C6
    ], 0.25);
  },

  // General success sound
  success: () => {
    playMelody([
      { freq: 523, duration: 0.15, delay: 0 },     // C5
      { freq: 784, duration: 0.2, delay: 0.1 },    // G5
    ], 0.2);
  },

  // Big celebration (for special moments)
  celebration: () => {
    playMelody([
      { freq: 523, duration: 0.1, delay: 0 },
      { freq: 587, duration: 0.1, delay: 0.1 },
      { freq: 659, duration: 0.1, delay: 0.2 },
      { freq: 698, duration: 0.1, delay: 0.3 },
      { freq: 784, duration: 0.15, delay: 0.4 },
      { freq: 880, duration: 0.15, delay: 0.5 },
      { freq: 988, duration: 0.15, delay: 0.6 },
      { freq: 1047, duration: 0.4, delay: 0.7 },
    ], 0.2);
  },
};

// Main function to play sound effects
export function playSound(effect: SoundEffect): void {
  // Check if sounds are enabled in localStorage (default: true)
  const soundEnabled = localStorage.getItem('ascend-sounds-enabled');
  if (soundEnabled === 'false') return;
  
  const soundFn = soundEffects[effect];
  if (soundFn) {
    soundFn();
  }
}

// Toggle sound on/off
export function toggleSounds(): boolean {
  const currentState = localStorage.getItem('ascend-sounds-enabled');
  const newState = currentState === 'false' ? 'true' : 'false';
  localStorage.setItem('ascend-sounds-enabled', newState);
  return newState === 'true';
}

// Check if sounds are enabled
export function areSoundsEnabled(): boolean {
  const state = localStorage.getItem('ascend-sounds-enabled');
  // Default to true if not set
  return state !== 'false';
}

// Initialize sounds (call on app load to set default)
export function initializeSounds(): void {
  if (localStorage.getItem('ascend-sounds-enabled') === null) {
    localStorage.setItem('ascend-sounds-enabled', 'true');
  }
}

// ─── Haptic Feedback ────────────────────────────────────────────────────────────

/**
 * Trigger haptic feedback on mobile devices.
 * Falls back silently on unsupported browsers.
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' = 'medium'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  
  const patterns: Record<string, number | number[]> = {
    light: 10,
    medium: 25,
    heavy: 50,
    success: [15, 50, 30], // Double tap pattern for success
  };
  
  try {
    navigator.vibrate(patterns[type]);
  } catch {
    // Silently fail — vibration not supported
  }
}

/**
 * Play sound + haptic together for satisfying completion feedback
 */
export function completionFeedback(sound: SoundEffect = 'habitComplete'): void {
  playSound(sound);
  hapticFeedback('success');
}
