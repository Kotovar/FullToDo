import type { IncomingMessage, ServerResponse } from 'http';

export interface HttpContext {
  req: IncomingMessage;
  res: ServerResponse;
}

export type ServiceHandler<Service> = (
  context: HttpContext,
  service: Service,
) => Promise<void>;
