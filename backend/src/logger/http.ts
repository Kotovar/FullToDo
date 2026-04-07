import pino from 'pino';

export const httpLogger =
  process.env.NODE_ENV !== 'production'
    ? pino({
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }).child({ layer: 'http' })
    : null;
