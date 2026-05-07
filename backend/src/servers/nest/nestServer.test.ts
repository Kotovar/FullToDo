import { NestFactory } from '@nestjs/core';
import { describe, expect, test } from 'vitest';
import { AuthService, NotepadService, TaskService } from '@services';
import {
  refreshTokenRepository,
  taskRepository,
  userRepository,
} from '@repositories';
import {
  NEST_REFRESH_TOKEN_REPOSITORY,
  NEST_TASK_REPOSITORY,
  NEST_USER_REPOSITORY,
} from './common/provider-tokens';
import { AppModule } from './app.module';
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

describe('nest dependency injection', () => {
  test('should resolve existing services and repository providers', async () => {
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: false,
    });

    expect(app.get(TaskService)).toBeInstanceOf(TaskService);
    expect(app.get(NotepadService)).toBeInstanceOf(NotepadService);
    expect(app.get(AuthService)).toBeInstanceOf(AuthService);
    expect(app.get(NEST_TASK_REPOSITORY)).toBe(taskRepository);
    expect(app.get(NEST_USER_REPOSITORY)).toBe(userRepository);
    expect(app.get(NEST_REFRESH_TOKEN_REPOSITORY)).toBe(
      refreshTokenRepository,
    );

    await app.close();
  });
});
