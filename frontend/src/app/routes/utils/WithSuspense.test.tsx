import { render } from '@testing-library/react';
import { WithSuspense } from './WithSuspense';

describe('WithSuspense component', () => {
  test('render correctly', async () => {
    render(<WithSuspense fallback={<div>Test</div>}>Test</WithSuspense>);
  });
});
