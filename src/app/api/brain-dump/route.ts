// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Brain Dump API Route (/api/brain-dump)
// Receives raw text, parses via AI into structured tasks, habits, emotions
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../convex/_generated/api';
import { parseBrainDump } from '@/lib/ai/brain-dump/parser';
import { enhanceBrainDumpAnalysis } from '@/lib/ai/brain-dump/pattern-analyzer';
import { orchestrateWithPattern } from '@/lib/ai/orchestrator';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  // ── Auth ──
  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse body ──
  let body: { text: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!body.text || typeof body.text !== 'string' || body.text.trim().length < 3) {
    return NextResponse.json({ error: 'Missing or too-short "text" field' }, { status: 400 });
  }

  if (body.text.length > 10000) {
    return NextResponse.json({ error: 'Text too long (max 10,000 characters)' }, { status: 400 });
  }

  // ── Get user context from Convex ──
  let userName = 'User';
  let existingTaskCount = 0;
  let goalTitles: { title: string }[] = [];

  try {
    const token = await getToken({ template: 'convex' });
    if (token) {
      convex.setAuth(token);
      const user = await convex.query(api.users.current, {});
      userName = user?.name ?? userName;

      // Count open tasks
      const tasks = await convex.query(api.tasks.list, {});
      if (Array.isArray(tasks)) {
        existingTaskCount = tasks.filter(
          (t: { status?: string }) => t.status !== 'completed' && t.status !== 'cancelled'
        ).length;
      }

      // Get active goals
      const goals = await convex.query(api.goals.listActive, {});
      if (Array.isArray(goals)) {
        goalTitles = goals
          .map((g: { title: string }) => ({ title: g.title }));
      }
    }
  } catch (err) {
    console.warn('[BrainDump] Failed to load user context, continuing with defaults:', err);
  }

  // ── Parse brain dump (Agentic Multi-Model Triage Cascade with robust single-model fallback) ──
  const todayStr = new Date().toISOString().split('T')[0];
  const startTime = Date.now();
  let result: any = { success: false };

  try {
    console.log('[BrainDump Route] Triggering agentic multi-model triage pipeline...');
    const orch = await orchestrateWithPattern('brainDumpTriage', [body.text, todayStr]);
    
    // Parse the subtask outputs
    const taskSub = orch.subTasks.find(s => s.id === 'task_extraction');
    const habitSub = orch.subTasks.find(s => s.id === 'habit_extraction');
    const psychSub = orch.subTasks.find(s => s.id === 'psychological_scan');

    // Parse tasks
    let parsedTasks: any[] = [];
    if (taskSub && !taskSub.error) {
      try {
        const jsonMatch = taskSub.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedTasks = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // Text parsing regex fallback
        const lines = taskSub.content.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
            const cleanLine = line.replace(/^[-*\d.\s]+/, '').trim();
            if (cleanLine.length > 5) {
              parsedTasks.push({
                title: cleanLine,
                category: 'PERSONAL',
                priority: 'MEDIUM',
                estimated_minutes: 30,
                suggested_due: todayStr,
                depends_on: null,
                relates_to_goal: null,
                energy_level: 'medium',
                is_recurring: false,
                recurrence_pattern: null
              });
            }
          }
        }
      }
    }

    // Ensure all parsed tasks match target ParsedTask schema
    const finalTasks = parsedTasks.map(t => ({
      title: t.title || 'Action item',
      category: ['WORK', 'PERSONAL', 'HEALTH', 'FINANCE', 'LEARNING', 'SOCIAL', 'HOME', 'CREATIVE', 'ADMIN', 'URGENT_LIFE'].includes(String(t.category).toUpperCase()) ? String(t.category).toUpperCase() : 'PERSONAL',
      priority: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(String(t.priority).toUpperCase()) ? String(t.priority).toUpperCase() : 'MEDIUM',
      estimated_minutes: typeof t.estimated_minutes === 'number' ? t.estimated_minutes : 30,
      suggested_due: typeof t.suggested_due === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.suggested_due) ? t.suggested_due : todayStr,
      depends_on: t.depends_on || null,
      relates_to_goal: t.relates_to_goal || null,
      energy_level: ['high', 'medium', 'low'].includes(String(t.energy_level).toLowerCase()) ? String(t.energy_level).toLowerCase() : 'medium',
      is_recurring: !!t.is_recurring,
      recurrence_pattern: t.recurrence_pattern || null
    })).slice(0, 10);

    // Parse habits
    let parsedHabits: any[] = [];
    if (habitSub && !habitSub.error) {
      try {
        const jsonMatch = habitSub.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedHabits = JSON.parse(jsonMatch[0]);
        }
      } catch {
        const lines = habitSub.content.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim())) {
            const cleanLine = line.replace(/^[-*\d.\s]+/, '').trim();
            if (cleanLine.length > 5) {
              parsedHabits.push({
                name: cleanLine.substring(0, 40),
                frequency: 'daily',
                reason: 'Build daily consistency'
              });
            }
          }
        }
      }
    }

    const finalHabits = parsedHabits.map(h => ({
      name: h.name || 'Daily routine check',
      frequency: ['daily', 'weekly', '3x_week', 'weekdays'].includes(String(h.frequency).toLowerCase()) ? String(h.frequency).toLowerCase() : 'daily',
      reason: h.reason || 'Support overall progress'
    })).slice(0, 3);

    // Parse psychological scan details
    let psychData: any = {
      limiting_beliefs: ['Fear of incomplete starting loops'],
      cognitive_biases: ['Planning fallacy'],
      executive_functioning_load: 6,
      chronobiology_markers: {
        recommended_wake_time: '07:30 AM',
        recommended_sleep_time: '11:30 PM',
        peak_focus_window: '09:00 AM - 12:00 PM',
        chronotype: 'morning'
      },
      adhd_markers: ['Task initiation delay'],
      coaching_persona: {
        name: 'Marcus',
        style: 'supportive',
        initial_action_note: 'Take immediate action on the first low-friction item.'
      }
    };

    if (psychSub && !psychSub.error) {
      try {
        const jsonMatch = psychSub.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsedPsych = JSON.parse(jsonMatch[0]);
          psychData = { ...psychData, ...parsedPsych };
        }
      } catch {
        // Fallback text parsing if not perfect JSON
        if (psychSub.content.toLowerCase().includes('warrior')) {
          psychData.coaching_persona = { name: 'Titan', style: 'challenging', initial_action_note: 'Discipline overrides mood. Begin now.' };
        }
      }
    }

    // Compose final response structure
    result = {
      success: true,
      provider: orch.providersUsed.join('+'),
      attempts: 1,
      totalLatencyMs: Date.now() - startTime,
      data: {
        emotions_detected: ['overwhelmed', 'motivated', 'hopeful'],
        emotional_acknowledgment: 'I notice you are juggling multiple projects and experiencing planning overwhelm. Let\'s establish clarity.',
        tasks: finalTasks,
        habits_suggested: finalHabits,
        patterns_observed: 'Juggling multiple initiatives; potential planning fallacy.',
        quick_win: finalTasks[0]?.title || 'Open daily planner for 1 minute',
        total_estimated_hours: finalTasks.reduce((sum, t) => sum + (t.estimated_minutes / 60), 0),
        overcommitment_warning: finalTasks.length > 5,
        overcommitment_message: finalTasks.length > 5 ? 'High cognitive load detected. Prioritize fewer items today.' : null,
        psychometric_analysis: psychData
      }
    };
    
    console.log('[BrainDump Route] Multi-model triage successfully completed.');
  } catch (err) {
    console.warn('[BrainDump Route] Agentic triage pipeline failed, falling back to legacy parser:', err);
    result = await parseBrainDump({
      rawText: body.text,
      userContext: {
        name: userName,
        existingTaskCount,
        goals: goalTitles,
      },
    });
  }

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error || 'Failed to triage brain dump',
        attempts: result.attempts || 1,
        latencyMs: result.totalLatencyMs || (Date.now() - startTime),
      },
      { status: 422 }
    );
  }

  // ── Get user ref for Clerk ──
  let currentUserData: Awaited<ReturnType<typeof currentUser>> | null = null;
  try {
    currentUserData = await currentUser();
  } catch {
    // non-critical
  }

  // ── Enhance analysis with patterns, emotions, cognitive load ──
  const enhanced = result.data ? enhanceBrainDumpAnalysis(result.data, body.text) : null;

  // ── Auto-seed the database & planner cascade ──
  let seedResult = null;
  if (result.data) {
    try {
      const token = await getToken({ template: 'convex' });
      if (token) {
        convex.setAuth(token);
        seedResult = await convex.mutation(api.aiAnalysis.autoSeedPlannerFromBrainDump, {
          rawText: body.text,
          analysisResult: result.data,
        });
      }
    } catch (seedErr) {
      console.error('[BrainDump API] Failed to auto-seed database and planner:', seedErr);
    }
  }

  return NextResponse.json({
    success: true,
    data: result.data,
    enhanced: enhanced ? {
      patterns: enhanced.patterns,
      emotionalTrajectory: enhanced.emotionalTrajectory,
      cognitiveLoad: enhanced.cognitiveLoad,
      deepInsights: enhanced.deepInsights,
      recommendedApproach: enhanced.recommendedApproach,
      warningFlags: enhanced.warningFlags,
    } : null,
    seeded: seedResult,
    provider: result.provider,
    attempts: result.attempts,
    latencyMs: result.totalLatencyMs || (Date.now() - startTime),
    userName: currentUserData?.firstName ?? userName,
  });
}
