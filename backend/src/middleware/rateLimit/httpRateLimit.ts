import type { HttpContext } from '@controllers/types';
import { consumeRateLimit, type RateLimitOptions } from './rateLimit';

/**
 * Извлекает IP-адрес клиента из HTTP-запроса.
 *
 * Сначала проверяет заголовок `X-Forwarded-For`, который обычно добавляют
 * reverse proxy или load balancer. Если заголовка нет, использует адрес
 * сокета Node.js.
 *
 * @param ctx - HTTP-контекст текущего запроса.
 * @returns IP-адрес клиента или строку `unknown`, если адрес определить не удалось.
 */
const getClientIp = (ctx: HttpContext) => {
  const forwardedFor = ctx.req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }

  return ctx.req.socket.remoteAddress ?? 'unknown';
};

/**
 * Ограничивает количество запросов к endpoint за фиксированное временное окно.
 *
 * Для каждого сочетания `keyPrefix + IP` в Redis создаётся отдельный счётчик.
 * Первый запрос создаёт ключ и выставляет TTL, последующие запросы только
 * увеличивают счётчик. Когда TTL истекает, Redis удаляет ключ, и окно лимита
 * начинается заново.
 *
 * @param ctx - HTTP-контекст текущего запроса.
 * @param options - настройки лимита.
 * @param options.keyPrefix - логический префикс ключа, например `auth:login`.
 * @param options.maxRequests - максимальное число запросов за окно.
 * @param options.windowSeconds - длительность окна в секундах.
 * @param options.consume - увеличивать ли счётчик. Если false, только проверяет текущий лимит.
 * @throws TooManyRequestsError если лимит запросов превышен.
 */
export const httpRateLimit = async (
  ctx: HttpContext,
  options: RateLimitOptions,
) => {
  const ip = getClientIp(ctx);
  const key = `rate-limit:${options.keyPrefix}:${ip}`;

  await consumeRateLimit(key, options);
};
