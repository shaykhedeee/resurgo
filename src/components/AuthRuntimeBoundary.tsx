'use client';

import React, { Component, ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  children: ReactNode;
  mode: 'sign-in' | 'sign-up';
};

type State = {
  hasError: boolean;
};

export class AuthRuntimeBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error(`[AuthRuntimeBoundary:${this.props.mode}]`, error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const title =
      this.props.mode === 'sign-in'
        ? 'Sign-in temporarily unavailable'
        : 'Sign-up temporarily unavailable';

    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/15 p-4">
        <p className="font-mono text-[11px] tracking-widest text-red-400">AUTH_RUNTIME_ERROR</p>
        <h2 className="mt-2 font-terminal text-base text-zinc-100">{title}</h2>
        <p className="mt-2 font-terminal text-sm text-zinc-300">
          A runtime issue occurred while loading authentication UI. Please retry, or return home and try again.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => this.setState({ hasError: false })}
            className="rounded border border-orange-800 bg-orange-950/30 px-3 py-1.5 font-terminal text-sm text-orange-300 hover:bg-orange-950/50"
          >
            Retry
          </button>
          <Link
            href="/"
            className="rounded border border-zinc-700 px-3 py-1.5 font-terminal text-sm text-zinc-200 hover:bg-zinc-900"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }
}
