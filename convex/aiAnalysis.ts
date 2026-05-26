import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const autoSeedPlannerFromBrainDump = mutation({
  args: {
    rawText: v.string(),
    analysisResult: v.any(),
  },
  handler: async (ctx, { rawText, analysisResult }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Unauthenticated: User identity is required to seed the planner.');
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_clerkId', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) {
      throw new Error('User record not found in database.');
    }

    const userId = user._id;
    const now = Date.now();
    const rawResult = analysisResult;

    const brainDumpId = await ctx.db.insert('brainDump', {
      userId,
      rawText,
      structured: {
        goals: rawResult.goals || [],
        fears: rawResult.psychometric_analysis?.limiting_beliefs || rawResult.struggles || [],
        constraints: rawResult.emotions_detected || [],
        energyProfile: rawResult.archetype || rawResult.psychometric_analysis?.coaching_persona?.name || 'Explorer',
        suggestedHabits: (rawResult.habits_suggested || []).map((h: any) => h.name),
      },
      analysisStatus: 'completed',
      analysisVersion: JSON.stringify({
        aiSummary: rawResult.emotional_acknowledgment || 'Processed via Onboarding Cascade',
        processedAt: now,
      }),
      createdAt: now,
      updatedAt: now,
    });

    const psych = rawResult.psychometric_analysis;
    const coachStyle = psych?.coaching_persona?.style;

    let selectedCoach: 'MARCUS' | 'AURORA' | 'TITAN' | 'SAGE' | 'PHOENIX' | 'NOVA' | 'ORACLE' | 'NEXUS' | 'ZENON' =
      'NEXUS';
    if (coachStyle === 'supportive') {
      selectedCoach = 'AURORA';
    } else if (coachStyle === 'challenging') {
      selectedCoach = 'TITAN';
    } else if (coachStyle === 'humorous') {
      selectedCoach = 'MARCUS';
    }

    const chronobiology = psych?.chronobiology_markers;
    const userUpdates: Record<string, any> = {
      onboardingComplete: true,
      updatedAt: now,
      selectedCoach,
    };

    if (coachStyle) userUpdates.coachPersonality = coachStyle;
    if (chronobiology?.recommended_wake_time) userUpdates.wakeTime = chronobiology.recommended_wake_time;
    if (chronobiology?.recommended_sleep_time) userUpdates.sleepTime = chronobiology.recommended_sleep_time;
    if (chronobiology?.peak_focus_window) userUpdates.peakProductivityTime = chronobiology.peak_focus_window;
    if (rawResult.archetype) {
      userUpdates.archetype = rawResult.archetype;
    } else if (psych?.coaching_persona?.name) {
      userUpdates.archetype = psych.coaching_persona.name;
    }

    await ctx.db.patch(userId, userUpdates);

    const existingIntelligence = await ctx.db
      .query('userIntelligenceModel')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .first();

    const energyLoad = psych?.executive_functioning_load ?? 5;
    const hasAdhd = !!(psych?.adhd_markers && psych.adhd_markers.length > 0);
    const intelligenceData = {
      userId,
      energyLevel: Math.max(1, 10 - energyLoad),
      stressScore: energyLoad,
      chronotype: (chronobiology?.chronotype || 'morning') as 'morning' | 'afternoon' | 'evening' | 'irregular',
      adhdFlag: hasAdhd,
      lastAnalyzedAt: now,
      updatedAt: now,
    };

    if (existingIntelligence) {
      await ctx.db.patch(existingIntelligence._id, intelligenceData);
    } else {
      await ctx.db.insert('userIntelligenceModel', {
        ...intelligenceData,
        createdAt: now,
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const habits = rawResult.habits_suggested || [];
    for (let i = 0; i < habits.length; i++) {
      const habit = habits[i];
      const habitId = await ctx.db.insert('habits', {
        userId,
        title: habit.name,
        description: habit.reason,
        category: 'PERSONAL',
        frequency: habit.frequency || 'daily',
        timeOfDay: 'anytime',
        isActive: true,
        streakCurrent: 0,
        streakLongest: 0,
        createdAt: now,
        updatedAt: now,
      });

      await ctx.db.insert('executionStream', {
        userId,
        dateKey: todayStr,
        sourceType: 'habit',
        sourceId: habitId,
        title: habit.name,
        detail: habit.reason,
        priority: 'medium',
        status: 'pending',
        sortOrder: i + 10,
        createdAt: now,
        updatedAt: now,
      });
    }

    const tasks = rawResult.tasks || [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
      if (task.priority === 'CRITICAL') priority = 'urgent';
      else if (task.priority === 'HIGH') priority = 'high';
      else if (task.priority === 'LOW') priority = 'low';

      let energyRequired: 'low' | 'medium' | 'high' | undefined;
      if (task.energy_level === 'high') energyRequired = 'high';
      else if (task.energy_level === 'medium') energyRequired = 'medium';
      else if (task.energy_level === 'low') energyRequired = 'low';

      const taskDateKey = task.suggested_due || todayStr;
      const taskId = await ctx.db.insert('tasks', {
        userId,
        title: task.title,
        description: task.relates_to_goal || undefined,
        priority,
        status: 'todo',
        scheduledDate: taskDateKey,
        estimatedMinutes: task.estimated_minutes || undefined,
        energyRequired,
        isRecurring: task.is_recurring,
        source: 'ai_generated',
        createdAt: now,
        updatedAt: now,
      });

      await ctx.db.insert('executionStream', {
        userId,
        dateKey: taskDateKey,
        sourceType: 'task',
        sourceId: taskId,
        title: task.title,
        detail: task.relates_to_goal || undefined,
        priority: priority === 'urgent' ? 'critical' : priority,
        status: 'pending',
        sortOrder: i,
        estimateMinutes: task.estimated_minutes || undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    return {
      success: true,
      brainDumpId,
      tasksSeeded: tasks.length,
      habitsSeeded: habits.length,
      coachPersona: psych?.coaching_persona,
      userIntelligence: {
        adhdFlag: hasAdhd,
        executiveFunctioningLoad: energyLoad,
        chronotype: chronobiology?.chronotype,
      },
    };
  },
});
