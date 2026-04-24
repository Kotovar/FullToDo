import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

describe('App', () => {
  test('should render correctly', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Unauthorized', {
        cause: {
          type: 'UNAUTHORIZED',
          message: 'errors.auth.UNAUTHORIZED',
        },
      }),
    );

    const div = document.createElement('div');
    const root = createRoot(div);

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>,
      );
    });

    await act(async () => {
      await queryClient.cancelQueries();
      root.unmount();
    });

    queryClient.clear();
  });
});
