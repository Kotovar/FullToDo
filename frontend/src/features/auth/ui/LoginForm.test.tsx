import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import { authKeys, authService } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import { ROUTES } from '@sharedCommon';
import { LoginForm } from './LoginForm';

const renderLoginFlow = (initialEmail?: string | null) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return {
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18nForTests}>
          <MemoryRouter initialEntries={[ROUTES.app.login]}>
            <Routes>
              <Route
                path={ROUTES.app.login}
                element={
                  <LoginForm
                    initialEmail={initialEmail}
                    redirectTo={ROUTES.tasks.base}
                  />
                }
              />
              <Route path={ROUTES.tasks.base} element={<div>tasks-page</div>} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    ),
  };
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  test('shows validation errors for invalid fields', async () => {
    const user = userEvent.setup();

    renderLoginFlow();

    await user.type(
      screen.getByLabelText('login.form.email.label'),
      'bad-email',
    );
    await user.type(screen.getByLabelText('login.form.password.label'), 'x');
    await user.click(screen.getByRole('button', { name: 'login.form.submit' }));

    expect(
      await screen.findByText('login.validation.email.invalid'),
    ).toBeInTheDocument();
  });

  test('logs in, refreshes auth/me cache and redirects to tasks', async () => {
    const user = userEvent.setup();
    const loginSpy = vi.spyOn(authService, 'login').mockResolvedValue({
      message: 'Successful login',
      accessToken: 'access-token',
    });
    const meSpy = vi.spyOn(authService, 'me').mockResolvedValue({
      user: {
        userId: 1,
        email: 'user@example.com',
        isVerified: true,
      },
    });

    const { queryClient } = renderLoginFlow('user@example.com');

    await user.type(
      screen.getByLabelText('login.form.password.label'),
      'Password1',
    );
    await user.click(screen.getByRole('button', { name: 'login.form.submit' }));

    await waitFor(() =>
      expect(screen.getByText('tasks-page')).toBeInTheDocument(),
    );

    expect(loginSpy).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'Password1',
    });
    expect(meSpy).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryData(authKeys.me())).toEqual({
      userId: 1,
      email: 'user@example.com',
      isVerified: true,
    });
    expect(window.sessionStorage.getItem('login-email')).toBe('""');
  });
});
