import path from 'path';
import { loadEnvFile } from 'node:process';
import { ConfigSchema } from './schemas';

loadEnvFile(path.resolve(__dirname, '../../../.env'));

const isTestEnv =
  process.env.NODE_ENV === 'test' || process.env.VITEST === 'true';

const getRequiredEnv = (name: string, testFallback?: string) => {
  const value = process.env[name];

  if (value !== undefined) {
    return value;
  }

  if (isTestEnv && testFallback !== undefined) {
    return testFallback;
  }

  return value;
};

export const config = ConfigSchema.parse({
  server: {
    type: getRequiredEnv('SERVER_TYPE', 'http'),
    port: Number(getRequiredEnv('PORT', '5000')),
  },
  db: {
    type: getRequiredEnv('DB_TYPE', 'mock'),
    user: getRequiredEnv('DB_USER', 'postgres'),
    host: getRequiredEnv('DB_HOST', 'localhost'),
    name: getRequiredEnv('DB_NAME', 'fulltodo'),
    password: getRequiredEnv('DB_PASSWORD', 'secret'),
    port: Number(getRequiredEnv('DB_PORT', '5432')),
  },
  smtp: {
    user: getRequiredEnv('MAILTRAP_USER', 'test-mailtrap-user'),
    pass: getRequiredEnv('MAILTRAP_PASS', 'test-mailtrap-pass'),
  },
  corsOrigin: getRequiredEnv('CORS_ORIGIN', 'http://localhost:5173'),
  emailTokenSecret: getRequiredEnv('EMAIL_TOKEN_SECRET', 'test-email-secret'),
  accessTokenSecret: getRequiredEnv(
    'ACCESS_TOKEN_SECRET',
    'test-access-secret',
  ),
  refreshTokenSecret: getRequiredEnv(
    'REFRESH_TOKEN_SECRET',
    'test-refresh-secret',
  ),
  googleClientId: getRequiredEnv('GOOGLE_CLIENT_ID', 'test-google-client-id'),
});
