import type { ZodError } from 'zod';

export const extractInvalidKeys = (error: ZodError): string[] => {
  return error.issues.flatMap(issue => {
    if (issue.code === 'unrecognized_keys' && 'keys' in issue) {
      return issue.keys;
    }
    return issue.path[0] ? [String(issue.path[0])] : [];
  });
};
