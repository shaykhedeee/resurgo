// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO - Security Middleware & Utilities
// Rate limiting, input sanitization, CSRF protection
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';

const APP_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '').toLowerCase();
}

export function isTrustedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  const allowedOrigins = new Set<string>([
    APP_ORIGIN,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean).map((value) => normalizeOrigin(value as string)));

  const requestOrigin = normalizeOrigin(origin);
  if (allowedOrigins.has(requestOrigin)) {
    return true;
  }

  const host = request.headers.get('host');
  if (host) {
    const expectedHttp = normalizeOrigin(`http://${host}`);
    const expectedHttps = normalizeOrigin(`https://${host}`);
    return requestOrigin === expectedHttp || requestOrigin === expectedHttps;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

// In-memory rate limit store (for production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute window
  maxRequests: 60, // 60 requests per minute
  blockDurationMs: 5 * 60 * 1000, // 5 minute block
  
  // Specific limits for different routes
  routes: {
    '/api/ai': { maxRequests: 20, windowMs: 60 * 1000 }, // 20 AI requests/min
    '/api/auth': { maxRequests: 5, windowMs: 60 * 1000 }, // 5 auth attempts/min
    '/api/payment': { maxRequests: 10, windowMs: 60 * 1000 }, // 10 payment requests/min
  } as Record<string, { maxRequests: number; windowMs: number }>,
};

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Get rate limit config for a specific route
 */
function getRouteConfig(pathname: string): { maxRequests: number; windowMs: number } {
  // Check for specific route configs
  for (const [route, config] of Object.entries(RATE_LIMIT_CONFIG.routes)) {
    if (pathname.startsWith(route)) {
      return config;
    }
  }
  
  // Default config
  return {
    maxRequests: RATE_LIMIT_CONFIG.maxRequests,
    windowMs: RATE_LIMIT_CONFIG.windowMs,
  };
}

/**
 * Rate limiting middleware function
 */
