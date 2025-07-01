import { renderHook, waitFor } from '@testing-library/react';
import { setupMockServer } from '@shared/config';
import { createWrapper } from '@shared/mocks';
import { notepadId, taskId } from 'shared/schemas';
import { useTaskDetail } from './useTaskDetail';

describe('useTaskDetail hook', () => {
  setupMockServer();

  test('success', async () => {
    const { result } = renderHook(
      () => useTaskDetail({ notepadId, taskId, entity: 'task' }),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.updateTask({ title: 'new' }, '1', 'update');
    expect(result.current.isError).toBe(false);
  });
});
