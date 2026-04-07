import { baseLogger } from './base';

const serverType = process.env.SERVER_TYPE || 'http';

export const serverLogger = baseLogger.child({
  layer: 'server',
  serverType,
});
