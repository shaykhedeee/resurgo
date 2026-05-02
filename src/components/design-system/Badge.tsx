import React from 'react';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '@/lib/design-system/tokens';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      icon,
      dismissible = false,
      onDismiss,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center gap-[${SPACING.xs}]
      font-medium rounded-full
      whitespace-nowrap transition-opacity
      duration-150ms
    `;

    const variantStyles = {
      default: `
        bg-[${COLORS.slate[100]}]
        text-[${COLORS.slate[900]}]
        border border-[${COLORS.slate[300]}]
      `,
      primary: `
        bg-[${COLORS.orange[50]}]
        text-[${COLORS.orange[600]}]
        border border-[${COLORS.orange[200]}]
      `,
      success: `
        bg-[${COLORS.success}]/10
        text-[${COLORS.success}]
        border border-[${COLORS.success}]/20
      `,
      warning: `
        bg-[${COLORS.warning}]/10
        text-[${COLORS.warning}]
        border border-[${COLORS.warning}]/20
      `,
      error: `
        bg-[${COLORS.error}]/10
        text-[${COLORS.error}]
        border border-[${COLORS.error}]/20
      `,
      info: `
        bg-[${COLORS.info}]/10
        text-[${COLORS.info}]
        border border-[${COLORS.info}]/20
      `,
      gray: `
        bg-[${COLORS.slate[200]}]
        text-[${COLORS.slate[800]}]
        border border-[${COLORS.slate[400]}]
      `,
    };

    const sizeStyles = {
      sm: `
        px-[${SPACING.sm}] py-[0.25rem]
        text-xs leading-tight
      `,
      md: `
        px-[${SPACING.md}] py-[0.375rem]
        text-sm leading-normal
      `,
      lg: `
        px-[${SPACING.lg}] py-[0.5rem]
        text-base leading-normal
      `,
    };

    const classes = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const dismissButtonClasses = `
      ml-[${SPACING.xs}] flex-shrink-0
      hover:opacity-70 cursor-pointer
      transition-opacity duration-150ms
    `;

    return (
      <div ref={ref} className={classes} {...props}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
        {dismissible && (
          <button
            className={dismissButtonClasses}
            onClick={onDismiss}
            type="button"
            aria-label="Dismiss"
          >
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
