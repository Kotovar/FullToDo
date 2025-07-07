import userEvent from '@testing-library/user-event';
import { screen, waitFor, within } from '@testing-library/react';
import {
  getUseBackNavigateMock,
  renderWithRouter,
  setupMockServer,
} from '@shared/testing';
import { MOCK_TASK } from '@shared/mocks';
import { getUseTaskDetailsMock } from '@entities/Task';
import TaskDetail from '@pages/TaskDetail';
import * as taskModule from '@pages/TaskDetail/ui/Subtasks';

const onChangeTitleMock = vi.fn();
const onChangeSubtaskTitleMock = vi.fn();
const onChangeDueDateMock = vi.fn();

const getUseTaskFormMock = (
  setFormMock = vi.fn(),
  setSubtaskTitleMock = vi.fn(),
) => {
  vi.spyOn(taskModule, 'useTaskForm').mockReturnValue({
    form: {
      title: MOCK_TASK.title,
      dueDate: '',
      description: '',
      subtasks: [],
    },
    subtaskTitle: '',
    methods: {
      onUpdateTask: vi.fn(),
      onCreateSubtask: vi.fn(),
      onChangeTitle: onChangeTitleMock,
      onChangeSubtaskTitle: onChangeSubtaskTitleMock,
      onChangeDueDate: onChangeDueDateMock,
      onChangeDescription: vi.fn(),
      handleKeyDown: vi.fn(),
      updateSubtask: vi.fn(),
    },
  });

  return {
    setFormMock,
    setSubtaskTitleMock,
    onChangeTitleMock,
    onChangeSubtaskTitleMock,
    onChangeDueDateMock,
  };
};

