// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Smart AI Coach Component
// Displays contextual Atomic Habits wisdom and coaching
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Quote, 
  Target, 
  Lightbulb, 
  RefreshCw,
  ChevronRight,
  BookOpen,
  Flame,
  TrendingUp,
  Heart,
} from 'lucide-react';
import { 
  getRandomQuote, 
  getRandomCoachingMessage,
  FOUR_LAWS,
  type Quote as QuoteType,
} from '@/lib/atomic-habits-knowledge';
import { COACH_PERSONAS } from './DeepOnboarding';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface SmartCoachProps {
  variant?: 'minimal' | 'card' | 'full';
  context?: {
    currentStreak?: number;
    completedToday?: number;
    missedYesterday?: boolean;
    userLevel?: number;
    recentAchievement?: string;
    coachPersona?: string;
  };
  onGetInsights?: () => void;
  className?: string;
}

type CoachingContext = 
  | 'task_completed' 
  | 'streak_milestone' 
  | 'missed_day' 
  | 'new_habit' 
  | 'low_motivation' 
  | 'no_progress'
  | 'identity_building';

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS WIDGET COMPONENT
// (Renamed from SmartCoach.tsx to prevent confusion with AI Coach system)
// ─────────────────────────────────────────────────────────────────────────────────

export function AtomicHabitsWidget({ variant = 'card', context, onGetInsights, className = '' }: SmartCoachProps) {
  const [quote, setQuote] = useState<QuoteType | null>(null);
  const [coaching, setCoaching] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showTip, setShowTip] = useState(false);

  // Determine the appropriate coaching context
  const getCoachingContext = useCallback((): CoachingContext => {
    if (!context) return 'identity_building';
    
    if (context.missedYesterday) return 'missed_day';
    if (context.currentStreak && context.currentStreak >= 7) return 'streak_milestone';
    if (context.completedToday && context.completedToday > 0) return 'task_completed';
    if (context.recentAchievement) return 'streak_milestone';
    
    return 'identity_building';
  }, [context]);

  // Load initial quote and coaching
  const loadContent = useCallback(() => {
    const coachingContext = getCoachingContext();
    const newQuote = getRandomQuote();
    let newCoaching = getRandomCoachingMessage(coachingContext) || 'Keep going! Every action is a vote for your future self.';
    // Persona-driven refinement
    if (context?.coachPersona) {
      let touchpoint = 'tip';
      if (coachingContext === 'task_completed') touchpoint = 'celebration';
      if (coachingContext === 'streak_milestone') touchpoint = 'celebration';
      if (coachingContext === 'missed_day' || coachingContext === 'low_motivation') touchpoint = 'struggle';
      if (coachingContext === 'identity_building') touchpoint = 'morning';
      newCoaching = getPersonaMessage(context.coachPersona, touchpoint, newCoaching);
      const persona = COACH_PERSONAS.find(c => c.id === context.coachPersona);
      if (persona) {
        newCoaching = `${persona.name} (${persona.style}): ${newCoaching}`;
      }
    }
    setQuote(newQuote);
    setCoaching(newCoaching);
    setShowTip(Math.random() > 0.5);
  }, [getCoachingContext, context]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadContent();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MINIMAL VARIANT - Just a quote
  // ─────────────────────────────────────────────────────────────────────────────
  if (variant === 'minimal') {
    return (
      <div className={`flex items-start gap-2 text-sm ${className}`} style={{ color: 'var(--text-secondary)' }}>
        <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ascend-500)' }} />
        <p className="italic">&ldquo;{quote?.text || 'Loading...'}&rdquo;</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CARD VARIANT - Quote + Coaching Message
  // ─────────────────────────────────────────────────────────────────────────────
  if (variant === 'card') {
    return (
      <div 
        className={`rounded-xl border p-4 ${className}`}
        style={{ 
          backgroundColor: 'var(--card-bg)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--ascend-500)/10' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: 'var(--ascend-500)' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Daily Wisdom
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                from Atomic Habits
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg transition-all hover:scale-105"
            style={{ 
              backgroundColor: 'var(--background-secondary)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Get new wisdom"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Quote */}
        <div 
          className="rounded-lg p-3 mb-3"
          style={{ backgroundColor: 'var(--background-secondary)' }}
        >
          <div className="flex gap-2">
            <Quote className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--ascend-500)' }} />
            <div>
              <p className="text-sm italic" style={{ color: 'var(--text-primary)' }}>
                &ldquo;{quote?.text || 'Loading...'}&rdquo;
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                — James Clear
              </p>
            </div>
          </div>
        </div>

        {/* Coaching Message */}
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold-400)' }} />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {coaching}
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FULL VARIANT - Complete coaching experience
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div 
      className={`rounded-xl border overflow-hidden ${className}`}
      style={{ 
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Header with gradient */}
      <div 
        className="px-4 py-3"
        style={{ 
          background: 'linear-gradient(135deg, var(--ascend-500) 0%, var(--ascend-600) 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-semibold">AI Habit Coach</h2>
          </div>
          <span className="text-xs text-white/70 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            Atomic Habits
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Personalized Coaching */}
        <div 
          className="rounded-lg p-4"
          style={{ backgroundColor: 'var(--background-secondary)' }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ 
                background: 'linear-gradient(135deg, var(--ascend-400) 0%, var(--ascend-600) 100%)',
              }}
            >
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                Your Daily Motivation
              </h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {coaching}
              </p>
            </div>
          </div>
        </div>

        {/* Quote of the Day */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Quote className="w-4 h-4" style={{ color: 'var(--ascend-500)' }} />
            <h4 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Quote of the Day
            </h4>
          </div>
          <blockquote 
            className="border-l-2 pl-3 py-1"
            style={{ borderColor: 'var(--ascend-500)' }}
          >
            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
              &ldquo;{quote?.text}&rdquo;
            </p>
          </blockquote>
        </div>

        {/* Quick Tips Toggle */}
        <button
          onClick={() => setShowTip(!showTip)}
          className="w-full flex items-center justify-between p-3 rounded-lg transition-all"
          style={{ 
            backgroundColor: 'var(--background-secondary)',
            color: 'var(--text-primary)',
          }}
        >
          <span className="flex items-center gap-2 text-sm font-medium">
            <Target className="w-4 h-4" style={{ color: 'var(--ascend-500)' }} />
            Quick Habit Tip
          </span>
          <ChevronRight 
            className={`w-4 h-4 transition-transform ${showTip ? 'rotate-90' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          />
        </button>

        {showTip && (
          <div 
            className="rounded-lg p-3 animate-slide-down"
            style={{ backgroundColor: 'var(--ascend-500)/5' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong className="font-medium" style={{ color: 'var(--ascend-500)' }}>
                The Two-Minute Rule:
              </strong>{' '}
              When you start a new habit, it should take less than two minutes. 
              Don&apos;t try to run a marathon—just put on your running shoes.
            </p>
          </div>
        )}

        {/* Context Stats */}
        {context && (context.currentStreak || context.completedToday) && (
          <div className="grid grid-cols-2 gap-3">
            {context.currentStreak !== undefined && (
              <div 
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: 'var(--background-secondary)' }}
              >
                <Flame className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--ascend-500)' }} />
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {context.currentStreak}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Day Streak</p>
              </div>
            )}
            {context.completedToday !== undefined && (
              <div 
                className="rounded-lg p-3 text-center"
                style={{ backgroundColor: 'var(--background-secondary)' }}
              >
                <TrendingUp className="w-5 h-5 mx-auto mb-1" style={{ color: 'var(--green-500)' }} />
                <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {context.completedToday}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Done Today</p>
              </div>
            )}
          </div>
        )}

        {/* Get Insights Button */}
        {onGetInsights && (
          <button
            onClick={onGetInsights}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, var(--ascend-500) 0%, var(--ascend-600) 100%)',
              color: 'white',
            }}
          >
            <Sparkles className="w-4 h-4" />
            Get AI Insights
          </button>
        )}

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="w-full text-center text-xs py-2 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <RefreshCw className={`w-3 h-3 inline mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh wisdom
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// QUICK QUOTE WIDGET
// ─────────────────────────────────────────────────────────────────────────────────

export function QuickQuote({ className = '' }: { className?: string }) {
  const [quote, setQuote] = useState<QuoteType | null>(null);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${className}`}
      style={{ 
        backgroundColor: 'var(--ascend-500)/5',
        borderLeft: '3px solid var(--ascend-500)',
      }}
    >
      <Quote className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--ascend-500)' }} />
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        <span className="italic">&ldquo;{quote?.text || 'Loading...'}&rdquo;</span>
        <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
          — James Clear
        </span>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// FOUR LAWS DISPLAY
// ─────────────────────────────────────────────────────────────────────────────────

export function FourLawsWidget({ highlightLaw }: { highlightLaw?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {FOUR_LAWS.map((law, index) => (
        <div 
          key={law.number}
          className={`p-3 rounded-lg border transition-all ${
            highlightLaw === index ? 'ring-2' : ''
          }`}
          style={{ 
            backgroundColor: highlightLaw === index 
              ? 'var(--ascend-500)/10' 
              : 'var(--background-secondary)',
            borderColor: highlightLaw === index 
              ? 'var(--ascend-500)' 
              : 'var(--border)',
            ...(highlightLaw === index && { '--tw-ring-color': 'var(--ascend-500)' } as React.CSSProperties),
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ 
                backgroundColor: 'var(--ascend-500)',
                color: 'white',
              }}
            >
              {law.number}
            </span>
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {law.name}
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {law.stage}
          </p>
        </div>
      ))}
    </div>
  );
}

export default AtomicHabitsWidget;

// Refined coach messaging logic for adaptive, persona-driven messages
const COACH_MOTIVATION_TEMPLATES = {
  'tony-robbins': {
    morning: "Unleash the power within! Today is your day to push past limits.",
    celebration: "Outstanding! You just proved that progress equals happiness.",
    struggle: "Remember: It's not about resources, it's about resourcefulness. You can overcome this!",
    tip: "Take massive action. Even a small step forward is a win.",
  },
  'brendon-burchard': {
    morning: "High performance starts with intention. What's your big win today?",
    celebration: "You showed up with excellence! Keep your habits strong.",
    struggle: "Honor the struggle. Every challenge is a chance to grow.",
    tip: "Clarity breeds mastery. Write down your next step.",
  },
  'mel-robbins': {
    morning: "5-4-3-2-1... Go! Don't wait for motivation, act now.",
    celebration: "You took action! That's how change happens.",
    struggle: "You don't need to feel ready. Just start, and confidence will follow.",
    tip: "Interrupt hesitation with action. Small moves count.",
  },
  'robin-sharma': {
    morning: "Own your morning, elevate your life. Start with your most important habit.",
    celebration: "Bravo! Early wins create lasting success.",
    struggle: "Every setback is a setup for a comeback. Reflect, then rise.",
    tip: "Protect your focus. The 5AM Club knows: distraction is the enemy.",
  },
  'jay-shetty': {
    morning: "Think like a monk. Begin with gratitude and intention.",
    celebration: "You practiced presence and progress. Well done!",
    struggle: "Pause, breathe, and reconnect to your purpose.",
    tip: "Small mindful actions lead to big results.",
  },
  'dr-shefali': {
    morning: "Awaken your conscious self. Today, choose growth over comfort.",
    celebration: "Transformation happens one choice at a time. Celebrate your progress.",
    struggle: "Be gentle with yourself. Awareness is the first step to change.",
    tip: "Embrace your journey. Every moment is an opportunity to evolve.",
  },
};

function getPersonaMessage(personaId: string, touchpoint: string, fallback: string) {
  const persona = (COACH_MOTIVATION_TEMPLATES as Record<string, Record<string, string>>)[personaId];
  if (persona && persona[touchpoint]) return persona[touchpoint];
  return fallback;
}
