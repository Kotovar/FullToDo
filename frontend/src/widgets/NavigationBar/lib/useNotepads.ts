import { useNavigate } from 'react-router';
import {
  useMutation,
  useQuery,
  type UseMutationResult,
} from '@tanstack/react-query';
import { notepadService } from '@entities/Notepad';
import { handleMutationSuccess, type MutationUpdateProps } from './utils';
import { ROUTES } from 'shared/routes';
import { handleMutationError, type MutationMethods } from '@shared/api';
import { useApiNotifications } from '@shared/lib';

export const useNotepads = () => {
  const navigate = useNavigate();
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ['notepads'],
    queryFn: notepadService.getNotepads,
    select: data => data.data,
  });

  const { onSuccess, onError } = useApiNotifications('notepad');

  const handleMutation = async <T, V>(
    mutation: UseMutationResult<T, unknown, V>,
    method: MutationMethods,
    payload: V,
  ) => {
    try {
      await mutation.mutateAsync(payload);
      onSuccess?.(method);
      return true;
    } catch (error) {
      onError?.(handleMutationError(error));
      return false;
    }
  };

  const mutationCreate = useMutation({
    mutationFn: (title: string) => notepadService.createNotepad(title),
    onSuccess: () => handleMutationSuccess(refetch),
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ notepadId, updatedNotepad }: MutationUpdateProps) =>
      notepadService.updateNotepad(notepadId, updatedNotepad),
    onSuccess: () => handleMutationSuccess(refetch),
  });

  const mutationDelete = useMutation({
    mutationFn: (notepadId: string) => notepadService.deleteNotepad(notepadId),
    onSuccess: () => handleMutationSuccess(refetch, navigate, ROUTES.TASKS),
  });

  const createNotepad = async (title: string) =>
    handleMutation(mutationCreate, 'create', title);

  const deleteNotepad = async (id: string) =>
    handleMutation(mutationDelete, 'delete', id);

  const updateNotepadTitle = async (id: string, newTitle: string) =>
    handleMutation(mutationUpdate, 'update', {
      notepadId: id,
      updatedNotepad: { title: newTitle },
    });

  return {
    notepads: data ?? [],
    isLoading,
    isError,
    methods: {
      updateNotepadTitle,
      deleteNotepad,
      createNotepad,
    },
  };
};