describe('TaskDetail component', () => {
  const user = userEvent.setup();
  const onClickBackMock = vi.fn();
  const updateTaskMock = vi.fn();
  const handleGoBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Общие тесты - запуск, кнопка Назад, ошибка', () => {
    test('корректно запускается', async () => {
      getUseTaskDetailsMock();
      renderWithRouter(<TaskDetail />);

      await waitFor(() =>
        expect(screen.getByRole('heading')).toBeInTheDocument(),
      );
    });

    test('кнопка Назад вызывает свой метод', async () => {
      getUseTaskDetailsMock();
      renderWithRouter(<TaskDetail />);

      await waitFor(() =>
        expect(screen.getByRole('heading')).toBeInTheDocument(),
      );

      const button = screen.getByText('back');
      button.onclick = onClickBackMock;

      await user.click(button);
      expect(onClickBackMock).toHaveBeenCalled();
    });

    test('показывает ошибку, если задача не найдена', async () => {
      getUseTaskDetailsMock(true);

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/unknown/task/404'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      const error = await screen.findByText('errors.loadingFail');
      expect(error).toBeDefined();
    });
  });

  describe('метод handleUpdateTask', () => {
    setupMockServer();

    test('кнопка Сохранить вызывает не updateTask если ничего не изменено', async () => {
      getUseTaskDetailsMock(false, updateTaskMock);

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      const button = screen.getByText('save');

      await user.click(button);

      expect(updateTaskMock).not.toHaveBeenCalled();
    });

    test('если новый title не совпадает с введённым, то вызывается updateTask и handleGoBack', async () => {
      const updateTaskMock = vi.fn().mockResolvedValue(true);

      getUseTaskDetailsMock(false, updateTaskMock);
      getUseBackNavigateMock(handleGoBack);

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      const input = screen.getByDisplayValue('Задача 1');
      await user.type(input, 'Выучить Node.js и deno');

      const button = screen.getByText('save');
      await user.click(button);

      expect(updateTaskMock).toHaveBeenCalled();
      await waitFor(() => {
        expect(handleGoBack).toHaveBeenCalled();
      });
    });

    test('если новый description не совпадает с введённым, то вызывается updateTask', async () => {
      getUseTaskDetailsMock(false, updateTaskMock);

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      const textarea = screen.getByDisplayValue('Описание для задачи 1');
      await user.type(textarea, 'Выучить Node.js и deno');

      const button = screen.getByText('save');
      await user.click(button);

      expect(updateTaskMock).toHaveBeenCalled();
    });

    test('при наличии dueDate в форме передает new Date(dueDate)', async () => {
      getUseTaskDetailsMock(false, updateTaskMock);

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      const dateInput = screen.getByLabelText('tasks.date', {
        selector: 'input',
      });
      await user.clear(dateInput);
      await user.type(dateInput, '2025-04-20');

      const saveButton = screen.getByText('save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(updateTaskMock).toHaveBeenCalledWith(
          {
            dueDate: new Date('2025-04-20'),
          },
          '1',
          'update',
        );
      });
    });
  });

  describe('метод handleSubtask', () => {
    setupMockServer();

    test('обновляет подзадачи при действии toggle', async () => {
      getUseTaskDetailsMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      const subtaskItem = screen.getByText('Выучить Node.js').closest('li');
      const toggleButton = within(subtaskItem!).getByRole('button', {
        name: 'tasks.actions.complete',
      });

      expect(toggleButton).toHaveAttribute(
        'aria-label',
        'tasks.actions.complete',
      );

      await user.click(toggleButton);

      waitFor(() =>
        expect(toggleButton).toHaveAttribute(
          'aria-label',
          'tasks.actions.incomplete',
        ),
      );
    });
  });

  describe('метод handleKeyDown', () => {
    setupMockServer();

    test('Нажатие Enter добавляет подзадачу', async () => {
      getUseTaskDetailsMock(false, updateTaskMock);

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      const input = screen.getByPlaceholderText('tasks.steps.next');
      await user.type(input, 'Новая{Enter}');

      await waitFor(() => {
        expect(updateTaskMock).toHaveBeenCalled();
      });
    });
  });

  describe('метод onChange для TaskTitle', () => {
    setupMockServer();

    test('Ввод текста в title вызывает onChangeTitle', async () => {
      const { onChangeTitleMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      await waitFor(() =>
        expect(screen.getByDisplayValue('Задача 1')).toBeDefined(),
      );

      const input = screen.getByDisplayValue('Задача 1');
      await user.type(input, 'Задача Новая');

      await waitFor(() => {
        expect(onChangeTitleMock).toHaveBeenCalled();
      });
    });
  });

  describe('метод onChange для TaskInput', () => {
    setupMockServer();

    test('Ввод текста в subtitle вызывает setSubtaskTitle', async () => {
      const { onChangeSubtaskTitleMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      await waitFor(() =>
        expect(screen.getByPlaceholderText('tasks.steps.first')).toBeDefined(),
      );

      const input = screen.getByPlaceholderText('tasks.steps.first');
      await user.type(input, 'Подзадача Новая');

      await waitFor(() => {
        expect(onChangeSubtaskTitleMock).toHaveBeenCalled();
      });
    });

    test('Изменение даты вызывает setForm', async () => {
      const { onChangeDueDateMock } = getUseTaskFormMock();

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/tasks/1'],
        path: '/notepads/:notepadId/tasks/:taskId',
      });

      await waitFor(() =>
        expect(
          screen.getByLabelText('tasks.date', {
            selector: 'input',
          }),
        ).toBeDefined(),
      );

      const input = screen.getByLabelText('tasks.date', {
        selector: 'input',
      });
      await user.type(input, '2025-04-19');

      await waitFor(() => {
        expect(onChangeDueDateMock).toHaveBeenCalled();
      });
    });
  });

  describe('метод handleCreateSubtask', () => {
    setupMockServer();

    test('Метод возвращает undefined если ничего не введено кроме пробелов', async () => {
      const { setFormMock } = getUseTaskFormMock();
      const updateTaskMock = vi.fn().mockResolvedValue(true);
      getUseTaskDetailsMock(false, updateTaskMock);

      renderWithRouter(<TaskDetail />, {
        initialEntries: ['/notepads/1/task/1'],
        path: '/notepads/:notepadId/task/:taskId',
      });

      await waitFor(() =>
        expect(screen.getByDisplayValue('Задача 1')).toBeDefined(),
      );

      const input = screen.getByRole('textbox', {
        name: 'tasks.addSubtask',
      });
      await user.type(input, '    {Enter}');
      const button = screen.getByRole('button', {
        name: 'tasks.addSubtask',
      });
      await user.click(button);

      await waitFor(() => {
        expect(setFormMock).not.toHaveBeenCalled();
        expect(updateTaskMock).not.toHaveBeenCalled();
      });
    });
  });
});
