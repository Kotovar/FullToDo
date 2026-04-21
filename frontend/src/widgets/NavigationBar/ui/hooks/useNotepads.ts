import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getNotepadsQueryKey, notepadService } from '@entities/Notepad';
import { ROUTES } from 'shared/routes';
import {
  authKeys,
  fetchCurrentUser,
  getUserQueryScope,
  handleMutationError,
  type MutationMethods,
} from '@shared/api';
import { useApiNotifications } from '@shared/lib';
import {
  handleMutationSuccess,
  MutationUpdateProps,
} from '@widgets/NavigationBar/lib';

export const useNotepads = () => {
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    enabled: false,
  });
  const isAuthenticated = Boolean(user);
  const userScope = getUserQueryScope(user?.userId);
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: getNotepadsQueryKey(userScope),
    queryFn: () => notepadService.getNotepads(),
    select: data => data.data,
    enabled: isAuthenticated,
  });

  const { onSuccess, onError } = useApiNotifications('notepad');

  const handleMutation = useCallback(
    async <T, V>(
      mutationFn: (payload: V) => Promise<T>,
      method: MutationMethods,
      payload: V,
    ) => {
      try {
        await mutationFn(payload);
        onSuccess?.(method);
        return true;
      } catch (error) {
        onError?.(handleMutationError(error));
        return false;
      }
    },
    [onError, onSuccess],
  );

  const { mutateAsync: mutateCreate } = useMutation({
    mutationFn: (title: string) => notepadService.createNotepad(title),
    onSuccess: () => handleMutationSuccess(refetch),
  });

  const { mutateAsync: mutationUpdate } = useMutation({
    mutationFn: ({ notepadId, updatedNotepad }: MutationUpdateProps) =>
      notepadService.updateNotepad(notepadId, updatedNotepad),
    onSuccess: () => handleMutationSuccess(refetch),
  });

  const { mutateAsync: mutationDelete } = useMutation({
    mutationFn: (notepadId: string) => notepadService.deleteNotepad(notepadId),
    onSuccess: () =>
      handleMutationSuccess(refetch, navigate, ROUTES.tasks.base),
  });

  const createNotepad = useCallback(
    async (title: string) => handleMutation(mutateCreate, 'create', title),
    [handleMutation, mutateCreate],
  );

  const deleteNotepad = useCallback(
    async (id: string) => handleMutation(mutationDelete, 'delete', id),
    [handleMutation, mutationDelete],
  );

  const updateNotepadTitle = useCallback(
    async (id: string, newTitle: string) =>
      handleMutation(mutationUpdate, 'update', {
        notepadId: id,
        updatedNotepad: { title: newTitle },
      }),
    [handleMutation, mutationUpdate],
  );

  const methods = useMemo(
    () => ({
      updateNotepadTitle,
      deleteNotepad,
      createNotepad,
    }),
    [createNotepad, deleteNotepad, updateNotepadTitle],
  );

  return {
    notepads: data ?? [],
    isLoading,
    isError,
    methods,
  };
};
