import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { Sort } from './Sort';

describe('Sort component', () => {
  test('Иконка выбирается корректно в зависимости от направления', async () => {
    const { rerender } = renderWithRouter(<Sort direction='down' />);
    expect(screen.getByLabelText('sort descending')).toBeInTheDocument();

    rerender(<Sort direction='up' />);
    expect(screen.getByLabelText('sort ascending')).toBeInTheDocument();
  });
});
