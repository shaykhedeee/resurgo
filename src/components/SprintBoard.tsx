'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Jira-style Sprint Board Component
// Solo developer-assistant sprint board with telemetry & keyboard shortcuts
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { Calendar, Play, CheckCircle2, ChevronRight, BarChart3, Users, HelpCircle, Terminal } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  points: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  column: 'todo' | 'in_progress' | 'review' | 'done';
  assignee: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 'R-101', title: 'Implement Convex OAuth schemas', points: 5, priority: 'urgent', column: 'done', assignee: 'IndieDev' },
  { id: 'R-102', title: 'Standardize retro flat-button design system', points: 3, priority: 'high', column: 'in_progress', assignee: 'IndieDev' },
  { id: 'R-103', title: 'Resolve chatbot task creation over-eagerness', points: 8, priority: 'high', column: 'todo', assignee: 'IndieDev' },
  { id: 'R-104', title: 'Audit site accessibility & keyboard focus rings', points: 2, priority: 'medium', column: 'todo', assignee: 'IndieDev' },
  { id: 'R-105', title: 'Build visual Obsidian mind-graph panel', points: 5, priority: 'medium', column: 'review', assignee: 'IndieDev' },
];

export default function SprintBoard() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeSprintName] = useState('SOLO_SPRINT_ALPHA');

  const moveTask = (id: string, newCol: Task['column']) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, column: newCol } : t));
  };

  const getPointsForCol = (col: Task['column']) => 
    tasks.filter(t => t.column === col).reduce((sum, t) => sum + t.points, 0);

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const donePoints = getPointsForCol('done');
  const velocityPct = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  const priorities = {
    low: 'text-zinc-500 border-zinc-800 bg-zinc-950',
    medium: 'text-cyan-400 border-cyan-900/40 bg-cyan-950/10',
    high: 'text-orange-400 border-orange-950/50 bg-orange-950/20',
    urgent: 'text-red-400 border-red-950 bg-red-950/30 animate-pulse',
  };

  return (
    <div className="border-2 border-zinc-800 bg-zinc-950 p-6 rounded-[2px] font-mono shadow-[4px_4px_0px_rgba(0,0,0,0.85)] max-w-5xl mx-auto space-y-6">
      {/* SPRINT HUD */}
      <div className="border-b-2 border-zinc-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-orange-500" />
            <h2 className="text-sm font-bold tracking-widest text-zinc-100 uppercase">JIRA_DEVELOPER_ASSISTANT v2.4</h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[9px] text-zinc-500 uppercase tracking-wide">
            <span className="text-orange-500 font-bold">SPRINT: {activeSprintName}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              May 24 - Jun 07
            </span>
          </div>
        </div>

        {/* METRICS PANEL */}
        <div className="flex gap-4">
          <div className="border border-zinc-800 bg-black px-4 py-2 text-center">
            <p className="text-[7px] text-zinc-500 uppercase tracking-widest">Velocity</p>
            <p className="text-sm font-bold text-emerald-400 mt-0.5">{velocityPct}%</p>
          </div>
          <div className="border border-zinc-800 bg-black px-4 py-2 text-center">
            <p className="text-[7px] text-zinc-500 uppercase tracking-widest">Story Points</p>
            <p className="text-sm font-bold text-zinc-100 mt-0.5">{donePoints} / {totalPoints}</p>
          </div>
          <div className="border border-zinc-800 bg-black px-4 py-2 text-center">
            <p className="text-[7px] text-zinc-500 uppercase tracking-widest">Active Sprint Tasks</p>
            <p className="text-sm font-bold text-zinc-100 mt-0.5">{tasks.filter(t => t.column !== 'done').length}</p>
          </div>
        </div>
      </div>

      {/* SPRINT BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['todo', 'in_progress', 'review', 'done'] as const).map(col => {
          const colTasks = tasks.filter(t => t.column === col);
          const colPoints = getPointsForCol(col);
          const colHeaders = {
            todo: { title: 'Backlog / Todo', color: 'border-zinc-800 text-zinc-400 bg-zinc-950/40' },
            in_progress: { title: 'In Progress', color: 'border-cyan-900 text-cyan-400 bg-cyan-950/20' },
            review: { title: 'QA / Review', color: 'border-purple-900 text-purple-400 bg-purple-950/20' },
            done: { title: 'Done / Commits', color: 'border-emerald-900 text-emerald-400 bg-emerald-950/20' },
          };

          return (
            <div key={col} className={`border p-3 rounded-[2px] flex flex-col justify-between min-h-[300px] ${colHeaders[col].color}`}>
              <div>
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {colHeaders[col].title}
                  </span>
                  <span className="px-1.5 py-0.5 text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-[1px]">
                    {colPoints} SP
                  </span>
                </div>

                <div className="space-y-2">
                  {colTasks.map(task => (
                    <div 
                      key={task.id} 
                      className="border border-zinc-800 bg-black p-2.5 rounded-[1px] hover:border-zinc-700 transition-colors shadow-[2px_2px_0px_rgba(0,0,0,0.8)] flex flex-col justify-between min-h-[70px] relative group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[7px] text-zinc-500 font-bold">{task.id}</span>
                          <span className={`px-1 text-[7px] border rounded-[1px] uppercase ${priorities[task.priority]}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-300 leading-normal line-clamp-2">
                          {task.title}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[8px] text-zinc-600 bg-zinc-950 px-1 border border-zinc-900">
                          {task.points} SP
                        </span>
                        
                        {/* COLUMN TRANSLATORS */}
                        <div className="flex gap-1">
                          {col !== 'todo' && (
                            <button
                              onClick={() => {
                                const prevCols: Record<Task['column'], Task['column']> = {
                                  todo: 'todo',
                                  in_progress: 'todo',
                                  review: 'in_progress',
                                  done: 'review',
                                };
                                moveTask(task.id, prevCols[col]);
                              }}
                              className="p-0.5 border border-zinc-800 hover:border-zinc-600 text-[8px] text-zinc-500 hover:text-zinc-300 bg-zinc-900/50"
                              title="Move back"
                            >
                              ◀
                            </button>
                          )}
                          {col !== 'done' && (
                            <button
                              onClick={() => {
                                const nextCols: Record<Task['column'], Task['column']> = {
                                  todo: 'in_progress',
                                  in_progress: 'review',
                                  review: 'done',
                                  done: 'done',
                                };
                                moveTask(task.id, nextCols[col]);
                              }}
                              className="p-0.5 border border-zinc-800 hover:border-zinc-600 text-[8px] text-zinc-500 hover:text-zinc-300 bg-zinc-900/50"
                              title="Move forward"
                            >
                              ▶
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="border border-dashed border-zinc-900 py-8 text-center text-[9px] text-zinc-600 uppercase">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SPRINT TELEMETRY / BURNDOWN CHART */}
      <div className="border border-zinc-800 bg-black p-4">
        <div className="flex items-center gap-1.5 mb-3 border-b border-zinc-900 pb-2">
          <BarChart3 className="h-4 w-4 text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
            Sprint Burndown Telemetry
          </span>
        </div>

        {/* ASCII TELEMETRY BURNDOWN */}
        <div className="font-mono text-[8px] leading-tight text-zinc-600 bg-zinc-950 p-3 overflow-x-auto border border-zinc-900">
          <p className="text-zinc-500 mb-1">STORY POINTS REMAINING BY SPRINT DAY</p>
          <pre className="text-cyan-500">
{`25 SP | * 
20 SP |   * *
15 SP |       *
10 SP |         * * 
05 SP |             * 
00 SP |               * * * [Target Burn]
      +---------------------------------
       D1  D3  D5  D7  D9  D11 D13 D14`}
          </pre>
          <div className="mt-2 text-[9px] text-zinc-500 flex justify-between uppercase">
            <span>Sprint Burn Rate: 1.8 SP / day</span>
            <span className="text-emerald-500">Telemetry Status: ON TRACK (Done Points: {donePoints} SP)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
