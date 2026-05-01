import { redisClient } from '@db/redis/client';
import { TooManyRequestsError } from '@errors';

export type RateLimitOptions = {
  keyPrefix: string;
  maxRequests: number;
  windowSeconds: number;
  consume?: boolean;
};

/**
 * Ограничивает количество запросов для готового rate-limit ключа.
 *
 * Серверные адаптеры отвечают только за извлечение идентификатора клиента
 * (например IP), а эта функция хранит счетчики в Redis и проверяет лимит.
 */
export const consumeRateLimit = async (
  key: string,
  { maxRequests, windowSeconds, consume = true }: RateLimitOptions,
) => {
  if (!consume) {
    const currentCount = Number((await redisClient.get(key)) ?? 0);

    if (currentCount >= maxRequests) {
      throw new TooManyRequestsError(`Too many attempts. Try again later.`);
    }

    return;
  }

  const count = await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(key, windowSeconds);
  }

  if (count > maxRequests) {
    throw new TooManyRequestsError(`Too many attempts. Try again later.`);
  }
};
