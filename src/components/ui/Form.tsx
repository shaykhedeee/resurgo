// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Form Components
// Beautiful form validation UI with animations and accessibility
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Eye, EyeOff, Info, Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// Input Component
// ─────────────────────────────────────────────────────────────────────────────────

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  showPasswordToggle?: boolean;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      success,
      hint,
      leftIcon,
      rightIcon,
      isLoading,
      showPasswordToggle,
      containerClassName,
      className,
      type = 'text',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;
    
    const actualType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password')
      : type;

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled || isLoading}
            className={cn(
              // Base styles
              'w-full rounded-lg border bg-[var(--surface)] text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)]',
              'transition-all duration-[var(--duration-normal)]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              // Size
              'px-4 py-2.5 text-sm',
              // States
              hasError 
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500' 
                : hasSuccess 
                  ? 'border-green-500/50 focus:ring-green-500/30 focus:border-green-500'
                  : 'border-[var(--border)] focus:ring-ascend-500/30 focus:border-ascend-500',
              // Disabled
              disabled && 'opacity-50 cursor-not-allowed',
              // Padding adjustments
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle || isLoading) && 'pr-10',
              // Validation animation
              hasError && 'animate-shake',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : 
              success ? `${inputId}-success` : 
              hint ? `${inputId}-hint` : 
              undefined
            }
            {...props}
          />
          
          {/* Right Section */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isLoading && (
              <Loader2 className="w-4 h-4 text-[var(--text-muted)] animate-spin" />
            )}
            {showPasswordToggle && type === 'password' && !isLoading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            {rightIcon && !showPasswordToggle && !isLoading && rightIcon}
            {hasError && !rightIcon && !showPasswordToggle && !isLoading && (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            {hasSuccess && !rightIcon && !showPasswordToggle && !isLoading && (
              <CheckCircle className="w-4 h-4 text-green-400" />
            )}
          </div>
        </div>
        
        {/* Messages */}
        {error && (
          <p 
            id={`${inputId}-error`}
            className="text-xs text-red-400 flex items-center gap-1 animate-fade-in"
            role="alert"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
        {success && !error && (
          <p 
            id={`${inputId}-success`}
            className="text-xs text-green-400 flex items-center gap-1 animate-fade-in"
          >
            <CheckCircle className="w-3 h-3" />
            {success}
          </p>
        )}
        {hint && !error && !success && (
          <p 
            id={`${inputId}-hint`}
            className="text-xs text-[var(--text-muted)] flex items-center gap-1"
          >
            <Info className="w-3 h-3" />
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─────────────────────────────────────────────────────────────────────────────────
// Textarea Component
// ─────────────────────────────────────────────────────────────────────────────────

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  showCharCount?: boolean;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      success,
      hint,
      showCharCount,
      containerClassName,
      className,
      id,
      disabled,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          className={cn(
            'w-full rounded-lg border bg-[var(--surface)] text-[var(--text-primary)]',
            'placeholder:text-[var(--text-muted)]',
            'transition-all duration-[var(--duration-normal)]',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'px-4 py-3 text-sm min-h-[100px] resize-y',
            hasError 
              ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500' 
              : hasSuccess 
                ? 'border-green-500/50 focus:ring-green-500/30 focus:border-green-500'
                : 'border-[var(--border)] focus:ring-ascend-500/30 focus:border-ascend-500',
            disabled && 'opacity-50 cursor-not-allowed',
            hasError && 'animate-shake',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${textareaId}-error` : 
            success ? `${textareaId}-success` : 
            hint ? `${textareaId}-hint` : 
            undefined
          }
          {...props}
        />
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {error && (
              <p id={`${textareaId}-error`} className="text-xs text-red-400 flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            {success && !error && (
              <p id={`${textareaId}-success`} className="text-xs text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {success}
              </p>
            )}
            {hint && !error && !success && (
              <p id={`${textareaId}-hint`} className="text-xs text-[var(--text-muted)]">
                {hint}
              </p>
            )}
          </div>
          {showCharCount && maxLength && (
            <span className={cn(
              'text-xs',
              charCount >= maxLength 
                ? 'text-red-400' 
                : charCount >= maxLength * 0.9 
                  ? 'text-yellow-400' 
                  : 'text-[var(--text-muted)]'
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ─────────────────────────────────────────────────────────────────────────────────
// Select Component
// ─────────────────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<InputHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      success,
      hint,
      options,
      placeholder = 'Select an option',
      containerClassName,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const hasSuccess = !!success;

    return (
      <div className={cn('space-y-1.5', containerClassName)}>
        {label && (
          <label 
            htmlFor={selectId}
            className="block text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border bg-[var(--surface)] text-[var(--text-primary)]',
              'transition-all duration-[var(--duration-normal)]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'px-4 py-2.5 pr-10 text-sm appearance-none cursor-pointer',
              hasError 
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500' 
                : hasSuccess 
                  ? 'border-green-500/50 focus:ring-green-500/30 focus:border-green-500'
                  : 'border-[var(--border)] focus:ring-ascend-500/30 focus:border-ascend-500',
              disabled && 'opacity-50 cursor-not-allowed',
              className
            )}
            aria-invalid={hasError}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value} 
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Chevron */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {error && (
          <p id={`${selectId}-error`} className="text-xs text-red-400 flex items-center gap-1" role="alert">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
        {success && !error && (
          <p id={`${selectId}-success`} className="text-xs text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {success}
          </p>
        )}
        {hint && !error && !success && (
          <p id={`${selectId}-hint`} className="text-xs text-[var(--text-muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// ─────────────────────────────────────────────────────────────────────────────────
// Checkbox Component
// ─────────────────────────────────────────────────────────────────────────────────

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className={cn(
                'sr-only peer',
                className
              )}
              {...props}
            />
            <div className={cn(
              'w-5 h-5 rounded border-2 transition-all duration-[var(--duration-fast)]',
              'border-[var(--border)] bg-[var(--surface)]',
              'peer-checked:border-ascend-500 peer-checked:bg-ascend-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-ascend-500/30',
              'group-hover:border-ascend-500/50',
              error && 'border-red-500/50'
            )} />
            <svg
              className={cn(
                'absolute inset-0 w-5 h-5 text-white',
                'opacity-0 peer-checked:opacity-100',
                'transition-opacity duration-[var(--duration-fast)]',
                'peer-checked:animate-check-bounce'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            {label && (
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {label}
              </span>
            )}
            {description && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {description}
              </p>
            )}
          </div>
        </label>
        {error && (
          <p className="text-xs text-red-400 flex items-center gap-1 ml-8">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ─────────────────────────────────────────────────────────────────────────────────
// Radio Group Component
// ─────────────────────────────────────────────────────────────────────────────────

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  label?: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  name,
  label,
  options,
  value,
  onChange,
  error,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <fieldset className={cn('space-y-2', className)}>
      {label && (
        <legend className="text-sm font-medium text-[var(--text-primary)] mb-2">
          {label}
        </legend>
      )}
      <div className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      )}>
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start gap-3 cursor-pointer group',
              option.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="relative mt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className="sr-only peer"
              />
              <div className={cn(
                'w-5 h-5 rounded-full border-2 transition-all duration-[var(--duration-fast)]',
                'border-[var(--border)] bg-[var(--surface)]',
                'peer-checked:border-ascend-500',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-ascend-500/30',
                'group-hover:border-ascend-500/50',
                error && 'border-red-500/50'
              )} />
              <div className={cn(
                'absolute inset-0 flex items-center justify-center',
                'opacity-0 peer-checked:opacity-100',
                'transition-all duration-[var(--duration-fast)]'
              )}>
                <div className="w-2.5 h-2.5 rounded-full bg-ascend-500 animate-scale-in" />
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {option.label}
              </span>
              {option.description && (
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Toggle/Switch Component
// ─────────────────────────────────────────────────────────────────────────────────

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, size = 'md', className, id, ...props }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;
    
    const sizes = {
      sm: { track: 'w-8 h-5', thumb: 'w-3.5 h-3.5', translate: 'peer-checked:translate-x-3' },
      md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'peer-checked:translate-x-5' },
      lg: { track: 'w-14 h-8', thumb: 'w-6 h-6', translate: 'peer-checked:translate-x-6' },
    };

    return (
      <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
        <div className="relative">
          <input
            ref={ref}
            id={toggleId}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className={cn(
            'rounded-full transition-colors duration-[var(--duration-normal)]',
            'bg-[var(--surface)] border border-[var(--border)]',
            'peer-checked:bg-ascend-500 peer-checked:border-ascend-500',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-ascend-500/30',
            sizes[size].track
          )} />
          <div className={cn(
            'absolute left-0.5 top-1/2 -translate-y-1/2',
            'rounded-full bg-white shadow-sm',
            'transition-transform duration-[var(--duration-normal)] ease-[var(--ease-spring)]',
            sizes[size].thumb,
            sizes[size].translate
          )} />
        </div>
        {(label || description) && (
          <div>
            {label && (
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {label}
              </span>
            )}
            {description && (
              <p className="text-xs text-[var(--text-muted)]">
                {description}
              </p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';

// ─────────────────────────────────────────────────────────────────────────────────
// Form Field Group
// ─────────────────────────────────────────────────────────────────────────────────

interface FormGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Form Actions
// ─────────────────────────────────────────────────────────────────────────────────

interface FormActionsProps {
  children: ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}

export function FormActions({ children, align = 'right', className }: FormActionsProps) {
  const alignments = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div className={cn(
      'flex items-center gap-3 pt-4 border-t border-[var(--border)]',
      alignments[align],
      className
    )}>
      {children}
    </div>
  );
}
