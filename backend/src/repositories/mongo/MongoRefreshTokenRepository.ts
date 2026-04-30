import { MONGO_COLLECTIONS, connectMongo } from '@db/mongo';
import { NotFoundError } from '@errors/AppError';
import type { RefreshTokenRepository } from '@repositories/interfaces';
import type { RefreshToken } from '@sharedCommon/schemas';

export class MongoRefreshTokenRepository implements RefreshTokenRepository {
  async createRefreshToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const db = await connectMongo();

    const users = db.collection(MONGO_COLLECTIONS.users);
    const user = await users.findOne({ id: userId });

    if (!user) {
      throw new NotFoundError(`User ${userId} not found`);
    }

    const refreshTokens = db.collection<RefreshToken>(
      MONGO_COLLECTIONS.refreshTokens,
    );

    await refreshTokens.insertOne({
      userId,
      tokenHash,
      expiresAt,
      createdAt: new Date(),
    });
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const db = await connectMongo();

    const refreshTokens = db.collection<RefreshToken>(
      MONGO_COLLECTIONS.refreshTokens,
    );

    const token = await refreshTokens.findOne(
      { tokenHash },
      { projection: { _id: 0 } },
    );
    return token;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    const db = await connectMongo();

    const refreshTokens = db.collection<RefreshToken>(
      MONGO_COLLECTIONS.refreshTokens,
    );

    await refreshTokens.deleteOne({ tokenHash });
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    const db = await connectMongo();
    const refreshTokens = db.collection<RefreshToken>(
      MONGO_COLLECTIONS.refreshTokens,
    );

    await refreshTokens.deleteMany({ userId });
  }
}
