import { config } from '@configs';
import { baseLogger } from './base';

export const repositoryLogger = baseLogger.child({
  layer: 'repository',
  repositoryType: config.db.type,
});
