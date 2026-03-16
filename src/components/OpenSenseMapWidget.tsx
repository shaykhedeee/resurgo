'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — OpenSenseMap Widget
// Shows nearby environmental sensor data + user's location on a pixel art map
// API: https://api.opensensemap.org — fully open, no key required
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Wind, Thermometer, Droplets, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCachedLocation } from '@/lib/locationCache';

interface SenseBox {
  _id: string;
  name: string;
  description?: string;
  currentLocation: { coordinates: [number, number] };
  sensors: Array<{
    _id: string;
    icon?: string;
    title: string;
    unit: string;
    sensorType?: string;
    lastMeasurement?: {
      value: string;
      createdAt: string;
    };
  }>;
}

interface UserLocation {
  lat: number;
  lon: number;
  city?: string;
}

// -- Pixel Dot --
function PixelDot({ color, size = 6, pulse = false }: { color: string; size?: number; pulse?: boolean }) {
  return (
    <div
      className={cn('inline-block rounded-sm', pulse && 'animate-pulse')}
      style={{ width: size, height: size, backgroundColor: color, imageRendering: 'pixelated' }}
    />
  );
}

// -- Mini Sensor Card --
function SensorCard({ box }: { box: SenseBox }) {
  const tempSensor = box.sensors.find(s =>
    s.title.toLowerCase().includes('temperatur') || s.title.toLowerCase().includes('temp')
  );
  const humSensor = box.sensors.find(s =>
    s.title.toLowerCase().includes('humi') || s.title.toLowerCase().includes('luftfeucht')
  );
  const pm25Sensor = box.sensors.find(s =>
    s.title.toLowerCase().includes('pm2') || s.title.toLowerCase().includes('pm 2')
  );

  const temp = tempSensor?.lastMeasurement?.value;
  const hum = humSensor?.lastMeasurement?.value;
  const pm25 = pm25Sensor?.lastMeasurement?.value;

  const getAQIColor = (pm: number) => {
    if (pm <= 12) return '#00ff88';
    if (pm <= 35) return '#ffd700';
    if (pm <= 55) return '#ff8c00';
    return '#ff4444';
  };

  return (
    <div className="border border-zinc-800 bg-zinc-950/80 px-3 py-2 hover:border-zinc-700 transition">
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-zinc-300 text-[10px] font-mono leading-tight line-clamp-1 flex-1">{box.name}</p>
        <PixelDot color="#FF6B35" size={5} pulse />
      </div>
      <div className="flex gap-3">
        {temp && (
          <div className="flex items-center gap-1">
            <Thermometer className="h-2.5 w-2.5 text-orange-400" />
            <span className="text-zinc-300 text-[10px] font-mono">{parseFloat(temp).toFixed(1)}°C</span>
          </div>
        )}
        {hum && (
          <div className="flex items-center gap-1">
            <Droplets className="h-2.5 w-2.5 text-blue-400" />
            <span className="text-zinc-300 text-[10px] font-mono">{parseFloat(hum).toFixed(0)}%</span>
          </div>
        )}
        {pm25 && (
          <div className="flex items-center gap-1">
            <Wind className="h-2.5 w-2.5" style={{ color: getAQIColor(parseFloat(pm25)) }} />
            <span className="text-[10px] font-mono" style={{ color: getAQIColor(parseFloat(pm25)) }}>
              PM2.5: {parseFloat(pm25).toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// -- Pixel Map Canvas (ASCII-art style) --
function PixelMap({
  boxes,
  center,
  radiusKm,
}: {
  boxes: SenseBox[];
  center: UserLocation;
  radiusKm: number;
}) {
  const GRID_W = 32;
  const GRID_H = 20;

  // Map [lon, lat] to grid coords
  const toGrid = (lon: number, lat: number) => {
    const lonRange = radiusKm * 0.02;
    const latRange = radiusKm * 0.01;
    const gx = Math.round(((lon - center.lon) / lonRange + 0.5) * (GRID_W - 1));
    const gy = Math.round((0.5 - (lat - center.lat) / latRange) * (GRID_H - 1));
    return {
      x: Math.max(0, Math.min(GRID_W - 1, gx)),
      y: Math.max(0, Math.min(GRID_H - 1, gy)),
    };
  };

  const centerGrid = toGrid(center.lon, center.lat);

  const dots: Array<{ x: number; y: number; color: string; label?: string }> = [
    { x: centerGrid.x, y: centerGrid.y, color: '#FF6B35', label: 'YOU' },
    ...boxes.slice(0, 12).map(box => {
      const [lon, lat] = box.currentLocation.coordinates;
      const g = toGrid(lon, lat);
      return { x: g.x, y: g.y, color: '#00D9FF', label: box.name.substring(0, 4) };
    }),
  ];

  const grid = Array.from({ length: GRID_H }, () => Array(GRID_W).fill('·'));

  return (
    <div className="border border-zinc-800 bg-zinc-950 p-3 overflow-x-auto font-mono text-[8px] leading-[1.1]">
      <div className="text-zinc-600 tracking-widest mb-1 text-[9px]">╔══ SENSEMAP :: LIVE_ENVIRONMENT_DATA ══╗</div>
      <div className="relative">
        {/* Grid */}
        <div>
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => {
                const dot = dots.find(d => d.x === x && d.y === y);
                if (dot) {
                  const isCenter = dot.label === 'YOU';
                  return (
                    <span
                      key={x}
                      style={{
                        color: dot.color,
                        fontWeight: 'bold',
                        fontSize: isCenter ? 10 : 8,
                      }}
                      title={dot.label}
                    >
                      {isCenter ? '◉' : '◆'}
                    </span>
                  );
                }
                return (
                  <span key={x} style={{ color: '#1a1a2e' }}>·</span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="text-zinc-600 text-[9px] mt-1 tracking-widest">
        ◉ = YOU  ◆ = SENSOR  · · radius: {radiusKm}km
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function OpenSenseMapWidget({ className }: { className?: string }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [boxes, setBoxes] = useState<SenseBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState(10);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (loc: UserLocation, radius: number) => {
    setLoading(true);
    setError(null);
    try {
      // OpenSenseMap API — completely free, no auth needed
      const url = `https://api.opensensemap.org/boxes?near=${loc.lon},${loc.lat}&maxDistance=${radius * 1000}&limit=20&format=json&grouptag=&phenomenon=Temperatur,Humidity,PM2.5`;
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error('OpenSenseMap API error');
      const data: SenseBox[] = await res.json();
      // Only keep boxes with recent measurements (< 24h)
      const now = Date.now();
      const fresh = data.filter(box =>
        box.sensors.some(s => {
          if (!s.lastMeasurement?.createdAt) return false;
          const age = now - new Date(s.lastMeasurement.createdAt).getTime();
          return age < 86400000; // 24h
        })
      );
      setBoxes(fresh.slice(0, 16));
      setLastUpdated(new Date());
    } catch {
      setError('Could not load environmental data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCachedLocation().then(async cached => {
      if (cached) {
        const loc: UserLocation = { lat: cached.latitude, lon: cached.longitude };
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lon}&format=json`);
          const d = await r.json();
          loc.city = d.address?.city || d.address?.town || d.address?.village;
        } catch {}
        setLocation(loc);
        fetchData(loc, radiusKm);
      } else {
        const fallback = { lat: 51.505, lon: -0.09, city: 'London' };
        setLocation(fallback);
        fetchData(fallback, radiusKm);
      }
    });
  }, [fetchData, radiusKm]);

  // Compute air quality summary
  const getOverallAQI = () => {
    const pm25Values = boxes.flatMap(b =>
      b.sensors
        .filter(s => s.title.toLowerCase().includes('pm2'))
        .map(s => parseFloat(s.lastMeasurement?.value ?? '999'))
        .filter(v => !isNaN(v) && v < 500)
    );
    if (!pm25Values.length) return null;
    const avg = pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length;
    if (avg <= 12) return { label: 'GOOD', color: '#00ff88', score: avg };
    if (avg <= 35) return { label: 'MODERATE', color: '#ffd700', score: avg };
    if (avg <= 55) return { label: 'UNHEALTHY_SG', color: '#ff8c00', score: avg };
    return { label: 'UNHEALTHY', color: '#ff4444', score: avg };
  };

  const aqi = getOverallAQI();

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-400" />
          <span className="text-zinc-300 text-xs font-mono tracking-wide">
            ENV_SENSORS{location?.city ? ` :: ${location.city.toUpperCase()}` : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={radiusKm}
            onChange={e => setRadiusKm(Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] font-mono px-2 py-1 focus:outline-none focus:border-orange-500"
          >
            <option value={5}>5km</option>
            <option value={10}>10km</option>
            <option value={25}>25km</option>
            <option value={50}>50km</option>
          </select>
          {location && (
            <button
              onClick={() => fetchData(location, radiusKm)}
              className="text-zinc-500 hover:text-zinc-300 transition"
              title="Refresh"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono py-4">
          <Loader2 className="h-3 w-3 animate-spin" />
          Loading sensor data...
        </div>
      ) : error ? (
        <div className="text-red-500 text-xs font-mono">{error}</div>
      ) : (
        <>
          {/* AQI Summary */}
          {aqi && (
            <div className="flex items-center gap-3 border border-zinc-800 px-3 py-2 bg-zinc-950/60">
              <div>
                <div className="text-[9px] font-mono text-zinc-500 tracking-widest">AIR_QUALITY</div>
                <div className="text-sm font-mono font-bold" style={{ color: aqi.color }}>
                  {aqi.label}
                </div>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <div className="text-[9px] font-mono text-zinc-500 tracking-widest">AVG_PM2.5</div>
                <div className="text-sm font-mono font-bold" style={{ color: aqi.color }}>
                  {aqi.score.toFixed(1)} µg/m³
                </div>
              </div>
              <div className="ml-auto text-[9px] text-zinc-600 font-mono">
                {boxes.length} SENSORS
              </div>
            </div>
          )}

          {/* Pixel map */}
          {location && (
            <PixelMap boxes={boxes} center={location} radiusKm={radiusKm} />
          )}

          {/* Sensor cards */}
          {boxes.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {boxes.slice(0, 6).map(box => (
                <SensorCard key={box._id} box={box} />
              ))}
            </div>
          )}

          {/* Lifestyle advice based on AQI */}
          {aqi && (
            <div className="border border-zinc-800 bg-zinc-950/40 px-3 py-2">
              <div className="text-[9px] font-mono text-zinc-500 tracking-widest mb-1">RESURGO_ADVICE</div>
              <p className="text-zinc-400 text-[10px] font-mono leading-relaxed">
                {aqi.label === 'GOOD' && '✓ Air quality is excellent. Great time for outdoor exercise and goal work.'}
                {aqi.label === 'MODERATE' && '⚠ Moderate air quality. Fine for most activities. Sensitive groups should limit prolonged outdoor exertion.'}
                {aqi.label === 'UNHEALTHY_SG' && '⚠ Unhealthy for sensitive groups. Consider indoor workouts if you have respiratory conditions.'}
                {aqi.label === 'UNHEALTHY' && '✗ Air quality is unhealthy. Prioritize indoor activities and limit outdoor exposure today.'}
              </p>
            </div>
          )}

          {lastUpdated && (
            <p className="text-[9px] text-zinc-700 font-mono">
              Last updated: {lastUpdated.toLocaleTimeString()} · Source: OpenSenseMap.org
            </p>
          )}
        </>
      )}
    </div>
  );
}
