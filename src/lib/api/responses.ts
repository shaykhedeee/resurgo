// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Centralized API Response Utilities
// Standardized response schemas for all API endpoints
// Ensures consistent error handling, logging, and client expectations
// ═══════════════════════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server';

/**
 * Standardized API response envelope
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId?: string;
}

/**
 * Standardized error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  traceId?: string;
}

/**
 * HTTP status code mappings
 */
const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Create a successful API response
 */
export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    } as ApiResponse<T>,
    { status }
  );
}

/**
 * Create an error API response
 */
export function apiError(
  code: string,
  message: string,
  statusCode: number,
  details?: Record<string, unknown>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
    } as ApiResponse,
    { status: statusCode }
  );
}

/**
 * Validation error response
 */
export function apiBadRequest(message: string, details?: Record<string, unknown>) {
  return apiError('BAD_REQUEST', message, STATUS_CODES.BAD_REQUEST, details);
}

/**
 * Authentication error response
 */
export function apiUnauthorized(message = 'Authentication required') {
  return apiError('UNAUTHORIZED', message, STATUS_CODES.UNAUTHORIZED);
}

/**
 * Authorization error response
 */
export function apiForbidden(message = 'Access denied') {
  return apiError('FORBIDDEN', message, STATUS_CODES.FORBIDDEN);
}

/**
 * Not found error response
 */
export function apiNotFound(resource: string) {
  return apiError('NOT_FOUND', `${resource} not found`, STATUS_CODES.NOT_FOUND);
}

/**
 * Conflict error response (e.g., duplicate resource)
 */
export function apiConflict(message: string) {
  return apiError('CONFLICT', message, STATUS_CODES.CONFLICT);
}

/**
 * Rate limit error response
 */
export function apiRateLimited(retryAfter?: number) {
  const response = apiError(
    'RATE_LIMITED',
    'Too many requests. Please try again later.',
    STATUS_CODES.RATE_LIMITED
  );
  if (retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }
  return response;
}

/**
 * Internal server error response
 */
export function apiInternalError(message = 'Internal server error', details?: Record<string, unknown>) {
  return apiError('INTERNAL_ERROR', message, STATUS_CODES.INTERNAL_ERROR, details);
}

/**
 * Service unavailable error response
 */
export function apiServiceUnavailable(message = 'Service temporarily unavailable') {
  return apiError('SERVICE_UNAVAILABLE', message, STATUS_CODES.SERVICE_UNAVAILABLE);
}

/**
 * Safely extract error message from unknown error
 */
export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Extract error code from error object
 */
export function extractErrorCode(error: unknown): string {
  if (error instanceof Error && 'code' in error) {
    const maybeCode = (error as { code?: unknown }).code;
    return typeof maybeCode === 'string' && maybeCode.length > 0 ? maybeCode : 'UNKNOWN_ERROR';
  }
  return 'UNKNOWN_ERROR';
}
