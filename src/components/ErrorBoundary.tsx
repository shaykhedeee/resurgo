// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Enhanced Error Boundary Component
// Catches and reports React component errors gracefully
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { errorTracker } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Capture error with tracking
    const errorId = errorTracker.captureComponentError(error, errorInfo.componentStack || '');
    
    this.setState({ errorInfo, errorId });

    // Call optional callback
    this.props.onError?.(error, errorInfo);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      showDetails: false,
    });
  };

  toggleDetails = (): void => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-red-400 mb-1">
                {this.props.componentName 
                  ? `Error in ${this.props.componentName}`
                  : 'Something went wrong'}
              </h3>
              <p className="text-sm text-white/60 mb-4">
                This section encountered an error. You can try refreshing or continue using other features.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={this.handleReset}
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 
                           text-red-400 text-sm font-medium flex items-center gap-2
                           transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <button
                    onClick={this.toggleDetails}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                             text-white/60 text-sm font-medium flex items-center gap-2
                             transition-colors"
                  >
                    {this.state.showDetails ? (
                      <><ChevronUp className="w-4 h-4" /> Hide Details</>
                    ) : (
                      <><ChevronDown className="w-4 h-4" /> Show Details</>
                    )}
                  </button>
                )}
              </div>

              {this.state.errorId && (
                <p className="text-xs text-white/30 mt-3">
                  Error ID: {this.state.errorId}
                </p>
              )}

              {/* Development error details */}
              {process.env.NODE_ENV === 'development' && this.state.showDetails && this.state.error && (
                <div className="mt-4 p-3 rounded-lg bg-black/30 overflow-auto max-h-48">
                  <p className="text-xs font-mono text-red-300 mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-xs font-mono text-white/40 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping functional components
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const WithErrorBoundary = (props: P) => (
    <ErrorBoundary componentName={displayName}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}

// Hook-based error boundary wrapper
export function ErrorBoundaryWrapper({
  children,
  componentName,
  fallback,
}: {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary componentName={componentName} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
