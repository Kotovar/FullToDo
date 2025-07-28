import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTaskQueryKey,
  handleMutation,
  taskService,
  type MutationUpdateProps,
  type UseTaskDetailProps,
} from '@entities/Task';
import type { MutationMethods } from '@shared/api';
import type { Task } from '@sharedCommon/*';
import { useApiNotifications } from '@shared/lib';
import { useParams } from 'react-router';

export const useTaskDetail = ({ entity }: UseTaskDetailProps) => {
  const { notepadId, taskId = '' } = useParams();
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => getTaskQueryKey(notepadId), [notepadId]);

  const {
    data: task,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['task', notepadId, taskId],
    queryFn: () => taskService.getSingleTask(taskId, notepadId),
    select: data => data.data,
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
    ) =>
      handleMutation(
        mutateAsync,
        subtaskActionType,
        { updatedTask, id },
        {
          queryClient,
          queryKey,
          onSuccess,
          onError,
        },
      ),
    [mutateAsync, onError, onSuccess, queryClient, queryKey],
  );

  return {
    task,
    isLoading,
    isError,
    updateTask,
  };
};
