import type { QueryClient } from '@tanstack/react-query';
import {
  handleMutationError,
  type QueryError,
  type MutationMethods,
} from '@shared/api';
import { COMMON_NOTEPAD_ID } from 'shared/schemas';

export const isCommonNotepad = (notepadId?: string) =>
  notepadId === COMMON_NOTEPAD_ID || notepadId === '';

export const getTaskQueryKey = (
  userScope: number | 'guest',
  notepadId?: string,
) =>
  notepadId && notepadId !== COMMON_NOTEPAD_ID
    ? ['tasks', userScope, notepadId]
    : ['tasks', userScope];

export const getTaskDetailQueryKey = (
  userScope: number | 'guest',
  notepadId: string | undefined,
  taskId: string,
) => ['task', userScope, notepadId ?? COMMON_NOTEPAD_ID, taskId] as const;

export const handleMutation = async <T, V>(
  mutateAsync: (payload: V) => Promise<T>,
  method: MutationMethods,
  payload: V,
  options: {
    queryClient: QueryClient;
    queryKey: readonly unknown[];
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
