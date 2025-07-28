import path from 'path';
import { config as dotenvConfig } from 'dotenv';
import { ConfigSchema } from './schemas';

dotenvConfig({ path: path.resolve(__dirname, '../../../.env') });

export const config = ConfigSchema.parse({
  server: {
    type: process.env.SERVER_TYPE,
    port: Number(process.env.PORT),
  },
  db: {
    type: process.env.DB_TYPE,
  },
});
