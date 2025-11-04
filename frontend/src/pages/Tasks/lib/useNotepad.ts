import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';
import { useNotifications } from '@shared/lib';
import { handleMutationError } from '@shared/api';
import { commonNotepadId } from 'shared/schemas';
import { ROUTES } from 'shared/routes';

export const useNotepad = () => {
  const { notepadId } = useParams();
  const { showError } = useNotifications();
  const { pathname } = useLocation();
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['notepads'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  useEffect(() => {
    if (isError && error) {
      showError(handleMutationError(error).message);
    }
  }, [isError, error, showError]);

  return useMemo(() => {
    const isCommon = pathname === ROUTES.TASKS;
    const currentNotepad = data?.find(notepad => notepad._id === notepadId);
    const hasDataLoaded = !isLoading && !isError;

    return {
      title: isCommon ? 'Все задачи' : (currentNotepad?.title ?? ''),
      notepadId: isCommon ? commonNotepadId : (currentNotepad?._id ?? ''),
      location: pathname,
      notFound: hasDataLoaded && !currentNotepad && !isCommon,
      isError,
      isLoading,
    };
  }, [data, isError, isLoading, notepadId, pathname]);
};
