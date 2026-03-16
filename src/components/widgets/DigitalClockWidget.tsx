'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Digital Clock + Weather Widget (Dashboard)
// Terminal-styled clock with live weather integration via server proxy
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { getCachedLocation } from '@/lib/locationCache';

interface WeatherInfo {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

const CONDITION_EMOJI: Record<string, string> = {
  sunny: '☀️',
  clear: '☀️',
  partly: '⛅',
  cloudy: '☁️',
  overcast: '☁️',
  rain: '🌧️',
  drizzle: '🌦️',
  snow: '❄️',
  thunder: '⛈️',
  storm: '🌩️',
  fog: '🌫️',
  mist: '🌫️',
};

function getConditionEmoji(condition: string): string {
  const lower = condition.toLowerCase();
  for (const [key, emoji] of Object.entries(CONDITION_EMOJI)) {
    if (lower.includes(key)) return emoji;
  }
  return '🌡️';
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export default function DigitalClockWidget() {
  const [time, setTime] = useState(new Date());
  const [blink, setBlink] = useState(true);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  // Update clock every second
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date());
      setBlink((b) => !b);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fetchWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(false);
    try {
      let locationParam = 'auto';
      const loc = await getCachedLocation();
      if (loc) {
        locationParam = `${loc.latitude},${loc.longitude}`;
      }

      const res = await fetch(`/api/weather?q=${encodeURIComponent(locationParam)}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) throw new Error('Weather unavailable');

      const data = await res.json();
      const current = data.current_condition?.[0];
      const area = data.nearest_area?.[0];

      if (!current) throw new Error('No data');

      setWeather({
        temp: parseInt(current.temp_C),
        condition: current.weatherDesc?.[0]?.value ?? 'Unknown',
        humidity: parseInt(current.humidity),
        windSpeed: parseInt(current.windspeedKmph),
        city: area?.areaName?.[0]?.value ?? 'Unknown',
      });
    } catch {
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    // Refresh weather every hour
    const t = setInterval(fetchWeather, 60 * 60 * 1000);
    return () => clearInterval(t);
  }, [fetchWeather]);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const day = DAYS[time.getDay()];
  const date = `${MONTHS[time.getMonth()]} ${String(time.getDate()).padStart(2, '0')}`;
  const year = time.getFullYear();

  return (
    <div className="border border-zinc-900 bg-black h-full flex flex-col">
      {/* Widget header */}
      <div className="border-b border-zinc-900 px-3 py-1.5 flex items-center justify-between">
        <span className="font-pixel text-[0.5rem] tracking-widest text-zinc-600">SYSTEM_TIME</span>
        <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-700">{year}</span>
      </div>

      {/* Clock */}
      <div className="px-4 pt-4 pb-2">
        <p className="font-pixel text-[0.4rem] tracking-[0.3em] text-zinc-600 mb-1">{day}, {date}</p>
        <div
          className="font-pixel text-3xl tracking-widest text-orange-400 leading-none"
          style={{ textShadow: '0 0 8px rgba(251,146,60,0.7), 0 0 20px rgba(251,146,60,0.3)' }}
        >
          {pad(h)}
          <span style={{ opacity: blink ? 1 : 0.3 }}>:</span>
          {pad(m)}
          <span style={{ opacity: blink ? 1 : 0.3 }}>:</span>
          {pad(s)}
          <span className="text-orange-600 ml-1" style={{ opacity: blink ? 1 : 0 }}>▋</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-zinc-900 my-2" />

      {/* Weather */}
      <div className="px-4 pb-4 flex-1">
        {weatherLoading ? (
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-600">FETCHING_WEATHER_</span>
            <span className="inline-block w-2 h-2 border border-zinc-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : weatherError ? (
          <div>
            <span className="font-pixel text-[0.4rem] tracking-widest text-zinc-700">[ WEATHER_UNAVAILABLE ]</span>
            <button
              onClick={fetchWeather}
              className="ml-2 font-pixel text-[0.35rem] tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              RETRY
            </button>
          </div>
        ) : weather ? (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{getConditionEmoji(weather.condition)}</span>
              <div>
                <span className="font-pixel text-base text-zinc-100">{weather.temp}°C</span>
                <span className="ml-2 font-terminal text-sm text-zinc-400">{weather.condition}</span>
              </div>
            </div>
            <p className="font-pixel text-[0.38rem] tracking-widest text-zinc-600">
              {weather.city} · Humidity {weather.humidity}% · Wind {weather.windSpeed}km/h
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
