import {
  Injectable,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { verifyAuth } from '@middleware/auth/verifyAuth';
import type { AuthenticatedNestRequest } from './authenticated-request';

/**
 * Nest guard для защищенных маршрутов.
 *
 * Переиспользует общий `verifyAuth`, чтобы HTTP, Express и Nest одинаково
 * проверяли Bearer access token и одинаково доставали `userId`.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<AuthenticatedNestRequest>();

    request.userId = verifyAuth(request.headers.authorization);

    return true;
  }
}
