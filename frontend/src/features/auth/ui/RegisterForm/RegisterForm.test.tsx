import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { authService } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import { ROUTES } from '@sharedCommon';
import { RegisterForm } from './RegisterForm';

const LoginProbe = () => {
  const location = useLocation();
  const registeredEmail =
    typeof location.state?.loginEmail === 'string'
      ? location.state.loginEmail
      : 'none';

  return (
    <div>
      <span>login-page</span>
      <span>{registeredEmail}</span>
    </div>
  );
};

const renderRegisterFlow = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter initialEntries={[ROUTES.app.register]}>
          <Routes>
            <Route path={ROUTES.app.register} element={<RegisterForm />} />
            <Route path={ROUTES.app.login} element={<LoginProbe />} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.sessionStorage.clear();
  });

  test('shows validation errors for invalid fields', async () => {
    const user = userEvent.setup();

    renderRegisterFlow();

    await user.type(
      screen.getByLabelText('register.form.email.label'),
      'bad-email',
    );
    await user.type(
      screen.getByLabelText('register.form.password.label'),
      'short',
    );
    await user.click(
      screen.getByRole('button', { name: 'register.form.submit' }),
    );

    expect(
      await screen.findByText('register.validation.email.invalid'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('register.validation.password.min'),
    ).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();

    renderRegisterFlow();

    const passwordInput = screen.getByLabelText(
      'register.form.password.label',
    ) as HTMLInputElement;

    expect(passwordInput.type).toBe('password');

    await user.click(
      screen.getByRole('button', { name: 'register.form.password.show' }),
    );

    expect(passwordInput.type).toBe('text');

    await user.click(
      screen.getByRole('button', { name: 'register.form.password.hide' }),
    );

    expect(passwordInput.type).toBe('password');
  });

  test('redirects to login after successful registration without autologin', async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, 'register').mockResolvedValue({
      user: {
        userId: 1,
        email: 'user@example.com',
        isVerified: false,
        hasPassword: true,
        hasGoogle: false,
      },
    });

    renderRegisterFlow();

    await user.type(
      screen.getByLabelText('register.form.email.label'),
      'user@example.com',
    );
    await user.type(
      screen.getByLabelText('register.form.password.label'),
      'Password1',
    );
    await user.click(
      screen.getByRole('button', { name: 'register.form.submit' }),
    );

    await waitFor(() =>
      expect(screen.getByText('login-page')).toBeInTheDocument(),
    );
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(window.sessionStorage.getItem('register-email')).toBe('""');
  });

  test('restores email from session storage after remount', async () => {
    const user = userEvent.setup();

    const view = renderRegisterFlow();
    const emailInput = screen.getByLabelText(
      'register.form.email.label',
    ) as HTMLInputElement;

    await user.type(emailInput, 'saved@example.com');

    expect(window.sessionStorage.getItem('register-email')).toBe(
      '"saved@example.com"',
    );

    view.unmount();

    renderRegisterFlow();

    expect(screen.getByLabelText('register.form.email.label')).toHaveValue(
      'saved@example.com',
    );
  });
});
