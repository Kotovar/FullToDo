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

    await waitFor(() => {
      expect(props.updateSubtask).toHaveBeenCalled();
    });
  });

  test('При клике на кнопку удаления вызывается метод обновления подзадачи', async () => {
    renderWithRouter(<SubtaskItem {...props} />);

    const button = screen.getByLabelText('Удалить подзадачу');

    button.click();

    await waitFor(() => {
      expect(props.updateSubtask).toHaveBeenCalled();
    });
  });
});
