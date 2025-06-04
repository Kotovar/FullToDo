import { renderHook } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useSuccessMessage } from './useSuccessMessage';

const getInitialData = () => {
  const { result } = renderHook(() => useSuccessMessage(), {
    wrapper: createWrapper(),
  });

  return result;
};

describe('useSuccessMessage', () => {
  test('successful', () => {
    const result = getInitialData();

    expect(result.current('task', 'create')).toBe('notifications.task.create');
  });
});
