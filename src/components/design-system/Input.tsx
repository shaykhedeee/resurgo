import React from 'react';
import { COLORS, SPACING, RADIUS, TRANSITIONS, TYPOGRAPHY } from '@/lib/design-system/tokens';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      variant = 'outlined',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
  const containerClasses = cn(
      'flex flex-col gap-[0.375rem]',
      fullWidth && 'w-full'
    );

    const labelClasses = `
      text-xs font-medium
      text-[${COLORS.slate[700]}]
      uppercase tracking-wide
    `;

    const inputWrapperClasses = `
      relative flex items-center
      rounded-[${RADIUS.md}]
      transition-all duration-${TRANSITIONS.fast}ms
      focus-within:ring-2 focus-within:ring-offset-2
    `;

    const variantStyles = {
      outlined: `
        border-2 border-[${COLORS.slate[300]}]
        bg-white
        focus-within:border-[${COLORS.orange[600]}]
        focus-within:ring-[${COLORS.orange[500]}]/20
        hover:border-[${COLORS.slate[400]}]
      `,
      filled: `
        border-b-2 border-[${COLORS.slate[300]}]
        bg-[${COLORS.slate[100]}]
        focus-within:border-[${COLORS.orange[600]}]
        focus-within:ring-0
        hover:border-[${COLORS.slate[400]}]
      `,
      default: `
        border-b-2 border-[${COLORS.slate[200]}]
        bg-transparent
        focus-within:border-[${COLORS.orange[600]}]
        focus-within:ring-0
        hover:border-[${COLORS.slate[300]}]
      `,
    };

    const inputClasses = `
      flex-1 bg-transparent
      px-[${SPACING.md}] py-[${SPACING.sm}]
      text-sm leading-normal
      text-[${COLORS.slate[900]}]
      placeholder-[${COLORS.slate[400]}]
      outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const iconClasses = `
      flex items-center justify-center
      text-[${COLORS.slate[500]}]
      pointer-events-none
      flex-shrink-0
      ${iconPosition === 'left' ? `pl-[${SPACING.md}]` : `pr-[${SPACING.md}]`}
    `;

    const errorClasses = `
      text-xs font-medium
      text-[${COLORS.error}]
    `;

    const hintClasses = `
      text-xs
      text-[${COLORS.slate[600]}]
    `;

    return (
      <div className={containerClasses}>
        {label && <label className={labelClasses}>{label}</label>}
        
        <div className={cn(inputWrapperClasses, variantStyles[variant])}>
          {icon && iconPosition === 'left' && (
            <div className={iconClasses}>{icon}</div>
          )}
          
          <input
            ref={ref}
            className={cn(inputClasses, className)}
            disabled={disabled}
            {...props}
          />
          
          {icon && iconPosition === 'right' && (
            <div className={cn(iconClasses, 'pr-[1rem] pl-[0.5rem]')}>
              {icon}
            </div>
          )}
        </div>

        {error && <p className={errorClasses}>{error}</p>}
        {hint && !error && <p className={hintClasses}>{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
