import { act, renderHook, waitFor } from '@testing-library/react';
import { Task } from '@sharedCommon/*';
import { MOCK_TASK } from '@shared/mocks';
import { useTaskForm } from './useTaskForm';
import { getFormattedDate } from './getFormattedDate';

const getInitialData = async (initialTask?: Task | null) => {
  const { result, rerender } = renderHook(({ task }) => useTaskForm(task), {
    initialProps: { task: initialTask },
  });

  await waitFor(() => expect(result.current.form).toBeDefined());

  return { result, rerender };
};

describe('useTasks hook', () => {
  test('если название подзадачи пустое - не добавлять подзадачу', async () => {
    const { result } = await getInitialData();

    act(() => {
      result.current.setSubtaskTitle('');
    });

    await waitFor(() => {
      expect(result.current.subtaskTitle).toBe('');
    });

    const initialSubtasksCount = result.current.form.subtasks.length;

    act(() => {
      result.current.handleAddSubtask();
    });

    await waitFor(() => {
      expect(result.current.form.subtasks.length).toBe(initialSubtasksCount);
    });
  });

  test('если название подзадачи не пустое - добавлять подзадачу', async () => {
    const { result } = await getInitialData(MOCK_TASK);

    act(() => {
      result.current.setSubtaskTitle('new subtask');
    });

    await waitFor(() => {
      expect(result.current.subtaskTitle).toBe('new subtask');
    });

    const initialSubtasksCount = result.current.form.subtasks.length;

    act(() => {
      result.current.handleAddSubtask();
    });

    await waitFor(() => {
      expect(result.current.form.subtasks.length).toBe(
        initialSubtasksCount + 1,
      );
    });
  });

  test('Если в начальном значении хука указана дата выполнения - отформатировать её', async () => {
    const { result } = await getInitialData(MOCK_TASK);

    await waitFor(() => {
      expect(result.current.form.dueDate).toBe(
        getFormattedDate(MOCK_TASK.dueDate),
      );
    });
  });

  test('Если начальное значение хука поменялось - обновить form', async () => {
    const { result, rerender } = await getInitialData();

    expect(result.current.form).toEqual({
      title: '',
      dueDate: '',
      description: '',
      subtasks: [],
    });

    rerender({ task: MOCK_TASK });

    await waitFor(() => {
      expect(result.current.form).toEqual({
        title: MOCK_TASK.title,
        dueDate: getFormattedDate(MOCK_TASK.dueDate),
        description: '',
        subtasks: MOCK_TASK.subtasks,
      });
    });
  });
});
