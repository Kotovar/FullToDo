import { config } from '@configs';
import { baseLogger } from './base';

export const serverLogger = baseLogger.child({
  layer: 'server',
  serverType: config.server.type,
});
