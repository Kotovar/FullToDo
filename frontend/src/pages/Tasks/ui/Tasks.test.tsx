import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter, setupMockServer } from '@shared/testing';
import { getUseNotepadMock } from '@pages/Tasks/lib';
import { Tasks } from './Tasks';

describe('Tasks component', () => {
  setupMockServer();

  test('корректно запускается', async () => {
    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    await waitFor(() => expect(screen.getByRole('heading')).toBeDefined());
  });

  test('Показывает сообщение об ошибке', async () => {
    getUseNotepadMock(true);

    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    await waitFor(() =>
      expect(screen.getByText('errors.loadingFail')).toBeInTheDocument(),
    );
  });

  test('Показывает сообщение об ошибке, если блокнот не найден ', async () => {
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
