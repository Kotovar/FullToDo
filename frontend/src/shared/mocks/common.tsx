import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';
import { authKeys } from '@shared/api';
import { ROUTES } from 'shared/routes';
import { NOTEPAD_ID } from 'shared/schemas';
import i18nForTests from '../testing/i18nForTests';
import type { PublicUser } from 'shared/schemas';

interface WrapperProps {
  children: ReactNode;
}

const DEFAULT_AUTH_USER: PublicUser = {
  userId: 1,
  email: 'user@example.com',
  isVerified: true,
};

const createTestQueryClient = (user: PublicUser | null = DEFAULT_AUTH_USER) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  queryClient.setQueryData(authKeys.me(), user);

  return queryClient;
};

export const getDeleteResponse = (entity: 'Notepad' | 'Task') => {
  return { status: 200 as const, message: `${entity} deleted successfully` };
};

export const createWrapper = (user: PublicUser | null = DEFAULT_AUTH_USER) => {
  const queryClient = createTestQueryClient(user);
  return ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
};

export const createWrapperWithRouter = (
  initialEntries = [`${ROUTES.notepads.base}/${NOTEPAD_ID}`],
  user: PublicUser | null = DEFAULT_AUTH_USER,
) => {
  const queryClient = createTestQueryClient(user);
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={ROUTES.notepads.byId} element={children} />
            <Route path={ROUTES.tasks.base} element={children} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
};
