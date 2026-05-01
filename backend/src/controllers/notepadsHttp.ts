import {
  checkContentType,
  errorHandler,
  getId,
  handleValidationError,
  parseJsonBody,
} from './httpUtils';
import { httpAuthMiddleware } from '@middleware';
import { createNotepadSchema } from '@sharedCommon/schemas';
import type { NotepadService } from '@services/NotepadService';
import type { ServiceHandler } from './types';

export const createNotepad: ServiceHandler<NotepadService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);
    const rawNotepad = await parseJsonBody(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const notepad = await service.createNotepad(validationResult.data, userId);

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
  ctx,
  service,
) => {
  const { res } = ctx;
  try {
    const { userId } = httpAuthMiddleware(ctx);
    const rawData = await service.getAllNotepads(userId);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Success', data: rawData }));
  } catch (error) {
    errorHandler(res, error);
  }
};

export const updateNotepad: ServiceHandler<NotepadService> = async (
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    if (!checkContentType(req, res)) return;

    const { userId } = httpAuthMiddleware(ctx);
    const { notepadId } = getId(req, 'notepad');
    const rawNotepad = await parseJsonBody(req);
    const validationResult = createNotepadSchema.safeParse(rawNotepad);

    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const updatedNotepad = await service.updateNotepad(
      notepadId,
      validationResult.data,
      userId,
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
  ctx,
  service,
) => {
  const { req, res } = ctx;
  try {
    const { userId } = httpAuthMiddleware(ctx);
    const { notepadId } = getId(req, 'notepad');
    await service.deleteNotepad(notepadId, userId);

    res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify({ message: 'Notepad deleted successfully' }));
  } catch (error) {
    errorHandler(res, error);
  }
};
