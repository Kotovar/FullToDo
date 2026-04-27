import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorFallback } from './ErrorFallback';
import { renderWithRouter } from '@shared/testing';

describe('ErrorFallback component', () => {
  test('renders recovery actions', async () => {
    const reset = vi.fn();
    renderWithRouter(<ErrorFallback reset={reset} />);

    const heading = screen.getByRole('heading', {
      name: 'errors.errorBoundary',
    });
    expect(heading).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'errors.tryAgain' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'errors.reload' }),
    ).toBeInTheDocument();
  });

  test('calls reset when try again is clicked', async () => {
    const user = userEvent.setup();
    const reset = vi.fn();

    renderWithRouter(<ErrorFallback reset={reset} />);

    await user.click(screen.getByRole('button', { name: 'errors.tryAgain' }));

    expect(reset).toHaveBeenCalled();
  });
});
