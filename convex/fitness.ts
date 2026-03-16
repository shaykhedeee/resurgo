// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Fitness Workout Logs & Templates
// ─────────────────────────────────────────────────────────────────────────────

import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

async function getUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query('users')
    .withIndex('by_clerkId', (q: any) => q.eq('clerkId', identity.subject))
    .first();
}

const workoutTypeValidator = v.union(
  v.literal('cardio'),
  v.literal('strength'),
  v.literal('flexibility'),
  v.literal('sport'),
  v.literal('other'),
);

const exerciseValidator = v.object({
  name: v.string(),
  sets: v.optional(v.number()),
  reps: v.optional(v.number()),
  weight: v.optional(v.number()),
  weightUnit: v.optional(v.union(v.literal('kg'), v.literal('lb'))),
  durationSeconds: v.optional(v.number()),
  distance: v.optional(v.number()),
  distanceUnit: v.optional(v.union(v.literal('km'), v.literal('mi'))),
  notes: v.optional(v.string()),
});

export const logWorkout = mutation({
  args: {
    date: v.string(),
    type: workoutTypeValidator,
    name: v.optional(v.string()),
    durationMinutes: v.number(),
    notes: v.optional(v.string()),
    caloriesBurned: v.optional(v.number()),
    exercises: v.optional(v.array(exerciseValidator)),
  },
  returns: v.id('workoutLogs'),
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) throw new Error('Not authenticated');
    return await ctx.db.insert('workoutLogs', {
      userId: user._id,
      date: args.date,
      type: args.type,
      name: args.name,
      durationMinutes: args.durationMinutes,
      notes: args.notes,
      caloriesBurned: args.caloriesBurned,
      exercises: args.exercises,
      createdAt: Date.now(),
    });
  },
});

