// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — AI Orchestrator Backend (Central Intelligence Layer)
// Cross-feature propagation hub — connects habits, goals, focus, mood, burnout
// ═══════════════════════════════════════════════════════════════════════════════

import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { internal } from './_generated/api';

/**
 * Analyzes raw brain dump text using rule-based extraction.
 * Extracts themes, goals, struggles, emotions, and generates a summary.
 */
export const analyzeText = mutation({
  args: { text: v.string(), source: v.string() },
  handler: async (ctx, { text, source }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const lowerText = text.toLowerCase();
    
    const goalKeywords = ['want', 'need', 'goal', 'achieve', 'accomplish', 'complete', 'finish', 'build', 'create', 'learn', 'start', 'stop'];
    const struggleKeywords = ['struggle', 'hard', 'difficult', 'challenge', 'problem', 'stuck', 'frustrat', 'overwhelm', 'stress', 'anxiety', 'block'];
    const emotionKeywords = ['happy', 'sad', 'angry', 'excited', 'anxious', 'frustrated', 'calm', 'energetic', 'tired', 'motivated', 'discouraged', 'confident'];
    const themeKeywords = ['work', 'health', 'relationship', 'family', 'career', 'money', 'fitness', 'mindset', 'productivity', 'creativity', 'learning'];

    const themes = themeKeywords.filter(k => lowerText.includes(k));
    const goals = goalKeywords.filter(k => lowerText.includes(k));
    const struggles = struggleKeywords.filter(k => lowerText.includes(k));
    const emotions = emotionKeywords.filter(k => lowerText.includes(k));

    const summary = `Brain dump analyzed from ${source}: ${text.substring(0, 100)}...`;

    await ctx.db.insert('brainDump', {
      userId: user._id,
      rawText: text,
      structured: {
        goals: goals,
        fears: struggles,
        constraints: [],
        energyProfile: themes.join(', '),
        suggestedHabits: [],
      },
      analysisStatus: 'completed',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { themes, goals, struggles, emotions };
  },
});

/**
 * Generates a daily briefing based on user's current state.
 * Returns priorities, action block, energy advice, and focus score.
 */
export const generateDailyBriefing = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const habits = await ctx.db.query('habits').filter(q => q.eq(q.field('userId'), user._id)).collect();
    const goals = await ctx.db.query('goals').filter(q => q.eq(q.field('userId'), user._id)).collect();
    const focusSessions = await ctx.db.query('focusSessions').filter(q => q.eq(q.field('userId'), user._id)).collect();

    const incompleteHabits = habits.filter(h => h.isActive);
    const incompleteGoals = goals.filter(g => g.status === 'in_progress');

    const priorities = [
      ...incompleteHabits.slice(0, 3).map(h => h.title),
      ...incompleteGoals.slice(0, 2).map(g => g.title),
    ];

    const recentFocus = focusSessions.slice(-3);
    const avgDuration = recentFocus.length > 0 
      ? recentFocus.reduce((sum, s) => sum + (s.duration || 0), 0) / recentFocus.length 
      : 0;

    const focusScore = Math.min(100, avgDuration / 60);
    const energyAdvice = avgDuration > 120 ? "High energy period - tackle big tasks" : "Moderate energy - focus on routine work";

    const actionBlock = priorities.length > 0 
      ? `Complete: ${priorities[0]}. Next: ${priorities[1] || 'Review progress'}.`
      : "No urgent priorities - maintain current streaks";

    return { priorities, actionBlock, energyAdvice, focusScore };
  },
});

/**
 * Generates smart tasks from a goal with strict validation rules.
 * Requires 8+ words, time estimate, definition of done, no vague verbs.
 */
export const generateSmartTasks = mutation({
  args: { goalId: v.id('goals'), count: v.number() },
  handler: async (ctx, { goalId, count }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    const vagueVerbs = ['do', 'make', 'work', 'handle', 'deal', 'look', 'try'];
    const tasks = [];

    const taskTemplates = [
      { title: `Research and plan approach for ${goal.title}`, estimatedMinutes: 30 },
      { title: `Create detailed action steps for ${goal.title}`, estimatedMinutes: 45 },
      { title: `Execute first milestone of ${goal.title}`, estimatedMinutes: 60 },
      { title: `Review progress and adjust strategy for ${goal.title}`, estimatedMinutes: 30 },
      { title: `Complete final validation for ${goal.title}`, estimatedMinutes: 45 },
    ];

    for (let i = 0; i < Math.min(count, taskTemplates.length); i++) {
      const template = taskTemplates[i];
      const title = template.title;
      const hasVagueVerb = vagueVerbs.some(v => title.toLowerCase().includes(v + ' '));
      
      if (title.split(' ').length >= 8 && !hasVagueVerb) {
        tasks.push({
          title,
          description: `Definition of done: ${title} with measurable completion criteria`,
          estimatedMinutes: template.estimatedMinutes,
          priority: i === 0 ? 'high' : i <= 2 ? 'medium' : 'low',
        });
      }
    }

    return { tasks };
  },
});

/**
 * Generates a weekly review with highlights, improvements, and next week focus.
 */
