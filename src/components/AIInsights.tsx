// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI Insights Component
// Pattern analysis and predictive insights using AI
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAscendStore } from '@/lib/store';
import { aiClient } from '@/lib/ai-client';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  RefreshCw,
  BarChart3,
  Loader2,
  Zap
} from 'lucide-react';

interface AIInsightsProps {
  className?: string;
}

interface InsightData {
  insights: string[];
  recommendations: string[];
  predictedStruggle: string | null;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function AIInsights({ className }: AIInsightsProps) {
  const { habits, habitEntries } = useAscendStore();
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate habit stats for AI analysis
  const getHabitData = useCallback(() => {
    const activeHabits = habits.filter(h => h.isActive);
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    return activeHabits.map(habit => {
      const completedDays = habitEntries.filter(
        e => e.habitId === habit.id && e.completed && last30Days.includes(e.date)
      );
      
      const completionRate = Math.round((completedDays.length / 30) * 100);
      
      // Calculate best/worst day
      const dayCompletions = DAYS_OF_WEEK.map((day, idx) => {
        const daysWithThisDay = last30Days.filter(d => new Date(d).getDay() === idx);
        const completed = completedDays.filter(e => new Date(e.date).getDay() === idx);
        return completed.length / Math.max(daysWithThisDay.length, 1);
      });
      
      const bestDayIdx = dayCompletions.indexOf(Math.max(...dayCompletions));
      const worstDayIdx = dayCompletions.indexOf(Math.min(...dayCompletions));

      // Calculate streak
      let streak = 0;
      for (const date of last30Days) {
        const entry = habitEntries.find(e => e.habitId === habit.id && e.date === date);
        if (entry?.completed) streak++;
        else break;
      }

      return {
        name: habit.name,
        completionRate,
        streakDays: streak,
        bestDay: DAYS_OF_WEEK[bestDayIdx],
        worstDay: DAYS_OF_WEEK[worstDayIdx],
      };
    });
  }, [habits, habitEntries]);

  const analyzePatterns = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const habitData = getHabitData();
      
      if (habitData.length === 0) {
        setInsightData({
          insights: ['Start tracking habits to get personalized insights'],
          recommendations: ['Add your first habit to begin your journey'],
          predictedStruggle: null,
        });
        return;
      }

      const result = await aiClient.analyzePatterns(habitData);
      setInsightData(result);
    } catch (err) {
      console.error('Failed to analyze patterns:', err);
      setError('Unable to analyze patterns');
      
      // Fallback insights
      const habitData = getHabitData();
      const lowestCompletion = habitData.reduce(
        (min, h) => h.completionRate < min.completionRate ? h : min,
        habitData[0]
      );

      setInsightData({
        insights: [
          `You have ${habitData.length} active habits being tracked`,
          `Average completion rate: ${Math.round(habitData.reduce((sum, h) => sum + h.completionRate, 0) / habitData.length)}%`,
        ],
        recommendations: [
          'Try habit stacking - attach new habits to existing routines',
          'Focus on consistency over perfection',
        ],
        predictedStruggle: lowestCompletion?.name || null,
      });
    } finally {
      setIsLoading(false);
    }
  }, [getHabitData]);

  useEffect(() => {
    analyzePatterns();
  }, [habits.length, analyzePatterns]); // Re-analyze when habits change

  return (
    <div className={cn('glass-card p-5', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Brain className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Insights</h3>
            <p className="text-xs text-slate-400">Pattern analysis powered by Groq</p>
          </div>
        </div>
        <button
          onClick={analyzePatterns}
          disabled={isLoading}
          aria-label="Refresh AI insights"
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
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-sm text-slate-400">Analyzing your patterns...</p>
        </div>
      )}

      {/* Content */}
      {!isLoading && insightData && (
        <div className="space-y-4">
          {/* Warning - Predicted Struggle */}
          {insightData.predictedStruggle && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-300">Watch Out</span>
              </div>
              <p className="text-sm text-amber-200/80">
                <strong>{insightData.predictedStruggle}</strong> might need extra attention today
              </p>
            </div>
          )}

          {/* Insights */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-slate-300">Key Insights</span>
            </div>
            <ul className="space-y-2">
              {insightData.insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                  <TrendingUp className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-slate-300">Recommendations</span>
            </div>
            <ul className="space-y-2">
              {insightData.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                  <Zap className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && !insightData && (
        <div className="text-center py-6">
          <p className="text-sm text-slate-400 mb-3">{error}</p>
          <button
            onClick={analyzePatterns}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

export default AIInsights;
