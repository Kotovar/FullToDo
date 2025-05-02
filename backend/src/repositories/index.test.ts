import { describe, test, expect, expectTypeOf, beforeEach, vi } from 'vitest';
import { config } from 'dotenv';
import path from 'path';
import { getDbType } from './index';

config({ path: path.resolve(__dirname, '../../.env') });

describe('DB_TYPE tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };

    vi.resetModules();
  });

  test('should return MockTaskRepository when DB_TYPE is not set', async () => {
    delete process.env.DB_TYPE;

    const { taskRepository } = await import('./index');

    expectTypeOf(taskRepository).toBeObject();
    expect(getDbType()).toBe('mock');
  });

  test('should return MockTaskRepository when DB_TYPE is "mock"', async () => {
    process.env.DB_TYPE = 'mock';
    const { taskRepository } = await import('./index');

    expectTypeOf(taskRepository).toBeObject();
    expect(getDbType()).toBe('mock');
  });

  test('should return MockTaskRepository when DB_TYPE is "mongo"', async () => {
    process.env.DB_TYPE = 'mongo';
    const { taskRepository } = await import('./index');

    expectTypeOf(taskRepository).toBeObject();
    expect(getDbType()).toBe('mongo');
  });

  test('should return MockTaskRepository when DB_TYPE is "postgres"', async () => {
    process.env.DB_TYPE = 'postgres';
    const { taskRepository } = await import('./index');

    expectTypeOf(taskRepository).toBeObject();
    expect(getDbType()).toBe('postgres');
  });

  test('should return "mock" when DB_TYPE is an empty string', async () => {
    process.env.DB_TYPE = '';

    expect(getDbType()).toBe('mock');
  });
});
