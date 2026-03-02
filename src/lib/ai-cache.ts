// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - AI Response Caching & Rate Limiting
// Reduces API calls and prevents abuse
// ═══════════════════════════════════════════════════════════════════════════════

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CACHE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const CACHE_CONFIG = {
  // Cache TTLs in milliseconds
  coaching: 30 * 60 * 1000,        // 30 minutes for coaching messages
  suggestions: 60 * 60 * 1000,     // 1 hour for habit suggestions
  insights: 2 * 60 * 60 * 1000,    // 2 hours for analytics insights
  decomposition: 24 * 60 * 60 * 1000, // 24 hours for goal decomposition (rarely changes)
  
  // Max cache size per type
  maxEntries: 100,
};

// ─────────────────────────────────────────────────────────────────────────────────
// RATE LIMIT CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

const RATE_LIMITS = {
  coaching: {
    maxRequests: 20,              // 20 requests
    windowMs: 60 * 60 * 1000,     // per hour
  },
  suggestions: {
    maxRequests: 10,              // 10 requests
    windowMs: 60 * 60 * 1000,     // per hour
  },
  insights: {
    maxRequests: 5,               // 5 requests
    windowMs: 60 * 60 * 1000,     // per hour
  },
  decomposition: {
    maxRequests: 10,              // 10 requests
    windowMs: 60 * 60 * 1000,     // per hour
  },
  global: {
    maxRequests: 100,             // 100 total requests
    windowMs: 60 * 60 * 1000,     // per hour
  },
};

// ─────────────────────────────────────────────────────────────────────────────────
// IN-MEMORY CACHE (with localStorage persistence)
// ─────────────────────────────────────────────────────────────────────────────────

class AICache {
  private memoryCache: Map<string, CacheEntry<unknown>> = new Map();
  private storageKey = 'ascend_ai_cache';

  constructor() {
    // Load from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        
        // Only load non-expired entries
        Object.entries(parsed).forEach(([key, value]) => {
          const entry = value as CacheEntry<unknown>;
          if (entry.expiresAt > now) {
            this.memoryCache.set(key, entry);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load AI cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const cacheObj: Record<string, CacheEntry<unknown>> = {};
      this.memoryCache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(cacheObj));
    } catch (error) {
      console.warn('Failed to save AI cache to storage:', error);
    }
  }

  private generateKey(type: string, input: string): string {
    // Create a simple hash for the input
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `${type}_${hash}`;
  }

  get<T>(type: keyof typeof CACHE_CONFIG, input: string): T | null {
    const key = this.generateKey(type, input);
    const entry = this.memoryCache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.memoryCache.delete(key);
      this.saveToStorage();
      return null;
    }
    
    return entry.data;
  }

  set<T>(type: keyof typeof CACHE_CONFIG, input: string, data: T): void {
    const key = this.generateKey(type, input);
    const ttl = CACHE_CONFIG[type] || CACHE_CONFIG.coaching;
    const now = Date.now();
    
    // Enforce max entries (simple LRU - remove oldest)
    if (this.memoryCache.size >= CACHE_CONFIG.maxEntries) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      
      this.memoryCache.forEach((entry, k) => {
        if (entry.timestamp < oldestTime) {
          oldestTime = entry.timestamp;
          oldestKey = k;
        }
      });
      
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }
    
