import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import { authKeys, authService } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import { ROUTES } from '@sharedCommon';
import { LogoutButton } from './LogoutButton';

const renderLogout = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  queryClient.setQueryData(authKeys.me(), {
    userId: 1,
    email: 'user@example.com',
    isVerified: true,
    hasPassword: true,
  });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18nForTests}>
          <MemoryRouter initialEntries={[ROUTES.tasks.base]}>
            <Routes>
              <Route path={ROUTES.tasks.base} element={<LogoutButton />} />
              <Route path={ROUTES.app.login} element={<div>login-page</div>} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    ),
  };
};

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    HTMLElement.prototype.showPopover = vi.fn();
    HTMLElement.prototype.hidePopover = vi.fn();
  });

  test('logs out after confirmation and redirects to login', async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, 'logout').mockResolvedValue({
      message: 'Successful logout',
    });

    const { queryClient } = renderLogout();

    await user.click(screen.getByRole('button', { name: 'logout.label' }));
    await user.click(
      screen.getByText('logout.confirmAction').closest('button')!,
    );

    await waitFor(() =>
      expect(screen.getByText('login-page')).toBeInTheDocument(),
    );
    expect(queryClient.getQueryData(authKeys.me())).toBeNull();
  });

  test('does not log out when confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const logoutSpy = vi.spyOn(authService, 'logout');

    renderLogout();

    await user.click(screen.getByRole('button', { name: 'logout.label' }));
    await user.click(screen.getByText('logout.cancel').closest('button')!);

    expect(logoutSpy).not.toHaveBeenCalled();
  });
});
