import { baseLogger } from './base';

export const userLogger = baseLogger.child({ layer: 'user' });
