export interface IcsTaskLike {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  scheduledDate?: string;
  isRecurring?: boolean;
  recurrenceRule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
  };
}

export interface IcsBirthdayLike {
  name: string;
  relation?: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

function formatDate(date: Date, withTime: boolean): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');

  if (!withTime) return `${yyyy}${mm}${dd}`;

  const hh = String(date.getUTCHours()).padStart(2, '0');
  const min = String(date.getUTCMinutes()).padStart(2, '0');
  const sec = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}T${hh}${min}${sec}Z`;
}

function parseTaskDate(task: IcsTaskLike): Date | null {
  const sourceDate = task.scheduledDate || task.dueDate;
  if (!sourceDate) return null;

  if (task.dueTime) {
    return new Date(`${sourceDate}T${task.dueTime}:00`);
  }

  return new Date(`${sourceDate}T09:00:00`);
}

function buildRRule(task: IcsTaskLike): string | null {
  if (!task.isRecurring || !task.recurrenceRule) return null;

  const freq = task.recurrenceRule.frequency.toUpperCase();
  const interval = Math.max(1, task.recurrenceRule.interval || 1);

  if (freq === 'WEEKLY' && task.recurrenceRule.daysOfWeek?.length) {
    const map = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    const byDay = task.recurrenceRule.daysOfWeek
      .map((d) => map[d])
      .filter(Boolean)
      .join(',');
    return `FREQ=WEEKLY;INTERVAL=${interval};BYDAY=${byDay}`;
  }

  if (freq === 'DAILY' || freq === 'WEEKLY' || freq === 'MONTHLY') {
    return `FREQ=${freq};INTERVAL=${interval}`;
  }

  return null;
}

function escapeText(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

export function generateTasksIcs(tasks: IcsTaskLike[], calendarName = 'Resurgo Tasks'): string {
  const now = new Date();
  const dtStamp = formatDate(now, true);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Resurgo//Task Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
  ];

  for (const task of tasks) {
    const start = parseTaskDate(task);
    if (!start) continue;

    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const uid = `${task._id}@Resurgo`;

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART:${formatDate(start, true)}`);
    lines.push(`DTEND:${formatDate(end, true)}`);
    lines.push(`SUMMARY:${escapeText(task.title)}`);
    if (task.description) {
      lines.push(`DESCRIPTION:${escapeText(task.description)}`);
    }
    const rrule = buildRRule(task);
    if (rrule) {
      lines.push(`RRULE:${rrule}`);
    }
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  return `${lines.join('\r\n')}\r\n`;
}

export function generateBirthdaysIcs(birthdays: IcsBirthdayLike[], calendarName = 'Resurgo Birthdays'): string {
  const now = new Date();
  const dtStamp = formatDate(now, true);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Resurgo//Birthday Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
  ];

  birthdays.forEach((birthday, index) => {
    const parsed = new Date(`${birthday.date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return;

    const start = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:birthday-${index}-${escapeText(birthday.name)}@Resurgo`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART;VALUE=DATE:${formatDate(start, false)}`);
    lines.push(`DTEND;VALUE=DATE:${formatDate(end, false)}`);
    lines.push(`SUMMARY:${escapeText(`🎉 ${birthday.name}'s Birthday`)}`);
    lines.push(`RRULE:FREQ=YEARLY;INTERVAL=1`);
    lines.push(`DESCRIPTION:${escapeText(`${birthday.relation ? `${birthday.relation} · ` : ''}${birthday.notes ?? 'Remember to celebrate.'}`)}`);
    lines.push('STATUS:CONFIRMED');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}

export function downloadIcs(filename: string, icsContent: string) {
  if (typeof window === 'undefined') return;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
