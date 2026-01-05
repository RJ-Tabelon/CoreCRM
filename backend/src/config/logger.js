import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';
const logToFile = (process.env.LOG_TO_FILE || '').toLowerCase() === 'true';

const baseFormat = isProduction
  ? winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  : winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
        const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} ${level}: ${stack || message}${rest}`;
      })
    );

const transports = [
  new winston.transports.Console({
    stderrLevels: ['error'],
  }),
];

if (logToFile) {
  try {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      })
    );
  } catch (e) {
    // If the filesystem isn't writable/mounted, stay on console logging.
    // Winston File transport can throw during construction in some environments.
    // eslint-disable-next-line no-console
    console.warn(
      'LOG_TO_FILE=true but file transport failed; using console only',
      e
    );
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: baseFormat,
  defaultMeta: { service: 'corecrm-api' },
  transports,
});

export default logger;
