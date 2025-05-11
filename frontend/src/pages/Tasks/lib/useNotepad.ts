import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';
import { useNotifications } from '@shared/lib';
import { handleMutationError } from '@shared/api';
import { ROUTES } from 'shared/routes';
import { commonNotepadId } from 'shared/schemas';

export const useNotepad = () => {
  const { notepadId } = useParams();
  const { showError } = useNotifications();
  const { pathname } = useLocation();

  const {
    data: notepadsData,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notepads'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  useEffect(() => {
    if (isError && error) {
      showError(handleMutationError(error).message);
    }
  }, [isError, error, showError]);

  const { title, resolvedNotepadId } = useMemo(() => {
    if (!notepadId && pathname === ROUTES.TASKS) {
      return {
        title: 'Все задачи',
        resolvedNotepadId: commonNotepadId,
      };
    }

    const notepad = notepadsData?.find(notepad => notepad._id === notepadId);
    return {
      title: notepad?.title ?? '',
      resolvedNotepadId: notepadId,
    };
  }, [notepadId, pathname, notepadsData]);

  return {
    title,
    isError,
    isLoading,
    location: pathname,
    notepadId: resolvedNotepadId,
  };
};
