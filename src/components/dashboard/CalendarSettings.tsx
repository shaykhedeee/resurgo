'use client';

import React, { useState } from 'react';

export default function CalendarSettings() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // In the future: const res = await fetch('/api/integrations/google-calendar/auth');
    // window.location.href = res.url;
    setTimeout(() => {
      // Simulate OAuth flow locally for now
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <div className="rounded border border-zinc-900 bg-zinc-950 p-6">
      <div className="mb-6 border-b border-zinc-900 pb-4">
        <h2 className="font-mono text-lg font-bold text-white">Calendar Integrations</h2>
        <p className="mt-2 font-mono text-xs text-zinc-400">
          Connect your calendar to automatically schedule habits into free time blocks and pull upcoming meetings into your daily planning view.
        </p>
      </div>

      <div className="flex items-center justify-between border border-zinc-800 bg-black p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-500/10 text-blue-400">
            {/* Google Calendar Icon placeholder */}
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-mono text-sm font-semibold text-zinc-100">Google Calendar</h3>
            <p className="font-mono text-xs text-zinc-500">
              {isConnected ? 'Connected to your primary account' : 'Not connected'}
            </p>
          </div>
        </div>

        <button
          onClick={handleConnect}
          disabled={isConnecting || isConnected}
          className={`border px-4 py-2 font-mono text-xs transition-colors ${
            isConnected
              ? 'border-green-900/50 bg-green-900/20 text-green-500 cursor-default'
              : isConnecting
              ? 'border-zinc-700 bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-black'
          }`}
        >
          {isConnected ? 'CONNECTED' : isConnecting ? 'CONNECTING...' : 'CONNECT ACCOUNT'}
        </button>
      </div>

      {isConnected && (
        <div className="mt-6 border-t border-zinc-900 pt-6">
          <h3 className="font-mono text-sm font-bold text-zinc-300">Sync Preferences</h3>
          
          <div className="mt-4 space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-orange-500" />
              <span className="font-mono text-xs text-zinc-400">Block time for habits in my calendar</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-orange-500" />
              <span className="font-mono text-xs text-zinc-400">Show calendar events in Daily Briefing</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-orange-500" />
              <span className="font-mono text-xs text-zinc-400">Use "Deep Work" events to protect focus time</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
