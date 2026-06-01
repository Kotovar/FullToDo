import { Prisma } from '@prisma/client';

/**
 * Type-guard для ошибок Prisma Client.
 *
 * Prisma выбрасывает `PrismaClientKnownRequestError` с уникальным кодом (например, `P2002`).
 * Эта функция позволяет безопасно проверить код ошибки без `any`.
 */
export const isPrismaError = (
  err: unknown,
  code: string,
): err is Prisma.PrismaClientKnownRequestError =>
  err instanceof Prisma.PrismaClientKnownRequestError && err.code === code;
