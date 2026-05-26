import {
  Injectable,
  type ArgumentMetadata,
  type PipeTransform,
} from '@nestjs/common';
import type { ZodError, ZodType } from 'zod';

export class ZodValidationError extends Error {
  constructor(public readonly error: ZodError) {
    super('Invalid data');
    this.name = 'ZodValidationError';
  }
}

/**
 * Nest pipe для валидации body/query/params через Zod-схемы из `/shared`.
 *
 * Pipe возвращает уже распарсенное значение из Zod, поэтому controllers получают
 * нормализованные данные, а не сырой `req.body` или `req.query`.
 */
@Injectable()
export class ZodValidationPipe<
  TInput = unknown,
  TOutput = TInput,
> implements PipeTransform<TInput, TOutput> {
  constructor(private readonly schema: ZodType<TOutput, TInput>) {}

  transform(value: TInput, _metadata: ArgumentMetadata): TOutput {
    const validation = this.schema.safeParse(value);

    if (!validation.success) {
      throw new ZodValidationError(validation.error);
    }

    return validation.data;
  }
}
