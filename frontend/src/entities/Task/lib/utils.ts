import type { QueryClient, UseMutationResult } from '@tanstack/react-query';
import {
  handleMutationError,
  type QueryError,
  type MutationMethods,
} from '@shared/api';
import { commonNotepadId } from 'shared/schemas';

export const isCommonNotepad = (notepadId?: string) =>
  notepadId === commonNotepadId || notepadId === '';

export const getTaskQueryKey = (notepadId?: string) =>
  notepadId && notepadId !== commonNotepadId ? ['tasks', notepadId] : ['tasks'];

export const handleMutation = async <T, V>(
  mutation: UseMutationResult<T, unknown, V>,
  method: MutationMethods,
  payload: V,
  options: {
    queryClient: QueryClient;
    queryKey: string[];
    onSuccess?: (method: MutationMethods) => void;
    onError?: (error: QueryError) => void;
  },
) => {
  const { queryClient, queryKey, onSuccess, onError } = options;

  try {
    await mutation.mutateAsync(payload);

    await queryClient.refetchQueries({
      queryKey,
    });

    onSuccess?.(method);
    return true;
  } catch (error) {
    onError?.(handleMutationError(error));
    return false;
  }
};
