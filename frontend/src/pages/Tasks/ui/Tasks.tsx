import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useNotepad } from '@pages/Tasks/lib';
import { ErrorFetching } from '@shared/ui';
import { TasksHeader } from './TasksHeader';
import { TasksBody } from './TasksBody';
import { TasksSkeleton } from './TasksSkeleton';
import { taskQueryParamsSchema } from 'shared/schemas';
import { extractInvalidKeys } from '@sharedCommon/';

export const Tasks = () => {
  const { title, notepadId, location, isError, isLoading } = useNotepad();
  const [searchParams, setSearchParams] = useSearchParams();

  const { validParams } = useMemo(() => {
    const validation = taskQueryParamsSchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (validation.success) {
      return { validParams: searchParams };
    }

    const paramsCopy = new URLSearchParams(searchParams);
    const invalidKeys = extractInvalidKeys(validation.error);

    invalidKeys.forEach(key => paramsCopy.delete(key));

    return { validParams: paramsCopy };
  }, [searchParams]);

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
        params={validParams}
      />
    </>
  );
};
