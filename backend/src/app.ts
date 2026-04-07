import '@swagger/extend';
import { Server as HttpServer } from 'http';
import type { Application } from 'express';
import { createHttpServer, createExpressServer } from './servers';
import { config, ServerType } from './configs';
import { initDb } from '@db/postgres';
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

if (app instanceof HttpServer) {
  app.on('error', (err: Error) => {
    serverLogger.error({ err }, 'Server failed to start');
    process.exit(1);
  });
}

export const httpServer = app.listen(port, () => {
  serverLogger.info({ port }, 'Server started');
});

if (dbType === 'postgres') {
  initDb().catch(() => process.exit(1));
}
