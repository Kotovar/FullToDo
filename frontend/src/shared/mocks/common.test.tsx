import { render } from '@testing-library/react';
import { createWrapperWithRouter } from './common';

describe('createWrapperWithRouter', () => {
  const TestComponent = () => <div>Test Content</div>;

  test('the initialEntries passed should be used', () => {
    const Wrapper = createWrapperWithRouter();

    render(<TestComponent />, { wrapper: Wrapper });
  });
});