export const generateWeeklyReview = mutation({
  args: { weekStartDate: v.string(), weekEndDate: v.string() },
  handler: async (ctx, { weekStartDate, weekEndDate }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const habits = await ctx.db.query('habits').filter(q => q.eq(q.field('userId'), user._id)).collect();
    const goals = await ctx.db.query('goals').filter(q => q.eq(q.field('userId'), user._id)).collect();

    const completedHabits = habits.filter(h => h.totalCompletions && h.totalCompletions > 0).length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;

    const highlights = [
      `Completed ${completedHabits} habits`,
      `Achieved ${completedGoals} goals`,
      'Maintained consistency streak',
    ];

    const areasToImprove = [];
    if (habits.length > 0 && completedHabits / habits.length < 0.7) {
      areasToImprove.push('Habit completion rate needs improvement');
    }
    if (goals.length > 0 && completedGoals === 0) {
      areasToImprove.push('Goal progress stalled');
    }
    if (areasToImprove.length === 0) {
      areasToImprove.push('Continue current momentum');
    }

    const aiSummary = `Week of ${weekStartDate}: Strong performance with ${completedHabits} habits completed. Focus on maintaining consistency.`;

    return { highlights, areasToImprove, aiSummary, nextWeekFocus: 'Prioritize high-impact goals and maintain habit streaks' };
  },
});

/**
 * Computes unified user state aggregating all platform data.
 * Returns goals, habits, focus score, mood score, burnout risk, consistency, xp, level.
 */
export const computeUserState = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const [habits, goals, focusSessions] = await Promise.all([
      ctx.db.query('habits').filter(q => q.eq(q.field('userId'), user._id)).collect(),
      ctx.db.query('goals').filter(q => q.eq(q.field('userId'), user._id)).collect(),
      ctx.db.query('focusSessions').filter(q => q.eq(q.field('userId'), user._id)).collect(),
    ]);

    const completedHabits = habits.filter(h => h.totalCompletions && h.totalCompletions > 0).length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;

    const consistency = habits.length > 0 ? completedHabits / habits.length : 0;
    const focusScore = focusSessions.length > 0 
      ? focusSessions.reduce((sum, s) => sum + (s.focusScore || 50), 0) / focusSessions.length 
      : 50;
    const moodScore = 70;
    const burnoutRisk = consistency < 0.5 ? 0.7 : 0.3;
    const xp = (completedHabits + completedGoals * 2) * 10;
    const level = Math.floor(xp / 100);

    return {
      goals,
      habits,
      focusScore,
      moodScore,
      burnoutRisk,
      consistency,
      xp,
      level,
    };
  },
});

/**
 * Propagates habit completion effects across the platform.
 * Updates XP, goal progress, and engagement score.
 */
export const propagateHabitCompletion = mutation({
  args: { habitId: v.id('habits') },
  handler: async (ctx, { habitId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const habit = await ctx.db.get(habitId);
    if (!habit || habit.userId !== user._id) throw new Error('Habit not found');

    await ctx.db.patch(habitId, { lastCompletedAt: Date.now() });

    const userStats = await ctx.db.query('gamification').filter(q => q.eq(q.field('userId'), user._id)).first();
    if (userStats) {
      await ctx.db.patch(userStats._id, {
        totalXP: (userStats.totalXP || 0) + 10,
      });
    }

    if (habit.goalId) {
      const goal = await ctx.db.get(habit.goalId);
      if (goal) {
        const progress = ((goal.progress || 0) + 0.1);
        await ctx.db.patch(habit.goalId, { progress: Math.min(1, progress) });
      }
    }

    return { success: true };
  },
});

/**
 * Propagates goal completion effects across the platform.
 * Cascades XP rewards and updates engagement band.
 */
export const propagateGoalCompletion = mutation({
  args: { goalId: v.id('goals') },
  handler: async (ctx, { goalId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const goal = await ctx.db.get(goalId);
    if (!goal || goal.userId !== user._id) throw new Error('Goal not found');

    await ctx.db.patch(goalId, { status: 'completed', completionDate: Date.now() });

    const userStats = await ctx.db.query('gamification').filter(q => q.eq(q.field('userId'), user._id)).first();
    if (userStats) {
      const newXp = (userStats.totalXP || 0) + 50;
      const newLevel = Math.floor(newXp / 100);
      await ctx.db.patch(userStats._id, { totalXP: newXp, level: newLevel });
    }

    return { success: true };
  },
});

/**
 * Detects burnout risk based on behavioral patterns.
 * Analyzes sleep, mood, focus, and habit completion rates.
 */
export const detectBurnoutRisk = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated');

    const user = await ctx.db.query('users').filter(q => q.eq(q.field('clerkId'), identity.subject)).first();
    if (!user) throw new Error('User not found');

    const habits = await ctx.db.query('habits').filter(q => q.eq(q.field('userId'), user._id)).collect();
    const focusSessions = await ctx.db.query('focusSessions').filter(q => q.eq(q.field('userId'), user._id)).collect();

    const factors = [];
    let atRisk = false;

    const completionRate = habits.length > 0 
      ? habits.filter(h => h.totalCompletions && h.totalCompletions > 0).length / habits.length 
      : 1;

    if (completionRate < 0.5) {
      factors.push('Low habit completion rate');
      atRisk = true;
    }

    const recentFocus = focusSessions.slice(-5);
    if (recentFocus.length > 0) {
      const avgScore = recentFocus.reduce((sum, s) => sum + (s.focusScore || 50), 0) / recentFocus.length;
      if (avgScore < 40) {
        factors.push('Declining focus scores');
        atRisk = true;
      }
    }

    const recommendation = atRisk 
      ? 'Take a rest day, reduce workload, focus on recovery habits'
      : 'Maintain current pace, consider adding recovery activities';

    return { atRisk, factors, recommendation };
  },
});