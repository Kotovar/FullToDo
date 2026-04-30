import { z } from 'zod';

export const ServerSchema = z.object({
  type: z.enum(['http', 'express', 'nextJs']).default('http'),
  port: z.number().min(1).max(65535).default(5000),
});

export const DBSchema = z.object({
  type: z.enum(['mongo', 'postgres', 'mock']).default('mock'),
});

export const PostgresSchema = z.object({
  user: z.string().default('postgres'),
  host: z.string().default('localhost'),
  name: z.string().default('fulltodo'),
  password: z.string(),
  port: z.number().min(1).max(65535).default(5432),
});

export const MongoSchema = z.object({
  user: z.string().default('root'),
  password: z.string(),
  host: z.string().default('localhost'),
  port: z.number().min(1).max(65535).default(27017),
  name: z.string().default('fulltodo'),
  replicaSet: z.string().default('rs0'),
});

export const SmtpSchema = z.object({
  user: z.string().min(1).optional(),
  pass: z.string().min(1).optional(),
});

export const EmailProviderSchema = z.enum(['mailtrap', 'resend']);

export const EmailSchema = z.object({
  provider: EmailProviderSchema.default('mailtrap'),
  from: z.string().min(1).default('"FullToDo" <noreply@fulltodo.dev>'),
});

export const ResendSchema = z.object({
  apiKey: z.string().min(1).optional(),
});

export const RedisSchema = z.object({
  host: z.string().default('localhost'),
  port: z.number().min(1).max(65535).default(6379),
});

export const ConfigSchema = z
  .object({
    server: ServerSchema,
    db: DBSchema,
    postgres: PostgresSchema,
    mongo: MongoSchema,
    email: EmailSchema,
    smtp: SmtpSchema,
    resend: ResendSchema,
    redis: RedisSchema,
    corsOrigin: z.url(),
    emailTokenSecret: z.string().min(1),
    accessTokenSecret: z.string().min(1),
    refreshTokenSecret: z.string().min(1),
    passwordResetTokenSecret: z.string().min(1),
    googleClientId: z.string().min(1),
  })
  .superRefine((config, ctx) => {
    if (config.email.provider === 'mailtrap') {
      if (!config.smtp.user) {
        ctx.addIssue({
          code: 'custom',
          path: ['smtp', 'user'],
          message: 'MAILTRAP_USER is required for mailtrap email provider',
        });
      }

      if (!config.smtp.pass) {
        ctx.addIssue({
          code: 'custom',
          path: ['smtp', 'pass'],
          message: 'MAILTRAP_PASS is required for mailtrap email provider',
        });
      }
    }

    if (config.email.provider === 'resend' && !config.resend.apiKey) {
      ctx.addIssue({
        code: 'custom',
        path: ['resend', 'apiKey'],
        message: 'RESEND_API_KEY is required for resend email provider',
      });
    }

    if (config.db.type === 'postgres' && !config.postgres.password) {
      ctx.addIssue({
        code: 'custom',
        path: ['postgres', 'password'],
        message: 'DB_PASSWORD is required when DB_TYPE=postgres',
      });
    }

    if (config.db.type === 'mongo' && !config.mongo.password) {
      ctx.addIssue({
        code: 'custom',
        path: ['mongo', 'password'],
        message: 'MONGO_PASSWORD is required when DB_TYPE=mongo',
      });
    }
  });

export type ServerType = z.infer<typeof ServerSchema>['type'];
export type DBType = z.infer<typeof DBSchema>['type'];
export type EmailProviderType = z.infer<typeof EmailProviderSchema>;
