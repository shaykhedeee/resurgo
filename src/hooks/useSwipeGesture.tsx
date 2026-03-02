// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Swipe Gesture Hook
// Touch gesture handling for mobile experience
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useRef, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export type SwipeDirection = 'left' | 'right' | 'up' | 'down';

export interface SwipeConfig {
  threshold?: number; // Minimum distance (px) for swipe detection
  velocityThreshold?: number; // Minimum velocity (px/ms) for swipe detection
  preventScroll?: boolean; // Prevent page scrolling during swipe
  trackMouse?: boolean; // Also track mouse events (for testing)
}

export interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  velocity: number;
  direction: SwipeDirection | null;
  isSwiping: boolean;
}

export interface SwipeHandlers {
  onSwipeStart?: (state: SwipeState) => void;
  onSwipeMove?: (state: SwipeState) => void;
  onSwipeEnd?: (state: SwipeState) => void;
  onSwipeLeft?: (state: SwipeState) => void;
  onSwipeRight?: (state: SwipeState) => void;
  onSwipeUp?: (state: SwipeState) => void;
  onSwipeDown?: (state: SwipeState) => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DEFAULT CONFIG
// ─────────────────────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<SwipeConfig> = {
  threshold: 50,
  velocityThreshold: 0.3,
  preventScroll: false,
  trackMouse: false,
};

// ─────────────────────────────────────────────────────────────────────────────────
// SWIPE GESTURE HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function useSwipeGesture<T extends HTMLElement = HTMLElement>(
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
): React.RefObject<T | null> {
  const elementRef = useRef<T>(null);
  const stateRef = useRef<SwipeState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    velocity: 0,
    direction: null,
    isSwiping: false,
  });
  
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Calculate direction based on deltas
  const calculateDirection = useCallback((deltaX: number, deltaY: number): SwipeDirection | null => {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else if (absY > absX) {
      return deltaY > 0 ? 'down' : 'up';
    }
    
    return null;
  }, []);
  
  // Handle touch/mouse start
  const handleStart = useCallback((clientX: number, clientY: number) => {
    const now = Date.now();
    
    stateRef.current = {
      startX: clientX,
      startY: clientY,
      startTime: now,
      currentX: clientX,
      currentY: clientY,
      deltaX: 0,
      deltaY: 0,
      velocity: 0,
      direction: null,
      isSwiping: true,
    };
    
    handlers.onSwipeStart?.(stateRef.current);
  }, [handlers]);
  
  // Handle touch/mouse move
  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!stateRef.current.isSwiping) return;
    
    const state = stateRef.current;
    const now = Date.now();
    const elapsed = now - state.startTime;
    
    const deltaX = clientX - state.startX;
    const deltaY = clientY - state.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = elapsed > 0 ? distance / elapsed : 0;
    
    stateRef.current = {
      ...state,
      currentX: clientX,
      currentY: clientY,
      deltaX,
      deltaY,
      velocity,
      direction: calculateDirection(deltaX, deltaY),
    };
    
    handlers.onSwipeMove?.(stateRef.current);
  }, [handlers, calculateDirection]);
  
  // Handle touch/mouse end
  const handleEnd = useCallback(() => {
    if (!stateRef.current.isSwiping) return;
    
    const state = stateRef.current;
    const { threshold, velocityThreshold } = mergedConfig;
    const absX = Math.abs(state.deltaX);
    const absY = Math.abs(state.deltaY);
    
    // Check if swipe meets threshold
    const meetsThreshold =
      (absX > threshold || absY > threshold) &&
      state.velocity >= velocityThreshold;
    
    if (meetsThreshold && state.direction) {
      // Trigger direction-specific handlers
      switch (state.direction) {
        case 'left':
          handlers.onSwipeLeft?.(state);
          break;
        case 'right':
          handlers.onSwipeRight?.(state);
          break;
        case 'up':
          handlers.onSwipeUp?.(state);
          break;
        case 'down':
          handlers.onSwipeDown?.(state);
          break;
      }
    }
    
    handlers.onSwipeEnd?.(state);
    
    stateRef.current = {
      ...state,
      isSwiping: false,
    };
  }, [handlers, mergedConfig]);
  
  // Set up event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (mergedConfig.preventScroll && stateRef.current.isSwiping) {
        e.preventDefault();
      }
      handleMove(touch.clientX, touch.clientY);
    };
    
    const handleTouchEnd = () => {
      handleEnd();
    };
    
    // Mouse events (for testing)
    const handleMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };
    
    const handleMouseUp = () => {
      handleEnd();
    };
    
    // Add touch listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !mergedConfig.preventScroll });
    element.addEventListener('touchend', handleTouchEnd);
    element.addEventListener('touchcancel', handleTouchEnd);
    
    // Add mouse listeners if enabled
    if (mergedConfig.trackMouse) {
      element.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
      
      if (mergedConfig.trackMouse) {
        element.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [handleStart, handleMove, handleEnd, mergedConfig.preventScroll, mergedConfig.trackMouse]);
  
  return elementRef;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SWIPEABLE COMPONENT WRAPPER
// ─────────────────────────────────────────────────────────────────────────────────

interface SwipeableProps extends SwipeHandlers, SwipeConfig {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Swipeable({
  children,
  className,
  style,
  onSwipeStart,
  onSwipeMove,
  onSwipeEnd,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  ...config
}: SwipeableProps): React.ReactElement {
  const ref = useSwipeGesture<HTMLDivElement>(
    {
      onSwipeStart,
      onSwipeMove,
      onSwipeEnd,
      onSwipeLeft,
      onSwipeRight,
      onSwipeUp,
      onSwipeDown,
    },
    config
  );
  
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={style}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// SWIPE TO ACTION HOOK
// ─────────────────────────────────────────────────────────────────────────────────

interface SwipeToActionConfig {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftActionColor?: string;
  rightActionColor?: string;
  maxSwipe?: number;
}

export function useSwipeToAction<T extends HTMLElement = HTMLElement>(
  config: SwipeToActionConfig = {}
): {
  ref: React.RefObject<T | null>;
  offset: number;
  isRevealed: boolean;
  close: () => void;
} {
  const {
    threshold = 80,
    onSwipeLeft,
    onSwipeRight,
    maxSwipe = 100,
  } = config;
  
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  
  const ref = useSwipeGesture<T>(
    {
      onSwipeMove: (state) => {
        // Limit swipe distance
        const newOffset = Math.max(-maxSwipe, Math.min(maxSwipe, state.deltaX));
        offsetRef.current = newOffset;
        setOffset(newOffset);
      },
      onSwipeEnd: (_state) => {
        const absOffset = Math.abs(offsetRef.current);
        
        if (absOffset > threshold) {
          if (offsetRef.current > 0) {
            // Swiped right
            onSwipeRight?.();
          } else {
            // Swiped left
            onSwipeLeft?.();
          }
          setIsRevealed(true);
        }
        
        // Reset offset
        offsetRef.current = 0;
        setOffset(0);
      },
    },
    { preventScroll: true }
  );
  
  const close = useCallback(() => {
    setIsRevealed(false);
    offsetRef.current = 0;
    setOffset(0);
  }, []);
  
  return { ref, offset, isRevealed, close };
}

// Missing useState import fix
import { useState } from 'react';

export default useSwipeGesture;
