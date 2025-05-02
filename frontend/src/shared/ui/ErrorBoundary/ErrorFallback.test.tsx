import { render, screen } from '@testing-library/react';
import { ErrorFallback } from './ErrorFallback';

describe('ErrorFallback component', () => {
  test('Корректно отображается', async () => {
    render(<ErrorFallback />);

    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });
});
