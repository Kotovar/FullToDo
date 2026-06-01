import { prisma } from '@db/prisma/client';
import { RefreshTokenRepository } from '@repositories/interfaces';
import type { RefreshToken } from '@sharedCommon/schemas';

/**
 * Репозиторий refresh-токенов на Prisma.
 *
 * Использует модель `RefreshToken` из схемы Prisma.
 * Все `userId` в БД хранятся как `BigInt`, но Prisma принимает `number`
 * в `where` / `data`, поэтому передаём `number` напрямую.
 */
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  /**
   * Создаёт запись о refresh-токене.
   *
   * Prisma-метод: `prisma.refreshToken.create({ data })`
   *
   * @param userId    ID пользователя (number)
   * @param tokenHash SHA256-хеш токена
   * @param expiresAt дата истечения
   */
  async createRefreshToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });
  }

  /**
   * Ищет refresh-токен по хешу.
   *
   * Prisma-метод: `prisma.refreshToken.findUnique({ where: { tokenHash } })`
   *
   * Возвращаемые `userId` / `id` из Prisma имеют тип `bigint`.
   * Чтобы соответствовать типу `RefreshToken` (где `userId: number`),
   * конвертируем `bigint` → `number` через `Number()`.
   */
  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const token = await prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (!token) return null;

    return {
      userId: Number(token.userId),
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
    };
  }

  /**
   * Удаляет refresh-токен по хешу.
   *
   * Prisma-метод: `prisma.refreshToken.deleteMany({ where: { tokenHash } })`
   *
   * `deleteMany` позволяет фильтровать по любым полям (не только unique).
   */
  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { tokenHash },
    });
  }

  /**
   * Удаляет ВСЕ refresh-токены пользователя.
   *
   * Prisma-метод: `prisma.refreshToken.deleteMany({ where: { userId } })`
   */
  async deleteAllByUserId(userId: number): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
