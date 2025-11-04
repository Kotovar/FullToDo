import { useCallback, useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getTaskQueryKey,
  handleMutation,
  isCommonNotepad,
  MutationUpdateProps,
  useApiNotifications,
  UseTasksProps,
} from '@shared/lib';
import { taskService, type MutationMethods } from '@shared/api';
import { PAGINATION, type Task } from '@sharedCommon/';

export const useTasks = ({ notepadId, params, entity }: UseTasksProps) => {
  const queryClient = useQueryClient();
  const isCommon = isCommonNotepad(notepadId);
  const queryKey = useMemo(() => getTaskQueryKey(notepadId), [notepadId]);
  const paramsObj = useMemo(() => Object.fromEntries(params), [params]);
  const initialPage = Number(params.get('page') ?? PAGINATION.DEFAULT_PAGE);

  const {
    data: tasksPrivate,
    isError: isErrorPrivate,
    isLoading: isLoadingPrivate,
    fetchNextPage: fetchNextPagePrivate,
    hasNextPage: hasNextPagePrivate,
  } = useInfiniteQuery({
    queryKey: ['tasks', notepadId, initialPage, paramsObj],
    queryFn: ({ pageParam = initialPage }) => {
      const queryParams = new URLSearchParams(paramsObj);
      queryParams.set('page', pageParam.toString());
      queryParams.set(
        'limit',
        (paramsObj.limit ?? PAGINATION.DEFAULT_LIMIT).toString(),
      );
      return taskService.getTasksFromNotepad(notepadId, queryParams);
    },
    initialPageParam: initialPage,
    getNextPageParam: lastPage =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    enabled: !isCommon,
  });

  const {
    data: tasksCommon,
    isError: isErrorCommon,
    isLoading: isLoadingCommon,
    fetchNextPage: fetchNextPageCommon,
    hasNextPage: hasNextPageCommon,
  } = useInfiniteQuery({
    queryKey: ['tasks', initialPage, paramsObj],
    queryFn: ({ pageParam = initialPage }) => {
      const queryParams = new URLSearchParams(paramsObj);
      queryParams.set('page', pageParam.toString());
      queryParams.set(
        'limit',
        (paramsObj.limit ?? PAGINATION.DEFAULT_LIMIT).toString(),
      );
      return taskService.getAllTasks(queryParams);
    },
    initialPageParam: initialPage,
    getNextPageParam: lastPage =>
      lastPage.meta?.page < lastPage.meta?.totalPages
        ? lastPage.meta.page + 1
        : undefined,
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

  const updateTask = useCallback(
    async (
      updatedTask: Partial<Task>,
      id: string,
      subtaskActionType?: MutationMethods,
    ) => {
      const result = await handleMutation(
        mutationUpdate,
        subtaskActionType ?? 'update',
        { updatedTask, id },
        { queryClient, queryKey, onSuccess, onError },
      );
      if (updatedTask.notepadId) {
        queryClient.invalidateQueries({
          queryKey: getTaskQueryKey(updatedTask.notepadId),
        });
      }

      return result;
    },
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

  const tasksPrivateResult = useMemo(
    () => tasksPrivate?.pages.flatMap(page => page.data ?? []) ?? [],
    [tasksPrivate],
  );

  const tasksCommonResult = useMemo(
    () => tasksCommon?.pages.flatMap(page => page.data ?? []) ?? [],
    [tasksCommon],
  );

  const tasksFinal = isCommon ? tasksCommonResult : tasksPrivateResult;

  return {
    tasks: tasksFinal,
    isError: isErrorPrivate || isErrorCommon,
    isLoading: isLoadingPrivate || isLoadingCommon,
    hasNextPage: isCommon ? hasNextPageCommon : hasNextPagePrivate,
    methods: {
      updateTask,
      deleteTask,
      fetchNextPage: isCommon ? fetchNextPageCommon : fetchNextPagePrivate,
    },
  };
};
