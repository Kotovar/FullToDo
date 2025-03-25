import { taskService } from '@features/Tasks';
import { Task } from '@sharedCommon/*';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useTask = (notepadId: string, taskId: string) => {
  const { data, refetch, isError } = useQuery({
    queryKey: ['task', notepadId, taskId],
    queryFn: () => taskService.getSingleTask(notepadId, taskId),
    select: data => data.data,
  });

  const mutation = useMutation({
    mutationFn: (updatedTask: Partial<Task>) =>
      taskService.updateTask(notepadId, taskId, updatedTask),
    onSuccess: () => refetch(),
  });

  const updateTask = (updatedTask: Partial<Task>) => {
    mutation.mutate(updatedTask);
  };

  return { task: data, isError, updateTask };
};
