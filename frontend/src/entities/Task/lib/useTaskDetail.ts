import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTaskDetailQueryKey,
  getTaskQueryKey,
  handleMutation,
  isCommonNotepad,
  useApiNotifications,
  type MutationUpdateProps,
  type UseTaskDetailProps,
} from '@shared/lib';
import {
  authKeys,
  getUserQueryScope,
  taskService,
  type MutationMethods,
} from '@shared/api';
import type { Task } from '@sharedCommon/*';
import type { PublicUser } from 'shared/schemas';

export const useTaskDetail = ({ entity }: UseTaskDetailProps) => {
  const { notepadId, taskId = '' } = useParams();
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<PublicUser | null>(authKeys.me());
  const userScope = getUserQueryScope(user?.userId);
  const queryKey = useMemo(
    () => getTaskQueryKey(userScope, notepadId),
    [notepadId, userScope],
  );

  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: getTaskDetailQueryKey(userScope, notepadId, taskId),
    queryFn: () => taskService.getSingleTask(taskId, notepadId),
    select: data => data.data,
    enabled: taskId.length > 0,
  });

  const { mutateAsync } = useMutation({
    mutationFn: ({ updatedTask, id }: MutationUpdateProps) =>
      taskService.updateTask(id, updatedTask),
    onSuccess: async () => {
      await refetch();
    },
  });

  const { onSuccess, onError } = useApiNotifications(entity);

  const updateTask = useCallback(
    async (
      updatedTask: Partial<Task>,
      id: string,
      subtaskActionType: MutationMethods,
    ) => {
      const result = await handleMutation(
        mutateAsync,
        subtaskActionType,
        { updatedTask, id },
        { queryClient, queryKey, onSuccess, onError },
      );

      if (result && !isCommonNotepad(notepadId)) {
        await queryClient.invalidateQueries({
          queryKey: getTaskQueryKey(userScope),
        });
      }

      return result;
    },
    [
      mutateAsync,
      onError,
      onSuccess,
      queryClient,
      queryKey,
      notepadId,
      userScope,
    ],
  );

  return {
    task,
    isLoading,
    isError,
    updateTask,
  };
};
