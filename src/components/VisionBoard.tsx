'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import Image from 'next/image';
import Link from 'next/link';
import { usePlanGating } from '@/hooks/usePlanGating';
import {
  CheckCircle, RefreshCw, Sparkles, ChevronLeft, ChevronRight, Crown,
  Upload, Wand2, Copy, Check, History, Trash2, Search, Download,
  Star, Grid3X3, LayoutGrid, Columns, X, Plus,
} from 'lucide-react';
import VisionBoardWizard, { type VisionBoardWizardResult } from '@/components/VisionBoardWizard';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface VisionBoardPanel {
  id: string;
  goalTitle: string;
  imageData: string | null;
  imagePrompt: string;
  affirmation: string;
  category: string;
  progress: number;
  position: number;
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
}

interface StockImage {
  id: string;
  url: string;
  thumbUrl: string;
  width: number;
  height: number;
  alt: string;
  photographer?: string;
  provider: string;
  attribution: string;
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
      body: JSON.stringify({ eventName, page: '/vision-board', details }),
      keepalive: true,
    });
  } catch { /* telemetry only */ }
}

const CATEGORY_ICONS: Record<string, string> = {
  HEALTH: '💪', CAREER: '🚀', PERSONAL: '🌱', FINANCE: '💰',
  LEARNING: '📚', RELATIONSHIP: '❤️', WEALTH: '💰', TRAVEL: '✈️',
  MINDSET: '🧘', CREATIVITY: '🎨',
};

// ─────────────────────────────────────────────────────────────────────────────
// VisionBoard Component
// ─────────────────────────────────────────────────────────────────────────────

interface VisionBoardProps {
  canRegenerate?: boolean;
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
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Wizard
  const [wizardDone, setWizardDone] = useState(false);
  const [wizardData, setWizardData] = useState<VisionBoardWizardResult | null>(null);

