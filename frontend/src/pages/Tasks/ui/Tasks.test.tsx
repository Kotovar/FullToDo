import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter, setupMockServer } from '@shared/testing';
import { getUseNotepadMock } from '@pages/Tasks/lib';
import { Tasks } from './Tasks';

describe('Tasks component', () => {
  setupMockServer();

  test('should start correctly', async () => {
    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    await waitFor(() => expect(screen.getByRole('heading')).toBeDefined());
  });

  test('should show a loading error message', async () => {
    getUseNotepadMock(true);

    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    await waitFor(() =>
      expect(screen.getByText('errors.loadingFail')).toBeInTheDocument(),
    );
  });

  test('should show an error message if the notebook is not found', async () => {
    getUseNotepadMock(false, false, true);

    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepads/999'],
      path: '/notepads/:notepadId',
    });

    await waitFor(() =>
      expect(screen.getByText('notepads.notFound')).toBeInTheDocument(),
    );
  });
});
