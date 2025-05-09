import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { setupMockServer } from '@shared/config';
import { getUseNotepadMock } from '@pages/Tasks/lib';
import { Tasks } from './Tasks';

describe('Tasks component', () => {
  setupMockServer();

  test('корректно запускается', async () => {
    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepad/1'],
      path: '/notepad/:notepadId',
    });

    await waitFor(() => expect(screen.getByRole('heading')).toBeDefined());
  });

  test('Показывает сообщение об ошибке', async () => {
    getUseNotepadMock(true);

    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepad/1'],
      path: '/notepad/:notepadId',
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          'Не удалось загрузить данные. Повторите попытку позже',
        ),
      ).toBeInTheDocument(),
    );
  });
});
