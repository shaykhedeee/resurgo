    'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Fitness Page
// Workout Planner · Exercise Log · Body Stats · Activity Tracker
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, type FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { Dumbbell, Flame, Timer, Activity, TrendingUp, Calendar, Sparkles } from 'lucide-react';

type Tab = 'log' | 'planner' | 'stats' | 'activity';
type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'sport' | 'other';

interface WorkoutEntry {
  _id: string;
  date: string;
  type: WorkoutType;
  durationMinutes: number;
  caloriesBurned?: number;
  notes?: string;
}

const WORKOUT_TYPES: { id: WorkoutType; label: string; color: string }[] = [
  { id: 'strength',    label: 'STRENGTH',     color: 'text-orange-400'  },
  { id: 'cardio',      label: 'CARDIO',       color: 'text-red-400'     },
  { id: 'flexibility', label: 'FLEXIBILITY',  color: 'text-blue-400'    },
  { id: 'sport',       label: 'SPORT',        color: 'text-green-400'   },
  { id: 'other',       label: 'OTHER',        color: 'text-zinc-400'    },
];

const WORKOUT_COLORS: Record<WorkoutType, string> = {
  strength:    'text-orange-400',
  cardio:      'text-red-400',
  flexibility: 'text-blue-400',
  sport:       'text-green-400',
  other:       'text-zinc-400',
};

const QUICK_WORKOUTS = [
  { name: '30-min Run', type: 'cardio' as WorkoutType, duration: 30, calories: 300 },
  { name: 'Push/Pull/Legs', type: 'strength' as WorkoutType, duration: 60, calories: 450 },
  { name: 'HIIT Circuit', type: 'cardio' as WorkoutType, duration: 20, calories: 280 },
  { name: 'Yoga Flow', type: 'flexibility' as WorkoutType, duration: 45, calories: 180 },
  { name: 'Upper Body', type: 'strength' as WorkoutType, duration: 45, calories: 350 },
  { name: 'Lower Body', type: 'strength' as WorkoutType, duration: 50, calories: 380 },
  { name: 'Bodyweight EMOM', type: 'strength' as WorkoutType, duration: 25, calories: 260 },
  { name: '5K Recovery Jog', type: 'cardio' as WorkoutType, duration: 35, calories: 250 },
  { name: 'Mobility Routine', type: 'flexibility' as WorkoutType, duration: 20, calories: 90 },
  { name: 'Basketball Pickup', type: 'sport' as WorkoutType, duration: 60, calories: 500 },
  { name: 'Swimming Laps', type: 'cardio' as WorkoutType, duration: 40, calories: 400 },
  { name: 'Jump Rope Tabata', type: 'cardio' as WorkoutType, duration: 15, calories: 220 },
];

