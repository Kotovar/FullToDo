import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import {
  ZodValidationError,
  ZodValidationPipe,
} from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  const schema = z.object({
    title: z.string().min(1),
  });

  test('should return parsed data for valid input', () => {
    const pipe = new ZodValidationPipe(schema);

    expect(pipe.transform({ title: 'Task' }, { type: 'body' })).toEqual({
      title: 'Task',
    });
  });

  test('should throw ZodValidationError for invalid input', () => {
    const pipe = new ZodValidationPipe(schema);

    expect(() => pipe.transform({ title: '' }, { type: 'body' })).toThrow(
      ZodValidationError,
    );
  });
});
