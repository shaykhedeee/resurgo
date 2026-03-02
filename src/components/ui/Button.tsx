// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Design System Button Components
// Standardized button styles with consistent interactions
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// Button Variants & Sizes
// ─────────────────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'gold';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-ascend-500 to-ascend-600 
    hover:from-ascend-400 hover:to-ascend-500 
    text-white font-semibold
    shadow-md shadow-ascend-500/20
    hover:shadow-lg hover:shadow-ascend-500/30
    active:shadow-sm
    focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-2
  `,
  secondary: `
    bg-[var(--surface)] 
    hover:bg-[var(--surface-hover)] 
    text-[var(--text-primary)]
    border border-[var(--border)]
    hover:border-[var(--text-muted)]
    focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-2
  `,
  outline: `
    bg-transparent 
    hover:bg-[var(--surface)] 
    text-[var(--text-primary)]
    border border-[var(--border)]
    hover:border-ascend-500/50
    focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-2
  `,
  ghost: `
    bg-transparent 
    hover:bg-[var(--surface)] 
    text-[var(--text-secondary)]
    hover:text-[var(--text-primary)]
    focus-visible:ring-2 focus-visible:ring-[var(--border)] focus-visible:ring-offset-2
  `,
  danger: `
    bg-red-500/10 
    hover:bg-red-500/20 
    text-red-400
    border border-red-500/30
    hover:border-red-500/50
    focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2
  `,
  success: `
    bg-green-500/10 
    hover:bg-green-500/20 
    text-green-400
    border border-green-500/30
    hover:border-green-500/50
    focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2
  `,
  gold: `
    bg-gradient-to-r from-gold-400 to-amber-500 
    hover:from-gold-300 hover:to-amber-400 
    text-black font-semibold
    shadow-md shadow-gold-400/20
    hover:shadow-lg hover:shadow-gold-400/30
    active:shadow-sm
    focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs min-h-[28px] rounded-md gap-1',
  sm: 'px-3 py-1.5 text-sm min-h-[36px] rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm min-h-[44px] rounded-xl gap-2',
  lg: 'px-6 py-3 text-base min-h-[52px] rounded-xl gap-2',
  xl: 'px-8 py-4 text-lg min-h-[60px] rounded-2xl gap-3',
};

const iconOnlySizes: Record<ButtonSize, string> = {
  xs: 'p-1 min-h-[28px] min-w-[28px] rounded-md',
  sm: 'p-1.5 min-h-[36px] min-w-[36px] rounded-lg',
  md: 'p-2 min-h-[44px] min-w-[44px] rounded-xl',
  lg: 'p-3 min-h-[52px] min-w-[52px] rounded-xl',
  xl: 'p-4 min-h-[60px] min-w-[60px] rounded-2xl',
};

// ─────────────────────────────────────────────────────────────────────────────────
// Button Component
// ─────────────────────────────────────────────────────────────────────────────────

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly = false,
      fullWidth = false,
      disabled,
      className,
      children,
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
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium transition-all',
          'focus-visible:outline-none focus-visible:ring-offset-[var(--background)]',
          
          // Micro-interactions
          'active:scale-[0.98] active-press',
          
          // Theme transition
          'theme-transition',
          
          // Variant & Size
          variantStyles[variant],
          iconOnly ? iconOnlySizes[size] : sizeStyles[size],
          
          // Full width
          fullWidth && 'w-full',
          
          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn(
            'animate-spin',
            size === 'xs' && 'w-3 h-3',
            size === 'sm' && 'w-4 h-4',
            size === 'md' && 'w-5 h-5',
            size === 'lg' && 'w-5 h-5',
            size === 'xl' && 'w-6 h-6',
          )} />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ─────────────────────────────────────────────────────────────────────────────────
// Icon Button Component
// ─────────────────────────────────────────────────────────────────────────────────

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  'aria-label': string; // Required for accessibility
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'ghost', size = 'md', loading, children, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        loading={loading}
        iconOnly
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

// ─────────────────────────────────────────────────────────────────────────────────
// Button Group Component
// ─────────────────────────────────────────────────────────────────────────────────

interface ButtonGroupProps {
  children: ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({ children, className, orientation = 'horizontal' }: ButtonGroupProps) {
  return (
    <div
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        // Style adjustments for grouped buttons
        '[&>button]:rounded-none',
        orientation === 'horizontal' && [
          '[&>button:first-child]:rounded-l-xl',
          '[&>button:last-child]:rounded-r-xl',
          '[&>button:not(:first-child)]:-ml-px',
        ],
        orientation === 'vertical' && [
          '[&>button:first-child]:rounded-t-xl',
          '[&>button:last-child]:rounded-b-xl',
          '[&>button:not(:first-child)]:-mt-px',
        ],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Floating Action Button
// ─────────────────────────────────────────────────────────────────────────────────

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  children: ReactNode;
}

const fabPositions = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
};

export const FAB = forwardRef<HTMLButtonElement, FABProps>(
  ({ position = 'bottom-right', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          fabPositions[position],
          'w-14 h-14 rounded-full',
          'bg-gradient-to-r from-ascend-500 to-ascend-600',
          'hover:from-ascend-400 hover:to-ascend-500',
          'text-white shadow-lg shadow-ascend-500/30',
          'hover:shadow-xl hover:shadow-ascend-500/40',
          'flex items-center justify-center',
          'transition-all active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ascend-400 focus-visible:ring-offset-2',
          'z-40',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FAB.displayName = 'FAB';

// ─────────────────────────────────────────────────────────────────────────────────
// Link Button (looks like a button but is an anchor)
// ─────────────────────────────────────────────────────────────────────────────────

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  external?: boolean;
  className?: string;
  children: ReactNode;
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth,
  external,
  className,
  children,
}: LinkButtonProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center justify-center',
        'font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-offset-[var(--background)]',
        'active:scale-[0.98]',
        'no-underline',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </a>
  );
}
