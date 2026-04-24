import { baseLogger } from './base';

export const emailLogger = baseLogger.child({ layer: 'email' });
