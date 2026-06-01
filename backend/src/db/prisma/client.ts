import { PrismaClient } from '@prisma/client';
import { config } from '@configs';

const { postgres } = config;

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = `postgresql://${postgres.user}:${postgres.password}@${postgres.host}:${postgres.port}/${postgres.name}`;
}

export const prisma = new PrismaClient();
