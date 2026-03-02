// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Voice Input Hook
// Web Speech API integration for voice-to-text
// ═══════════════════════════════════════════════════════════════════════════════

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface VoiceInputOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

interface VoiceInputState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onresult: ((ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((ev: SpeechRecognitionErrorEvent) => void) | null;
};

export function useVoiceInput(options: VoiceInputOptions = {}): VoiceInputState & {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
} {
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
    onStart,
    onEnd,
  } = options;

  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    interimTranscript: '',
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Check for browser support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = continuous;
        recognitionRef.current.interimResults = interimResults;
        recognitionRef.current.lang = language;

        recognitionRef.current.onstart = () => {
          setState(prev => ({ ...prev, isListening: true, error: null }));
          onStart?.();
        };

        recognitionRef.current.onend = () => {
          setState(prev => ({ ...prev, isListening: false }));
          onEnd?.();
        };

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              finalTranscript += result[0].transcript;
            } else {
              interimTranscript += result[0].transcript;
            }
          }

          setState(prev => ({
            ...prev,
            transcript: prev.transcript + finalTranscript,
            interimTranscript,
          }));

          if (finalTranscript) {
            onResult?.(finalTranscript, true);
          } else if (interimTranscript) {
            onResult?.(interimTranscript, false);
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          let errorMessage = 'An error occurred';
          
          switch (event.error) {
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone access.';
              break;
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.';
              break;
            case 'network':
              errorMessage = 'Network error. Please check your connection.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone found. Please connect a microphone.';
              break;
            case 'aborted':
              errorMessage = 'Speech recognition was aborted.';
              break;
            default:
              errorMessage = `Speech recognition error: ${event.error}`;
          }

          setState(prev => ({ ...prev, error: errorMessage, isListening: false }));
          onError?.(errorMessage);
        };

        setState(prev => ({ ...prev, isSupported: true }));
      } else {
        setState(prev => ({ 
          ...prev, 
          isSupported: false,
          error: 'Speech recognition is not supported in this browser.'
        }));
      }
    }
  }, [continuous, interimResults, language, onStart, onEnd, onResult, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      try {
        // Reset transcript on new session
        setState(prev => ({ ...prev, transcript: '', interimTranscript: '', error: null }));
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to start listening. Please try again.' 
        }));
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && state.isListening) {
      recognitionRef.current.stop();
    }
  }, [state.isListening]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({ ...prev, transcript: '', interimTranscript: '' }));
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}

export default useVoiceInput;
