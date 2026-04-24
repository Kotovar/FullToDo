import { ROUTES } from 'shared/routes';

export const getPath = (
  id: string,
  notepadPathName: string,
  notepadId?: string,
) =>
  notepadPathName !== ROUTES.tasks.base && notepadId
    ? `${ROUTES.notepads.getTaskPath(notepadId, id)}`
    : `${ROUTES.tasks.base}/${id}`;
