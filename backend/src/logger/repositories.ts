import { baseLogger } from './base';

const repositoryType = process.env.DB_TYPE || 'mock';

export const repositoryLogger = baseLogger.child({
  layer: 'repository',
  repositoryType,
});
