import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateTask, Task } from '@sharedCommon/*';
import { taskService } from '..';

export const useTasks = (notepadId: string = '') => {
  const { data, isError, refetch } = useQuery({
    queryKey: ['tasks', notepadId],
    queryFn: () => taskService.getTasksFromNotepad(notepadId),
    select: data => data.data,
    enabled: !!notepadId,
  });

  const mutationCreate = useMutation({
    mutationFn: (task: CreateTask) => taskService.createTask(task, notepadId),
    onSuccess: () => refetch(),
  });

  const mutationUpdate = useMutation({
    mutationFn: ({
      updatedTask,
      id,
    }: {
      updatedTask: Partial<Task>;
      id: string;
    }) => taskService.updateTask(notepadId, id, updatedTask),
    onSuccess: () => refetch(),
  });

  const mutationDelete = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(notepadId, id),
    onSuccess: () => refetch(),
  });

  const createTask = (task: CreateTask) => mutationCreate.mutate(task);
  const updateTask = async (updatedTask: Partial<Task>, id: string) =>
    mutationUpdate.mutateAsync({ updatedTask, id });
  const deleteTask = (id: string) => {
    mutationDelete.mutate(id);
  };

  return {
    tasks: data,
    isError,
    methods: {
      updateTask,
      deleteTask,
      createTask,
    },
  };
};
