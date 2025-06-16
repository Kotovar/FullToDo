import { z } from 'zod';

export const ServerSchema = z.object({
  type: z.enum(['http', 'express', 'nextJs']).default('http'),
  port: z.number().min(1).max(65535).default(5000),
});

export const DBSchema = z.object({
  type: z.enum(['mongo', 'postgres', 'mock']).default('mock'),
});

export const ConfigSchema = z.object({
  server: ServerSchema,
  db: DBSchema,
});
