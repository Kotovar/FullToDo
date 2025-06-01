import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTaskQueryKey,
  handleMutation,
  taskService,
  type UseCreateTaskProps,
} from '@entities/Task';
import type { CreateTask } from '@sharedCommon/*';

export const useCreateTask = (props: UseCreateTaskProps) => {
  const { notepadId, onSuccess, onError } = props;
  const queryClient = useQueryClient();
  const queryKey = getTaskQueryKey(notepadId);

  const mutationCreate = useMutation({
    mutationFn: (task: CreateTask) => taskService.createTask(task, notepadId),
  });

  const createTask = async (task: CreateTask) =>
    handleMutation(mutationCreate, 'create', task, {
      queryClient,
      queryKey,
      onSuccess,
      onError,
    });

  return {
    createTask,
  };
};
