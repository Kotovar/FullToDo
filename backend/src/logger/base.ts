import pino from 'pino';
import path from 'path';

const FILE_SIZE_INFO = '10m';
const FILE_SIZE_ERROR = '5m';
const FILES_LIMIT_INFO = 7;
const FILES_LIMIT_ERROR = 30;

const logDir = path.resolve(__dirname, '../../../logs');

export const baseLogger = pino({
  level: 'info',
  transport: {
    targets: [
      {
        target: 'pino-roll',
        options: {
          file: path.join(logDir, 'common.log'),
          frequency: 'daily',
          size: FILE_SIZE_INFO,
          limit: { count: FILES_LIMIT_INFO },
          mkdir: true,
        },
      },
      {
        target: 'pino-roll',
        level: 'error',
        options: {
          file: path.join(logDir, 'error.log'),
          frequency: 'daily',
          size: FILE_SIZE_ERROR,
          limit: { count: FILES_LIMIT_ERROR },
          mkdir: true,
        },
      },
      ...(process.env.NODE_ENV !== 'production'
        ? [
            {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:HH:MM:ss',
                ignore: 'pid,hostname',
              },
            },
          ]
        : []),
    ],
  },
});
