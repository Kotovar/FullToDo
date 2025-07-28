import { render } from '@testing-library/react';
import { Layout } from './Layout.lazy';

describe('Layout.lazy', () => {
  test('render correctly', async () => {
    render(<Layout />);
  });
});
