import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotepadsQueryKey, notepadService } from '@entities/Notepad';
import { useNotifications } from '@shared/lib';
import { authKeys, getUserQueryScope, handleMutationError } from '@shared/api';
import { COMMON_NOTEPAD_ID } from 'shared/schemas';
import { ROUTES } from 'shared/routes';
import type { PublicUser } from 'shared/schemas';

export const useNotepad = () => {
  const { notepadId } = useParams();
  const { showError } = useNotifications();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<PublicUser | null>(authKeys.me());
  const userScope = getUserQueryScope(user?.userId);
  const { data, isError, isLoading, error } = useQuery({
    queryKey: getNotepadsQueryKey(userScope),
    queryFn: () => notepadService.getNotepads(),
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
