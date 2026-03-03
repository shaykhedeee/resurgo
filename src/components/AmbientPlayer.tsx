'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

const SOUNDS = [
  { id: 'rain',      label: 'Rain',       emoji: '🌧️',  freq: 200, type: 'noise' as const },
  { id: 'forest',    label: 'Forest',     emoji: '🌲',  freq: 400, type: 'nature' as const },
  { id: 'ocean',     label: 'Ocean',      emoji: '🌊',  freq: 100, type: 'noise' as const },
  { id: 'fire',      label: 'Campfire',   emoji: '🔥',  freq: 150, type: 'noise' as const },
  { id: 'white',     label: 'White Noise',emoji: '⚪',  freq: 440, type: 'noise' as const },
  { id: 'keyboard',  label: 'Typing',     emoji: '⌨️',  freq: 800, type: 'noise' as const },
];

function createAmbientNode(ctx: AudioContext, soundId: string): AudioNode {
  const bufferSize = 4096;
  const node = ctx.createScriptProcessor(bufferSize, 1, 1);

  const freq = SOUNDS.find((s) => s.id === soundId)?.freq ?? 200;
  let lastOut = 0;

  node.onaudioprocess = (e) => {
    const output = e.outputBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Brown noise for rain/ocean, white noise with filtering for others
      const white = (Math.random() * 2 - 1) * 0.3;
      if (soundId === 'rain' || soundId === 'ocean') {
        lastOut = (lastOut + 0.02 * white) / 1.02;
        output[i] = lastOut * 3.5;
      } else if (soundId === 'forest') {
        output[i] = Math.sin(freq * i / ctx.sampleRate) * 0.05 + white * 0.15;
      } else {
        output[i] = white;
      }
    }
  };

  return node;
}

interface AmbientPlayerProps {
  minimal?: boolean;
}

export default function AmbientPlayer({ minimal = false }: AmbientPlayerProps) {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isOpen, setIsOpen] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);

  const stopSound = () => {
    if (sourceNodeRef.current) {
      try {
        (sourceNodeRef.current as any).disconnect();
      } catch (_) {}
      sourceNodeRef.current = null;
    }
    setActiveSound(null);
  };

  const playSound = (soundId: string) => {
    if (activeSound === soundId) {
      stopSound();
      return;
    }

    stopSound();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(ctx.destination);
    gainNodeRef.current = gainNode;

    const sourceNode = createAmbientNode(ctx, soundId);
    sourceNode.connect(gainNode);
    sourceNodeRef.current = sourceNode;

    setActiveSound(soundId);
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopSound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  if (minimal) {
    return (
      <div className="flex items-center gap-1.5">
        <Music className="h-3.5 w-3.5 text-zinc-400" />
        <div className="flex gap-1">
          {SOUNDS.slice(0, 4).map(({ id, emoji }) => (
            <button key={id} onClick={() => playSound(id)}
              className={cn('border px-1.5 py-1 text-xs transition',
                activeSound === id ? 'border-orange-800 bg-orange-950/30' : 'border-zinc-800 hover:border-zinc-700'
              )}>
              {emoji}
            </button>
          ))}
        </div>
        {activeSound && (
          <button onClick={stopSound} className="border border-zinc-800 px-1.5 py-1 font-mono text-xs text-zinc-400 hover:border-zinc-700">■</button>
        )}
      </div>
    );
  }

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 transition hover:bg-zinc-900">
        <div className="flex items-center gap-2">
          <Music className="h-4 w-4 text-zinc-500" />
          <span className="font-mono text-xs tracking-widest text-zinc-400">AMBIENT_SOUNDS</span>
          {activeSound && (
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              <span className="font-mono text-xs text-green-500">
                {SOUNDS.find((s) => s.id === activeSound)?.label.toUpperCase()}
              </span>
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-zinc-400">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="border-t border-zinc-900 p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {SOUNDS.map(({ id, label, emoji }) => (
              <button key={id} onClick={() => playSound(id)}
                className={cn('flex flex-col items-center gap-1 border py-3 transition',
                  activeSound === id ? 'border-orange-800 bg-orange-950/20 text-orange-500' : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-400'
                )}>
                <span className="text-xl">{emoji}</span>
                <span className="font-mono text-xs tracking-widest">{label.toUpperCase()}</span>
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <VolumeX className="h-3 w-3 shrink-0 text-zinc-400" />
            <input type="range" min="0" max="1" step="0.05" value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 accent-orange-600" />
            <Volume2 className="h-3 w-3 shrink-0 text-zinc-400" />
          </div>

          {activeSound && (
            <button onClick={stopSound}
              className="flex w-full items-center justify-center gap-1.5 border border-zinc-800 py-1.5 font-mono text-xs tracking-widest text-zinc-400 transition hover:border-zinc-700">
              <Square className="h-3 w-3" /> [STOP_SOUND]
            </button>
          )}
        </div>
      )}
    </div>
  );
}
