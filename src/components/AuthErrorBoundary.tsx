'use client';

import React, { Component, ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  route: 'sign-in' | 'sign-up';
};

type State = {
  hasError: boolean;
  errorMessage?: string;
};

/**
 * AuthErrorBoundary wraps authentication pages to catch and handle Clerk errors gracefully.
 * Captures error details for debugging and provides recovery options.
 */
export class AuthErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Extract meaningful error message for display
    let errorMessage = 'An error occurred while loading authentication';
    
    if (error.message.includes('Clerk')) {
      errorMessage = 'Clerk authentication failed to initialize';
    } else if (error.message.includes('JWT') || error.message.includes('token')) {
      errorMessage = 'Authentication token validation failed';
    } else if (error.message.includes('CORS')) {
      errorMessage = 'Authentication service cross-origin request blocked';
    } else if (error.message.includes('network')) {
      errorMessage = 'Cannot reach authentication service';
    }

    return { hasError: true, errorMessage };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = Date.now().toString(36) + '_' + Math.random().toString(36).substr(2);
    
    // Log detailed error for debugging
    console.error(`[AuthErrorBoundary:${this.props.route}] Error ID: ${errorId}`, {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Store error ID in session for support
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`auth_error_${this.props.route}`, errorId);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    // Hard refresh to clear any cached state
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleClearCache = () => {
    if (typeof window !== 'undefined') {
      // Clear all auth-related storage
      ['CLERK_USER', 'CLERK_SESSION', 'CLERK_TOKEN'].forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      // Clear IndexedDB caches if they exist
      if (window.indexedDB) {
        const dbs = ['clerk', 'resurgo'];
        dbs.forEach(db => {
          try {
            const req = indexedDB.deleteDatabase(db);
            req.onsuccess = () => console.log(`Cleared ${db} database`);
          } catch (e) {
            console.error(`Failed to clear ${db}:`, e);
          }
        });
      }
      // Reload after clearing
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const title = this.props.route === 'sign-in' 
      ? 'Sign-in Service Unavailable'
      : 'Sign-up Service Unavailable';

    return (
      <main className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.15) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.15) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }} />
        </div>

        <div className="w-full max-w-md relative">
          {/* Error card */}
          <div className="border border-red-900/50 bg-red-950/15 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                <span className="h-2 w-2 rounded-full bg-red-600/50" />
              </div>
              <span className="font-mono text-xs tracking-widest text-red-400">
                AUTH_SERVICE_ERROR
              </span>
            </div>

            <h1 className="text-lg font-semibold text-zinc-100 mb-2">{title}</h1>
            <p className="text-sm text-zinc-300 mb-4">
              {this.state.errorMessage || 'An unexpected error occurred during authentication initialization.'}
            </p>

            {/* Troubleshooting steps */}
            <div className="mb-4 rounded border border-zinc-800 bg-zinc-900/50 p-3">
              <p className="text-xs font-mono text-zinc-400 mb-2">TROUBLESHOOTING:</p>
              <ol className="space-y-1 text-xs text-zinc-400 font-mono">
                <li>• Clear browser cache and cookies</li>
                <li>• Try a different browser</li>
                <li>• Check your internet connection</li>
                <li>• Disable browser extensions</li>
              </ol>
            </div>

            {/* Recovery buttons */}
            <div className="space-y-2">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center border border-orange-800 bg-orange-950/30 px-4 py-2.5 font-mono text-xs tracking-widest text-orange-400 rounded hover:bg-orange-950/50 transition"
              >
                [RETRY]
              </button>
              <button
                onClick={this.handleClearCache}
                className="w-full flex items-center justify-center border border-zinc-800 bg-zinc-900 px-4 py-2.5 font-mono text-xs tracking-widest text-zinc-400 rounded hover:border-zinc-700 hover:text-zinc-300 transition"
              >
                [CLEAR CACHE & RELOAD]
              </button>
            </div>

            {/* Help link */}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-3">Still having issues?</p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center w-full border border-zinc-700 bg-zinc-950 px-4 py-2 font-mono text-xs tracking-widest text-zinc-300 rounded hover:bg-zinc-900 transition"
              >
                Return to Home
              </Link>
            </div>
          </div>

          {/* Support notice */}
          <p className="mt-4 text-center text-zinc-600 text-xs font-mono">
            If the problem persists, contact support with the error details above
          </p>
        </div>
      </main>
    );
  }
}
