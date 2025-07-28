import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { SubtaskItem } from './SubtaskItem';
import { MOCK_SUBTASK } from '@shared/mocks';
import { useDarkMode } from '@shared/lib';

const props = {
  subtask: MOCK_SUBTASK,
  updateSubtask: vi.fn(),
};

vi.mock('@shared/lib', () => ({
  useDarkMode: vi.fn(),
}));

describe('SubtaskItem component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDarkMode).mockReturnValue({
      isDarkMode: false,
      toggle: vi.fn(),
      fill: '',
    });
  });

  test('when entering text in Input - the subtask update method is called', async () => {
    renderWithRouter(<SubtaskItem {...props} />);

    const input = screen.getByText(props.subtask.title);

    await user.type(input, 'Подзадача Новая');
    await user.tab();

    await waitFor(() => {
      expect(props.updateSubtask).toHaveBeenCalled();
    });
  });

  test('saving of the subtask name is not called if it has not changed', async () => {
    renderWithRouter(<SubtaskItem {...props} />);

    const input = screen.getByText(props.subtask.title);

    await user.click(input);

    await waitFor(async () => {
      const input = screen.getByDisplayValue(props.subtask.title);
      await user.clear(input);
      await user.type(input, MOCK_SUBTASK.title);
      await user.tab();
    });

    await waitFor(() => {
      expect(props.updateSubtask).not.toHaveBeenCalled();
    });
  });

  test('the update method of the subtask is called when the delete button is clicked', async () => {
    renderWithRouter(<SubtaskItem {...props} />);

    const button = screen.getByLabelText('tasks.deleteSubtask');

    button.click();

    await waitFor(() => {
      expect(props.updateSubtask).toHaveBeenCalled();
    });
  });
});
