'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — RainViewer Radar Widget
// Shows animated rain radar tiled as a pixel-art style minimap
// API: https://www.rainviewer.com/api.html — completely free, no key required
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { CloudRain, Loader2, MapPin, RefreshCw, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCachedLocation } from '@/lib/locationCache';

interface RadarFrame {
  time: number;
  path: string;
}

interface UserLoc {
  lat: number;
  lon: number;
}

// OpenStreetMap tile to pixel position
function latLonToTileXY(lat: number, lon: number, zoom: number) {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

export default function RainViewerWidget({ className }: { className?: string }) {
  const [frames, setFrames] = useState<RadarFrame[]>([]);
  const [frameIdx, setFrameIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [location, setLocation] = useState<UserLoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [host, setHost] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ZOOM = 6;
  const TILE_SIZE = 256;
  const CANVAS_SIZE = 280;

  const fetchFrames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
      if (!res.ok) throw new Error('RainViewer API error');
      const data = await res.json();
      const allFrames: RadarFrame[] = [
        ...(data.radar?.past ?? []),
        ...(data.radar?.nowcast ?? []),
      ].slice(-10);
      setFrames(allFrames);
      setFrameIdx(allFrames.length > 0 ? allFrames.length - 1 : 0);
      setHost(data.host || 'https://tilecache.rainviewer.com');
    } catch {
      setError('Rain radar unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFrames();
    getCachedLocation().then(loc => {
      if (loc) setLocation({ lat: loc.latitude, lon: loc.longitude });
      else setLocation({ lat: 51.505, lon: -0.09 });
    });
  }, [fetchFrames]);

  // Animation
  useEffect(() => {
    if (playing && frames.length > 0) {
      intervalRef.current = setInterval(() => {
        setFrameIdx(i => (i + 1) % frames.length);
      }, 600);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, frames.length]);

  // Build tile URL for RainViewer overlay
  const getTileUrl = (frame: RadarFrame, x: number, y: number, z: number) =>
    `${host}${frame.path}/256/${z}/${x}/${y}/2/1_1.png`;

  // Get base OSM tile URL
  const getBaseTileUrl = (x: number, y: number, z: number) =>
    `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;

  const currentFrame = frames[frameIdx];
  const tile = location ? latLonToTileXY(location.lat, location.lon, ZOOM) : null;

  // Build a 3x3 grid of tiles around user position
  const tiles = tile ? [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [0, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1],
  ].map(([dx, dy]) => ({ x: tile.x + dx, y: tile.y + dy, dx, dy })) : [];

  const timeLabel = currentFrame
    ? new Date(currentFrame.time * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={cn('border border-zinc-800 bg-zinc-950 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <CloudRain className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-zinc-300 text-xs font-mono tracking-wide">RAIN_RADAR</span>
          {timeLabel && (
            <span className="text-zinc-500 text-[10px] font-mono">{timeLabel}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {frames.length > 1 && (
            <button
              onClick={() => setPlaying(p => !p)}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition"
              title={playing ? 'Pause' : 'Play animation'}
            >
              {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </button>
          )}
          <button
            onClick={fetchFrames}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition"
            title="Refresh"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-zinc-500 text-xs font-mono">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading radar...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-red-500 text-xs font-mono">
          {error}
        </div>
      ) : (
        <>
          {/* Radar map */}
          <div
            className="relative overflow-hidden bg-zinc-900"
            style={{ height: CANVAS_SIZE, width: '100%' }}
          >
            {tile && tiles.map(({ x, y, dx, dy }) => {
              const left = (dx + 1) * TILE_SIZE - TILE_SIZE / 2;
              const top = (dy + 1) * TILE_SIZE - TILE_SIZE / 2;
              const adjustedLeft = left - (CANVAS_SIZE / 2 - TILE_SIZE / 2);
              const adjustedTop = top - (CANVAS_SIZE / 2 - TILE_SIZE / 2);
              return (
                <div
                  key={`${x}_${y}`}
                  className="absolute"
                  style={{ left: adjustedLeft, top: adjustedTop, width: TILE_SIZE, height: TILE_SIZE }}
                >
                  {/* Base map tile */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getBaseTileUrl(x, y, ZOOM)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated', filter: 'saturate(0.3) brightness(0.5)' }}
                  />
                  {/* Rain overlay */}
                  {currentFrame && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getTileUrl(currentFrame, x, y, ZOOM)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  )}
                </div>
              );
            })}

            {/* Center marker — user location */}
            <div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              <div className="relative">
                <div
                  className="h-3 w-3 rounded-sm bg-orange-500 border-2 border-white"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute -inset-1 rounded-sm border border-orange-500/40 animate-ping" />
              </div>
            </div>

            {/* Overlay: pixel grid lines for that retro look */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0px, transparent 1px, transparent 14px, rgba(0,0,0,0.05) 15px), repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0px, transparent 1px, transparent 14px, rgba(0,0,0,0.05) 15px)',
                zIndex: 9,
              }}
            />

            {/* Location label */}
            <div className="absolute bottom-1.5 left-2 text-[8px] font-mono text-white/50 z-10">
              <MapPin className="inline h-2.5 w-2.5 mr-0.5 text-orange-400" />
              {location ? `${location.lat.toFixed(2)}°N ${location.lon.toFixed(2)}°E` : 'LOCATING...'}
            </div>
          </div>

          {/* Timeline scrubber */}
          {frames.length > 1 && (
            <div className="px-3 py-2 border-t border-zinc-800">
              <input
                type="range"
                min={0}
                max={frames.length - 1}
                value={frameIdx}
                onChange={e => { setPlaying(false); setFrameIdx(Number(e.target.value)); }}
                className="w-full accent-orange-500 h-1 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-zinc-600 mt-0.5">
                <span>PAST</span>
                <span className="text-orange-400">{timeLabel}</span>
                <span>NOW</span>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="px-3 pb-2 flex items-center gap-2">
            <span className="text-[9px] font-mono text-zinc-600">INTENSITY:</span>
            <div className="flex gap-0.5">
              {['#00b4d8', '#0077b6', '#00f000', '#ffff00', '#ff8c00', '#ff0000'].map(c => (
                <div key={c} style={{ width: 8, height: 8, backgroundColor: c }} />
              ))}
            </div>
            <span className="text-[9px] font-mono text-zinc-600">LOW → HIGH</span>
          </div>
        </>
      )}
    </div>
  );
}
