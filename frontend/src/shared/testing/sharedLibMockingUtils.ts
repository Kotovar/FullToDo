import * as useSharedLibHook from '@shared/lib';

export const getUseNotificationsMock = (showError = vi.fn()) => {
  vi.spyOn(useSharedLibHook, 'useNotifications').mockReturnValue({
    showError,
    showSuccess: vi.fn(),
    showInfo: vi.fn(),
  });
};

export const getUseBackNavigateMock = (handleGoBack = vi.fn()) => {
  vi.spyOn(useSharedLibHook, 'useBackNavigate').mockReturnValue(handleGoBack);
};
