import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';
import { useNotifications } from '@shared/lib';
import { handleMutationError } from '@shared/api';

export const useNotepad = () => {
  const { notepadId } = useParams();
  const { showError } = useNotifications();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['notepads'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  useEffect(() => {
    if (isError) {
      showError(handleMutationError(error).message);
    }
  }, [isError, error, showError]);

  const location = useLocation().pathname;
  const title = data?.find(notepad => notepad._id === notepadId)?.title ?? '';

  return {
    title,
    isError,
    isLoading,
    location,
    notepadId,
  };
};
