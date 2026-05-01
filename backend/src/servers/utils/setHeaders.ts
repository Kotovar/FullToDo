import http from 'http';
import { config } from '@configs';

export const setHeaders = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => {
  const origin = req.headers.origin;

  if (origin === config.corsOrigin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};
