import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { LinkCard } from './LinkCard';

const props = {
  path: '/notepads/1/tasks/1',
  cardTitle: 'Title',
  handleClickRename: vi.fn(),
  handleClickDelete: vi.fn(),
};

describe('LinkCard component', () => {
  test('Пропс isEditing не указан', async () => {
    renderWithRouter(<LinkCard {...props} />, {
      initialEntries: ['/notepads/1/tasks/1'],
      path: '/notepads/:notepadId/tasks/:taskId',
    });

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
});
