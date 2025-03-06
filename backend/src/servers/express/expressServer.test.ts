import { describe, test, expect } from 'vitest';
import { createExpressServer } from './expressServer';

const port = 3000;
const app = createExpressServer();

describe('expressServer start/close', () => {
  test('should start and stop the server', async () => {
    const server = app.listen(port);
    expect(server.listening).toBe(true);

    await new Promise(resolve => server.close(resolve));
    expect(server.listening).toBe(false);
  });
});
