import { baseLogger } from './base';

export const uncaughtExceptionLogger = baseLogger.child({
  layer: 'uncaughtException',
});
