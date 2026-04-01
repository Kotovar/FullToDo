import { DatabaseError, Pool } from 'pg';
import { config } from '@configs';

export const pool = new Pool({
  user: config.db.user,
  host: config.db.host,
  database: config.db.name,
  password: config.db.password,
  port: config.db.port,
});

export const query = async <T extends object = Record<string, unknown>>(
  text: string,
  params?: unknown[],
) => pool.query<T>(text, params);

export const isDbError = (err: unknown): err is DatabaseError =>
  err instanceof DatabaseError;

export const DB_ERRORS = {
  DUPLICATE: '23505',
  FOREIGN_KEY: '23503',
} as const;
