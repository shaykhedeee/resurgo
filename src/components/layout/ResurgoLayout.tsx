// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Responsive Layout System
// Mobile-first design with consistent spacing, single CTA per screen
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────────
// SHADOW & VISUAL STYLE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const SHADOW_DESTRUCTIVE = 'shadow-[3px_3px_0px_#991B1B]';
const SHADOW_DESTRUCTIVE_HOVER = 'shadow-[4px_4px_0px_#991B1B]';
const SHADOW_PRIMARY = 'shadow-[3px_3px_0px_rgba(0,0,0,0.8)]';
const SHADOW_PRIMARY_HOVER = 'shadow-[4px_4px_0px_rgba(0,0,0,0.8)]';
const SHADOW_ACTIVE = 'shadow-[1px_1px_0px_rgba(0,0,0,0.8)]';

// ─────────────────────────────────────────────────────────────────────────────────
// BREAKPOINTS & SPACING CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const BREAKPOINTS = {
  MOBILE: 0,
  MD: 768,
  LG: 1024,
} as const;

const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

const MAX_WIDTHS = {
  sm: '28rem',
  md: '42rem',
  lg: '56rem',
  xl: '72rem',
  full: '100%',
} as const;

// ─────────────────────────────────────────────────────────────────────────────────
// APPCONTAINER COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export interface AppContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
}

export function AppContainer({
  children,
  className,
  maxWidth = 'lg',
  noPadding = false,
}: AppContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        !noPadding && 'px-4 sm:px-6',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// PRIMARY ACTION BUTTON
// Single CTA per screen enforcement - uses resurgo/rust primary color
// ─────────────────────────────────────────────────────────────────────────────────

export interface PrimaryActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
   children: ReactNode;
   loading?: boolean;
   disabled?: boolean;
   fullWidth?: boolean;
   variant?: 'primary' | 'destructive';
}

export function PrimaryAction({
   children,
   loading = false,
   disabled = false,
   fullWidth = false,
   variant = 'primary',
   className,
   ...props
}: PrimaryActionProps) {
   const isDisabled = disabled || loading;

    const variantClasses = variant === 'destructive'
      ? [
          'bg-red-500 text-white',
          'border-2 border-red-600',
          SHADOW_DESTRUCTIVE,
          !isDisabled && `hover:bg-red-400 ${SHADOW_DESTRUCTIVE_HOVER}`,
          'focus-visible:ring-red-400 focus-visible:ring-offset-[var(--background)]',
        ]
      : [
          'bg-resurgo-600 text-white',
          'border-2 border-resurgo-700',
          SHADOW_PRIMARY,
          !isDisabled && `hover:bg-resurgo-500 ${SHADOW_PRIMARY_HOVER}`,
          'focus-visible:ring-resurgo-400 focus-visible:ring-offset-[var(--background)]',
        ];

   return (
     <button
       disabled={isDisabled}
       className={cn(
         'inline-flex items-center justify-center',
         'font-pixel text-sm uppercase tracking-wider',
         'min-h-[44px] px-6 rounded-pixel',
         'transition-all duration-100',
         'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
         variantClasses,
          `${SHADOW_ACTIVE} active:translate-x-[2px] active:translate-y-[2px]`,
         // State
         isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
         fullWidth && 'w-full',
         className
       )}
       {...props}
     >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SECONDARY ACTION BUTTON (Ghost Style)
// ─────────────────────────────────────────────────────────────────────────────────

export interface SecondaryActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function SecondaryAction({
  children,
  disabled = false,
  fullWidth = false,
  className,
  ...props
}: SecondaryActionProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center',
        'font-pixel text-sm uppercase tracking-wider',
        'min-h-[44px] px-6 rounded-pixel',
        'transition-all duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        // Ghost styles
        'bg-transparent text-[var(--text-secondary)]',
        'border-2 border-transparent',
        !disabled && 'hover:text-[var(--text-primary)] hover:border-[var(--border)]',
        'active:translate-x-[1px] active:translate-y-[1px]',
        'focus-visible:ring-[var(--border)] focus-visible:ring-offset-[var(--background)]',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// RESPONSIVE GRID UTILITIES
// ─────────────────────────────────────────────────────────────────────────────────

export interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  responsive?: boolean;
}

export function Grid({
  children,
  className,
  cols = 1,
  gap = 'md',
  responsive = true,
}: GridProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const getGridCols = () => {
    if (!responsive) {
      return `grid-cols-${cols}`;
    }

    // Mobile-first: start with 1 column, scale up
    const classes = ['grid-cols-1'];

    if (cols >= 2) classes.push('sm:grid-cols-2');
    if (cols >= 3) classes.push('md:grid-cols-3');
    if (cols >= 4) classes.push('lg:grid-cols-4');
    if (cols >= 6) classes.push('lg:grid-cols-6');
    if (cols === 12) classes.push('lg:grid-cols-12');

    return classes;
  };

  return (
    <div
      className={cn(
        'grid',
        responsive ? getGridCols() : `grid-cols-${cols}`,
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONTAINER UTILITIES
// ─────────────────────────────────────────────────────────────────────────────────

export interface StackProps {
  children: ReactNode;
  className?: string;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export function Stack({
  children,
  className,
  gap = 'md',
  align = 'stretch',
}: StackProps) {
  const gapClasses = {
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  const alignClasses = {
    start: 'items-start justify-start',
    center: 'items-center justify-center',
    end: 'items-end justify-end',
    stretch: 'items-stretch justify-stretch',
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        gapClasses[gap],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

export interface InlineProps {
  children: ReactNode;
  className?: string;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  wrap?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function Inline({
  children,
  className,
  gap = 'md',
  align = 'center',
  wrap = false,
  justify = 'start',
}: InlineProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      className={cn(
        'flex',
        wrap && 'flex-wrap',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SECTION CONTAINER
// Consistent vertical spacing for content sections
// ─────────────────────────────────────────────────────────────────────────────────

export interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Section({
  children,
  className,
  padding = 'md',
  maxWidth = 'lg',
}: SectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8',
    lg: 'py-8 sm:py-12',
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  return (
    <section className={cn('w-full', paddingClasses[padding], className)}>
      <div className={cn('mx-auto px-4 sm:px-6', maxWidthClasses[maxWidth])}>
        {children}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────────

export { BREAKPOINTS, SPACING, MAX_WIDTHS };