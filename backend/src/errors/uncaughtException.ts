import type { Server } from 'http';
import { uncaughtExceptionLogger } from '@logger/commonErrors';
import { config } from '@configs';
import { pool } from '@db/postgres';

const {
  db: { type: dbType },
} = config;

let isShuttingDown = false;
const TIMEOUT_MS = 5000;

const closeDependencies = async () => {
  if (dbType === 'postgres') {
    await pool.end();
  }
};

export const registerGlobalErrorHandlers = (
  httpServerPromise: Promise<Server>,
) => {
  const shutdownGracefully = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    uncaughtExceptionLogger.warn('Shutting down gracefully...');

    const forceShutdownTimer = setTimeout(() => {
      uncaughtExceptionLogger.error('Force shutdown');
      process.exit(1);
    }, TIMEOUT_MS).unref();

    try {
      const server = await httpServerPromise;

      server.close(async () => {
        try {
          await closeDependencies();
        } finally {
          clearTimeout(forceShutdownTimer);
          process.exit(1);
        }
      });
    } catch {
      try {
        await closeDependencies();
      } finally {
        clearTimeout(forceShutdownTimer);
        process.exit(1);
      }
    }
  };

  process.on('uncaughtException', err => {
    uncaughtExceptionLogger.error({ err }, 'FATAL');
    void shutdownGracefully();
  });

  process.on('unhandledRejection', reason => {
    uncaughtExceptionLogger.error({ err: reason }, 'FATAL (rejection)');
    void shutdownGracefully();
  });
};
