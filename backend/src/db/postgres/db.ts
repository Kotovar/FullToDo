import { DatabaseError, Pool, types } from 'pg';
import { config } from '@configs';
import { repositoryLogger } from '@logger/repositories';

// PostgreSQL по умолчанию возвращает колонки типа BIGINT (OID 20) и BIGSERIAL как строки.
// Это связано с тем, что числа JS — 64-битные float и не могут точно представить все
// 64-битные целые (потеря точности выше Number.MAX_SAFE_INTEGER ≈ 9 квадриллионов).
// Текущие ID — небольшие последовательные числа, поэтому parseInt здесь безопасен.
// setTypeParser регистрирует кастомный декодер: когда pg получает значение типа
// OID 20 от сервера, он вызывает эту функцию вместо того, чтобы вернуть сырую строку.
types.setTypeParser(20, val => parseInt(val, 10));

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
) => {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;

  repositoryLogger.info(
    { text, duration, rows: res.rowCount },
    'executed query',
  );
  return res;
};

export const isDbError = (err: unknown): err is DatabaseError =>
  err instanceof DatabaseError;

export const DB_ERRORS = {
  DUPLICATE: '23505',
  FOREIGN_KEY: '23503',
} as const;
