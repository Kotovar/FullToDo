import { createClient } from 'redis';
import { config } from '@configs';
import { serverLogger } from '@logger';

export const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

redisClient.on('error', err => {
  serverLogger.error({ err }, 'Redis error');
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
