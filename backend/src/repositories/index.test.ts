import { describe, test, expect, expectTypeOf, beforeEach, vi } from 'vitest';
import { loadEnvFile } from 'node:process';
import path from 'path';

loadEnvFile(path.resolve(__dirname, '../../.env'));

describe('DB_TYPE tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };

    vi.resetModules();
  });

  test('should return MockTaskRepository when DB_TYPE is "mongo"', async () => {
    vi.resetModules();
    process.env.DB_TYPE = 'mongo';
    const { config } = await import('../configs');
    const { taskRepository } = await import('./index');

    expectTypeOf(taskRepository).toBeObject();
    expect(config.db.type).toBe('mongo');
  });

  test('should return MockTaskRepository when DB_TYPE is "postgres"', async () => {
    vi.resetModules();
    process.env.DB_TYPE = 'postgres';
    const { config } = await import('../configs');
    const { taskRepository } = await import('./index');

    expectTypeOf(taskRepository).toBeObject();
    expect(config.db.type).toBe('postgres');
  });
});
