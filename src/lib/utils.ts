// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Utility Functions
// ═══════════════════════════════════════════════════════════════════════════════

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isWeekend, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// ─────────────────────────────────────────────────────────────────────────────────
// CLASSNAME MERGE
// ─────────────────────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────────────────────────
// DATE UTILITIES
// ─────────────────────────────────────────────────────────────────────────────────

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, formatStr);
}

export function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getMonthDays(year: number, month: number): string[] {
  const date = new Date(year, month - 1, 1);
  const days: string[] = [];
  
  while (date.getMonth() === month - 1) {
    days.push(format(date, 'yyyy-MM-dd'));
    date.setDate(date.getDate() + 1);
  }
  
  return days;
}

export function getDayOfWeek(date: string): number {
  return new Date(date).getDay();
}

export function isWeekendDay(date: string): boolean {
  return isWeekend(new Date(date));
}

export function isTodayDate(date: string): boolean {
  return isToday(new Date(date));
}

export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

// ─────────────────────────────────────────────────────────────────────────────────
// NUMBER UTILITIES
// ─────────────────────────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
}

// ─────────────────────────────────────────────────────────────────────────────────
// COLOR UTILITIES
// ─────────────────────────────────────────────────────────────────────────────────

export function getCompletionColor(percentage: number): string {
  if (percentage >= 80) return '#22C55E'; // Green
  if (percentage >= 60) return '#EAB308'; // Yellow
  if (percentage >= 40) return '#F97316'; // Orange
  return '#EF4444'; // Red
}

export function getCompletionColorClass(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500 text-white';
  if (percentage >= 60) return 'bg-yellow-500 text-black';
  if (percentage >= 40) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
}

export function getCompletionTextColor(percentage: number): string {
  if (percentage >= 80) return 'text-green-500';
  if (percentage >= 60) return 'text-yellow-500';
  if (percentage >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─────────────────────────────────────────────────────────────────────────────────
// STRING UTILITIES
// ─────────────────────────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─────────────────────────────────────────────────────────────────────────────────
// HABIT ICONS & CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────────

export const HABIT_ICONS = [
  '💪', '🏃', '🧘', '📚', '✍️', '💧', '🥗', '😴', '🎯', '⏰',
  '🏋️', '🚴', '🏊', '🧠', '💡', '🎨', '🎵', '🌱', '☀️', '🌙',
  '❤️', '🙏', '🧹', '💰', '📱', '💻', '🎮', '👥', '📝', '✅',
  '🔥', '⚡', '🌟', '🎉', '🏆', '💎', '🚀', '🎪', '🎭', '🎲',
];

export const HABIT_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#64748B', '#78716C', '#1F2937',
];

export const CATEGORY_LABELS: Record<string, string> = {
  health: 'Health',
  fitness: 'Fitness',
  mindfulness: 'Mindfulness',
  productivity: 'Productivity',
  learning: 'Learning',
  creativity: 'Creativity',
  social: 'Social',
  finance: 'Finance',
  self_care: 'Self-Care',
  general: 'General',
  custom: 'Custom',
};

export const CATEGORY_ICONS: Record<string, string> = {
  health: '❤️',
  fitness: '💪',
  mindfulness: '🧘',
  productivity: '⚡',
  learning: '📚',
  creativity: '🎨',
  social: '👥',
  finance: '💰',
  self_care: '💆',
  general: '⭐',
  custom: '✨',
};

// ─────────────────────────────────────────────────────────────────────────────────
// MOTIVATIONAL QUOTES
// ─────────────────────────────────────────────────────────────────────────────────

export const MOTIVATIONAL_QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It's not about being the best. It's about being better than you were yesterday.", author: "Unknown" },
  { quote: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { quote: "We are what we repeatedly do. Excellence is not an act, but a habit.", author: "Aristotle" },
  { quote: "The hard days are what make you stronger.", author: "Aly Raisman" },
  { quote: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { quote: "Progress, not perfection, is what we should be asking of ourselves.", author: "Julia Cameron" },
  { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Every morning brings new potential, but if you dwell on the misfortunes of the day before, you tend to overlook tremendous opportunities.", author: "Harvey Mackay" },
];

export function getRandomQuote(): { quote: string; author: string } {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

// ─────────────────────────────────────────────────────────────────────────────────
// STREAK CALCULATIONS
// ─────────────────────────────────────────────────────────────────────────────────

export function calculateStreak(entries: { date: string; completed: boolean }[]): number {
  if (!entries.length) return 0;
  
  // Sort by date descending
  const sorted = [...entries]
    .filter(e => e.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  if (!sorted.length) return 0;
  
  let streak = 0;
  let currentDate = new Date(sorted[0].date);
  currentDate.setHours(0, 0, 0, 0);
  
  for (const entry of sorted) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    const diff = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 0 || diff === 1) {
      streak++;
      currentDate = entryDate;
    } else {
      break;
    }
  }
  
  return streak;
}

import { LEVELS } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────────
// LEVEL PROGRESS
// ─────────────────────────────────────────────────────────────────────────────────

export function getLevelProgress(xp: number, currentLevel: number, nextLevelXp: number): number {
  const prevLevelXp = currentLevel > 1 
    ? LEVELS[currentLevel - 2]?.maxXp || 0 
    : 0;
  
  const levelXpRange = nextLevelXp - prevLevelXp;
  const currentLevelXp = xp - prevLevelXp;
  
  return Math.min(100, Math.round((currentLevelXp / levelXpRange) * 100));
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONFETTI CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

export const CONFETTI_CONFIGS = {
  habitComplete: {
    particleCount: 30,
    spread: 60,
    origin: { y: 0.8 },
    colors: ['#22C55E', '#14B8A6', '#3B82F6'],
  },
  allHabitsComplete: {
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#FBBF24', '#F59E0B', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6'],
  },
  levelUp: {
    particleCount: 150,
    spread: 120,
    origin: { y: 0.5 },
    colors: ['#FBBF24', '#F59E0B', '#D97706', '#22C55E', '#14B8A6'],
    startVelocity: 45,
  },
  achievement: {
    particleCount: 80,
    spread: 90,
    origin: { y: 0.7 },
    colors: ['#8B5CF6', '#A855F7', '#D946EF', '#EC4899'],
  },
  goalComplete: {
    particleCount: 200,
    spread: 160,
    origin: { y: 0.5 },
    startVelocity: 55,
    colors: ['#FBBF24', '#F59E0B', '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899'],
  },
};
