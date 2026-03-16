'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Calendar Page
// Monthly calendar view with habit/task completion overlays
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Download } from 'lucide-react';
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
            </div>
            <button
              onClick={nextMonth}
              className="border border-zinc-800 p-1.5 text-zinc-500 transition hover:border-zinc-700 hover:text-zinc-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 md:p-4">
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
                      <div className="mt-0.5 flex gap-0.5">
                        {data.habits > 0 && <div className="h-1 w-1 bg-green-500" />}
                        {data.tasks  > 0 && <div className="h-1 w-1 bg-cyan-500" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-zinc-400">
                <div className="h-1.5 w-1.5 bg-green-500" /> HABITS_COMPLETED
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs tracking-widest text-zinc-400">
                <div className="h-1.5 w-1.5 bg-cyan-500" /> TASKS_COMPLETED
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
