import { IncomingMessage, ServerResponse } from 'http';

export interface HttpContext {
  req: IncomingMessage;
  res: ServerResponse;
}

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
  res.setHeader('Content-Type', 'text/plain');
  res.end('Route not found');
};

export const getId = (req: IncomingMessage, idType: 'notepad' | 'task') => {
  const url = req.url?.split('/') ?? '';

  if (idType === 'notepad') {
    return url[2];
  }

  return url[4];
};
