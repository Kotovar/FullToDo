import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { TaskInput } from './TaskInput';

const props = {
  type: 'date' as const,
  value: '',
  label: 'label',
  placeholder: '',
  onChange: vi.fn(),
  onClick: vi.fn(),
  onKeyDown: vi.fn(),
};

describe('TaskInput component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('opens custom calendar when date trigger button is clicked', async () => {
    renderWithRouter(<TaskInput {...props} />);

    const button = screen.getByLabelText('label', { selector: 'button' });

    await user.click(button);

    expect(
      screen.getByRole('dialog', { name: 'tasks.calendar.dialog' }),
    ).toBeInTheDocument();
    expect(props.onClick).not.toHaveBeenCalled();
  });

  test('closes custom calendar on repeated click to the date trigger', async () => {
    renderWithRouter(<TaskInput {...props} />);

    const button = screen.getByLabelText('label', { selector: 'button' });

    await user.click(button);
    expect(
      screen.getByRole('dialog', { name: 'tasks.calendar.dialog' }),
    ).toBeInTheDocument();

    await user.click(button);
    expect(
      screen.queryByRole('dialog', { name: 'tasks.calendar.dialog' }),
    ).not.toBeInTheDocument();
  });

  test('clears current date from custom calendar', async () => {
    renderWithRouter(<TaskInput {...props} value='2026-04-24' />);

    const button = screen.getByLabelText('label', { selector: 'button' });

    await user.click(button);
    await user.click(
      screen.getByRole('button', {
        name: 'tasks.calendar.clear',
      }),
    );

    expect(props.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' }),
      }),
    );
  });

  test('renders calendar above the field when there is not enough space below', async () => {
    renderWithRouter(<TaskInput {...props} />);

    const input = screen.getByRole('textbox');
    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 500,
      right: 200,
      bottom: window.innerHeight - 20,
      left: 0,
      width: 200,
      height: 40,
      toJSON: () => ({}),
    });

    const button = screen.getByLabelText('label', { selector: 'button' });

    await user.click(button);

    expect(
      screen.getByRole('dialog', { name: 'tasks.calendar.dialog' }),
    ).toHaveClass('bottom-full');
  });
});
