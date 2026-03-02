// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI Service Provider
// Multi-provider AI service using FREE/cheap APIs (Groq, Gemini, OpenAI fallback)
// ═══════════════════════════════════════════════════════════════════════════════

export type AIProvider = 'groq' | 'gemini' | 'openai';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
}


// ─────────────────────────────────────────────────────────────────────────────────
// API KEYS (from environment)
// ─────────────────────────────────────────────────────────────────────────────────

const API_KEYS = {
  groq: process.env.GROQ_API_KEY || '',
  gemini: process.env.GOOGLE_AI_STUDIO_KEY || '',
  openai: process.env.OPENAI_API_KEY || '',
};

// ─────────────────────────────────────────────────────────────────────────────────
// MODEL CONFIGURATIONS (ordered by cost-effectiveness)
// ─────────────────────────────────────────────────────────────────────────────────

const MODELS = {
  // GROQ - Fastest & cheapest for most tasks
  groq: {
    fast: 'llama-3.1-8b-instant',      // $0.05/1M tokens - simple tasks
    balanced: 'llama-3.3-70b-versatile', // $0.59/1M tokens - complex reasoning
    powerful: 'llama-3.3-70b-versatile', // Best available on Groq
  },
  // GEMINI - Google's free tier is generous
  gemini: {
    fast: 'gemini-2.0-flash-exp',       // FREE tier available
    balanced: 'gemini-1.5-flash',       // $0.075/1M tokens
    powerful: 'gemini-1.5-pro',         // $1.25/1M tokens
  },
  // OPENAI - Fallback only (most expensive)
  openai: {
    fast: 'gpt-4o-mini',                // $0.15/1M tokens
    balanced: 'gpt-4o-mini',            // Good balance
    powerful: 'gpt-4o',                 // $5/1M tokens
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// GROQ API CLIENT
// ─────────────────────────────────────────────────────────────────────────────────

async function callGroq(
  messages: AIMessage[],
  model: string = MODELS.groq.balanced,
  maxTokens: number = 4096,
  temperature: number = 0.7
): Promise<AIResponse> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.groq}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    provider: 'groq',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// GOOGLE GEMINI API CLIENT
// ─────────────────────────────────────────────────────────────────────────────────

async function callGemini(
  messages: AIMessage[],
  model: string = MODELS.gemini.fast,
  maxTokens: number = 4096,
  temperature: number = 0.7
): Promise<AIResponse> {
  // Convert messages to Gemini format
  const geminiMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Add system message as first user message if present
  const systemMessage = messages.find(m => m.role === 'system');
  if (systemMessage) {
    geminiMessages.unshift({
      role: 'user',
      parts: [{ text: `System Instructions: ${systemMessage.content}` }],
    });
    geminiMessages.splice(1, 0, {
      role: 'model',
      parts: [{ text: 'I understand. I will follow these instructions.' }],
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEYS.gemini}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
    throw new Error('Invalid Gemini response format');
  }

  return {
    content: data.candidates[0].content.parts[0].text,
    provider: 'gemini',
    model,
    tokensUsed: data.usageMetadata?.totalTokenCount,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// OPENAI API CLIENT (Fallback)
// ─────────────────────────────────────────────────────────────────────────────────

async function callOpenAI(
  messages: AIMessage[],
  model: string = MODELS.openai.fast,
  maxTokens: number = 4096,
  temperature: number = 0.7
): Promise<AIResponse> {
  if (!API_KEYS.openai) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEYS.openai}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0].message.content,
    provider: 'openai',
    model,
    tokensUsed: data.usage?.total_tokens,
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN AI SERVICE CLASS
// ─────────────────────────────────────────────────────────────────────────────────

export class AscendAIService {
  private preferredProvider: AIProvider = 'groq';
  private fallbackOrder: AIProvider[] = ['groq', 'gemini', 'openai'];

  constructor(preferredProvider?: AIProvider) {
    if (preferredProvider) {
      this.preferredProvider = preferredProvider;
    }
  }

  /**
   * Smart AI call with automatic fallback
   */
  async chat(
    messages: AIMessage[],
    options: {
      complexity?: 'simple' | 'balanced' | 'complex';
      maxTokens?: number;
      temperature?: number;
      jsonMode?: boolean;
    } = {}
  ): Promise<AIResponse> {
    const { complexity = 'balanced', maxTokens = 4096, temperature = 0.7, jsonMode = false } = options;

    // If JSON mode, add instruction to system message
    if (jsonMode) {
      const systemIdx = messages.findIndex(m => m.role === 'system');
      if (systemIdx >= 0) {
        messages[systemIdx].content += '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown code blocks, no explanations, just the JSON object.';
      }
    }

    // Determine model tier based on complexity
    const modelTier = complexity === 'simple' ? 'fast' : complexity === 'complex' ? 'powerful' : 'balanced';

    // Try providers in order
    for (const provider of this.fallbackOrder) {
      try {
        const model = MODELS[provider][modelTier];
        
        switch (provider) {
          case 'groq':
            return await callGroq(messages, model, maxTokens, temperature);
          case 'gemini':
            return await callGemini(messages, model, maxTokens, temperature);
          case 'openai':
            return await callOpenAI(messages, model, maxTokens, temperature);
        }
      } catch (error) {
        console.warn(`AI Provider ${provider} failed:`, error);
        continue;
      }
    }

    throw new Error('All AI providers failed');
  }

  /**
   * Parse JSON from AI response (handles markdown code blocks)
   */
  parseJSON<T>(response: string): T {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    
    // Remove ```json ... ``` or ``` ... ```
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    // Try to extract JSON object/array
    const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]}]/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    try {
      return JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI JSON response:', cleaned);
      throw new Error('Invalid JSON response from AI');
    }
  }

  /**
   * Goal decomposition prompt
   */
  async decomposeGoal(
    goal: string,
    category: string,
    targetDate: Date,
    options: {
      skillLevel?: 'beginner' | 'intermediate' | 'advanced';
      hoursPerDay?: number;
      difficulty?: 'easy' | 'moderate' | 'challenging';
    } = {}
  ): Promise<unknown> {
    const { skillLevel = 'beginner', hoursPerDay = 1, difficulty = 'moderate' } = options;
    
    const totalDays = Math.ceil((targetDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.ceil(totalDays / 7);

    const systemPrompt = `You are Resurgo AI, an expert life coach and goal-setting strategist. 
You break down ambitious goals into achievable milestones, weekly objectives, and daily tasks.
You are encouraging but realistic. You adapt difficulty based on user's skill level.
Always respond with valid JSON matching the required schema.`;

    const userPrompt = `
Decompose this goal into a structured action plan:

GOAL: ${goal}
CATEGORY: ${category}
TARGET DATE: ${targetDate.toISOString().split('T')[0]}
SKILL LEVEL: ${skillLevel}
AVAILABLE TIME: ${hoursPerDay} hours per day
DIFFICULTY: ${difficulty}
TOTAL TIME: ${totalDays} days (${totalWeeks} weeks)

Create a plan with:
1. 3-5 milestones spread across the timeline
2. Weekly objectives for each milestone
3. Daily tasks (15-60 min each) for the first 4 weeks
4. Suggested supporting habits

Respond with JSON in this EXACT format:
{
  "summary": "2-3 sentence summary of the plan",
  "milestones": [
    {
      "title": "Milestone Title",
      "description": "What this milestone represents",
      "weekNumber": 4,
      "weeklyObjectives": [
        {
          "title": "Week 1 Objective",
          "description": "What to accomplish",
          "dailyTasks": [
            {
              "title": "Task name",
              "description": "Brief description",
              "estimatedMinutes": 30,
              "priority": "high",
              "difficulty": "medium"
            }
          ]
        }
      ]
    }
  ],
  "estimatedSuccessRate": 85,
  "keyRisks": ["Risk 1", "Risk 2"],
  "motivationalMessage": "Encouraging message",
  "suggestedHabits": [
    {
      "name": "Habit name",
      "description": "Why this helps",
      "frequency": "daily",
      "category": "productivity"
    }
  ],
  "identityStatement": "You are becoming someone who..."
}`;

    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { complexity: 'complex', maxTokens: 4096, jsonMode: true }
    );

    return this.parseJSON(response.content);
  }

  /**
   * Generate AI coaching message based on user's progress
   */
  async generateCoachingMessage(
    context: {
      userName: string;
      currentStreak: number;
      todayCompleted: number;
      todayTotal: number;
      recentTrend: 'improving' | 'stable' | 'declining';
      lastMissedHabit?: string;
      timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    }
  ): Promise<{ message: string; type: 'motivation' | 'warning' | 'celebration' | 'tip' }> {
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

    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { complexity: 'simple', maxTokens: 200, jsonMode: true }
    );

    return this.parseJSON(response.content);
  }

  /**
   * Suggest habits based on user's goals
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
    const systemPrompt = `You are Resurgo AI, an expert in habit formation and behavior science.
Suggest 3-5 highly specific, actionable habits based on user's goals.
Each habit should be small enough to do daily but meaningful enough to create change.
Respond with JSON array only.`;

    const userPrompt = `
User's goals: ${goals.join(', ')}
Existing habits: ${existingHabits.length > 0 ? existingHabits.join(', ') : 'None yet'}
Preferred category: ${preferences.category || 'any'}
Max time per habit: ${preferences.maxMinutesPerDay || 30} minutes
Difficulty preference: ${preferences.difficulty || 'moderate'}

Suggest 3-5 NEW habits (don't repeat existing ones).

Respond with JSON array:
[
  {
    "name": "Short habit name",
    "description": "1 sentence description",
    "category": "health|fitness|productivity|mindfulness|learning|social|finance|creativity",
    "frequency": "daily|weekdays|3x_week",
    "estimatedMinutes": 15,
    "whyItHelps": "1 sentence on why this supports their goals"
  }
]`;

    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { complexity: 'balanced', maxTokens: 1000, jsonMode: true }
    );

    return this.parseJSON(response.content);
  }

  /**
   * Analyze habit patterns and provide insights
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
    const systemPrompt = `You are Resurgo AI, an expert in behavioral analytics.
Analyze habit patterns and provide actionable insights.
Be specific and data-driven. Identify patterns the user might not notice.
Respond with JSON only.`;

    const userPrompt = `
Analyze these habit patterns:
${habitData.map(h => `- ${h.name}: ${h.completionRate}% completion, ${h.streakDays} day streak, best on ${h.bestDay}, worst on ${h.worstDay}`).join('\n')}

Provide:
1. 2-3 key insights (patterns you notice)
2. 2-3 specific recommendations
3. Predict which habit is most likely to be missed next (if any)

Respond with JSON:
{
  "insights": ["Insight 1", "Insight 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "predictedStruggle": "Habit name or null"
}`;

    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { complexity: 'balanced', maxTokens: 800, jsonMode: true }
    );

    return this.parseJSON(response.content);
  }

  /**
   * Generate identity statement (Atomic Habits style)
   */
  async generateIdentityStatement(
    goal: string,
    habits: string[]
  ): Promise<string> {
    const systemPrompt = `You are Resurgo AI, inspired by James Clear's Atomic Habits.
Create a powerful identity statement that starts with "I am becoming someone who..."
Make it personal, aspirational, and connected to their habits.
Respond with just the statement, no JSON.`;

    const userPrompt = `
Goal: ${goal}
Supporting habits: ${habits.join(', ')}

Generate a single, powerful identity statement (1 sentence).`;

    const response = await this.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { complexity: 'simple', maxTokens: 100 }
    );

    return response.content.trim().replace(/^["']|["']$/g, '');
  }
}

// Singleton instance
export const ascendAI = new AscendAIService('groq');
