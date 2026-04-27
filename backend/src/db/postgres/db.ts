import { DatabaseError, Pool, PoolClient, types } from 'pg';
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

/**
 * Выполняет набор SQL-запросов в одной транзакции.
 *
 * Берёт клиента из пула соединений и передаёт его в колбек `fn`.
 * Все запросы внутри `fn` должны использовать этот клиент — только тогда
 * они выполнятся в одной транзакции и будут атомарными.
 *
 * - Если `fn` завершился успешно → COMMIT (все изменения сохраняются).
 * - Если `fn` выбросил ошибку → ROLLBACK (все изменения отменяются).
 * - Клиент возвращается в пул в любом случае (блок finally).
 *
 * @example
 * await withTransaction(async (client) => {
 *   await client.query('UPDATE users SET password_hash = $1 WHERE _id = $2', [hash, id]);
 *   await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [id]);
 *   // Если второй запрос упадёт — первый тоже откатится
 * });
 */
export const withTransaction = async <T>(
  fn: (client: PoolClient) => Promise<T>,
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const isDbError = (err: unknown): err is DatabaseError =>
  err instanceof DatabaseError;

export const DB_ERRORS = {
  DUPLICATE: '23505',
  FOREIGN_KEY: '23503',
} as const;
