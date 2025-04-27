import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { Tasks } from './Tasks';
import { setupMockServer } from '@shared/config';

describe('Tasks component', () => {
  setupMockServer();

  test('корректно запускается', () => {
    renderWithRouter(<Tasks />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const heading = screen.getByRole('heading');

    expect(heading).toBeDefined();
  });
});
