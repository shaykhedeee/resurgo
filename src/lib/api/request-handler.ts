// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — API Request Handler Wrapper
// Standardized request handling with logging, error handling, and monitoring
// ═══════════════════════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from '@/lib/logger';

const log = createLogger('API');

/**
 * Request context for logging and tracing
 */
export interface RequestContext {
  method: string;
  path: string;
  duration: number;
  status: number;
  error?: string;
  requestId: string;
}

/**
 * Generate unique request ID for tracing
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Wrap API route handler with standardized error handling and logging
 *
 * @param handler - The actual route handler
 * @param options - Configuration options
 * @returns Wrapped handler with error handling
 *
 * @example
 * export const POST = withRequestHandler(async (req, context) => {
 *   const data = await req.json();
 *   return apiSuccess(data);
 * });
 */
export function withRequestHandler(
  handler: (
    req: NextRequest,
    context: { requestId: string; log: ReturnType<typeof createLogger> }
  ) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    validateContentType?: string;
    rateLimit?: { max: number; windowMs: number };
  } = {}
) {
  return async (req: NextRequest) => {
    const requestId = generateRequestId();
    const startTime = performance.now();
    const context = {
      path: new URL(req.url).pathname,
      method: req.method,
      requestId,
    };

    try {
      log.debug(`${context.method} ${context.path} started`, { requestId });

      // Validate content type if required
      if (options.validateContentType) {
        const contentType = req.headers.get('content-type');
        if (!contentType?.includes(options.validateContentType)) {
          const duration = performance.now() - startTime;
          log.warn(`Invalid content type for ${context.path}`, {
            requestId,
            expected: options.validateContentType,
            received: contentType,
            duration,
          });
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVALID_CONTENT_TYPE',
                message: `Expected ${options.validateContentType}`,
              },
            },
            { status: 400 }
          );
        }
      }

      // Execute handler
      const response = await handler(req, { requestId, log });

      const duration = performance.now() - startTime;
      log.info(`${context.method} ${context.path} completed`, {
        requestId,
        status: response.status,
        duration: `${duration.toFixed(2)}ms`,
      });

      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      const errorMsg = error instanceof Error ? error.message : String(error);

      log.error(`${context.method} ${context.path} failed`, {
        requestId,
        error: errorMsg,
        duration: `${duration.toFixed(2)}ms`,
      });

      // Don't expose internal error details in production
      const isProduction = process.env.NODE_ENV === 'production';
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INTERNAL_ERROR',
            message: isProduction ? 'Internal server error' : errorMsg,
          },
          requestId,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Extract and validate bearer token from request
 */
export function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

/**
 * Check if request has valid authorization
 */
export function hasAuthorization(req: NextRequest, requiredToken?: string): boolean {
  const token = extractBearerToken(req);
  if (!token) {
    return false;
  }
  if (requiredToken) {
    return token === requiredToken;
  }
  return true;
}
