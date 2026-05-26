import type { NextFunction, Request, Response } from 'express';
import { serverLogger } from '@logger';

/**
 * Express middleware для логирования HTTP-запросов.
 *
 * Логирует метод, URL, статус-код и длительность запроса
 * после завершения ответа (событие `finish`).
 */
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  res.on('finish', () => {
    serverLogger.info(
      {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: Date.now() - start,
      },
      'Request completed',
    );
  });
  next();
};
