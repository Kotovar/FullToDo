import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router';
import { authService } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import { ForgotPassword } from './ForgotPassword';

vi.mock('react-i18next', async importOriginal => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

const renderForgotPassword = () => {
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
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('ForgotPassword page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('submits email and shows neutral success message', async () => {
    const user = userEvent.setup();
    const forgotPasswordSpy = vi
      .spyOn(authService, 'forgotPassword')
      .mockResolvedValue({
        message: 'If the account exists, password reset instructions were sent',
      });

    renderForgotPassword();

    await user.type(
      screen.getByLabelText('forgotPassword.form.email.label'),
      'user@example.com',
    );
    await user.click(
      screen.getByRole('button', { name: 'forgotPassword.form.submit' }),
    );

    await waitFor(() =>
      expect(forgotPasswordSpy).toHaveBeenCalledWith({
        email: 'user@example.com',
      }),
    );
    expect(
      screen.getByText('forgotPassword.successMessage'),
    ).toBeInTheDocument();
  });
});
