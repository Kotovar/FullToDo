import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './server';

export function setupMockServer() {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
