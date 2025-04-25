import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { useNotepad } from '../lib';

export const Tasks = () => {
  const { title, notepadId, location } = useNotepad();
  return (
    <>
      <TasksHeader title={title} />
      <TasksBody notepadId={notepadId} notepadPathName={location} />
    </>
  );
};
