// ─────────────────────────────────────────────────────────────────────────────
// RESURGO — Weather API Proxy
// Primary: Open-Meteo (free, no API key, reliable)
// Geo fallback: ip-api.com (free, no key) when coordinates not supplied
// Reverse geocoding: Nominatim (free, no key)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// WMO Weather Interpretation Codes → human-readable descriptions
const WMO_DESCRIPTIONS: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Depositing rime fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  56: 'Light freezing drizzle', 57: 'Heavy freezing drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  66: 'Light freezing rain', 67: 'Heavy freezing rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
  80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with heavy hail',
};

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch {
    return iso;
  }
}

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') ?? 'auto').trim();

  let lat: number | null = null;
  let lon: number | null = null;
  let city = 'Unknown';

  // ── 1. Parse coordinates if already provided (e.g. "51.5,-0.1") ──
  if (q !== 'auto' && q.includes(',')) {
    const [rawLat, rawLon] = q.split(',');
    const parsedLat = parseFloat(rawLat);
    const parsedLon = parseFloat(rawLon);
    if (isFinite(parsedLat) && isFinite(parsedLon)) {
      lat = parsedLat;
      lon = parsedLon;
    }
  }

  // ── 2. IP-based geolocation fallback when no coords supplied ──
  if (lat === null || lon === null) {
    try {
      const forwarded = request.headers.get('x-forwarded-for') ?? '';
      const realIp = request.headers.get('x-real-ip') ?? '';
      const clientIp = forwarded.split(',')[0]?.trim() || realIp;

      const ipApiUrl =
        clientIp && clientIp !== '::1' && clientIp !== '127.0.0.1'
          ? `https://ip-api.com/json/${clientIp}?fields=status,lat,lon,city`
          : 'https://ip-api.com/json/?fields=status,lat,lon,city';

      const ipRes = await fetch(ipApiUrl, {
        signal: AbortSignal.timeout(4000),
        headers: { 'User-Agent': 'Resurgo/1.0' },
      });
      if (ipRes.ok) {
        const ipData = (await ipRes.json()) as { status: string; lat?: number; lon?: number; city?: string };
        if (ipData.status === 'success' && ipData.lat != null && ipData.lon != null) {
          lat = ipData.lat;
          lon = ipData.lon;
          city = ipData.city ?? 'Unknown';
        }
      }
    } catch {
      // IP lookup failed — fall through to default
    }
  }

  // ── 3. Hard fallback: London ──
  if (lat === null || lon === null) {
    lat = 51.5074;
    lon = -0.1278;
    city = 'London';
  }

  // ── 4. Reverse geocode to get city name (when coords came from browser) ──
  if (city === 'Unknown' && q !== 'auto') {
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        {
          signal: AbortSignal.timeout(3000),
          headers: { 'User-Agent': 'Resurgo/1.0 (weather-widget)' },
        },
      );
      if (geoRes.ok) {
        const geoData = (await geoRes.json()) as { address?: { city?: string; town?: string; village?: string; county?: string } };
        city =
          geoData.address?.city ??
          geoData.address?.town ??
          geoData.address?.village ??
          geoData.address?.county ??
          'Unknown';
      }
    } catch {
      // Reverse geocode failed — keep 'Unknown'
    }
  }

  // ── 5. Fetch weather from Open-Meteo ──
  try {
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,visibility,weather_code` +
      `&daily=sunrise,sunset` +
      `&timezone=auto&forecast_days=1`;

    const res = await fetch(weatherUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Resurgo/1.0' },
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo responded ${res.status}`);
    }

    const raw = (await res.json()) as {
      current: {
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        visibility?: number;
        weather_code: number;
      };
      daily?: { sunrise?: string[]; sunset?: string[] };
    };

    const { current, daily } = raw;
    const weatherCode = current.weather_code ?? 0;
    const condition = WMO_DESCRIPTIONS[weatherCode] ?? 'Unknown';
    const visKm = Math.round((current.visibility ?? 10000) / 1000);

    // Shape response to match the wttr.in j1 format the frontend already parses
    const normalized = {
      current_condition: [
        {
          temp_C: Math.round(current.temperature_2m).toString(),
          FeelsLikeC: Math.round(current.apparent_temperature).toString(),
          weatherDesc: [{ value: condition }],
          weatherCode: weatherCode.toString(),
          humidity: Math.round(current.relative_humidity_2m).toString(),
          windspeedKmph: Math.round(current.wind_speed_10m).toString(),
          visibility: visKm.toString(),
        },
      ],
      nearest_area: [{ areaName: [{ value: city }] }],
      weather: [
        {
          astronomy: [
            {
              sunrise: formatTime(daily?.sunrise?.[0] ?? ''),
              sunset: formatTime(daily?.sunset?.[0] ?? ''),
            },
          ],
        },
      ],
    };

    return Response.json(normalized, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (err) {
    console.error('[weather] Open-Meteo error:', err);
    return Response.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
