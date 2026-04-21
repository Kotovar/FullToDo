import { useCallback, useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
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
import {
  authKeys,
  fetchCurrentUser,
  getUserQueryScope,
  taskService,
  type MutationMethods,
} from '@shared/api';
import { PAGINATION, type Task } from '@sharedCommon/';

export const useTasks = ({ notepadId, params, entity }: UseTasksProps) => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    enabled: false,
  });
  const isAuthenticated = Boolean(user);
  const userScope = getUserQueryScope(user?.userId);
  const isCommon = isCommonNotepad(notepadId);
  const queryKey = useMemo(
    () => getTaskQueryKey(userScope, notepadId),
    [notepadId, userScope],
  );
  const paramsObj = useMemo(() => Object.fromEntries(params), [params]);
  const initialPage = Number(params.get('page') ?? PAGINATION.DEFAULT_PAGE);

  const {
    data: tasksPrivate,
    isError: isErrorPrivate,
    isLoading: isLoadingPrivate,
    fetchNextPage: fetchNextPagePrivate,
    hasNextPage: hasNextPagePrivate,
  } = useInfiniteQuery({
    queryKey: ['tasks', userScope, notepadId, initialPage, paramsObj],
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
    enabled: isAuthenticated && !isCommon,
  });

  const {
    data: tasksCommon,
    isError: isErrorCommon,
    isLoading: isLoadingCommon,
    fetchNextPage: fetchNextPageCommon,
    hasNextPage: hasNextPageCommon,
  } = useInfiniteQuery({
    queryKey: ['tasks', userScope, initialPage, paramsObj],
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
    enabled: isAuthenticated && isCommon,
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
          queryKey: getTaskQueryKey(userScope, updatedTask.notepadId),
        });
      }

      if (result && !isCommon) {
        await queryClient.invalidateQueries({
          queryKey: getTaskQueryKey(userScope),
        });
      }

      return result;
    },
    [
      mutationUpdate,
      onError,
      onSuccess,
      queryClient,
      queryKey,
      isCommon,
      userScope,
    ],
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const result = await handleMutation(mutationDelete, 'delete', id, {
        queryClient,
        queryKey,
        onSuccess,
        onError,
      });

      if (result && !isCommon) {
        await queryClient.invalidateQueries({
          queryKey: getTaskQueryKey(userScope),
        });
      }

      return result;
    },
    [
      mutationDelete,
      queryClient,
      queryKey,
      isCommon,
      onSuccess,
      onError,
      userScope,
    ],
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
