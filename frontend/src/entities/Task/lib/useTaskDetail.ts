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

export const useTaskDetail = (props: UseTaskDetailProps) => {
  const { notepadId, taskId, onSuccess, onError } = props;
  const queryClient = useQueryClient();
  const queryKey = getTaskQueryKey(notepadId);

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

  const mutationUpdate = useMutation({
    mutationFn: ({ updatedTask, id }: MutationUpdateProps) =>
      taskService.updateTask(id, updatedTask),
    onSuccess: () => refetch(),
  });

  const updateTask = async (
    updatedTask: Partial<Task>,
    id: string,
    subtaskActionType: MutationMethods,
  ) =>
    handleMutation(
      mutationUpdate,
      subtaskActionType,
      {
        updatedTask,
        id,
      },
      {
        queryClient,
        queryKey,
        onSuccess,
        onError,
      },
    );

  return {
    task,
    isLoading,
    isError,
    updateTask,
  };
};
