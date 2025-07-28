import { act, renderHook } from '@testing-library/react';
import { createWrapperWithRouter } from '@shared/mocks';
import { useNavigationBar } from './useNavigationBar';
import { setupMockServer } from '@shared/testing';

const getInitialData = async () => {
  const { result } = renderHook(() => useNavigationBar(), {
    wrapper: createWrapperWithRouter(),
  });

  return result;
};

describe('useNavigationBar hook', () => {
  setupMockServer();

  test('should change Title for saveTitle method', async () => {
    const result = await getInitialData();
    await act(async () => {
      const title = await result.current.actions.edit.saveTitle(
        '1',
        'New Title',
        'Current Title',
      );
      expect(title).toBe('New Title');
    });
  });
});
