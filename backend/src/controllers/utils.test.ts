import { describe, test, expect, vi } from 'vitest';
import { Readable } from 'stream';
import type { IncomingMessage, ServerResponse } from 'http';
import type { ZodError } from 'zod';
import {
  parseJsonBody,
  errorHandler,
  getId,
  getValidatedTaskParams,
} from './utils';
import { commonNotepadId, TaskQueryParams } from '@sharedCommon/schemas';
import { extractInvalidKeys } from '@sharedCommon/utils';

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
    const req = {} as IncomingMessage;
    const emptyResponse = '';

    const { notepadId } = getId(req, 'notepad');
    const { taskId } = getId(req, 'task');

    expect(taskId).toBe(emptyResponse);
    expect(notepadId).toBe(emptyResponse);
  });

  test('get all if idType === notepad and url has task ', async () => {
    const url = `/tasks/1`;
    const req = { url } as IncomingMessage;
    const { notepadId } = getId(req, 'notepad');

    expect(notepadId).toBe(commonNotepadId);
  });
});

describe('getValidatedTaskParams tests', () => {
  const correctUrl = `/notepads/1/tasks?isCompleted=true&search=5`;
  const incorrectUrl = `${correctUrl}&unknown=5`;
  const incorrectUrlWithBadParamsValue = `/notepads/1/tasks?isCompleted=6`;
  const correctParams: TaskQueryParams = {
    isCompleted: 'true',
    search: '5',
  };

  test('return correct data if validation is success', () => {
    const req = { url: correctUrl } as IncomingMessage;
    const result = getValidatedTaskParams(req);

    expect(result).toEqual(correctParams);
  });

  test('return correct data if validation is success with incorrect params', () => {
    const req = { url: incorrectUrl } as IncomingMessage;
    const result = getValidatedTaskParams(req);

    expect(result).toEqual(correctParams);
  });

  test('return {} if params has bad Value', () => {
    const req = { url: incorrectUrlWithBadParamsValue } as IncomingMessage;
    const result = getValidatedTaskParams(req);

    expect(result).toEqual({});
  });
});

describe('extractInvalidKeys tests', () => {
  const path: string[] = [];

  test('works correctly', () => {
    const error = {
      issues: [
        {
          code: 'another error',
          keys: ['keys'],
          message: "Unrecognized key(s) in object: 'unknown'",
          path,
        },
      ],
      isEmpty: false,
      message: "Unrecognized key(s) in object: 'unknown'",
      name: '',
    } as unknown as ZodError;

    const result = extractInvalidKeys(error);
    expect(result).toEqual([]);
  });
});
