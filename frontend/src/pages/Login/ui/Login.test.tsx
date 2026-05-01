import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ROUTES } from '@sharedCommon';
import { Login } from './Login';

vi.mock('@features/auth', async importOriginal => {
  const actual = await importOriginal<typeof import('@features/auth')>();
  return {
    ...actual,
    LoginForm: () => <form aria-label='login-form' />,
  };
});

vi.mock('react-i18next', async importOriginal => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

describe('Login page', () => {
  test('renders forgot password link', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('link', { name: 'login.forgotPassword' }),
    ).toHaveAttribute('href', ROUTES.app.forgotPassword);
  });
});