export const listWorkouts = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];
    const logs = await ctx.db
      .query('workoutLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();
    return logs
      .filter((l) => {
        if (args.startDate && l.date < args.startDate) return false;
        if (args.endDate && l.date > args.endDate) return false;
        return true;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getWeekStats = query({
  args: {},
  returns: v.object({
    totalWorkouts: v.number(),
    totalMinutes: v.number(),
    totalCalories: v.number(),
  }),
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return { totalWorkouts: 0, totalMinutes: 0, totalCalories: 0 };

    // Get workouts from the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const logs = await ctx.db
      .query('workoutLogs')
      .withIndex('by_userId', (q: any) => q.eq('userId', user._id))
      .collect();

    const recent = logs.filter((l) => l.date >= startDate);
    return {
      totalWorkouts: recent.length,
      totalMinutes: recent.reduce((sum, l) => sum + l.durationMinutes, 0),
      totalCalories: recent.reduce((sum, l) => sum + (l.caloriesBurned ?? 0), 0),
    };
  },
});

// ─── Workout Templates ─────────────────────────────────────────────────────

export const getWorkoutTemplates = query({
  args: {},
  returns: v.array(v.object({
    id: v.string(),
    name: v.string(),
    type: workoutTypeValidator,
    durationMinutes: v.number(),
    exercises: v.array(exerciseValidator),
    difficulty: v.union(v.literal('beginner'), v.literal('intermediate'), v.literal('advanced')),
    targetMuscles: v.array(v.string()),
  })),
  handler: async () => {
    return WORKOUT_TEMPLATES;
  },
});

const WORKOUT_TEMPLATES = [
  {
    id: 'push-day', name: 'Push Day (Chest/Shoulders/Tri)', type: 'strength' as const,
    durationMinutes: 45, difficulty: 'intermediate' as const,
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, weight: 60, weightUnit: 'kg' as const },
      { name: 'Overhead Press', sets: 3, reps: 10, weight: 40, weightUnit: 'kg' as const },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 12, weight: 20, weightUnit: 'kg' as const },
      { name: 'Lateral Raises', sets: 3, reps: 15, weight: 8, weightUnit: 'kg' as const },
      { name: 'Tricep Dips', sets: 3, reps: 12 },
      { name: 'Cable Flyes', sets: 3, reps: 15, weight: 10, weightUnit: 'kg' as const },
    ],
  },
  {
    id: 'pull-day', name: 'Pull Day (Back/Biceps)', type: 'strength' as const,
    durationMinutes: 45, difficulty: 'intermediate' as const,
    targetMuscles: ['back', 'biceps', 'rear delts'],
    exercises: [
      { name: 'Deadlift', sets: 4, reps: 6, weight: 80, weightUnit: 'kg' as const },
      { name: 'Pull-ups', sets: 4, reps: 8 },
      { name: 'Barbell Row', sets: 3, reps: 10, weight: 50, weightUnit: 'kg' as const },
      { name: 'Face Pulls', sets: 3, reps: 15, weight: 15, weightUnit: 'kg' as const },
      { name: 'Dumbbell Curls', sets: 3, reps: 12, weight: 12, weightUnit: 'kg' as const },
      { name: 'Hammer Curls', sets: 3, reps: 12, weight: 10, weightUnit: 'kg' as const },
    ],
  },
  {
    id: 'leg-day', name: 'Leg Day (Quads/Hams/Glutes)', type: 'strength' as const,
    durationMinutes: 50, difficulty: 'intermediate' as const,
    targetMuscles: ['quads', 'hamstrings', 'glutes', 'calves'],
    exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8, weight: 70, weightUnit: 'kg' as const },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, weight: 60, weightUnit: 'kg' as const },
      { name: 'Leg Press', sets: 3, reps: 12, weight: 100, weightUnit: 'kg' as const },
      { name: 'Walking Lunges', sets: 3, reps: 12, weight: 16, weightUnit: 'kg' as const },
      { name: 'Leg Curls', sets: 3, reps: 15, weight: 30, weightUnit: 'kg' as const },
      { name: 'Calf Raises', sets: 4, reps: 15, weight: 40, weightUnit: 'kg' as const },
    ],
  },
  {
    id: 'hiit-cardio', name: 'HIIT Cardio Blast', type: 'cardio' as const,
    durationMinutes: 25, difficulty: 'intermediate' as const,
    targetMuscles: ['full body', 'cardiovascular'],
    exercises: [
      { name: 'Burpees', sets: 4, reps: 10 },
      { name: 'Mountain Climbers', durationSeconds: 45 },
      { name: 'Jump Squats', sets: 4, reps: 15 },
      { name: 'High Knees', durationSeconds: 45 },
      { name: 'Box Jumps', sets: 4, reps: 10 },
      { name: 'Battle Ropes', durationSeconds: 30 },
    ],
  },
  {
    id: 'morning-stretch', name: 'Morning Mobility Flow', type: 'flexibility' as const,
    durationMinutes: 15, difficulty: 'beginner' as const,
    targetMuscles: ['full body', 'hip flexors', 'spine'],
    exercises: [
      { name: 'Cat-Cow Stretch', durationSeconds: 60 },
      { name: 'World\'s Greatest Stretch', sets: 2, reps: 5 },
      { name: 'Hip 90/90', durationSeconds: 60 },
      { name: 'Thoracic Rotation', sets: 2, reps: 8 },
      { name: 'Downward Dog to Cobra', sets: 3, reps: 5 },
      { name: 'Standing Hamstring Stretch', durationSeconds: 45 },
    ],
  },
  {
    id: 'beginner-full', name: 'Beginner Full Body', type: 'strength' as const,
    durationMinutes: 35, difficulty: 'beginner' as const,
    targetMuscles: ['full body'],
    exercises: [
      { name: 'Goblet Squat', sets: 3, reps: 12, weight: 10, weightUnit: 'kg' as const },
      { name: 'Push-ups', sets: 3, reps: 10 },
      { name: 'Dumbbell Row', sets: 3, reps: 10, weight: 8, weightUnit: 'kg' as const },
      { name: 'Plank Hold', durationSeconds: 45 },
      { name: 'Glute Bridge', sets: 3, reps: 15 },
      { name: 'Dead Bug', sets: 3, reps: 10 },
    ],
  },
];
