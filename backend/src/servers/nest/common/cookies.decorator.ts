import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import { parseCookies } from '@controllers';

/**
 * Декоратор параметра контроллера Nest, который извлекает refresh-токен
 * из заголовка `Cookie` запроса.
 *
 * Возвращает `string`, если кука `refreshToken` присутствует, иначе `undefined`.
 */
export const RefreshToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return parseCookies(request.headers.cookie).refreshToken;
  },
);
