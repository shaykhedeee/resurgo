// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - All Tasks View with Filtering
// Complete task management with filters, sorting, and multiple views
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useMemo } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { UnifiedTask } from '@/types';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Filter,
  SortAsc,
  SortDesc,
  Target,
  Flame,
  ListTodo,
  CalendarDays,
  CalendarRange,
  Layers,
  ChevronDown,
  Search,
  X,
  Timer,
} from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth, isPast } from 'date-fns';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

type TimeFilter = 'all' | 'today' | 'tomorrow' | 'week' | 'month' | 'overdue';
type SourceFilter = 'all' | 'goal' | 'habit' | 'manual';
type SortOption = 'time' | 'priority' | 'source' | 'alphabetical';
type SortDirection = 'asc' | 'desc';

// ─────────────────────────────────────────────────────────────────────────────────
// FILTER CONFIGS
// ─────────────────────────────────────────────────────────────────────────────────

const TIME_FILTERS: { value: TimeFilter; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'All', icon: Layers },
  { value: 'today', label: 'Today', icon: Calendar },
  { value: 'tomorrow', label: 'Tomorrow', icon: CalendarDays },
  { value: 'week', label: 'This Week', icon: CalendarRange },
  { value: 'month', label: 'This Month', icon: CalendarDays },
  { value: 'overdue', label: 'Overdue', icon: Clock },
];

const SOURCE_FILTERS: { value: SourceFilter; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'all', label: 'All Sources', icon: Layers, color: 'text-themed' },
  { value: 'goal', label: 'Goals', icon: Target, color: 'text-gold-400' },
  { value: 'habit', label: 'Habits', icon: Flame, color: 'text-orange-400' },
  { value: 'manual', label: 'Tasks', icon: ListTodo, color: 'text-purple-400' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'time', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'source', label: 'Source' },
  { value: 'alphabetical', label: 'A-Z' },
];

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

function filterTaskByTime(task: UnifiedTask, filter: TimeFilter): boolean {
  if (filter === 'all') return true;
  
  const taskDate = task.date ? new Date(task.date) : null;
  if (!taskDate) return false;
  
  const isCompleted = task.status === 'completed';
  
  switch (filter) {
    case 'today':
      return isToday(taskDate);
    case 'tomorrow':
      return isTomorrow(taskDate);
    case 'week':
      return isThisWeek(taskDate);
    case 'month':
      return isThisMonth(taskDate);
    case 'overdue':
      return isPast(taskDate) && !isToday(taskDate) && !isCompleted;
    default:
      return true;
  }
}

function filterTaskBySource(task: UnifiedTask, filter: SourceFilter): boolean {
  if (filter === 'all') return true;
  return task.source === filter;
}

function sortTasks(tasks: UnifiedTask[], sortBy: SortOption, direction: SortDirection): UnifiedTask[] {
  const sorted = [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        const dateA = a.date ? new Date(a.date).getTime() : Infinity;
        const dateB = b.date ? new Date(b.date).getTime() : Infinity;
        return dateA - dateB;
      case 'priority':
        const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3, none: 4 };
        return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
      case 'source':
        const sourceOrder: Record<string, number> = { goal: 0, habit: 1, manual: 2, 'ai-suggested': 3 };
        return (sourceOrder[a.source] ?? 3) - (sourceOrder[b.source] ?? 3);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  
  return direction === 'desc' ? sorted.reverse() : sorted;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'text-red-400 bg-red-500/10';
    case 'urgent': return 'text-red-500 bg-red-500/20';
    case 'medium': return 'text-amber-400 bg-amber-500/10';
    case 'low': return 'text-green-400 bg-green-500/10';
    default: return 'text-themed-muted bg-[var(--surface)]';
  }
}

function getSourceIcon(source: string): React.ElementType {
  switch (source) {
    case 'goal': return Target;
    case 'habit': return Flame;
    case 'manual': return ListTodo;
    default: return Circle;
  }
}

