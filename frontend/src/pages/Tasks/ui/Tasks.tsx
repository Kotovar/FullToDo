import { useNotepad, useTaskParams } from '@pages/Tasks/lib';
import { ErrorFetching } from '@shared/ui';
import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { TasksSkeleton } from './TasksSkeleton';

export const Tasks = () => {
  const { title, notepadId, location, isError, isLoading } = useNotepad();
  const { validParams, setSearchParams } = useTaskParams();

  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (isError) {
    return <ErrorFetching />;
  }

  return (
    <>
      <TasksHeader
        title={title}
        params={validParams}
        setParams={setSearchParams}
      />
      <TasksBody
        notepadId={notepadId}
        notepadPathName={location}
        params={validParams}
      />
    </>
  );
};
