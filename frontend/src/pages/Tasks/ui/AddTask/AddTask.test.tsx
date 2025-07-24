import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { useCreateTask } from '@entities/Task';
import { AddTask } from './AddTask';

vi.mock('@entities/Task', () => ({
  useCreateTask: vi.fn(),
}));

const mockCreateTask = vi.fn();

const getElements = () => {
  const textInput = screen.getByLabelText('tasks.add', {
    selector: 'input',
  });

  const dateInput = screen.getByLabelText('tasks.date', {
    selector: 'input',
  });

  const saveButton = screen.getByText('add');

  return { textInput, dateInput, saveButton };
};

describe('AddTask component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateTask).mockReturnValue({
      createTask: mockCreateTask,
    });
  });

  test('checking text input in input for new task title', async () => {
    renderWithRouter(<AddTask notepadId='1' />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const { textInput } = getElements();

    await user.type(textInput, 'Новая задача');

    expect(textInput).toHaveValue('Новая задача');
  });

  test('if the task name is empty - do not add it when confirming and vice versa', async () => {
    renderWithRouter(<AddTask notepadId='1' />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const { textInput } = getElements();

    await user.type(textInput, '{enter}');
    expect(mockCreateTask).not.toHaveBeenCalled();

    await user.type(textInput, '   {enter}');
    expect(mockCreateTask).not.toHaveBeenCalled();

    await user.type(textInput, 'Test{enter}');
    expect(mockCreateTask).toHaveBeenCalled();
  });

  test('if dueDate is present in the form, passes new Date(dueDate)', async () => {
    renderWithRouter(<AddTask notepadId='1' />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const { textInput, dateInput, saveButton } = getElements();

    await user.type(dateInput, '2025-04-20');
    await user.type(textInput, 'Test');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          dueDate: new Date('2025-04-20'),
        }),
      );
    });
  });
});
