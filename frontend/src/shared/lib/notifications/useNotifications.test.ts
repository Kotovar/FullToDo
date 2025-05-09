import { toast } from 'react-toastify';
import { renderHook } from '@testing-library/react';
import { useNotifications } from './useNotifications';

const getInitialData = async () => {
  const { result } = renderHook(() => useNotifications());

  return result;
};

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useNotifications hook', () => {
  const errorMessage = 'This is an error message';
  const successMessage = 'This is a success message';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('showError', async () => {
    const result = await getInitialData();
    result.current.showError(errorMessage);

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  test('showSuccess', async () => {
    const result = await getInitialData();
    result.current.showSuccess(successMessage);

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(successMessage);
  });
});
