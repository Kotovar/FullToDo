import { TaskRepository } from '../repositories/TaskRepository';
import { errorHandler, getId, type HttpContext, parseJsonBody } from './utils';
import { Notepad } from '@shared/types';

export const getAllNotepads = async (
  { res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const result = await repository.getAllNotepads();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (error) {
    res.statusCode = 500;
    res.end('Error 500 ' + error);
  }
};

export const createNotepad = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    if (req.headers['content-type'] !== 'application/json') {
      res.writeHead(400);
      return res.end('Invalid Content-Type');
    }

    const { name } = await parseJsonBody<Notepad>(req);
    const result = await repository.createNotepad(name);

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

    if (!notepadId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Notepad ID is required' }));
    }

    const result = await repository.deleteNotepad(notepadId);

    if (result.status === 404) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Notepad not found' }));
    }

    res.writeHead(result.status);
    res.end();
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateNotepad = async (
  { req, res }: HttpContext,
  repository: TaskRepository,
) => {
  try {
    const notepadId = getId(req, 'notepad');

    if (!notepadId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Notepad ID is required' }));
    }

    const updatedNotepad = await parseJsonBody<Notepad>(req);
    const result = await repository.updateNotepad(notepadId, updatedNotepad);

    if (result.status === 404) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ message: 'Notepad not found' }));
    }

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (error) {
    errorHandler(res, error);
  }
};
