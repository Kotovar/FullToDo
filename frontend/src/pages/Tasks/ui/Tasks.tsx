import { useLocation, useParams } from 'react-router';
import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { NOTEPADS } from '@entities/Task';
import { ROUTES } from '@sharedCommon/';

export const Tasks = () => {
  const { notepadId } = useParams();

  const locationPath = useLocation().pathname;

  const title =
    NOTEPADS.find(notepad => {
      const path = ROUTES.getNotepadPath(notepad._id);

      return path === locationPath;
    })?.title ?? 'Неизвестный блокнот';

  const currentNotepadPathname = location.pathname;

  return (
    <>
      <TasksHeader title={title} />
      <TasksBody
        notepadId={notepadId}
        notepadPathName={currentNotepadPathname}
      />
    </>
  );
};
