// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Global Search (Command Palette)
// Notion-style Cmd+K search across all habits, goals, tasks, and commands
// Enhanced with Fuse.js for fuzzy search
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Fuse, { IFuseOptions } from 'fuse.js';
import {
  Search,
  Target,
  Sparkles,
  CheckCircle2,
  Calendar,
  Timer,
  TrendingUp,
  Heart,
  Plus,
  ArrowRight,
  Keyboard,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  type: 'habit' | 'goal' | 'task' | 'command' | 'page';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// FUSE.JS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const fuseOptions: IFuseOptions<SearchResult> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'subtitle', weight: 0.3 },
    { name: 'keywords', weight: 0.2 },
  ],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
  ignoreLocation: true,
  findAllMatches: true,
};

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const { habits, goals, tasks } = useAscendStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ascend-recent-searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build search results
  const allResults = useMemo<SearchResult[]>(() => {
    const results: SearchResult[] = [];

    // Commands/Actions
    const commands: SearchResult[] = [
      {
        id: 'cmd-new-habit',
        type: 'command',
        title: 'Create New Habit',
        subtitle: 'Add a daily habit to track',
        icon: <Plus className="w-4 h-4 text-purple-400" />,
        action: () => {
          onNavigate?.('habits');
          onClose();
        },
        keywords: ['add', 'new', 'habit', 'create'],
      },
      {
        id: 'cmd-new-goal',
        type: 'command',
        title: 'Create New Goal',
        subtitle: 'Set an ultimate goal with AI decomposition',
        icon: <Plus className="w-4 h-4 text-gold-400" />,
        action: () => {
          onNavigate?.('goals');
          onClose();
        },
        keywords: ['add', 'new', 'goal', 'create', 'dream'],
      },
      {
        id: 'cmd-new-task',
        type: 'command',
        title: 'Create New Task',
        subtitle: 'Add a one-time task',
        icon: <Plus className="w-4 h-4 text-blue-400" />,
        action: () => {
          onNavigate?.('tasks');
          onClose();
        },
        keywords: ['add', 'new', 'task', 'create', 'todo'],
      },
    ];

    // Pages/Navigation
    const pages: SearchResult[] = [
      {
        id: 'page-today',
        type: 'page',
        title: 'Today',
        subtitle: "Your daily overview",
        icon: <Calendar className="w-4 h-4 text-ascend-500" />,
        action: () => {
          onNavigate?.('today');
          onClose();
        },
        keywords: ['home', 'dashboard', 'today'],
      },
      {
        id: 'page-habits',
        type: 'page',
        title: 'Habits',
        subtitle: 'Manage your habits',
        icon: <Target className="w-4 h-4 text-purple-400" />,
        action: () => {
          onNavigate?.('habits');
          onClose();
        },
        keywords: ['habits', 'tracking', 'routine'],
      },
      {
        id: 'page-goals',
        type: 'page',
        title: 'Goals',
        subtitle: 'Your ultimate goals',
        icon: <Sparkles className="w-4 h-4 text-gold-400" />,
        action: () => {
          onNavigate?.('goals');
          onClose();
        },
        keywords: ['goals', 'dreams', 'objectives'],
      },
      {
        id: 'page-tasks',
        type: 'page',
        title: 'Tasks',
        subtitle: 'All your tasks',
        icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
        action: () => {
          onNavigate?.('tasks');
          onClose();
        },
        keywords: ['tasks', 'todos', 'checklist'],
      },
      {
        id: 'page-focus',
        type: 'page',
        title: 'Focus Mode',
        subtitle: 'Pomodoro timer & deep work',
        icon: <Timer className="w-4 h-4 text-orange-400" />,
        action: () => {
          onNavigate?.('focus');
          onClose();
        },
        keywords: ['focus', 'pomodoro', 'timer', 'work'],
      },
      {
        id: 'page-calendar',
        type: 'page',
        title: 'Calendar',
        subtitle: 'Monthly view of your progress',
        icon: <Calendar className="w-4 h-4 text-pink-400" />,
        action: () => {
          onNavigate?.('calendar');
          onClose();
        },
        keywords: ['calendar', 'month', 'schedule'],
      },
      {
        id: 'page-analytics',
        type: 'page',
        title: 'Analytics',
        subtitle: 'Your progress stats',
        icon: <TrendingUp className="w-4 h-4 text-green-400" />,
        action: () => {
          onNavigate?.('progress');
          onClose();
        },
        keywords: ['analytics', 'stats', 'progress', 'charts'],
      },
      {
        id: 'page-wellness',
        type: 'page',
        title: 'Wellness',
        subtitle: 'Mental health & mood tracking',
        icon: <Heart className="w-4 h-4 text-rose-400" />,
        action: () => {
          onNavigate?.('wellness');
          onClose();
        },
        keywords: ['wellness', 'mood', 'mental', 'health', 'breathing'],
      },
    ];

    // Habits
    const habitResults: SearchResult[] = habits.map(habit => ({
      id: `habit-${habit.id}`,
      type: 'habit' as const,
      title: habit.name,
      subtitle: `${habit.category} • ${habit.frequency} • ${habit.currentStreak} day streak`,
      icon: <Target className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigate?.('habits');
        onClose();
      },
      keywords: [habit.category, habit.frequency, 'habit'],
    }));

    // Goals
    const goalResults: SearchResult[] = goals.map(goal => ({
      id: `goal-${goal.id}`,
      type: 'goal' as const,
      title: goal.title,
      subtitle: `${goal.category} • ${goal.progress}% complete`,
      icon: <Sparkles className="w-4 h-4 text-gold-400" />,
      action: () => {
        onNavigate?.('goals');
        onClose();
      },
      keywords: [goal.category, 'goal', 'dream'],
    }));

    // Tasks
    const taskResults: SearchResult[] = (tasks || []).map(task => ({
      id: `task-${task.id}`,
      type: 'task' as const,
      title: task.title,
      subtitle: task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date',
      icon: <CheckCircle2 className="w-4 h-4 text-blue-400" />,
      action: () => {
        onNavigate?.('tasks');
        onClose();
      },
      keywords: ['task', 'todo'],
    }));

    results.push(...commands, ...pages, ...habitResults, ...goalResults, ...taskResults);
    return results;
  }, [habits, goals, tasks, onNavigate, onClose]);

  // Create Fuse.js search index
  const fuse = useMemo(() => {
    return new Fuse(allResults, fuseOptions);
  }, [allResults]);

  // Filter and sort results using Fuse.js
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Show recent searches and quick actions when no query
      return allResults.filter(r => r.type === 'command' || r.type === 'page').slice(0, 10);
    }

    // Use Fuse.js for fuzzy search
    const results = fuse.search(query);
    return results.map(({ item }) => item).slice(0, 15);
  }, [query, allResults, fuse]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          // Save to recent searches
          if (query.trim()) {
            const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
            setRecentSearches(newRecent);
            localStorage.setItem('ascend-recent-searches', JSON.stringify(newRecent));
          }
          filteredResults[selectedIndex].action();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  }, [filteredResults, selectedIndex, query, recentSearches, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length]);

  if (!isOpen) return null;

  const groupedResults = {
    commands: filteredResults.filter(r => r.type === 'command'),
    pages: filteredResults.filter(r => r.type === 'page'),
    habits: filteredResults.filter(r => r.type === 'habit'),
    goals: filteredResults.filter(r => r.type === 'goal'),
    tasks: filteredResults.filter(r => r.type === 'task'),
  };

  let currentIndex = -1;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Search Modal */}
      <div 
        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 
                   md:w-[600px] max-h-[70vh] z-[101] animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div 
          className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
          style={{ backgroundColor: 'var(--card)' }}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
            <Search className="w-5 h-5 text-[var(--text-muted)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search habits, goals, tasks, or type a command..."
              className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] 
                       placeholder:text-[var(--text-muted)] text-base"
              aria-label="Search input"
              autoComplete="off"
            />
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[10px]">ESC</kbd>
              <span>to close</span>
            </div>
          </div>

          {/* Results */}
          <div 
            ref={listRef}
            className="max-h-[50vh] overflow-y-auto py-2"
            role="listbox"
            aria-label="Search results"
          >
            {filteredResults.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Search className="w-8 h-8 mx-auto text-[var(--text-muted)] mb-2" />
                <p className="text-[var(--text-secondary)]">No results found</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                {/* Commands */}
                {groupedResults.commands.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Quick Actions
                    </div>
                    {groupedResults.commands.map(result => {
                      currentIndex++;
                      const idx = currentIndex;
                      return (
                        <button
                          key={result.id}
                          data-index={idx}
                          onClick={() => result.action()}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            selectedIndex === idx 
                              ? "bg-ascend-500/10" 
                              : "hover:bg-[var(--surface-hover)]"
                          )}
                          role="option"
                          aria-selected={selectedIndex === idx}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text-primary)] truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-[var(--text-muted)] truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Pages */}
                {groupedResults.pages.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Pages
                    </div>
                    {groupedResults.pages.map(result => {
                      currentIndex++;
                      const idx = currentIndex;
                      return (
                        <button
                          key={result.id}
                          data-index={idx}
                          onClick={() => result.action()}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            selectedIndex === idx 
                              ? "bg-ascend-500/10" 
                              : "hover:bg-[var(--surface-hover)]"
                          )}
                          role="option"
                          aria-selected={selectedIndex === idx}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text-primary)] truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-[var(--text-muted)] truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Habits */}
                {groupedResults.habits.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Habits
                    </div>
                    {groupedResults.habits.map(result => {
                      currentIndex++;
                      const idx = currentIndex;
                      return (
                        <button
                          key={result.id}
                          data-index={idx}
                          onClick={() => result.action()}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            selectedIndex === idx 
                              ? "bg-ascend-500/10" 
                              : "hover:bg-[var(--surface-hover)]"
                          )}
                          role="option"
                          aria-selected={selectedIndex === idx}
                        >
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text-primary)] truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-[var(--text-muted)] truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Goals */}
                {groupedResults.goals.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Goals
                    </div>
                    {groupedResults.goals.map(result => {
                      currentIndex++;
                      const idx = currentIndex;
                      return (
                        <button
                          key={result.id}
                          data-index={idx}
                          onClick={() => result.action()}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            selectedIndex === idx 
                              ? "bg-ascend-500/10" 
                              : "hover:bg-[var(--surface-hover)]"
                          )}
                          role="option"
                          aria-selected={selectedIndex === idx}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text-primary)] truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-[var(--text-muted)] truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Tasks */}
                {groupedResults.tasks.length > 0 && (
                  <div className="mb-2">
                    <div className="px-4 py-1.5 text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                      Tasks
                    </div>
                    {groupedResults.tasks.map(result => {
                      currentIndex++;
                      const idx = currentIndex;
                      return (
                        <button
                          key={result.id}
                          data-index={idx}
                          onClick={() => result.action()}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            selectedIndex === idx 
                              ? "bg-ascend-500/10" 
                              : "hover:bg-[var(--surface-hover)]"
                          )}
                          role="option"
                          aria-selected={selectedIndex === idx}
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[var(--text-primary)] truncate">
                              {result.title}
                            </div>
                            {result.subtitle && (
                              <div className="text-xs text-[var(--text-muted)] truncate">
                                {result.subtitle}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[10px]">↓</kbd>
                <span>navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--surface)] rounded text-[10px]">↵</kbd>
                <span>select</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              <span>Keyboard shortcuts: ?</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalSearch;
