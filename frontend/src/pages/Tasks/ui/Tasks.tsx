import { ErrorFetching } from '@shared/ui';
import { useNotepad } from '@pages/Tasks/lib';
import { useTaskParams } from '@entities/Task';
import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { TasksSkeleton } from './TasksSkeleton';

export const Tasks = () => {
  const { title, notepadId, location, isError, isLoading, notFound } =
    useNotepad();
  const { validParams, setSearchParams } = useTaskParams();

  if (isLoading) return <TasksSkeleton />;
  if (notFound) return <ErrorFetching message='Блокнот не найден' />;
  if (isError && !notFound) return <ErrorFetching />;

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
