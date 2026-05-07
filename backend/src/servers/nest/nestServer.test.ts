import { describe, expect, test } from 'vitest';
import { createNestServer } from './nestServer';

describe('nestServer start/close', () => {
  test('should create, start, and stop the server', async () => {
    const app = await createNestServer();

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
