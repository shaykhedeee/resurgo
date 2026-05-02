// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Weather API Proxy
// Server-side proxy for OpenWeatherMap to avoid exposing API key in frontend
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for weather data (10 minute TTL)
const weatherCache = new Map<string, { data: unknown; time: number }>();
const CACHE_TTL = 10 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('q') ?? 'auto';

  try {
    // Check cache first
    const cached = weatherCache.get(location);
    if (cached && Date.now() - cached.time < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    const apiKey = process.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Weather API key not configured' }, { status: 500 });
    }

    let owmUrl: string;

    if (location === 'auto') {
      // Use IP geolocation (ipapi.co is free, no key required)
      const ipRes = await fetch('https://ipapi.co/json/', {
        headers: { 'User-Agent': 'Resurgo/1.0' },
        next: { revalidate: 3600 },
      });

      if (!ipRes.ok) {
        return NextResponse.json({ error: 'IP geolocation failed' }, { status: 400 });
      }

      const ipData = await ipRes.json();
      const { latitude, longitude } = ipData;

      if (!latitude || !longitude) {
        return NextResponse.json({ error: 'Could not determine location' }, { status: 400 });
      }

      owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    } else if (location.includes(',')) {
      // Coordinates format: lat,lon
      const [lat, lon] = location.split(',');
      owmUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      // City name
      owmUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    }

    // Fetch from OpenWeatherMap
    const owmRes = await fetch(owmUrl, {
      headers: { 'User-Agent': 'Resurgo/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!owmRes.ok) {
      return NextResponse.json(
        { error: `Weather API error: ${owmRes.statusText}` },
        { status: owmRes.status }
      );
    }

    const owmData = await owmRes.json();

    // Transform OpenWeatherMap format to wttr.in-like format for compatibility with WeatherWidget
    const transformed = {
      current_condition: [
        {
          temp_C: Math.round(owmData.main.temp),
          FeelsLikeC: Math.round(owmData.main.feels_like),
          weatherDesc: [{ value: owmData.weather[0].main }],
          weatherCode: owmData.weather[0].id.toString(),
          humidity: owmData.main.humidity,
          windspeedKmph: Math.round((owmData.wind.speed || 0) * 3.6), // m/s to km/h
          visibility: Math.round((owmData.visibility || 10000) / 1000), // meters to km
        },
      ],
      nearest_area: [
        {
          areaName: [{ value: owmData.name || 'Unknown' }],
          country: [{ value: owmData.sys.country || '' }],
        },
      ],
      weather: [
        {
          astronomy: [
            {
              sunrise: formatUnixTime(owmData.sys.sunrise),
              sunset: formatUnixTime(owmData.sys.sunset),
            },
          ],
        },
      ],
    };

    // Cache the result
    weatherCache.set(location, { data: transformed, time: Date.now() });

    return NextResponse.json(transformed, {
      headers: {
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      },
    });
  } catch (err) {
    console.error('[weather-api] error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Weather service unavailable' },
      { status: 500 }
    );
  }
}

/**
 * Convert Unix timestamp (seconds) to HH:MM format
 */
function formatUnixTime(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
