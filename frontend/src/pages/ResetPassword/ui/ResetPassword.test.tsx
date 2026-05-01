import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import { authService } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import { ROUTES } from '@sharedCommon';
import { ResetPassword } from './ResetPassword';

vi.mock('react-i18next', async importOriginal => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

const renderResetPassword = (initialEntry = '/reset-password?token=token') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route
              path={ROUTES.app.resetPassword}
              element={<ResetPassword />}
            />
            <Route path={ROUTES.app.login} element={<div>login-page</div>} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('ResetPassword page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('shows confirm password mismatch validation', async () => {
    const user = userEvent.setup();

    renderResetPassword();

    await user.type(
      screen.getByLabelText('resetPassword.form.newPassword.label'),
      'Password2',
    );
    await user.type(
      screen.getByLabelText('resetPassword.form.confirmPassword.label'),
      'Password3',
    );
    await user.click(
      screen.getByRole('button', { name: 'resetPassword.form.submit' }),
    );

    expect(
      screen.getByText('resetPassword.validation.confirmPassword.mismatch'),
    ).toBeInTheDocument();
  });

  test('submits new password and redirects to login', async () => {
    const user = userEvent.setup();
    const resetPasswordSpy = vi
      .spyOn(authService, 'resetPassword')
      .mockResolvedValue({ message: 'Password reset successful' });

    renderResetPassword();

    await user.type(
      screen.getByLabelText('resetPassword.form.newPassword.label'),
      'Password2',
    );
    await user.type(
      screen.getByLabelText('resetPassword.form.confirmPassword.label'),
      'Password2',
    );
    await user.click(
      screen.getByRole('button', { name: 'resetPassword.form.submit' }),
    );

    await waitFor(() =>
      expect(resetPasswordSpy).toHaveBeenCalledWith({
        token: 'token',
        newPassword: 'Password2',
      }),
    );
    expect(await screen.findByText('login-page')).toBeInTheDocument();
  });
});
