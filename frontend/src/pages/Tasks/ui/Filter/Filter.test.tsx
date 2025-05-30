import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { Filter } from './Filter';

describe('Filter component', () => {
  const user = userEvent.setup();
  const chipTitle = 'Выполненные';
  const mockSetParams = vi.fn();
  const mockParams = new URLSearchParams('isCompleted=true');

  test('successful working', async () => {
    renderWithRouter(<Filter params={mockParams} setParams={mockSetParams} />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const chip = screen.getByText(chipTitle);
    expect(chip).toBeDefined();

    const chipButton = screen.getByRole('button', {
      name: `Удалить ${chipTitle}`,
    });

    await user.click(chipButton);
    expect(mockSetParams).toHaveBeenCalled();
  });

  test('successful opens the dropdown', async () => {
    renderWithRouter(<Filter params={mockParams} setParams={mockSetParams} />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const filterButton = screen.getByRole('button', {
      name: 'Сменить фильтр',
    });

    await user.click(filterButton);
    const dropdownButton = screen.getByRole('button', {
      name: 'Применить',
    });
    expect(dropdownButton).toBeInTheDocument();
  });
});
