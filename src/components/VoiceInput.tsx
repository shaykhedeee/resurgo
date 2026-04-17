'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Voice Input Overlay
// Terminal-themed speech-to-text overlay using the Web Speech API.
// Captures speech, shows a live waveform, and returns transcribed text.
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Copy, CheckCircle2, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceInputProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user confirms the transcript */
  onTranscript?: (text: string) => void;
}

// ── Waveform bar animation ───────────────────────────────────────────────────
function WaveformBar({ index, active }: { index: number; active: boolean }) {
  return (
    <motion.div
      className={cn(
        'w-[3px] rounded-full',
        active ? 'bg-orange-500' : 'bg-zinc-700',
      )}
      animate={
        active
          ? {
              height: [8, 20 + Math.random() * 16, 8],
            }
          : { height: 8 }
      }
      transition={
        active
          ? {
              duration: 0.4 + Math.random() * 0.3,
              repeat: Infinity,
              repeatType: 'mirror' as const,
              delay: index * 0.05,
            }
          : { duration: 0.3 }
      }
    />
  );
}

// ── Check browser support ────────────────────────────────────────────────────
function getSpeechRecognition(): typeof SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return SR ?? null;
}

// ═════════════════════════════════════════════════════════════════════════════
// VoiceInput
// ═════════════════════════════════════════════════════════════════════════════
export default function VoiceInput({ isOpen, onClose, onTranscript }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check support on mount
  useEffect(() => {
    setSupported(!!getSpeechRecognition());
  }, []);

  // Cleanup recognition on unmount / close
  useEffect(() => {
    if (!isOpen) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setListening(false);
      setInterim('');
    }
  }, [isOpen]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setInterim('');
      setError(null);
      setCopied(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const startListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + ' ';
        } else {
          interimText += result[0].transcript;
        }
      }
      if (finalText) setTranscript((prev) => prev + finalText);
      setInterim(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else if (event.error !== 'aborted') {
        setError(`Speech error: ${event.error}`);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
    setInterim('');
  }, []);

  const handleCopy = useCallback(async () => {
    if (!transcript.trim()) return;
    await navigator.clipboard.writeText(transcript.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [transcript]);

  const handleUse = useCallback(() => {
    const text = transcript.trim();
    if (!text) return;
    onTranscript?.(text);
    onClose();
  }, [transcript, onTranscript, onClose]);

  const BARS = 24;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-lg -translate-y-1/2 border border-zinc-800 bg-zinc-950/95 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-lg sm:inset-x-auto"
          >
            {/* Scanlines */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
              }}
            />

            {/* Header */}
            <div className="relative z-20 flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-pixel text-[0.38rem] tracking-[0.2em] text-orange-500">
                  VOICE_INPUT
                </span>
                {listening && (
                  <span className="flex items-center gap-1 border border-red-900/50 bg-red-950/30 px-1.5 py-0.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                    <span className="font-pixel text-[0.25rem] tracking-widest text-red-400">REC</span>
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 text-zinc-600 transition-colors hover:text-zinc-300"
                aria-label="Close voice input"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="relative z-20 p-5">
              {!supported ? (
                <div className="py-8 text-center">
                  <MicOff className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="mt-3 font-terminal text-sm text-zinc-400">
                    Speech recognition not supported in this browser.
                  </p>
                  <p className="mt-1 font-terminal text-xs text-zinc-600">
                    Try Chrome, Edge, or Safari on macOS.
                  </p>
                </div>
              ) : (
                <>
                  {/* Waveform visualization */}
                  <div className="flex items-center justify-center gap-[3px] py-6">
                    {Array.from({ length: BARS }).map((_, i) => (
                      <WaveformBar key={i} index={i} active={listening} />
                    ))}
                  </div>

                  {/* Mic button */}
                  <div className="flex justify-center">
                    <button
                      onClick={listening ? stopListening : startListening}
                      className={cn(
                        'flex h-16 w-16 items-center justify-center border-2 transition-all duration-200',
                        listening
                          ? 'border-red-600 bg-red-600/20 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:bg-red-600/30'
                          : 'border-orange-600 bg-orange-600/20 text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.2)] hover:bg-orange-600/30',
                      )}
                      aria-label={listening ? 'Stop recording' : 'Start recording'}
                    >
                      {listening ? (
                        <MicOff className="h-6 w-6" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                    </button>
                  </div>

                  <p className="mt-3 text-center font-terminal text-xs text-zinc-600">
                    {listening
                      ? 'Listening... tap to stop'
                      : 'Tap the mic to start speaking'}
                  </p>

                  {/* Error */}
                  {error && (
                    <div className="mt-4 border border-red-900/50 bg-red-950/20 px-3 py-2">
                      <p className="font-terminal text-xs text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Transcript area */}
                  {(transcript || interim) && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-pixel text-[0.3rem] tracking-widest text-zinc-600">
                          TRANSCRIPT
                        </span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 px-2 py-1 font-terminal text-[0.6rem] text-zinc-500 transition-colors hover:text-zinc-300"
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        ref={textareaRef}
                        value={transcript + interim}
                        onChange={(e) => setTranscript(e.target.value)}
                        className="h-28 w-full resize-none border border-zinc-800 bg-black/60 p-3 font-terminal text-sm text-zinc-300 placeholder:text-zinc-700 focus:border-orange-700 focus:outline-none"
                        placeholder="Your speech will appear here..."
                      />
                      {interim && (
                        <p className="mt-1 font-terminal text-[0.6rem] text-zinc-600">
                          <span className="text-orange-600">●</span> Still listening...
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer actions */}
            {transcript.trim() && (
              <div className="relative z-20 flex items-center justify-end gap-2 border-t border-zinc-800 px-4 py-3">
                <button
                  onClick={() => { setTranscript(''); setInterim(''); }}
                  className="border border-zinc-800 px-3 py-1.5 font-terminal text-xs text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-300"
                >
                  Clear
                </button>
                <button
                  onClick={handleUse}
                  className="border border-orange-700 bg-orange-600 px-4 py-1.5 font-terminal text-xs text-black transition-colors hover:bg-orange-500"
                >
                  Use Transcript →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
