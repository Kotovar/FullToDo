import path from 'path';
import { loadEnvFile } from 'node:process';
import { ConfigSchema } from './schemas';

loadEnvFile(path.resolve(__dirname, '../../../.env'));

export const config = ConfigSchema.parse({
  server: {
    type: process.env.SERVER_TYPE,
    port: Number(process.env.PORT),
  },
  db: {
    type: process.env.DB_TYPE,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  },
});
