import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';
import { useNotifications } from '@shared/lib';
import { handleMutationError } from '@shared/api';
import { COMMON_NOTEPAD_ID } from 'shared/schemas';
import { ROUTES } from 'shared/routes';

export const useNotepad = () => {
  const { notepadId } = useParams();
  const { showError } = useNotifications();
  const { pathname } = useLocation();
  const { t } = useTranslation();
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
    const isCommon = pathname === ROUTES.tasks.base;
    const currentNotepad = data?.find(notepad => notepad._id === notepadId);
    const hasDataLoaded = !isLoading && !isError;

    return {
      title: isCommon ? t('tasks.all') : (currentNotepad?.title ?? ''),
      notepadId: isCommon ? COMMON_NOTEPAD_ID : (currentNotepad?._id ?? ''),
      location: pathname,
      notFound: hasDataLoaded && !currentNotepad && !isCommon,
      isError,
      isLoading,
    };
  }, [data, isError, isLoading, notepadId, pathname, t]);
};
