import { getIsoWeekRange } from '@/lib/date/isoWeekRange';

describe('getIsoWeekRange', () => {
  it('uses the previous Monday when the input date is Sunday', () => {
    const { weekStart, weekEnd } = getIsoWeekRange(new Date('2026-05-24T20:00:00.000Z'));

    expect(weekStart).toBe('2026-05-18');
    expect(weekEnd).toBe('2026-05-24');
  });

  it('keeps the current week for a midweek date', () => {
    const { weekStart, weekEnd } = getIsoWeekRange(new Date('2026-05-21T12:00:00.000Z'));

    expect(weekStart).toBe('2026-05-18');
    expect(weekEnd).toBe('2026-05-24');
  });
});
