import { oauthLogger } from '@logger';
import { config } from '@configs';
import type { OAuth2Client } from 'google-auth-library';
import type { GoogleProfile } from '@sharedCommon/schemas';

export class OAuthService {
  constructor(private client: OAuth2Client) {}

  async verifyGoogleToken(token: string): Promise<GoogleProfile> {
    oauthLogger.info('Verifying Google token');

    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload?.email) {
      throw new Error('Invalid Google token payload');
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified ?? false,
    };
  }
}
