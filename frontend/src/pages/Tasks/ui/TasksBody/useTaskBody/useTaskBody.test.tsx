import { act, renderHook } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useTaskBody } from './useTaskBody';
import { setupMockServer } from '@shared/testing';

const mockParams = new URLSearchParams('isCompleted=true&unknown=123');

const mockProps = {
  notepadId: '1',
  params: mockParams,
};

const getInitialData = async () => {
  const { result } = renderHook(() => useTaskBody(mockProps), {
    wrapper: createWrapper(),
  });

  return result;
};

describe('useTaskBody', () => {
  setupMockServer();
  test('should save old title if id isn`t exist', async () => {
    const result = await getInitialData();

    await act(async () => {
      const title = await result.current.methods.handleSaveTitle(
        '999',
        'newTitle',
        'oldTitle',
      );

      expect(title).toBe('oldTitle');
    });
  });
});
