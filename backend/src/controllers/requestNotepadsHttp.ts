import {
  checkContentType,
  errorHandler,
  getId,
  handleValidationError,
  parseJsonBody,
} from './utils';
import { createNotepadSchema } from '@sharedCommon/schemas';
import type { RequestHandler } from './types';

export const createNotepad: RequestHandler = async (
  { req, res },
  repository,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const rawNotepad = await parseJsonBody<unknown>(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const result = await repository.createNotepad(validationResult.data);

    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllNotepads: RequestHandler = async ({ res }, repository) => {
  try {
    const rawData = await repository.getAllNotepads();

    res
      .writeHead(rawData.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(rawData));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateNotepad: RequestHandler = async (
  { req, res },
  repository,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const { notepadId } = getId(req, 'notepad');
    const rawNotepad = await parseJsonBody<unknown>(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const result = await repository.updateNotepad(
      notepadId,
      validationResult.data,
    );

    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteNotepad: RequestHandler = async (
  { req, res },
  repository,
) => {
  try {
    const { notepadId } = getId(req, 'notepad');
    const result = await repository.deleteNotepad(notepadId);

    res
      .writeHead(result.status, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};
