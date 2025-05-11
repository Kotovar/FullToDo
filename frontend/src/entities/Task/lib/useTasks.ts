import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { commonNotepadId } from 'shared/schemas';
import { taskService } from '@entities/Task';
import type { MutationUpdateProps, UseTasksProps } from './utils';
import type { CreateTask, Task } from '@sharedCommon/*';
import { handleMutationError, type MutationMethods } from '@shared/api';

export const useTasks = (props: UseTasksProps) => {
  const { notepadId = '', taskId = '', onSuccess, onError } = props;
  const queryClient = useQueryClient();

  const {
    data: notepadTasks,
    isError: isNotepadTasksError,
    isLoading: isNotepadTasksLoading,
  } = useQuery({
    queryKey: ['tasks', notepadId],
    queryFn: () => taskService.getTasksFromNotepad(notepadId),
    select: data => data.data,
    enabled: !!notepadId,
  });

  const {
    data: tasksAll,
    isError: isAllTasksError,
    isLoading: isAllTasksLoading,
  } = useQuery({
    queryKey: ['tasks', 'all'],
    queryFn: () => taskService.getAllTasks(),
    select: data => data.data,
    enabled: notepadId === commonNotepadId || !!taskId,
  });

  const { data: singleTask, isLoading: isSingleTaskLoading } = useQuery({
    queryKey: ['task', notepadId, taskId],
    queryFn: () => taskService.getSingleTask(taskId, notepadId),
    select: data => data.data,
    enabled: !!taskId,
  });

  const handleMutation = async <T, V>(
    mutation: UseMutationResult<T, unknown, V>,
    method: MutationMethods,
    payload: V,
  ) => {
    try {
      await mutation.mutateAsync(payload);

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['tasks', notepadId],
        }),
        taskId &&
          queryClient.invalidateQueries({
            queryKey: ['task', notepadId, taskId],
          }),
        (!notepadId || notepadId === 'all') &&
          queryClient.invalidateQueries({
            queryKey: ['tasks', 'all'],
          }),
      ]);
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
      taskService.updateTask(id, updatedTask),
  });

  const mutationDelete = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
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
    tasks: notepadTasks ?? tasksAll ?? [],
    isError: isNotepadTasksError || isAllTasksError,
    isLoading:
      isNotepadTasksLoading || isSingleTaskLoading || isAllTasksLoading,
    ...(taskId && { task: singleTask }),
    methods: {
      updateTask,
      deleteTask,
      createTask,
    },
  };
};
