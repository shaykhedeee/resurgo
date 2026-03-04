'use client';

import { useMutation, useQuery, useAction } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState, FormEvent } from 'react';
import { Puzzle, Plus, Trash2, Eye, EyeOff, Copy, Check, Zap, Key, Webhook } from 'lucide-react';
import { cn } from '@/lib/utils';

const SUPPORTED_EVENTS = [
  'task.created', 'task.completed', 'habit.logged', 'habit.streak_broken',
  'goal.completed', 'focus.completed', 'budget.expense_logged', 'sleep.logged',
];

export default function IntegrationsPage() {
  const webhooks = useQuery(api.webhooks.listWebhooks, {});
  const apiKeys = useQuery(api.apiKeys.listApiKeys, {});
  const createWebhook = useMutation(api.webhooks.createWebhook);
  const toggleWebhook = useMutation(api.webhooks.toggleWebhook);
  const deleteWebhook = useMutation(api.webhooks.deleteWebhook);
  const generateKey = useAction(api.apiKeys.generateKey);
  const revokeKey = useMutation(api.apiKeys.revokeKey);

  const [tab, setTab] = useState<'webhooks' | 'api'>('webhooks');
  const [showWebhookForm, setShowWebhookForm] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookName, setWebhookName] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [savingWh, setSavingWh] = useState(false);

  const [keyName, setKeyName] = useState('');
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateWebhook = async (e: FormEvent) => {
    e.preventDefault();
    if (!webhookUrl || selectedEvents.length === 0 || savingWh) return;
    setSavingWh(true);
    try {
      await createWebhook({ url: webhookUrl, events: selectedEvents, name: webhookName || undefined });
      setWebhookUrl(''); setWebhookName(''); setSelectedEvents([]); setShowWebhookForm(false);
    } finally { setSavingWh(false); }
  };

  const handleGenerateKey = async (e: FormEvent) => {
    e.preventDefault();
    if (!keyName || generatingKey) return;
    setGeneratingKey(true);
    try {
      const result = await generateKey({ name: keyName });
      setNewKey(result.fullKey);
      setKeyName('');
    } finally { setGeneratingKey(false); }
  };

  const copyKey = async () => {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleEvent = (evt: string) =>
    setSelectedEvents((prev) => prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]);

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Telegram Deprecation Banner */}
        <div className="mb-4 rounded-lg border border-amber-700/40 bg-amber-950/30 px-5 py-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 text-lg">📱</span>
            <div>
              <p className="font-mono text-xs font-semibold text-amber-400 tracking-wide">
                TELEGRAM BOT → ANDROID APP MIGRATION
              </p>
              <p className="mt-1 text-xs text-amber-200/70 leading-relaxed">
                We&apos;re replacing the Telegram bot with a dedicated Android app featuring native push
                notifications. The bot will continue working for 30 days.{' '}
                <a href="/download" className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300">
                  Download the app →
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="mb-5 border border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2 border-b border-zinc-900 px-5 py-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-600" />
            <span className="font-mono text-xs tracking-widest text-orange-600">DEVELOPER :: INTEGRATIONS_HUB</span>
          </div>
          <div className="px-5 py-4">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-100">Integrations</h1>
            <p className="mt-0.5 font-mono text-xs tracking-widest text-zinc-500">Webhooks · API Keys · Automation</p>
          </div>
          <div className="flex border-t border-zinc-900">
            {[
              { id: 'webhooks' as const, label: 'WEBHOOKS', icon: Webhook },
              { id: 'api' as const, label: 'API_KEYS', icon: Key },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn('flex flex-1 items-center justify-center gap-1.5 border-b-2 py-2.5 font-mono text-xs tracking-widest transition',
                  tab === id ? 'border-orange-600 bg-orange-950/10 text-orange-500' : 'border-transparent text-zinc-400 hover:text-zinc-400'
                )}>
                <Icon className="h-3 w-3" /> {label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'webhooks' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950 p-4">
              <p className="font-mono text-xs leading-relaxed text-zinc-500">
                Webhooks let you receive real-time notifications when events happen in Resurgo. Connect to Zapier, Make.com, or any HTTP endpoint.
              </p>
            </div>

            {!showWebhookForm ? (
              <button onClick={() => setShowWebhookForm(true)}
                className="flex w-full items-center justify-center gap-2 border border-dashed border-zinc-800 bg-zinc-950 py-4 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-orange-800 hover:text-orange-600">
                <Plus className="h-3 w-3" /> [ADD_WEBHOOK]
              </button>
            ) : (
              <div className="border border-zinc-900 bg-zinc-950">
                <div className="border-b border-zinc-900 px-4 py-2.5">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">NEW_WEBHOOK</span>
                </div>
                <form onSubmit={handleCreateWebhook} className="p-4 space-y-3">
                  <input value={webhookName} onChange={(e) => setWebhookName(e.target.value)} placeholder="Name (optional, e.g. Zapier Integration)"
                    className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                  <input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="Endpoint URL (https://...)" required
                    className="h-9 w-full border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                  <div>
                    <p className="mb-2 font-mono text-xs tracking-widest text-zinc-400">SELECT_EVENTS ({selectedEvents.length} selected)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUPPORTED_EVENTS.map((evt) => (
                        <button key={evt} type="button" onClick={() => toggleEvent(evt)}
                          className={cn('border px-2.5 py-1 font-mono text-xs tracking-widest transition',
                            selectedEvents.includes(evt) ? 'border-orange-800 bg-orange-950/30 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          )}>
                          {evt}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={savingWh || selectedEvents.length === 0}
                      className="border border-orange-800 bg-orange-950/30 px-6 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
                      [CREATE_WEBHOOK]
                    </button>
                    <button type="button" onClick={() => setShowWebhookForm(false)}
                      className="border border-zinc-800 px-4 py-2 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-zinc-700">
                      [CANCEL]
                    </button>
                  </div>
                </form>
              </div>
            )}

            {webhooks && webhooks.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950 divide-y divide-zinc-900">
                {webhooks.map((wh: any) => (
                  <div key={wh._id} className="flex items-start gap-3 p-4">
                    <div className="flex-1 min-w-0">
                      {wh.name && <p className="font-mono text-xs font-bold text-zinc-300">{wh.name}</p>}
                      <p className="font-mono text-xs text-zinc-500 truncate">{wh.url}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {wh.events.map((evt: string) => (
                          <span key={evt} className="border border-zinc-800 px-1.5 font-mono text-xs text-zinc-400">{evt}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => toggleWebhook({ id: wh._id })}
                        className={cn('border px-2.5 py-1 font-mono text-xs tracking-widest transition',
                          wh.active ? 'border-green-900 text-green-600 hover:bg-green-950/20' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        )}>
                        {wh.active ? 'ACTIVE' : 'PAUSED'}
                      </button>
                      <button onClick={() => deleteWebhook({ id: wh._id })} className="p-1 text-zinc-400 hover:text-red-500 transition">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {webhooks?.length === 0 && !showWebhookForm && (
              <div className="border border-zinc-900 bg-zinc-950 py-10 text-center">
                <Webhook className="mx-auto mb-3 h-6 w-6 text-zinc-400" />
                <p className="font-mono text-xs tracking-widest text-zinc-400">NO_WEBHOOKS_CONFIGURED</p>
              </div>
            )}
          </div>
        )}

        {tab === 'api' && (
          <div className="space-y-4">
            <div className="border border-zinc-900 bg-zinc-950 p-4">
              <p className="font-mono text-xs leading-relaxed text-zinc-500">
                API keys let you access Resurgo data programmatically. Use <span className="text-zinc-300">Authorization: Bearer YOUR_KEY</span> in all requests.
                Keys begin with <span className="text-orange-400">rsg_</span> and are only shown once on creation.
              </p>
            </div>

            {/* New key display */}
            {newKey && (
              <div className="border border-green-900 bg-green-950/10 p-4">
                <p className="mb-2 font-mono text-xs tracking-widest text-green-500">KEY_GENERATED — COPY_NOW_NOT_SHOWN_AGAIN</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 font-mono text-xs text-zinc-300 break-all">{newKey}</code>
                  <button onClick={copyKey} className="shrink-0 border border-green-900 p-1.5 text-green-600 transition hover:bg-green-950/20">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <button onClick={() => setNewKey(null)} className="mt-2 font-mono text-xs text-zinc-400 transition hover:text-zinc-400">[DISMISS]</button>
              </div>
            )}

            {/* Generate key form */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">GENERATE_NEW_KEY</span>
              </div>
              <form onSubmit={handleGenerateKey} className="flex gap-3 p-4">
                <input value={keyName} onChange={(e) => setKeyName(e.target.value)} placeholder="Key name (e.g. My App, Zapier)" required
                  className="h-9 flex-1 border border-zinc-800 bg-black px-3 font-mono text-sm text-zinc-200 placeholder:text-zinc-400 focus:border-orange-800 focus:outline-none" />
                <button type="submit" disabled={generatingKey || !keyName}
                  className="flex items-center gap-1.5 border border-orange-800 bg-orange-950/30 px-5 py-2 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40">
                  <Zap className="h-3 w-3" />
                  {generatingKey ? 'GENERATING_' : '[GENERATE]'}
                </button>
              </form>
            </div>

            {/* Existing keys */}
            {apiKeys && apiKeys.length > 0 && (
              <div className="border border-zinc-900 bg-zinc-950 divide-y divide-zinc-900">
                {apiKeys.map((key: any) => (
                  <div key={key._id} className="flex items-center gap-3 p-4">
                    <Key className="h-4 w-4 shrink-0 text-zinc-400" />
                    <div className="flex-1">
                      <p className="font-mono text-xs text-zinc-300">{key.name}</p>
                      <p className="font-mono text-xs text-zinc-400">{key.keyPrefix}••••••••••••••••••••••••</p>
                      {key.lastUsedAt && (
                        <p className="font-mono text-xs text-zinc-400">Last used: {new Date(key.lastUsedAt).toLocaleDateString()}</p>
                      )}
                    </div>
                    <button onClick={() => revokeKey({ id: key._id })}
                      className="border border-red-900 px-2.5 py-1 font-mono text-xs text-red-600 transition hover:bg-red-950/20">
                      [REVOKE]
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* API Reference */}
            <div className="border border-zinc-900 bg-zinc-950">
              <div className="border-b border-zinc-900 px-4 py-2.5">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-300">API_REFERENCE</span>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { method: 'GET', endpoint: '/api/v1/goals', desc: 'List active goals' },
                  { method: 'POST', endpoint: '/api/v1/goals', desc: 'Create a goal' },
                  { method: 'GET', endpoint: '/api/v1/habits', desc: 'List habits' },
                  { method: 'POST', endpoint: '/api/v1/habits/log', desc: 'Log habit completion' },
                  { method: 'GET', endpoint: '/api/v1/tasks', desc: 'List tasks' },
                  { method: 'POST', endpoint: '/api/v1/tasks', desc: 'Create a task' },
                  { method: 'GET', endpoint: '/api/v1/stats', desc: 'User stats (XP, streaks)' },
                ].map(({ method, endpoint, desc }) => (
                  <div key={endpoint} className="flex items-center gap-3">
                    <span className={cn('w-10 text-center border font-mono text-xs py-0.5 shrink-0',
                      method === 'GET' ? 'border-green-900 text-green-600' : 'border-blue-900 text-blue-600'
                    )}>{method}</span>
                    <code className="font-mono text-xs text-zinc-400">{endpoint}</code>
                    <span className="font-mono text-xs text-zinc-400">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
