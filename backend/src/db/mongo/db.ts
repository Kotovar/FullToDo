import { Db, MongoClient, MongoServerError, type ClientSession } from 'mongodb';
import { config } from '@configs';

const { mongo } = config;

const uri = `mongodb://${mongo.host}:${mongo.port}/${mongo.name}`;

let db: Db | undefined;

const client = new MongoClient(uri, {
  auth: {
    username: mongo.user,
    password: mongo.password,
  },
  authSource: 'admin',
  replicaSet: mongo.replicaSet,
});

export async function connectMongo() {
  if (db) return db;

  await client.connect();
  db = client.db(mongo.name);

  return db;
}

export const withMongoTransaction = async <T>(
  fn: (db: Db, session: ClientSession) => Promise<T>,
): Promise<T> => {
  const db = await connectMongo();
  const session = client.startSession();

  try {
    let result: T;

    await session.withTransaction(async () => {
      result = await fn(db, session);
    });

    return result!;
  } finally {
    await session.endSession();
  }
};

export const isMongoDbError = (err: unknown): err is MongoServerError =>
  err instanceof MongoServerError;

export const MONGO_DB_ERRORS = {
  DUPLICATE: 11000,
} as const;
