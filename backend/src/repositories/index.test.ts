import { describe, test, expect, beforeEach, vi } from 'vitest';
import { loadEnvFile } from 'node:process';
import path from 'path';

loadEnvFile(path.resolve(__dirname, '../../../.env'));

describe('DB_TYPE tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };

    vi.resetModules();
  });

  test('should return Mongo repositories when DB_TYPE is "mongo"', async () => {
    vi.resetModules();
    process.env.DB_TYPE = 'mongo';
    const { config } = await import('../configs');
    const { refreshTokenRepository, taskRepository, userRepository } =
      await import('./index');

    expect(config.db.type).toBe('mongo');
    expect(taskRepository.constructor.name).toBe('MongoTaskRepository');
    expect(userRepository.constructor.name).toBe('MongoUserRepository');
    expect(refreshTokenRepository.constructor.name).toBe(
      'MongoRefreshTokenRepository',
    );
  });

  test('should return Postgres repositories when DB_TYPE is "postgres"', async () => {
    vi.resetModules();
    process.env.DB_TYPE = 'postgres';
    const { config } = await import('../configs');
    const { refreshTokenRepository, taskRepository, userRepository } =
      await import('./index');

    expect(config.db.type).toBe('postgres');
    expect(taskRepository.constructor.name).toBe('PostgresTaskRepository');
    expect(userRepository.constructor.name).toBe('PostgresUserRepository');
    expect(refreshTokenRepository.constructor.name).toBe(
      'PostgresRefreshTokenRepository',
    );
  });
});
