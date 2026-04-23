import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { authService, AUTH_ERRORS } from '@shared/api';
import { i18nForTests, getUseNotificationsMock } from '@shared/testing';
import { DeleteAccountSection } from './DeleteAccountSection';

const navigateMock = vi.fn();
const deleteUserMock = vi.spyOn(authService, 'deleteUser');

vi.mock('react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router')>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const renderSection = (
  props?: Partial<{ email: string; hasPassword: boolean }>,
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter>
          <DeleteAccountSection
            email='user@example.com'
            hasPassword
            {...props}
          />
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

describe('DeleteAccountSection', () => {
  beforeEach(() => {
    deleteUserMock.mockReset();
    navigateMock.mockReset();
    getUseNotificationsMock();
  });

  test('requires current password for password accounts', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(
      screen.getByRole('button', { name: 'account.dangerZone.trigger' }),
    );
    expect(
      screen.getByText('account.dangerZone.confirmTitle'),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', {
        name: 'account.dangerZone.confirmAction',
        hidden: true,
      }),
    );

    expect(
      screen.getByText('account.dangerZone.password.required'),
    ).toBeInTheDocument();
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  test('submits deletion for password accounts after confirmation', async () => {
    const user = userEvent.setup();
    deleteUserMock.mockResolvedValue({ message: 'Account deleted' });
    renderSection();

    await user.click(
      screen.getByRole('button', { name: 'account.dangerZone.trigger' }),
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.dangerZone.password.show',
        hidden: true,
      }),
    );
    expect(
      screen.getByLabelText('account.dangerZone.password.label'),
    ).toHaveAttribute('type', 'text');
    await user.type(
      screen.getByLabelText('account.dangerZone.password.label'),
      'Password1',
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.dangerZone.confirmAction',
        hidden: true,
      }),
    );

    expect(deleteUserMock).toHaveBeenCalledWith({
      currentPassword: 'Password1',
    });
    expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true });
  });

  test('allows google accounts to delete without password', async () => {
    const user = userEvent.setup();
    deleteUserMock.mockResolvedValue({ message: 'Account deleted' });
    renderSection({ hasPassword: false, email: 'google@example.com' });

    await user.click(
      screen.getByRole('button', { name: 'account.dangerZone.trigger' }),
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.dangerZone.confirmAction',
        hidden: true,
      }),
    );

    expect(
      screen.queryByLabelText('account.dangerZone.password.label'),
    ).not.toBeInTheDocument();
    expect(deleteUserMock).toHaveBeenCalledWith({ currentPassword: undefined });
  });

  test('keeps trigger button in place while modal is open', async () => {
    const user = userEvent.setup();
    renderSection();

    const trigger = screen.getByRole('button', {
      name: 'account.dangerZone.trigger',
    });

    await user.click(trigger);

    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test('shows api error in confirm state', async () => {
    const user = userEvent.setup();
    deleteUserMock.mockRejectedValue(
      new Error('Unauthorized', { cause: AUTH_ERRORS.UNAUTHORIZED }),
    );
    renderSection();

    await user.click(
      screen.getByRole('button', { name: 'account.dangerZone.trigger' }),
    );
    await user.type(
      screen.getByLabelText('account.dangerZone.password.label'),
      'Password1',
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.dangerZone.confirmAction',
        hidden: true,
      }),
    );

    expect(screen.getByText('errors.auth.UNAUTHORIZED')).toBeInTheDocument();
  });

  test('closes modal on cancel', async () => {
    const user = userEvent.setup();
    renderSection();

    await user.click(
      screen.getByRole('button', { name: 'account.dangerZone.trigger' }),
    );
    await user.click(
      screen.getByRole('button', {
        name: 'account.dangerZone.cancel',
        hidden: true,
      }),
    );

    expect(
      screen.queryByRole('dialog', {
        name: 'account.dangerZone.confirmTitle',
        hidden: true,
      }),
    ).not.toBeInTheDocument();
  });
});
