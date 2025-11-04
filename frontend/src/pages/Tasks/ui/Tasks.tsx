import { ErrorFetching } from '@shared/ui';
import { TasksSkeleton, TasksBody, TasksHeader } from '@pages/Tasks/ui';
import { useNotepad } from '@pages/Tasks/lib';
import { useTaskParams } from '@shared/lib';

export const Tasks = () => {
  const { title, notepadId, location, isError, isLoading, notFound } =
    useNotepad();
  const { validParams, setSearchParams } = useTaskParams();

  if (isLoading) return <TasksSkeleton />;
  if (isError) return <ErrorFetching />;
  if (notFound) return <ErrorFetching message='notepads.notFound' />;

  return (
    <>
      <TasksHeader
        title={title}
        params={validParams}
        notepadId={notepadId}
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
