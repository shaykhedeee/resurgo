'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Quick Note Widget (Dashboard)
// Scratch-pad note that saves to Convex scratchNotes table
// ═══════════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import Link from 'next/link';



export default function QuickNoteWidget() {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveNote = useMutation(api.scratchNotes.save);
  const latest = useQuery(api.scratchNotes.getLatest);

  async function handleSave() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSaving(true);
    setSaved(false);
    try {
      await saveNote({ text: trimmed, source: 'dashboard_widget' });
      setText('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <div className="border border-zinc-900 bg-black h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-900 px-3 py-1.5 flex items-center justify-between">
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">SCRATCH_NOTE</span>
        <Link
          href="/brain-dump"
          className="font-pixel text-[0.4rem] tracking-widest text-zinc-700 hover:text-orange-500 transition-colors"
        >
          BRAIN_DUMP →
        </Link>
      </div>

      {/* Last saved */}
      {latest && (
        <div className="px-3 pt-2">
          <p className="font-pixel text-[0.35rem] tracking-widest text-zinc-700 mb-0.5">LAST_SAVED:</p>
          <p className="font-terminal text-xs text-zinc-600 truncate">{latest.text}</p>
        </div>
      )}

      {/* Textarea */}
      <div className="flex-1 px-3 pt-2 pb-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="// brain dump here... (Ctrl+Enter to save)"
          rows={4}
          className="w-full h-full bg-transparent font-terminal text-sm text-zinc-300 placeholder:text-zinc-700 outline-none resize-none border-b border-zinc-900 pb-2"
        />
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex items-center justify-between">
        <span className="font-pixel text-[0.35rem] tracking-widest text-zinc-700">
          {saved ? '✓ SAVED' : text.length > 0 ? `${text.length} CHARS` : ''}
        </span>
        <button
          onClick={handleSave}
          disabled={saving || !text.trim()}
          className="font-pixel text-[0.45rem] tracking-widest px-2 py-1 border border-zinc-800 text-zinc-400 hover:border-orange-700 hover:text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? 'SAVING_' : saved ? 'SAVED ✓' : '[ SAVE_NOTE ]'}
        </button>
      </div>
    </div>
  );
}
