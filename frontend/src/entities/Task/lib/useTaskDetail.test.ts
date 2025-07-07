import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { setupMockServer } from '@shared/testing';
import { useTaskDetail } from './useTaskDetail';

describe('useTaskDetail hook', () => {
  setupMockServer();

  test('success', async () => {
    const { result } = renderHook(() => useTaskDetail({ entity: 'task' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.updateTask({ title: 'new' }, '1', 'update');
    expect(result.current.isError).toBe(false);
  });
});