const WORKOUT_PLANS = [
  {
    name: 'STRENGTH_PROTOCOL_v1',
    days: ['MON', 'WED', 'FRI'],
    sessions: [
      { day: 'MON', focus: 'Upper Body', exercises: ['Bench Press 4×8', 'Pull-ups 4×8', 'OHP 3×10', 'Rows 3×10', 'Tricep Dips 3×12'] },
      { day: 'WED', focus: 'Lower Body', exercises: ['Squats 4×8', 'Deadlifts 3×5', 'Lunges 3×12', 'Leg Press 3×15', 'Calf Raises 4×15'] },
      { day: 'FRI', focus: 'Full Body', exercises: ['Clean & Press 4×6', 'Pull-ups 3×8', 'Dips 3×10', 'Goblet Squat 3×12', 'Plank 3×60s'] },
    ],
  },
  {
    name: 'CARDIO_PROTOCOL_v1',
    days: ['TUE', 'THU', 'SAT'],
    sessions: [
      { day: 'TUE', focus: 'Zone 2 Cardio', exercises: ['30 min steady run @65% HR', 'Heart rate zone 2 (130-150 bpm)'] },
      { day: 'THU', focus: 'HIIT Intervals', exercises: ['5 min warm-up', '8×1 min sprint @90% HR', '2 min recovery', '5 min cool-down'] },
      { day: 'SAT', focus: 'Long Run', exercises: ['50-60 min easy run @60% HR', 'Build aerobic base'] },
    ],
  },
  {
    name: 'HIIT_PROTOCOL_v1',
    days: ['MON', 'WED', 'FRI'],
    sessions: [
      { day: 'MON', focus: 'Metabolic Blast', exercises: ['Burpees 4×12', 'Box Jumps 4×10', 'KB Swings 4×15', 'Battle Ropes 3×30s', 'Mountain Climbers 3×20'] },
      { day: 'WED', focus: 'AMRAP 20', exercises: ['5 Push-ups', '10 Air Squats', '15 Sit-ups', 'Repeat max rounds in 20 min'] },
      { day: 'FRI', focus: 'Tabata Combo', exercises: ['8 rounds: 20s work / 10s rest', 'Rd 1-2 Thrusters', 'Rd 3-4 Jump Squats', 'Rd 5-6 Push Press', 'Rd 7-8 Burpees'] },
    ],
  },
  {
    name: 'FLEXIBILITY_PROTOCOL_v1',
    days: ['TUE', 'THU', 'SAT'],
    sessions: [
      { day: 'TUE', focus: 'Vinyasa Flow', exercises: ['Sun Salutation A ×5', 'Warrior I/II/III sequence', 'Triangle → Half Moon', 'Pigeon Pose 2 min each', 'Savasana 5 min'] },
      { day: 'THU', focus: 'Deep Stretch', exercises: ['Foam Roll 10 min', 'Hip Flexor Stretch 2×90s', 'Hamstring PNF 3×30s', 'Thoracic Spine Rotation 2×10', 'Figure-4 Glute Stretch 2 min each'] },
      { day: 'SAT', focus: 'Active Recovery', exercises: ['20 min easy walk', 'Full body dynamic stretching', 'Lacrosse ball trigger points 10 min', 'Diaphragmatic breathing 5 min'] },
    ],
  },
  {
    name: 'BODYWEIGHT_PROTOCOL_v1',
    days: ['MON', 'WED', 'FRI', 'SUN'],
    sessions: [
      { day: 'MON', focus: 'Push Day', exercises: ['Push-ups 4×20', 'Diamond Push-ups 3×12', 'Pike Push-ups 3×10', 'Dips 3×15', 'Plank 3×60s'] },
      { day: 'WED', focus: 'Pull Day', exercises: ['Pull-ups 4×8', 'Chin-ups 3×10', 'Inverted Rows 3×12', 'Dead Hang 3×30s', 'Superman Hold 3×20s'] },
      { day: 'FRI', focus: 'Legs Day', exercises: ['Pistol Squats 3×6 each', 'Jump Squats 4×15', 'Walking Lunges 3×20', 'Wall Sit 3×45s', 'Calf Raises 4×25'] },
      { day: 'SUN', focus: 'Core & Mobility', exercises: ['Hollow Body 3×30s', 'L-Sit Progression 3×15s', 'Bicycle Crunches 3×20', 'Side Plank 3×30s each', 'Yoga Flow 15 min'] },
    ],
  },
  {
    name: 'SPORT_PERFORMANCE_v1',
    days: ['MON', 'WED', 'FRI'],
    sessions: [
      { day: 'MON', focus: 'Speed & Agility', exercises: ['Ladder Drills 4×30s', 'Cone Shuttle 5×20m', 'Box Jump 4×8', 'Sprint 6×40m', 'Cool-down jog 5 min'] },
      { day: 'WED', focus: 'Power & Explosiveness', exercises: ['Clean & Jerk 5×3', 'Med Ball Slams 4×10', 'Broad Jumps 4×6', 'Plyometric Push-ups 3×8', 'Sled Push 4×20m'] },
      { day: 'FRI', focus: 'Endurance & Recovery', exercises: ['Tempo Run 25 min', 'Farmer Walks 4×40m', 'Battle Ropes 3×30s', 'Band Pull-aparts 3×20', 'Stretch routine 10 min'] },
    ],
  },
];

