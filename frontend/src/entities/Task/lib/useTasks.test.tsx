import { renderHook, waitFor } from '@testing-library/react';
import {
  createWrapper,
  MOCK_TITLE_NON_EXISTING,
  getDeleteResponse,
  MOCK_TASK,
} from '@shared/mocks';
import { commonNotepadId, notepadId, taskId } from 'shared/schemas';
import { setupMockServer } from '@shared/testing';
import { taskService } from '@entities/Task';
import { useTasks } from './useTasks';

const params = new URLSearchParams();

const getInitialData = (notepad: string = notepadId) => {
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
      // data: [{ id: '1', title: 'Test task' }],
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

  test('should call the method to get tasks from a specific notebook if notepadId is specified', async () => {
    const getTasksFromNotepadMock = vi.spyOn(
      taskService,
      'getTasksFromNotepad',
    );
    const getSingleTaskMock = vi.spyOn(taskService, 'getSingleTask');
    const result = getInitialData();

    await result.current.methods.updateTask({ title: 'New' }, taskId);

    expect(getSingleTaskMock).toHaveBeenCalledTimes(0);
    expect(getTasksFromNotepadMock).toHaveBeenCalled();
  });

  test('should call the method to get all tasks if a common notepadId is specified', async () => {
    const getAllTasksMock = vi.spyOn(taskService, 'getAllTasks');
    const getSingleTaskMock = vi.spyOn(taskService, 'getSingleTask');
    const result = getInitialData(commonNotepadId);

    await result.current.methods.updateTask({ title: 'New' }, taskId);

    expect(getSingleTaskMock).toHaveBeenCalledTimes(0);
    expect(getAllTasksMock).toHaveBeenCalled();
  });

  test('should call updateTask when creating a task', async () => {
    const result = getInitialData();

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

  test('should call deleteTask when deleting a task', async () => {
    const result = getInitialData();

    result.current.methods.deleteTask(taskId);

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });
});
