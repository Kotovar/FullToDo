import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ROUTES } from 'shared/routes';

interface WrapperProps {
  children: ReactNode;
}

export const getDeleteResponse = (entity: 'Notepad' | 'Task') => {
  return { status: 200, message: `${entity} deleted successfully` };
};

export const notepadId = '1';
export const taskId = '1';

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

export const createWrapperWithRouter = (initialEntries = ['/']) => {
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
          <Route
            path={ROUTES.getNotepadPath(':notepadId')}
            element={children}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};
