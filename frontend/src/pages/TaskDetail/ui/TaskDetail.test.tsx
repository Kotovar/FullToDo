import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { TaskDetail } from './TaskDetail';
import { setupMockServer } from '@shared/config';
import * as taskModule from '@pages/TaskDetail/ui/Subtasks';
import * as useTaskHook from '@entities/Task';

const task = {
  title: 'Задача 1',
  notepadId: '1',
  _id: '1',
  description: 'Описание для задачи 1',
  createdDate: new Date('2025-04-11T06:26:26.561Z'),
  isCompleted: false,
  progress: '1 из 5',
  subtasks: [],
};

const getUseTaskMock = (updateTask = vi.fn()) => {
  vi.spyOn(taskModule, 'useTask').mockReturnValue({
    task,
    isError: false,
    updateTask: updateTask,
  });

  return updateTask;
};

const getUseTaskFormMock = (
  addTaskMock = vi.fn(),
  setFormMock = vi.fn(),
  setSubtaskTitleMock = vi.fn(),
) => {
  vi.spyOn(taskModule, 'useTaskForm').mockReturnValue({
    form: {
      title: task.title,
      dueDate: '',
      description: '',
      subtasks: [],
    },
    setForm: setFormMock,
    subtaskTitle: 'Новая подзадача',
    setSubtaskTitle: setSubtaskTitleMock,
    handleAddSubtask: addTaskMock,
  });

  return { addTaskMock, setFormMock, setSubtaskTitleMock };
};

describe('TaskDetail component', () => {
  const user = userEvent.setup();
  const onClickBackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Общие тесты - запуск, кнопка Назад, ошибка', () => {
    test('корректно запускается', () => {
      renderWithRouter(<TaskDetail />);

      const heading = screen.getByRole('heading');

      expect(heading).toBeDefined();
    });

    test('кнопка Назад вызывает свой метод', async () => {
      renderWithRouter(<TaskDetail />);

      const button = screen.getByText('Назад');
      button.onclick = onClickBackMock;

      await user.click(button);
      expect(onClickBackMock).toHaveBeenCalled();
    });

    test('показывает ошибку, если задача не найдена', async () => {
      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/unknown/tasks/404'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const error = await screen.findByText('Error fetching data');
      expect(error).toBeDefined();
    });
  });

  describe('метод handleUpdateTask', () => {
    setupMockServer();

    test('кнопка Сохранить вызывает updateTask', async () => {
      const updateTaskMock = getUseTaskMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const button = screen.getByText('Сохранить');

      await user.click(button);

      expect(updateTaskMock).toHaveBeenCalled();
    });

    test.each([
      {
        name: 'ошибка является экземпляром Error',
        rejection: new Error('Сетевая ошибка'),
        expectedError: 'Ошибка при сохранении: Сетевая ошибка',
      },
      {
        name: 'ошибка не является экземпляром Error',
        rejection: 'что-то пошло не так',
        expectedError: 'Неизвестная ошибка при сохранении',
      },
    ])(
      'кнопка Сохранить выбрасывает ошибку, если $name',
      async ({ rejection, expectedError }) => {
        getUseTaskMock(vi.fn().mockRejectedValue(rejection));

        renderWithRouter(<TaskDetail />, {
          initialEntries: ['/notepads/1/tasks/1'],
          path: '/notepads/:notepadId/tasks/:taskId',
        });

        const button = screen.getByText('Сохранить');
        await user.click(button);

        expect(screen.getByText(expectedError)).toBeDefined();
      },
    );

    test('если новый title не совпадает с введённым, то вызывается updateTask', async () => {
      const updateTaskMock = vi.fn();

      getUseTaskMock();

      vi.spyOn(useTaskHook, 'useTasks').mockReturnValue({
        tasks: [task],
        isError: false,
        methods: {
          updateTask: updateTaskMock,
          deleteTask: vi.fn(),
          createTask: vi.fn(),
        },
      });

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('Задача 1')).toBeDefined();
      });

      const input = screen.getByDisplayValue('Задача 1');
      await user.type(input, 'Выучить Node.js и deno');

      const button = screen.getByText('Сохранить');
      await user.click(button);

      expect(updateTaskMock).toHaveBeenCalled();
    });

    test('при наличии dueDate в форме передает new Date(dueDate)', async () => {
      const updateTaskMock = getUseTaskMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const dateInput = screen.getByLabelText('Дата выполнения', {
        selector: 'input',
      });

      await user.type(dateInput, '2025-04-20');

      const saveButton = screen.getByText('Сохранить');
      await user.click(saveButton);

      await waitFor(() => {
        expect(updateTaskMock).toHaveBeenCalledWith(
          expect.objectContaining({
            dueDate: new Date('2025-04-20'),
          }),
        );
      });
    });
  });

  describe('метод handleSubtask', () => {
    setupMockServer();

    test('обновляет подзадачи при действии toggle', async () => {
      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('Выучить Node.js')).toBeDefined();
      });

      const subtaskItem = screen
        .getByDisplayValue('Выучить Node.js')
        .closest('li');
      const toggleButton = within(subtaskItem!).getByRole('button', {
        name: /отметить выполненной/i,
      });

      expect(toggleButton).toHaveAttribute(
        'aria-label',
        'Отметить выполненной',
      );

      await user.click(toggleButton);

      expect(toggleButton).toHaveAttribute(
        'aria-label',
        'Снять отметку о выполнении',
      );
    });
  });

  describe('метод handleKeyDown', () => {
    setupMockServer();

    test('Нажатие Enter добавляет подзадачу', async () => {
      const { addTaskMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const input = screen.getByPlaceholderText('Первый шаг');
      await user.type(input, '{Enter}');

      await waitFor(() => {
        expect(addTaskMock).toHaveBeenCalled();
      });
    });
  });

  describe('метод onChange для TaskTitle', () => {
    setupMockServer();

    test('Ввод текста в title вызывает setForm', async () => {
      const { setFormMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const input = screen.getByDisplayValue('Задача 1');
      await user.type(input, 'Задача Новая');

      await waitFor(() => {
        expect(setFormMock).toHaveBeenCalled();
      });
    });
  });

  describe('метод onChange для TaskInput', () => {
    setupMockServer();

    test('Ввод текста в subtitle вызывает setSubtaskTitle', async () => {
      const { setSubtaskTitleMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const input = screen.getByPlaceholderText('Первый шаг');
      await user.type(input, 'Подзадача Новая');

      await waitFor(() => {
        expect(setSubtaskTitleMock).toHaveBeenCalled();
      });
    });

    test('Изменение даты вызывает setForm', async () => {
      const { setFormMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const input = screen.getByLabelText('Дата выполнения', {
        selector: 'input',
      });
      await user.type(input, '2025-04-19');

      await waitFor(() => {
        expect(setFormMock).toHaveBeenCalled();
      });
    });
  });

  describe('метод onChange для TaskInput', () => {
    setupMockServer();

    test('Ввод текста в textarea вызывает setForm', async () => {
      const { setFormMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      const textarea = screen.getByLabelText('Описание', {
        selector: 'textarea',
      });
      await user.type(textarea, 'Текст');

      await waitFor(() => {
        expect(setFormMock).toHaveBeenCalled();
      });
    });
  });
});
