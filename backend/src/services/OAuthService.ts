import { oauthLogger } from '@logger';
import type { GoogleProfile } from '@sharedCommon/schemas';

export class OAuthService {
  async verifyGoogleToken(token: string): Promise<GoogleProfile> {
    // TODO: верификация через google-auth-library
    oauthLogger.info({ token }, 'Verifying Google token');
    throw new Error('OAuthService.verifyGoogleToken not implemented');
  }
}
