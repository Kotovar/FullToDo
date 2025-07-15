import { act, renderHook, waitFor } from '@testing-library/react';
import { Task } from '@sharedCommon/*';
import { MOCK_TASK } from '@shared/mocks';
import { useTaskForm } from './useTaskForm';
import { getFormattedDate } from './utils';

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
  test('if the initial value of the hook specifies the execution date - format it', async () => {
    const { result } = await getInitialData(testTaskKey, MOCK_TASK);

    await waitFor(() => {
      expect(result.current.form.dueDate).toBe(
        getFormattedDate(MOCK_TASK.dueDate ?? new Date()),
      );
    });
  });

  test('If the initial value of the hook has changed - update the form', async () => {
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

  test('should onUpdateTask return false if updateTask return false', async () => {
    updateTaskMock.mockRejectedValueOnce(new Error('Update failed'));
    const { result } = await getInitialData(testTaskKey, MOCK_TASK);

    act(() => {
      result.current.methods.onChangeTitle({
        target: { value: 'Updated title' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.form.title).toBe('Updated title');
    });

    let isSuccess;
    await act(async () => {
      isSuccess = await result.current.methods.onUpdateTask();
    });

    expect(isSuccess).toBe(false);
    expect(updateTaskMock).toHaveBeenCalledWith(
      { title: 'Updated title' },
      '',
      'update',
    );
  });

  test('should onCreateSubtask return undefined if title is empty', async () => {
    const { result } = await getInitialData(testTaskKey, MOCK_TASK);

    act(() => {
      result.current.methods.onChangeTitle({
        target: { value: '   ' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.form.title).toBe('   ');
    });

    act(() => {
      result.current.methods.onCreateSubtask();
    });

    expect(updateTaskMock).not.toHaveBeenCalled();
  });

  test('should onCreateSubtask return undefined if title is empty', async () => {
    const { result } = await getInitialData(testTaskKey, MOCK_TASK);

    act(() => {
      result.current.methods.onChangeTitle({
        target: { value: '   ' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await waitFor(() => {
      expect(result.current.form.title).toBe('   ');
    });

    act(() => {
      result.current.methods.onCreateSubtask();
    });

    expect(updateTaskMock).not.toHaveBeenCalled();
  });
});
