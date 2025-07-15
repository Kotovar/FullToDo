import { render } from '@testing-library/react';
import { TaskDetail } from './TaskDetail.lazy';

describe('TaskDetail.lazy', () => {
  test('render correctly', async () => {
    render(<TaskDetail />);
  });
});
