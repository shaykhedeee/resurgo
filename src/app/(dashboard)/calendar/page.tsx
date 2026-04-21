'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Calendar Page
// Monthly calendar view with habit/task completion overlays
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { downloadIcs, generateTasksIcs } from '@/lib/ics';
import { PixelArt } from '@/components/PixelArt';
import { PixelIcon } from '@/components/PixelIcon';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Date range for this month view
  const startDate = useMemo(() => {
    const d = `${year}-${pad(month + 1)}-01`;
    return d;
  }, [year, month]);

  const endDate = useMemo(() => {
    const last = new Date(year, month + 1, 0).getDate();
    return `${year}-${pad(month + 1)}-${pad(last)}`;
  }, [year, month]);

  const habitLogs = useQuery(api.habits.getLogsForDateRange, {
    startDate,
    endDate,
  });

  const tasks = useQuery(api.tasks.list, { status: 'done' });
  const allTasks = useQuery(api.tasks.list, {});

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [year, month]);

  // Count completions per day
  const completionMap = useMemo(() => {
    const map: Record<string, { habits: number; tasks: number }> = {};

    if (habitLogs) {
      for (const log of habitLogs) {
        if (!map[log.date]) map[log.date] = { habits: 0, tasks: 0 };
        if (log.completedAt) map[log.date].habits++;
      }
    }

    if (tasks) {
      for (const t of tasks) {
        if (t.dueDate) {
          if (!map[t.dueDate]) map[t.dueDate] = { habits: 0, tasks: 0 };
          map[t.dueDate].tasks++;
        }
      }
    }

    return map;
  }, [habitLogs, tasks]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const selectedInfo = selectedDate ? completionMap[selectedDate] : null;

  const handleExportIcs = () => {
    if (!allTasks || allTasks.length === 0) return;

    const exportableTasks = allTasks.filter((t) => t.scheduledDate || t.dueDate).map((t) => ({
      _id: String(t._id),
      title: t.title,
      description: t.description,
      dueDate: t.dueDate,
      dueTime: t.dueTime,
      scheduledDate: t.scheduledDate,
      isRecurring: t.isRecurring,
      recurrenceRule: t.recurrenceRule,
    }));
    const ics = generateTasksIcs(exportableTasks, 'RESURGO Schedule');
    const fileName = `RESURGO-calendar-${year}-${pad(month + 1)}.ics`;
    downloadIcs(fileName, ics);
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-4xl">

        {/* -- MISSION_TIMELINE HEADER -- */}
        <div className="surface-panel mb-6 overflow-hidden">
          <div className="surface-header">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="surface-kicker-accent">Mission timeline</span>
          </div>
          <div className="grid gap-4 px-5 py-5 lg:grid-cols-[minmax(0,1.45fr)_300px]">
            <div>
              <div className="flex items-center gap-2">
                <PixelIcon name="calendar" size={14} className="text-cyan-400" />
                <p className="surface-kicker">Temporal view</p>
              </div>
              <h1 className="surface-title mt-2">Schedule</h1>
              <p className="surface-subtitle mt-2 max-w-2xl">See tasks and habits as a real monthly system instead of a pile of disconnected promises. Delightfully severe, in a good way.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="surface-chip">{MONTHS[month]} {year}</span>
                <span className="surface-chip">{tasks?.length ?? 0} completed tasks</span>
                <span className="surface-chip">{habitLogs?.length ?? 0} habit logs</span>
              </div>
            </div>
            <div className="surface-panel-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="surface-kicker-accent">Calendar export</p>
                  <p className="mt-2 font-terminal text-lg font-semibold text-zinc-100">Sync your schedule outside the bunker</p>
                  <p className="mt-2 font-terminal text-sm text-zinc-400">Export an `.ics` snapshot whenever you want your timeline elsewhere.</p>
                </div>
                <PixelArt variant="calendar" className="h-20 w-20" title="Calendar pixel art" />
              </div>
              <button
                onClick={handleExportIcs}
                disabled={!allTasks || allTasks.length === 0}
                className="action-tile mt-4 w-full justify-center text-cyan-300 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <PixelIcon name="calendar" size={14} className="text-cyan-400" />
                <span className="font-terminal text-sm">Export .ics</span>
              </button>
            </div>
          </div>
        </div>

        {/* -- UPCOMING 7 DAYS PANEL -- */}
        <div className="surface-panel mb-4 overflow-hidden">
          <div className="surface-header">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
            <span className="surface-kicker-accent">Upcoming 7 days</span>
          </div>
          <div className="divide-y divide-zinc-900">
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date(today);
              d.setDate(d.getDate() + i);
              const ds = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
              const tc = allTasks?.filter((t) => t.dueDate === ds && t.status !== 'done').length ?? 0;
              const hc = habitLogs?.filter((h) => h.date === ds && h.completedAt).length ?? 0;
              return (
                <div key={ds} className="flex items-center gap-4 px-4 py-2">
                  <span className="w-36 font-mono text-xs text-zinc-400">{ds === todayStr ? `${ds} (today)` : ds}</span>
                  <span className="font-mono text-xs text-cyan-400">{tc} task{tc !== 1 ? 's' : ''}</span>
                  <span className="font-mono text-xs text-green-400">{hc} habit{hc !== 1 ? 's' : ''}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* -- CALENDAR PANEL -- */}
        <div className="surface-panel overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">
            <button
              onClick={prevMonth}
              className="border border-zinc-800 p-1.5 text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-center">
              <h2 className="font-mono text-sm font-bold tracking-widest text-zinc-200">
                {MONTHS[month].toUpperCase()}_{year}
              </h2>
              <button
                onClick={goToday}
                className="font-mono text-xs tracking-widest text-orange-600 hover:underline"
              >
                [TODAY]
              </button>
              <div className="mt-1 flex justify-center gap-1">
                {(['month', 'week', 'day'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`border px-2 py-0.5 font-mono text-xs transition ${viewMode === m ? 'border-orange-600 text-orange-400' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={nextMonth}
              className="border border-zinc-800 p-1.5 text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 md:p-4">
            {/* Month view */}
            {viewMode === 'month' && (
              <>
                {/* Days of week header */}
                <div className="mb-1 grid grid-cols-7 gap-px">
                  {DAYS.map((d) => (
                    <div key={d} className="py-1.5 text-center font-mono text-xs tracking-widest text-zinc-400">
                      {d.toUpperCase()}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="mb-4 grid grid-cols-7 gap-px bg-zinc-900">
                  {calendarDays.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} className="bg-zinc-950" />;

                    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
                    const isToday    = dateStr === todayStr;
                    const isSelected = dateStr === selectedDate;
                    const data       = completionMap[dateStr];
                    const hasActivity = data && (data.habits > 0 || data.tasks > 0);

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                        className={`flex h-12 flex-col items-center justify-center text-sm transition md:h-14 ${
                          isSelected
                            ? 'bg-orange-950/50 font-bold text-orange-500'
                            : isToday
                              ? 'bg-zinc-900 font-bold text-orange-400'
                              : 'bg-zinc-950 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                        }`}
                      >
                        <span className="font-mono text-xs">{day}</span>
                        {hasActivity && !isSelected && (
                          <div className="mt-0.5 flex items-center gap-0.5">
                            {data.habits > 0 && <div className="h-1 w-1 bg-green-500" />}
                            {data.tasks  > 0 && <div className="h-1 w-1 bg-cyan-500" />}
                            {data.habits >= 3 && <span className="text-xs leading-none">🔥</span>}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Week view */}
            {viewMode === 'week' && (() => {
              const ws = new Date(currentDate);
              const dow = ws.getDay();
              ws.setDate(ws.getDate() + (dow === 0 ? -6 : 1 - dow));
              const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              return (
                <div className="mb-4 grid grid-cols-7 gap-px bg-zinc-900">
                  {weekLabels.map((label, i) => {
                    const d = new Date(ws);
                    d.setDate(d.getDate() + i);
                    const ds = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
                    const dayTasks = allTasks?.filter((t) => t.dueDate === ds) ?? [];
                    const dayHabits = habitLogs?.filter((h) => h.date === ds && h.completedAt).length ?? 0;
                    const isTodayCol = ds === todayStr;
                    return (
                      <div key={ds} className="min-h-24 bg-zinc-950 p-1.5">
                        <div className={`mb-1 font-mono text-xs font-bold ${isTodayCol ? 'text-orange-400' : 'text-zinc-400'}`}>
                          {label} {d.getDate()}
                        </div>
                        {dayTasks.slice(0, 3).map((t) => (
                          <div key={String(t._id)} className="truncate font-mono text-xs text-cyan-400">{t.title}</div>
                        ))}
                        {dayHabits > 0 && (
                          <div className="mt-0.5 font-mono text-xs text-green-400">{dayHabits} ✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Day view */}
            {viewMode === 'day' && (() => {
              const dayStr = selectedDate ?? todayStr;
              const dayTasks = allTasks?.filter((t) => t.dueDate === dayStr) ?? [];
              const dayHabits = habitLogs?.filter((h) => h.date === dayStr && h.completedAt).length ?? 0;
              return (
                <div className="mb-4">
                  <p className="mb-3 font-mono text-xs font-bold tracking-widest text-zinc-300">
                    DAY_VIEW_{dayStr}
                  </p>
                  {dayTasks.length === 0 && dayHabits === 0 ? (
                    <p className="font-mono text-xs text-zinc-500">NO_ACTIVITY_FOR_THIS_DAY</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dayTasks.map((t) => (
                        <div key={String(t._id)} className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 flex-shrink-0 ${t.status === 'done' ? 'bg-cyan-500' : 'bg-zinc-600'}`} />
                          <span className="font-mono text-xs text-zinc-300">{t.title}</span>
                          {t.status === 'done' && <span className="font-mono text-xs text-zinc-600">DONE</span>}
                        </div>
                      ))}
                      {dayHabits > 0 && (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 flex-shrink-0 bg-green-500" />
                          <span className="font-mono text-xs text-green-400">{dayHabits} habit{dayHabits !== 1 ? 's' : ''} completed</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-zinc-400">
                <div className="h-1.5 w-1.5 bg-green-500" /> HABITS_COMPLETED
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-zinc-400">
                <div className="h-1.5 w-1.5 bg-cyan-500" /> TASKS_COMPLETED
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-zinc-400">
                🔥 = streak day (3+ habits)
              </span>
            </div>
          </div>
        </div>

        {/* -- SELECTED DAY DETAIL -- */}
        {selectedDate && (
          <div className="surface-panel mt-4">
            <div className="border-b border-zinc-900 px-4 py-2.5">
              <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">
                DATE_{selectedDate}
              </span>
            </div>
            <div className="p-4">
              {selectedInfo ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    <span className="font-mono text-xs text-zinc-400">
                      {selectedInfo.habits}_NODE{selectedInfo.habits !== 1 ? 'S' : ''}_COMPLETED
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Circle className="h-3.5 w-3.5 text-blue-500" />
                    <span className="font-mono text-xs text-zinc-400">
                      {selectedInfo.tasks}_TASK{selectedInfo.tasks !== 1 ? 'S' : ''}_COMPLETED
                    </span>
                  </div>
                </div>
              ) : (
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_ACTIVITY_RECORDED</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
