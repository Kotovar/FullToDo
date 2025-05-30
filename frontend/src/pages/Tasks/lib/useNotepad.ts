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
    const isCommonNotepad = pathname === ROUTES.TASKS;
    const currentNotepad = data?.find(notepad => notepad._id === notepadId);

    if (isCommonNotepad) {
      return {
        title: 'Все задачи',
        notepadId: commonNotepadId,
        location: pathname,
        isError: false,
        isLoading: false,
        notFound: false,
      };
    }

    if (isLoading || !data) {
      return {
        title: '',
        notepadId: '',
        location: pathname,
        isError: false,
        notFound: false,
        isLoading,
      };
    }

    if (!currentNotepad) {
      return {
        title: '',
        notepadId: '',
        location: pathname,
        isError: false,
        isLoading: false,
        notFound: true,
      };
    }

    return {
      title: currentNotepad.title,
      notepadId: currentNotepad._id,
      location: pathname,
      isError: false,
      isLoading: false,
      notFound: false,
    };
  }, [pathname, isLoading, data, notepadId]);
};
