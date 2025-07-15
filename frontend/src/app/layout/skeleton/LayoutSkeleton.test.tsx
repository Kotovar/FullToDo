import { render } from '@testing-library/react';
import { LayoutSkeleton } from './LayoutSkeleton';

describe('LayoutSkeleton component', () => {
  test('render correctly', async () => {
    render(<LayoutSkeleton />);
  });
});
