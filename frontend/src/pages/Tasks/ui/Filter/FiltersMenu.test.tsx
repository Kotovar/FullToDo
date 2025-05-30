import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { FiltersMenu } from './FiltersMenu';

describe('FiltersMenu component', () => {
  const user = userEvent.setup();
  const mockCloseMenu = vi.fn();
  const mockOnApply = vi.fn();
  const mockRef = { current: null };

  test('successful working', async () => {
    renderWithRouter(
      <FiltersMenu
        labels={[]}
        buttonRef={mockRef}
        closeMenu={mockCloseMenu}
        onApply={mockOnApply}
      />,
      {
        initialEntries: ['/notepads/1'],
        path: '/notepads/:notepadId',
      },
    );

    const buttonApply = screen.getByText('Применить');
    await user.click(buttonApply);
    expect(mockOnApply).toBeCalled();

    const buttonCancel = screen.getByText('Сбросить');
    await user.click(buttonCancel);
    expect(mockCloseMenu).toBeCalled();
  });

  test('should update filters when radio buttons are clicked', async () => {
    renderWithRouter(
      <FiltersMenu
        labels={[]}
        buttonRef={mockRef}
        closeMenu={mockCloseMenu}
        onApply={mockOnApply}
      />,
      {
        initialEntries: ['/notepads/1'],
        path: '/notepads/:notepadId',
      },
    );

    await user.click(screen.getByRole('radio', { name: 'Активные' }));
    await user.click(screen.getByRole('radio', { name: 'Высокий' }));
    await user.click(screen.getByText('Применить'));

    expect(mockOnApply).toHaveBeenCalledWith({
      isCompleted: 'false',
      hasDueDate: '',
      priority: 'high',
    });
  });
});
