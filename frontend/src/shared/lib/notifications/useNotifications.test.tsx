import { toast } from 'react-toastify';
import { renderHook } from '@testing-library/react';
import { useNotifications } from './useNotifications';
import { I18nextProvider } from 'react-i18next';
import testI18n from '@shared/testing/i18nForTests';

const getInitialData = async () => {
  const { result } = renderHook(() => useNotifications(), {
    wrapper: ({ children }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    ),
  });

  return result;
};

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('useNotifications hook', () => {
  const errorMessage = 'errors.common.SERVER_ERROR';
  const successMessage = 'notifications.tasks.update';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('showError', async () => {
    const result = await getInitialData();
    result.current.showError(errorMessage);

    expect(toast.error).toHaveBeenCalledTimes(1);
    expect(toast.error).toHaveBeenCalledWith(errorMessage, {
      toastId: 'error',
    });
  });

  test('showSuccess', async () => {
    const result = await getInitialData();
    result.current.showSuccess(successMessage);

    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(successMessage, {
      toastId: 'success',
    });
  });
});
