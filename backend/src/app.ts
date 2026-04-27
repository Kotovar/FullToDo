import '@swagger/extend';
import { Server as HttpServer } from 'http';
import type { Application } from 'express';
import { createHttpServer, createExpressServer } from './servers';
import { config, ServerType } from './configs';
import { runMigrations } from '@db/postgres';
import { connectRedis } from '@db/redis';
import { serverLogger } from './logger';

const {
  server: { type, port },
  db: { type: dbType },
} = config;

const servers: Record<ServerType, () => HttpServer | Application> = {
  http: createHttpServer,
  express: createExpressServer,
  // TODO: Заменить после реализации nextJs сервера
  nextJs: createExpressServer,
};

const app = servers[type]();

const exitOnStartupError = (message: string) => (err: unknown) => {
  serverLogger.error({ err }, message);
  process.exit(1);
};

const startDependencies = async () => {
  if (dbType === 'postgres') {
    await runMigrations();
  }

  await connectRedis();
};

if (app instanceof HttpServer) {
  app.on('error', (err: Error) => {
    exitOnStartupError('Server failed to start')(err);
  });
}

export const httpServer = app.listen(port, () => {
  serverLogger.info({ port }, 'Server started');
});

startDependencies().catch(exitOnStartupError('Server dependencies failed'));
