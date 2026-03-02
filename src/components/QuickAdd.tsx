// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Quick Add Component
// Natural language task input with AI-powered parsing
// Examples: "call mom tomorrow at 3pm", "gym every monday", "finish report by friday"
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAscendStore } from '@/lib/store';
import { Task, TaskRepeat } from '@/types';
import {
  Plus,
  Zap,
  Calendar,
  Clock,
  Tag,
  Flag,
  Repeat,
  Sparkles,
  ArrowRight,
  X,
  Mic,
  MicOff,
} from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface ParsedTask {
  title: string;
  dueDate?: Date;
  dueTime?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  repeat?: TaskRepeat;
  repeatConfig?: {
    interval: number;
    days?: number[];
  };
  tags?: string[];
}

interface QuickAddProps {
  onTaskAdded?: (task: Task) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

// Natural language parsing utilities
const TIME_PATTERNS = {
  // 3pm, 3:30pm, 15:00, etc.
  time: /(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
  // morning, afternoon, evening, night
  timeOfDay: /\b(morning|afternoon|evening|night)\b/i,
};

const DATE_PATTERNS = {
  // today, tomorrow, day after tomorrow
  relative: /\b(today|tomorrow|day after tomorrow)\b/i,
  // monday, tuesday, etc.
  weekday: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  // next monday, this friday
  relativeWeekday: /\b(this|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  // 25th, 25th december, december 25
  dateWithMonth: /\b(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)|(?:(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?)\b/i,
  // by friday, until tomorrow
  deadline: /\b(?:by|until|before)\s+(\w+)\b/i,
};

const PRIORITY_PATTERNS = {
  urgent: /\b(urgent|asap|immediately|critical)\b/i,
  high: /\b(important|high priority|high)\b/i,
  low: /\b(low priority|whenever|no rush)\b/i,
};

const RECURRENCE_PATTERNS = {
  daily: /\b(every\s*day|daily)\b/i,
  weekly: /\b(every\s+week|weekly)\b/i,
  weekdays: /\b(every\s+weekday|weekdays)\b/i,
  weekends: /\b(every\s+weekend|weekends)\b/i,
  specificDay: /\b(?:every|each)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,
  monthly: /\b(every\s+month|monthly)\b/i,
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  work: ['work', 'office', 'meeting', 'client', 'project', 'deadline', 'report', 'presentation', 'email'],
  health: ['gym', 'workout', 'exercise', 'run', 'yoga', 'meditate', 'doctor', 'medicine', 'health'],
  personal: ['call', 'visit', 'birthday', 'family', 'friend', 'gift', 'party'],
  finance: ['pay', 'bill', 'bank', 'money', 'budget', 'invest', 'tax'],
  learning: ['learn', 'study', 'read', 'course', 'practice', 'tutorial'],
  home: ['clean', 'laundry', 'grocery', 'cook', 'repair', 'organize'],
};

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

function parseNaturalLanguage(input: string): ParsedTask {
  let text = input.trim();
  const result: ParsedTask = { title: text };

  // Parse time
  const timeMatch = text.match(TIME_PATTERNS.time);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const meridiem = timeMatch[3]?.toLowerCase();

    if (meridiem === 'pm' && hours !== 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;

    result.dueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    text = text.replace(timeMatch[0], '').trim();
  }

  const timeOfDayMatch = text.match(TIME_PATTERNS.timeOfDay);
  if (timeOfDayMatch && !result.dueTime) {
    const timeOfDay = timeOfDayMatch[1].toLowerCase();
    const times: Record<string, string> = {
      morning: '09:00',
      afternoon: '14:00',
      evening: '18:00',
      night: '21:00',
    };
    result.dueTime = times[timeOfDay];
    text = text.replace(timeOfDayMatch[0], '').trim();
  }

  // Parse date
  const now = new Date();

  // Check relative dates
  const relativeMatch = text.match(DATE_PATTERNS.relative);
  if (relativeMatch) {
    const relative = relativeMatch[1].toLowerCase();
    const date = new Date(now);
    if (relative === 'tomorrow') date.setDate(date.getDate() + 1);
    if (relative === 'day after tomorrow') date.setDate(date.getDate() + 2);
    result.dueDate = date;
    text = text.replace(relativeMatch[0], '').trim();
  }

  // Check "next/this weekday"
  const relativeWeekdayMatch = text.match(DATE_PATTERNS.relativeWeekday);
  if (relativeWeekdayMatch && !result.dueDate) {
    const prefix = relativeWeekdayMatch[1].toLowerCase();
    const day = relativeWeekdayMatch[2].toLowerCase();
    const targetDay = WEEKDAYS.indexOf(day);
    const currentDay = now.getDay();
    
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0 || prefix === 'next') daysToAdd += 7;
    
    const date = new Date(now);
    date.setDate(date.getDate() + daysToAdd);
    result.dueDate = date;
    text = text.replace(relativeWeekdayMatch[0], '').trim();
  }

  // Check weekday only
  const weekdayMatch = text.match(DATE_PATTERNS.weekday);
  if (weekdayMatch && !result.dueDate) {
    const day = weekdayMatch[1].toLowerCase();
    const targetDay = WEEKDAYS.indexOf(day);
    const currentDay = now.getDay();
    
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) daysToAdd += 7;
    
    const date = new Date(now);
    date.setDate(date.getDate() + daysToAdd);
    result.dueDate = date;
    text = text.replace(weekdayMatch[0], '').trim();
  }

  // Check date with month
  const dateWithMonthMatch = text.match(DATE_PATTERNS.dateWithMonth);
  if (dateWithMonthMatch && !result.dueDate) {
    let day: number;
    let month: number;

    if (dateWithMonthMatch[1] && dateWithMonthMatch[2]) {
      // "25th december" format
      day = parseInt(dateWithMonthMatch[1]);
      month = MONTHS.indexOf(dateWithMonthMatch[2].toLowerCase());
    } else {
      // "december 25" format
      month = MONTHS.indexOf(dateWithMonthMatch[3].toLowerCase());
      day = parseInt(dateWithMonthMatch[4]);
    }

    const date = new Date(now.getFullYear(), month, day);
    if (date < now) date.setFullYear(date.getFullYear() + 1);
    result.dueDate = date;
    text = text.replace(dateWithMonthMatch[0], '').trim();
  }

  // Parse recurrence
  for (const [pattern, regex] of Object.entries(RECURRENCE_PATTERNS)) {
    const match = text.match(regex);
    if (match) {
      if (pattern === 'daily') {
        result.repeat = 'daily';
      } else if (pattern === 'weekly') {
        result.repeat = 'weekly';
      } else if (pattern === 'weekdays') {
        result.repeat = 'weekly';
        result.repeatConfig = { interval: 1, days: [1, 2, 3, 4, 5] };
      } else if (pattern === 'weekends') {
        result.repeat = 'weekly';
        result.repeatConfig = { interval: 1, days: [0, 6] };
      } else if (pattern === 'specificDay') {
        const day = WEEKDAYS.indexOf(match[1].toLowerCase());
        result.repeat = 'weekly';
        result.repeatConfig = { interval: 1, days: [day] };
      } else if (pattern === 'monthly') {
        result.repeat = 'monthly';
      }
      text = text.replace(match[0], '').trim();
      break;
    }
  }

  // Parse priority
  if (PRIORITY_PATTERNS.urgent.test(text)) {
    result.priority = 'urgent';
    text = text.replace(PRIORITY_PATTERNS.urgent, '').trim();
  } else if (PRIORITY_PATTERNS.high.test(text)) {
    result.priority = 'high';
    text = text.replace(PRIORITY_PATTERNS.high, '').trim();
  } else if (PRIORITY_PATTERNS.low.test(text)) {
    result.priority = 'low';
    text = text.replace(PRIORITY_PATTERNS.low, '').trim();
  }

  // Detect category
  const lowerText = text.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      result.category = category;
      break;
    }
  }

