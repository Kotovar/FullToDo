import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import { authKeys, authService } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import { ROUTES } from '@sharedCommon';
import { ChangePasswordForm } from './ChangePasswordForm';

vi.mock('@shared/lib', async importOriginal => {
  const actual = await importOriginal<typeof import('@shared/lib')>();
  return {
    ...actual,
    useNotifications: () => ({
      showSuccess: vi.fn(),
      showError: vi.fn(),
      showInfo: vi.fn(),
    }),
  };
});

const renderChangePasswordForm = () => {
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
          <MemoryRouter initialEntries={[ROUTES.app.account]}>
            <Routes>
              <Route
                path={ROUTES.app.account}
                element={<ChangePasswordForm email='user@example.com' />}
              />
              <Route path={ROUTES.app.login} element={<div>login-page</div>} />
            </Routes>
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    ),
  };
};

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  test('renders collapsed state by default and expands on click', async () => {
    const user = userEvent.setup();

    renderChangePasswordForm();

    expect(
      screen.queryByLabelText('account.security.form.currentPassword.label'),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );

    expect(
      screen.getByLabelText('account.security.form.currentPassword.label'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'account.security.form.cancel' }),
    ).toBeInTheDocument();
  });

  test('toggles visibility for all password fields', async () => {
    const user = userEvent.setup();

    renderChangePasswordForm();

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );

    const currentPasswordInput = screen.getByLabelText(
      'account.security.form.currentPassword.label',
    );
    const newPasswordInput = screen.getByLabelText(
      'account.security.form.newPassword.label',
    );
    const confirmPasswordInput = screen.getByLabelText(
      'account.security.form.confirmPassword.label',
    );

    expect(currentPasswordInput).toHaveAttribute('type', 'password');
    expect(newPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    await user.click(
      screen.getByRole('button', {
        name: 'account.security.form.currentPassword.show',
      }),
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.security.form.newPassword.show',
      }),
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.security.form.confirmPassword.show',
      }),
    );

    expect(currentPasswordInput).toHaveAttribute('type', 'text');
    expect(newPasswordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  test('shows validation error when confirmation does not match', async () => {
    const user = userEvent.setup();

    renderChangePasswordForm();

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );

    await user.type(
      screen.getByLabelText('account.security.form.currentPassword.label'),
      'Password1',
    );
    await user.type(
      screen.getByLabelText('account.security.form.newPassword.label'),
      'Password2',
    );
    await user.type(
      screen.getByLabelText('account.security.form.confirmPassword.label'),
      'Password3',
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.security.form.submit',
      }),
    );

    expect(
      await screen.findByText(
        'account.security.validation.confirmPassword.mismatch',
      ),
    ).toBeInTheDocument();
  });

  test('shows validation error when new password matches current password', async () => {
    const user = userEvent.setup();
    const changePasswordSpy = vi.spyOn(authService, 'changePassword');

    renderChangePasswordForm();

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );

    await user.type(
      screen.getByLabelText('account.security.form.currentPassword.label'),
      'Password1',
    );
    await user.type(
      screen.getByLabelText('account.security.form.newPassword.label'),
      'Password1',
    );
    await user.type(
      screen.getByLabelText('account.security.form.confirmPassword.label'),
      'Password1',
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.security.form.submit',
      }),
    );

    expect(
      await screen.findByText(
        'account.security.validation.newPassword.sameAsCurrent',
      ),
    ).toBeInTheDocument();
    expect(changePasswordSpy).not.toHaveBeenCalled();
  });

  test('changes password, resets session and redirects to login', async () => {
    const user = userEvent.setup();
    vi.spyOn(authService, 'changePassword').mockResolvedValue({
      message: 'Password changed successfully',
    });

    const { queryClient } = renderChangePasswordForm();

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );

    await user.type(
      screen.getByLabelText('account.security.form.currentPassword.label'),
      'Password1',
    );
    await user.type(
      screen.getByLabelText('account.security.form.newPassword.label'),
      'Password2',
    );
    await user.type(
      screen.getByLabelText('account.security.form.confirmPassword.label'),
      'Password2',
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.security.form.submit',
      }),
    );

    await waitFor(() =>
      expect(screen.getByText('login-page')).toBeInTheDocument(),
    );
    expect(authService.changePassword).toHaveBeenCalledWith({
      oldPassword: 'Password1',
      newPassword: 'Password2',
    });
    expect(queryClient.getQueryData(authKeys.me())).toBeNull();
    expect(window.sessionStorage.getItem('login-email')).toBe(
      '"user@example.com"',
    );
  });

  test('collapses expanded form on cancel', async () => {
    const user = userEvent.setup();

    renderChangePasswordForm();

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );
    await user.click(
      screen.getByRole('button', { name: 'account.security.form.cancel' }),
    );

    expect(
      screen.queryByLabelText('account.security.form.currentPassword.label'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    ).toBeInTheDocument();
  });

  test('clears entered values after cancel and reopen', async () => {
    const user = userEvent.setup();

    renderChangePasswordForm();

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );
    await user.type(
      screen.getByLabelText('account.security.form.currentPassword.label'),
      'Password1',
    );
    await user.type(
      screen.getByLabelText('account.security.form.newPassword.label'),
      'Password2',
    );
    await user.type(
      screen.getByLabelText('account.security.form.confirmPassword.label'),
      'Password2',
    );
    await user.click(
      screen.getByRole('button', { name: 'account.security.form.cancel' }),
    );

    await user.click(
      screen.getByRole('button', { name: 'account.security.form.open' }),
    );

    expect(
      screen.getByLabelText('account.security.form.currentPassword.label'),
    ).toHaveValue('');
    expect(
      screen.getByLabelText('account.security.form.newPassword.label'),
    ).toHaveValue('');
    expect(
      screen.getByLabelText('account.security.form.confirmPassword.label'),
    ).toHaveValue('');
  });
});
