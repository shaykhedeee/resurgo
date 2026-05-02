/**
 * RESURGO DESIGN SYSTEM — Design Tokens v1
 * Centralized spacing, typography, colors, shadows, and component tokens
 * Ensures consistency across all dashboard components
 */

// ─────────────────────────────────────────────────────────────────────────────
// SPACING SCALE (8px base unit)
// ─────────────────────────────────────────────────────────────────────────────
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem',    // 48px
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TYPOGRAPHY SCALE (Pixel Terminal + System fonts)
// ─────────────────────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  // Headings
  h1: {
    fontSize: '1.875rem',    // 30px
    fontWeight: '700',
    lineHeight: '2.25rem',   // 36px
    letterSpacing: '-0.02em',
    fontFamily: "'VT323', monospace", // Pixel Terminal
  },
  h2: {
    fontSize: '1.5rem',      // 24px
    fontWeight: '700',
    lineHeight: '1.875rem',  // 30px
    letterSpacing: '-0.015em',
    fontFamily: "'VT323', monospace",
  },
  h3: {
    fontSize: '1.25rem',     // 20px
    fontWeight: '600',
    lineHeight: '1.5rem',    // 24px
    letterSpacing: '-0.01em',
    fontFamily: "'VT323', monospace",
  },
  // Body text
  body: {
    fontSize: '1rem',        // 16px
    fontWeight: '400',
    lineHeight: '1.5rem',    // 24px
    letterSpacing: '0',
    fontFamily: "ui-monospace, 'Roboto Mono', monospace",
  },
  sm: {
    fontSize: '0.875rem',    // 14px
    fontWeight: '400',
    lineHeight: '1.25rem',   // 20px
    letterSpacing: '0',
    fontFamily: "ui-monospace, 'Roboto Mono', monospace",
  },
  xs: {
    fontSize: '0.75rem',     // 12px
    fontWeight: '400',
    lineHeight: '1rem',      // 16px
    letterSpacing: '0.05em',
    fontFamily: "'VT323', monospace",
  },
  label: {
    fontSize: '0.625rem',    // 10px
    fontWeight: '700',
    lineHeight: '0.875rem',  // 14px
    letterSpacing: '0.15em',  // ← wider for pixel clarity
    textTransform: 'uppercase',
    fontFamily: "'VT323', monospace",
  },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE (Terminal-inspired, high contrast)
// ─────────────────────────────────────────────────────────────────────────────
export const COLORS = {
  // Neutral
  black: '#000000',
  white: '#ffffff',
  
  // Grays (terminal aesthetic)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Zinc (darker alternatives)
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1a6',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  
  // Brand (Orange dominant)
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a360a',
    900: '#7c2d12',
  },
  
  // Accent colors (semantic)
  success: '#10b981',    // Emerald
  warning: '#f59e0b',    // Amber
  error: '#ef4444',      // Red
  info: '#3b82f6',       // Blue
  
  // Semantic
  primary: '#ea580c',    // Orange
  secondary: '#64748b',  // Slate
  background: '#000000',
  surface: '#1e293b',
  surfaceAlt: '#0f172a',
  border: '#334155',
  borderLight: '#475569',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// SHADOWS (Retro pixel feel)
// ─────────────────────────────────────────────────────────────────────────────
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  // Glow effects (for emphasis)
  glow: '0 0 20px rgba(234, 88, 12, 0.2)',
  glowIntense: '0 0 30px rgba(234, 88, 12, 0.4)',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// BORDER RADIUS (Subtle, mostly sharp edges for pixel aesthetic)
// ─────────────────────────────────────────────────────────────────────────────
export const RADIUS = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  full: '9999px',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITIONS (Snappy, not over-animated)
// ─────────────────────────────────────────────────────────────────────────────
export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slowest: '500ms ease-in-out',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT TOKENS (Pre-composed component styles)
// ─────────────────────────────────────────────────────────────────────────────
export const COMPONENTS = {
  // Cards
  card: {
    base: `border border-${COLORS.border} bg-${COLORS.surface} rounded-${RADIUS.md}`,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  
  // Buttons
  button: {
    base: `px-${SPACING.md} py-${SPACING.sm} rounded-${RADIUS.sm} font-semibold`,
    primary: `bg-${COLORS.primary} text-white hover:bg-orange-700`,
    secondary: `bg-${COLORS.surface} text-${COLORS.text} border border-${COLORS.border}`,
    tertiary: `text-${COLORS.primary} hover:bg-orange-950/20`,
  },
  
  // Inputs
  input: {
    base: `w-full px-${SPACING.md} py-${SPACING.sm} rounded-${RADIUS.sm} bg-${COLORS.surfaceAlt} border border-${COLORS.border} text-${COLORS.text} focus:outline-none focus:ring-2 focus:ring-${COLORS.primary}`,
  },
  
  // Badge
  badge: {
    base: `inline-block px-${SPACING.sm} py-1 rounded-full text-xs font-semibold`,
    primary: `bg-orange-950/40 text-${COLORS.primary}`,
    success: `bg-emerald-950/40 text-emerald-400`,
    warning: `bg-amber-950/40 text-amber-400`,
    error: `bg-red-950/40 text-red-400`,
  },
  
  // Divider
  divider: `h-px bg-${COLORS.border}`,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT TOKENS (Grid, flexbox standards)
// ─────────────────────────────────────────────────────────────────────────────
export const LAYOUT = {
  // Sidebar width
  sidebarWidth: '280px',
  sidebarWidthCollapsed: '80px',
  
  // Header height
  headerHeight: '64px',
  
  // Content max-width
  maxWidth: '1440px',
  maxWidthNarrow: '1200px',
  maxWidthContent: '960px',
  
  // Grid gaps
  gridGapLarge: SPACING.lg,
  gridGapMedium: SPACING.md,
  gridGapSmall: SPACING.sm,
  
  // Grid columns (responsive)
  gridColumnsMobile: '1',
  gridColumnsTablet: '2',
  gridColumnsDesktop: '3',
  gridColumnsWide: '4',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Z-INDEX HIERARCHY
// ─────────────────────────────────────────────────────────────────────────────
export const Z_INDEX = {
  base: 0,
  sticky: 10,
  fixed: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
  notification: 60,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION CURVES
// ─────────────────────────────────────────────────────────────────────────────
export const EASING = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Snappy bounce
} as const;
