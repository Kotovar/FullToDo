import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { TasksSkeleton } from './TasksSkeleton';
import { useNotepad } from '@pages/Tasks/lib';
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
