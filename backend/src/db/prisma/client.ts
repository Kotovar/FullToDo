import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from '@configs';

let prismaInstance: PrismaClient | null = null;

/**
 * Создаёт PrismaClient с PostgreSQL-адаптером.
 *
 * Prisma 7 требует передачи `adapter` в конструктор.
 * Используем `pg.Pool` (уже установлен в проекте) через `@prisma/adapter-pg`.
 */
function createPrismaClient(): PrismaClient {
  const { postgres } = config;

  const pool = new Pool({
    user: postgres.user,
    password: postgres.password,
    host: postgres.host,
    port: postgres.port,
    database: postgres.name,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

/**
 * Возвращает singleton-инстанс PrismaClient.
 *
 * Lazy-инициализация: клиент создаётся только при первом вызове.
 * Это позволяет импортировать модуль без side-effects
 * (важно для тестов с другим DB_TYPE).
 */
export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient();
  }
  return prismaInstance;
}
