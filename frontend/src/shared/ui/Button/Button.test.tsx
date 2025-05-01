import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button component', () => {
  test('Корректно отображается', async () => {
    render(<Button />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
