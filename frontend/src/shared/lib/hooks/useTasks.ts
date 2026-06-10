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

const makeQueryParams = (
  paramsObj: Record<string, string>,
  pageParam: number,
) => {
  const p = new URLSearchParams(paramsObj);
  p.set('page', pageParam.toString());
  p.set('limit', (paramsObj.limit ?? PAGINATION.DEFAULT_LIMIT).toString());
  return p;
};

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
  const queryKey = getTaskQueryKey(userScope, notepadId);
  const paramsObj = Object.fromEntries(params);
  const initialPage = Number(params.get('page') ?? PAGINATION.DEFAULT_PAGE);

  const {
    data: tasksPrivate,
    isError: isErrorPrivate,
    isLoading: isLoadingPrivate,
    fetchNextPage: fetchNextPagePrivate,
    hasNextPage: hasNextPagePrivate,
  } = useInfiniteQuery({
    queryKey: ['tasks', userScope, notepadId, initialPage, paramsObj],
    queryFn: ({ pageParam = initialPage }) =>
      taskService.getTasksFromNotepad(
        notepadId,
        makeQueryParams(paramsObj, pageParam),
      ),
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
    queryFn: ({ pageParam = initialPage }) =>
      taskService.getAllTasks(makeQueryParams(paramsObj, pageParam)),
    initialPageParam: initialPage,
    getNextPageParam: lastPage =>
      (lastPage.meta?.page ?? 0) < (lastPage.meta?.totalPages ?? 0)
        ? (lastPage.meta?.page ?? 0) + 1
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

  const updateTask = async (
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
  };

  const deleteTask = async (id: string) => {
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
  };

  const tasks = isCommon
    ? (tasksCommon?.pages.flatMap(page => page.data ?? []) ?? [])
    : (tasksPrivate?.pages.flatMap(page => page.data ?? []) ?? []);

  return {
    tasks,
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
