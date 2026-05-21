'use client';

import React, { useState } from 'react';

interface ShareStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakCount: number;
  habitName?: string;
}

export default function ShareStreakModal({ isOpen, onClose, streakCount, habitName }: ShareStreakModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `🔥 I just hit a ${streakCount}-day streak${habitName ? ` on ${habitName}` : ''} using Resurgo! Join me and let's build better habits together. https://resurgo.life`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    // LinkedIn sharing doesn't prefill text easily via URL without a registered app, but we can open the share page.
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://resurgo.life')}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-orange-500/30 bg-zinc-950 p-6 shadow-2xl shadow-orange-500/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 font-mono text-xs text-zinc-500 hover:text-white"
        >
          [CLOSE]
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10 border border-orange-500/30 text-2xl">
            🔥
          </div>
          <h2 className="font-mono text-xl font-bold text-white">Share Your Streak</h2>
          <p className="mt-2 font-mono text-xs text-zinc-400">
            You are crushing it. Inspire others by sharing your progress!
          </p>
        </div>

        <div className="mb-6 rounded border border-zinc-800 bg-black p-4">
          <p className="font-mono text-sm text-zinc-300">
            "{shareText}"
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={copyToClipboard}
            className="w-full border border-zinc-700 bg-zinc-900 px-4 py-3 font-mono text-sm text-white hover:border-zinc-500 transition"
          >
            {copied ? '✓ COPIED TO CLIPBOARD' : '📋 COPY TEXT'}
          </button>
          
          <button
            onClick={shareToTwitter}
            className="w-full border border-blue-500/50 bg-blue-500/10 px-4 py-3 font-mono text-sm text-blue-400 hover:bg-blue-500 hover:text-white transition"
          >
            🐦 SHARE ON X (TWITTER)
          </button>

          <button
            onClick={shareToLinkedIn}
            className="w-full border border-blue-600/50 bg-blue-600/10 px-4 py-3 font-mono text-sm text-blue-500 hover:bg-blue-600 hover:text-white transition"
          >
            💼 SHARE ON LINKEDIN
          </button>
        </div>
      </div>
    </div>
  );
}
