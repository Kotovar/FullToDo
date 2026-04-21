import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import { authKeys, authService } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import { ROUTES } from '@sharedCommon';
import { VerifyEmail } from './VerifyEmail';
import userEvent from '@testing-library/user-event';

const renderVerifyEmail = (
  initialEntry: string,
  initialUser: {
    userId: number;
    email: string;
    isVerified: boolean;
    hasPassword: boolean;
  } | null = null,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(authKeys.me(), initialUser);

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path={ROUTES.app.verifyEmail} element={<VerifyEmail />} />
            <Route path={ROUTES.app.login} element={<div>login-page</div>} />
            <Route
              path={ROUTES.app.register}
              element={<div>register-page</div>}
            />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('VerifyEmail', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('shows success state after email verification', async () => {
    vi.spyOn(authService, 'verifyEmail').mockResolvedValue({
      message: 'Email verified successfully',
    });

    renderVerifyEmail(`${ROUTES.app.verifyEmail}?token=token-123`);

    await waitFor(() =>
      expect(screen.getByText('verifyEmail.successTitle')).toBeInTheDocument(),
    );
    expect(authService.verifyEmail).toHaveBeenCalledWith('token-123');
  });

  test('shows error state when token is missing', async () => {
    renderVerifyEmail(ROUTES.app.verifyEmail);

    await waitFor(() =>
      expect(screen.getByText('verifyEmail.errorTitle')).toBeInTheDocument(),
    );
    expect(screen.getByText('verifyEmail.missingToken')).toBeInTheDocument();
  });

  test('shows error state when verification fails', async () => {
    vi.spyOn(authService, 'verifyEmail').mockRejectedValue(
      new Error('Unauthorized', {
        cause: {
          type: 'UNAUTHORIZED',
          message: 'errors.auth.UNAUTHORIZED',
        },
      }),
    );

    renderVerifyEmail(`${ROUTES.app.verifyEmail}?token=bad-token`);

    await waitFor(() =>
      expect(screen.getByText('verifyEmail.errorTitle')).toBeInTheDocument(),
    );
    expect(screen.getByText('errors.auth.UNAUTHORIZED')).toBeInTheDocument();
  });

  test('shows already verified state when email was verified before', async () => {
    vi.spyOn(authService, 'verifyEmail').mockResolvedValue({
      message: 'Email already verified',
    });

    renderVerifyEmail(`${ROUTES.app.verifyEmail}?token=reused-token`);

    await waitFor(() =>
      expect(
        screen.getByText('verifyEmail.alreadyVerifiedTitle'),
      ).toBeInTheDocument(),
    );
  });

  test('logout current session before going to login', async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, 'verifyEmail').mockResolvedValue({
      message: 'Email verified successfully',
    });
    vi.spyOn(authService, 'logout').mockResolvedValue({
      message: 'Successful logout',
    });

    renderVerifyEmail(`${ROUTES.app.verifyEmail}?token=token-123`, {
      userId: 99,
      email: 'active@example.com',
      isVerified: true,
      hasPassword: true,
    });

    await waitFor(() =>
      expect(screen.getByText('verifyEmail.successTitle')).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: 'verifyEmail.login' }));

    await waitFor(() =>
      expect(screen.getByText('login-page')).toBeInTheDocument(),
    );
    expect(authService.logout).toHaveBeenCalled();
  });
});
