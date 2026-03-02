// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Goal Decomposition API Route (Cost-Optimized)
// Server-side AI endpoint for breaking down goals using Atomic Habits principles
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// ─────────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const GOOGLE_AI_KEY_BACKUP = process.env.GOOGLE_AI_STUDIO_KEY_BACKUP;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Use cheapest models - decomposition needs more capability
const MODELS = {
  groq: {
    free: 'llama-3.1-8b-instant',       // Free tier
    premium: 'llama-3.3-70b-versatile', // Better for complex decomposition
  },
  gemini: {
    free: 'gemini-1.5-flash',
    premium: 'gemini-1.5-pro',
  },
};

interface GoalDecompositionRequest {
  goal: string;
  targetDate?: string;
  category?: string;
  userContext?: string;
  isPremium?: boolean;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  tasks: DailyTask[];
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  dayOfWeek: number;
}

interface GoalDecompositionResponse {
  success: boolean;
  milestones?: Milestone[];
  weeklyObjectives?: string[];
  dailyHabits?: string[];
  identityStatement?: string;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// ATOMIC HABITS PROMPT
// ─────────────────────────────────────────────────────────────────────────────────

function buildDecompositionPrompt(goal: string, targetDate?: string): string {
  return `You are an expert goal coach using Atomic Habits principles by James Clear.

GOAL: "${goal}"
${targetDate ? `TARGET DATE: ${targetDate}` : ''}

APPLY THESE PRINCIPLES:
1. Identity-based: Start with WHO the person needs to become
2. 1% improvements: Break into tiny daily actions
3. Two-Minute Rule: Tasks should start with 2-minute versions
4. Habit Stacking: Link new habits to existing routines
5. Make it Easy: Reduce friction for each task

Respond with ONLY valid JSON:
{
  "identityStatement": "I am the type of person who [identity related to goal]",
  "milestones": [
    {
      "id": "m1",
      "title": "Milestone title (identity-focused)",
      "description": "What this milestone helps you become",
      "weekNumber": 1,
      "tasks": [
        {
          "id": "t1",
          "title": "Tiny task (Two-Minute Rule)",
          "description": "Start small: [2-min version]. Full: [full task]",
          "estimatedMinutes": 15,
          "dayOfWeek": 1
        }
      ]
    }
  ],
  "weeklyObjectives": ["Measurable weekly goal 1", "Measurable weekly goal 2"],
  "dailyHabits": [
    "After [existing habit], I will [new tiny habit]",
    "I will [habit] at [time] in [location]"
  ]
}

Create 3-4 milestones with 3-4 tasks each. Keep tasks tiny (10-30 min).
Daily habits should use habit stacking formula.`;
}

// ─────────────────────────────────────────────────────────────────────────────────
// AI PROVIDERS
// ─────────────────────────────────────────────────────────────────────────────────

async function callGroq(prompt: string, isPremium: boolean): Promise<unknown> {
  if (!GROQ_API_KEY) throw new Error('Groq API key not configured');

  const model = isPremium ? MODELS.groq.premium : MODELS.groq.free;
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'You are a JSON-only response bot. Always respond with valid JSON. No markdown.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: isPremium ? 2048 : 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  return parseJsonContent(content);
}

async function callGemini(prompt: string, isPremium: boolean, useBackup = false): Promise<unknown> {
  const apiKey = useBackup ? GOOGLE_AI_KEY_BACKUP : GOOGLE_AI_KEY;
  if (!apiKey) throw new Error('Google AI key not configured');

  const model = isPremium ? MODELS.gemini.premium : MODELS.gemini.free;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: isPremium ? 2048 : 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    if (!useBackup && GOOGLE_AI_KEY_BACKUP) {
      return callGemini(prompt, isPremium, true);
    }
    throw new Error(`Gemini API error: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return parseJsonContent(content);
}

async function callOpenRouter(prompt: string): Promise<unknown> {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API key not configured');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://resurgo.life',
      'X-Title': 'Resurgo Goal Decomposer',
    },
    body: JSON.stringify({
      model: 'google/gemma-2-9b-it:free',
      messages: [
        { role: 'system', content: 'You are a JSON-only response bot.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content || '';
  return parseJsonContent(content);
}

function parseJsonContent(content: string): unknown {
  let jsonStr = content.trim();
  
  // Remove markdown code blocks
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim();
  }
  
  // Clean up common issues
  jsonStr = jsonStr.replace(/^[^{\[]*/, '').replace(/[^}\]]*$/, '');
  
  try {
    return JSON.parse(jsonStr);
  } catch {
    // Try to extract object
    const objectMatch = content.match(/\{[\s\S]*\}/);
    if (objectMatch) return JSON.parse(objectMatch[0]);
    throw new Error('Failed to parse JSON response');
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// FALLBACK DATA (No AI cost)
// ─────────────────────────────────────────────────────────────────────────────────

function generateFallbackDecomposition(goal: string): GoalDecompositionResponse {
  const identityKeyword = goal.toLowerCase().includes('learn') ? 'learner'
    : goal.toLowerCase().includes('fitness') || goal.toLowerCase().includes('exercise') ? 'athlete'
    : goal.toLowerCase().includes('read') ? 'reader'
    : goal.toLowerCase().includes('write') ? 'writer'
    : goal.toLowerCase().includes('business') ? 'entrepreneur'
    : 'achiever';

  return {
    success: true,
    identityStatement: `I am the type of person who is a dedicated ${identityKeyword}`,
    milestones: [
      {
        id: 'm1',
        title: 'Foundation Week - Build the Identity',
        description: 'Start with tiny actions that prove you are becoming this person',
        weekNumber: 1,
        tasks: [
          {
            id: 't1',
            title: 'Define your identity statement',
            description: 'Start small: Write 1 sentence about who you want to become. Full: Create a vision board',
            estimatedMinutes: 10,
            dayOfWeek: 1,
          },
          {
            id: 't2',
            title: 'Design your environment',
            description: 'Start small: Make 1 cue visible. Full: Reorganize your space to support your goal',
            estimatedMinutes: 15,
            dayOfWeek: 2,
          },
          {
            id: 't3',
            title: 'Create your first habit stack',
            description: 'Start small: Write "After [habit], I will [new habit]". Full: Practice it once',
            estimatedMinutes: 10,
            dayOfWeek: 3,
          },
        ],
      },
      {
        id: 'm2',
        title: 'Week 2-3 - Make It Easy',
        description: 'Reduce friction and build momentum with Two-Minute versions',
        weekNumber: 2,
        tasks: [
          {
            id: 't4',
            title: 'Practice your Two-Minute version daily',
            description: 'Start small: 2 minutes only. Full: Gradually extend when ready',
            estimatedMinutes: 10,
            dayOfWeek: 1,
          },
          {
            id: 't5',
            title: 'Track your streak',
            description: 'Start small: Put an X on a calendar. Full: Use a habit tracker',
            estimatedMinutes: 5,
            dayOfWeek: 2,
          },
          {
            id: 't6',
            title: 'Review and adjust',
            description: 'Start small: Ask "Did I show up?". Full: Analyze what worked',
            estimatedMinutes: 15,
            dayOfWeek: 7,
          },
        ],
      },
      {
        id: 'm3',
        title: 'Week 4+ - Make It Satisfying',
        description: 'Add rewards and never miss twice',
        weekNumber: 4,
        tasks: [
          {
            id: 't7',
            title: 'Celebrate your streak milestone',
            description: 'Start small: Acknowledge progress. Full: Small reward',
            estimatedMinutes: 10,
            dayOfWeek: 1,
          },
          {
            id: 't8',
            title: 'Level up your habit',
            description: 'Start small: Add 1 more minute. Full: Increase challenge by 4%',
            estimatedMinutes: 20,
            dayOfWeek: 3,
          },
        ],
      },
    ],
    weeklyObjectives: [
      'Show up every day (even for 2 minutes)',
      'Never miss twice in a row',
      'Review progress weekly',
    ],
    dailyHabits: [
      `After I wake up, I will spend 2 minutes on my ${identityKeyword} habit`,
      `After I [existing habit], I will practice for 5 minutes`,
      'Before bed, I will mark my habit tracker',
    ],
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN API HANDLER
// ─────────────────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse<GoalDecompositionResponse>> {
  try {
    // ────────────────────────────────────────────────────────────────────────
    // 1) Verify authentication - prevent unauthorized API abuse
    // ────────────────────────────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json() as GoalDecompositionRequest;
    const { goal, targetDate } = body;

    // Determine premium status server-side — never trust the client
    const { currentUser } = await import('@clerk/nextjs/server');
    const clerkUser = await currentUser();
    const userPlan = (clerkUser?.publicMetadata as Record<string, unknown>)?.plan || 'free';
    const isPremium = userPlan === 'pro' || userPlan === 'lifetime';

    if (!goal || typeof goal !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Goal is required' },
        { status: 400 }
      );
    }

    const prompt = buildDecompositionPrompt(goal, targetDate);
    let result: {
      milestones: Milestone[];
      weeklyObjectives: string[];
      dailyHabits: string[];
      identityStatement?: string;
    };

    // Try AI providers in order of cost efficiency
    try {
      result = await callGroq(prompt, isPremium) as typeof result;
    } catch (groqError) {
      console.warn('Groq failed for decomposition:', (groqError as Error).message);
      try {
        result = await callGemini(prompt, isPremium) as typeof result;
      } catch (geminiError) {
        console.warn('Gemini failed for decomposition:', (geminiError as Error).message);
        try {
          result = await callOpenRouter(prompt) as typeof result;
        } catch (openRouterError) {
          console.warn('OpenRouter failed, using fallback:', (openRouterError as Error).message);
          // Return intelligent fallback based on Atomic Habits
          return NextResponse.json(generateFallbackDecomposition(goal));
        }
      }
    }

    return NextResponse.json({
      success: true,
      milestones: result.milestones,
      weeklyObjectives: result.weeklyObjectives,
      dailyHabits: result.dailyHabits,
      identityStatement: result.identityStatement,
    });
  } catch (error) {
    console.error('Goal decomposition error:', error);
    // Return fallback instead of error
    const body = await request.clone().json().catch(() => ({ goal: 'your goal' }));
    return NextResponse.json(generateFallbackDecomposition(body.goal || 'your goal'));
  }
}
