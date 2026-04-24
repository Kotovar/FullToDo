import { baseLogger } from './base';

export const oauthLogger = baseLogger.child({ layer: 'email' });
