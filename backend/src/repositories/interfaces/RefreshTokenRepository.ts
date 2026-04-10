import type { RefreshToken } from '@sharedCommon/schemas';

export interface RefreshTokenRepository {
  createRefreshToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void>;
  getRefreshToken(userId: number): Promise<RefreshToken | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
