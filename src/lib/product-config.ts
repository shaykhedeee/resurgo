export const FOUNDING_LIFETIME_LIMIT = 100;
export const FOUNDING_LIFETIME_PRICE_USD = 89;
export const FOUNDING_LIFETIME_REGULAR_PRICE_USD = 199;
export const FOUNDING_LIFETIME_END_DATE = 'July 5, 2026';
export const FOUNDING_LIFETIME_ENDS_AT_ISO = '2026-07-05T23:59:59Z';
export const FOUNDING_LIFETIME_COPY = `Limited to the first ${FOUNDING_LIFETIME_LIMIT} relaunch signups`;

export const CANONICAL_COACHES = [
  {
    name: 'Marcus',
    handle: 'MARCUS',
    style: 'Stoic Strategist',
    focus: 'Deep work, mental clarity, discipline',
    free: true,
  },
  {
    name: 'Titan',
    handle: 'TITAN',
    style: 'High-Performance Coach',
    focus: 'Physical performance, energy, output',
    free: true,
  },
  {
    name: 'Aurora',
    handle: 'AURORA',
    style: 'Wellness Guide',
    focus: 'Sleep, recovery, emotional balance',
    free: false,
  },
  {
    name: 'Phoenix',
    handle: 'PHOENIX',
    style: 'Comeback Specialist',
    focus: 'Resilience, burnout recovery, restart',
    free: false,
  },
  {
    name: 'Nexus',
    handle: 'NEXUS',
    style: 'Systems Builder',
    focus: 'Habits, routines, automation, efficiency',
    free: false,
  },
] as const;

export const CANONICAL_COACH_COUNT = CANONICAL_COACHES.length;
export const CANONICAL_COACH_NAMES = CANONICAL_COACHES.map((coach) => coach.name).join(', ');
