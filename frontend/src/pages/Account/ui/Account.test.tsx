import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { authKeys } from '@shared/api';
import { i18nForTests } from '@shared/testing';
import type { PublicUser } from 'shared/schemas';
import { Account } from './Account';

vi.mock('@features/auth', () => ({
  LogoutButton: () => <button type='button'>logout.label</button>,
}));

vi.mock('react-i18next', async importOriginal => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

const createUser = (overrides: Partial<PublicUser> = {}): PublicUser => ({
  userId: 1,
  email: 'user@example.com',
  isVerified: true,
  hasPassword: true,
  ...overrides,
});

const renderAccount = (user = createUser()) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(authKeys.me(), user);

  render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter>
          <Account />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('Account page', () => {
  test('renders profile data for password user', () => {
    renderAccount();

    expect(screen.getByText('account.title')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'account.backToTasks' }),
    ).toHaveAttribute('href', '/tasks');
    expect(
      screen.getByText('account.profile.passwordUser'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('account.security.passwordEnabled'),
    ).toBeInTheDocument();
    expect(screen.getByText('logout.label')).toBeInTheDocument();
  });

  test('renders google account security message', () => {
    renderAccount(
      createUser({
        userId: 2,
        email: 'google@example.com',
        hasPassword: false,
      }),
    );

    expect(screen.getByText('google@example.com')).toBeInTheDocument();
    expect(screen.getByText('account.profile.googleUser')).toBeInTheDocument();
    expect(
      screen.getByText('account.security.passwordDisabled'),
    ).toBeInTheDocument();
  });
});
