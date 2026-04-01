import {
  checkContentType,
  errorHandler,
  getId,
  handleValidationError,
  parseJsonBody,
} from './utils';
import { createNotepadSchema } from '@sharedCommon/schemas';
import { NotepadService } from '@services/NotepadService';
import type { ServiceHandler } from './types';

export const createNotepad: ServiceHandler<NotepadService> = async (
  { req, res },
  service: NotepadService,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const rawNotepad = await parseJsonBody<unknown>(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const notepad = await service.createNotepad(validationResult.data);

    res.writeHead(201, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: `Notepad "${notepad.title}" created`,
        notepad,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const getAllNotepads: ServiceHandler<NotepadService> = async (
  { res },
  service: NotepadService,
) => {
  try {
    const rawData = await service.getAllNotepads();

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Success', data: rawData }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateNotepad: ServiceHandler<NotepadService> = async (
  { req, res },
  service: NotepadService,
) => {
  try {
    if (!checkContentType(req, res)) return;

    const { notepadId } = getId(req, 'notepad');
    const rawNotepad = await parseJsonBody<unknown>(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const updatedNotepad = await service.updateNotepad(
      notepadId,
      validationResult.data,
    );

    res.writeHead(200, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        message: `A notepad with the id ${notepadId} has been successfully updated`,
        data: updatedNotepad,
      }),
    );
  } catch (error) {
    errorHandler(res, error);
  }
};

export const deleteNotepad: ServiceHandler<NotepadService> = async (
  { req, res },
  service: NotepadService,
) => {
  try {
    const { notepadId } = getId(req, 'notepad');
    await service.deleteNotepad(notepadId);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Notepad deleted successfully' }));
  } catch (error) {
    errorHandler(res, error);
  }
};
