// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — Desktop AI Settings Panel
// Displayed inside the Settings modal under the "AI" tab.
//
// Allows the user to:
//   1. Choose a brain routing policy (Cloud / Local / BYOK / Hybrid)
//   2. Enter BYOK API keys for any cloud provider (stored in OS keychain)
//   3. Configure local agent endpoints (Ollama / LM Studio / custom)
//   4. See real-time status of all configured providers
// ═══════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback } from 'react';
import {
  Cpu,
  Cloud,
  Shuffle,
  Key,
  Server,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDesktopRuntime } from '@/hooks/useDesktopRuntime';
import type { BrainPolicy, CredentialKey, BYOKProvider, LocalAgentProvider } from '@/lib/desktop';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PolicyOption {
  id: BrainPolicy;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const POLICY_OPTIONS: PolicyOption[] = [
  {
    id: 'hybrid',
    label: 'Hybrid',
    desc: 'Local → BYOK → Cloud. Best privacy + reliability.',
    icon: <Shuffle className="w-4 h-4" />,
    color: 'border-orange-700 text-orange-400 bg-orange-950/20',
  },
  {
    id: 'local',
    label: 'Local Only',
    desc: '100% private. Requires Ollama or LM Studio running locally.',
    icon: <Cpu className="w-4 h-4" />,
    color: 'border-green-700 text-green-400 bg-green-950/20',
  },
  {
    id: 'byok',
    label: 'BYOK Only',
    desc: 'Your own API keys, direct to cloud providers. No Resurgo server.',
    icon: <Key className="w-4 h-4" />,
    color: 'border-blue-700 text-blue-400 bg-blue-950/20',
  },
  {
    id: 'cloud',
    label: 'Cloud (Default)',
    desc: 'Resurgo managed providers. Requires internet + sign-in.',
    icon: <Cloud className="w-4 h-4" />,
    color: 'border-zinc-600 text-zinc-400 bg-zinc-900/40',
  },
];

// ── BYOK provider metadata ────────────────────────────────────────────────────

const BYOK_PROVIDERS: Array<{
  id: BYOKProvider;
  label: string;
  placeholder: string;
  docsUrl: string;
  free: boolean;
}> = [
  { id: 'groq',       label: 'Groq',       placeholder: 'gsk_...',   docsUrl: 'https://console.groq.com/keys',             free: true  },
  { id: 'gemini',     label: 'Gemini',     placeholder: 'AIza...',   docsUrl: 'https://aistudio.google.com/app/apikey',    free: true  },
  { id: 'openrouter', label: 'OpenRouter', placeholder: 'sk-or-...', docsUrl: 'https://openrouter.ai/keys',               free: true  },
  { id: 'cerebras',   label: 'Cerebras',   placeholder: 'csk-...',   docsUrl: 'https://cloud.cerebras.ai',                free: true  },
  { id: 'together',   label: 'Together',   placeholder: 'tok-...',   docsUrl: 'https://api.together.xyz/settings/api-keys', free: true  },
  { id: 'aiml',       label: 'AIML API',   placeholder: 'aiml-...',  docsUrl: 'https://aimlapi.com',                      free: true  },
  { id: 'openai',     label: 'OpenAI',     placeholder: 'sk-...',    docsUrl: 'https://platform.openai.com/api-keys',     free: false },
];

// ── Local agent metadata ──────────────────────────────────────────────────────

const LOCAL_AGENTS: Array<{
  id: LocalAgentProvider;
  label: string;
  defaultUrl: string;
  docsUrl: string;
}> = [
  { id: 'ollama_url',   label: 'Ollama',    defaultUrl: 'http://localhost:11434', docsUrl: 'https://ollama.ai' },
  { id: 'lmstudio_url', label: 'LM Studio', defaultUrl: 'http://localhost:1234',  docsUrl: 'https://lmstudio.ai' },
  { id: 'custom_url',   label: 'Custom',    defaultUrl: 'http://localhost:8080',  docsUrl: 'https://github.com/ggerganov/llama.cpp' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusDot({ reachable, checking }: { reachable: boolean; checking?: boolean }) {
  if (checking) return <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />;
  return reachable
    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
    : <XCircle className="w-3.5 h-3.5 text-zinc-600" />;
}

interface KeyInputProps {
  id: CredentialKey;
  label: string;
  placeholder: string;
  docsUrl: string;
  isConfigured: boolean;
  onSave: (key: CredentialKey, value: string) => Promise<void>;
  onDelete: (key: CredentialKey) => Promise<void>;
  tag?: string;
}

function KeyInput({ id, label, placeholder, docsUrl, isConfigured, onSave, onDelete, tag }: KeyInputProps) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSave = async () => {
    if (!value.trim()) return;
    setSaving(true);
    try {
      await onSave(id, value.trim());
      setValue('');
      setExpanded(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(id);
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-900 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <StatusDot reachable={isConfigured} />
        <span className="flex-1 font-mono text-sm text-zinc-200">{label}</span>
        {tag && (
          <span className="border border-green-900 px-1.5 py-0.5 font-mono text-[0.5rem] tracking-widest text-green-600">
            {tag}
          </span>
        )}
        {isConfigured && (
          <span className="font-mono text-[0.55rem] tracking-widest text-zinc-500">CONFIGURED</span>
        )}
        {expanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-600" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />}
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-3 space-y-2">
          <p className="font-mono text-[0.6rem] text-zinc-500">
            Get your key at{' '}
            <a href={docsUrl} target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">
              {docsUrl.replace('https://', '')}
            </a>
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={isConfigured ? '••••••••••••••••••••' : placeholder}
                className="h-9 w-full border border-zinc-700 bg-black px-3 pr-10 font-mono text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-orange-700 focus:outline-none"
                onKeyDown={(e) => { if (e.key === 'Enter') void handleSave(); }}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
              >
                {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              onClick={() => void handleSave()}
              disabled={saving || !value.trim()}
              className="border border-orange-800 bg-orange-950/30 px-4 font-mono text-xs tracking-widest text-orange-500 transition hover:bg-orange-950/60 disabled:opacity-40"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'SAVE'}
            </button>
            {isConfigured && (
              <button
                onClick={() => void handleDelete()}
                className="border border-red-900 px-2.5 text-red-600 transition hover:bg-red-950/20"
                title="Remove key"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="font-mono text-[0.55rem] text-zinc-700">
            Key stored in OS keychain — never sent to Resurgo servers.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface DesktopAISettingsProps {
  /** Pass the runtime if already loaded in a parent; otherwise will load its own */
  runtimeOverride?: Partial<ReturnType<typeof useDesktopRuntime>>;
}

export function DesktopAISettings({ runtimeOverride }: DesktopAISettingsProps) {
  // Always call the hook unconditionally (Rules of Hooks)
  const ownRuntime = useDesktopRuntime();
  // Allow caller to override individual values (e.g. in tests or parent-managed state)
  const runtime = runtimeOverride ? { ...ownRuntime, ...runtimeOverride } : ownRuntime;

  const { policy, setPolicy, checking, localAgent, byokProviders, saveKey, deleteKey, refresh } = runtime;

  const [localUrlValues, setLocalUrlValues] = useState<Partial<Record<LocalAgentProvider, string>>>({});

  const handleSaveLocalUrl = useCallback(async (agentId: LocalAgentProvider) => {
    const val = localUrlValues[agentId];
    if (!val?.trim()) return;
    await saveKey(agentId as CredentialKey, val.trim());
    setLocalUrlValues((prev) => ({ ...prev, [agentId]: '' }));
  }, [localUrlValues, saveKey]);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <p className="font-mono text-[0.45rem] tracking-widest text-orange-500 mb-1">AI_BRAIN :: ROUTING_POLICY</p>
        <h3 className="font-mono text-sm font-bold text-zinc-100">AI Brain Routing</h3>
        <p className="font-mono text-xs text-zinc-500 mt-1 leading-relaxed">
          Control how Resurgo&apos;s AI brain routes inference. Use local models, your own keys, or the managed cloud.
        </p>
      </div>

      {/* ── Policy selector ── */}
      <div className="grid grid-cols-2 gap-2">
        {POLICY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setPolicy(opt.id)}
            className={cn(
              'border p-3 text-left transition-all',
              policy === opt.id ? opt.color : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'
            )}
          >
            <div className="flex items-center gap-1.5 mb-1">
              {opt.icon}
              <span className="font-mono text-xs font-bold">{opt.label}</span>
              {policy === opt.id && (
                <span className="ml-auto font-mono text-[0.45rem] tracking-widest text-orange-500">ACTIVE</span>
              )}
            </div>
            <p className="font-mono text-[0.6rem] leading-relaxed opacity-70">{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* ── Local agent status ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-zinc-500" />
            <p className="font-mono text-[0.45rem] tracking-widest text-zinc-500">LOCAL_AGENTS</p>
          </div>
          <button
            onClick={() => void refresh()}
            disabled={checking}
            className="font-mono text-[0.5rem] tracking-widest text-zinc-600 hover:text-orange-400 transition-colors disabled:opacity-40"
          >
            {checking ? 'CHECKING_' : '[REFRESH]'}
          </button>
        </div>

        {localAgent ? (
          <div className="border border-green-900 bg-green-950/10 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              <span className="font-mono text-xs text-green-400">
                {localAgent.provider.replace('_url', '')} reachable at {localAgent.baseUrl}
              </span>
              {localAgent.latencyMs && (
                <span className="font-mono text-[0.5rem] text-zinc-600 ml-auto">
                  {localAgent.latencyMs}ms
                </span>
              )}
            </div>
            {localAgent.models.length > 0 && (
              <p className="font-mono text-[0.55rem] text-zinc-500">
                Models: {localAgent.models.slice(0, 5).join(', ')}
                {localAgent.models.length > 5 && ` +${localAgent.models.length - 5} more`}
              </p>
            )}
          </div>
        ) : (
          <div className="border border-zinc-800 bg-zinc-950 px-4 py-3">
            <p className="font-mono text-[0.6rem] text-zinc-600">
              No local agent detected. Install{' '}
              <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">Ollama</a>
              {' '}or{' '}
              <a href="https://lmstudio.ai" target="_blank" rel="noopener noreferrer" className="text-orange-400 underline">LM Studio</a>
              {' '}and pull a model to enable offline AI.
            </p>
          </div>
        )}

        <div className="mt-2 space-y-2">
          {LOCAL_AGENTS.map((agent) => (
            <div key={agent.id} className="border border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-3 px-4 py-2.5">
                <StatusDot reachable={localAgent?.provider === agent.id} checking={checking} />
                <span className="flex-1 font-mono text-xs text-zinc-400">{agent.label}</span>
                <span className="font-mono text-[0.5rem] text-zinc-600">{agent.defaultUrl}</span>
              </div>
              <div className="border-t border-zinc-800 flex gap-2 px-4 py-2">
                <input
                  type="text"
                  value={localUrlValues[agent.id] ?? ''}
                  onChange={(e) =>
                    setLocalUrlValues((prev) => ({ ...prev, [agent.id]: e.target.value }))
                  }
                  placeholder={`Override URL (default: ${agent.defaultUrl})`}
                  className="h-8 flex-1 border border-zinc-700 bg-black px-3 font-mono text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-orange-700 focus:outline-none"
                />
                <button
                  onClick={() => void handleSaveLocalUrl(agent.id)}
                  disabled={!localUrlValues[agent.id]?.trim()}
                  className="border border-zinc-700 px-3 font-mono text-[0.5rem] tracking-widest text-zinc-400 transition hover:border-orange-700 hover:text-orange-400 disabled:opacity-40"
                >
                  SAVE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BYOK keys ── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-3.5 h-3.5 text-zinc-500" />
          <p className="font-mono text-[0.45rem] tracking-widest text-zinc-500">BYOK :: BRING_YOUR_OWN_KEYS</p>
        </div>
        <p className="font-mono text-[0.6rem] text-zinc-600 mb-3 leading-relaxed">
          Add your own AI provider keys. Keys are stored in your OS keychain and never sent to Resurgo&apos;s servers.
          Free-tier keys from Groq, Gemini, and Cerebras give thousands of requests/day at no cost.
        </p>
        <div className="space-y-px">
          {BYOK_PROVIDERS.map((p) => (
            <KeyInput
              key={p.id}
              id={p.id}
              label={p.label}
              placeholder={p.placeholder}
              docsUrl={p.docsUrl}
              isConfigured={byokProviders.includes(p.id)}
              onSave={saveKey}
              onDelete={deleteKey}
              tag={p.free ? 'FREE' : undefined}
            />
          ))}
        </div>
      </div>

      {/* ── Status summary ── */}
      <div className="border border-zinc-800 bg-zinc-900/50 px-4 py-3">
        <p className="font-mono text-[0.45rem] tracking-widest text-zinc-500 mb-2">STATUS_SUMMARY</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-mono text-lg font-bold text-zinc-200">
              {localAgent ? 1 : 0}
            </p>
            <p className="font-mono text-[0.5rem] text-zinc-600">LOCAL AGENTS</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold text-zinc-200">{byokProviders.length}</p>
            <p className="font-mono text-[0.5rem] text-zinc-600">BYOK KEYS</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold text-orange-400 capitalize">{policy}</p>
            <p className="font-mono text-[0.5rem] text-zinc-600">POLICY</p>
          </div>
        </div>
      </div>
    </div>
  );
}
