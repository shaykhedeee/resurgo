// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Unit Tests for Core Utilities
// ═══════════════════════════════════════════════════════════════════════════════

import {
  cn,
  clamp,
  formatPercentage,
  formatNumber,
  getCompletionColor,
  getCompletionTextColor,
  hexToRgba,
  truncate,
  capitalize,
  slugify,
  generateId,
  calculateStreak,
  getMonthDays,
  getDayOfWeek,
  isWeekendDay,
} from '../utils';

// ─────────────────────────────────────────────────────────────────────────────────
// cn() - Class name merge utility
// ─────────────────────────────────────────────────────────────────────────────────

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible');
  });

  it('deduplicates Tailwind classes', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// Number utilities
// ─────────────────────────────────────────────────────────────────────────────────

describe('clamp()', () => {
  it('clamps values within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles edge cases', () => {
    expect(clamp(0, 0, 0)).toBe(0);
    expect(clamp(100, 100, 100)).toBe(100);
  });
});

describe('formatPercentage()', () => {
  it('formats with default decimals', () => {
    expect(formatPercentage(75)).toBe('75%');
  });

  it('formats with custom decimals', () => {
    expect(formatPercentage(75.5678, 2)).toBe('75.57%');
  });
});

describe('formatNumber()', () => {
  it('formats numbers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('handles small numbers', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// Color utilities
// ─────────────────────────────────────────────────────────────────────────────────

describe('getCompletionColor()', () => {
  it('returns green for 80%+', () => {
    expect(getCompletionColor(80)).toBe('#22C55E');
    expect(getCompletionColor(100)).toBe('#22C55E');
  });

  it('returns yellow for 60-79%', () => {
    expect(getCompletionColor(60)).toBe('#EAB308');
    expect(getCompletionColor(79)).toBe('#EAB308');
  });

  it('returns orange for 40-59%', () => {
    expect(getCompletionColor(40)).toBe('#F97316');
    expect(getCompletionColor(59)).toBe('#F97316');
  });

  it('returns red for < 40%', () => {
    expect(getCompletionColor(0)).toBe('#EF4444');
    expect(getCompletionColor(39)).toBe('#EF4444');
  });
});

describe('getCompletionTextColor()', () => {
  it('returns correct text color classes', () => {
    expect(getCompletionTextColor(90)).toBe('text-green-500');
    expect(getCompletionTextColor(65)).toBe('text-yellow-500');
    expect(getCompletionTextColor(45)).toBe('text-orange-500');
    expect(getCompletionTextColor(20)).toBe('text-red-500');
  });
});

describe('hexToRgba()', () => {
  it('converts hex to rgba', () => {
    expect(hexToRgba('#FF0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
    expect(hexToRgba('#00FF00', 1)).toBe('rgba(0, 255, 0, 1)');
    expect(hexToRgba('#0000FF', 0)).toBe('rgba(0, 0, 255, 0)');
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// String utilities
// ─────────────────────────────────────────────────────────────────────────────────

describe('truncate()', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('returns short strings unchanged', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});

describe('capitalize()', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('world')).toBe('World');
  });

  it('handles already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('slugify()', () => {
  it('converts to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('My Goal: Fitness!')).toBe('my-goal-fitness');
  });

  it('handles multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });
});

describe('generateId()', () => {
  it('generates unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('contains timestamp component', () => {
    const id = generateId();
    expect(id).toMatch(/^\d+-/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// Date utilities
// ─────────────────────────────────────────────────────────────────────────────────

describe('getMonthDays()', () => {
  it('returns correct days for a month', () => {
    const days = getMonthDays(2026, 1); // January 2026
    expect(days.length).toBe(31);
    expect(days[0]).toBe('2026-01-01');
    expect(days[30]).toBe('2026-01-31');
  });

  it('handles February (non-leap year)', () => {
    const days = getMonthDays(2026, 2);
    expect(days.length).toBe(28);
  });

  it('handles February (leap year)', () => {
    const days = getMonthDays(2024, 2);
    expect(days.length).toBe(29);
  });
});

describe('getDayOfWeek()', () => {
  it('returns correct day index', () => {
    // 2026-02-13 is a Friday
    expect(getDayOfWeek('2026-02-13')).toBe(5);
  });
});

describe('isWeekendDay()', () => {
  it('identifies weekends', () => {
    // 2026-02-14 is Saturday, 2026-02-15 is Sunday
    expect(isWeekendDay('2026-02-14')).toBe(true);
    expect(isWeekendDay('2026-02-15')).toBe(true);
  });

  it('identifies weekdays', () => {
    expect(isWeekendDay('2026-02-13')).toBe(false); // Friday
  });
});

// ─────────────────────────────────────────────────────────────────────────────────
// Streak calculation
// ─────────────────────────────────────────────────────────────────────────────────

describe('calculateStreak()', () => {
  it('returns 0 for empty entries', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 0 for no completed entries', () => {
    expect(calculateStreak([
      { date: '2026-02-13', completed: false },
    ])).toBe(0);
  });

  it('calculates streak for consecutive days', () => {
    const streak = calculateStreak([
      { date: '2026-02-13', completed: true },
      { date: '2026-02-12', completed: true },
      { date: '2026-02-11', completed: true },
    ]);
    expect(streak).toBeGreaterThanOrEqual(1);
  });
});
