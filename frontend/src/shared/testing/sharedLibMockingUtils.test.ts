import {
  getUseNotificationsMock,
  getUseBackNavigateMock,
} from './sharedLibMockingUtils';
import * as useSharedLibHook from '@shared/lib';

describe('getUseNotificationsMock', () => {
  const showError = vi.fn();
  const showSuccess = vi.fn();
  const showInfo = vi.fn();

  test('should use showError by default if not specified', () => {
    vi.spyOn(useSharedLibHook, 'useNotifications').mockReturnValue({
      showError,
      showSuccess,
      showInfo,
    });

    getUseNotificationsMock();
    const result = useSharedLibHook.useNotifications();

    expect(result.showError).not.toEqual(showError);
  });
});

describe('getUseBackNavigateMock', () => {
  const handleGoBack = vi.fn();

  test('should use handleGoBack by default if not specified', () => {
    vi.spyOn(useSharedLibHook, 'useBackNavigate').mockReturnValue(handleGoBack);

    getUseBackNavigateMock();

    const result = useSharedLibHook.useBackNavigate();

    expect(result).not.toEqual(handleGoBack);
  });
});
