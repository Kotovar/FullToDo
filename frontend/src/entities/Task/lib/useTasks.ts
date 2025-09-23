import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getTaskQueryKey,
  handleMutation,
  isCommonNotepad,
  taskService,
  MutationUpdateProps,
  UseTasksProps,
} from '@entities/Task';
import { useApiNotifications } from '@shared/lib';
import type { MutationMethods } from '@shared/api';
import type { Task } from '@sharedCommon/*';
import { defaultQueryOptions } from '@shared/config';

export const useTasks = ({ notepadId, params, entity }: UseTasksProps) => {
  const queryClient = useQueryClient();
  const isCommon = isCommonNotepad(notepadId);
  const queryKey = useMemo(() => getTaskQueryKey(notepadId), [notepadId]);
  const paramsString = useMemo(() => params.toString(), [params]);

  const {
    data: tasks,
    isError: isErrorTasks,
    isLoading: isLoadingTasks,
  } = useQuery({
    queryKey: ['tasks', notepadId, params, paramsString],
    queryFn: () => taskService.getTasksFromNotepad(notepadId, params),
    select: data => data.data,
    enabled: !isCommon,
    ...defaultQueryOptions,
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
    ...defaultQueryOptions,
  });

  const { mutateAsync: mutationUpdate } = useMutation({
    mutationFn: ({ updatedTask, id }: MutationUpdateProps) =>
      taskService.updateTask(id, updatedTask),
  });

  const { mutateAsync: mutationDelete } = useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
  });

  const { onSuccess, onError } = useApiNotifications(entity);

  const updateTask = useCallback(
    async (
      updatedTask: Partial<Task>,
      id: string,
      subtaskActionType?: MutationMethods,
    ) =>
      await handleMutation(
        mutationUpdate,
        subtaskActionType ?? 'update',
        { updatedTask, id },
        { queryClient, queryKey, onSuccess, onError },
      ),
    [mutationUpdate, onError, onSuccess, queryClient, queryKey],
  );

  const deleteTask = useCallback(
    async (id: string) =>
      await handleMutation(mutationDelete, 'delete', id, {
        queryClient,
        queryKey,
        onSuccess,
        onError,
      }),
    [mutationDelete, queryClient, queryKey, onSuccess, onError],
  );

  const methods = useMemo(
    () => ({
      updateTask,
      deleteTask,
    }),
    [deleteTask, updateTask],
  );

  return {
    tasks: tasks || tasksAll,
    isError: isErrorTasks || isErrorTasksAll,
    isLoading: isLoadingTasks || isLoadingTasksAll,
    methods,
  };
};
