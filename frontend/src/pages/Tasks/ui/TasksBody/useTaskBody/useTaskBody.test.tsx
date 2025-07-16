import { act, renderHook } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useTaskBody } from './useTaskBody';

const mockParams = new URLSearchParams(
  'isCompleted=true&unknown=123&priority=low',
);

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
  test('successful result for handleSaveTitle', async () => {
    const result = await getInitialData();

    await act(async () => {
      const title = await result.current.methods.handleSaveTitle(
        '999',
        'newTitle',
        'oldTitle',
      );

      expect(title).toBe('oldTitle');
    });

    await act(async () => {
      const title = await result.current.methods.handleSaveTitle(
        '1',
        'newTitle',
        'oldTitle',
      );

      expect(title).toBe('newTitle');
    });
  });
});
