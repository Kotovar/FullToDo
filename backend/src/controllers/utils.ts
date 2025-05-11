import type { ZodError } from 'zod';
import type { IncomingMessage, ServerResponse } from 'http';
import { commonNotepadId } from '@shared/schemas';

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

export const getId = (
  req: IncomingMessage,
  idType: 'notepad' | 'task',
): string => {
  const url = req.url?.split('/') ?? '';

  if (idType === 'notepad') {
    return url[1] === 'tasks' ? commonNotepadId : (url[2] ?? '');
  }
  if (idType === 'task') {
    return url.at(-1) ?? '';
  }

  return '';
};

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
