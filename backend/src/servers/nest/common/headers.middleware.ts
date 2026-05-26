import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { setHeaders } from '../../utils';

/**
 * Общие CORS/OPTIONS-заголовки для Nest adapter.
 *
 * Функция экспортируется отдельно, чтобы bootstrap мог поставить middleware
 * до регистрации Nest-роутов. Класс может пригодиться позже для `MiddlewareConsumer`.
 */
export const nestHeadersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  setHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
};

@Injectable()
export class NestHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    nestHeadersMiddleware(req, res, next);
  }
}
