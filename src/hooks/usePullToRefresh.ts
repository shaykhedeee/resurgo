// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Pull to Refresh Hook
// Touch gesture handling for pull-to-refresh functionality
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { haptics } from '@/lib/haptics';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface PullToRefreshConfig {
  threshold?: number; // Distance to trigger refresh (default: 80px)
  maxPull?: number; // Maximum pull distance (default: 150px)
  refreshTimeout?: number; // Auto-reset after this time (default: 3000ms)
  hapticFeedback?: boolean; // Enable haptic feedback (default: true)
  disabled?: boolean; // Disable pull-to-refresh
}

export interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number; // 0 to 1
  canRefresh: boolean;
}

export interface PullToRefreshReturn extends PullToRefreshState {
  ref: React.RefObject<HTMLElement | null>;
  triggerRefresh: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DEFAULT CONFIG
// ─────────────────────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<PullToRefreshConfig> = {
  threshold: 80,
  maxPull: 150,
  refreshTimeout: 3000,
  hapticFeedback: true,
  disabled: false,
};

// ─────────────────────────────────────────────────────────────────────────────────
// PULL TO REFRESH HOOK
// ─────────────────────────────────────────────────────────────────────────────────

export function usePullToRefresh(
  onRefresh: () => Promise<void> | void,
  config: PullToRefreshConfig = {}
): PullToRefreshReturn {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const containerRef = useRef<HTMLElement>(null);
  
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    pullProgress: 0,
    canRefresh: false,
  });
  
  // Touch tracking
  const touchStartY = useRef<number>(0);
  const lastTouchY = useRef<number>(0);
  const isAtTop = useRef<boolean>(false);
  const hasTriggeredHaptic = useRef<boolean>(false);
  
  // Check if container is scrolled to top
  const checkIsAtTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;
    
    // Check if scrolled to top (with small tolerance)
    return container.scrollTop <= 5;
  }, []);
  
  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (mergedConfig.disabled || state.isRefreshing) return;
    
    isAtTop.current = checkIsAtTop();
    if (!isAtTop.current) return;
    
    touchStartY.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
    hasTriggeredHaptic.current = false;
    
    setState(prev => ({
      ...prev,
      isPulling: true,
    }));
  }, [mergedConfig.disabled, state.isRefreshing, checkIsAtTop]);
  
  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (mergedConfig.disabled || state.isRefreshing || !isAtTop.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;
    
    // Only track downward pulls
    if (deltaY < 0) {
      setState(prev => ({
        ...prev,
        isPulling: false,
        pullDistance: 0,
        pullProgress: 0,
        canRefresh: false,
      }));
      return;
    }
    
    // Apply resistance to make it feel natural
    const resistance = 0.5;
    const pullDistance = Math.min(deltaY * resistance, mergedConfig.maxPull);
    const pullProgress = Math.min(pullDistance / mergedConfig.threshold, 1);
    const canRefresh = pullDistance >= mergedConfig.threshold;
    
    // Trigger haptic when threshold is crossed
    if (canRefresh && !hasTriggeredHaptic.current && mergedConfig.hapticFeedback) {
      haptics.medium();
      hasTriggeredHaptic.current = true;
    }
    
    // Prevent default scroll when pulling
    if (pullDistance > 10) {
      e.preventDefault();
    }
    
    lastTouchY.current = currentY;
    
    setState(prev => ({
      ...prev,
      isPulling: true,
      pullDistance,
      pullProgress,
      canRefresh,
    }));
  }, [mergedConfig, state.isRefreshing]);
  
  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (mergedConfig.disabled || state.isRefreshing) return;
    
    const canRefresh = state.pullDistance >= mergedConfig.threshold;
    
    if (canRefresh) {
      // Trigger refresh
      setState(prev => ({
        ...prev,
        isPulling: false,
        isRefreshing: true,
        pullDistance: mergedConfig.threshold,
        pullProgress: 1,
        canRefresh: false,
      }));
      
      if (mergedConfig.hapticFeedback) {
        haptics.success();
      }
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
        if (mergedConfig.hapticFeedback) {
          haptics.error();
        }
      }
      
      // Reset state
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        pullProgress: 0,
        canRefresh: false,
      });
    } else {
      // Reset without refresh
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        pullProgress: 0,
        canRefresh: false,
      });
    }
    
    touchStartY.current = 0;
    lastTouchY.current = 0;
    hasTriggeredHaptic.current = false;
  }, [mergedConfig, state, onRefresh]);
  
  // Manual trigger refresh
  const triggerRefresh = useCallback(async () => {
    if (state.isRefreshing) return;
    
    setState(prev => ({
      ...prev,
      isRefreshing: true,
      pullDistance: mergedConfig.threshold,
      pullProgress: 1,
    }));
    
    if (mergedConfig.hapticFeedback) {
      haptics.medium();
    }
    
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    }
    
    setState({
      isPulling: false,
      isRefreshing: false,
      pullDistance: 0,
      pullProgress: 0,
      canRefresh: false,
    });
  }, [state.isRefreshing, mergedConfig, onRefresh]);
  
  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mergedConfig.disabled) return;
    
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, mergedConfig.disabled]);
  
  // Safety timeout to reset stuck state
  useEffect(() => {
    if (!state.isRefreshing) return;
    
    const timeout = setTimeout(() => {
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        pullProgress: 0,
        canRefresh: false,
      });
    }, mergedConfig.refreshTimeout);
    
    return () => clearTimeout(timeout);
  }, [state.isRefreshing, mergedConfig.refreshTimeout]);
  
  return {
    ref: containerRef,
    triggerRefresh,
    ...state,
  };
}

export default usePullToRefresh;
