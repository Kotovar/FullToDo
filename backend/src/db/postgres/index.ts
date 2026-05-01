import { connectPostgres } from './db';
import { runMigrations } from './migrate';

export * from './db';
export * from './queryBuilder';
export * from './migrate';

export const initializePostgres = async () => {
  await connectPostgres();
  await runMigrations();
};
