import { NOTEPADS } from '@entities/Task';
import { useLocation, useParams } from 'react-router';

const TITLE_WITHOUT_TASKS = 'Не выбран ни один блокнот';

export const useTask = () => {
  const { notepadId } = useParams();
  const location = useLocation().pathname;

  const pathToNotepadId = `/notepad/${notepadId}`;

  const title = NOTEPADS.find(
    notepad => notepad.path === pathToNotepadId || notepad.path === location,
  )?.taskName;

  return [title ?? TITLE_WITHOUT_TASKS];
};
