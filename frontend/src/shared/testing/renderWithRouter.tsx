import type { ReactElement } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

interface RenderWithRouterOptions {
  initialEntries?: string[];
  path?: string;
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const renderWithRouter = (
  component: ReactElement,
  options: RenderWithRouterOptions = {},
) => {
  const { initialEntries = ['/'], path = '*' } = options;
  const testQueryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path={path} element={component} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};
