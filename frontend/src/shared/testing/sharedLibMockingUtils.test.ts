import {
  getUseNotificationsMock,
  getUseBackNavigateMock,
} from './sharedLibMockingUtils';
import * as useSharedLibHook from '@shared/lib';

describe('getUseNotificationsMock', () => {
  const showError = vi.fn();
  const showSuccess = vi.fn();

  test('Использует showError по умолчанию, если не указывать ', () => {
    vi.spyOn(useSharedLibHook, 'useNotifications').mockReturnValue({
      showError,
      showSuccess,
    });

    getUseNotificationsMock();
    const result = useSharedLibHook.useNotifications();

    expect(result.showError).not.toEqual(showError);
  });
});

describe('getUseBackNavigateMock', () => {
  const handleGoBack = vi.fn();

  test('Использует handleGoBack по умолчанию, если не указывать ', () => {
    vi.spyOn(useSharedLibHook, 'useBackNavigate').mockReturnValue(handleGoBack);

    getUseBackNavigateMock();

    const result = useSharedLibHook.useBackNavigate();

    expect(result).not.toEqual(handleGoBack);
  });
});
