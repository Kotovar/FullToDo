import { useSearchParams } from 'react-router';
import { useNotepad } from '@pages/Tasks/lib';
import { ErrorFetching } from '@shared/ui';
import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { TasksSkeleton } from './TasksSkeleton';
import { taskQueryParamsSchema } from 'shared/schemas';

export const Tasks = () => {
  const { title, notepadId, location, isError, isLoading } = useNotepad();
  const [searchParams, setSearchParams] = useSearchParams();

  const validation = taskQueryParamsSchema.safeParse(
    Object.fromEntries(searchParams),
  );

  const params = validation.success ? searchParams : new URLSearchParams();

  if (isLoading) {
    return <TasksSkeleton />;
  }

  if (isError) {
    return <ErrorFetching />;
  }

  return (
    <>
      <TasksHeader title={title} setParams={setSearchParams} />
      <TasksBody
        notepadId={notepadId}
        notepadPathName={location}
        params={params}
      />
    </>
  );
};
