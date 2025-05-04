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
  const { notepadId = '', onSuccess, onError } = props;

  const { data, isError, refetch } = useQuery({
    queryKey: ['tasks', notepadId],
    queryFn: () => taskService.getTasksFromNotepad(notepadId),
    select: data => data.data,
    enabled: !!notepadId,
  });

  const handleMutation = async <T, V>(
    mutation: UseMutationResult<T, unknown, V>,
    method: MutationMethods,
    payload: V,
  ) => {
    try {
      await mutation.mutateAsync(payload);
      onSuccess?.(method);
      return true;
    } catch (error) {
      onError?.(handleMutationError(error));
      return false;
    }
  };

  const mutationCreate = useMutation({
    mutationFn: (task: CreateTask) => taskService.createTask(task, notepadId),
    onSuccess: () => refetch(),
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ updatedTask, id }: MutationUpdateProps) =>
      taskService.updateTask(notepadId, id, updatedTask),
    onSuccess: () => refetch(),
  });

  const mutationDelete = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(notepadId, id),
    onSuccess: () => refetch(),
  });

  const createTask = async (task: CreateTask) =>
    handleMutation(mutationCreate, 'create', task);

  const updateTask = async (updatedTask: Partial<Task>, id: string) =>
    handleMutation(mutationUpdate, 'update', {
      updatedTask,
      id,
    });

  const deleteTask = (id: string) =>
    handleMutation(mutationDelete, 'delete', id);

  return {
    tasks: data ?? [],
    isError,
    methods: {
      updateTask,
      deleteTask,
      createTask,
    },
  };
};
