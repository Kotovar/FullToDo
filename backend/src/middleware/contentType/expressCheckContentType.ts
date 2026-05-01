import type { RequestHandler } from 'express';

/**
 * Middleware для Express, проверяющее заголовок `Content-Type`.
 *
 * Разрешает только запросы с типом `application/json`.
 * Если заголовок отсутствует или не соответствует ожидаемому,
 * возвращает HTTP 400 и прерывает дальнейшую обработку.
 */
export const expressCheckContentType: RequestHandler = (req, res, next) => {
  if (!req.is('application/json')) {
    res.status(400).send('Invalid Content-Type');
    return;
  }

  next();
};