  // Tabs: board | history | search
  const [activeTab, setActiveTab] = useState<'board' | 'history' | 'search'>('board');
  const [stockQuery, setStockQuery] = useState('');
  const [stockImages, setStockImages] = useState<StockImage[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [layoutOverride, setLayoutOverride] = useState<string | null>(null);

  // Convex queries
  const boardDoc = useQuery(api.visionBoards.getActive, {});
  const boardHistory = useQuery(api.visionBoards.list, {});
  const board: VisionBoardConfig | null = boardDoc ? JSON.parse(boardDoc.config as string) : null;

  // Convex mutations
  const removeBoard = useMutation(api.visionBoards.remove);
  const activateBoard = useMutation(api.visionBoards.activate);
  const duplicateBoard = useMutation(api.visionBoards.duplicate);

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    void sendGrowthEvent('vision_board_viewed', { plan });
  }, [plan]);

  const handleGenerate = useCallback(async () => {
    if (!proUnlocked) {
      void sendGrowthEvent('vision_board_pro_gate_hit', { source: 'generate_button', plan });
      setError('Vision Board is a Pro feature. Upgrade to unlock premium generation.');
      return;
    }

    void sendGrowthEvent('vision_board_generate_clicked', {
      mode: generationMode, stylePreset, customImagesCount: customImages.length,
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
          promptData: wizardData ?? undefined,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      void sendGrowthEvent('vision_board_generation_success', {
        mode: generationMode, stylePreset, customImagesCount: customImages.length,
      });
      setActiveTab('board');
    } catch (err) {
      void sendGrowthEvent('vision_board_generation_failed', {
        mode: generationMode, stylePreset, customImagesCount: customImages.length,
        message: err instanceof Error ? err.message : 'Generation failed',
      });
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }, [customImages, generationMode, plan, proUnlocked, stylePreset, wizardData]);

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

  const handleStockSearch = useCallback(async (q?: string) => {
    const searchQuery = q ?? stockQuery;
    if (!searchQuery.trim()) return;
    setStockLoading(true);
    try {
      const res = await fetch(`/api/vision-board/stock-search?q=${encodeURIComponent(searchQuery)}&limit=20`);
      const data = (await res.json()) as { images: StockImage[] };
      setStockImages(data.images ?? []);
    } catch {
      setStockImages([]);
    } finally {
      setStockLoading(false);
    }
  }, [stockQuery]);

  const handleDeleteBoard = useCallback(async (boardId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await removeBoard({ boardId: boardId as any });
    } catch { /* ignore */ }
  }, [removeBoard]);

  const handleActivateBoard = useCallback(async (boardId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await activateBoard({ boardId: boardId as any });
      setActiveTab('board');
    } catch { /* ignore */ }
  }, [activateBoard]);

  const handleDuplicate = useCallback(async (boardId: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await duplicateBoard({ boardId: boardId as any });
    } catch { /* ignore */ }
  }, [duplicateBoard]);

  const activePanel = activePanelIndex !== null ? board?.panels[activePanelIndex] : null;
  const primaryColor = board?.theme.colorPalette[0] ?? '#f97316';
  const secondaryColor = board?.theme.colorPalette[1] ?? '#8b5cf6';

  const currentLayout = layoutOverride ?? board?.theme.layoutStyle ?? 'grid';
  const layoutClass: Record<string, string> = {
    grid: 'grid grid-cols-2 md:grid-cols-3 gap-4',
    collage: 'columns-2 md:columns-3 gap-3 space-y-3',
    minimal: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    mosaic: 'grid grid-cols-3 auto-rows-[140px] md:auto-rows-[200px] gap-2',
  };

  // ── PRO GATE ──────────────────────────────────────────────────────────────
  if (!proUnlocked) {
    return (
      <div className="border border-zinc-900 bg-zinc-950 p-6 rounded-xl">
        <div className="flex items-center justify-center mb-3">
          <div className="inline-flex items-center gap-2 border border-amber-800 bg-amber-950/20 px-3 py-1 rounded-full">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-[10px] tracking-widest font-mono text-amber-400">PRO_FEATURE</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-zinc-100 text-center">Premium Vision Board Studio</h2>
        <p className="text-zinc-400 text-sm text-center mt-2 max-w-xl mx-auto leading-relaxed">
          Turn goals into a Pinterest-style, AI-generated mood board with custom layouts, archetype-aware affirmations,
          and hybrid uploads. Available on <span className="text-amber-400">Pro</span> and <span className="text-amber-400">Lifetime</span> plans.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-xs text-zinc-300">
          {[
            'AI-generated panel images (multi-provider cascade)',
            'Premium style presets (Pinterest bold, cinematic, editorial)',
            'Hybrid mode: upload your own images + AI composition',
            'Stock image search (Getty, Unsplash, Pexels)',
            'Board history & version gallery',
            'Pinterest masonry & collage layouts',
          ].map((feature) => (
            <div key={feature} className="border border-zinc-800 bg-black/40 p-3 rounded-lg">
              <span className="text-orange-400 mr-1.5">•</span>{feature}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/pricing"
            onClick={() => void sendGrowthEvent('upgrade_clicked', { source: 'vision_board_paywall', plan })}
            className="inline-flex items-center gap-2 border border-amber-800 bg-amber-950/30 px-5 py-2.5 rounded-lg font-mono text-xs tracking-widest text-amber-400 hover:bg-amber-950/50 transition"
          >
            <Crown className="h-3.5 w-3.5" />
            [UPGRADE_TO_PRO]
          </Link>
          <span className="font-mono text-[10px] text-zinc-500">Current plan: {plan.toUpperCase()}</span>
        </div>
      </div>
    );
  }

  // ── WIZARD ─────────────────────────────────────────────────────────────────
  if (!board && !wizardDone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] py-8">
        <div className="w-full max-w-2xl mb-6 text-center">
          <p className="font-pixel text-[0.5rem] tracking-widest text-orange-500 mb-1">✦ AI VISION BOARD STUDIO</p>
          <h2 className="font-terminal text-xl font-bold text-zinc-100">Build Your Vision Board in 4 Steps</h2>
          <p className="font-terminal text-sm text-zinc-500 mt-1">
            Answer a few questions so AI can generate deeply personalised imagery for each area of your life.
          </p>
        </div>
        <VisionBoardWizard
          onComplete={(result) => {
            setWizardData(result);
            setStylePreset(result.stylePreset);
            setWizardDone(true);
          }}
          onSkip={() => setWizardDone(true)}
        />
      </div>
    );
  }

  // ── EMPTY STATE ────────────────────────────────────────────────────────────
  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px]
                      border border-dashed border-zinc-700 rounded-xl p-8 bg-zinc-900/40">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">Your Vision Board</h2>
        <p className="text-zinc-400 text-center mb-6 max-w-sm text-sm leading-relaxed">
          AI generates a personalized vision board from your goals, psychology
          profile, and personality type. Custom images. Personal affirmations.
          Real-time progress tracking.
        </p>

        <div className="w-full max-w-xl space-y-3 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <button type="button" onClick={() => setGenerationMode('ai')}
              className={`border px-3 py-2 text-xs rounded-lg transition ${
                generationMode === 'ai' ? 'border-orange-700 bg-orange-950/30 text-orange-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}>
              <Wand2 size={14} className="inline-block mr-1" /> AI Only
            </button>
            <button type="button" onClick={() => setGenerationMode('hybrid')}
              className={`border px-3 py-2 text-xs rounded-lg transition ${
                generationMode === 'hybrid' ? 'border-orange-700 bg-orange-950/30 text-orange-400' : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
              }`}>
              <Upload size={14} className="inline-block mr-1" /> Hybrid Upload
            </button>
          </div>

          <select value={stylePreset} onChange={(e) => setStylePreset(e.target.value as typeof stylePreset)}
            className="w-full border border-zinc-700 bg-black px-3 py-2 text-xs text-zinc-300 rounded-lg">
            <option value="pinterest-bold">Pinterest Bold (high contrast, dynamic)</option>
            <option value="clean-minimal">Clean Minimal (airy, calm, elegant)</option>
            <option value="luxury-editorial">Luxury Editorial (premium magazine look)</option>
            <option value="cinematic-dream">Cinematic Dream (moody, dramatic lighting)</option>
          </select>

          {generationMode === 'hybrid' && (
            <div className="border border-zinc-800 rounded-lg p-3 bg-black/40 space-y-2">
              <label className="inline-flex items-center gap-2 border border-zinc-700 px-3 py-2 rounded-lg text-xs text-zinc-300 hover:border-zinc-600 cursor-pointer transition">
                <Upload size={14} />
                {uploading ? 'Processing images…' : 'Upload custom images (max 6)'}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              {customImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {customImages.map((src, i) => (
                    <div key={`${i}-upload`} className="relative rounded-md overflow-hidden border border-zinc-700">
                      <Image src={src} alt={`upload-${i}`} width={96} height={64} className="w-full h-16 object-cover" unoptimized />
                      <button type="button" onClick={() => removeCustomImage(i)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-zinc-200 text-xs"
                        aria-label="Remove uploaded image">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button onClick={handleGenerate} disabled={generating}
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-black transition-all disabled:opacity-60 disabled:cursor-wait bg-orange-500 hover:bg-orange-400">
          {generating
            ? <><RefreshCw size={16} className="animate-spin" /> Generating your board…</>
            : <><Sparkles size={16} /> Generate My Vision Board</>}
        </button>
        {generating && <p className="text-zinc-500 text-xs mt-3 text-center">Creating personalised images… this takes 30–60 seconds.</p>}
        {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}

        {/* Show history link if there are previous boards */}
        {boardHistory && boardHistory.length > 0 && (
          <button onClick={() => setActiveTab('history')}
            className="mt-4 flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs transition">
            <History size={14} /> View {boardHistory.length} previous board{boardHistory.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
    );
  }

  // ── FULL BOARD VIEW ─────────────────────────────────────────────────────────
  const allCategories = [...new Set(board.panels.map((p) => p.category))];
  const visiblePanels = categoryFilter
    ? board.panels.filter((p) => p.category === categoryFilter)
    : board.panels;

  return (
    <div className="space-y-4">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex gap-1">
          {([
            { key: 'board', icon: <LayoutGrid size={14} />, label: 'Board' },
            { key: 'history', icon: <History size={14} />, label: 'History' },
            { key: 'search', icon: <Search size={14} />, label: 'Stock Images' },
          ] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono transition rounded-t ${
                activeTab === tab.key
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-zinc-900/50'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Layout switcher (board tab only) */}
        {activeTab === 'board' && (
          <div className="flex gap-1">
            {([
              { key: 'grid', icon: <Grid3X3 size={14} /> },
              { key: 'collage', icon: <Columns size={14} /> },
              { key: 'mosaic', icon: <LayoutGrid size={14} /> },
            ] as const).map((l) => (
              <button key={l.key} onClick={() => setLayoutOverride(l.key)}
                className={`p-1.5 rounded transition ${
                  currentLayout === l.key ? 'text-orange-400 bg-orange-950/30' : 'text-zinc-600 hover:text-zinc-400'
                }`} title={l.key}>
                {l.icon}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── BOARD TAB ── */}
      {activeTab === 'board' && (
        <div className="rounded-xl p-5 space-y-5"
          style={{
            background: `linear-gradient(135deg, ${primaryColor}12, ${secondaryColor}08)`,
            border: `1px solid ${primaryColor}25`,
          }}>
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>{board.title}</h2>
            <p className="text-zinc-300 text-sm italic">&ldquo;{board.centerAffirmation}&rdquo;</p>
            <p className="text-zinc-500 text-xs">
              Generated {new Date(board.generatedAt).toLocaleDateString()} · {board.theme.mood}
            </p>
          </div>

          {/* Category filter */}
          {allCategories.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => setCategoryFilter(null)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  categoryFilter === null ? 'bg-white/10 text-white border border-white/20' : 'text-zinc-400 hover:text-zinc-200'
                }`}>All ({board.panels.length})</button>
              {allCategories.map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                    categoryFilter === cat ? 'text-white border border-white/30' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={categoryFilter === cat ? { backgroundColor: `${primaryColor}30`, borderColor: primaryColor } : {}}>
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          )}

          {/* Panels — Pinterest masonry for collage, grid for others */}
          <div className={layoutClass[currentLayout] ?? layoutClass.grid}>
            {visiblePanels
              .sort((a, b) => a.position - b.position)
              .map((panel, idx) => {
                // For masonry/mosaic, vary row spans
                const rowSpan = currentLayout === 'mosaic'
                  ? (idx % 3 === 0 ? 'row-span-2' : 'row-span-1')
                  : '';
                return (
                  <PanelCard
                    key={panel.id}
                    panel={panel}
                    accentColor={board.theme.colorPalette[idx % board.theme.colorPalette.length]}
                    onClick={() => setActivePanelIndex(board.panels.indexOf(panel))}
                    className={rowSpan}
                    isMasonry={currentLayout === 'collage'}
                  />
                );
              })}
          </div>

          {/* Regenerate controls */}
          {(canRegenerate || proUnlocked) && (
            <div className="text-center pt-2 space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-lg mx-auto">
                {(['pinterest-bold', 'clean-minimal', 'luxury-editorial', 'cinematic-dream'] as const).map((s) => (
                  <button key={s} onClick={() => setStylePreset(s)}
                    className={`border px-2 py-1.5 text-[10px] rounded-lg transition ${
                      stylePreset === s ? 'border-orange-700 bg-orange-950/30 text-orange-400' : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                    }`}>{s.replace(/-/g, ' ')}</button>
                ))}
              </div>

              <button onClick={handleGenerate} disabled={generating}
                className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition disabled:opacity-50">
                <RefreshCw size={14} className={generating ? 'animate-spin' : ''} />
                {generating ? 'Regenerating…' : 'Regenerate board'}
              </button>
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs tracking-widest text-zinc-400">BOARD_HISTORY ({boardHistory?.length ?? 0})</h3>
          </div>

          {!boardHistory || boardHistory.length === 0 ? (
            <div className="text-center py-12 text-zinc-600 text-sm">
              <History size={32} className="mx-auto mb-3 opacity-50" />
              <p>No previous boards yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {boardHistory.map((doc) => {
                const cfg = (() => { try { return JSON.parse(doc.config as string) as VisionBoardConfig; } catch { return null; } })();
                if (!cfg) return null;
                const isActive = doc.isActive;
                return (
                  <div key={doc._id} className={`border rounded-lg p-4 transition ${
                    isActive ? 'border-orange-700 bg-orange-950/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-200 line-clamp-1">{cfg.title}</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5">
                          {new Date(cfg.generatedAt).toLocaleDateString()} · {cfg.panels.length} panels
                          {isActive && <span className="ml-2 text-orange-400">● ACTIVE</span>}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {!isActive && (
                          <button onClick={() => handleActivateBoard(doc._id)}
                            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition" title="Set as active">
                            <Star size={12} className="text-zinc-400" />
                          </button>
                        )}
                        <button onClick={() => handleDuplicate(doc._id)}
                          className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 transition" title="Duplicate">
                          <Copy size={12} className="text-zinc-400" />
                        </button>
                        {!isActive && (
                          <button onClick={() => handleDeleteBoard(doc._id)}
                            className="p-1.5 rounded bg-zinc-800 hover:bg-red-950/50 transition" title="Delete">
                            <Trash2 size={12} className="text-zinc-500 hover:text-red-400" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Mini preview */}
                    <div className="grid grid-cols-3 gap-1 mt-2">
                      {cfg.panels.slice(0, 3).map((p, i) => (
                        <div key={p.id || i} className="aspect-square rounded overflow-hidden border border-zinc-800">
                          {p.imageData ? (
                            <Image src={p.imageData} alt={p.goalTitle} width={80} height={80}
                              className="w-full h-full object-cover opacity-80" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-lg">
                              {CATEGORY_ICONS[p.category] ?? '🎯'}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] italic text-zinc-500 mt-2 line-clamp-1">&ldquo;{cfg.centerAffirmation}&rdquo;</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── STOCK IMAGE SEARCH TAB ── */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input type="text" value={stockQuery} onChange={(e) => setStockQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStockSearch()}
                placeholder="Search stock photos (fitness, luxury, travel...)"
                className="w-full border border-zinc-700 bg-black pl-9 pr-3 py-2 text-xs text-zinc-300 rounded-lg placeholder:text-zinc-600 focus:border-orange-600 focus:outline-none" />
            </div>
            <button onClick={() => handleStockSearch()} disabled={stockLoading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-black text-xs font-bold rounded-lg transition disabled:opacity-50">
              {stockLoading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* Quick domain buttons */}
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(CATEGORY_ICONS).slice(0, 8).map(([domain, icon]) => (
              <button key={domain} onClick={() => { setStockQuery(`${domain.toLowerCase()} motivation inspiration`); handleStockSearch(`${domain.toLowerCase()} motivation inspiration`); }}
                className="px-2.5 py-1 border border-zinc-800 rounded-full text-[10px] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition">
                {icon} {domain}
              </button>
            ))}
          </div>

          {/* Results */}
          {stockImages.length > 0 ? (
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {stockImages.map((img) => (
                <div key={img.id} className="break-inside-avoid rounded-lg overflow-hidden border border-zinc-800 group relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.thumbUrl} alt={img.alt} className="w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-white text-[10px] line-clamp-1">{img.alt}</p>
                    <p className="text-zinc-400 text-[9px]">{img.attribution}</p>
                    <div className="flex gap-1 mt-1.5">
                      <button onClick={() => { setCustomImages((prev) => [...prev, img.url].slice(0, 6)); setGenerationMode('hybrid'); }}
                        className="flex items-center gap-1 px-2 py-1 bg-orange-600 rounded text-[9px] text-black font-bold">
                        <Plus size={10} /> Use
                      </button>
                      <button onClick={() => window.open(img.url, '_blank', 'noopener')}
                        className="flex items-center gap-1 px-2 py-1 bg-zinc-700 rounded text-[9px] text-zinc-200">
                        <Download size={10} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !stockLoading && (
            <div className="text-center py-12 text-zinc-600 text-sm">
              <Search size={32} className="mx-auto mb-3 opacity-50" />
              <p>Search for inspiration images from Getty, Unsplash & Pexels</p>
              <p className="text-[10px] text-zinc-700 mt-1">Click a domain above for quick results</p>
            </div>
          )}

          {stockLoading && (
            <div className="text-center py-12">
              <RefreshCw size={24} className="mx-auto mb-3 animate-spin text-orange-500" />
              <p className="text-zinc-500 text-xs">Searching across image providers…</p>
            </div>
          )}
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

// ─────────────────────────────────────────────────────────────────────────────
// Panel Card — supports masonry & mosaic
// ─────────────────────────────────────────────────────────────────────────────

function PanelCard({
  panel, accentColor, onClick, className = '', isMasonry = false,
}: {
  panel: VisionBoardPanel;
  accentColor: string;
  onClick: () => void;
  className?: string;
  isMasonry?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-lg overflow-hidden group cursor-pointer
                 border border-zinc-800 hover:border-zinc-600 transition-all
                 hover:scale-[1.02] hover:shadow-lg ${isMasonry ? 'break-inside-avoid' : 'aspect-square'} ${className}`}
    >
      {panel.imageData ? (
        <Image src={panel.imageData} alt={panel.goalTitle}
          {...(isMasonry ? { width: 400, height: 400 } : { fill: true, sizes: '(max-width: 768px) 100vw, 33vw' })}
          className={`${isMasonry ? 'w-full' : 'w-full h-full'} object-cover`}
          loading="lazy" unoptimized />
      ) : (
        <div className={`${isMasonry ? 'aspect-square' : 'w-full h-full'} flex flex-col items-center justify-center gap-2`}
          style={{ background: `${accentColor}20` }}>
          <span className="text-3xl">{CATEGORY_ICONS[panel.category] ?? '🎯'}</span>
          <p className="text-zinc-400 text-xs text-center px-3 leading-tight">{panel.goalTitle}</p>
        </div>
      )}

      {/* Progress badge */}
      <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <div className="h-1.5 w-12 bg-zinc-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${panel.progress}%`, backgroundColor: accentColor }} />
        </div>
        <span className="text-[9px] font-mono" style={{ color: accentColor }}>{panel.progress}%</span>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }}>
        <span className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: accentColor }}>
          {CATEGORY_ICONS[panel.category]} {panel.category}
        </span>
        <h3 className="text-white font-bold text-xs leading-tight mb-1 line-clamp-2">{panel.goalTitle}</h3>
        <p className="text-zinc-300 text-[10px] italic line-clamp-2">&ldquo;{panel.affirmation}&rdquo;</p>
        <div className="mt-2">
          <div className="h-0.5 bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${panel.progress}%`, backgroundColor: accentColor }} />
          </div>
          <span className="text-[10px] text-zinc-400 mt-0.5 block">{panel.progress}% complete</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel Detail Modal
// ─────────────────────────────────────────────────────────────────────────────

function PanelModal({
  panel, panels, currentIndex, colorPalette, onClose, onPrev, onNext,
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
  const [copied, setCopied] = useState(false);

  const copyAffirmation = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(panel.affirmation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  }, [panel.affirmation]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-zinc-900 rounded-2xl max-w-lg w-full mx-4 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-square w-full">
          {panel.imageData ? (
            <Image src={panel.imageData} alt={panel.goalTitle} width={720} height={720} className="w-full h-full object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
              <span className="text-6xl">{CATEGORY_ICONS[panel.category] ?? '🎯'}</span>
            </div>
          )}
        </div>

        <div className="p-5 space-y-3">
          <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: accentColor }}>
            {CATEGORY_ICONS[panel.category]} {panel.category}
          </span>
          <h3 className="text-white font-bold text-lg">{panel.goalTitle}</h3>
          <div className="flex items-start gap-2">
            <p className="flex-1 text-zinc-300 italic text-sm">&ldquo;{panel.affirmation}&rdquo;</p>
            <button onClick={() => void copyAffirmation()}
              className="shrink-0 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition" title="Copy affirmation">
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-zinc-400" />}
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs text-zinc-500 mb-1">
              <span>Progress</span>
              <span className="flex items-center gap-1">
                {panel.progress === 100 && <CheckCircle size={12} className="text-green-400" />}
                {panel.progress}%
              </span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${panel.progress}%`, backgroundColor: accentColor }} />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 pb-4">
          <button onClick={onPrev} disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 transition">
            <ChevronLeft size={16} className="text-zinc-300" />
          </button>
          <span className="text-zinc-400 text-xs">{currentIndex + 1} / {panels.length}</span>
          <button onClick={onNext} disabled={currentIndex === panels.length - 1}
            className="p-2 rounded-lg bg-zinc-800 disabled:opacity-30 hover:bg-zinc-700 transition">
            <ChevronRight size={16} className="text-zinc-300" />
          </button>
        </div>

        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 hover:bg-black/80 transition">
          <X size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
}

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

export default VisionBoard;
