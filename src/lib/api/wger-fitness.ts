// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — wger Workout Manager API Client
// Comprehensive fitness exercise database. Completely free, no key required.
// https://wger.de/api/v2/
// ═══════════════════════════════════════════════════════════════════════════════

const WGER_BASE = 'https://wger.de/api/v2';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface MuscleGroup {
  id: number;
  name: string;
  nameEn: string;
  isFront: boolean;
  imageUrlMain: string | null;
  imageUrlSecondary: string | null;
}

export interface Equipment {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId: number;
  muscles: MuscleGroup[];
  musclesSecondary: MuscleGroup[];
  equipment: Equipment[];
  images: string[];
  variations: number[];
}

export interface WorkoutSet {
  exerciseId: number;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  restSeconds: number;
  notes?: string;
}

export interface WorkoutDay {
  name: string;
  description: string;
  exercises: WorkoutSet[];
  targetMuscles: string[];
  estimatedMinutes: number;
}

export interface WorkoutRoutine {
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  days: WorkoutDay[];
  goals: string[];
}

export interface ProgressionRule {
  exerciseId: number;
  metric: 'weight' | 'reps' | 'sets';
  incrementValue: number;
  incrementFrequency: 'session' | 'week' | 'milestone';
  condition: string;
}

export interface WorkoutLog {
  date: string;
  dayName: string;
  exercises: Array<{
    exerciseId: number;
    exerciseName: string;
    sets: Array<{ reps: number; weight: number; completed: boolean }>;
  }>;
  totalVolume: number;
  duration: number;
  notes: string;
}

