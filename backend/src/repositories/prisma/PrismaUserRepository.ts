import { prisma } from '@db/prisma/client';
import { isPrismaError } from '@db/prisma/errors';
import { ConflictError, NotFoundError } from '@errors/AppError';
import { UserRepository } from '@repositories/interfaces';
import type { CreateUser, DbUser } from '@sharedCommon/schemas';

/**
 * Преобразует сырые данные User из Prisma в тип `DbUser`.
 *
 * Prisma возвращает `id` и другие BigInt-поля как нативный `bigint`.
 * Для `userId` используем `Number()`, т.к. в приложении `userId` — это `number`.
 * Поля `passwordHash` / `googleId` при `null` не включаем в объект
 * (как в оригинальном `PostgresUserRepository`).
 */
const prismaUserToDbUser = (user: {
  id: bigint;
  email: string;
  passwordHash: string | null;
  googleId: string | null;
  isVerified: boolean;
}): DbUser => ({
  userId: Number(user.id),
  email: user.email,
  isVerified: user.isVerified,
  ...(user.passwordHash !== null && { passwordHash: user.passwordHash }),
  ...(user.googleId !== null && { googleId: user.googleId }),
});

/**
 * Репозиторий пользователей на Prisma.
 *
 * Все запросы выполняются через `prisma.user`.
 * Для транзакций используется `prisma.$transaction([...])` —
 * Prisma автоматически оборачивает массив запросов в SQL-транзакцию.
 */
export class PrismaUserRepository implements UserRepository {
  /**
   * Создаёт нового пользователя.
   *
   * Prisma-метод: `prisma.user.create({ data })`
   *
   * Если email или googleId уже заняты, Prisma выбросит ошибку с кодом `P2002`
   * (unique constraint violated) — ловим её и превращаем в `ConflictError`.
   */
  async createUser(data: CreateUser): Promise<DbUser> {
    try {
      const user = await prisma.user.create({
        data: {
          email: data.email,
          passwordHash: 'passwordHash' in data ? data.passwordHash : null,
          googleId: 'googleId' in data ? data.googleId : null,
          isVerified: data.isVerified ?? false,
        },
      });

      return prismaUserToDbUser(user);
    } catch (err) {
      if (isPrismaError(err, 'P2002')) {
        throw new ConflictError(
          'User with this email or Google ID already exists',
        );
      }
      throw err;
    }
  }

  /**
   * Помечает пользователя как верифицированного.
   *
   * Prisma-метод: `prisma.user.updateMany({ where, data })`
   *
   * `updateMany` нужен, чтобы обновить запись ТОЛЬКО если `isVerified = false`.
   * Если ни одна строка не обновилась — проверяем, существует ли пользователь вообще.
   *
   * @returns `true` если статус изменился, `false` если уже был верифицирован.
   */
  async markVerified(userId: number): Promise<boolean> {
    const result = await prisma.user.updateMany({
      where: { id: userId, isVerified: false },
      data: { isVerified: true },
    });

    if (result.count > 0) {
      return true;
    }

    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundError(`User ${userId} not found`);
    }

    return false;
  }

  /**
   * Ищет пользователя по ID.
   *
   * Prisma-метод: `prisma.user.findUnique({ where: { id: userId } })`
   */
  async findById(userId: number): Promise<DbUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user ? prismaUserToDbUser(user) : null;
  }

  /**
   * Ищет пользователя по email.
   *
   * Prisma-метод: `prisma.user.findUnique({ where: { email } })`
   */
  async findByEmail(email: string): Promise<DbUser | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user ? prismaUserToDbUser(user) : null;
  }

  /**
   * Ищет пользователя по Google ID.
   *
   * Prisma-метод: `prisma.user.findUnique({ where: { googleId } })`
   */
  async findByGoogleId(googleId: string): Promise<DbUser | null> {
    const user = await prisma.user.findUnique({
      where: { googleId },
    });

    return user ? prismaUserToDbUser(user) : null;
  }

  /**
   * Привязывает Google-аккаунт к существующему пользователю.
   *
   * Prisma-метод: `prisma.user.update({ where: { id: userId }, data: { googleId, isVerified: true } })`
   */
  async linkGoogleAccount(userId: number, googleId: string): Promise<DbUser> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { googleId, isVerified: true },
      });

      return prismaUserToDbUser(user);
    } catch (err) {
      if (isPrismaError(err, 'P2002')) {
        throw new ConflictError('User with this Google ID already exists');
      }
      if (isPrismaError(err, 'P2025')) {
        throw new NotFoundError(`User ${userId} not found`);
      }
      throw err;
    }
  }

  /**
   * Меняет пароль и инвалидирует все refresh-токены пользователя.
   *
   * Используем `prisma.$transaction([...])` — Prisma выполнит оба запроса
   * в рамках одной SQL-транзакции (аналог `withTransaction` в `pg`).
   *
   * Prisma-методы:
   * - `prisma.user.update(...)`
   * - `prisma.refreshToken.deleteMany(...)`
   */
  async changePassword(userId: number, passwordHash: string): Promise<void> {
    try {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { passwordHash },
        }),
        prisma.refreshToken.deleteMany({
          where: { userId },
        }),
      ]);
    } catch (err) {
      if (isPrismaError(err, 'P2025')) {
        throw new NotFoundError(`User ${userId} not found`);
      }
      throw err;
    }
  }

  /**
   * Удаляет пользователя.
   *
   * Prisma-метод: `prisma.user.delete({ where: { id: userId } })`
   *
   * В физической БД настроен `ON DELETE CASCADE` для связанных таблиц
   * (`notepads`, `tasks`, `refresh_tokens`), поэтому Prisma достаточно
   * удалить саму запись `users` — остальное сделает PostgreSQL.
   */
  async deleteUser(userId: number): Promise<void> {
    try {
      await prisma.user.delete({
        where: { id: userId },
      });
    } catch (err) {
      if (isPrismaError(err, 'P2025')) {
        throw new NotFoundError(`User ${userId} not found`);
      }
      throw err;
    }
  }
}
