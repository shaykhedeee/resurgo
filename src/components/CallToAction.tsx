'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

interface CallToActionProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: 'light' | 'dark';
}

export function CallToAction({
  title = 'Start Your Transformation Today',
  subtitle = 'Join thousands building better habits with AI-powered coaching.',
  primaryLabel = 'Get Started Free',
  primaryHref = '/quick-start',
  secondaryLabel = 'See Pricing',
  secondaryHref = '/pricing',
  variant = 'dark',
}: CallToActionProps) {
  return (
    <section className={`w-full py-20 ${variant === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-3xl mx-auto text-center px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span className="text-sm text-orange-400 font-medium">AI-Powered Habit Building</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
        <p className="text-lg text-zinc-400 mb-8">{subtitle}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={primaryHref}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-4 text-white font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
          >
            {primaryLabel}
            <ArrowRight className="w-5 h-5" />
          </a>
          <a
            href={secondaryHref}
            className="inline-flex items-center rounded-xl border border-zinc-700 px-8 py-4 text-zinc-300 font-semibold hover:bg-white/5 transition-colors"
          >
            {secondaryLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
