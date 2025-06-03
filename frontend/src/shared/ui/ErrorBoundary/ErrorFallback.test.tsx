import { screen } from '@testing-library/react';
import { ErrorFallback } from './ErrorFallback';
import { renderWithRouter } from '@shared/testing';

describe('ErrorFallback component', () => {
  test('Корректно отображается', async () => {
    renderWithRouter(<ErrorFallback />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
