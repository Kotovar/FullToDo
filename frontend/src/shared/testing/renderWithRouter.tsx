import type { ReactElement } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18nForTests from './i18nForTests';

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

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  return render(
    <QueryClientProvider client={testQueryClient}>
      <I18nextProvider i18n={i18nForTests}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={path} element={component} />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
};