    this.memoryCache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl,
    });
    
    this.saveToStorage();
  }

  clear(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }

  // Get cache stats
  getStats(): { size: number; types: Record<string, number> } {
    const types: Record<string, number> = {};
    
    this.memoryCache.forEach((_, key) => {
      const type = key.split('_')[0];
      types[type] = (types[type] || 0) + 1;
    });
    
    return {
      size: this.memoryCache.size,
      types,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// RATE LIMITER
// ─────────────────────────────────────────────────────────────────────────────────

class AIRateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private storageKey = 'ascend_ai_rate_limits';

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([key, value]) => {
          this.limits.set(key, value as RateLimitEntry);
        });
      }
    } catch (error) {
      console.warn('Failed to load rate limits from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const limitsObj: Record<string, RateLimitEntry> = {};
      this.limits.forEach((value, key) => {
        limitsObj[key] = value;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(limitsObj));
    } catch (error) {
      console.warn('Failed to save rate limits to storage:', error);
    }
  }

  check(type: keyof typeof RATE_LIMITS): { allowed: boolean; remaining: number; resetIn: number } {
    const config = RATE_LIMITS[type];
    const now = Date.now();
    
    // Check type-specific limit
    const typeKey = `type_${type}`;
    let typeEntry = this.limits.get(typeKey);
    
    if (!typeEntry || now > typeEntry.resetAt) {
      typeEntry = { count: 0, resetAt: now + config.windowMs };
      this.limits.set(typeKey, typeEntry);
    }
    
    // Check global limit
    const globalKey = 'global';
    let globalEntry = this.limits.get(globalKey);
    
    if (!globalEntry || now > globalEntry.resetAt) {
      globalEntry = { count: 0, resetAt: now + RATE_LIMITS.global.windowMs };
      this.limits.set(globalKey, globalEntry);
    }
    
    const typeRemaining = config.maxRequests - typeEntry.count;
    const globalRemaining = RATE_LIMITS.global.maxRequests - globalEntry.count;
    const remaining = Math.min(typeRemaining, globalRemaining);
    
    const typeResetIn = Math.max(0, typeEntry.resetAt - now);
    const globalResetIn = Math.max(0, globalEntry.resetAt - now);
    const resetIn = Math.min(typeResetIn, globalResetIn);
    
    return {
      allowed: remaining > 0,
      remaining,
      resetIn,
    };
  }

  consume(type: keyof typeof RATE_LIMITS): boolean {
    const status = this.check(type);
    
    if (!status.allowed) {
      return false;
    }
    
    // Increment counters
    const typeKey = `type_${type}`;
    const typeEntry = this.limits.get(typeKey)!;
    typeEntry.count++;
    
    const globalEntry = this.limits.get('global')!;
    globalEntry.count++;
    
    this.saveToStorage();
    return true;
  }

  getUsage(): Record<string, { used: number; max: number; resetIn: number }> {
    const now = Date.now();
    const usage: Record<string, { used: number; max: number; resetIn: number }> = {};
    
    (Object.keys(RATE_LIMITS) as (keyof typeof RATE_LIMITS)[]).forEach((type) => {
      const config = RATE_LIMITS[type];
      const key = type === 'global' ? 'global' : `type_${type}`;
      const entry = this.limits.get(key);
      
      if (entry && now < entry.resetAt) {
        usage[type] = {
          used: entry.count,
          max: config.maxRequests,
          resetIn: entry.resetAt - now,
        };
      } else {
        usage[type] = {
          used: 0,
          max: config.maxRequests,
          resetIn: config.windowMs,
        };
      }
    });
    
    return usage;
  }

  reset(): void {
    this.limits.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────────
// SINGLETON INSTANCES
// ─────────────────────────────────────────────────────────────────────────────────

let cacheInstance: AICache | null = null;
let rateLimiterInstance: AIRateLimiter | null = null;

export function getAICache(): AICache {
  if (!cacheInstance) {
    cacheInstance = new AICache();
  }
  return cacheInstance;
}

export function getAIRateLimiter(): AIRateLimiter {
  if (!rateLimiterInstance) {
    rateLimiterInstance = new AIRateLimiter();
  }
  return rateLimiterInstance;
}

// ─────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────────

export type CacheType = 'coaching' | 'suggestions' | 'insights' | 'decomposition';

export interface CachedAICall<T> {
  data: T;
  fromCache: boolean;
  provider?: string;
}

/**
 * Wrapper for AI calls with caching and rate limiting
 */
export async function cachedAICall<T>(
  type: CacheType,
  cacheKey: string,
  aiCallFn: () => Promise<T>,
  options: {
    skipCache?: boolean;
    skipRateLimit?: boolean;
  } = {}
): Promise<CachedAICall<T>> {
  const cache = getAICache();
  const rateLimiter = getAIRateLimiter();
  
  // Check cache first (unless skipped)
  if (!options.skipCache) {
    const cached = cache.get<T>(type, cacheKey);
    if (cached) {
      return { data: cached, fromCache: true };
    }
  }
  
  // Check rate limit
  if (!options.skipRateLimit) {
    const status = rateLimiter.check(type);
    if (!status.allowed) {
      const minutes = Math.ceil(status.resetIn / 60000);
      throw new Error(`Rate limit exceeded. Try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`);
    }
    
    // Consume the rate limit
    rateLimiter.consume(type);
  }
  
  // Make the AI call
  const data = await aiCallFn();
  
  // Cache the result
  if (!options.skipCache) {
    cache.set(type, cacheKey, data);
  }
  
  return { data, fromCache: false };
}

/**
 * Format remaining time for display
 */
export function formatResetTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

// Export types and configs
export { CACHE_CONFIG, RATE_LIMITS };
