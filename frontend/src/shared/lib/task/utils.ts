import type { QueryClient } from '@tanstack/react-query';
import {
  handleMutationError,
  type QueryError,
  type MutationMethods,
} from '@shared/api';
import { COMMON_NOTEPAD_ID } from 'shared/schemas';

export const isCommonNotepad = (notepadId?: string) =>
  notepadId === COMMON_NOTEPAD_ID || notepadId === '';

export const getTaskQueryKey = (notepadId?: string) =>
  notepadId && notepadId !== COMMON_NOTEPAD_ID
    ? ['tasks', notepadId]
    : ['tasks'];

export const handleMutation = async <T, V>(
  mutateAsync: (payload: V) => Promise<T>,
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
    await mutateAsync(payload);

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
