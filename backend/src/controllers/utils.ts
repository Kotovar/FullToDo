import type { ZodError } from 'zod';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  commonNotepadId,
  TaskQueryParams,
  taskQueryParamsSchema,
} from '@shared/schemas';
import { extractInvalidKeys } from '@shared/utils';

export const parseJsonBody = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON ' + error));
      }
    });

    req.on('error', reject);
  });
};

export const errorHandler = (res: ServerResponse, error: unknown) => {
  res.writeHead(500, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: error ?? 'Internal Server Error' }));
};

export const handleNotFound = async (res: ServerResponse) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ message: 'Route not found' }));
};

export function getId(
  req: IncomingMessage,
  idType: 'notepad',
): { notepadId: string };
export function getId(
  req: IncomingMessage,
  idType: 'task',
): { notepadId: string; taskId: string };
export function getId(req: IncomingMessage, idType: 'notepad' | 'task') {
  const url = req.url?.split('/').filter(Boolean) ?? [];
  const isCommonPath = url[0] === 'tasks';

  const notepadId = isCommonPath ? commonNotepadId : (url[1] ?? '');
  const taskId = isCommonPath ? (url[1] ?? '') : (url[3] ?? '');

  return idType === 'notepad' ? { notepadId } : { notepadId, taskId };
}

export const getValidatedTaskParams = (
  req: IncomingMessage,
): TaskQueryParams => {
  const queryString = req.url?.split('?')[1] ?? '';
  if (!queryString) return {};

  const params = new URLSearchParams(queryString);
  const rawParams = Object.fromEntries(params.entries());
  const validation = taskQueryParamsSchema.safeParse(rawParams);

  if (validation.success) {
    return validation.data;
  }

  const invalidKeys = extractInvalidKeys(validation.error);
  const validParams = filterValidParams(rawParams, invalidKeys);

  return taskQueryParamsSchema.parse(validParams);
};

const filterValidParams = (
  params: Record<string, string>,
  badKeys: string[],
): Partial<TaskQueryParams> =>
  Object.fromEntries(
    Object.entries(params).filter(([key]) => !badKeys.includes(key)),
  );

export const checkContentType = (
  req: IncomingMessage,
  res: ServerResponse,
): boolean => {
  if (req.headers['content-type'] !== 'application/json') {
    res.writeHead(400).end('Invalid Content-Type');
    return false;
  }
  return true;
};

export const handleValidationError = (res: ServerResponse, error: ZodError) => {
  res.writeHead(400, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      message: 'Invalid data',
      errors: error.errors,
    }),
  );
};
