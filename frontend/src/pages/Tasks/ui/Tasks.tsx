import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { useNotepad } from '../lib';
import { TasksSkeleton } from './TasksSkeleton';
import { ErrorFetching } from '@shared/ui';

export const Tasks = () => {
  const { title, notepadId, location, isError, isLoading } = useNotepad();

  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (isError) {
    return <ErrorFetching />;
  }

  return (
    <>
      <TasksHeader title={title} />
      <TasksBody notepadId={notepadId} notepadPathName={location} />
    </>
  );
};
