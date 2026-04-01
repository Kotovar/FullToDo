import { z } from 'zod';

export const ServerSchema = z.object({
  type: z.enum(['http', 'express', 'nextJs']).default('http'),
  port: z.number().min(1).max(65535).default(5000),
});

export const DBSchema = z.object({
  type: z.enum(['mongo', 'postgres', 'mock']).default('mock'),
  user: z.string().default('postgres'),
  host: z.string().default('localhost'),
  name: z.string().default('fulltodo'),
  password: z.string(),
  port: z.number().min(1).max(65535).default(5432),
});

export const ConfigSchema = z.object({
  server: ServerSchema,
  db: DBSchema,
});

export type ServerType = z.infer<typeof ServerSchema>['type'];
export type DBType = z.infer<typeof DBSchema>['type'];
