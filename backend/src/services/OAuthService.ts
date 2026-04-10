import { OAuth2Client } from 'google-auth-library';
import { oauthLogger } from '@logger';
import { config } from '@configs';
import type { GoogleProfile } from '@sharedCommon/schemas';

const client = new OAuth2Client(config.googleClientId);

export class OAuthService {
  async verifyGoogleToken(token: string): Promise<GoogleProfile> {
    oauthLogger.info('Verifying Google token');

    const ticket = await client.verifyIdToken({
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
    };
  }
}
