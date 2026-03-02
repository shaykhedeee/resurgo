// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Secure AI Client
// Client-side AI service that calls server-side API routes (no exposed API keys)
// With caching and rate limiting for efficient API usage
// ═══════════════════════════════════════════════════════════════════════════════

import { 
  cachedAICall, 
  getAIRateLimiter, 
  getAICache,
  formatResetTime,
} from './ai-cache';

export type MessageType = 'motivation' | 'warning' | 'celebration' | 'tip';
export type SuggestionType = 'habits' | 'insights' | 'coaching';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  provider?: string;
  error?: string;
}

interface CoachingContext {
  userName: string;
  currentStreak: number;
  todayCompleted: number;
  todayTotal: number;
  recentTrend: 'improving' | 'stable' | 'declining';
  lastMissedHabit?: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
}

interface DecomposeResponse {
  success: boolean;
  milestones?: Array<{
    title: string;
    description: string;
    targetWeek: number;
    tasks: Array<{
      title: string;
      estimatedMinutes: number;
    }>;
  }>;
  weeklyObjectives?: Array<{
    week: number;
    focus: string;
    dailyHabits: string[];
  }>;
  dailyHabits?: string[];
  error?: string;
}

interface SuggestionsResponse {
  success: boolean;
  suggestions?: unknown[];
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SECURE AI CLIENT CLASS
// ─────────────────────────────────────────────────────────────────────────────────

class SecureAIClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api/ai';
  }

  /**
   * Send a chat message to the AI
   */
  async chat(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: '',
          error: data.error || 'Chat request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('AI Chat error:', error);
      return {
        success: false,
        message: '',
        error: 'Network error. Please try again.',
      };
    }
  }

  /**
   * Decompose a goal into milestones and tasks
   */
  async decomposeGoal(
    goal: string,
    timeframe: number,
    context?: Record<string, unknown>
  ): Promise<DecomposeResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/decompose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, timeframe, context }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Decomposition failed',
        };
      }

      return data;
    } catch (error) {
      console.error('AI Decompose error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }

  /**
   * Get AI suggestions (habits, insights, or coaching)
   */
  async getSuggestions(
    type: SuggestionType,
    context: Record<string, unknown>
  ): Promise<SuggestionsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/suggestions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, context }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Suggestions request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('AI Suggestions error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  }

  /**
   * Generate a coaching message based on user context
   * Uses caching to avoid repeated API calls for similar contexts
   */
  async generateCoachingMessage(context: CoachingContext): Promise<{
    message: string;
    type: MessageType;
    fromCache?: boolean;
  }> {
    // Create a cache key based on context (but not too specific)
    const cacheKey = `${context.timeOfDay}_${context.recentTrend}_${Math.floor(context.todayCompleted / context.todayTotal * 10)}`;
    
    try {
      const result = await cachedAICall<{ message: string; type: MessageType }>(
        'coaching',
        cacheKey,
        async () => {
          const systemPrompt = `You are Resurgo AI, a friendly and encouraging habit coach.
Generate a SHORT, personalized coaching message (1-2 sentences max).
Be warm but not cheesy. Be specific to their situation.
Respond with JSON: {"message": "Your message here", "type": "motivation|warning|celebration|tip"}`;

          const userPrompt = `
User: ${context.userName}
Current streak: ${context.currentStreak} days
Today's progress: ${context.todayCompleted}/${context.todayTotal} habits
Recent trend: ${context.recentTrend}
${context.lastMissedHabit ? `Recently missed: ${context.lastMissedHabit}` : ''}
Time: ${context.timeOfDay}

Generate an appropriate coaching message.`;

          const response = await this.chat([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ]);

          if (response.success && response.message) {
            try {
              const jsonMatch = response.message.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                  message: parsed.message || response.message,
                  type: (parsed.type || 'motivation') as MessageType,
                };
              }
            } catch {
              // If JSON parsing fails, use the message as-is
            }
            
            return {
              message: response.message,
              type: 'motivation' as MessageType,
            };
          }

          throw new Error('AI response failed');
        }
      );

      return {
        ...result.data,
        fromCache: result.fromCache,
      };
    } catch (error) {
      // Check if it's a rate limit error
      if (error instanceof Error && error.message.includes('Rate limit')) {
        return {
          ...this.getFallbackCoachingMessage(context),
          fromCache: false,
        };
      }
      return this.getFallbackCoachingMessage(context);
    }
  }

  /**
   * Suggest habits based on goals
   * Uses caching to avoid repeated suggestions for same goals
   */
  async suggestHabits(
    goals: string[],
    existingHabits: string[],
    preferences: {
      category?: string;
      maxMinutesPerDay?: number;
      difficulty?: 'easy' | 'moderate' | 'challenging';
    } = {}
  ): Promise<Array<{
    name: string;
    description: string;
    category: string;
    frequency: string;
    estimatedMinutes: number;
    whyItHelps: string;
  }>> {
    // Create cache key from goals (sorted for consistency)
    const cacheKey = [...goals].sort().join('|') + '_' + (preferences.category || 'any');
    
    try {
      const result = await cachedAICall(
        'suggestions',
        cacheKey,
        async () => {
          const response = await this.getSuggestions('habits', {
            goals,
            existingHabits,
            preferences,
          });

          if (response.success && response.suggestions) {
            return response.suggestions as Array<{
              name: string;
              description: string;
              category: string;
              frequency: string;
              estimatedMinutes: number;
              whyItHelps: string;
            }>;
          }

          throw new Error('Suggestions request failed');
        }
      );

      return result.data;
    } catch {
      // Fallback suggestions
      return [
        {
          name: 'Morning Reflection',
          description: 'Spend 5 minutes journaling your intentions for the day',
          category: 'mindfulness',
          frequency: 'daily',
          estimatedMinutes: 5,
          whyItHelps: 'Builds self-awareness and sets a positive tone',
        },
        {
          name: 'Daily Movement',
          description: '10-minute walk or stretch routine',
          category: 'health',
          frequency: 'daily',
          estimatedMinutes: 10,
          whyItHelps: 'Improves energy and mental clarity',
        },
      ];
    }
  }

  /**
   * Analyze patterns and provide insights
   * Uses caching since habit patterns don't change rapidly
   */
  async analyzePatterns(
    habitData: Array<{
      name: string;
      completionRate: number;
      streakDays: number;
      bestDay: string;
      worstDay: string;
    }>
  ): Promise<{
    insights: string[];
    recommendations: string[];
    predictedStruggle: string | null;
  }> {
    // Create cache key from habit performance summary
    const cacheKey = habitData
      .map(h => `${h.name}:${Math.round(h.completionRate / 10)}`)
      .sort()
      .join('|');
    
    try {
      const result = await cachedAICall(
        'insights',
        cacheKey,
        async () => {
          const response = await this.getSuggestions('insights', { habitData });

          if (response.success && response.suggestions) {
            const data = response.suggestions[0] as {
              insights?: string[];
              recommendations?: string[];
              predictedStruggle?: string | null;
            };
            
            return {
              insights: data.insights || [],
              recommendations: data.recommendations || [],
              predictedStruggle: data.predictedStruggle || null,
            };
          }

          throw new Error('Insights request failed');
        }
      );

      return result.data;
    } catch {
      // Fallback insights
      return {
        insights: [
          'Your consistency is building momentum. Keep it up!',
          'Morning habits tend to have higher completion rates.',
        ],
        recommendations: [
          'Try habit stacking - attach new habits to existing routines.',
          'Set reminders for your most challenging habits.',
        ],
        predictedStruggle: null,
      };
    }
  }

  /**
   * Generate identity statement
   */
  async generateIdentityStatement(goal: string, habits: string[]): Promise<string> {
    const systemPrompt = `You are Resurgo AI, inspired by James Clear's Atomic Habits.
Create a powerful identity statement that starts with "I am becoming someone who..."
Make it personal, aspirational, and connected to their habits.
Respond with just the statement, no JSON.`;

    const userPrompt = `
Goal: ${goal}
Supporting habits: ${habits.join(', ')}

Generate a single, powerful identity statement (1 sentence).`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    if (response.success && response.message) {
      return response.message.trim().replace(/^["']|["']$/g, '');
    }

    // Fallback
    return `I am becoming someone who ${goal.toLowerCase()} through consistent daily actions.`;
  }

  /**
   * Fallback coaching message when API fails
   */
  private getFallbackCoachingMessage(context: CoachingContext): {
    message: string;
    type: MessageType;
  } {
    const { todayCompleted, todayTotal, currentStreak, recentTrend, timeOfDay, userName } = context;

    // Celebration for completed
    if (todayCompleted === todayTotal && todayTotal > 0) {
      return {
        message: `🎉 Amazing ${userName}! You've completed all ${todayTotal} habits today. Your ${currentStreak} day streak is legendary!`,
        type: 'celebration',
      };
    }

    // Warning for declining trend
    if (recentTrend === 'declining') {
      return {
        message: `Hey ${userName}, I noticed a slight dip recently. That's okay - progress isn't linear. What's one small win you can get right now?`,
        type: 'warning',
      };
    }

    // Time-based motivation
    const timeMessages: Record<string, { message: string; type: MessageType }> = {
      morning: {
        message: `Good morning ${userName}! Fresh day, fresh opportunities. You've got ${todayTotal - todayCompleted} habits left to conquer!`,
        type: 'motivation',
      },
      afternoon: {
        message: `${userName}, you're ${todayCompleted}/${todayTotal} complete! The afternoon is perfect for tackling what's left.`,
        type: 'tip',
      },
      evening: {
        message: `Evening check-in: ${todayTotal - todayCompleted} habits remaining. Let's finish strong, ${userName}!`,
        type: 'motivation',
      },
      night: {
        message: `${userName}, great job today! ${todayCompleted} habits done. Rest well - tomorrow is another chance to grow.`,
        type: 'tip',
      },
    };

    return timeMessages[timeOfDay] || timeMessages.morning;
  }

  /**
   * Get rate limit status for all AI features
   */
  getRateLimitStatus(): Record<string, { used: number; max: number; resetIn: number; resetInFormatted: string }> {
    const limiter = getAIRateLimiter();
    const usage = limiter.getUsage();
    
    const result: Record<string, { used: number; max: number; resetIn: number; resetInFormatted: string }> = {};
    
    Object.entries(usage).forEach(([key, value]) => {
      result[key] = {
        ...value,
        resetInFormatted: formatResetTime(value.resetIn),
      };
    });
    
    return result;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; types: Record<string, number> } {
    const cache = getAICache();
    return cache.getStats();
  }

  /**
   * Clear AI cache
   */
  clearCache(): void {
    const cache = getAICache();
    cache.clear();
  }

  /**
   * Reset rate limits (for testing/debugging)
   */
  resetRateLimits(): void {
    const limiter = getAIRateLimiter();
    limiter.reset();
  }
}

// Export singleton instance
export const aiClient = new SecureAIClient();

// Also export as ascendAI for backwards compatibility
export const ascendAI = aiClient;
