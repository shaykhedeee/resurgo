// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - TaskList Component (TickTick-inspired)
// Comprehensive task management with priorities, due dates, subtasks, smart lists
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAscendStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  Check, 
  Calendar,
  Flag,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  Edit3,
  Star,
  Circle,
  CheckCircle2,
  Inbox,
  CalendarDays,
  Sun,
  ListTodo,
  X
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast, addDays, startOfDay } from 'date-fns';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

import { Task as StoreTask, TaskPriority, ChecklistTaskStatus } from '@/types';

type Priority = TaskPriority;
type TaskStatus = ChecklistTaskStatus;

interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;
  dueTime?: string;
  tags: string[];
  subtasks: SubTask[];
  isStarred: boolean;
  createdAt: string;
  completedAt?: string;
  linkedGoalId?: string;
  linkedHabitId?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  xpReward: number;
}

type SmartList = 'inbox' | 'today' | 'tomorrow' | 'week' | 'all' | 'starred' | 'completed';

// ─────────────────────────────────────────────────────────────────────────────────
// PRIORITY CONFIG
// ─────────────────────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; icon: React.ReactNode }> = {
  none: { label: 'None', color: 'text-themed-muted', icon: <Flag className="w-4 h-4" /> },
  low: { label: 'Low', color: 'text-blue-400', icon: <Flag className="w-4 h-4 text-blue-400" /> },
  medium: { label: 'Medium', color: 'text-yellow-400', icon: <Flag className="w-4 h-4 text-yellow-400" /> },
  high: { label: 'High', color: 'text-orange-400', icon: <Flag className="w-4 h-4 text-orange-400" /> },
  urgent: { label: 'Urgent', color: 'text-red-400', icon: <Flag className="w-4 h-4 text-red-400 fill-red-400" /> },
};

