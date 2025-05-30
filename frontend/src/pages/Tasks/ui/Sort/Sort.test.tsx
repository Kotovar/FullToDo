import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { Sort } from './Sort';

describe('Sort component', () => {
  const sortDescending = new URLSearchParams('sortBy=createdDate&order=desc');
  const sortAscending = new URLSearchParams('sortBy=createdDate&order=asc');
  const mockSetParams = vi.fn();
  const user = userEvent.setup();

  test('Иконка выбирается корректно в зависимости от направления', async () => {
    const { rerender } = renderWithRouter(
      <Sort params={sortDescending} setParams={mockSetParams} />,
    );
    expect(screen.getByLabelText('sort descending')).toBeInTheDocument();

    rerender(<Sort params={sortAscending} setParams={mockSetParams} />);
    expect(screen.getByLabelText('sort ascending')).toBeInTheDocument();
  });

  test('successful opens the dropdown', async () => {
    renderWithRouter(
      <Sort params={sortDescending} setParams={mockSetParams} />,
    );

    const sortButton = screen.getByRole('button', {
      name: 'Сменить сортировку',
    });

    await user.click(sortButton);

    const sortSpan = screen.getByText('По приоритету');
    expect(sortSpan).toBeInTheDocument();

    await user.click(sortSpan);
    expect(sortSpan).not.toBeInTheDocument();
  });

  test('successful click on change order', async () => {
    renderWithRouter(
      <Sort params={sortDescending} setParams={mockSetParams} />,
    );

    const orderButton = screen.getByRole('button', {
      name: 'Сменить порядок сортировки',
    });

    await user.click(orderButton);
  });
});
