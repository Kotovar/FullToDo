import { screen, waitFor } from '@testing-library/react';
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

  test('если тип компонента - "date", то метод handleOpenCalendar вызывает нативный метод showPicker', async () => {
    const mockShowPicker = vi.fn();
    HTMLInputElement.prototype.showPicker = mockShowPicker;

    renderWithRouter(<TaskInput {...props} />);
    const button = screen.getByLabelText('label', { selector: 'button' });

    await user.click(button);

    await waitFor(() => {
      expect(mockShowPicker).toHaveBeenCalled();
      expect(props.onClick).not.toHaveBeenCalled();
    });
  });
});
