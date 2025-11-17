import * as winston from 'winston';

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
    ({ timestamp, level, message, metadata, stack, requestId }) => {
      const metaStr =
        Object.keys(metadata || {}).length > 0
          ? ` ${JSON.stringify(metadata)}`
          : '';
      const stackStr = stack ? `\n${stack}` : '';
      return `[${timestamp}] ${level} {${requestId}}: ${message}${metaStr}${stackStr}`;
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

export function createLogger(request: Request, requestId: string): Logger {
  const url = new URL(request.url);

  const baseMeta = {
    requestId,
    method: request.method,
    url: url.pathname + url.search,
    userAgent: request.headers.get('user-agent'),
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
          duration: `${duration.toFixed(2)}ms`,
          label,
        });
      };
    },
  };

  return logger;
}
