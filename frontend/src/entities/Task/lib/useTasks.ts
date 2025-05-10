import {
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query';
import { CreateTask, Task } from '@sharedCommon/*';
import { taskService } from '@entities/Task';
import { type MutationUpdateProps, type UseTasksProps } from './utils';
import { handleMutationError, type MutationMethods } from '@shared/api';

export const useTasks = (props: UseTasksProps) => {
  const { notepadId = '', taskId = '', onSuccess, onError } = props;

  const {
    data: tasks,
    isError,
    isLoading: isTasksLoading,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', notepadId],
    queryFn: () => taskService.getTasksFromNotepad(notepadId),
    select: data => data.data,
    enabled: !!notepadId,
  });

  const {
    data: singleTask,
    isLoading: isSingleTaskLoading,
    refetch: refetchSingleTask,
  } = useQuery({
    queryKey: ['task', notepadId, taskId],
    queryFn: () => taskService.getSingleTask(notepadId, taskId),
    select: data => data.data,
    enabled: !!notepadId && !!taskId,
  });

  const handleMutation = async <T, V>(
    mutation: UseMutationResult<T, unknown, V>,
    method: MutationMethods,
    payload: V,
  ) => {
    try {
      await mutation.mutateAsync(payload);

      const refetchPromises = [];
      refetchPromises.push(refetchTasks());

      if (taskId) {
        refetchPromises.push(refetchSingleTask());
      }

      await Promise.all(refetchPromises);
      onSuccess?.(method);

      return true;
    } catch (error) {
      onError?.(handleMutationError(error));

      return false;
    }
  };

  const mutationCreate = useMutation({
    mutationFn: (task: CreateTask) => taskService.createTask(task, notepadId),
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ updatedTask, id }: MutationUpdateProps) =>
      taskService.updateTask(notepadId, id, updatedTask),
  });

  const mutationDelete = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(notepadId, id),
  });

  const createTask = async (task: CreateTask) =>
    handleMutation(mutationCreate, 'create', task);

  const updateTask = async (
    updatedTask: Partial<Task>,
    id: string,
    subtaskActionType?: MutationMethods,
  ) =>
    handleMutation(mutationUpdate, subtaskActionType ?? 'update', {
      updatedTask,
      id,
    });

  const deleteTask = (id: string) =>
    handleMutation(mutationDelete, 'delete', id);

  return {
    tasks: tasks ?? [],
    isError,
    isLoading: isTasksLoading || isSingleTaskLoading,
    ...(taskId && { task: singleTask ?? null }),
    methods: {
      updateTask,
      deleteTask,
      createTask,
    },
  };
};
