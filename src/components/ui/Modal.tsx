// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Design System Modal Component
// Accessible, animated modals with consistent styling
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { IconButton } from './Button';

// ─────────────────────────────────────────────────────────────────────────────────
// Modal Context for nested modals
// ─────────────────────────────────────────────────────────────────────────────────

type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

const modalSizes: Record<ModalSize, string> = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-[95vw] md:max-w-[90vw]',
};

// ─────────────────────────────────────────────────────────────────────────────────
// Focus Trap Hook
// ─────────────────────────────────────────────────────────────────────────────────

function useFocusTrap(isOpen: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isOpen]);

  return containerRef;
}

// ─────────────────────────────────────────────────────────────────────────────────
// Modal Component
// ─────────────────────────────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  children: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  size = 'md',
  title,
  description,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  children,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle open/close animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnBackdrop) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4',
        'transition-opacity duration-200',
        isAnimating ? 'opacity-100' : 'opacity-0'
      )}
      style={{ zIndex: 'var(--z-modal)' }}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm',
          'transition-opacity duration-200',
          isAnimating ? 'opacity-100' : 'opacity-0'
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        className={cn(
          'relative w-full bg-[var(--background-secondary)]',
          'border border-[var(--border)] rounded-2xl',
          'shadow-2xl overflow-hidden',
          'transition-all duration-300',
          isAnimating
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4',
          modalSizes[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-6 pb-4">
            {title && (
              <div>
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-[var(--text-primary)]"
                >
                  {title}
                </h2>
                {description && (
                  <p
                    id="modal-description"
                    className="mt-1 text-sm text-[var(--text-muted)]"
                  >
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <IconButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close modal"
                className="-mr-2 -mt-2"
              >
                <X className="w-5 h-5" />
              </IconButton>
            )}
          </div>
        )}

        {/* Body */}
        <div className={cn(!title && !showCloseButton && 'pt-6')}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Modal Body Component
// ─────────────────────────────────────────────────────────────────────────────────

interface ModalBodyProps {
  className?: string;
  children: ReactNode;
}

export function ModalBody({ className, children }: ModalBodyProps) {
  return (
    <div className={cn('px-6 pb-6 max-h-[60vh] overflow-y-auto', className)}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Modal Footer Component
// ─────────────────────────────────────────────────────────────────────────────────

interface ModalFooterProps {
  className?: string;
  children: ReactNode;
}

export function ModalFooter({ className, children }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 px-6 py-4',
        'border-t border-[var(--border)]',
        'bg-[var(--surface)]/50',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Confirm Dialog (uses Modal internally)
// ─────────────────────────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'default';
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={title}
      showCloseButton={false}
    >
      <ModalBody>
        <p className="text-[var(--text-secondary)]">{message}</p>
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          disabled={loading}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-medium',
            'bg-[var(--surface)] border border-[var(--border)]',
            'hover:bg-[var(--surface-hover)] transition-colors',
            'min-h-[44px] min-w-[80px]'
          )}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={cn(
            'px-4 py-2 rounded-xl text-sm font-semibold',
            'min-h-[44px] min-w-[80px] transition-colors',
            variant === 'danger' && 'bg-red-500 hover:bg-red-600 text-white',
            variant === 'warning' && 'bg-amber-500 hover:bg-amber-600 text-black',
            variant === 'default' &&
              'bg-gradient-to-r from-ascend-500 to-ascend-600 hover:from-ascend-400 hover:to-ascend-500 text-white'
          )}
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            confirmText
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// Drawer (Slide-in Modal from side)
// ─────────────────────────────────────────────────────────────────────────────────

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  showCloseButton?: boolean;
  className?: string;
  children: ReactNode;
}

const drawerSizes = {
  sm: 'max-w-xs',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Drawer({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  showCloseButton = true,
  className,
  children,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!mounted || !shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0',
        'transition-opacity duration-300',
        isAnimating ? 'opacity-100' : 'opacity-0'
      )}
      style={{ zIndex: 'var(--z-modal)' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={focusTrapRef}
        role="dialog"
        aria-modal="true"
        className={cn(
          'absolute top-0 bottom-0 w-full',
          'bg-[var(--background-secondary)] border-[var(--border)]',
          'shadow-2xl overflow-hidden',
          'transition-transform duration-300 ease-out',
          position === 'right' && 'right-0 border-l',
          position === 'left' && 'left-0 border-r',
          position === 'right' && (isAnimating ? 'translate-x-0' : 'translate-x-full'),
          position === 'left' && (isAnimating ? 'translate-x-0' : '-translate-x-full'),
          drawerSizes[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            {title && (
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
            )}
            {showCloseButton && (
              <IconButton variant="ghost" size="sm" onClick={onClose} aria-label="Close drawer">
                <X className="w-5 h-5" />
              </IconButton>
            )}
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto h-full pb-20">{children}</div>
      </div>
    </div>,
    document.body
  );
}
