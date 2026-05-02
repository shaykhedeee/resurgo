// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Data Import/Export Engine
// Supports CSV, JSON, iCal, RSS, plus integrations with Todoist, Notion, Obsidian
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT FORMATS
// ─────────────────────────────────────────────────────────────────────────────

export type ExportFormat = 'json' | 'csv' | 'ical' | 'markdown' | 'xml' | 'todoist' | 'notion-json';

export interface ExportOptions {
  format: ExportFormat;
  includeCompletedTasks: boolean;
  includeHabits: boolean;
  includeGoals: boolean;
  includeNotes: boolean;
  dateRange?: { from: Date; to: Date };
  selectedCategories?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimatedMinutes?: number;
  suggestedDue?: string;
  createdAt: string;
  completedAt?: string;
  tags?: string[];
  relatedGoal?: string;
}

export interface HabitData {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | '3x_week' | 'weekdays' | 'custom';
  description?: string;
  category: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  createdAt: string;
  tags?: string[];
}

export interface GoalData {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  targetDate?: string;
  progress: number; // 0-100
  relatedTasks?: string[]; // task IDs
  milestones?: Array<{ title: string; completed: boolean; date?: string }>;
  createdAt: string;
  tags?: string[];
}

export interface ResurgoExportData {
  version: string;
  exportDate: string;
  userId?: string;
  metadata: {
    totalTasks: number;
    totalHabits: number;
    totalGoals: number;
    dateRange: { from?: string; to?: string };
  };
  tasks: TaskData[];
  habits: HabitData[];
  goals: GoalData[];
  tags: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function generateCSVExport(data: ResurgoExportData): string {
  const rows: string[] = [];

  // Tasks CSV
  if (data.tasks.length > 0) {
    rows.push('# TASKS');
    rows.push(['ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Est. Minutes', 'Due Date', 'Created', 'Completed', 'Tags'].join(','));
    data.tasks.forEach(task => {
      rows.push([
        task.id,
        `"${(task.title || '').replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.category,
        task.priority,
        task.status,
        task.estimatedMinutes || '',
        task.suggestedDue || '',
        task.createdAt,
        task.completedAt || '',
        (task.tags || []).join(';'),
      ].join(','));
    });
    rows.push('');
  }

  // Habits CSV
  if (data.habits.length > 0) {
    rows.push('# HABITS');
    rows.push(['ID', 'Name', 'Frequency', 'Description', 'Category', 'Current Streak', 'Longest Streak', 'Completion %', 'Created', 'Tags'].join(','));
    data.habits.forEach(habit => {
      rows.push([
        habit.id,
        `"${(habit.name || '').replace(/"/g, '""')}"`,
        habit.frequency,
        `"${(habit.description || '').replace(/"/g, '""')}"`,
        habit.category,
        habit.currentStreak,
        habit.longestStreak,
        `${(habit.completionRate * 100).toFixed(1)}%`,
        habit.createdAt,
        (habit.tags || []).join(';'),
      ].join(','));
    });
    rows.push('');
  }

  // Goals CSV
  if (data.goals.length > 0) {
    rows.push('# GOALS');
    rows.push(['ID', 'Title', 'Description', 'Category', 'Priority', 'Status', 'Progress %', 'Target Date', 'Created', 'Tags'].join(','));
    data.goals.forEach(goal => {
      rows.push([
        goal.id,
        `"${(goal.title || '').replace(/"/g, '""')}"`,
        `"${(goal.description || '').replace(/"/g, '""')}"`,
        goal.category,
        goal.priority,
        goal.status,
        `${goal.progress}%`,
        goal.targetDate || '',
        goal.createdAt,
        (goal.tags || []).join(';'),
      ].join(','));
    });
  }

  return rows.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// ICAL EXPORT (for calendar integration)
// ─────────────────────────────────────────────────────────────────────────────

export function generateICalExport(data: ResurgoExportData): string {
  const events: string[] = [];

  // iCal header
  events.push('BEGIN:VCALENDAR');
  events.push('VERSION:2.0');
  events.push('PRODID:-//Resurgo//Resurgo Tasks//EN');
  events.push('CALSCALE:GREGORIAN');
  events.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);

  // Task events
  data.tasks.forEach(task => {
    if (task.suggestedDue) {
      const uid = `${task.id}@resurgo.app`;
      const dueDate = new Date(task.suggestedDue);
      const dueString = dueDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      events.push('BEGIN:VEVENT');
      events.push(`UID:${uid}`);
      events.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
      events.push(`DTSTART:${dueString}`);
      events.push(`DTEND:${dueString}`);
      events.push(`SUMMARY:${task.title}`);
      if (task.description) events.push(`DESCRIPTION:${task.description}`);
      events.push(`CATEGORIES:${task.category}`);
      events.push(`PRIORITY:${priorityToICalPriority(task.priority)}`);
      events.push(`STATUS:${task.status === 'completed' ? 'COMPLETED' : 'NEEDS-ACTION'}`);
      events.push('END:VEVENT');
    }
  });

  // Goal milestones
  data.goals.forEach(goal => {
    if (goal.milestones) {
      goal.milestones.forEach((milestone, idx) => {
        if (milestone.date) {
          const uid = `${goal.id}-milestone-${idx}@resurgo.app`;
          const dueDate = new Date(milestone.date);
          const dueString = dueDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

          events.push('BEGIN:VEVENT');
          events.push(`UID:${uid}`);
          events.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
          events.push(`DTSTART:${dueString}`);
          events.push(`DTEND:${dueString}`);
          events.push(`SUMMARY:${goal.title} - Milestone: ${milestone.title}`);
          events.push(`CATEGORIES:Goal`);
          events.push(`STATUS:${milestone.completed ? 'COMPLETED' : 'NEEDS-ACTION'}`);
          events.push('END:VEVENT');
        }
      });
    }
  });

  events.push('END:VCALENDAR');
  return events.join('\r\n');
}

