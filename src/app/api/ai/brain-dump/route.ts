// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump Analysis API (/api/ai/brain-dump)
// Processes raw user text through AI for onboarding intelligence
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { callAIJson } from '@/lib/ai/provider-router';

export const maxDuration = 30;

// Helper: fallback analysis when all AI providers are unavailable
function generateFallbackAnalysis(text: string) {
  const lower = text.toLowerCase();

  const themeMap: Record<string, string[]> = {
    health: ['health', 'fitness', 'exercise', 'sleep', 'energy', 'body', 'workout', 'nutrition'],
    career: ['work', 'career', 'job', 'business', 'professional', 'promotion'],
    finance: ['money', 'finance', 'budget', 'debt', 'savings', 'invest', 'income'],
    relationships: ['relationship', 'family', 'friend', 'partner', 'people', 'social'],
    learning: ['learn', 'skill', 'knowledge', 'read', 'study', 'course', 'education'],
    creativity: ['creative', 'art', 'music', 'write', 'design', 'project', 'hobby'],
    mindfulness: ['meditate', 'mindful', 'calm', 'peace', 'anxiety', 'stress', 'mental'],
    personal_growth: ['grow', 'improve', 'better', 'habit', 'discipline', 'routine', 'system'],
  };

  const themes = Object.entries(themeMap)
    .filter(([_, keywords]) => keywords.some((k) => lower.includes(k)))
    .map(([domain]) => domain);

  const goalKeywords = ['want', 'need', 'goal', 'achieve', 'build', 'create', 'learn', 'start'];
  const struggleKeywords = ['struggle', 'hard', 'fail', 'stuck', 'cant', 'overwhelm', 'stress', 'anxiety'];
  const emotionKeywords = ['happy', 'sad', 'angry', 'excited', 'anxious', 'frustrated', 'calm', 'tired', 'motivated', 'discouraged'];

  const goals = goalKeywords.filter((k) => lower.includes(k));
  const struggles = struggleKeywords.filter((k) => lower.includes(k));
  const emotions = emotionKeywords.filter((k) => lower.includes(k));

  const archetype =
    goals.length > 2 && struggles.length > 1 ? 'The Rebuilder' :
    goals.length > 0 ? 'The Achiever' :
    'The Explorer';

  const todayStr = new Date().toISOString().split('T')[0];

  return {
    themes: themes.length > 0 ? themes : ['personal_growth'],
    goals: goals.length > 0 ? goals : ['self-improvement'],
    struggles,
    emotions,
    archetype,
    priorityFocus: themes.slice(0, 3),
    confidence: 0.6,
    fallback: true,
    suggestedGoals: goals.length > 0 ? goals.map(g => `Goal: ${g}`) : ['Build daily consistency'],
    suggestedHabits: [
      { title: 'Morning hydration (500ml water)', frequency: 'daily', domain: 'health' },
      { title: 'Review today\'s planner tasks', frequency: 'daily', domain: 'personal_growth' }
    ],
    suggestedTasks: [
      { title: 'Complete today\'s first focus block', priority: 'high', dueDate: todayStr },
      { title: 'Log my current fitness weights', priority: 'medium', dueDate: todayStr }
    ]
  };
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text, source = 'onboarding' } = body as { text: string; source?: string };

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Text must be at least 10 characters' },
        { status: 400 }
      );
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Step 1: AI-powered deep analysis
    const SYSTEM_PROMPT = `You are Resurgo's Brain Dump Analyzer. Process the raw text to extract structured insights.
    
Return ONLY this JSON structure:
{
  "themes": string[],        // Life domains: health, career, finance, relationships, learning, creativity, mindfulness, personal_growth
  "goals": string[],         // Extracted goals/aspirations
  "struggles": string[],     // Challenges and pain points
  "emotions": string[],      // Emotional state indicators
  "archetype": string,       // One of: The Achiever, The Rebuilder, The Explorer, The Optimizer, The Warrior, The Transformer
  "priorityFocus": string[], // Top 3 focus areas needing attention
  "confidence": number,      // 0-100 confidence in analysis
  "suggestedGoals": string[], // Refined, clean, actionable goal statements (max 3)
  "suggestedHabits": { "title": string, "frequency": string, "domain": string }[], // Suggested simple habits to start (max 3)
  "suggestedTasks": { "title": string, "priority": "high" | "medium" | "low", "dueDate": string }[] // Suggested immediate action tasks (max 4). Today's date is: ${todayStr}. All task dueDates should be formatted as YYYY-MM-DD and set to today or tomorrow.
}

Analyze the actual text content. Be specific and reference what they wrote.`;

    const userMessage = `SOURCE: ${source}
LENGTH: ${text.split(' ').length} words, ${text.length} chars

TEXT:
${text}`;

    let analysis: any;
    try {
      const result = await callAIJson([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ], { taskType: 'analyze', maxTokens: 1536 });

      analysis = result.data;
    } catch (aiErr) {
      console.error('[BrainDump] AI analysis failed, using fallback:', aiErr);
      analysis = generateFallbackAnalysis(text);
    }

    // Step 2: Store raw brain dump for later processing
    // The Convex action handles the actual DB write
    // This is fire-and-forget so it doesn't block the response
    try {
      await fetch('/api/v1/brain-dump/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source, analysis }),
      });
    } catch (storeErr) {
      console.warn('[BrainDump] Background store failed:', storeErr);
    }

    return NextResponse.json({
      success: true,
      analysis,
      stats: {
        wordCount: text.split(/\s+/).length,
        charCount: text.length,
        themesFound: analysis.themes?.length ?? 0,
        goalsFound: analysis.goals?.length ?? 0,
        strugglesFound: analysis.struggles?.length ?? 0,
      },
      processedAt: Date.now(),
    });
  } catch (err) {
    console.error('[BrainDump API] Error:', err);
    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}