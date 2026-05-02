/**
 * RESURGO DESIGN SYSTEM — Card Component
 * Standardized card component with consistent spacing, borders, and visual hierarchy
 * Used across dashboard for all widget containers
 */

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { COLORS, SPACING, RADIUS } from '@/lib/design-system/tokens';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', padding = 'md', hover = false, onClick }, ref) => {
    const variantStyles = {
      default: 'border-zinc-800 bg-zinc-950',
      primary: 'border-orange-900/50 bg-orange-950/10',
      success: 'border-emerald-900/50 bg-emerald-950/10',
      warning: 'border-amber-900/50 bg-amber-950/10',
      error: 'border-red-900/50 bg-red-950/10',
    };

    const paddingStyles = {
      none: 'p-0',
      sm: `p-${SPACING.sm}`,
      md: `p-${SPACING.md}`,
      lg: `p-${SPACING.lg}`,
    };

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          'border transition-all duration-200',
          variantStyles[variant],
          paddingStyles[padding],
          hover && 'cursor-pointer hover:border-orange-900/60 hover:bg-zinc-900/60',
          className
        )}
        style={{
          borderRadius: RADIUS.md,
        }}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, icon, children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between gap-3 border-b border-zinc-800 pb-3 mb-3',
          className
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {icon && <div className="shrink-0">{icon}</div>}
          <div className="min-w-0 flex-1">
            {title && <p className="font-pixel text-sm tracking-wider text-orange-500 truncate">{title}</p>}
            {subtitle && <p className="font-terminal text-xs text-zinc-500 truncate">{subtitle}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-3', className)}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className }, ref) => {
    return (
      <div ref={ref} className={cn('flex items-center gap-2 border-t border-zinc-800 pt-3 mt-3', className)}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
