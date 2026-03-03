'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { FormEvent, useState } from 'react';
import { BookOpen, Smile, Meh, Frown, Plus, Calendar, Moon, Apple, Droplets, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOOD_LABELS = ['', 'Very Low', 'Low', 'Okay', 'Good', 'Great'];
const MOOD_COLORS = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];
const MOOD_ICONS  = [null, Frown, Frown, Meh, Smile, Smile];
const MOOD_TAGS   = ['Stressed', 'Anxious', 'Calm', 'Energetic', 'Tired', 'Focused', 'Social', 'Lonely', 'Motivated', 'Grateful'];
const JOURNAL_TYPES = [
  { id: 'reflection' as const, label: 'Reflection' },
  { id: 'gratitude'  as const, label: 'Gratitude'  },
  { id: 'goal_note'  as const, label: 'Goal Note'  },
  { id: 'freeform'   as const, label: 'Freeform'   },
];
type JournalType = 'reflection' | 'gratitude' | 'goal_note' | 'freeform';
type Tab = 'mood' | 'journal' | 'sleep' | 'nutrition';

export default function WellnessPage() {
  const today = new Date().toISOString().split('T')[0];
  const [tab, setTab] = useState<Tab>('mood');

  const logMoodMut      = useMutation(api.wellness.logMood);
  const createJournal   = useMutation(api.wellness.createJournalEntry);
  const logSleepMut     = useMutation(api.sleep.logSleep);
  const logMealMut      = useMutation(api.nutrition.logMeal);
  const updateHydration = useMutation(api.nutrition.updateWaterAndSteps);

  const moodHistory    = useQuery(api.wellness.getMoodHistory, { days: 30 });
  const journalEntries = useQuery(api.wellness.getJournalEntries, { limit: 20 });
  const sleepLogs      = useQuery(api.sleep.listSleepLogs, { days: 14 });
  const sleepStats     = useQuery(api.sleep.getSleepStats, { days: 14 });
  const todayNutrition = useQuery(api.nutrition.getNutritionLog, { date: today });

  const [moodScore, setMoodScore] = useState(3);
  const [moodNotes, setMoodNotes] = useState('');
  const [moodTags,  setMoodTags]  = useState<string[]>([]);
  const [moodSaving, setMoodSaving] = useState(false);
  const todayMood = moodHistory?.find((m: any) => m.date === today);

  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalContent, setJournalContent]   = useState('');
  const [journalType, setJournalType] = useState<JournalType>('freeform');
  const [journalSaving, setJournalSaving] = useState(false);

  const [sleepBedtime, setSleepBedtime] = useState('23:00');
  const [sleepWake,    setSleepWake]    = useState('07:00');
  const [sleepQuality, setSleepQuality] = useState(3);
  const [sleepNotes,   setSleepNotes]   = useState('');
  const [sleepSaving,  setSleepSaving]  = useState(false);

  const [mealName,     setMealName]     = useState('');
  const [mealCals,     setMealCals]     = useState('');
  const [mealProtein,  setMealProtein]  = useState('');
  const [mealCarbs,    setMealCarbs]    = useState('');
  const [mealFat,      setMealFat]      = useState('');
  const [waterMl,      setWaterMl]      = useState('');
  const [stepCount,    setStepCount]    = useState('');
  const [mealSaving,   setMealSaving]   = useState(false);

  const handleMoodSubmit = async () => {
    if (moodSaving) return;
    setMoodSaving(true);
    try {
      await logMoodMut({ date: today, score: moodScore, notes: moodNotes || undefined, tags: moodTags.length ? moodTags : undefined });
      setMoodNotes(''); setMoodTags([]);
    } finally { setMoodSaving(false); }
  };

  const handleJournalSubmit = async () => {
    if (!journalContent.trim() || journalSaving) return;
    setJournalSaving(true);
    try {
      await createJournal({ date: today, content: journalContent, type: journalType });
      setJournalContent(''); setShowJournalForm(false);
    } finally { setJournalSaving(false); }
  };

  const handleSleepSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sleepSaving) return;
    setSleepSaving(true);
    try {
      await logSleepMut({ date: today, bedtime: sleepBedtime, wakeTime: sleepWake, quality: sleepQuality, notes: sleepNotes || undefined });
      setSleepNotes('');
    } finally { setSleepSaving(false); }
  };

  const handleMealSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!mealName || !mealCals || mealSaving) return;
    setMealSaving(true);
    try {
      await logMealMut({
        date: today,
        meal: {
          name: mealName,
          calories: parseFloat(mealCals),
          protein: mealProtein ? parseFloat(mealProtein) : undefined,
          carbs: mealCarbs ? parseFloat(mealCarbs) : undefined,
          fat: mealFat ? parseFloat(mealFat) : undefined,
          time: new Date().toTimeString().slice(0, 5),
        },
      });
      setMealName(''); setMealCals(''); setMealProtein(''); setMealCarbs(''); setMealFat('');
    } finally { setMealSaving(false); }
  };

  const handleHydration = async () => {
    await updateHydration({
      date: today,
      waterMl: waterMl ? parseFloat(waterMl) : undefined,
      steps: stepCount ? parseInt(stepCount) : undefined,
    });
    setWaterMl(''); setStepCount('');
  };

  const toggleTag = (tag: string) =>
    setMoodTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const fmtDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'mood',      label: 'MOOD',      icon: Smile    },
    { id: 'journal',   label: 'JOURNAL',   icon: BookOpen },
    { id: 'sleep',     label: 'SLEEP',     icon: Moon     },
    { id: 'nutrition', label: 'NUTRITION', icon: Apple    },
  ];

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">BIOMETRICS :: WELLNESS_SUITE</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Health & Wellness</h1>
            <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">Mood · Journal · Sleep · Nutrition</p>
          </div>
          <div className="flex border-t border-zinc-900">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn('flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 font-mono text-xs tracking-widest transition',
                  tab === id ? 'border-orange-600 bg-orange-950/10 text-orange-500' : 'border-transparent text-zinc-400 hover:text-zinc-400'
                )}>
                <Icon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'mood' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">{todayMood ? 'UPDATE_TODAY_MOOD' : 'LOG_TODAY_MOOD'}</span>
              </div>
              <div className="p-4">
                <p className="mb-3 font-mono text-xs tracking-widest text-zinc-400">SCORE_SELECTION</p>
                <div className="mb-4 flex gap-2">
                  {[1,2,3,4,5].map((score) => {
                    const Icon = MOOD_ICONS[score] || Meh;
                    return (
                      <button key={score} onClick={() => setMoodScore(score)}
                        className={cn('flex flex-1 flex-col items-center gap-1 border py-3 transition',
                          moodScore === score ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        )}>
                        <Icon className={cn('h-5 w-5', MOOD_COLORS[score])} />
                        <span className="font-mono text-xs tracking-widest">{MOOD_LABELS[score].toUpperCase().replace(' ','_')}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">QUALIFIER_TAGS</p>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {MOOD_TAGS.map((tag) => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={cn('border px-2.5 py-1 font-mono text-xs tracking-widest transition',
                        moodTags.includes(tag) ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      )}>
                      {tag.toUpperCase()}
                    </button>
                  ))}
                </div>
                <textarea value={moodNotes} onChange={(e) => setMoodNotes(e.target.value)} placeholder="OPTIONAL_NOTES..."
                  className="mb-4 w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" rows={3} />
                <button onClick={handleMoodSubmit} disabled={moodSaving}
                  className="border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
                  {todayMood ? '[UPDATE_MOOD]' : '[LOG_MOOD]'}
                </button>
              </div>
            </div>
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">MOOD_HISTORY</span>
              </div>
              {(!moodHistory || moodHistory.length === 0) ? (
                <div className="py-8 text-center"><p className="font-mono text-xs tracking-widest text-zinc-400">NO_ENTRIES_YET</p></div>
              ) : (
                <div className="space-y-px p-1">
                  {moodHistory.slice(0, 14).map((entry: any) => {
                    const Icon = MOOD_ICONS[entry.score] || Meh;
                    return (
                      <div key={entry._id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-zinc-900">
                        <Icon className={cn('mt-0.5 h-4 w-4 shrink-0', MOOD_COLORS[entry.score])} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="font-mono text-xs text-zinc-300">{MOOD_LABELS[entry.score].toUpperCase().replace(' ','_')}</span>
                            {entry.tags?.map((tag: string) => (
                              <span key={tag} className="border border-zinc-800 px-1.5 py-0.5 font-mono text-xs tracking-widest text-zinc-400">{tag.toUpperCase()}</span>
                            ))}
                          </div>
                          {entry.notes && <p className="mt-0.5 font-mono text-xs text-zinc-400">{entry.notes}</p>}
                        </div>
                        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-zinc-400"><Calendar className="h-3 w-3" />{entry.date}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'journal' && (
          <div className="space-y-4">
            {!showJournalForm ? (
              <button onClick={() => setShowJournalForm(true)}
                className="flex w-full items-center justify-center gap-2 border border-dashed border-zinc-800 bg-zinc-950 py-4 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-orange-800 hover:text-orange-600">
                <Plus className="h-3 w-3" /> [NEW_ENTRY]
              </button>
            ) : (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
                  <BookOpen className="h-3 w-3 text-zinc-400" />
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">NEW_JOURNAL_ENTRY</span>
                </div>
                <div className="p-4">
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {JOURNAL_TYPES.map((t) => (
                      <button key={t.id} onClick={() => setJournalType(t.id)}
                        className={cn('border px-3 py-1.5 font-mono text-xs tracking-widest transition',
                          journalType === t.id ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        )}>
                        {t.label.toUpperCase().replace(' ','_')}
                      </button>
                    ))}
                  </div>
                  <textarea value={journalContent} onChange={(e) => setJournalContent(e.target.value)}
                    placeholder={journalType === 'gratitude' ? 'WHAT ARE YOU GRATEFUL FOR...' : journalType === 'reflection' ? 'REFLECT ON YOUR DAY...' : 'WRITE YOUR THOUGHTS...'}
                    className="mb-4 w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" rows={6} />
                  <div className="flex gap-2">
                    <button onClick={handleJournalSubmit} disabled={!journalContent.trim() || journalSaving}
                      className="border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
                      [SAVE_ENTRY]
                    </button>
                    <button onClick={() => { setShowJournalForm(false); setJournalContent(''); }}
                      className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-400">
                      [CANCEL]
                    </button>
                  </div>
                </div>
              </div>
            )}
            {(!journalEntries || journalEntries.length === 0) ? (
              <div className="border border-zinc-900 bg-zinc-950 py-12 text-center">
                <BookOpen className="mx-auto mb-3 h-6 w-6 text-zinc-400" />
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_ENTRIES_YET</p>
              </div>
            ) : (
              <div className="space-y-px">
                {journalEntries.map((entry: any) => (
                  <div key={entry._id} className="border border-zinc-900 bg-zinc-950 p-4 transition hover:bg-zinc-900">
                    <div className="mb-2 flex items-center justify-between">
                      <span className={cn('border px-2 py-0.5 font-mono text-xs tracking-widest',
                        entry.type === 'gratitude'  ? 'border-green-900 text-green-600' :
                        entry.type === 'reflection' ? 'border-blue-900 text-blue-600'  :
                        entry.type === 'goal_note'  ? 'border-purple-900 text-purple-600' : 'border-zinc-800 text-zinc-400'
                      )}>{(entry.type ?? 'freeform').toUpperCase()}</span>
                      <span className="font-mono text-xs text-zinc-400">{entry.date}</span>
                    </div>
                    <p className="font-mono text-xs leading-relaxed text-zinc-400 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'sleep' && (
          <div className="space-y-4">
            {sleepStats && sleepStats.totalLogs > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'AVG SLEEP',     value: sleepStats.avgDurationMinutes > 0 ? fmtDuration(sleepStats.avgDurationMinutes) : '--' },
                  { label: 'AVG QUALITY',   value: `${sleepStats.avgQuality}/5` },
                  { label: 'NIGHTS LOGGED', value: String(sleepStats.totalLogs) },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-zinc-900 bg-zinc-950 p-4">
                    <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
                    <p className="mt-2 font-mono text-lg font-bold text-blue-400">{value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">LOG_LAST_NIGHT</span>
              </div>
              <form onSubmit={handleSleepSubmit} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-1 font-mono text-xs tracking-widest text-zinc-400">BEDTIME</p>
                    <input type="time" value={sleepBedtime} onChange={(e) => setSleepBedtime(e.target.value)}
                      className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-blue-800 focus:outline-none" />
                  </div>
                  <div>
                    <p className="mb-1 font-mono text-xs tracking-widest text-zinc-400">WAKE_TIME</p>
                    <input type="time" value={sleepWake} onChange={(e) => setSleepWake(e.target.value)}
                      className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-300 focus:border-blue-800 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">SLEEP_QUALITY (1-5)</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map((q) => (
                      <button key={q} type="button" onClick={() => setSleepQuality(q)}
                        className={cn('flex-1 border py-2 font-mono text-xs transition',
                          sleepQuality === q ? 'border-blue-700 bg-blue-950/30 text-blue-400' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        )}>{q}</button>
                    ))}
                  </div>
                </div>
                <textarea value={sleepNotes} onChange={(e) => setSleepNotes(e.target.value)}
                  placeholder="Notes (optional)..." rows={2}
                  className="w-full resize-none border border-zinc-800 bg-black px-3 py-2 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-blue-800 focus:outline-none" />
                <button type="submit" disabled={sleepSaving}
                  className="border border-blue-800 bg-blue-950/30 px-6 py-2 font-mono text-xs tracking-widest text-blue-500 transition hover:bg-blue-950/60 disabled:opacity-40">
                  {sleepSaving ? 'SAVING_' : '[LOG_SLEEP]'}
                </button>
              </form>
            </div>
            {sleepLogs && sleepLogs.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">SLEEP_HISTORY</span>
                </div>
                <div className="divide-y divide-zinc-900">
                  {sleepLogs.map((log: any) => (
                    <div key={log._id} className="flex items-center gap-4 px-4 py-2.5">
                      <span className="font-mono text-xs text-zinc-400">{log.date}</span>
                      <span className="font-mono text-xs text-zinc-300">
                        {log.bedtime} → {log.wakeTime}{log.durationMinutes ? ` (${fmtDuration(log.durationMinutes)})` : ''}
                      </span>
                      {log.quality && <span className="ml-auto font-mono text-xs tracking-widest text-blue-500">Q:{log.quality}/5</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'nutrition' && (
          <div className="space-y-4">
            {todayNutrition && (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: 'CALORIES', value: `${todayNutrition.totalCalories} kcal`, color: 'text-amber-400' },
                  { label: 'PROTEIN',  value: `${todayNutrition.totalProtein ?? 0}g`,  color: 'text-blue-400'  },
                  { label: 'WATER',    value: todayNutrition.waterMl ? `${todayNutrition.waterMl} ml` : '--', color: 'text-cyan-400'  },
                  { label: 'STEPS',    value: todayNutrition.steps ? todayNutrition.steps.toLocaleString() : '--', color: 'text-green-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="border border-zinc-900 bg-zinc-950 p-4">
                    <p className="font-mono text-xs tracking-widest text-zinc-400">{label}</p>
                    <p className={cn('mt-2 font-mono text-lg font-bold', color)}>{value}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">LOG_MEAL</span>
              </div>
              <form onSubmit={handleMealSubmit} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={mealName} onChange={(e) => setMealName(e.target.value)} placeholder="Meal name" required
                    className="h-9 col-span-2 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-amber-800 focus:outline-none" />
                  <input type="number" value={mealCals} onChange={(e) => setMealCals(e.target.value)} placeholder="Calories (kcal)" required
                    className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-amber-800 focus:outline-none" />
                  <input type="number" value={mealProtein} onChange={(e) => setMealProtein(e.target.value)} placeholder="Protein (g)"
                    className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-amber-800 focus:outline-none" />
                  <input type="number" value={mealCarbs} onChange={(e) => setMealCarbs(e.target.value)} placeholder="Carbs (g)"
                    className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-amber-800 focus:outline-none" />
                  <input type="number" value={mealFat} onChange={(e) => setMealFat(e.target.value)} placeholder="Fat (g)"
                    className="h-9 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-amber-800 focus:outline-none" />
                </div>
                <button type="submit" disabled={mealSaving}
                  className="border border-amber-800 bg-amber-950/30 px-6 py-2 font-mono text-xs tracking-widest text-amber-500 transition hover:bg-amber-950/60 disabled:opacity-40">
                  {mealSaving ? 'SAVING_' : '[LOG_MEAL]'}
                </button>
              </form>
            </div>
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">HYDRATION_AND_MOVEMENT</span>
              </div>
              <div className="flex flex-wrap gap-3 p-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-cyan-500" />
                  <input type="number" value={waterMl} onChange={(e) => setWaterMl(e.target.value)} placeholder="Water (ml)"
                    className="h-9 w-32 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-cyan-800 focus:outline-none" />
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-500" />
                  <input type="number" value={stepCount} onChange={(e) => setStepCount(e.target.value)} placeholder="Steps"
                    className="h-9 w-32 border border-zinc-800 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-400 focus:border-green-800 focus:outline-none" />
                </div>
                <button onClick={handleHydration}
                  className="border border-cyan-800 bg-cyan-950/20 px-4 py-2 font-mono text-xs tracking-widest text-cyan-500 transition hover:bg-cyan-950/40">
                  [UPDATE]
                </button>
              </div>
            </div>
            {todayNutrition?.meals && todayNutrition.meals.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">TODAY_MEALS</span>
                </div>
                <div className="divide-y divide-zinc-900">
                  {todayNutrition.meals.map((meal: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <Apple className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                      <div className="flex-1">
                        <p className="font-mono text-xs text-zinc-300">{meal.name}</p>
                        {meal.time && <p className="font-mono text-xs text-zinc-400">{meal.time}</p>}
                      </div>
                      <p className="font-mono text-xs font-bold text-amber-400">{meal.calories} kcal</p>
                      {meal.protein && <p className="font-mono text-xs text-blue-500">{meal.protein}g P</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
