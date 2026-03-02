// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Keyboard Shortcuts System
// Professional keyboard navigation like Notion/Linear
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { X, Keyboard } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  category: 'navigation' | 'actions' | 'general';
  action: () => void;
}

interface KeyboardShortcutsContextType {
  registerShortcut: (id: string, shortcut: Shortcut) => void;
  unregisterShortcut: (id: string) => void;
  showHelp: () => void;
  hideHelp: () => void;
  isHelpOpen: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────────

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider');
  }
  return context;
}

// ─────────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────────

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
  onNavigate?: (tab: string) => void;
  onOpenSearch?: () => void;
  onOpenGoalWizard?: () => void;
  onOpenAddHabit?: () => void;
  onOpenSettings?: () => void;
  onOpenQuickAdd?: () => void;
}

export function KeyboardShortcutsProvider({
  children,
  onNavigate,
  onOpenSearch,
  onOpenGoalWizard,
  onOpenAddHabit,
  onOpenSettings,
  onOpenQuickAdd,
}: KeyboardShortcutsProviderProps) {
  const [shortcuts, setShortcuts] = useState<Map<string, Shortcut>>(new Map());
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Default shortcuts
  useEffect(() => {
    const defaultShortcuts: [string, Shortcut][] = [
      // Navigation
      ['nav-today', {
        key: '1',
        ctrl: false,
        description: 'Go to Today',
        category: 'navigation',
        action: () => onNavigate?.('today'),
      }],
      ['nav-habits', {
        key: '2',
        ctrl: false,
        description: 'Go to Habits',
        category: 'navigation',
        action: () => onNavigate?.('habits'),
      }],
      ['nav-tasks', {
        key: '3',
        ctrl: false,
        description: 'Go to Tasks',
        category: 'navigation',
        action: () => onNavigate?.('tasks'),
      }],
      ['nav-goals', {
        key: '4',
        ctrl: false,
        description: 'Go to Goals',
        category: 'navigation',
        action: () => onNavigate?.('goals'),
      }],
      ['nav-focus', {
        key: '5',
        ctrl: false,
        description: 'Go to Focus Mode',
        category: 'navigation',
        action: () => onNavigate?.('focus'),
      }],
      ['nav-calendar', {
        key: '6',
        ctrl: false,
        description: 'Go to Calendar',
        category: 'navigation',
        action: () => onNavigate?.('calendar'),
      }],
      ['nav-analytics', {
        key: '7',
        ctrl: false,
        description: 'Go to Analytics',
        category: 'navigation',
        action: () => onNavigate?.('progress'),
      }],
      ['nav-wellness', {
        key: '8',
        ctrl: false,
        description: 'Go to Wellness',
        category: 'navigation',
        action: () => onNavigate?.('wellness'),
      }],
      // Actions
      ['action-search', {
        key: 'k',
        ctrl: true,
        description: 'Open Search',
        category: 'actions',
        action: () => onOpenSearch?.(),
      }],
      ['action-quick-add', {
        key: 'n',
        ctrl: true,
        description: 'Quick Add',
        category: 'actions',
        action: () => onOpenQuickAdd?.(),
      }],
      ['action-new-goal', {
        key: 'g',
        ctrl: true,
        description: 'New Goal',
        category: 'actions',
        action: () => onOpenGoalWizard?.(),
      }],
      ['action-new-habit', {
        key: 'h',
        ctrl: true,
        description: 'New Habit',
        category: 'actions',
        action: () => onOpenAddHabit?.(),
      }],
      ['action-settings', {
        key: ',',
        ctrl: true,
        description: 'Open Settings',
        category: 'actions',
        action: () => onOpenSettings?.(),
      }],
      // General
      ['general-help', {
        key: '?',
        shift: true,
        description: 'Show Keyboard Shortcuts',
        category: 'general',
        action: () => setIsHelpOpen(true),
      }],
    ];

    setShortcuts(new Map(defaultShortcuts));
  }, [onNavigate, onOpenSearch, onOpenGoalWizard, onOpenAddHabit, onOpenSettings, onOpenQuickAdd]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        // Allow Escape and some Ctrl shortcuts in inputs
        if (e.key !== 'Escape' && !(e.ctrlKey && ['k', 'n'].includes(e.key))) {
          return;
        }
      }

      // Close help on Escape
      if (e.key === 'Escape') {
        if (isHelpOpen) {
          setIsHelpOpen(false);
          e.preventDefault();
          return;
        }
      }

      // Check all registered shortcuts
      const shortcutValues = Array.from(shortcuts.values());
      for (const shortcut of shortcutValues) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase() ||
                        (shortcut.key === '?' && e.key === '/' && e.shiftKey);
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !(e.ctrlKey || e.metaKey);
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey || shortcut.key === '?';
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, isHelpOpen]);

  const registerShortcut = useCallback((id: string, shortcut: Shortcut) => {
    setShortcuts(prev => new Map(prev).set(id, shortcut));
  }, []);

  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts(prev => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        registerShortcut,
        unregisterShortcut,
        showHelp: () => setIsHelpOpen(true),
        hideHelp: () => setIsHelpOpen(false),
        isHelpOpen,
      }}
    >
      {children}
      <KeyboardShortcutsHelp 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        shortcuts={Array.from(shortcuts.values())}
      />
    </KeyboardShortcutsContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELP MODAL
// ─────────────────────────────────────────────────────────────────────────────────

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: Shortcut[];
}

function KeyboardShortcutsHelp({ isOpen, onClose, shortcuts }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  const categories = {
    navigation: shortcuts.filter(s => s.category === 'navigation'),
    actions: shortcuts.filter(s => s.category === 'actions'),
    general: shortcuts.filter(s => s.category === 'general'),
  };

  const formatKey = (shortcut: Shortcut): React.ReactNode => {
    const keys: string[] = [];
    if (shortcut.ctrl) keys.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
    if (shortcut.shift) keys.push('⇧');
    if (shortcut.alt) keys.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');
    keys.push(shortcut.key.toUpperCase());

    return (
      <span className="flex items-center gap-1">
        {keys.map((key, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="text-[var(--text-muted)]">+</span>}
            <kbd className="px-2 py-1 bg-[var(--surface)] rounded text-xs font-mono min-w-[28px] text-center">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </span>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 
                   md:w-[500px] max-h-[80vh] z-[101] animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
      >
        <div 
          className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ascend-500/10 flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-ascend-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Keyboard Shortcuts
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Navigate faster with your keyboard
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ascend-500" />
                Navigation
              </h3>
              <div className="space-y-2">
                {categories.navigation.map((shortcut, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg 
                             hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <span className="text-sm text-[var(--text-secondary)]">
                      {shortcut.description}
                    </span>
                    {formatKey(shortcut)}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Actions
              </h3>
              <div className="space-y-2">
                {categories.actions.map((shortcut, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg 
                             hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <span className="text-sm text-[var(--text-secondary)]">
                      {shortcut.description}
                    </span>
                    {formatKey(shortcut)}
                  </div>
                ))}
              </div>
            </div>

            {/* General */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400" />
                General
              </h3>
              <div className="space-y-2">
                {categories.general.map((shortcut, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between py-2 px-3 rounded-lg 
                             hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <span className="text-sm text-[var(--text-secondary)]">
                      {shortcut.description}
                    </span>
                    {formatKey(shortcut)}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--surface)]">
            <p className="text-xs text-[var(--text-muted)] text-center">
              Press <kbd className="px-1.5 py-0.5 bg-[var(--card)] rounded">?</kbd> anytime to show this help
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default KeyboardShortcutsProvider;
