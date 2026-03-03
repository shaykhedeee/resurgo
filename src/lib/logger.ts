// ═══════════════════════════════════════════════════════════════════════════════
// RESURGO — Production Logger
// Structured logging utility for server-side API routes.
// In production: suppresses debug/info logs. In dev: full output.
// Replaces scattered console.log calls with a consistent, filterable format.
// ═══════════════════════════════════════════════════════════════════════════════

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const MIN_LEVEL: LogLevel = IS_PRODUCTION ? 'warn' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatMessage(level: LogLevel, tag: string, message: string, data?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}] [${tag}]`;
  if (data && Object.keys(data).length > 0) {
    return `${prefix} ${message} ${JSON.stringify(data)}`;
  }
  return `${prefix} ${message}`;
}

/**
 * Create a scoped logger for a specific module/route.
 *
 * @example
 *   const log = createLogger('Coach');
 *   log.info('Request received', { userId: '123' });
 *   log.error('AI call failed', { provider: 'groq', err: e.message });
 */
export function createLogger(tag: string) {
  return {
    debug(message: string, data?: Record<string, unknown>) {
      if (shouldLog('debug')) {
        console.debug(formatMessage('debug', tag, message, data));
      }
    },
    info(message: string, data?: Record<string, unknown>) {
      if (shouldLog('info')) {
        console.info(formatMessage('info', tag, message, data));
      }
    },
    warn(message: string, data?: Record<string, unknown>) {
      if (shouldLog('warn')) {
        console.warn(formatMessage('warn', tag, message, data));
      }
    },
    error(message: string, data?: Record<string, unknown>) {
      if (shouldLog('error')) {
        console.error(formatMessage('error', tag, message, data));
      }
    },
  };
}

/** Default logger for quick one-off usage */
export const logger = createLogger('Resurgo');
