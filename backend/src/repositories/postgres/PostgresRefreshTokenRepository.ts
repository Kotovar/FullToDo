import { DB_ERRORS, isDbError, query } from '@db/postgres';
import { NotFoundError } from '@errors/AppError';
import { RefreshTokenRepository } from '@repositories/interfaces';
import type { RefreshToken } from '@sharedCommon/schemas';

export class PostgresRefreshTokenRepository implements RefreshTokenRepository {
  async createRefreshToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    try {
      await query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
        [userId, tokenHash, expiresAt],
      );
    } catch (err) {
      if (isDbError(err)) {
        if (err.code === DB_ERRORS.FOREIGN_KEY) {
          throw new NotFoundError(`User ${userId} not found`);
        }
      }

      throw err;
    }
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const token = await query<RefreshToken>(
      `SELECT _id as "id", user_id AS "userId", token_hash AS "tokenHash",
              expires_at AS "expiresAt", created_at AS "createdAt"
       FROM refresh_tokens WHERE token_hash = $1`,
      [tokenHash],
    );

    if (!token.rows[0]) {
      return null;
    }

    return token.rows[0];
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    try {
      await query(
        `DELETE FROM refresh_tokens
         WHERE token_hash = $1`,
        [tokenHash],
      );
    } catch {
      throw new Error('Failed to delete refresh token.');
    }
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    try {
      await query(
        `DELETE FROM refresh_tokens
         WHERE user_id = $1`,
        [userId],
      );
    } catch {
      throw new Error('Failed to delete all refresh tokens for user.');
    }
  }
}
