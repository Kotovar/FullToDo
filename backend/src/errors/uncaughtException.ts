import type { Server } from 'http';
import { httpServer } from '../app';
import { uncaughtExceptionLogger } from '@logger/commonErrors';
import { config } from '@configs';
import { pool } from '@db/postgres';

const {
  db: { type: dbType },
} = config;

let isShuttingDown = false;
const TIMEOUT_MS = 5000;

const shutdownGracefully = async (server: Server) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  uncaughtExceptionLogger.warn('Shutting down gracefully...');

  server.close(async () => {
    if (dbType === 'postgres') {
      await pool.end();
    }
    process.exit(1);
  });

  setTimeout(() => {
    uncaughtExceptionLogger.error('Force shutdown');
    process.exit(1);
  }, TIMEOUT_MS).unref();
};

process.on('uncaughtException', err => {
  uncaughtExceptionLogger.error({ err }, 'FATAL');

  shutdownGracefully(httpServer);
});

process.on('unhandledRejection', reason => {
  uncaughtExceptionLogger.error({ err: reason }, 'FATAL (rejection)');

  shutdownGracefully(httpServer);
});
