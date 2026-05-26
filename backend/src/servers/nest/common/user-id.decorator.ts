import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedNestRequest } from './authenticated-request';

/**
 * Декоратор параметра контроллера Nest, который извлекает `userId` из запроса.
 *
 * Работает в паре с {@link AuthGuard}:
 * 1. Guard проверяет JWT и записывает `userId` в `request.userId`.
 * 2. Этот декоратор достает это значение и передает в аргумент метода контроллера.
 *
 * `@UserId()` удобнее, чем вручную писать `@Req() req: AuthenticatedNestRequest`,
 * потому что явно показывает намерение и не дает контроллеру зависеть от
 * всего Express-объекта запроса.
 */
export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedNestRequest>();

    return request.userId;
  },
);
