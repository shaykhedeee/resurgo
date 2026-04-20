// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — TermButton: THE unified terminal-aesthetic button component
// Single source of truth for ALL buttons across the entire application.
// Variants: primary | secondary | ghost | danger | success | gold
// Sizes:    sm | md | lg | xl
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────
export type TermVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'gold';
export type TermSize = 'sm' | 'md' | 'lg' | 'xl';

interface TermButtonBaseProps {
  variant?: TermVariant;
  size?: TermSize;
  loading?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export interface TermButtonProps
  extends TermButtonBaseProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export interface TermLinkButtonProps extends TermButtonBaseProps {
  href: string;
  target?: string;
  rel?: string;
  className?: string;
  children?: React.ReactNode;
  prefetch?: boolean;
}

// ─── Variant classes ─────────────────────────────────────────────────────────
const variantClasses: Record<TermVariant, string> = {
  primary:
    'border-2 border-orange-600 bg-orange-600 text-white font-bold ' +
    'shadow-[3px_3px_0px_rgba(154,52,18,1)] ' +
    'hover:bg-orange-500 hover:border-orange-500 hover:shadow-[4px_4px_0px_rgba(124,45,18,1)] ' +
    'active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,0.8)] ' +
    'disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed',

  secondary:
    'border-2 border-orange-600 bg-transparent text-orange-400 ' +
    'shadow-[3px_3px_0px_rgba(154,52,18,0.8)] ' +
    'hover:bg-orange-950/30 hover:text-orange-300 hover:shadow-[4px_4px_0px_rgba(124,45,18,0.9)] ' +
    'active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,0.6)] ' +
    'disabled:border-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed',

  ghost:
    'border border-zinc-800 bg-transparent text-zinc-400 ' +
    'hover:border-zinc-600 hover:text-zinc-200 hover:bg-zinc-900 ' +
    'active:translate-x-px active:translate-y-px ' +
    'disabled:border-zinc-900 disabled:text-zinc-700 disabled:cursor-not-allowed',

  danger:
    'border-2 border-red-800 bg-red-950/30 text-red-400 ' +
    'shadow-[2px_2px_0px_rgba(220,38,38,0.3)] ' +
    'hover:bg-red-950/60 hover:border-red-700 hover:text-red-300 ' +
    'active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(220,38,38,0.3)] ' +
    'disabled:border-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed',

  success:
    'border-2 border-green-700 bg-green-950/30 text-green-400 ' +
    'shadow-[2px_2px_0px_rgba(34,197,94,0.3)] ' +
    'hover:bg-green-950/60 hover:border-green-600 hover:text-green-300 ' +
    'active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(34,197,94,0.3)] ' +
    'disabled:border-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed',

  gold:
    'border-2 border-amber-600 bg-amber-500 text-black font-bold ' +
    'shadow-[3px_3px_0px_rgba(0,0,0,0.7)] ' +
    'hover:bg-amber-400 hover:border-amber-500 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] ' +
    'active:translate-x-px active:translate-y-px active:shadow-[1px_1px_0px_rgba(0,0,0,0.7)] ' +
    'disabled:border-zinc-700 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:shadow-none disabled:cursor-not-allowed',
};

// ─── Size classes (balanced for desktop + mobile consistency) ────────────────
const sizeClasses: Record<TermSize, string> = {
  sm: 'px-3 py-1.5 text-[0.72rem] sm:text-xs min-h-[36px] sm:min-h-[40px] gap-1.5',
  md: 'px-4 py-2 text-[0.78rem] sm:text-sm min-h-[40px] sm:min-h-[44px] gap-2',
  lg: 'px-5 py-2.5 text-[0.84rem] sm:text-[0.95rem] min-h-[44px] sm:min-h-[48px] gap-2',
  xl: 'px-6 py-3 text-[0.95rem] sm:text-[1.05rem] min-h-[48px] sm:min-h-[56px] gap-3',
};

// ─── Shared base classes ─────────────────────────────────────────────────────
const baseClasses =
  'inline-flex items-center justify-center ' +
  'font-terminal leading-none tracking-[0.16em] uppercase ' +
  'transition-all duration-100 ' +
  'cursor-pointer select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

// ─── Loading spinner ─────────────────────────────────────────────────────────
function Spinner({ size }: { size: TermSize }) {
  const px = size === 'sm' ? 'w-3 h-3' : size === 'xl' ? 'w-5 h-5' : 'w-4 h-4';
  return <span className={cn(px, 'inline-block border-2 border-current border-t-transparent rounded-full animate-spin')} />;
}

// ═════════════════════════════════════════════════════════════════════════════
// TermButton — <button> element
// ═════════════════════════════════════════════════════════════════════════════

export const TermButton = forwardRef<HTMLButtonElement, TermButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          isDisabled && 'cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <Spinner size={size} />
            <span>PROCESSING_</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);
TermButton.displayName = 'TermButton';

// ═════════════════════════════════════════════════════════════════════════════
// TermLinkButton — Next.js <Link> element styled as a button
// ═════════════════════════════════════════════════════════════════════════════

export function TermLinkButton({
  href,
  target,
  rel,
  className,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  rightIcon,
  fullWidth = false,
  prefetch,
}: TermLinkButtonProps) {
  const isExternal = href.startsWith('http') || target === '_blank';

  if (isExternal) {
    return (
      <a
        href={href}
        target={target ?? '_blank'}
        rel={rel ?? 'noopener noreferrer'}
        className={cn(
          baseClasses,
          'no-underline',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className,
        )}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(
        baseClasses,
        'no-underline',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </Link>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TermIconButton — Icon-only button (square, accessible)
// ═════════════════════════════════════════════════════════════════════════════

interface TermIconButtonProps extends Omit<TermButtonProps, 'icon' | 'rightIcon' | 'fullWidth'> {
  'aria-label': string;
}

const iconOnlySizes: Record<TermSize, string> = {
  sm: 'p-2 min-h-[36px] min-w-[36px] sm:min-h-[40px] sm:min-w-[40px]',
  md: 'p-2 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px]',
  lg: 'p-2.5 min-h-[44px] min-w-[44px] sm:min-h-[48px] sm:min-w-[48px]',
  xl: 'p-3 min-h-[48px] min-w-[48px] sm:min-h-[56px] sm:min-w-[56px]',
};

export const TermIconButton = forwardRef<HTMLButtonElement, TermIconButtonProps>(
  ({ variant = 'ghost', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          iconOnlySizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TermIconButton.displayName = 'TermIconButton';

// ═════════════════════════════════════════════════════════════════════════════
// Utility — get raw classes for edge cases that can't use the component
// ═════════════════════════════════════════════════════════════════════════════
export function getTermButtonClasses(variant: TermVariant = 'primary', size: TermSize = 'md') {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size]);
}

export default TermButton;