function getSourceColor(source: string): string {
  switch (source) {
    case 'goal': return 'text-gold-400';
    case 'habit': return 'text-orange-400';
    case 'manual': return 'text-purple-400';
    default: return 'text-themed-muted';
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// TASK ITEM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface TaskItemProps {
  task: UnifiedTask;
  onToggle: (id: string) => void;
  showSource?: boolean;
}

function TaskItem({ task, onToggle, showSource = true }: TaskItemProps) {
  const SourceIcon = getSourceIcon(task.source);
  const isCompleted = task.status === 'completed';
  const isOverdue = task.date && isPast(new Date(task.date)) && !isToday(new Date(task.date)) && !isCompleted;
  const goalTitle = task.sourceMetadata?.goalTitle;
  
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl transition-all duration-200",
        "bg-[var(--surface)] hover:bg-[var(--surface-hover)]",
        isCompleted && "opacity-60"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
          isCompleted
            ? "bg-green-500 border-green-500"
            : "border-[var(--border)] hover:border-ascend-500"
        )}
      >
        {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
      </button>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm font-medium text-themed",
            isCompleted && "line-through text-themed-muted"
          )}>
            {task.title}
          </p>
          
          {/* XP Badge */}
          {task.xpReward > 0 && (
            <span className="flex-shrink-0 text-xs font-medium text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full">
              +{task.xpReward} XP
            </span>
          )}
        </div>
        
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {/* Source */}
          {showSource && (
            <span className={cn("flex items-center gap-1 text-xs", getSourceColor(task.source))}>
              <SourceIcon className="w-3 h-3" />
              {task.source === 'manual' ? 'Task' : task.source.charAt(0).toUpperCase() + task.source.slice(1)}
            </span>
          )}
          
          {/* Time */}
          {task.date && (
            <span className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-400" : "text-themed-muted"
            )}>
              <Clock className="w-3 h-3" />
              {isToday(new Date(task.date)) 
                ? 'Today' 
                : isTomorrow(new Date(task.date))
                  ? 'Tomorrow'
                  : format(new Date(task.date), 'MMM d')}
            </span>
          )}
          
          {/* Duration */}
          {task.estimatedMinutes && (
            <span className="flex items-center gap-1 text-xs text-themed-muted">
              <Timer className="w-3 h-3" />
              {task.estimatedMinutes}m
            </span>
          )}
          
          {/* Priority */}
          <span className={cn(
            "text-xs px-1.5 py-0.5 rounded",
            getPriorityColor(task.priority)
          )}>
            {task.priority}
          </span>
          
          {/* Goal context */}
          {goalTitle && (
            <span className="flex items-center gap-1 text-xs text-gold-400/70 truncate max-w-[150px]">
              <Target className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{goalTitle}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface AllTasksViewProps {
  className?: string;
}

export function AllTasksView({ className }: AllTasksViewProps) {
  const { getAllUnifiedTasks, completeUnifiedTask } = useAscendStore();
  
  // Get all tasks (we'll filter client-side)
  const allTasks = getAllUnifiedTasks();
  
  // Filter & Sort State
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('time');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...allTasks];
    
    // Search filter
    if (searchQuery) {
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Time filter
    tasks = tasks.filter(t => filterTaskByTime(t, timeFilter));
    
    // Source filter
    tasks = tasks.filter(t => filterTaskBySource(t, sourceFilter));
    
    // Completed filter
    if (!showCompleted) {
      tasks = tasks.filter(t => t.status !== 'completed');
    }
    
    // Sort
    tasks = sortTasks(tasks, sortBy, sortDirection);
    
    return tasks;
  }, [allTasks, timeFilter, sourceFilter, sortBy, sortDirection, searchQuery, showCompleted]);
  
  // Stats
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  
  const handleToggle = (taskId: string) => {
    completeUnifiedTask(taskId);
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-themed-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-10 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl
                     text-themed placeholder:text-themed-muted
                     focus:outline-none focus:border-ascend-500 focus:ring-2 focus:ring-ascend-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-[var(--surface-hover)]"
            >
              <X className="w-4 h-4 text-themed-muted" />
            </button>
          )}
        </div>
        
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all",
            showFilters 
              ? "bg-ascend-500/10 border-ascend-500 text-ascend-500" 
              : "bg-[var(--surface)] border-[var(--border)] text-themed-secondary hover:bg-[var(--surface-hover)]"
          )}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
          <ChevronDown className={cn(
            "w-4 h-4 transition-transform",
            showFilters && "rotate-180"
          )} />
        </button>
      </div>
      
      {/* Filter Panel */}
      {showFilters && (
        <div className="glass-card p-4 space-y-4 animate-fade-in">
          {/* Time Filters */}
          <div>
            <label className="text-xs font-medium text-themed-muted uppercase tracking-wide mb-2 block">
              Time Range
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_FILTERS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setTimeFilter(value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    timeFilter === value
                      ? "bg-ascend-500 text-white"
                      : "bg-[var(--surface)] text-themed-secondary hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Source Filters */}
          <div>
            <label className="text-xs font-medium text-themed-muted uppercase tracking-wide mb-2 block">
              Source
            </label>
            <div className="flex flex-wrap gap-2">
              {SOURCE_FILTERS.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => setSourceFilter(value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    sourceFilter === value
                      ? "bg-ascend-500 text-white"
                      : "bg-[var(--surface)] text-themed-secondary hover:bg-[var(--surface-hover)]"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", sourceFilter !== value && color)} />
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Sort & Options */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-medium text-themed-muted">Sort:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg
                         text-sm text-themed focus:outline-none focus:border-ascend-500"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
                aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
                className="p-1.5 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)]"
              >
                {sortDirection === 'asc' ? (
                  <SortAsc className="w-4 h-4 text-themed-muted" />
                ) : (
                  <SortDesc className="w-4 h-4 text-themed-muted" />
                )}
              </button>
            </div>
            
            {/* Show Completed */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] text-ascend-500 
                         focus:ring-ascend-500 focus:ring-offset-0"
              />
              <span className="text-sm text-themed-secondary">Show completed</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Stats Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4 text-sm">
          <span className="text-themed-muted">
            <span className="font-semibold text-themed">{totalTasks}</span> tasks
          </span>
          <span className="text-green-400">
            <span className="font-semibold">{completedTasks}</span> done
          </span>
          <span className="text-amber-400">
            <span className="font-semibold">{pendingTasks}</span> pending
          </span>
        </div>
        
        {filteredTasks.length > 0 && (
          <div className="text-xs text-themed-muted">
            {Math.round((completedTasks / totalTasks) * 100)}% complete
          </div>
        )}
      </div>
      
      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-themed-muted" />
            </div>
            <h3 className="text-lg font-semibold text-themed mb-1">No tasks found</h3>
            <p className="text-sm text-themed-muted">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : timeFilter !== 'all' || sourceFilter !== 'all'
                  ? 'No tasks match the current filters'
                  : 'Add some tasks or goals to get started!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllTasksView;
