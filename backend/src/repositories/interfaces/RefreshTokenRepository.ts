import type { RefreshToken } from '@sharedCommon/schemas';

export interface RefreshTokenRepository {
  createRefreshToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
  deleteAllByUserId(userId: number): Promise<void>;
}
