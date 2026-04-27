import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { OptionsMenu } from './OptionsMenu';

const mockRef = { current: document.createElement('button') };

const props = {
  buttonRef: mockRef,
  position: 'bottom' as const,
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

  test('renders above the button when top position is provided', async () => {
    renderWithRouter(<OptionsMenu {...props} position='top' />, {
      initialEntries: ['/notepads/1/tasks/1'],
      path: '/notepads/:notepadId/tasks/:taskId',
    });

    const dialog = screen.getByText('rename').parentElement;

    expect(dialog).toHaveClass('-translate-y-[calc(100%+36px)]');
  });
});
