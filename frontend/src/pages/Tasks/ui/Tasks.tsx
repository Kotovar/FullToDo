import { useLocation, useParams } from 'react-router';
import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { NOTEPADS } from '@entities/Task';

export const Tasks = () => {
  const { notepadId } = useParams();

  const locationPath = useLocation().pathname;

  const title =
    NOTEPADS.find(notepad => notepad.path === locationPath)?.taskName ??
    'Неизвестный блокнот';

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
