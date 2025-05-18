import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ROUTES } from 'shared/routes';
import { notepadId } from 'shared/schemas';

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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
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
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={`${ROUTES.NOTEPADS}/:notepadId`} element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};