export interface FitnessProfile {
  level: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  availableEquipment: number[];
  daysPerWeek: number;
  sessionMinutes: number;
  injuries: string[];
  preferredMuscles: number[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

export const EXERCISE_CATEGORIES: Record<number, string> = {
  8: 'Arms',
  9: 'Legs',
  10: 'Abs',
  11: 'Chest',
  12: 'Back',
  13: 'Shoulders',
  14: 'Calves',
  15: 'Cardio',
  16: 'Stretching',
};

export const MUSCLE_IDS: Record<string, number> = {
  'Biceps brachii': 1,
  'Anterior deltoid': 2,
  'Serratus anterior': 6,
  'Pectoralis major': 4,
  'Triceps brachii': 5,
  'Rectus abdominis': 10,
  'Gastrocnemius': 7,
  'Gluteus maximus': 8,
  'Trapezius': 9,
  'Quadriceps femoris': 11,
  'Hamstrings': 12,
  'Latissimus dorsi': 13,
  'Brachialis': 14,
  'Obliquus externus abdominis': 15,
  'Soleus': 16,
};

export const EQUIPMENT_IDS: Record<string, number> = {
  Barbell: 1,
  'SZ-Bar': 2,
  Dumbbell: 3,
  'Gym mat': 4,
  'Swiss Ball': 5,
  'Pull-up bar': 6,
  none: 7,
  Bench: 8,
  'Incline bench': 9,
  'Kettlebell': 10,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function wgerGet<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  const url = new URL(`${WGER_BASE}${path}`);
  url.searchParams.set('format', 'json');
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`wger HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    console.error(`[wger] GET ${path} failed:`, err);
    clearTimeout(timeout);
    return null;
  }
}

interface WgerPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface WgerExerciseRaw {
  id: number;
  name: string;
  description: string;
  category: { id: number; name: string };
  muscles: Array<{ id: number; name: string; name_en: string; is_front: boolean; image_url_main: string; image_url_secondary: string }>;
  muscles_secondary: Array<{ id: number; name: string; name_en: string; is_front: boolean; image_url_main: string; image_url_secondary: string }>;
  equipment: Array<{ id: number; name: string }>;
  images: Array<{ image: string }>;
  variations: number[];
}

function parseExercise(raw: WgerExerciseRaw): Exercise {
  return {
    id: raw.id,
    name: raw.name || 'Unnamed Exercise',
    description: (raw.description || '').replace(/<[^>]*>/g, ''),
    category: raw.category?.name ?? EXERCISE_CATEGORIES[raw.category?.id] ?? 'Other',
    categoryId: raw.category?.id ?? 0,
    muscles: (raw.muscles ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      nameEn: m.name_en || m.name,
      isFront: m.is_front,
      imageUrlMain: m.image_url_main || null,
      imageUrlSecondary: m.image_url_secondary || null,
    })),
    musclesSecondary: (raw.muscles_secondary ?? []).map((m) => ({
      id: m.id,
      name: m.name,
      nameEn: m.name_en || m.name,
      isFront: m.is_front,
      imageUrlMain: m.image_url_main || null,
      imageUrlSecondary: m.image_url_secondary || null,
    })),
    equipment: (raw.equipment ?? []).map((e) => ({ id: e.id, name: e.name })),
    images: (raw.images ?? []).map((img) => img.image).filter(Boolean),
    variations: raw.variations ?? [],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Search exercises
// ─────────────────────────────────────────────────────────────────────────────

export async function searchExercises(params: {
  query?: string;
  category?: number;
  muscles?: number;
  equipment?: number;
  language?: number;
  limit?: number;
  offset?: number;
}): Promise<{ exercises: Exercise[]; count: number }> {
  const searchParams: Record<string, string> = {
    language: String(params.language ?? 2), // 2 = English
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
  };

  if (params.query) searchParams['name'] = params.query;
  if (params.category) searchParams['category'] = String(params.category);
  if (params.muscles) searchParams['muscles'] = String(params.muscles);
  if (params.equipment) searchParams['equipment'] = String(params.equipment);

  const data = await wgerGet<WgerPaginatedResponse<WgerExerciseRaw>>('/exerciseinfo/', searchParams);
  if (!data) return { exercises: [], count: 0 };

  return {
    exercises: data.results.map(parseExercise).filter((e) => e.name && e.name !== 'Unnamed Exercise'),
    count: data.count,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Get exercise by ID
// ─────────────────────────────────────────────────────────────────────────────

export async function getExerciseById(id: number): Promise<Exercise | null> {
  const raw = await wgerGet<WgerExerciseRaw>(`/exerciseinfo/${id}/`);
  if (!raw) return null;
  return parseExercise(raw);
}

// ─────────────────────────────────────────────────────────────────────────────
// Get muscle groups
// ─────────────────────────────────────────────────────────────────────────────

export async function getMuscleGroups(): Promise<MuscleGroup[]> {
  const data = await wgerGet<WgerPaginatedResponse<{
    id: number; name: string; name_en: string; is_front: boolean;
    image_url_main: string; image_url_secondary: string;
  }>>('/muscle/', { limit: '50' });

  if (!data) return [];
  return data.results.map((m) => ({
    id: m.id,
    name: m.name,
    nameEn: m.name_en || m.name,
    isFront: m.is_front,
    imageUrlMain: m.image_url_main || null,
    imageUrlSecondary: m.image_url_secondary || null,
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Get equipment list
// ─────────────────────────────────────────────────────────────────────────────

export async function getEquipment(): Promise<Equipment[]> {
  const data = await wgerGet<WgerPaginatedResponse<{ id: number; name: string }>>('/equipment/', { limit: '50' });
  if (!data) return [];
  return data.results.map((e) => ({ id: e.id, name: e.name }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Get exercise categories
// ─────────────────────────────────────────────────────────────────────────────

export async function getExerciseCategories(): Promise<Array<{ id: number; name: string }>> {
  const data = await wgerGet<WgerPaginatedResponse<{ id: number; name: string }>>('/exercisecategory/', { limit: '50' });
  if (!data) return [];
  return data.results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Get exercises for a specific muscle group
// ─────────────────────────────────────────────────────────────────────────────

export async function getExercisesForMuscle(muscleId: number, limit = 10): Promise<Exercise[]> {
  const result = await searchExercises({ muscles: muscleId, limit });
  return result.exercises;
}

// ─────────────────────────────────────────────────────────────────────────────
// Format exercise data for AI coach consumption
// ─────────────────────────────────────────────────────────────────────────────

export function formatExerciseForAI(exercise: Exercise): string {
  const muscles = exercise.muscles.map((m) => m.nameEn || m.name).join(', ') || 'N/A';
  const secondary = exercise.musclesSecondary.map((m) => m.nameEn || m.name).join(', ');
  const equip = exercise.equipment.map((e) => e.name).join(', ') || 'Bodyweight';

  const lines = [
    `💪 ${exercise.name} (${exercise.category})`,
    `Primary muscles: ${muscles}`,
  ];

  if (secondary) lines.push(`Secondary muscles: ${secondary}`);
  lines.push(`Equipment: ${equip}`);
  if (exercise.description) lines.push(`Instructions: ${exercise.description.slice(0, 200)}`);

  return lines.join('\n');
}

export function formatWorkoutDayForAI(day: WorkoutDay): string {
  const lines = [
    `📋 ${day.name} (${day.estimatedMinutes} min)`,
    `Target: ${day.targetMuscles.join(', ')}`,
    '',
    ...day.exercises.map((ex, i) =>
      `  ${i + 1}. ${ex.exerciseName}: ${ex.sets}×${ex.reps}${ex.weight ? ` @ ${ex.weight}kg` : ''} (rest ${ex.restSeconds}s)`
    ),
  ];
  return lines.join('\n');
}

export function formatRoutineForAI(routine: WorkoutRoutine): string {
  const lines = [
    `🏋️ ${routine.name} (${routine.level}, ${routine.daysPerWeek}x/week)`,
    routine.description,
    `Goals: ${routine.goals.join(', ')}`,
    '',
    ...routine.days.map((d) => formatWorkoutDayForAI(d)),
  ];
  return lines.join('\n\n');
}
