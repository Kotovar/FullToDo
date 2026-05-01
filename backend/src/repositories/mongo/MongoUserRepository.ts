import {
  connectMongo,
  getNextSequence,
  isMongoDbError,
  MONGO_COLLECTIONS,
  MONGO_DB_ERRORS,
  withMongoTransaction,
} from '@db/mongo';
import { ConflictError, NotFoundError } from '@errors/AppError';
import type { UserRepository } from '@repositories/interfaces';
import type { CreateUser, DbUser, RefreshToken } from '@sharedCommon/schemas';

export class MongoUserRepository implements UserRepository {
  async createUser(data: CreateUser): Promise<DbUser> {
    const db = await connectMongo();

    const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);

    const user: DbUser = {
      userId: await getNextSequence(db, MONGO_COLLECTIONS.users),
      email: data.email,
      isVerified: data.isVerified ?? false,
      ...(data.passwordHash !== undefined && {
        passwordHash: data.passwordHash,
      }),
      ...(data.googleId !== undefined && { googleId: data.googleId }),
    };

    try {
      await users.insertOne(user);
    } catch (err) {
      if (isMongoDbError(err) && err.code === MONGO_DB_ERRORS.DUPLICATE) {
        throw new ConflictError(
          `User with this email or Google ID already exists`,
        );
      }

      throw err;
    }

    return user;
  }

  async markVerified(userId: number): Promise<boolean> {
    const db = await connectMongo();

    const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);

    const result = await users.updateOne(
      { userId, isVerified: false },
      { $set: { isVerified: true } },
    );

    if (result.modifiedCount > 0) {
      return true;
    }

    const user = await users.findOne({ userId }, { projection: { _id: 0 } });

    if (!user) {
      throw new NotFoundError(`User ${userId} not found`);
    }

    return false;
  }

  async findById(userId: number): Promise<DbUser | null> {
    const db = await connectMongo();

    const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);
    const user = await users.findOne({ userId }, { projection: { _id: 0 } });

    return user;
  }

  async findByEmail(email: string): Promise<DbUser | null> {
    const db = await connectMongo();

    const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);
    const user = await users.findOne({ email }, { projection: { _id: 0 } });

    return user;
  }

  async findByGoogleId(googleId: string): Promise<DbUser | null> {
    const db = await connectMongo();

    const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);
    const user = await users.findOne({ googleId }, { projection: { _id: 0 } });

    return user;
  }

  async linkGoogleAccount(userId: number, googleId: string): Promise<DbUser> {
    const db = await connectMongo();

    const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);

    try {
      const user = await users.findOneAndUpdate(
        { userId },
        {
          $set: {
            googleId,
            isVerified: true,
          },
        },
        {
          returnDocument: 'after',
          projection: { _id: 0 },
        },
      );

      if (!user) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      return user;
    } catch (err) {
      if (isMongoDbError(err) && err.code === MONGO_DB_ERRORS.DUPLICATE) {
        throw new ConflictError(`User with this Google ID already exists`);
      }

      throw err;
    }
  }

  async changePassword(userId: number, passwordHash: string): Promise<void> {
    await withMongoTransaction(async (db, session) => {
      const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);

      const result = await users.updateOne(
        { userId },
        { $set: { passwordHash } },
        { session },
      );

      if (result.matchedCount === 0) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      const refreshTokens = db.collection<RefreshToken>(
        MONGO_COLLECTIONS.refreshTokens,
      );

      await refreshTokens.deleteMany({ userId }, { session });
    });
  }

  async deleteUser(userId: number): Promise<void> {
    await withMongoTransaction(async (db, session) => {
      const users = db.collection<DbUser>(MONGO_COLLECTIONS.users);
      const result = await users.deleteOne({ userId }, { session });

      if (result.deletedCount === 0) {
        throw new NotFoundError(`User ${userId} not found`);
      }

      await Promise.all([
        db
          .collection<RefreshToken>(MONGO_COLLECTIONS.refreshTokens)
          .deleteMany({ userId }, { session }),
        db
          .collection(MONGO_COLLECTIONS.notepads)
          .deleteMany({ userId }, { session }),
        db
          .collection(MONGO_COLLECTIONS.tasks)
          .deleteMany({ userId }, { session }),
      ]);
    });
  }
}