const SMART_LISTS: { id: SmartList; label: string; icon: React.ReactNode }[] = [
  { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" /> },
  { id: 'today', label: 'Today', icon: <Sun className="w-4 h-4" /> },
  { id: 'tomorrow', label: 'Tomorrow', icon: <CalendarDays className="w-4 h-4" /> },
  { id: 'week', label: 'Next 7 Days', icon: <Calendar className="w-4 h-4" /> },
  { id: 'starred', label: 'Starred', icon: <Star className="w-4 h-4" /> },
  { id: 'all', label: 'All Tasks', icon: <ListTodo className="w-4 h-4" /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" /> },
];

// ─────────────────────────────────────────────────────────────────────────────────
// DEFAULT TASKS (for new users)
// ─────────────────────────────────────────────────────────────────────────────────

const DEFAULT_TASKS: Omit<StoreTask, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Complete morning workout routine',
    description: '30 min cardio + stretching',
    priority: 'high',
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '07:00',
    tags: ['fitness', 'health'],
    subtasks: [
      { id: 's1', title: 'Warm up (5 min)', completed: true },
      { id: 's2', title: 'Cardio (20 min)', completed: false },
      { id: 's3', title: 'Cool down stretches', completed: false },
    ],
    isStarred: true,
    list: 'inbox',
    repeat: 'none',
    estimatedMinutes: 30,
    xpReward: 25,
  },
  {
    title: 'Read for 20 minutes',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['learning'],
    subtasks: [],
    isStarred: false,
    list: 'inbox',
    repeat: 'none',
    estimatedMinutes: 20,
    xpReward: 15,
  },
  {
    title: 'Plan weekly goals',
    description: 'Review last week and set new objectives',
    priority: 'urgent',
    status: 'pending',
    dueDate: addDays(new Date(), 1).toISOString().split('T')[0],
    tags: ['planning', 'goals'],
    subtasks: [
      { id: 's4', title: 'Review completed goals', completed: false },
      { id: 's5', title: 'Identify blockers', completed: false },
      { id: 's6', title: 'Set 3 priorities for next week', completed: false },
    ],
    isStarred: true,
    list: 'inbox',
    repeat: 'none',
    xpReward: 30,
  },
  {
    title: 'Meditate for 10 minutes',
    priority: 'low',
    status: 'completed',
    dueDate: new Date().toISOString().split('T')[0],
    tags: ['mindfulness'],
    subtasks: [],
    isStarred: false,
    list: 'inbox',
    repeat: 'none',
    completedAt: new Date().toISOString(),
    xpReward: 10,
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// DEMO TASKS (unused, kept for reference)
// ─────────────────────────────────────────────────────────────────────────────────

const _DEMO_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Complete morning workout routine',
    description: '30 min cardio + stretching',
    priority: 'high',
    status: 'pending',
    dueDate: new Date().toISOString(),
    dueTime: '07:00',
    tags: ['fitness', 'health'],
    subtasks: [
      { id: 's1', title: 'Warm up (5 min)', isCompleted: true },
      { id: 's2', title: 'Cardio (20 min)', isCompleted: false },
      { id: 's3', title: 'Cool down stretches', isCompleted: false },
    ],
    isStarred: true,
    createdAt: new Date().toISOString(),
    estimatedMinutes: 30,
    xpReward: 25,
  },
  {
    id: 't2',
    title: 'Read for 20 minutes',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date().toISOString(),
    tags: ['learning'],
    subtasks: [],
    isStarred: false,
    createdAt: new Date().toISOString(),
    estimatedMinutes: 20,
    xpReward: 15,
  },
  {
    id: 't3',
    title: 'Plan weekly goals',
    description: 'Review last week and set new objectives',
    priority: 'urgent',
    status: 'pending',
    dueDate: addDays(new Date(), 1).toISOString(),
    tags: ['planning', 'goals'],
    subtasks: [
      { id: 's4', title: 'Review completed goals', isCompleted: false },
      { id: 's5', title: 'Identify blockers', isCompleted: false },
      { id: 's6', title: 'Set 3 priorities for next week', isCompleted: false },
    ],
    isStarred: true,
    createdAt: new Date().toISOString(),
    xpReward: 30,
  },
  {
    id: 't4',
    title: 'Meditate for 10 minutes',
    priority: 'low',
    status: 'completed',
    dueDate: new Date().toISOString(),
    tags: ['mindfulness'],
    subtasks: [],
    isStarred: false,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    xpReward: 10,
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// TASK ITEM COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

function TaskItem({ task, onToggle, onToggleStar, onDelete, onEdit, onToggleSubtask }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && 
                    !isToday(new Date(task.dueDate)) && task.status !== 'completed';
  
  const completedSubtasks = task.subtasks.filter(s => s.isCompleted).length;
  const subtaskProgress = task.subtasks.length > 0 
    ? Math.round((completedSubtasks / task.subtasks.length) * 100) 
    : 0;

  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    const date = new Date(task.dueDate);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <div className={cn(
      "group bg-[var(--surface)] rounded-xl border border-[var(--border)] transition-all",
      task.status === 'completed' && "opacity-60",
      isOverdue && "border-red-500/30"
    )}>
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={cn(
            "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
            task.status === 'completed' 
              ? "bg-ascend-500 border-ascend-500" 
              : "border-[var(--border)] hover:border-ascend-500"
          )}
        >
          {task.status === 'completed' && (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium text-themed",
                task.status === 'completed' && "line-through text-themed-muted"
              )}>
                {task.title}
              </p>
              
              {task.description && (
                <p className="text-xs text-themed-muted mt-0.5 line-clamp-1">
                  {task.description}
                </p>
              )}
            </div>

            {/* Star */}
            <button
              onClick={() => onToggleStar(task.id)}
              className="p-1 rounded hover:bg-white/5"
            >
              <Star className={cn(
                "w-4 h-4 transition-colors",
                task.isStarred ? "text-gold-400 fill-gold-400" : "text-themed-muted"
              )} />
            </button>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            {/* Due Date */}
            {task.dueDate && (
              <span className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "text-red-400" : isToday(new Date(task.dueDate)) ? "text-ascend-400" : "text-themed-muted"
              )}>
                <Calendar className="w-3 h-3" />
                {getDueDateLabel()}
                {task.dueTime && ` ${task.dueTime}`}
              </span>
            )}

            {/* Priority */}
            {task.priority !== 'none' && (
              <span className={cn("flex items-center gap-1 text-xs", PRIORITY_CONFIG[task.priority].color)}>
                {PRIORITY_CONFIG[task.priority].icon}
                {PRIORITY_CONFIG[task.priority].label}
              </span>
            )}

            {/* Subtasks Progress */}
            {task.subtasks.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-themed-muted hover:text-themed"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                {completedSubtasks}/{task.subtasks.length}
              </button>
            )}

            {/* Tags */}
            {task.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-white/5 text-themed-muted">
                #{tag}
              </span>
            ))}

            {/* XP Reward */}
            <span className="text-[10px] text-gold-400 font-medium">
              +{task.xpReward} XP
            </span>

            {/* Menu */}
            <div className="relative ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-white/10"
              >
                <MoreHorizontal className="w-4 h-4 text-themed-muted" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-6 z-10 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-xl py-1 min-w-[120px]">
                  <button
                    onClick={() => { onEdit(task); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm text-themed hover:bg-white/5 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => { onDelete(task.id); setShowMenu(false); }}
                    className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Subtasks */}
          {isExpanded && task.subtasks.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2">
              {task.subtasks.map(subtask => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSubtask(task.id, subtask.id)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-all flex-shrink-0",
                      subtask.isCompleted 
                        ? "bg-ascend-500 border-ascend-500" 
                        : "border-[var(--border)] hover:border-ascend-500"
                    )}
                  >
                    {subtask.isCompleted && (
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    )}
                  </button>
                  <span className={cn(
                    "text-xs",
                    subtask.isCompleted ? "text-themed-muted line-through" : "text-themed-secondary"
                  )}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Subtask Progress Bar */}
      {task.subtasks.length > 0 && subtaskProgress > 0 && subtaskProgress < 100 && (
        <div className="h-1 bg-[var(--border)]">
          <div 
            className="h-full bg-ascend-500 transition-all duration-300"
            style={{ width: `${subtaskProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// ADD TASK FORM
// ─────────────────────────────────────────────────────────────────────────────────

interface AddTaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

function AddTaskForm({ onAdd, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: 'pending',
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      tags: [],
      subtasks: subtasks.filter(s => s.trim()).map((s, i) => ({
        id: `new-${i}`,
        title: s.trim(),
        isCompleted: false,
      })),
      isStarred: false,
      xpReward: priority === 'urgent' ? 30 : priority === 'high' ? 25 : priority === 'medium' ? 20 : 15,
    });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--surface)] rounded-xl border border-ascend-500/30 p-4">
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full bg-transparent text-themed font-medium placeholder:text-themed-muted focus:outline-none"
      />

      {showAdvanced && (
        <div className="mt-3 space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description..."
            rows={2}
            className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-themed placeholder:text-themed-muted focus:outline-none resize-none"
          />

          <div className="flex flex-wrap gap-2">
            {/* Due Date */}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-themed focus:outline-none"
            />
            
            {/* Due Time */}
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-themed focus:outline-none"
            />

            {/* Priority */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-themed focus:outline-none"
            >
              {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>{config.label} Priority</option>
              ))}
            </select>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            {subtasks.map((st, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Circle className="w-3 h-3 text-themed-muted" />
                <span className="text-sm text-themed-secondary flex-1">{st}</span>
                <button
                  type="button"
                  onClick={() => setSubtasks(subtasks.filter((_, i) => i !== idx))}
                  className="p-1 hover:bg-red-500/10 rounded"
                >
                  <X className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Plus className="w-3 h-3 text-themed-muted" />
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                placeholder="Add subtask..."
                className="flex-1 bg-transparent text-sm text-themed placeholder:text-themed-muted focus:outline-none"
              />
              {newSubtask && (
                <button
                  type="button"
                  onClick={addSubtask}
                  className="text-xs text-ascend-400"
                >
                  Add
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-themed-muted hover:text-themed"
        >
          {showAdvanced ? 'Less options' : 'More options'}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-themed-muted hover:text-themed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-4 py-1.5 bg-ascend-500 hover:bg-ascend-600 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN TASK LIST COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function TaskList() {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask, 
    toggleSubtask,
    addToast, 
    addXP: _addXP 
  } = useAscendStore();
  const [activeList, setActiveList] = useState<SmartList>('today');
  const [isAdding, setIsAdding] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Initialize with default tasks if store is empty
  useEffect(() => {
    if (tasks.length === 0) {
      DEFAULT_TASKS.forEach(task => {
        addTask(task);
      });
    }
  }, [tasks.length, addTask]);

  // Convert store tasks to component format (handle property name difference)
  const convertedTasks: Task[] = tasks.map(t => ({
    ...t,
    subtasks: t.subtasks.map(st => ({
      ...st,
      isCompleted: st.completed,
    })),
  }));

  // Filter tasks based on active list
  const filteredTasks = convertedTasks.filter(task => {
    const date = task.dueDate ? new Date(task.dueDate) : null;
    const today = startOfDay(new Date());
    
    if (activeList === 'completed') return task.status === 'completed';
    if (task.status === 'completed' && !showCompleted) return false;

    switch (activeList) {
      case 'inbox':
        return !task.dueDate;
      case 'today':
        return date && isToday(date);
      case 'tomorrow':
        return date && isTomorrow(date);
      case 'week':
        return date && date >= today && date <= addDays(today, 7);
      case 'starred':
        return task.isStarred;
      case 'all':
        return true;
      default:
        return true;
    }
  });

  const pendingTasks = filteredTasks.filter(t => t.status !== 'completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const wasCompleted = task.status === 'completed';
    toggleTask(taskId);
    
    if (!wasCompleted) {
      addToast({
        type: 'success',
        title: `Task Completed! +${task.xpReward} XP`,
        message: task.title,
      });
    }
  };

  const handleToggleStar = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { isStarred: !task.isStarred });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    addToast({
      type: 'info',
      title: 'Task Deleted',
      message: 'Task has been removed',
    });
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    toggleSubtask(taskId, subtaskId);
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    // Convert component format to store format
    addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: newTask.status,
      dueDate: newTask.dueDate,
      dueTime: newTask.dueTime,
      tags: newTask.tags,
      subtasks: newTask.subtasks.map(st => ({
        id: st.id,
        title: st.title,
        completed: st.isCompleted,
      })),
      isStarred: newTask.isStarred,
      xpReward: newTask.xpReward,
      list: 'inbox',
      repeat: 'none',
    });
    setIsAdding(false);
    addToast({
      type: 'success',
      title: 'Task Added',
      message: newTask.title,
    });
  };

  const getListCount = (listId: SmartList): number => {
    const date = new Date();
    return convertedTasks.filter(task => {
      if (task.status === 'completed' && listId !== 'completed') return false;
      const taskDate = task.dueDate ? new Date(task.dueDate) : null;
      
      switch (listId) {
        case 'inbox': return !task.dueDate;
        case 'today': return taskDate && isToday(taskDate);
        case 'tomorrow': return taskDate && isTomorrow(taskDate);
        case 'week': return taskDate && taskDate >= startOfDay(date) && taskDate <= addDays(startOfDay(date), 7);
        case 'starred': return task.isStarred;
        case 'completed': return task.status === 'completed';
        case 'all': return task.status !== 'completed';
        default: return false;
      }
    }).length;
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar - Smart Lists */}
      <div className="w-48 shrink-0 space-y-1 hidden md:block">
        {SMART_LISTS.map(list => (
          <button
            key={list.id}
            onClick={() => setActiveList(list.id)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
              activeList === list.id
                ? "bg-ascend-500/20 text-ascend-400"
                : "text-themed-muted hover:text-themed hover:bg-white/5"
            )}
          >
            <span className="flex items-center gap-2">
              {list.icon}
              {list.label}
            </span>
            <span className={cn(
              "text-xs",
              activeList === list.id ? "text-ascend-400" : "text-themed-muted"
            )}>
              {getListCount(list.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Mobile List Selector */}
        <div className="md:hidden">
          <select
            value={activeList}
            onChange={(e) => setActiveList(e.target.value as SmartList)}
            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-themed"
          >
            {SMART_LISTS.map(list => (
              <option key={list.id} value={list.id}>
                {list.label} ({getListCount(list.id)})
              </option>
            ))}
          </select>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-themed">
            {SMART_LISTS.find(l => l.id === activeList)?.label}
          </h2>
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-ascend-500 hover:bg-ascend-600 text-white rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* Add Task Form */}
        {isAdding && (
          <AddTaskForm 
            onAdd={handleAddTask}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {/* Task List */}
        <div className="space-y-2">
          {pendingTasks.length === 0 && !isAdding ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-ascend-500/30 mx-auto mb-3" />
              <p className="text-themed-muted">No tasks here!</p>
              <button
                onClick={() => setIsAdding(true)}
                className="mt-2 text-sm text-ascend-500 hover:text-ascend-400"
              >
                Add your first task
              </button>
            </div>
          ) : (
            pendingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onToggleStar={handleToggleStar}
                onDelete={handleDeleteTask}
                onEdit={() => {}}
                onToggleSubtask={handleToggleSubtask}
              />
            ))
          )}
        </div>

        {/* Completed Tasks Toggle */}
        {completedTasks.length > 0 && activeList !== 'completed' && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center gap-2 text-sm text-themed-muted hover:text-themed py-2"
            >
              {showCompleted ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              Completed ({completedTasks.length})
            </button>
            {showCompleted && (
              <div className="space-y-2 mt-2">
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onToggleStar={handleToggleStar}
                    onDelete={handleDeleteTask}
                    onEdit={() => {}}
                    onToggleSubtask={handleToggleSubtask}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
