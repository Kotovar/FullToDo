import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTaskQueryKey,
  handleMutation,
  taskService,
  type UseCreateTaskProps,
} from '@entities/Task';
import type { CreateTask } from '@sharedCommon/*';
import { useApiNotifications } from '@shared/lib';

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
