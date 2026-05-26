import { describe, test, expect } from 'vitest';
import { createExpressServer } from './expressServer';

const app = createExpressServer();

describe('expressServer start/close', () => {
  test('should start and stop the server', async () => {
    const server = await new Promise<ReturnType<typeof app.listen>>(resolve => {
      const listeningServer = app.listen(0, () => {
        resolve(listeningServer);
      });
    });

    expect(server.listening).toBe(true);

    await new Promise<void>(resolve => {
      server.close(() => resolve());
    });
    expect(server.listening).toBe(false);
  });
});
