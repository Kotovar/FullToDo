import type { PublicUser } from 'shared/schemas';

export type AuthUserResponse = {
  user: PublicUser;
};

export type AuthAccessTokenResponse = {
  message: string;
  accessToken: string;
};

export type AuthMessageResponse = {
  message: string;
};

export type AuthErrorPayload = {
  error?: { message?: string };
};
