import type { Request } from 'express';
import { consumeRateLimit, type RateLimitOptions } from './rateLimit';

/**
 * Извлекает IP-адрес клиента из Express-запроса.
 *
 * Сначала проверяет заголовок `X-Forwarded-For`, который обычно добавляют
 * reverse proxy или load balancer. Если заголовка нет, использует `req.ip`
 * или адрес сокета Node.js.
 */
const getClientIp = (req: Request) => {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }

  return req.ip ?? req.socket.remoteAddress ?? 'unknown';
};

/**
 * Express-адаптер rate limit.
 *
 * Преобразует Express request в стабильный Redis-ключ и делегирует проверку
 * общему Redis-лимитеру.
 */
export const expressRateLimit = async (
  req: Request,
  options: RateLimitOptions,
) => {
  const ip = getClientIp(req);
  const key = `rate-limit:${options.keyPrefix}:${ip}`;

  await consumeRateLimit(key, options);
};
