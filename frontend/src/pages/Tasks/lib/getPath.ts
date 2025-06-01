import { ROUTES } from 'shared/routes';

export const getPath = (
  id: string,
  notepadPathName: string,
  notepadId?: string,
) =>
  notepadPathName !== ROUTES.TASKS && notepadId
    ? `${ROUTES.getTaskDetailPath(notepadId, id)}`
    : `${ROUTES.TASKS}/${id}`;
