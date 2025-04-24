import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { Error } from './Error';

describe('Error component', () => {
  const user = userEvent.setup();
  const onClickMock = vi.fn();

  test('render correctly', async () => {
    renderWithRouter(<Error />);

    const heading = screen.getByRole('heading');
    const button = screen.getByRole('button');
    expect(heading).toBeDefined();
    expect(button).toBeDefined();

    button.onclick = onClickMock;

    await user.click(button);
    expect(onClickMock).toHaveBeenCalled();
  });
});
