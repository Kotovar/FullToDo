import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import type { ReactNode } from 'react';
import { ROUTES } from 'shared/routes';
import { notepadId } from 'shared/schemas';
import i18nForTests from '../testing/i18nForTests';

interface WrapperProps {
  children: ReactNode;
}

export const getDeleteResponse = (entity: 'Notepad' | 'Task') => {
  return { status: 200 as const, message: `${entity} deleted successfully` };
};

export const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
};

export const createWrapperWithRouter = (
  initialEntries = [`${ROUTES.NOTEPADS}/${notepadId}`],
) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={`${ROUTES.NOTEPADS}/:notepadId`} element={children} />
            <Route path={ROUTES.TASKS} element={children} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>
  );
};
