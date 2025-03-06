import { describe, test, expect, vi } from 'vitest';
import { parseJsonBody, errorHandler, getId } from './utils';
import type { IncomingMessage, ServerResponse } from 'http';
import { Readable } from 'stream';

describe('parseJsonBody tests', () => {
  test('should reject JSON Error if catch Error', async () => {
    const req = new Readable() as IncomingMessage;
    req.push('invalid json');
    req.push(null);

    await expect(parseJsonBody<unknown>(req)).rejects.toThrow('Invalid JSON');
  });
});

describe('errorHandler tests', () => {
  test('errorHandler should reject Internal Server Error', async () => {
    const res = {
      writeHead: vi.fn(),
      end: vi.fn(),
    } as unknown as ServerResponse;

    errorHandler(res, undefined);

    expect(res.writeHead).toHaveBeenCalledWith(500, {
      'Content-Type': 'application/json',
    });

    expect(res.end).toHaveBeenCalledWith(
      JSON.stringify({ error: 'Internal Server Error' }),
    );
  });
});

describe('getId tests', () => {
  test('getId return correct values', async () => {
    const req = new Readable() as IncomingMessage;
    const emptyResponse = '';

    const notepadId = getId(req, 'notepad');
    const taskId = getId(req, 'task');

    expect(taskId).toBe(emptyResponse);
    expect(notepadId).toBe(emptyResponse);
  });
});
