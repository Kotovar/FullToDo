import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import type { AuthContextValue } from '@app/providers/AuthContext';
import { AuthContext } from '@app/providers/AuthContext';
import { ROUTES } from '@sharedCommon';
import { GuestOnlyRoute, ProtectedRoute, RootRedirect } from './';

const createAuthValue = (
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue => ({
  user: null,
  status: 'guest',
  isAuthenticated: false,
  isError: false,
  error: null,
  refetchUser: vi.fn(),
  ...overrides,
});

const renderWithAuth = (
  authValue: AuthContextValue,
  children: ReactNode,
  initialEntries: Array<string | { pathname: string; state?: unknown }> = ['/'],
) =>
  render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </AuthContext.Provider>,
  );

describe('Route guards', () => {
  test('redirects guest from root route to login', async () => {
    renderWithAuth(
      createAuthValue(),
      <Routes>
        <Route index element={<RootRedirect />} />
        <Route path={ROUTES.app.login} element={<div>Login page</div>} />
      </Routes>,
    );

    expect(await screen.findByText('Login page')).toBeInTheDocument();
  });

  test('redirects authenticated user from root route to tasks', async () => {
    renderWithAuth(
      createAuthValue({
        user: {
          userId: 1,
          email: 'user@example.com',
          isVerified: true,
          hasPassword: true,
          hasGoogle: false,
        },
        status: 'user',
        isAuthenticated: true,
      }),
      <Routes>
        <Route index element={<RootRedirect />} />
        <Route path={ROUTES.tasks.base} element={<div>Tasks page</div>} />
      </Routes>,
    );

    expect(await screen.findByText('Tasks page')).toBeInTheDocument();
  });

  test('redirects guest from protected route to login', async () => {
    renderWithAuth(
      createAuthValue(),
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.tasks.base} element={<div>Tasks page</div>} />
        </Route>
        <Route path={ROUTES.app.login} element={<div>Login page</div>} />
      </Routes>,
      [ROUTES.tasks.base],
    );

    expect(await screen.findByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Tasks page')).not.toBeInTheDocument();
  });

  test('redirects authenticated user from guest-only route to tasks', async () => {
    renderWithAuth(
      createAuthValue({
        user: {
          userId: 1,
          email: 'user@example.com',
          isVerified: true,
          hasPassword: true,
          hasGoogle: false,
        },
        status: 'user',
        isAuthenticated: true,
      }),
      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route path={ROUTES.app.login} element={<div>Login page</div>} />
        </Route>
        <Route path={ROUTES.tasks.base} element={<div>Tasks page</div>} />
      </Routes>,
      [ROUTES.app.login],
    );

    expect(await screen.findByText('Tasks page')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  test('redirects authenticated user to original protected route from guest-only page', async () => {
    renderWithAuth(
      createAuthValue({
        user: {
          userId: 1,
          email: 'user@example.com',
          isVerified: true,
          hasPassword: true,
          hasGoogle: false,
        },
        status: 'user',
        isAuthenticated: true,
      }),
      <Routes>
        <Route element={<GuestOnlyRoute />}>
          <Route path={ROUTES.app.login} element={<div>Login page</div>} />
        </Route>
        <Route path={ROUTES.tasks.byId} element={<div>Task detail page</div>} />
      </Routes>,
      [{ pathname: ROUTES.app.login, state: { from: '/tasks/42' } }],
    );

    expect(await screen.findByText('Task detail page')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});
