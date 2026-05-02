import React from 'react';
import { COLORS, SPACING, RADIUS, TRANSITIONS, TYPOGRAPHY } from '@/lib/design-system/tokens';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center font-medium
      rounded-[${RADIUS.md}] cursor-pointer transition-all
      duration-${TRANSITIONS.fast}ms
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus:ring-2 focus:ring-offset-2
      active:scale-95
    `;

    const variantStyles = {
      primary: `
        bg-[${COLORS.orange[600]}] text-white
        hover:bg-[${COLORS.orange[700]}]
        focus:ring-[${COLORS.orange[500]}]/30
        shadow-md hover:shadow-lg
      `,
      secondary: `
        bg-[${COLORS.slate[100]}] text-[${COLORS.slate[900]}]
        hover:bg-[${COLORS.slate[200]}]
        focus:ring-[${COLORS.slate[300]}]/50
        border border-[${COLORS.slate[300]}]
      `,
      tertiary: `
        bg-transparent text-[${COLORS.orange[600]}]
        hover:bg-[${COLORS.orange[500]}]/10
        focus:ring-[${COLORS.orange[500]}]/20
      `,
      danger: `
        bg-[${COLORS.error}] text-white
        hover:bg-[${COLORS.error}]/90
        focus:ring-[${COLORS.error}]/30
        shadow-md hover:shadow-lg
      `,
      success: `
        bg-[${COLORS.success}] text-white
        hover:bg-[${COLORS.success}]/90
        focus:ring-[${COLORS.success}]/30
        shadow-md hover:shadow-lg
      `,
      ghost: `
        bg-transparent text-[${COLORS.slate[700]}]
        hover:bg-[${COLORS.slate[100]}]
        focus:ring-[${COLORS.slate[200]}]/50
      `,
    };

    const sizeStyles = {
      sm: `
        px-[${SPACING.md}] py-[${SPACING.xs}]
        text-xs leading-tight
        gap-[${SPACING.xs}]
      `,
      md: `
        px-[${SPACING.lg}] py-[${SPACING.sm}]
        text-sm leading-normal
        gap-[${SPACING.sm}]
      `,
      lg: `
        px-[${SPACING.xl}] py-[${SPACING.md}]
        text-base leading-normal
        gap-[${SPACING.md}]
      `,
    };

    const classes = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && 'w-full',
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" strokeWidth="4" />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        )}
        {!isLoading && icon && iconPosition === 'left' && icon}
        {children}
        {!isLoading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';
