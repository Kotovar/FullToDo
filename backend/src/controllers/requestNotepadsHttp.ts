import { TaskRepository } from '../repositories/TaskRepository';
import { errorHandler, getId, type HttpContext, parseJsonBody } from './utils';
import { createNotepadSchema } from '@shared/schemas';

export const createNotepad = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      res.writeHead(400);
      return res.end('Invalid Content-Type');
    }

    const rawNotepad = await parseJsonBody<unknown>(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          message: 'Invalid Notepad data',
          errors: validationResult.error.errors,
        }),
      );
    }

    const notepad = validationResult.data;
    const result = await repository.createNotepad(notepad);

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllNotepads = async (
  { res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const rawData = await repository.getAllNotepads();

    res.writeHead(rawData.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rawData));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateNotepad = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      res.writeHead(400);
      return res.end('Invalid Content-Type');
    }

    const notepadId = getId(req, 'notepad');
    const rawNotepad = await parseJsonBody<unknown>(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(
        JSON.stringify({
          message: 'Invalid Notepad data',
          errors: validationResult.error.errors,
        }),
      );
    }

    const updatedNotepad = validationResult.data;
    const result = await repository.updateNotepad(notepadId, updatedNotepad);

    if (result.status === 404) {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteNotepad = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const notepadId = getId(req, 'notepad');
    const result = await repository.deleteNotepad(notepadId);

    if (result.status === 404) {
      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result));
    }

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};
