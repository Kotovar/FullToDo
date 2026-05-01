import { connectMongo } from './db';
import { MONGO_COLLECTIONS } from './collections';
import { repositoryLogger } from '@logger/index';

const mongoLogger = repositoryLogger.child({ layer: 'mongo-init' });

export const initializeMongo = async () => {
  const db = await connectMongo();

  try {
    await Promise.all([
      db
        .collection(MONGO_COLLECTIONS.users)
        .createIndex({ userId: 1 }, { unique: true }),
      db
        .collection(MONGO_COLLECTIONS.users)
        .createIndex({ email: 1 }, { unique: true }),
      db
        .collection(MONGO_COLLECTIONS.users)
        .createIndex({ googleId: 1 }, { unique: true, sparse: true }),
      db
        .collection(MONGO_COLLECTIONS.notepads)
        .createIndex({ userId: 1, title: 1 }, { unique: true }),
      db.collection(MONGO_COLLECTIONS.notepads).createIndex({ userId: 1 }),
      db
        .collection(MONGO_COLLECTIONS.tasks)
        .createIndex({ userId: 1, createdDate: -1 }),
      db
        .collection(MONGO_COLLECTIONS.tasks)
        .createIndex({ userId: 1, notepadId: 1, createdDate: -1 }),
      db
        .collection(MONGO_COLLECTIONS.tasks)
        .createIndex({ userId: 1, isCompleted: 1 }),
      db
        .collection(MONGO_COLLECTIONS.tasks)
        .createIndex({ userId: 1, dueDate: 1 }),
      db
        .collection(MONGO_COLLECTIONS.refreshTokens)
        .createIndex({ tokenHash: 1 }, { unique: true }),
      db.collection(MONGO_COLLECTIONS.refreshTokens).createIndex({ userId: 1 }),
      db
        .collection(MONGO_COLLECTIONS.refreshTokens)
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    ]);

    mongoLogger.info('mongo indexes ensured');
  } catch (error) {
    mongoLogger.error({ error }, 'mongo init failed');
    throw error;
  }
};
