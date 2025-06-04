import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { SubtaskItem } from './SubtaskItem';
import { MOCK_SUBTASK } from '@shared/mocks';

const props = {
  subtask: MOCK_SUBTASK,
  updateSubtask: vi.fn(),
};

describe('SubtaskItem component', () => {
  const user = userEvent.setup();

  test('При вводе текста в Input - вызывается метод обновления подзадачи', async () => {
    renderWithRouter(<SubtaskItem {...props} />);

    const input = screen.getByDisplayValue(props.subtask.title);

    await user.type(input, 'Подзадача Новая');
    await user.tab();

    await waitFor(() => {
      expect(props.updateSubtask).toHaveBeenCalled();
    });
  });

  test('Не вызывается сохранение названия подзадачи, если оно не менялось', async () => {
    renderWithRouter(<SubtaskItem {...props} />);

    const input = screen.getByDisplayValue(props.subtask.title);

    await user.clear(input);
    await user.type(input, MOCK_SUBTASK.title);
    await user.tab();

    await waitFor(() => {
      expect(props.updateSubtask).not.toHaveBeenCalled();
    });
  });

  test('При клике на кнопку удаления вызывается метод обновления подзадачи', async () => {
    renderWithRouter(<SubtaskItem {...props} />);

    const button = screen.getByLabelText('tasks.deleteSubtask');

    button.click();

    await waitFor(() => {
      expect(props.updateSubtask).toHaveBeenCalled();
    });
  });
});
