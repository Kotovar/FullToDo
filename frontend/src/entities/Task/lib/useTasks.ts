import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTaskQueryKey,
  handleMutation,
  isCommonNotepad,
  taskService,
  type MutationUpdateProps,
  type UseTasksProps,
} from '@entities/Task';
import type { MutationMethods } from '@shared/api';
import type { Task } from '@sharedCommon/*';
import { useApiNotifications } from '@shared/lib';

export const useTasks = ({ notepadId, params, entity }: UseTasksProps) => {
  const queryClient = useQueryClient();
  const isCommon = isCommonNotepad(notepadId);
  const queryKey = getTaskQueryKey(notepadId);
  const paramsString = params.toString();
  const {
    data: tasks,
    isError: isErrorTasks,
    isLoading: isLoadingTasks,
  } = useQuery({
    queryKey: ['tasks', notepadId, params, paramsString],
    queryFn: () => taskService.getTasksFromNotepad(notepadId, params),
    select: data => data.data,
    enabled: !isCommon,
  });

  const {
    data: tasksAll,
    isError: isErrorTasksAll,
    isLoading: isLoadingTasksAll,
  } = useQuery({
    queryKey: ['tasks', params, paramsString],
    queryFn: () => taskService.getAllTasks(params),
    select: data => data.data,
    enabled: isCommon,
  });

  const { mutateAsync: mutationUpdate } = useMutation({
    mutationFn: ({ updatedTask, id }: MutationUpdateProps) =>
      taskService.updateTask(id, updatedTask),
  });

  const { mutateAsync: mutationDelete } = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
  });
  const { onSuccess, onError } = useApiNotifications(entity);

  const updateTask = async (
    updatedTask: Partial<Task>,
    id: string,
    subtaskActionType?: MutationMethods,
  ) =>
    handleMutation(
      mutationUpdate,
      subtaskActionType ?? 'update',
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

  const deleteTask = (id: string) =>
    handleMutation(mutationDelete, 'delete', id, {
      queryClient,
      queryKey,
      onSuccess,
      onError,
    });

  return {
    tasks: tasks || tasksAll,
    isError: isErrorTasks || isErrorTasksAll,
    isLoading: isLoadingTasks || isLoadingTasksAll,
    methods: {
      updateTask,
      deleteTask,
    },
  };
};
