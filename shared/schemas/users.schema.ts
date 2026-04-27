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

export const registerWithEmailSchema = zEmailWithPassword;

export const loginWithGoogleSchema = zGoogleToken;
export const loginWithEmailSchema = z.object({
  email: zEmail,
  password: z.string().min(1),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: zPassword,
  })
  .refine(
    ({ oldPassword, newPassword }) => oldPassword !== newPassword,
    {
      path: ['newPassword'],
      message: 'New password must differ from current password',
    },
  );

export const dbUserSchema = z
  .object({
    userId: z.number(),
    email: zEmail,
    isVerified: z.boolean().default(false),
    passwordHash: z.string().nullish(),
    googleId: z.string().nullish(),
  })
  .refine(data => data.passwordHash || data.googleId, {
    message: 'User must have at least one auth method',
  });

export const publicUserSchema = dbUserSchema.transform(
  ({ userId, email, isVerified, passwordHash, googleId }) => ({
    userId,
    email,
    isVerified,
    hasPassword: Boolean(passwordHash),
    hasGoogle: Boolean(googleId),
  }),
);

export const createUserSchema = z
  .object({ email: zEmail, isVerified: z.boolean().optional() })
  .and(
    z.union([
      z.object({ passwordHash: z.string(), googleId: z.never().optional() }),
      z.object({ googleId: z.string(), passwordHash: z.never().optional() }),
    ]),
  );

export const refreshTokenSchema = z.object({
  id: z.number(),
  userId: z.number(),
  tokenHash: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
});

export const emailTokenSchema = z.strictObject({
  token: z.string(),
});

export const resendVerificationSchema = z.object({ email: z.email() });

export const deleteUserSchema = z.object({
  currentPassword: z.string().min(1).optional(),
});

export type RegisterWithEmail = z.infer<typeof registerWithEmailSchema>;
export type LoginWithGoogle = z.infer<typeof loginWithGoogleSchema>;
export type LoginWithEmail = z.infer<typeof loginWithEmailSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;
export type DeleteUser = z.infer<typeof deleteUserSchema>;
export type DbUser = z.infer<typeof dbUserSchema>;
export type RefreshToken = z.infer<typeof refreshTokenSchema>;

export type CreateUser = z.infer<typeof createUserSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;

export type GoogleProfile = {
  googleId: string;
  email: string;
  emailVerified: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
