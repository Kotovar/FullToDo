import type { IncomingMessage, ServerResponse } from 'http';
import type { TaskRepository } from '../repositories/TaskRepository';

export interface HttpContext {
  req: IncomingMessage;
  res: ServerResponse;
}

export type RequestHandler = (
  context: HttpContext,
  repository: TaskRepository,
) => Promise<void>;