function priorityToICalPriority(priority: string): number {
  switch (priority) {
    case 'CRITICAL': return 1;
    case 'HIGH': return 3;
    case 'MEDIUM': return 5;
    case 'LOW': return 9;
    default: return 5;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKDOWN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function generateMarkdownExport(data: ResurgoExportData): string {
  const sections: string[] = [];

  sections.push(`# Resurgo Export - ${new Date().toLocaleDateString()}`);
  sections.push(`**Exported:** ${data.exportDate}`);
  sections.push(`**Total Tasks:** ${data.metadata.totalTasks} | **Habits:** ${data.metadata.totalHabits} | **Goals:** ${data.metadata.totalGoals}`);
  sections.push('');

  // Tasks section
  if (data.tasks.length > 0) {
    sections.push('## Tasks');
    const byCategory = new Map<string, typeof data.tasks>();
    data.tasks.forEach(task => {
      const cat = task.category || 'Uncategorized';
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(task);
    });

    byCategory.forEach((tasks, category) => {
      sections.push(`### ${category}`);
      tasks.forEach(task => {
        const status = task.status === 'completed' ? '✅' : '📋';
        const priority = {
          CRITICAL: '🔴',
          HIGH: '🟠',
          MEDIUM: '🟡',
          LOW: '🟢',
        }[task.priority] || '';
        sections.push(`- ${status} ${priority} **${task.title}** ${task.suggestedDue ? `(Due: ${task.suggestedDue})` : ''}`);
        if (task.description) sections.push(`  - ${task.description}`);
      });
    });
    sections.push('');
  }

  // Habits section
  if (data.habits.length > 0) {
    sections.push('## Habits');
    data.habits.forEach(habit => {
      sections.push(`- **${habit.name}** (${habit.frequency})`);
      sections.push(`  - Streak: ${habit.currentStreak} days | Best: ${habit.longestStreak} days | ${(habit.completionRate * 100).toFixed(0)}% complete`);
    });
    sections.push('');
  }

  // Goals section
  if (data.goals.length > 0) {
    sections.push('## Goals');
    data.goals.forEach(goal => {
      const statusEmoji = {
        active: '🎯',
        completed: '✅',
        paused: '⏸️',
        abandoned: '❌',
      }[goal.status] || '•';
      sections.push(`- ${statusEmoji} **${goal.title}** (${goal.progress}%)`);
      if (goal.description) sections.push(`  - ${goal.description}`);
      if (goal.targetDate) sections.push(`  - Target: ${goal.targetDate}`);
    });
  }

  return sections.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT DETECTION
// ─────────────────────────────────────────────────────────────────────────────

export type ImportFormat = 'json' | 'csv' | 'todoist' | 'notion' | 'obsidian' | 'ical';

export interface ImportResult {
  format: ImportFormat;
  tasksImported: number;
  habitsImported: number;
  goalsImported: number;
  conflicts: Array<{ id: string; title: string; type: 'task' | 'habit' | 'goal' }>;
  warnings: string[];
  errors: string[];
}

export async function detectImportFormat(file: File | string): Promise<ImportFormat | null> {
  const content = typeof file === 'string' ? file : await file.text();
  const name = typeof file === 'string' ? '' : file.name.toLowerCase();

  // Check file extensions
  if (name.endsWith('.ics') || name.endsWith('.ical')) return 'ical';
  if (name.endsWith('.json')) return 'json';
  if (name.endsWith('.csv')) return 'csv';

  // Check content patterns
  if (content.includes('BEGIN:VCALENDAR')) return 'ical';
  if (content.includes('BEGIN:VEVENT')) return 'ical';
  if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
    try {
      JSON.parse(content);
      if (content.includes('tasks') || content.includes('habits') || content.includes('goals')) return 'json';
      // Could be Todoist or Notion JSON format
      if (content.includes('"data"') || content.includes('"items"')) return 'todoist';
    } catch { /* continue */ }
  }

  if (content.includes('BEGIN:VEVENT') || content.includes('PRODID')) return 'ical';
  if (content.split('\n')[0]?.includes(',')) return 'csv'; // CSV detection by first line commas

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFLICT RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

export type ConflictResolutionStrategy = 'skip' | 'overwrite' | 'merge' | 'duplicate';

export interface ConflictResolution {
  strategy: ConflictResolutionStrategy;
  itemId: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT HISTORY
// ─────────────────────────────────────────────────────────────────────────────

export interface ExportHistory {
  id: string;
  format: ExportFormat;
  fileName: string;
  itemsExported: number;
  createdAt: Date;
  fileSize: number; // bytes
  url?: string; // For cloud storage link
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNC STATUS
// ─────────────────────────────────────────────────────────────────────────────

export interface SyncStatus {
  service: 'todoist' | 'notion' | 'obsidian' | 'google-calendar' | 'apple-calendar';
  isConnected: boolean;
  lastSync?: Date;
  nextSyncScheduled?: Date;
  itemsSynced: number;
  status: 'idle' | 'syncing' | 'error';
  errorMessage?: string;
}
