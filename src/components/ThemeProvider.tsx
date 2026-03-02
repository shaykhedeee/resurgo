// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Theme Provider Component
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // On mount, read theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('ascend-theme') as Theme | null;
    
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dark theme (premium feel)
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    setMounted(true);
  }, []);

  // Update DOM when theme changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('ascend-theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    // Add transition class for smooth theme switch
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    
    // Remove transition class after animation completes
    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  // Always provide context - even before mount
  // This fixes "useTheme must be used within ThemeProvider" error
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
