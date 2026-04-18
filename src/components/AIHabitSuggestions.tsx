// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI Habit Suggestions Component
// Smart habit recommendations based on user's goals
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect } from 'react';
import { useAscendStore } from '@/lib/store';
import { aiClient } from '@/lib/ai-client';
import { cn } from '@/lib/utils';
import { 
  Sparkles, 
  Plus, 
  RefreshCw,
  Clock,
  Target,
  Zap,
  Check,
  Loader2
} from 'lucide-react';

interface HabitSuggestion {
  name: string;
  description: string;
  category: string;
  frequency: string;
  estimatedMinutes: number;
  whyItHelps: string;
}

interface AIHabitSuggestionsProps {
  className?: string;
  onAddHabit?: (suggestion: HabitSuggestion) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  health: '❤️',
  fitness: '💪',
  productivity: '⚡',
  mindfulness: '🧘',
  learning: '📚',
  social: '👥',
  finance: '💰',
  creativity: '🎨',
};

const CATEGORY_COLORS: Record<string, string> = {
  health: 'text-red-400 bg-red-500/10 border-red-500/30',
  fitness: 'text-green-400 bg-green-500/10 border-green-500/30',
  productivity: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  mindfulness: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  learning: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  social: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  finance: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  creativity: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
};

export function AIHabitSuggestions({ className, onAddHabit }: AIHabitSuggestionsProps) {
  const { goals, habits, addHabit, addToast } = useAscendStore();
  const [suggestions, setSuggestions] = useState<HabitSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedHabits, setAddedHabits] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const goalTitles = goals.filter(g => g.status === 'in_progress').map(g => g.title);
      const existingHabits = habits.map(h => h.name);

      if (goalTitles.length === 0) {
        // Provide general suggestions if no goals
        goalTitles.push('Improve overall wellbeing', 'Be more productive');
      }

      const result = await aiClient.suggestHabits(goalTitles, existingHabits, {
        difficulty: 'moderate',
        maxMinutesPerDay: 30,
      });

      setSuggestions(result);
    } catch (err) {
      console.error('Failed to generate suggestions:', err);
      setError('Unable to generate suggestions. Try again later.');
      
      // Fallback suggestions
      setSuggestions([
        {
          name: 'Morning stretch routine',
          description: 'Start your day with 5 minutes of stretching',
          category: 'fitness',
          frequency: 'daily',
          estimatedMinutes: 5,
          whyItHelps: 'Increases flexibility and energy levels',
        },
        {
          name: 'Gratitude journaling',
          description: 'Write 3 things you\'re grateful for',
          category: 'mindfulness',
          frequency: 'daily',
          estimatedMinutes: 5,
          whyItHelps: 'Improves mental health and perspective',
        },
        {
          name: 'Read for 15 minutes',
          description: 'Read non-fiction or skill-building content',
          category: 'learning',
          frequency: 'daily',
          estimatedMinutes: 15,
          whyItHelps: 'Compounds into massive knowledge over time',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    generateSuggestions();
  }, []);

  const handleAddHabit = (suggestion: HabitSuggestion) => {
    // Create habit from suggestion
    addHabit({
      name: suggestion.name,
      description: suggestion.description,
      icon: CATEGORY_ICONS[suggestion.category] || '✨',
      color: '#14B899',
      category: suggestion.category as any,
      frequency: suggestion.frequency === 'daily' ? 'daily' : 'weekly' as any,
      targetCompletions: suggestion.frequency === 'daily' ? 1 : 3,
      isActive: true,
    });

    setAddedHabits(prev => new Set(Array.from(prev).concat(suggestion.name)));
    
    addToast({
      type: 'success',
      title: 'Habit Added',
      message: `"${suggestion.name}" added to your habits!`,
      duration: 3000,
    });

    if (onAddHabit) {
      onAddHabit(suggestion);
    }
  };

  return (
    <div className={cn('glass-card p-5', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Sparkles className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Habit Suggestions</h3>
            <p className="text-xs text-slate-400">Personalized for your goals</p>
          </div>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          aria-label="Refresh habit suggestions"
          className={cn(
            'p-2 rounded-lg hover:bg-white/5 transition-colors',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <RefreshCw className={cn('h-4 w-4 text-slate-400', isLoading && 'animate-spin')} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
          <p className="text-sm text-slate-400">AI is analyzing your goals...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400 mb-3">{error}</p>
          <button
            onClick={generateSuggestions}
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Suggestions */}
      {!isLoading && suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const isAdded = addedHabits.has(suggestion.name);
            const colors = CATEGORY_COLORS[suggestion.category] || 'text-slate-400 bg-slate-500/10 border-slate-500/30';
            
            return (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-xl border transition-all',
                  'bg-slate-800/30 border-slate-700/50',
                  'hover:bg-slate-800/50 hover:border-slate-600/50',
                  isAdded && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{CATEGORY_ICONS[suggestion.category] || '✨'}</span>
                      <h4 className="font-medium text-white">{suggestion.name}</h4>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{suggestion.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs border', colors)}>
                        {suggestion.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700/50 text-slate-300 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {suggestion.estimatedMinutes} min
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700/50 text-slate-300">
                        {suggestion.frequency}
                      </span>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-slate-500">
                      <Zap className="h-3 w-3 mt-0.5 text-amber-400 flex-shrink-0" />
                      <span>{suggestion.whyItHelps}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddHabit(suggestion)}
                    disabled={isAdded}
                    className={cn(
                      'flex-shrink-0 p-2 rounded-lg transition-all',
                      isAdded
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                    )}
                  >
                    {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && suggestions.length === 0 && (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No suggestions yet</p>
          <button
            onClick={generateSuggestions}
            className="mt-2 text-sm text-purple-400 hover:text-purple-300"
          >
            Generate suggestions
          </button>
        </div>
      )}
    </div>
  );
}

export default AIHabitSuggestions;
