import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { Sort } from './Sort';

describe('Sort component', () => {
  const sortDescending = new URLSearchParams('sortBy=createdDate&order=desc');
  const sortAscending = new URLSearchParams('sortBy=createdDate&order=asc');
  const mockSetParams = vi.fn();

  test('Иконка выбирается корректно в зависимости от направления', async () => {
    const { rerender } = renderWithRouter(
      <Sort params={sortDescending} setParams={mockSetParams} />,
    );
    expect(screen.getByLabelText('sort descending')).toBeInTheDocument();

    rerender(<Sort params={sortAscending} setParams={mockSetParams} />);
    expect(screen.getByLabelText('sort ascending')).toBeInTheDocument();
  });
});
