import { renderHook, waitFor, act } from '@testing-library/react';
import { Subtask } from '@sharedCommon/*';
import { useSubtaskItem } from './useSubtaskItem';
import { MOCK_SUBTASK } from '@shared/mocks';

const updateSubtaskMock = vi.fn();

const getInitialData = async (initialTask: Subtask) => {
  const { result, rerender } = renderHook(
    ({ subtask }) => useSubtaskItem(subtask, updateSubtaskMock),
    {
      initialProps: { subtask: initialTask },
    },
  );

  await waitFor(() => expect(result.current.methods).toBeDefined());

  return { result, rerender };
};

describe('useSubtaskItem hook', () => {
  test('should call onSaveTitle when Enter key is pressed', async () => {
    const { result } = await getInitialData(MOCK_SUBTASK);

    act(() => result.current.methods.onEnableEditing());

    act(() =>
      result.current.methods.onChangeTitle({
        target: { value: 'Updated title' },
      } as React.ChangeEvent<HTMLInputElement>),
    );

    act(() =>
      result.current.methods.onKeyDown({
        key: 'Enter',
      } as React.KeyboardEvent<HTMLInputElement>),
    );

    expect(result.current.isEditing).toBe(false);
    expect(updateSubtaskMock).toHaveBeenCalledWith({
      type: 'update',
      id: MOCK_SUBTASK._id,
      title: 'Updated title',
      isCompleted: MOCK_SUBTASK.isCompleted,
    });
  });

  test('should call onSaveTitle when Escape key is pressed', async () => {
    const { result } = await getInitialData(MOCK_SUBTASK);

    act(() => result.current.methods.onEnableEditing());

    act(() =>
      result.current.methods.onChangeTitle({
        target: { value: 'Updated title' },
      } as React.ChangeEvent<HTMLInputElement>),
    );

    act(() =>
      result.current.methods.onKeyDown({
        key: 'Escape',
      } as React.KeyboardEvent<HTMLInputElement>),
    );

    expect(result.current.isEditing).toBe(false);
    expect(updateSubtaskMock).not.toHaveBeenCalled();
  });
});
