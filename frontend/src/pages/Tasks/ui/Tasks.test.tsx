import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { Tasks } from './Tasks';
import { setupMockServer } from '@shared/config';

describe('Tasks component', () => {
  setupMockServer();

  test('корректно запускается', async () => {
    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepad/1'],
      path: '/notepad/:notepadId',
    });

    await waitFor(() => expect(screen.getByRole('heading')).toBeDefined());
  });
});
