import { RefreshTokenRepository } from '@repositories/interfaces';
import type { RefreshToken } from '@sharedCommon/schemas';

export class MockRefreshTokenRepository implements RefreshTokenRepository {
  private tokens: RefreshToken[];
  private lastTokenId: number = 1;

  private generateTokenId(): number {
    return this.lastTokenId++;
  }

  constructor() {
    this.tokens = [];
  }

  async createRefreshToken(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const newToken = {
      id: this.generateTokenId(),
      userId,
      tokenHash,
      expiresAt,
      createdAt: new Date(),
    };

    this.tokens.push(newToken);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const token = this.tokens.find(token => token.tokenHash === tokenHash);
    return token ?? null;
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    this.tokens = this.tokens.filter(token => token.tokenHash !== tokenHash);
  }
  async deleteAllByUserId(userId: number): Promise<void> {
    this.tokens = this.tokens.filter(token => token.userId !== userId);
  }
}
