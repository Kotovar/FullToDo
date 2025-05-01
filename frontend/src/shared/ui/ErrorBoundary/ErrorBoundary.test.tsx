import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';

const Child = () => {
  throw new Error('Test error');
};

const fallbackFunction = (error: Error, reset: () => void) => {
  return (
    <div>
      <div>Error occurred: {error.message}</div>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

const fallbackElement = <div>Custom error message</div>;

describe('ErrorBoundary component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('reset', async () => {
    const setStateSpy = vi.spyOn(ErrorBoundary.prototype, 'setState');

    render(
      <ErrorBoundary fallback={fallbackFunction}>
        <Child />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Error occurred: Test error')).toBeInTheDocument();

    await user.click(screen.getByText('Reset'));
    expect(setStateSpy).toHaveBeenCalledWith({
      hasError: false,
      error: null,
    });
  });

  test('should render fallback element when provided', async () => {
    render(
      <ErrorBoundary fallback={fallbackElement}>
        <Child />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });
});
