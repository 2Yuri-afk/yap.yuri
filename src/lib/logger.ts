/* eslint-disable @typescript-eslint/no-explicit-any */
import pino from 'pino';
import type { NextApiRequest, NextApiResponse } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

// Create base logger configuration
const baseConfig = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
        translateTime: 'HH:MM:ss Z',
      },
    },
  }),
  ...(isTest && {
    level: 'silent', // Silence logs during tests
  }),
  serializers: {
    req: (req: NextApiRequest) => ({
      id: req.headers['x-request-id'],
      method: req.method,
      url: req.url,
      query: req.query,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
      },
      remoteAddress: req.socket?.remoteAddress,
      remotePort: req.socket?.remotePort,
    }),
    res: (res: NextApiResponse) => ({
      statusCode: res.statusCode,
      headers: res.getHeaders(),
    }),
    error: pino.stdSerializers.err,
  },
  // Add metadata for production
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GIT_COMMIT_SHA,
    version: process.env.npm_package_version,
  },
  // Redact sensitive fields
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.apiKey',
      '*.secret',
      '*.email',
    ],
    censor: '[REDACTED]',
  },
};

// Create the logger instance
const logger = pino(baseConfig);

// Create child loggers for different contexts
export const createLogger = (context: string) => {
  return logger.child({ context });
};

// HTTP request logger middleware
export const httpLogger = (req: NextApiRequest, res: NextApiResponse) => {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();

  // Add request ID to headers
  res.setHeader('x-request-id', requestId);

  // Create request-specific logger
  const requestLogger = logger.child({ requestId });

  // Log request
  requestLogger.info({ req }, 'Request received');

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const duration = Date.now() - start;
    requestLogger.info(
      {
        res,
        duration,
        responseTime: `${duration}ms`,
      },
      'Request completed'
    );
    return originalEnd.apply(res, args as any);
  };

  return requestLogger;
};

// Edge function logger (for middleware)
export const edgeLogger = createLogger('edge');

// Structured logging helpers
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error({ error, ...context }, error.message);
};

export const logWarning = (message: string, context?: Record<string, any>) => {
  logger.warn(context || {}, message);
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info(context || {}, message);
};

export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug(context || {}, message);
};

// Performance logging
export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  const level = duration > 1000 ? 'warn' : 'info';
  logger[level](
    {
      operation,
      duration,
      durationMs: `${duration}ms`,
      ...metadata,
    },
    `Operation ${operation} took ${duration}ms`
  );
};

// Audit logging for sensitive operations
export const logAudit = (
  action: string,
  userId: string,
  metadata?: Record<string, any>
) => {
  logger.info(
    {
      type: 'audit',
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...metadata,
    },
    `Audit: ${action} by user ${userId}`
  );
};

// Export the base logger for custom use cases
export default logger;

// Export stream for integration with other tools (e.g., Morgan, Datadog)
export const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, flushing logs...');
    logger.flush();
  });

  process.on('uncaughtException', error => {
    logger.fatal({ error }, 'Uncaught exception');
    logger.flush();
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.fatal({ reason, promise }, 'Unhandled rejection');
    logger.flush();
    process.exit(1);
  });
}
