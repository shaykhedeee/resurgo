'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Image from 'next/image';
import Link from 'next/link';
import { usePlanGating } from '@/hooks/usePlanGating';
import { CheckCircle, RefreshCw, Sparkles, ChevronLeft, ChevronRight, Crown, Upload, Wand2 } from 'lucide-react';

// -----------------------------------------------------------------------------
// Types (mirrors VisionBoardConfig)
// -----------------------------------------------------------------------------

interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imageData: string | null;
  imagePrompt: string;
  imageKeywords?: string[];
  affirmation: string;
  category: string;
  progress: number;
  position: number;
  emotionalAnchor?: string;
  milestoneHint?: string;
}

interface VisionBoardTheme {
  colorPalette: string[];
  mood: string;
  fontStyle: string;
  layoutStyle: 'grid' | 'collage' | 'minimal' | 'mosaic';
}

interface VisionBoardConfig {
  title: string;
  theme: VisionBoardTheme;
  panels: VisionBoardPanel[];
  centerAffirmation: string;
  generatedAt: string;
  generationMethod?: 'pipeline' | 'direct';
}

type GrowthEventName =
  | 'vision_board_viewed'
  | 'vision_board_generate_clicked'
  | 'vision_board_generation_success'
  | 'vision_board_generation_failed'
  | 'vision_board_pro_gate_hit'
  | 'upgrade_clicked';

async function sendGrowthEvent(eventName: GrowthEventName, details?: Record<string, unknown>) {
  try {
    await fetch('/api/analytics/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        page: '/vision-board',
        details,
      }),
      keepalive: true,
    });
  } catch {
    // Best effort telemetry only
  }
}

const CATEGORY_ICONS: Record<string, string> = {
  HEALTH: '??',
  CAREER: '??',
  PERSONAL: '??',
  FINANCE: '??',
  LEARNING: '??',
  RELATIONSHIP: '??',
};

// -----------------------------------------------------------------------------
// VisionBoard Component
// -----------------------------------------------------------------------------

interface VisionBoardProps {
  canRegenerate?: boolean; // Pro users can regenerate indefinitely
}

