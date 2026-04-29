import { Router } from 'express';
import { createNotepadSchema } from '@sharedCommon/schemas';
import { ROUTES } from '@sharedCommon/routes';
import { expressAuthMiddleware, expressCheckContentType } from '@middleware';
import { expressHandleValidationError } from '@controllers';
import { param } from './helpers';
import { notepadService } from './services';

export const notepadRouter = Router();

notepadRouter.post(
  ROUTES.notepads.base,
  expressAuthMiddleware,
  expressCheckContentType,
  async (req, res) => {
    const validation = createNotepadSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    const notepad = await notepadService.createNotepad(
      validation.data,
      req.userId,
    );

    res
      .status(201)
      .json({ message: `Notepad "${notepad.title}" created`, notepad });
  },
);

notepadRouter.get(
  ROUTES.notepads.base,
  expressAuthMiddleware,
  async (req, res) => {
    const rawData = await notepadService.getAllNotepads(req.userId);
    res.status(200).json({ message: 'Success', data: rawData });
  },
);

notepadRouter.patch(
  ROUTES.notepads.byId,
  expressAuthMiddleware,
  expressCheckContentType,
  async (req, res) => {
    const validation = createNotepadSchema.safeParse(req.body);
    if (!validation.success) {
      expressHandleValidationError(res, validation.error);
      return;
    }

    const notepadId = param(req, 'notepadId');
    const updatedNotepad = await notepadService.updateNotepad(
      notepadId,
      validation.data,
      req.userId,
    );

    res.status(200).json({
      message: `A notepad with the id ${notepadId} has been successfully updated`,
      data: updatedNotepad,
    });
  },
);

notepadRouter.delete(
  ROUTES.notepads.byId,
  expressAuthMiddleware,
  async (req, res) => {
    await notepadService.deleteNotepad(param(req, 'notepadId'), req.userId);
    res.status(200).json({ message: 'Notepad deleted successfully' });
  },
);
