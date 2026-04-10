import { z } from 'zod';

const zPassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number');

const zEmail = z.email('Invalid email');

const zEmailWithPassword = z.object({
  email: zEmail,
  password: zPassword,
});

const zGoogleToken = z.object({
  token: z.string().min(1, 'Google token is required'),
});

export const registerWithGoogleSchema = zGoogleToken;
export const registerWithEmailSchema = zEmailWithPassword;

export const loginWithGoogleSchema = zGoogleToken;
export const loginWithEmailSchema = z.object({
  email: zEmail,
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: zPassword,
});

export const dbUserSchema = z
  .object({
    userId: z.number(),
    email: z.string(),
    passwordHash: z.string().optional(),
    googleId: z.string().optional(),
  })
  .refine(data => data.passwordHash || data.googleId, {
    message: 'User must have at least one auth method',
  });

export const refreshTokenSchema = z.object({
  id: z.number(),
  userId: z.number(),
  tokenHash: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export type RegisterWithGoogle = z.infer<typeof registerWithGoogleSchema>;
export type RegisterWithEmail = z.infer<typeof registerWithEmailSchema>;
export type LoginWithGoogle = z.infer<typeof loginWithGoogleSchema>;
export type LoginWithEmail = z.infer<typeof loginWithEmailSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type DbUser = z.infer<typeof dbUserSchema>;
export type RefreshToken = z.infer<typeof refreshTokenSchema>;
