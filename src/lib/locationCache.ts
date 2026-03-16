// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// Location cache utility â€” ask the browser for permission only once.
// Subsequent calls return the cached coordinates from localStorage.
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

const STORAGE_KEY = 'resurgo-location-cache';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

function getCached(): CachedLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: CachedLocation = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch (_e) {
    return null;
  }
}

function setCache(lat: number, lon: number): void {
  const entry: CachedLocation = { latitude: lat, longitude: lon, timestamp: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch (_e) {
    // Storage full â€” ignore
  }
}

/**
 * Returns { latitude, longitude } from cache or a single browser prompt.
 * Falls back to null if denied or unavailable.
 */
export async function getCachedLocation(): Promise<{ latitude: number; longitude: number } | null> {
  // 1. Return from cache if fresh
  const cached = getCached();
  if (cached) {
    return { latitude: cached.latitude, longitude: cached.longitude };
  }

  // 2. Check if geolocation API exists
  if (typeof navigator === 'undefined' || !navigator.geolocation) return null;

  // 3. Check permission state (if supported) to avoid re-prompting
  try {
    if (navigator.permissions) {
      const status = await navigator.permissions.query({ name: 'geolocation' });
      if (status.state === 'denied') return null;
    }
  } catch (_e) {
    // permissions API not supported â€” continue
  }

  // 4. Request position (this is the only place the browser prompt fires)
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
    );
    const { latitude, longitude } = pos.coords;
    setCache(latitude, longitude);
    return { latitude, longitude };
  } catch (_e) {
    return null;
  }
}