export function VisionBoard({ canRegenerate = false }: VisionBoardProps) {
  const { isPro, plan } = usePlanGating();
  const proUnlocked = isPro();
  const hasTrackedView = useRef(false);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePanelIndex, setActivePanelIndex] = useState<number | null>(null);
  const [generationMode, setGenerationMode] = useState<'ai' | 'hybrid'>('ai');
  const [stylePreset, setStylePreset] = useState<'pinterest-bold' | 'clean-minimal' | 'luxury-editorial' | 'cinematic-dream'>('pinterest-bold');
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const boardDoc = useQuery(api.visionBoards.getActive, {});
  const board: VisionBoardConfig | null = boardDoc ? JSON.parse(boardDoc.config as string) : null;

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    void sendGrowthEvent('vision_board_viewed', { plan });
  }, [plan]);

  const handleGenerate = useCallback(async () => {
    if (!proUnlocked) {
      void sendGrowthEvent('vision_board_pro_gate_hit', {
        source: 'generate_button',
        plan,
      });
      setError('Vision Board is a Pro feature. Upgrade to unlock premium generation.');
      return;
    }

    void sendGrowthEvent('vision_board_generate_clicked', {
      mode: generationMode,
      stylePreset,
      customImagesCount: customImages.length,
    });

    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/vision-board/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: generationMode,
          stylePreset,
          customImages: generationMode === 'hybrid' ? customImages.slice(0, 6) : [],
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      void sendGrowthEvent('vision_board_generation_success', {
        mode: generationMode,
        stylePreset,
        customImagesCount: customImages.length,
      });
      // Board appears in real-time via Convex subscription (boardDoc will update)
    } catch (err) {
      void sendGrowthEvent('vision_board_generation_failed', {
        mode: generationMode,
        stylePreset,
        customImagesCount: customImages.length,
        message: err instanceof Error ? err.message : 'Generation failed',
      });
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }, [customImages, generationMode, plan, proUnlocked, stylePreset]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []).slice(0, 6);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const converted = await Promise.all(files.map(fileToDataUrl));
      setCustomImages((prev) => [...prev, ...converted].slice(0, 6));
    } catch {
      setError('Failed to process one or more uploaded images.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }, []);

  const removeCustomImage = useCallback((index: number) => {
    setCustomImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const activePanel = activePanelIndex !== null ? board?.panels[activePanelIndex] : null;
  const primaryColor = board?.theme.colorPalette[0] ?? '#6366f1';
  const secondaryColor = board?.theme.colorPalette[1] ?? '#8b5cf6';

  const layoutClass: Record<string, string> = {
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    collage: 'flex flex-wrap gap-3',
    minimal: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    mosaic: 'grid grid-cols-3 gap-2',
  };

  if (!proUnlocked) {
    return (
      <div className="border border-zinc-900 bg-zinc-950 p-6 rounded-xl">
        <div className="flex items-center justify-center mb-3">
          <div className="inline-flex items-center gap-2 border border-amber-800 bg-amber-950/20 px-3 py-1 rounded-full">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-xs tracking-widest font-mono text-amber-400">PRO_FEATURE</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-zinc-100 text-center">Premium Vision Board Studio</h2>
        <p className="text-zinc-400 text-sm text-center mt-2 max-w-xl mx-auto leading-relaxed">
          Turn goals into a Pinterest-style, AI-generated mood board with custom layouts, archetype-aware affirmations,
          and hybrid uploads. This feature is available on <span className="text-amber-400">Pro</span> and <span className="text-amber-400">Lifetime</span> plans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-xs text-zinc-300">
          {[
            'AI-generated panel images (multi-provider free AI cascade)',
            'Premium style presets (Pinterest bold, cinematic, editorial)',
            'Hybrid mode: upload your own images + AI composition',
            'Regeneration and design variations',
          ].map((feature) => (
            <div key={feature} className="border border-zinc-800 bg-black/40 p-3 rounded-lg">
              <span className="text-orange-400 mr-1.5">-</span>{feature}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/pricing"
            onClick={() => {
              void sendGrowthEvent('upgrade_clicked', {
                source: 'vision_board_paywall',
                plan,
              });
            }}
            className="inline-flex items-center gap-2 border border-amber-800 bg-amber-950/30 px-5 py-2.5 rounded-lg font-mono text-xs tracking-widest text-amber-400 hover:bg-amber-950/50 transition"
          >
            <Crown className="h-3.5 w-3.5" />
            [UPGRADE_TO_PRO]
          </Link>
          <span className="font-mono text-xs text-zinc-500">Current plan: {plan.toUpperCase()}</span>
        </div>
      </div>
    );
  }

  // -- Empty state -------------------------------------------------------------
  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] 
                      border border-dashed border-zinc-700 rounded-xl p-8 bg-zinc-900/40">
        <div className="text-5xl mb-4">??</div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Your Vision Board</h2>
        <p className="text-zinc-400 text-center mb-6 max-w-sm text-sm leading-relaxed">
          AI generates a personalized vision board from your goals, psychology
          profile, and personality type. Custom images. Personal affirmations.
          Real-time progress tracking.
        </p>

        <div className="w-full max-w-xl space-y-3 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGenerationMode('ai')}
              className={`border px-3 py-2 text-xs rounded-lg transition ${
                generationMode === 'ai'
                  ? 'border-orange-700 bg-orange-950/30 text-orange-400'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <Wand2 size={14} className="inline-block mr-1" /> AI Only
            </button>
            <button
              type="button"
              onClick={() => setGenerationMode('hybrid')}
              className={`border px-3 py-2 text-xs rounded-lg transition ${
                generationMode === 'hybrid'
                  ? 'border-orange-700 bg-orange-950/30 text-orange-400'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              <Upload size={14} className="inline-block mr-1" /> Hybrid Upload
            </button>
          </div>

          <select
            value={stylePreset}
            onChange={(e) => setStylePreset(e.target.value as typeof stylePreset)}
            className="w-full border border-zinc-700 bg-black px-3 py-2 text-xs text-zinc-300 rounded-lg"
          >
            <option value="pinterest-bold">Pinterest Bold (high contrast, dynamic)</option>
            <option value="clean-minimal">Clean Minimal (airy, calm, elegant)</option>
            <option value="luxury-editorial">Luxury Editorial (premium magazine look)</option>
            <option value="cinematic-dream">Cinematic Dream (moody, dramatic lighting)</option>
          </select>

          {generationMode === 'hybrid' && (
            <div className="border border-zinc-800 rounded-lg p-3 bg-black/40 space-y-2">
              <label className="inline-flex items-center gap-2 border border-zinc-700 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:border-zinc-600 cursor-pointer transition">
                <Upload size={14} />
                {uploading ? 'Processing images-' : 'Upload custom images (max 6)'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {customImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {customImages.map((src, i) => (
                    <div key={`${src}-${i}`} className="relative rounded-md overflow-hidden border border-zinc-700">
                      <Image src={src} alt={`upload-${i}`} width={96} height={64} className="w-full h-16 object-cover" unoptimized />
                      <button
                        type="button"
                        onClick={() => removeCustomImage(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-zinc-200 text-xs"
                        aria-label="Remove uploaded image"
                      >
                        -
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-black
                     transition-all disabled:opacity-60 disabled:cursor-wait"
          style={{ backgroundColor: primaryColor }}
        >
          {generating ? (
            <><RefreshCw size={16} className="animate-spin" /> Generating your board-</>
          ) : (
            <><Sparkles size={16} /> Generate My Vision Board</>
          )}
        </button>
        {generating && (
          <p className="text-zinc-500 text-xs mt-3 text-center">
            Creating personalised images- this takes 30-60 seconds.
          </p>
        )}
        {error && (
          <p className="text-red-400 text-xs mt-3 text-center">{error}</p>
        )}
      </div>
    );
  }

  // -- Full board --------------------------------------------------------------
  return (
    <div
      className="rounded-xl p-6 space-y-6"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}18, ${secondaryColor}10)`,
        border: `1px solid ${primaryColor}30`,
      }}
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: primaryColor }}
        >
          {board.title}
        </h2>
        <p className="text-zinc-300 text-base italic">&ldquo;{board.centerAffirmation}&rdquo;</p>
        <p className="text-zinc-400 text-xs">
          Generated {new Date(board.generatedAt).toLocaleDateString()} · {board.theme.mood}
          {board.generationMethod === 'pipeline' && (
            <span className="ml-1 text-orange-500">· AI Pipeline ✦</span>
          )}
        </p>
      </div>

      {/* Panels */}
      <div className={layoutClass[board.theme.layoutStyle] ?? layoutClass.grid}>
        {board.panels
          .sort((a, b) => a.position - b.position)
          .map((panel, idx) => (
            <PanelCard
              key={panel.id}
              panel={panel}
              accentColor={board.theme.colorPalette[idx % board.theme.colorPalette.length]}
              onClick={() => setActivePanelIndex(idx)}
            />
          ))}
      </div>

      {/* Regenerate + controls (Pro only) */}
      {(canRegenerate || proUnlocked) && (
        <div className="text-center pt-2">
          <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setGenerationMode('ai')}
              className={`border px-3 py-2 text-xs rounded-lg transition ${
                generationMode === 'ai'
                  ? 'border-orange-700 bg-orange-950/30 text-orange-400'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              AI Only
            </button>
            <button
              type="button"
              onClick={() => setGenerationMode('hybrid')}
              className={`border px-3 py-2 text-xs rounded-lg transition ${
                generationMode === 'hybrid'
                  ? 'border-orange-700 bg-orange-950/30 text-orange-400'
                  : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}
            >
              Hybrid Upload
            </button>
          </div>

          <select
            value={stylePreset}
            onChange={(e) => setStylePreset(e.target.value as typeof stylePreset)}
            className="w-full max-w-lg mx-auto border border-zinc-700 bg-black px-3 py-2 text-xs text-zinc-300 rounded-lg mb-3"
          >
            <option value="pinterest-bold">Pinterest Bold</option>
            <option value="clean-minimal">Clean Minimal</option>
            <option value="luxury-editorial">Luxury Editorial</option>
            <option value="cinematic-dream">Cinematic Dream</option>
          </select>

          {generationMode === 'hybrid' && (
            <div className="mb-3">
              <label className="inline-flex items-center gap-2 border border-zinc-700 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:border-zinc-600 cursor-pointer transition">
                <Upload size={14} />
                {uploading ? 'Processing images-' : `Upload custom images (${customImages.length}/6)`}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 mx-auto text-sm text-zinc-500 
                       hover:text-zinc-300 transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Regenerating-' : 'Regenerate board'}
          </button>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      )}

      {/* Panel detail modal */}
      {activePanel && (
        <PanelModal
          panel={activePanel}
          panels={board.panels}
          currentIndex={activePanelIndex!}
          colorPalette={board.theme.colorPalette}
          onClose={() => setActivePanelIndex(null)}
          onPrev={() => setActivePanelIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setActivePanelIndex((i) => Math.min(board.panels.length - 1, (i ?? 0) + 1))}
        />
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Panel Card
// -----------------------------------------------------------------------------

function PanelCard({
  panel,
  accentColor,
  onClick,
}: {
  panel: VisionBoardPanel;
  accentColor: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative rounded-lg overflow-hidden group cursor-pointer 
                 border border-zinc-800 hover:border-zinc-600 transition-all
                 hover:scale-[1.02] hover:shadow-lg aspect-square"
    >
      {/* Image */}
      {panel.imageData ? (
        <Image
          src={panel.imageData}
          alt={panel.goalTitle}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="w-full h-full object-cover"
          loading="lazy"
          unoptimized
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-2"
          style={{ background: `${accentColor}20` }}
        >
          <span className="text-3xl">{CATEGORY_ICONS[panel.category] ?? '??'}</span>
          <p className="text-zinc-400 text-xs text-center px-3 leading-tight">
            {panel.goalTitle}
          </p>
        </div>
      )}

      {/* Hover overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                     flex flex-col justify-end p-3"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)' }}
        >
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: accentColor }}>
              {CATEGORY_ICONS[panel.category]} {panel.category}
            </span>
            {panel.emotionalAnchor && (
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-black/50 text-zinc-300 font-mono uppercase tracking-widest">
                {panel.emotionalAnchor}
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-xs leading-tight mb-1 line-clamp-2">
            {panel.goalTitle}
          </h3>
          <p className="text-zinc-200 text-xs italic line-clamp-2">
            &ldquo;{panel.affirmation}&rdquo;
          </p>
          {panel.milestoneHint && (
            <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{panel.milestoneHint}</p>
          )}
          {/* Progress bar */}
          <div className="mt-2">
            <div className="h-1 bg-zinc-700/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${panel.progress}%`, backgroundColor: accentColor }}
              />
            </div>
            <span className="text-xs text-zinc-400 mt-0.5 block">{panel.progress}% complete</span>
          </div>
        </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Panel Detail Modal
// -----------------------------------------------------------------------------

function PanelModal({
  panel,
  panels,
  currentIndex,
  colorPalette,
  onClose,
  onPrev,
  onNext,
}: {
  panel: VisionBoardPanel;
  panels: VisionBoardPanel[];
  currentIndex: number;
  colorPalette: string[];
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const accentColor = colorPalette[currentIndex % colorPalette.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 rounded-2xl max-w-lg w-full mx-4 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="aspect-square w-full">
          {panel.imageData ? (
            <Image src={panel.imageData} alt={panel.goalTitle} width={720} height={720} className="w-full h-full object-cover" unoptimized />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `${accentColor}20` }}
            >
              <span className="text-6xl">{CATEGORY_ICONS[panel.category] ?? '??'}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold" style={{ color: accentColor }}>
              {CATEGORY_ICONS[panel.category]} {panel.category}
            </span>
          </div>
          <h3 className="text-white font-bold text-lg">{panel.goalTitle}</h3>
          {panel.emotionalAnchor && (
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${accentColor}20`, color: accentColor }}>
              ✦ {panel.emotionalAnchor}
            </div>
          )}
          <p className="text-zinc-300 italic text-sm">&ldquo;{panel.affirmation}&rdquo;</p>
          {panel.milestoneHint && (
            <p className="text-zinc-400 text-xs leading-relaxed border-l-2 pl-3" style={{ borderColor: accentColor }}>
              {panel.milestoneHint}
            </p>
          )}

          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Progress</span>
              <span className="flex items-center gap-1">
                {panel.progress === 100 && <CheckCircle size={12} className="text-green-400" />}
                {panel.progress}%
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${panel.progress}%`, backgroundColor: accentColor }}
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 pb-4">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 transition"
          >
            <ChevronLeft size={16} className="text-zinc-300" />
          </button>
          <span className="text-zinc-400 text-xs">{currentIndex + 1} / {panels.length}</span>
          <button
            onClick={onNext}
            disabled={currentIndex === panels.length - 1}
            className="p-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 transition"
          >
            <ChevronRight size={16} className="text-zinc-300" />
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 transition"
        >
          <span className="text-white text-xs leading-none">?</span>
        </button>
      </div>
    </div>
  );
}

export default VisionBoard;

async function fileToDataUrl(file: File): Promise<string> {
  const dataUrl = await readFileAsDataUrl(file);
  return downscaleDataUrl(dataUrl, 1200, 0.85);
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Invalid file result'));
    };
    reader.onerror = () => reject(reader.error ?? new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

function downscaleDataUrl(dataUrl: string, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
