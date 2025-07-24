import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { OptionsMenu } from './OptionsMenu';

const mockRef = { current: null };

const props = {
  buttonRef: mockRef,
  renameHandler: vi.fn(),
  deleteHandler: vi.fn(),
  closeMenu: vi.fn(),
};

describe('OptionsMenu component', () => {
  test('successful render', async () => {
    renderWithRouter(<OptionsMenu {...props} />, {
      initialEntries: ['/notepads/1/tasks/1'],
      path: '/notepads/:notepadId/tasks/:taskId',
    });

    const button = screen.getByText('rename');
    const dialog = button.parentElement;

    expect(dialog).toBeInTheDocument();
  });
});
