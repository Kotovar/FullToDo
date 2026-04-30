import { Db, MongoClient } from 'mongodb';
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
});

export async function connectMongo() {
  if (db) return db;

  await client.connect();
  db = client.db(mongo.name);

  return db;
}
