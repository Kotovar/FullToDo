import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import {
  authService,
  clearAccessToken,
  emitUnauthorizedSessionEvent,
  setAccessToken,
} from '@shared/api';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

const USER = {
  userId: 1,
  email: 'user@example.com',
  isVerified: true,
} as const;

const AuthProbe = () => {
  const { status, user, isAuthenticated } = useAuth();

  return (
    <div>
      <span>{status}</span>
      <span>{user?.email ?? 'anonymous'}</span>
      <span>{String(isAuthenticated)}</span>
    </div>
  );
};

const renderWithAuthProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    </QueryClientProvider>,
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearAccessToken();
  });

  test('restores session through refresh and loads current user', async () => {
    const refreshSpy = vi.spyOn(authService, 'refresh').mockResolvedValue({
      message: 'Successful refresh',
      accessToken: 'fresh-token',
    });
    const meSpy = vi.spyOn(authService, 'me').mockResolvedValue({
      user: USER,
    });

    renderWithAuthProvider();

    await waitFor(() => expect(screen.getByText('user')).toBeInTheDocument());

    expect(screen.getByText(USER.email)).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
    expect(refreshSpy).toHaveBeenCalledTimes(1);
    expect(meSpy).toHaveBeenCalledTimes(1);
  });

  test('uses existing access token without refresh', async () => {
    setAccessToken('active-token');
    const refreshSpy = vi.spyOn(authService, 'refresh');
    const meSpy = vi.spyOn(authService, 'me').mockResolvedValue({
      user: USER,
    });

    renderWithAuthProvider();

    await waitFor(() => expect(screen.getByText('user')).toBeInTheDocument());

    expect(screen.getByText(USER.email)).toBeInTheDocument();
    expect(refreshSpy).not.toHaveBeenCalled();
    expect(meSpy).toHaveBeenCalledTimes(1);
  });

  test('switches to guest state when refresh is unauthorized', async () => {
    vi.spyOn(authService, 'refresh').mockRejectedValue(
      new Error('Unauthorized', {
        cause: {
          type: 'UNAUTHORIZED',
          message: 'errors.auth.UNAUTHORIZED',
        },
      }),
    );
    const meSpy = vi.spyOn(authService, 'me');

    renderWithAuthProvider();

    await waitFor(() => expect(screen.getByText('guest')).toBeInTheDocument());

    expect(screen.getByText('anonymous')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(meSpy).not.toHaveBeenCalled();
  });

  test('switches to guest state after a global unauthorized session event', async () => {
    setAccessToken('active-token');
    vi.spyOn(authService, 'me').mockResolvedValue({
      user: USER,
    });

    renderWithAuthProvider();

    await waitFor(() => expect(screen.getByText('user')).toBeInTheDocument());

    emitUnauthorizedSessionEvent();

    await waitFor(() => expect(screen.getByText('guest')).toBeInTheDocument());

    expect(screen.getByText('anonymous')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
  });
});
