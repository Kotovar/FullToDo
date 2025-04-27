import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { AddTask } from './AddTask';
import { useTasks } from '@entities/Task';
import type { Mock } from 'vitest';

vi.mock('@entities/Task', () => ({
  useTasks: vi.fn(),
}));

const mockCreateTask = vi.fn();

const getElements = () => {
  const textInput = screen.getByLabelText('Добавить задачу', {
    selector: 'input',
  });

  const dateInput = screen.getByLabelText('Дата выполнения', {
    selector: 'input',
  });

  const saveButton = screen.getByText('Добавить');

  return { textInput, dateInput, saveButton };
};

describe('AddTask component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTasks as Mock).mockReturnValue({
      methods: {
        createTask: mockCreateTask,
      },
    });
  });

  test('Проверка ввода текста в input для заголовка новой задачи', async () => {
    renderWithRouter(<AddTask />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const { textInput } = getElements();

    await user.type(textInput, 'Новая задача');

    expect(textInput).toHaveValue('Новая задача');
  });

  test('Если название задачи пустое - не добавлять её при подтверждении и наоборот', async () => {
    renderWithRouter(<AddTask />, {
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

  test('при наличии dueDate в форме передает new Date(dueDate)', async () => {
    renderWithRouter(<AddTask />, {
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