  // Clean up the title
  result.title = text
    .replace(/\s+/g, ' ')
    .replace(/^(at|by|on|in)\s+/i, '')
    .trim();

  // Capitalize first letter
  if (result.title) {
    result.title = result.title.charAt(0).toUpperCase() + result.title.slice(1);
  }

  return result;
}

export default function QuickAdd({ onTaskAdded, placeholder = 'Add a task... "call mom tomorrow at 3pm"', autoFocus }: QuickAddProps) {
  const [input, setInput] = useState('');
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTask, addToast } = useAscendStore();

  // Voice input hook
  const { 
    isListening, 
    isSupported: voiceSupported, 
    transcript: _transcript,
    interimTranscript,
    error: _voiceError,
    startListening, 
    stopListening,
    resetTranscript,
  } = useVoiceInput({
    language: 'en-US',
    continuous: false,
    onResult: (text, isFinal) => {
      if (isFinal) {
        setInput(prev => prev + (prev ? ' ' : '') + text);
        inputRef.current?.focus();
      }
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Voice Input Error',
        message: error,
        duration: 4000,
      });
    },
  });

  // Parse input as user types
  useEffect(() => {
    if (input.trim().length > 2) {
      const parsed = parseNaturalLanguage(input);
      setParsedTask(parsed);
      setShowPreview(true);
    } else {
      setParsedTask(null);
      setShowPreview(false);
    }
  }, [input]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!parsedTask?.title) return;

    setIsAdding(true);

    try {
      // Create a full task object with all required fields
      const taskInput = {
        title: parsedTask.title,
        description: '',
        priority: parsedTask.priority || 'medium',
        status: 'pending' as const,
        dueDate: parsedTask.dueDate?.toISOString(),
        dueTime: parsedTask.dueTime,
        tags: parsedTask.tags || [],
        list: 'inbox',
        subtasks: [],
        isStarred: false,
        repeat: parsedTask.repeat || 'none' as TaskRepeat,
        repeatConfig: parsedTask.repeatConfig,
        xpReward: parsedTask.priority === 'urgent' ? 30 : parsedTask.priority === 'high' ? 20 : 10,
      };

      addTask(taskInput);

      addToast({
        type: 'success',
        title: 'Task Added!',
        message: parsedTask.title,
        duration: 3000,
      });

      onTaskAdded?.({} as Task); // Callback notification
      setInput('');
      setParsedTask(null);
      setShowPreview(false);
    } catch {
      addToast({
        type: 'error',
        title: 'Failed to add task',
        message: 'Please try again',
        duration: 3000,
      });
    } finally {
      setIsAdding(false);
    }
  }, [parsedTask, addTask, addToast, onTaskAdded]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const h = hours % 12 || 12;
    const ampm = hours < 12 ? 'AM' : 'PM';
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'text-red-400 bg-red-400/10',
      high: 'text-orange-400 bg-orange-400/10',
      medium: 'text-yellow-400 bg-yellow-400/10',
      low: 'text-blue-400 bg-blue-400/10',
    };
    return colors[priority] || colors.medium;
  };

  return (
    <div className="relative">
      {/* Input Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 p-3 bg-[var(--card)] border border-[var(--border)] 
                      rounded-xl focus-within:border-ascend-500/50 focus-within:shadow-glow-sm transition-all">
          <div className="p-2 rounded-lg bg-ascend-500/20 text-ascend-400">
            <Zap className="w-4 h-4" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={isListening ? input + (interimTranscript ? ` ${interimTranscript}` : '') : input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? 'Listening...' : placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent text-themed placeholder:text-themed-muted 
                     outline-none text-sm"
          />

          {/* Voice Input Button */}
          {voiceSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'hover:bg-[var(--card-hover)] text-themed-muted hover:text-ascend-400'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          {input && (
            <button
              type="button"
              onClick={() => { setInput(''); setParsedTask(null); setShowPreview(false); resetTranscript(); }}
              className="p-1 rounded-md hover:bg-[var(--card-hover)] text-themed-muted transition-colors"
              title="Clear input"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={!parsedTask?.title || isAdding}
            className="p-2 rounded-lg bg-ascend-500 text-white disabled:opacity-50 
                     disabled:cursor-not-allowed hover:bg-ascend-600 transition-colors"
            title="Add task"
            aria-label="Add task"
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Preview Card */}
      {showPreview && parsedTask && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-[var(--card)] border border-[var(--border)] 
                      rounded-xl shadow-lg z-10 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-ascend-500/20 text-ascend-400">
              <Sparkles className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-themed truncate">{parsedTask.title}</p>
              
              {/* Parsed attributes */}
              <div className="flex flex-wrap gap-2 mt-2">
                {parsedTask.dueDate && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md 
                                 bg-blue-400/10 text-blue-400 text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDate(parsedTask.dueDate)}
                  </span>
                )}
                
                {parsedTask.dueTime && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md 
                                 bg-purple-400/10 text-purple-400 text-xs">
                    <Clock className="w-3 h-3" />
                    {formatTime(parsedTask.dueTime)}
                  </span>
                )}
                
                {parsedTask.priority && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs ${getPriorityColor(parsedTask.priority)}`}>
                    <Flag className="w-3 h-3" />
                    {parsedTask.priority.charAt(0).toUpperCase() + parsedTask.priority.slice(1)}
                  </span>
                )}
                
                {parsedTask.category && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md 
                                 bg-green-400/10 text-green-400 text-xs">
                    <Tag className="w-3 h-3" />
                    {parsedTask.category.charAt(0).toUpperCase() + parsedTask.category.slice(1)}
                  </span>
                )}
                
                {parsedTask.repeat && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md 
                                 bg-orange-400/10 text-orange-400 text-xs">
                    <Repeat className="w-3 h-3" />
                    {parsedTask.repeat.charAt(0).toUpperCase() + parsedTask.repeat.slice(1)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={isAdding}
              className="p-2 rounded-lg bg-ascend-500 text-white hover:bg-ascend-600 
                       disabled:opacity-50 transition-colors shrink-0"
              title="Add task"
              aria-label="Add task"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hint */}
          <p className="text-xs text-themed-muted mt-3 pt-3 border-t border-[var(--border)]">
            💡 Try: &quot;gym every monday at 7am&quot; or &quot;urgent: finish report by friday&quot;
          </p>
          
          {/* Task-Goal link hint */}
          <p className="text-xs text-ascend-500/60 mt-1">
            🎯 Tip: Link tasks to goals in the Tasks view for better tracking
          </p>
        </div>
      )}
    </div>
  );
}
