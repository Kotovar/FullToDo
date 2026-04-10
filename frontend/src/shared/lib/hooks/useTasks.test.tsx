import { renderHook, waitFor } from '@testing-library/react';
import {
  createWrapper,
  MOCK_TITLE_NON_EXISTING,
  getDeleteResponse,
  MOCK_TASK,
} from '@shared/mocks';
import { COMMON_NOTEPAD_ID, NOTEPAD_ID, TASK_ID } from 'shared/schemas';
import { setupMockServer } from '@shared/testing';
import { useTasks } from './useTasks';
import { taskService } from '@shared/api';

const params = new URLSearchParams();

const getInitialData = (notepad: string = NOTEPAD_ID) => {
  const { result } = renderHook(
    () => useTasks({ notepadId: notepad, params, entity: 'task' }),
    {
      wrapper: createWrapper(),
    },
  );

  waitFor(() => expect(result.current.isLoading).toBeFalsy());

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

    vi.spyOn(taskService, 'getTasksFromNotepad').mockResolvedValue({
      data: [MOCK_TASK],
      meta: { page: 1, totalPages: 1, limit: 10, total: 0 },
      status: 200,
      message: 'Успех',
    });

    vi.spyOn(taskService, 'getAllTasks').mockResolvedValue({
      data: [MOCK_TASK],
      meta: { page: 1, totalPages: 1, limit: 10, total: 0 },
      status: 200,
      message: 'Успех',
    });
  });

  test('should show an error notification if one occurs', async () => {
    const mockError = new Error('Ошибка сервера');
    vi.spyOn(taskService, 'updateTask').mockRejectedValue(mockError);

    const result = getInitialData();
    const success = await result.current.methods.updateTask(
      {
        title: MOCK_TITLE_NON_EXISTING,
      },
      TASK_ID,
    );

    expect(success).toBe(false);
    expect(taskService.updateTask).toHaveBeenCalledWith(TASK_ID, {
      title: MOCK_TITLE_NON_EXISTING,
    });
  });

  test('should call the method to get tasks from a specific notebook if notepadId is specified', async () => {
    const getTasksFromNotepadMock = vi.spyOn(
      taskService,
      'getTasksFromNotepad',
    );
    const getSingleTaskMock = vi.spyOn(taskService, 'getSingleTask');
    const result = getInitialData();

    await result.current.methods.updateTask({ title: 'New' }, TASK_ID);

    expect(getSingleTaskMock).toHaveBeenCalledTimes(0);
    expect(getTasksFromNotepadMock).toHaveBeenCalled();
  });

  test('should call the method to get all tasks if a common notepadId is specified', async () => {
    const getAllTasksMock = vi.spyOn(taskService, 'getAllTasks');
    const getSingleTaskMock = vi.spyOn(taskService, 'getSingleTask');
    const result = getInitialData(COMMON_NOTEPAD_ID);

    await result.current.methods.updateTask({ title: 'New' }, TASK_ID);

    expect(getSingleTaskMock).toHaveBeenCalledTimes(0);
    expect(getAllTasksMock).toHaveBeenCalled();
  });

  test('should call updateTask when creating a task', async () => {
    const result = getInitialData();

    result.current.methods.updateTask(
      {
        title: MOCK_TITLE_NON_EXISTING,
      },
      TASK_ID,
    );

    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith(TASK_ID, {
        title: MOCK_TITLE_NON_EXISTING,
      });
    });
  });

  test('should call deleteTask when deleting a task', async () => {
    const result = getInitialData();

    result.current.methods.deleteTask(TASK_ID);

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(TASK_ID);
    });
  });
});
