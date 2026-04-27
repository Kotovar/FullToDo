import { DB_ERRORS, isDbError, query, withTransaction } from '@db/postgres';
import { ConflictError, NotFoundError } from '@errors/AppError';
import { UserRepository } from '@repositories/interfaces';
import type { CreateUser, DbUser } from '@sharedCommon/schemas';

const USER_SELECT = `
  SELECT _id AS "userId", email, password_hash AS "passwordHash",
         google_id AS "googleId", is_verified AS "isVerified"
  FROM users
`;

type UserRow = {
  userId: number;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  isVerified: boolean;
};

const rowToDbUser = (row: UserRow): DbUser => ({
  userId: row.userId,
  email: row.email,
  isVerified: row.isVerified,
  ...(row.passwordHash !== null && { passwordHash: row.passwordHash }),
  ...(row.googleId !== null && { googleId: row.googleId }),
});

export class PostgresUserRepository implements UserRepository {
  async createUser(data: CreateUser): Promise<DbUser> {
    const { email, googleId, passwordHash, isVerified = false } = data;

    try {
      const result = await query<UserRow>(
        `INSERT INTO users (email, password_hash, google_id, is_verified)
         VALUES ($1, $2, $3, $4)
         RETURNING _id AS "userId", email, password_hash AS "passwordHash",
                   google_id AS "googleId", is_verified AS "isVerified"`,
        [email, passwordHash ?? null, googleId ?? null, isVerified],
      );

      return rowToDbUser(result.rows[0]);
    } catch (err) {
      if (isDbError(err) && err.code === DB_ERRORS.DUPLICATE) {
        throw new ConflictError(
          `User with this email or Google ID already exists`,
        );
      }

      throw err;
    }
  }

  async markVerified(userId: number): Promise<boolean> {
    const result = await query(
      `UPDATE users
       SET is_verified = TRUE
       WHERE _id = $1 AND is_verified = FALSE`,
      [userId],
    );

    if ((result.rowCount ?? 0) > 0) {
      return true;
    }

    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundError(`User ${userId} not found`);
    }

    return false;
  }

  async findById(userId: number): Promise<DbUser | null> {
    const result = await query<UserRow>(`${USER_SELECT} WHERE _id = $1`, [
      userId,
    ]);

    return result.rows[0] ? rowToDbUser(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<DbUser | null> {
    const result = await query<UserRow>(`${USER_SELECT} WHERE email = $1`, [
      email,
    ]);

    return result.rows[0] ? rowToDbUser(result.rows[0]) : null;
  }

  async findByGoogleId(googleId: string): Promise<DbUser | null> {
    const result = await query<UserRow>(`${USER_SELECT} WHERE google_id = $1`, [
      googleId,
    ]);

    return result.rows[0] ? rowToDbUser(result.rows[0]) : null;
  }

  async linkGoogleAccount(userId: number, googleId: string): Promise<DbUser> {
    try {
      const result = await query<UserRow>(
        `UPDATE users
         SET google_id = $1, is_verified = TRUE
         WHERE _id = $2
         RETURNING _id AS "userId", email, password_hash AS "passwordHash",
                   google_id AS "googleId", is_verified AS "isVerified"`,
        [googleId, userId],
      );

      if (!result.rows[0]) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      return rowToDbUser(result.rows[0]);
    } catch (err) {
      if (isDbError(err) && err.code === DB_ERRORS.DUPLICATE) {
        throw new ConflictError(`User with this Google ID already exists`);
      }

      throw err;
    }
  }

  async changePassword(userId: number, passwordHash: string): Promise<void> {
    await withTransaction(async client => {
      const result = await client.query(
        `UPDATE users SET password_hash = $1 WHERE _id = $2`,
        [passwordHash, userId],
      );

      if (result.rowCount === 0) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      await client.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [
        userId,
      ]);
    });
  }

  async deleteUser(userId: number): Promise<void> {
    const result = await query(`DELETE FROM users WHERE _id = $1`, [userId]);

    if (result.rowCount === 0) {
      throw new NotFoundError(`User ${userId} not found`);
    }
  }
}
