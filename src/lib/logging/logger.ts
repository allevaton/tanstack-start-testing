import * as winston from 'winston';
import { getClientInfo } from '@/lib/client-info/client-info.ts';
import { getRequest } from '@tanstack/start-server-core';
import { createIsomorphicFn } from '@tanstack/react-start';

export interface Logger {
  debug(message: string, meta?: object): void;
  info(message: string, meta?: object): void;
  warn(message: string, meta?: object): void;
  error(message: string, meta?: object): void;
  http(message: string, meta?: object): void;
  timer(label: string): () => void;
}

const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
  winston.format.json(),
);

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  winston.format.printf(
    ({ timestamp, context, level, message, metadata, stack, requestId }) => {
      const metaStr =
        Object.keys(metadata || {}).length > 0
          ? ` ${JSON.stringify(metadata)}`
          : '';
      const stackStr = stack ? `\n${stack}` : '';

      const clientOrServerStr =
        typeof window === 'undefined' ? 'SERVER' : 'CLIENT';

      const left = `${timestamp} [${clientOrServerStr}:${context}] ${level}:`;
      return `${left} ${message}${metaStr}${stackStr}`;
    },
  ),
);

const winstonLogger = winston.createLogger({
  level: logLevel,
  format: isDevelopment ? developmentFormat : productionFormat,
  defaultMeta: { service: 'tanstack-start-testing' },
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
});

function createLogger(request: Request, context: string): Logger {
  const url = new URL(request.url);
  const clientInfo = getClientInfo(request);

  const baseMeta = {
    context,
    requestId: clientInfo.requestId,
    clientId: clientInfo.clientId,
    method: request.method,
    url: url.pathname + url.search,
    userAgent: clientInfo.userAgent,
    ip:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip'),
  };

  const logger: Logger = {
    debug: (message, metadata = {}) => {
      winstonLogger.debug(message, { ...baseMeta, metadata });
    },
    info: (message, metadata = {}) => {
      winstonLogger.info(message, { ...baseMeta, metadata });
    },
    warn: (message, metadata = {}) => {
      winstonLogger.warn(message, { ...baseMeta, metadata });
    },
    error: (message, metadata = {}) => {
      winstonLogger.error(message, { ...baseMeta, metadata });
    },
    http: (message, metadata = {}) => {
      winstonLogger.http(message, { ...baseMeta, metadata });
    },
    timer: (label: string) => {
      const startTime = performance.now();
      return () => {
        const duration = performance.now() - startTime;
        winstonLogger.info(`Timer: ${label}`, {
          ...baseMeta,
          metadata: {
            duration: `${duration.toFixed(2)}ms`,
          },
        });
      };
    },
  };

  return logger;
}

export const getLogger = createIsomorphicFn()
  .server((context: string) => createLogger(getRequest(), context))
  .client((context: string) => {
    const logger: Logger = {
      debug: (message, meta) => console.debug(`[${context}] ${message}`, meta),
      info: (message, meta) => console.info(`[${context}] ${message}`, meta),
      warn: (message, meta) => console.warn(`[${context}] ${message}`, meta),
      error: (message, meta) => console.error(`[${context}] ${message}`, meta),
      http: (message, meta) => console.log(`[${context}] ${message}`, meta),
      timer: (label: string) => {
        const startTime = performance.now();
        return () => {
          const duration = performance.now() - startTime;
          console.info(
            `[${context}] Timer: ${label} - ${duration.toFixed(2)}ms`,
          );
        };
      },
    };

    return logger;
  });
