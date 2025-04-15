import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

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
