import { renderHook, waitFor } from '@testing-library/react';
import { setupMockServer } from '@shared/config';
import {
  createWrapper,
  MOCK_SINGE_NOTEPAD_RESPONSE,
  MOCK_TITLE_NON_EXISTING,
  getDeleteResponse,
} from '@shared/mocks';
import { taskService } from '@entities/Task';
import { notepadId, taskId } from 'shared/schemas';
import { useTasks } from './useTasks';

const params = new URLSearchParams();

const getInitialData = async () => {
  const { result } = renderHook(() => useTasks({ notepadId, params }), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isLoading).toBeFalsy());

  return result;
};

describe('useTasks hook', () => {
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(taskService, 'createTask').mockResolvedValue({
      status: 201,
      message: `A task with the title ${MOCK_TITLE_NON_EXISTING} has been successfully created`,
    });

    vi.spyOn(taskService, 'updateTask').mockResolvedValue({
      status: 200,
      message: 'A task with the _id 1 has been successfully updated',
    });

    vi.spyOn(taskService, 'deleteTask').mockResolvedValue(
      getDeleteResponse('Task'),
    );
  });

  test('Показывает уведомление об ошибке, если она произошла', async () => {
    const mockError = new Error('Ошибка сервера');
    vi.spyOn(taskService, 'updateTask').mockRejectedValue(mockError);

    const result = await getInitialData();
    const success = await result.current.methods.updateTask(
      {
        title: MOCK_TITLE_NON_EXISTING,
      },
      taskId,
    );

    expect(success).toBe(false);
    expect(taskService.updateTask).toHaveBeenCalledWith(taskId, {
      title: MOCK_TITLE_NON_EXISTING,
    });
  });

  test('Без указаний id возвращает пустой массив задач', async () => {
    const result = await getInitialData();
    expect(result.current.tasks).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE.data);
  });

  test('Если указан notepadId, но не указан taskId  - будет получен только 1 refetch, который вызывается при мутации', async () => {
    const getTasksFromNotepadMock = vi.spyOn(
      taskService,
      'getTasksFromNotepad',
    );
    const getSingleTaskMock = vi.spyOn(taskService, 'getSingleTask');

    const { result } = renderHook(() => useTasks({ notepadId, params }), {
      wrapper: createWrapper(),
    });

    await result.current.methods.updateTask({ title: 'New' }, taskId);

    expect(getSingleTaskMock).toHaveBeenCalledTimes(0);
    expect(getTasksFromNotepadMock).toHaveBeenCalledTimes(1);
  });

  test('возвращает список задач из конкретного блокнота', async () => {
    const result = await getInitialData();

    await waitFor(() =>
      expect(result.current.tasks).toEqual(MOCK_SINGE_NOTEPAD_RESPONSE.data),
    );
  });

  test('вызывает updateTask при создании задачи', async () => {
    const result = await getInitialData();

    result.current.methods.updateTask(
      {
        title: MOCK_TITLE_NON_EXISTING,
      },
      taskId,
    );

    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith(taskId, {
        title: MOCK_TITLE_NON_EXISTING,
      });
    });
  });

  test('вызывает deleteTask при создании задачи', async () => {
    const result = await getInitialData();

    result.current.methods.deleteTask(taskId);

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });
});
