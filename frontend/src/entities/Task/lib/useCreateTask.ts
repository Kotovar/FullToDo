import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApiNotifications } from '@shared/lib';
import {
  getTaskQueryKey,
  handleMutation,
  UseCreateTaskProps,
} from '@shared/lib';
import type { CreateTask } from '@sharedCommon/*';
import { taskService } from '@shared/api';

export const useCreateTask = ({ notepadId, entity }: UseCreateTaskProps) => {
  const queryClient = useQueryClient();
  const queryKey = getTaskQueryKey(notepadId);

  const { mutateAsync } = useMutation({
    mutationFn: (task: CreateTask) => taskService.createTask(task, notepadId),
  });

  const { onSuccess, onError } = useApiNotifications(entity);

  const createTask = async (task: CreateTask) =>
    handleMutation(mutateAsync, 'create', task, {
      queryClient,
      queryKey,
      onSuccess,
      onError,
    });

  return {
    createTask,
  };
};
