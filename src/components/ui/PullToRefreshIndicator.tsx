// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Pull to Refresh Indicator Component
// Visual indicator for pull-to-refresh gesture
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React from 'react';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  pullProgress: number;
  isRefreshing: boolean;
  canRefresh: boolean;
  threshold?: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export function PullToRefreshIndicator({
  pullDistance,
  pullProgress,
  isRefreshing,
  canRefresh,
  threshold = 80,
}: PullToRefreshIndicatorProps): React.ReactElement | null {
  if (pullDistance <= 0 && !isRefreshing) return null;
  
  const rotation = pullProgress * 360;
  const scale = 0.5 + pullProgress * 0.5;
  const opacity = Math.min(pullProgress * 1.5, 1);
  
  const getStatusText = (): string => {
    if (isRefreshing) return 'Refreshing...';
    if (canRefresh) return 'Release to refresh';
    return 'Pull to refresh';
  };
  
  const containerClasses = canRefresh || isRefreshing 
    ? 'bg-indigo-500 text-white' 
    : 'bg-gray-200 dark:bg-gray-700 text-gray-500';
  
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{
        top: Math.min(pullDistance - 40, threshold - 20),
        opacity,
        transform: `translateX(-50%) scale(${scale})`,
        transition: isRefreshing ? 'none' : 'all 0.2s ease-out',
      }}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 ${containerClasses}`}
      >
        {isRefreshing ? (
          <svg 
            className="w-5 h-5 animate-spin" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        )}
      </div>
      
      {/* Pull text */}
      <div className="text-center mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
        {getStatusText()}
      </div>
    </div>
  );
}

export default PullToRefreshIndicator;