export function rateLimit(request: NextRequest): { allowed: boolean; retryAfter?: number } {
  const clientIP = getClientIP(request);
  const pathname = request.nextUrl.pathname;
  const key = `${clientIP}:${pathname}`;
  const now = Date.now();
  const config = getRouteConfig(pathname);
  
  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance per request
    cleanupRateLimitStore();
  }
  
  let entry = rateLimitStore.get(key);
  
  // Check if currently blocked
  if (entry?.blocked && entry.blockedUntil) {
    if (now < entry.blockedUntil) {
      return {
        allowed: false,
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }
    // Block period expired, reset
    entry = undefined;
  }
  
  if (!entry || now - entry.firstRequest > config.windowMs) {
    // New window
    rateLimitStore.set(key, {
      count: 1,
      firstRequest: now,
      blocked: false,
    });
    return { allowed: true };
  }
  
  // Within window
  entry.count++;
  
  if (entry.count > config.maxRequests) {
    // Too many requests, block
    entry.blocked = true;
    entry.blockedUntil = now + RATE_LIMIT_CONFIG.blockDurationMs;
    rateLimitStore.set(key, entry);
    
    return {
      allowed: false,
      retryAfter: Math.ceil(RATE_LIMIT_CONFIG.blockDurationMs / 1000),
    };
  }
  
  rateLimitStore.set(key, entry);
  return { allowed: true };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupRateLimitStore(): void {
  const now = Date.now();
  const maxAge = RATE_LIMIT_CONFIG.windowMs * 2;
  
  rateLimitStore.forEach((entry, key) => {
    if (now - entry.firstRequest > maxAge) {
      rateLimitStore.delete(key);
    }
  });
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(retryAfter: number): NextResponse {
  return NextResponse.json(
    {
      error: 'Too many requests',
      message: 'Please slow down and try again later.',
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────────
// INPUT SANITIZATION
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * HTML entities to escape
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize a string by removing potentially dangerous content
 */
export function sanitizeString(input: string, options: {
  maxLength?: number;
  allowHtml?: boolean;
  allowNewlines?: boolean;
} = {}): string {
  const { maxLength = 10000, allowHtml = false, allowNewlines = true } = options;
  
  let sanitized = input;
  
  // Trim and limit length
  sanitized = sanitized.trim().slice(0, maxLength);
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove control characters except newlines/tabs if allowed
  if (allowNewlines) {
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  } else {
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, ' ');
  }
  
  // Escape HTML if not allowed
  if (!allowHtml) {
    sanitized = escapeHtml(sanitized);
  }
  
  return sanitized;
}

/**
 * Sanitize an email address
 */
export function sanitizeEmail(email: string): string {
  const sanitized = email.trim().toLowerCase().slice(0, 254);
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Sanitize a URL
 */
export function sanitizeUrl(url: string): string {
  const sanitized = url.trim().slice(0, 2048);
  
  // Only allow http, https, and relative URLs
  if (
    sanitized.startsWith('http://') ||
    sanitized.startsWith('https://') ||
    sanitized.startsWith('/')
  ) {
    // Block javascript: and data: protocols
    if (
      sanitized.toLowerCase().includes('javascript:') ||
      sanitized.toLowerCase().includes('data:')
    ) {
      return '';
    }
    return sanitized;
  }
  
  return '';
}

/**
 * Sanitize an object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (value === null) {
      sanitized[key] = null;
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string'
          ? sanitizeString(item)
          : typeof item === 'object' && item !== null
          ? sanitizeObject(item as Record<string, unknown>)
          : item
      );
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    }
  }
  
  return sanitized as T;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CSRF PROTECTION
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * CSRF token header name
 */
export const CSRF_HEADER = 'x-csrf-token';
export const CSRF_COOKIE = 'csrf-token';

/**
 * Validate CSRF token from request
 */
export function validateCSRFToken(request: NextRequest): boolean {
  const headerToken = request.headers.get(CSRF_HEADER);
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  
  if (!headerToken || !cookieToken) {
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  if (headerToken.length !== cookieToken.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < headerToken.length; i++) {
    result |= headerToken.charCodeAt(i) ^ cookieToken.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Set CSRF cookie in response
 */
export function setCSRFCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
  
  return response;
}

// ─────────────────────────────────────────────────────────────────────────────────
// API ROUTE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────────

interface SecureApiOptions {
  rateLimit?: boolean;
  csrf?: boolean;
  sanitize?: boolean;
  allowedMethods?: string[];
}

/**
 * Wrap an API route handler with security middleware
 */
export function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: SecureApiOptions = {}
): (request: NextRequest) => Promise<NextResponse> {
  const {
    rateLimit: enableRateLimit = true,
    csrf: enableCSRF = true,
    sanitize: _enableSanitize = true,
    allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  } = options;
  
  return async (request: NextRequest): Promise<NextResponse> => {
    // Method check
    if (!allowedMethods.includes(request.method)) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      ));
    }
    
    // Rate limiting
    if (enableRateLimit) {
      const { allowed, retryAfter } = rateLimit(request);
      if (!allowed && retryAfter) {
        return addSecurityHeaders(rateLimitResponse(retryAfter));
      }
    }

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method) && !isTrustedOrigin(request)) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      ));
    }
    
    // CSRF validation for state-changing requests
    if (enableCSRF && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      if (!validateCSRFToken(request)) {
        return addSecurityHeaders(NextResponse.json(
          { error: 'Invalid CSRF token' },
          { status: 403 }
        ));
      }
    }
    
    // Input sanitization is handled by the individual handlers
    // by using sanitizeObject() on request body
    
    // Call the actual handler
    try {
      const response = await handler(request);
      return addSecurityHeaders(response);
    } catch (error) {
      console.error('API Error:', error);
      return addSecurityHeaders(NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      ));
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────────
// SECURITY HEADERS
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Security headers to add to all responses
 */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'X-DNS-Prefetch-Control': 'off',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Origin-Agent-Cluster': '?1',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.openai.com https://api.puter.com https://api.groq.com https://generativelanguage.googleapis.com https://openrouter.ai https://*.convex.cloud wss://*.convex.cloud",
    "frame-ancestors 'none'",
  ].join('; '),
};

/**
 * Add security headers to a response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

// ─────────────────────────────────────────────────────────────────────────────────
// HONEYPOT FIELD VALIDATION
// ─────────────────────────────────────────────────────────────────────────────────

/**
 * Check if honeypot fields are filled (bot detection)
 */
export function validateHoneypot(body: Record<string, unknown>): boolean {
  const honeypotFields = ['website', 'url', 'phone_number', 'fax'];
  
  for (const field of honeypotFields) {
    if (body[field] && typeof body[field] === 'string' && body[field] !== '') {
      return false; // Bot detected
    }
  }
  
  return true; // Valid request
}

// ─────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────────

export {
  getClientIP,
  cleanupRateLimitStore,
};
