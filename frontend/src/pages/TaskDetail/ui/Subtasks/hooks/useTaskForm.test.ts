import { renderHook, waitFor } from '@testing-library/react';
import { Task } from '@sharedCommon/*';
import { MOCK_TASK } from '@shared/mocks';
import { useTaskForm } from './useTaskForm';
import { getFormattedDate } from '..';

const updateTaskMock = vi.fn();
const onSuccessMock = vi.fn();

const testTaskKey = 'testTaskKey';

const getInitialData = async (taskKey: string, initialTask?: Task | null) => {
  const { result, rerender } = renderHook(
    ({ task, key }) => useTaskForm(task, updateTaskMock, onSuccessMock, key),
    {
      initialProps: { task: initialTask, key: taskKey },
    },
  );

  await waitFor(() => expect(result.current.form).toBeDefined());

  return { result, rerender };
};

describe('useTasks hook', () => {
  test('Если в начальном значении хука указана дата выполнения - отформатировать её', async () => {
    const { result } = await getInitialData(testTaskKey, MOCK_TASK);

    await waitFor(() => {
      expect(result.current.form.dueDate).toBe(
        getFormattedDate(MOCK_TASK.dueDate ?? new Date()),
      );
    });
  });

  test('Если начальное значение хука поменялось - обновить form', async () => {
    const { result, rerender } = await getInitialData(testTaskKey);

    expect(result.current.form).toEqual({
      title: '',
      dueDate: '',
      description: '',
      subtasks: [],
    });

    rerender({ task: MOCK_TASK, key: 'otherKey' });

    await waitFor(() => {
      expect(result.current.form).toEqual({
        title: MOCK_TASK.title,
        dueDate: getFormattedDate(MOCK_TASK.dueDate ?? new Date()),
        description: 'Описание для задачи 1',
        subtasks: MOCK_TASK.subtasks,
      });
    });
  });
});
