'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Weather Widget (Dashboard)
// Uses free wttr.in API (no key required) with geolocation fallback
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, Eye } from 'lucide-react';
import { getCachedLocation } from '@/lib/locationCache';

interface WeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  wind: number;
  visibility: number;
  city: string;
  sunrise: string;
  sunset: string;
}

const WEATHER_ICONS: Record<string, React.ElementType> = {
  sunny: Sun,
  clear: Sun,
  partly: Cloud,
  cloudy: Cloud,
  overcast: Cloud,
  rain: CloudRain,
  drizzle: CloudRain,
  snow: CloudSnow,
  thunder: CloudLightning,
  storm: CloudLightning,
};

function getWeatherIcon(condition: string) {
  const lower = condition.toLowerCase();
  for (const [key, Icon] of Object.entries(WEATHER_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Cloud;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use cached location (single browser prompt), fallback to auto-detect by IP
      let locationParam = 'auto';
      const loc = await getCachedLocation();
      if (loc) {
        locationParam = `${loc.latitude},${loc.longitude}`;
      }

      // Use server-side proxy to avoid exposing API key in frontend
      const url = `/api/weather?q=${encodeURIComponent(locationParam)}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('Weather API error');

      const data = await res.json();
      const current = data.current_condition?.[0];
      const area = data.nearest_area?.[0];
      const astro = data.weather?.[0]?.astronomy?.[0];

      if (!current) throw new Error('No weather data');

      setWeather({
        temp: parseInt(current.temp_C),
        feelsLike: parseInt(current.FeelsLikeC),
        condition: current.weatherDesc?.[0]?.value ?? 'Unknown',
        icon: current.weatherCode ?? '',
        humidity: parseInt(current.humidity),
        wind: parseInt(current.windspeedKmph),
        visibility: parseInt(current.visibility),
        city: area?.areaName?.[0]?.value ?? 'Unknown',
        sunrise: astro?.sunrise ?? '',
        sunset: astro?.sunset ?? '',
      });
    } catch {
      setError('Weather unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (loading) {
    return (
      <div className="border border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
          <Cloud className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
          <span className="font-pixel text-[0.6rem] tracking-widest text-sky-500">WEATHER</span>
        </div>
        <div className="p-4 text-center">
          <p className="font-terminal text-xs text-zinc-500 animate-pulse">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="border border-zinc-900 bg-zinc-950">
        <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
          <Cloud className="h-3.5 w-3.5 text-zinc-500" />
          <span className="font-pixel text-[0.6rem] tracking-widest text-zinc-500">WEATHER</span>
        </div>
        <div className="p-4 text-center">
          <p className="font-terminal text-xs text-zinc-500">{error ?? 'No data'}</p>
          <button
            onClick={fetchWeather}
            className="mt-2 font-pixel text-[0.35rem] tracking-widest text-orange-500 hover:text-orange-400 transition"
          >
            [RETRY]
          </button>
        </div>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <div className="border border-zinc-900 bg-zinc-950">
      <div className="flex items-center gap-2 border-b border-zinc-900 px-4 py-2.5">
        <Cloud className="h-3.5 w-3.5 text-sky-500" />
        <span className="font-pixel text-[0.6rem] tracking-widest text-sky-500">WEATHER</span>
        <span className="ml-auto font-terminal text-xs text-zinc-500">{weather.city}</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <WeatherIcon className="h-8 w-8 text-sky-400" />
            <div>
              <p className="font-terminal text-3xl font-bold text-zinc-100">{weather.temp}°C</p>
              <p className="font-terminal text-xs text-zinc-500">Feels like {weather.feelsLike}°C</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-terminal text-sm text-zinc-300">{weather.condition}</p>
            <p className="font-terminal text-xs text-zinc-600">
              ☀ {weather.sunrise} · ☽ {weather.sunset}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-zinc-900 pt-3">
          <div className="flex items-center gap-1.5">
            <Droplets className="h-3 w-3 text-cyan-500" />
            <span className="font-terminal text-xs text-zinc-400">{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wind className="h-3 w-3 text-zinc-400" />
            <span className="font-terminal text-xs text-zinc-400">{weather.wind} km/h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3 w-3 text-zinc-400" />
            <span className="font-terminal text-xs text-zinc-400">{weather.visibility} km</span>
          </div>
        </div>
      </div>
    </div>
  );
}
