import { render } from '@testing-library/react';
import { createWrapperWithRouter } from './common';

describe('createWrapperWithRouter', () => {
  const TestComponent = () => <div>Test Content</div>;

  test('должен использовать переданные initialEntries', () => {
    const Wrapper = createWrapperWithRouter();

    render(<TestComponent />, { wrapper: Wrapper });
  });
});
