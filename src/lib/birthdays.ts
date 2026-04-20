export interface BirthdayEntry {
  name: string;
  relation: string;
  date: string; // YYYY-MM-DD
  notes?: string;
}

const STORAGE_KEY = 'resurgo-birthdays';

function parseBirthdayDate(inputDate: string): Date | null {
  const [yearRaw, monthRaw, dayRaw] = inputDate.split('-');
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function getBirthdaysFromStorage(): BirthdayEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BirthdayEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((b) => !!b?.name && !!b?.date);
  } catch {
    return [];
  }
}

export function saveBirthdaysToStorage(birthdays: BirthdayEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
}

export function getNextBirthdayDate(inputDate: string, nowDate = new Date()): Date {
  const now = new Date(nowDate);
  const currentYear = now.getFullYear();
  const parsed = parseBirthdayDate(inputDate);

  if (!parsed) {
    const fallback = new Date(now);
    fallback.setHours(9, 0, 0, 0);
    return fallback;
  }

  const nextBirthday = new Date(currentYear, parsed.getMonth(), parsed.getDate());
  nextBirthday.setHours(9, 0, 0, 0);

  if (nextBirthday < now) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  return nextBirthday;
}

export function isBirthdayToday(inputDate: string, nowDate = new Date()): boolean {
  const parsed = parseBirthdayDate(inputDate);
  if (!parsed) return false;
  const now = new Date(nowDate);
  return parsed.getMonth() === now.getMonth() && parsed.getDate() === now.getDate();
}

export function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