export default function FitnessPage() {
  const [tab, setTab] = useState<Tab>('log');

  // Load current user profile from Convex
  const user = useQuery(api.users.current);

  // Titan AI Workout Generator state & actions
  const sendWithPersona = useAction(api.coachAI.sendWithPersona);
  const bulkCreateTasks = useMutation(api.tasks.bulkCreate);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const [aiStatus, setAiStatus] = useState<'idle' | 'simulating' | 'completed' | 'error'>('idle');
  const [deploySummary, setDeploySummary] = useState<string | null>(null);

  const handleAiWorkoutSubmit = async (promptText: string) => {
    const text = promptText.trim();
    if (!text || aiGenerating) return;
    setAiGenerating(true);
    setAiStatus('simulating');
    setDeploySummary(null);
    setAiResult(null);

    // Cyberpunk simulated logs
    const logQueue = [
      'resurgo:titan_ai$ init_neural_router --channel_fitness...',
      'resurgo:titan_ai$ fetching_muscular_telemetry_hud...',
      'resurgo:titan_ai$ parsing_progressive_overload_matrix...',
      'resurgo:titan_ai$ generating_stimulus_blueprint...',
    ];

    setAiLogs([]);
    for (let i = 0; i < logQueue.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setAiLogs((prev) => [...prev, logQueue[i]]);
    }

    try {
      const titanPrompt = `You are TITAN, the Elite High-Performance Coach. Today is ${today}.
Build a highly structured, intense training protocol based on: "${text}".
You must output a single valid JSON object containing:
{
  "name": "Intense Workout Name",
  "type": "strength",
  "durationMinutes": 35,
  "calories": 320,
  "exercises": [
    { "name": "Exercise Name", "sets": 4, "reps": 10, "weight": 20, "weightUnit": "kg", "notes": "Strict form" },
    { "name": "Another Exercise", "sets": 3, "reps": 12 }
  ]
}
Do not include any text before or after the JSON. Only return the JSON.`;

      const response = await sendWithPersona({
        content: titanPrompt,
        coachId: 'TITAN',
      });

      // Extract JSON from response
      const jsonMatch = response.reply.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse AI workout protocol JSON');
      }
      const workoutPlan = JSON.parse(jsonMatch[0]);
      setAiResult(workoutPlan);
      setAiStatus('completed');
    } catch (err) {
      console.error(err);
      setAiLogs((prev) => [...prev, 'resurgo:titan_ai$ [ERROR] Neural path collapsed. Re-routing failed.']);
      setAiStatus('error');
    } finally {
      setAiGenerating(false);
    }
  };

  const logAiWorkout = async () => {
    if (!aiResult) return;
    setSaving(true);
    try {
      await logWorkout({
        date: today,
        type: aiResult.type || 'strength',
        name: aiResult.name,
        durationMinutes: aiResult.durationMinutes || 30,
        caloriesBurned: aiResult.calories || 250,
        notes: `AI Generated via Titan Coach: ${aiPrompt}`,
        exercises: aiResult.exercises || [],
      });
      setDeploySummary('[WORKOUT_LOGGED_SUCCESSFULLY] -- added to telemetry matrix.');
    } catch (err) {
      console.error(err);
      setDeploySummary('[ERROR] Could not commit workout log.');
    } finally {
      setSaving(false);
    }
  };

  const deployAiWorkoutToTasks = async () => {
    if (!aiResult) return;
    setSaving(true);
    try {
      const tasksToCreate = (aiResult.exercises || []).map((ex: any) => {
        let desc = '';
        if (ex.sets && ex.reps) desc = `${ex.sets} sets × ${ex.reps} reps`;
        if (ex.weight) desc += ` @ ${ex.weight}${ex.weightUnit || 'kg'}`;
        if (ex.notes) desc += ` (${ex.notes})`;
        
        return {
          title: `[Titan Exercise] ${ex.name}`,
          description: desc || 'Titan AI recommended movement',
          priority: 'medium' as const,
          dueDate: today,
          scheduledDate: today,
          tags: ['fitness', 'titan-ai', aiResult.name],
          xpValue: 10,
        };
      });

      // Add parent task too
      tasksToCreate.unshift({
        title: `🏋️ Titan Workout: ${aiResult.name}`,
        description: `Complete the ${aiResult.durationMinutes}m Titan training blueprint.`,
        priority: 'high' as const,
        dueDate: today,
        scheduledDate: today,
        tags: ['fitness', 'titan-ai'],
        xpValue: 20,
      });

      await bulkCreateTasks({ tasks: tasksToCreate });
      setDeploySummary(`[TASKS_DEPLOYED_SUCCESSFULLY] -- created parent + ${tasksToCreate.length - 1} exercises in daily backlog.`);
    } catch (err) {
      console.error(err);
      setDeploySummary('[ERROR] Backlog injection failed.');
    } finally {
      setSaving(false);
    }
  };

  // Custom log detailed exercises list builder
  const [exercises, setExercises] = useState<any[]>([]);
  const [exName, setExName] = useState('');
  const [exSets, setExSets] = useState('');
  const [exReps, setExReps] = useState('');
  const [exWeight, setExWeight] = useState('');
  const [exWeightUnit, setExWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [exDist, setExDist] = useState('');
  const [exDistUnit, setExDistUnit] = useState<'km' | 'mi'>('km');
  const [exDur, setExDur] = useState('');

  const addExerciseToList = () => {
    if (!exName.trim()) return;
    setExercises((prev) => [
      ...prev,
      {
        name: exName.trim(),
        sets: exSets ? parseInt(exSets) : undefined,
        reps: exReps ? parseInt(exReps) : undefined,
        weight: exWeight ? parseFloat(exWeight) : undefined,
        weightUnit: exWeight ? exWeightUnit : undefined,
        distance: exDist ? parseFloat(exDist) : undefined,
        distanceUnit: exDist ? exDistUnit : undefined,
        durationSeconds: exDur ? parseInt(exDur) * 60 : undefined,
      },
    ]);
    setExName('');
    setExSets('');
    setExReps('');
    setExWeight('');
    setExDist('');
    setExDur('');
  };

  const removeExerciseFromList = (idx: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  };

  // Form state
  const [wType, setWType] = useState<WorkoutType>('strength');
  const [wDuration, setWDuration] = useState('');
  const [wCalories, setWCalories] = useState('');
  const [wNotes, setWNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  // Convex queries
  const workouts = useQuery(api.fitness.listWorkouts, {});
  const weekStats = useQuery(api.fitness.getWeekStats, {});

  // Mutations
  const logWorkout = useMutation(api.fitness.logWorkout);

  const handleLogSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!wDuration || saving) return;
    setSaving(true);
    try {
      await logWorkout({
        date: today,
        type: wType,
        durationMinutes: parseInt(wDuration),
        caloriesBurned: wCalories ? parseInt(wCalories) : undefined,
        notes: wNotes || undefined,
        exercises: exercises.length > 0 ? exercises : undefined,
      });
      setWDuration('');
      setWCalories('');
      setWNotes('');
      setExercises([]);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickLog = async (workout: typeof QUICK_WORKOUTS[number]) => {
    if (saving) return;
    setSaving(true);
    try {
      await logWorkout({
        date: today,
        type: workout.type,
        durationMinutes: workout.duration,
        caloriesBurned: workout.calories,
        notes: workout.name,
      });
    } finally {
      setSaving(false);
    }
  };

  const fmtDuration = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'log',      label: 'LOG',      icon: Dumbbell   },
    { id: 'planner',  label: 'PLANNER',  icon: Calendar   },
    { id: 'stats',    label: 'STATS',    icon: TrendingUp },
    { id: 'activity', label: 'ACTIVITY', icon: Activity   },
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">BODY :: FITNESS_SUITE</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Fitness</h1>
            <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">Log · Plan · Track · Analyze</p>
          </div>
          <div className="flex border-t border-zinc-900">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn('flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 font-mono text-xs tracking-widest transition',
                  tab === id ? 'border-orange-600 bg-orange-950/10 text-orange-500' : 'border-transparent text-zinc-400 hover:text-zinc-300'
                )}>
                <Icon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Week Stats */}
        {weekStats && (
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { label: 'WORKOUTS THIS WEEK', value: String(weekStats.totalWorkouts), icon: Dumbbell, color: 'text-orange-400' },
              { label: 'MINUTES TRAINED',    value: fmtDuration(weekStats.totalMinutes), icon: Timer, color: 'text-blue-400' },
              { label: 'CALORIES BURNED',    value: `${weekStats.totalCalories} kcal`, icon: Flame, color: 'text-red-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="border border-zinc-900 bg-zinc-950 p-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <Icon className={cn('h-3 w-3', color)} />
                  <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
                </div>
                <p className={cn('font-mono text-xl font-bold', color)}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* LOG TAB */}
        {tab === 'log' && (
          <div className="space-y-4">
            {/* Quick Log */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">QUICK_LOG</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-3 md:grid-cols-3">
                {QUICK_WORKOUTS.map((w) => (
                  <button key={w.name} onClick={() => handleQuickLog(w)} disabled={saving}
                    className="border border-zinc-800 bg-black px-3 py-2.5 text-left transition hover:border-orange-800 disabled:opacity-40">
                    <p className={cn('font-mono text-xs font-bold tracking-wide', WORKOUT_COLORS[w.type])}>{w.name}</p>
                    <p className="font-mono text-xs text-zinc-400">{w.duration}m · {w.calories} kcal</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Log Form */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">CUSTOM_LOG</span>
              </div>
              <form onSubmit={handleLogSubmit} className="space-y-3 p-4">
                <div>
                  <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">WORKOUT_TYPE</p>
                  <div className="flex flex-wrap gap-1.5">
                    {WORKOUT_TYPES.map(({ id, label, color }) => (
                      <button key={id} type="button" onClick={() => setWType(id)}
                        className={cn('border px-3 py-1.5 font-mono text-xs tracking-widest transition',
                          wType === id ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        )}>
                        <span className={cn(wType === id ? 'text-orange-500' : color)}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 font-mono text-xs tracking-widest text-zinc-400">DURATION_(MIN)</p>
                    <input type="number" min="1" max="300" value={wDuration} onChange={(e) => setWDuration(e.target.value)}
                      required placeholder="45"
                      className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none" />
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-xs tracking-widest text-zinc-400">CALORIES_(OPTIONAL)</p>
                    <input type="number" min="0" value={wCalories} onChange={(e) => setWCalories(e.target.value)}
                      placeholder="350"
                      className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none" />
                  </div>
                </div>

                {/* Sub-form: Add structured exercises */}
                {(wType === 'strength' || wType === 'cardio') && (
                  <div className="border border-zinc-900 bg-black/40 p-3 space-y-3">
                    <p className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                      {wType === 'strength' ? 'ADD_STRENGTH_SETS_HUD' : 'ADD_CARDIO_INTERVALS_HUD'}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="md:col-span-2">
                        <p className="mb-1 font-mono text-[9px] text-zinc-600">EXERCISE_OR_INTERVAL_NAME</p>
                        <input
                          value={exName}
                          onChange={(e) => setExName(e.target.value)}
                          placeholder={wType === 'strength' ? "e.g., Bench Press, Deadlift..." : "e.g., Steady Run, Sprint intervals..."}
                          className="h-8 w-full border border-zinc-800 bg-black px-2.5 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none"
                        />
                      </div>

                      {wType === 'strength' ? (
                        <div>
                          <p className="mb-1 font-mono text-[9px] text-zinc-600">WEIGHT_LIFTED</p>
                          <div className="flex">
                            <input
                              type="number"
                              min="0"
                              value={exWeight}
                              onChange={(e) => setExWeight(e.target.value)}
                              placeholder="60"
                              className="h-8 flex-1 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none rounded-l"
                            />
                            <button
                              type="button"
                              onClick={() => setExWeightUnit(exWeightUnit === 'kg' ? 'lb' : 'kg')}
                              className="h-8 px-2 border border-l-0 border-zinc-800 bg-zinc-900 font-mono text-[10px] text-orange-500 rounded-r"
                            >
                              {exWeightUnit}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="mb-1 font-mono text-[9px] text-zinc-600">DISTANCE</p>
                          <div className="flex">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              value={exDist}
                              onChange={(e) => setExDist(e.target.value)}
                              placeholder="5.0"
                              className="h-8 flex-1 border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none rounded-l"
                            />
                            <button
                              type="button"
                              onClick={() => setExDistUnit(exDistUnit === 'km' ? 'mi' : 'km')}
                              className="h-8 px-2 border border-l-0 border-zinc-800 bg-zinc-900 font-mono text-[10px] text-cyan-400 rounded-r"
                            >
                              {exDistUnit}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {wType === 'strength' ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="mb-1 font-mono text-[9px] text-zinc-600">SETS</p>
                          <input
                            type="number"
                            min="1"
                            value={exSets}
                            onChange={(e) => setExSets(e.target.value)}
                            placeholder="4"
                            className="h-8 w-full border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none"
                          />
                        </div>
                        <div>
                          <p className="mb-1 font-mono text-[9px] text-zinc-600">REPS</p>
                          <input
                            type="number"
                            min="1"
                            value={exReps}
                            onChange={(e) => setExReps(e.target.value)}
                            placeholder="8"
                            className="h-8 w-full border border-zinc-800 bg-black px-2 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-1 font-mono text-[9px] text-zinc-600">DURATION_(MINUTES)</p>
                        <input
                          type="number"
                          min="1"
                          value={exDur}
                          onChange={(e) => setExDur(e.target.value)}
                          placeholder="25"
                          className="h-8 w-full border border-zinc-800 bg-black px-2.5 font-mono text-xs text-zinc-300 focus:border-orange-800 focus:outline-none"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={addExerciseToList}
                      disabled={!exName.trim()}
                      className="w-full h-8 border border-zinc-800 bg-zinc-900 font-mono text-[10px] tracking-widest text-zinc-300 hover:border-orange-800 hover:text-orange-500 transition disabled:opacity-40"
                    >
                      [+ ADD_TO_WORKOUT_LIST]
                    </button>

                    {/* Currently added items list */}
                    {exercises.length > 0 && (
                      <div className="border border-zinc-900 bg-black p-2 space-y-1.5 max-h-40 overflow-y-auto">
                        <p className="font-mono text-[9px] text-zinc-500 uppercase">ADDED_EXERCISES_QUEUE:</p>
                        {exercises.map((ex, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-zinc-950 px-2 py-1 border border-zinc-900">
                            <span className="font-mono text-xs text-zinc-300">
                              {ex.name} 
                              {ex.sets && ` — ${ex.sets}s × ${ex.reps}r`} 
                              {ex.weight && ` @ ${ex.weight}${ex.weightUnit}`}
                              {ex.distance && ` — ${ex.distance}${ex.distanceUnit}`}
                              {ex.durationSeconds && ` (${Math.round(ex.durationSeconds / 60)}m)`}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeExerciseFromList(idx)}
                              className="font-mono text-[10px] text-red-500 hover:text-red-400"
                            >
                              [X]
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <textarea value={wNotes} onChange={(e) => setWNotes(e.target.value)}
                  placeholder="General notes or workout summary..." rows={2}
                  className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                <button type="submit" disabled={saving || !wDuration}
                  className="flex items-center gap-2 border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
                  <Dumbbell className="h-3 w-3" />
                  {saving ? 'LOGGING_' : '[LOG_WORKOUT]'}
                </button>
              </form>
            </div>

            {/* Recent Workouts */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">RECENT_SESSIONS</span>
              </div>
              {!workouts || workouts.length === 0 ? (
                <div className="py-10 text-center">
                  <Dumbbell className="mx-auto mb-3 h-6 w-6 text-zinc-700" />
                  <p className="font-mono text-xs tracking-widest text-zinc-500">NO_SESSIONS_LOGGED_YET</p>
                  <p className="mt-1 font-mono text-xs text-zinc-600">Log your first workout above</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {workouts.slice(0, 15).map((w: WorkoutEntry) => (
                    <div key={w._id} className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-900/50">
                      <div className={cn('mt-0.5 h-2 w-2 shrink-0 rounded-full bg-current', WORKOUT_COLORS[w.type as WorkoutType])} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn('font-mono text-xs font-bold tracking-wide', WORKOUT_COLORS[w.type as WorkoutType])}>
                            {w.type.toUpperCase()}
                          </span>
                          {w.notes && <span className="font-mono text-xs text-zinc-300">{w.notes}</span>}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-400"><Timer className="mr-1 inline h-2.5 w-2.5" />{fmtDuration(w.durationMinutes)}</span>
                          {w.caloriesBurned && <span className="font-mono text-xs text-zinc-400"><Flame className="mr-1 inline h-2.5 w-2.5" />{w.caloriesBurned} kcal</span>}
                        </div>
                      </div>
                      <span className="font-mono text-xs text-zinc-500">{w.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PLANNER TAB */}
        {tab === 'planner' && (
          <div className="space-y-4">
            <div className="border border-zinc-800 bg-orange-950/10 p-4">
              <p className="font-mono text-xs tracking-widest text-orange-600">PROTOCOL_LIBRARY</p>
              <p className="mt-1 font-mono text-xs text-zinc-400">Pre-built training protocols. Activate one and it will generate tasks in your dashboard.</p>
            </div>
            {WORKOUT_PLANS.map((plan) => (
              <div key={plan.name} className="border border-zinc-900 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-2.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">{plan.name}</span>
                  <span className="font-mono text-xs text-zinc-500">{plan.days.join(' · ')}</span>
                </div>
                <div className="divide-y divide-zinc-900">
                  {plan.sessions.map((session) => (
                    <div key={session.day} className="px-4 py-3">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="border border-orange-900 px-2 py-0.5 font-mono text-xs tracking-widest text-orange-500">{session.day}</span>
                        <span className="font-mono text-xs text-zinc-300">{session.focus}</span>
                      </div>
                      <ul className="space-y-1">
                        {session.exercises.map((ex) => (
                          <li key={ex} className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                            <span className="text-zinc-700">›</span> {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Titan AI Workout Generator */}
            <div className="border border-orange-950/60 bg-zinc-950 p-5 rounded-[2px] space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span className="font-mono text-xs tracking-widest text-orange-500 uppercase">// RESURGO_FITNESS_AI_COACH_::__TITAN_MODULE</span>
              </div>
              <p className="font-mono text-[11px] text-zinc-400 leading-relaxed">
                Establish direct telemetry link with Coach TITAN. Input your conditioning target, equipment details, or physical capacity to generate an optimized progressive overload protocol.
              </p>

              {/* Quickchips prompt templates */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  '35m Kettlebell Conditioning',
                  '45m HIIT Cardio Bodyweight',
                  '40m Core & Mobility Flow',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => { setAiPrompt(chip); handleAiWorkoutSubmit(chip); }}
                    disabled={aiGenerating}
                    className="border border-zinc-900 bg-black hover:border-orange-900 hover:text-orange-500 px-2 py-1 font-mono text-[9px] tracking-widest text-zinc-500 transition"
                  >
                    [{chip.toUpperCase().replace(/ /g, '_')}]
                  </button>
                ))}
              </div>

              {/* Terminal-style interactive prompt form */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleAiWorkoutSubmit(aiPrompt); }}
                className="flex items-center gap-2 border border-zinc-800 bg-black px-3 py-2 rounded-[2px]"
              >
                <span className="font-mono text-xs text-orange-500 shrink-0">resurgo:fitness_ai$</span>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="EX: I WANT HEAVY SQUATS AND DEADLIFTS IN 45 MINUTES..."
                  className="flex-1 bg-transparent font-mono text-xs text-zinc-200 focus:outline-none placeholder-zinc-700"
                  disabled={aiGenerating}
                />
                <button
                  type="submit"
                  disabled={aiGenerating || !aiPrompt.trim()}
                  className="font-mono text-xs font-bold text-orange-500 tracking-wider hover:text-orange-400 disabled:opacity-30 shrink-0"
                >
                  [EXECUTE]
                </button>
              </form>

              {/* simulated cyberpunk logs marquee */}
              {aiStatus === 'simulating' && (
                <div className="bg-black border border-orange-950/50 p-4 font-mono text-[10px] text-orange-500 text-left space-y-1 rounded-[2px]">
                  {aiLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                  <div className="animate-pulse">resurgo:titan_ai$ routing_target_stimulus_protocols...</div>
                </div>
              )}

              {/* AI generated structured blueprint result card */}
              {aiStatus === 'completed' && aiResult && (
                <div className="border border-orange-900 bg-zinc-950 font-mono text-left rounded-[2px]">
                  <div className="border-b border-orange-950/40 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-orange-500 tracking-widest uppercase">
                      // TITAN_TRAINING_BLUEPRINT_v1.0
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {aiResult.durationMinutes}M · {aiResult.calories} KCAL
                    </span>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Workout Protocol</p>
                      <p className="text-zinc-200 text-xs font-bold mt-0.5">{aiResult.name.toUpperCase()}</p>
                    </div>

                    <div className="space-y-2 border-t border-zinc-900 pt-3">
                      {aiResult.exercises?.map((ex: any, i: number) => (
                        <div key={i} className="flex items-start justify-between text-[11px] border-b border-zinc-900/40 pb-2">
                          <span className="text-zinc-300">
                            <span className="text-orange-500">›</span> {ex.name}
                          </span>
                          <span className="text-zinc-400 text-right">
                            {ex.sets && ex.reps && `${ex.sets} sets × ${ex.reps} reps`}
                            {ex.weight && ` @ ${ex.weight}${ex.weightUnit || 'kg'}`}
                            {ex.durationSeconds && ` [${Math.floor(ex.durationSeconds / 60)}m]`}
                            {ex.notes && <span className="block text-[9px] text-zinc-600 mt-0.5">{ex.notes}</span>}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Commit & deploy mutations buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 border-t border-zinc-900 pt-3">
                      <button
                        onClick={logAiWorkout}
                        type="button"
                        className="flex-1 rounded-[2px] border border-green-950 bg-green-950/20 px-3 py-2 font-mono text-[10px] tracking-widest text-green-500 transition hover:bg-green-950/40 uppercase font-bold"
                      >
                        [LOG_COMPLETED_TODAY]
                      </button>
                      <button
                        onClick={deployAiWorkoutToTasks}
                        type="button"
                        className="flex-1 rounded-[2px] border border-orange-900 bg-orange-950/20 px-3 py-2 font-mono text-[10px] tracking-widest text-orange-500 transition hover:bg-orange-950/40 uppercase font-bold"
                      >
                        [DEPLOY_TO_DAILY_TASKS]
                      </button>
                    </div>

                    {deploySummary && (
                      <div className="border border-emerald-950 bg-emerald-950/15 p-2.5 text-center text-[10px] text-emerald-400 border-t border-dashed mt-3">
                        {deploySummary}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <div className="space-y-4">
            {/* Dynamic Progressive Overload HUD */}
            {(() => {
              if (!workouts || workouts.length === 0) return null;
              
              const liftMaxes: Record<string, { weight: number, reps: number, oneRepMax: number, date: string, unit: string }> = {
                'bench press': { weight: 0, reps: 0, oneRepMax: 0, date: '', unit: 'kg' },
                'squat': { weight: 0, reps: 0, oneRepMax: 0, date: '', unit: 'kg' },
                'deadlift': { weight: 0, reps: 0, oneRepMax: 0, date: '', unit: 'kg' },
                'overhead press': { weight: 0, reps: 0, oneRepMax: 0, date: '', unit: 'kg' },
              };

              let totalVolumeThisWeek = 0;
              let totalCardioDistanceThisWeek = 0;
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
              const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

              workouts.forEach((w: any) => {
                if (w.exercises && Array.isArray(w.exercises)) {
                  w.exercises.forEach((ex: any) => {
                    const nameLower = ex.name.toLowerCase();
                    
                    if (ex.sets && ex.reps && ex.weight) {
                      const vol = ex.sets * ex.reps * ex.weight;
                      if (w.date >= sevenDaysAgoStr) {
                        totalVolumeThisWeek += vol;
                      }

                      const oneRepMax = Math.round(ex.weight * (1 + ex.reps / 30));
                      let coreKey = '';
                      if (nameLower.includes('bench') || nameLower.includes('chest press')) coreKey = 'bench press';
                      else if (nameLower.includes('squat')) coreKey = 'squat';
                      else if (nameLower.includes('deadlift')) coreKey = 'deadlift';
                      else if (nameLower.includes('overhead') || nameLower.includes('ohp') || nameLower.includes('shoulder press')) coreKey = 'overhead press';

                      if (coreKey && oneRepMax > liftMaxes[coreKey].oneRepMax) {
                        liftMaxes[coreKey] = {
                          weight: ex.weight,
                          reps: ex.reps,
                          oneRepMax,
                          date: w.date,
                          unit: ex.weightUnit || 'kg',
                        };
                      }
                    }

                    if (ex.distance && w.date >= sevenDaysAgoStr) {
                      totalCardioDistanceThisWeek += ex.distance;
                    }
                  });
                }
              });

              const hasLifts = Object.values(liftMaxes).some(x => x.oneRepMax > 0);

              return (
                <div className="space-y-4">
                  {/* Overload Metrics Card */}
                  {hasLifts && (
                    <div className="border border-orange-900 bg-zinc-950">
                      <div className="flex items-center justify-between border-b border-orange-950/40 px-4 py-2 flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4" /> Progressive Overload Telemetry HUD
                        </span>
                        <span className="font-mono text-[9px] text-zinc-500">Calculated via Epley 1RM formula</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 bg-zinc-900">
                        {Object.entries(liftMaxes).map(([lift, data]) => {
                          if (data.oneRepMax === 0) return null;
                          return (
                            <div key={lift} className="bg-zinc-950 p-3.5">
                              <p className="font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{lift}</p>
                              <p className="mt-1.5 font-mono text-xl font-bold text-orange-400">
                                {data.oneRepMax} <span className="text-xs text-zinc-500">{data.unit}</span>
                              </p>
                              <p className="mt-0.5 font-mono text-[10px] text-zinc-400">
                                Best: {data.weight}{data.unit} × {data.reps} rep{data.reps > 1 ? 's' : ''}
                              </p>
                              <p className="mt-1.5 font-mono text-[9px] text-zinc-600">Logged: {data.date}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Volume hud */}
                  {(totalVolumeThisWeek > 0 || totalCardioDistanceThisWeek > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {totalVolumeThisWeek > 0 && (
                        <div className="border border-zinc-900 bg-zinc-950 p-3.5 flex justify-between items-center">
                          <div>
                            <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Training Volume (7d)</p>
                            <p className="mt-1 font-mono text-lg font-bold text-blue-400">{totalVolumeThisWeek.toLocaleString()} kg</p>
                          </div>
                          <span className="border border-blue-900/40 bg-blue-950/10 px-2 py-1 font-mono text-[9px] text-blue-400">VOLUMETRY</span>
                        </div>
                      )}
                      {totalCardioDistanceThisWeek > 0 && (
                        <div className="border border-zinc-900 bg-zinc-950 p-3.5 flex justify-between items-center">
                          <div>
                            <p className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cardiovascular Distance (7d)</p>
                            <p className="mt-1 font-mono text-lg font-bold text-cyan-400">{totalCardioDistanceThisWeek.toFixed(1)} km</p>
                          </div>
                          <span className="border border-cyan-900/40 bg-cyan-950/10 px-2 py-1 font-mono text-[9px] text-cyan-400">AEROBIC_BASE</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Breakdown by type */}
            {workouts && workouts.length > 0 ? (
              <>
                <div className="border border-zinc-900 bg-zinc-950">
                  <div className="border-b border-zinc-900 px-4 py-2.5">
                    <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">SESSION_BREAKDOWN_BY_TYPE</span>
                  </div>
                  <div className="p-4">
                    {WORKOUT_TYPES.map(({ id, label, color }) => {
                      const count = workouts.filter((w: WorkoutEntry) => w.type === id).length;
                      const pct = workouts.length > 0 ? Math.round((count / workouts.length) * 100) : 0;
                      if (count === 0) return null;
                      return (
                        <div key={id} className="mb-3">
                          <div className="mb-1 flex items-center justify-between">
                            <span className={cn('font-mono text-xs tracking-widest', color)}>{label}</span>
                            <span className="font-mono text-xs text-zinc-400">{count} sessions ({pct}%)</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-900">
                            <div className="h-full bg-orange-600 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* All-time stats */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'TOTAL SESSIONS',  value: String(workouts.length),                                     color: 'text-orange-400' },
                    { label: 'TOTAL TIME',       value: fmtDuration(workouts.reduce((s: number, w: WorkoutEntry) => s + w.durationMinutes, 0)), color: 'text-blue-400' },
                    { label: 'TOTAL CALORIES',   value: `${workouts.reduce((s: number, w: WorkoutEntry) => s + (w.caloriesBurned ?? 0), 0)} kcal`, color: 'text-red-400' },
                    { label: 'AVG DURATION',     value: workouts.length > 0 ? fmtDuration(Math.round(workouts.reduce((s: number, w: WorkoutEntry) => s + w.durationMinutes, 0) / workouts.length)) : '--', color: 'text-green-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="border border-zinc-900 bg-zinc-950 p-4">
                      <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
                      <p className={cn('mt-2 font-mono text-xl font-bold', color)}>{value}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="border border-zinc-900 bg-zinc-950 py-16 text-center">
                <TrendingUp className="mx-auto mb-3 h-8 w-8 text-zinc-700" />
                <p className="font-mono text-xs tracking-widest text-zinc-500">NO_DATA_YET</p>
                <p className="mt-1 font-mono text-xs text-zinc-600">Log workouts to see your stats</p>
              </div>
            )}
          </div>
        )}

        {/* ACTIVITY TAB */}
        {tab === 'activity' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">ACTIVITY_CALENDAR</span>
              </div>
              {!workouts || workouts.length === 0 ? (
                <div className="py-12 text-center">
                  <Activity className="mx-auto mb-3 h-6 w-6 text-zinc-700" />
                  <p className="font-mono text-xs tracking-widest text-zinc-500">NO_ACTIVITY_LOGGED</p>
                </div>
              ) : (
                <div className="p-4">
                  {/* Last 30 days activity heatmap */}
                  <p className="mb-3 font-mono text-xs tracking-widest text-zinc-500">LAST_30_DAYS</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 30 }, (_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() - (29 - i));
                      const dateStr = d.toISOString().split('T')[0];
                      const dayWorkouts = workouts.filter((w: WorkoutEntry) => w.date === dateStr);
                      return (
                        <div key={dateStr} title={`${dateStr}: ${dayWorkouts.length} session(s)`}
                          className={cn('flex h-7 w-7 items-center justify-center border font-mono text-[9px]',
                            dayWorkouts.length > 0
                              ? 'border-orange-700 bg-orange-950/50 text-orange-400'
                              : 'border-zinc-900 bg-zinc-950 text-zinc-700'
                          )}>
                          {d.getDate()}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 border border-zinc-900 bg-zinc-950" />
                      <span className="font-mono text-xs text-zinc-600">REST</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 border border-orange-700 bg-orange-950/50" />
                      <span className="font-mono text-xs text-zinc-600">TRAINED</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent full log */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">ALL_SESSIONS</span>
              </div>
              {!workouts || workouts.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-mono text-xs tracking-widest text-zinc-500">NO_SESSIONS_LOGGED</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {workouts.map((w: WorkoutEntry) => (
                    <div key={w._id} className="flex items-center gap-3 px-4 py-2.5">
                      <span className="font-mono text-xs text-zinc-500 w-24 shrink-0">{w.date}</span>
                      <span className={cn('font-mono text-xs font-bold w-20 shrink-0', WORKOUT_COLORS[w.type as WorkoutType])}>
                        {w.type.toUpperCase()}
                      </span>
                      <span className="flex-1 font-mono text-xs text-zinc-300 truncate">{w.notes || '—'}</span>
                      <span className="font-mono text-xs text-zinc-400">{fmtDuration(w.durationMinutes)}</span>
                      {w.caloriesBurned && <span className="font-mono text-xs text-red-400">{w.caloriesBurned} kcal</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
