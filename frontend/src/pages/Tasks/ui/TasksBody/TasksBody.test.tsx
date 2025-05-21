import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter } from '@shared/testing';
import { MOCK_TASK } from '@shared/mocks/';
import { setupMockServer } from '@shared/config';
import { notepadId } from 'shared/schemas';
import { TasksBody } from './TasksBody';
import * as useTaskHook from '@entities/Task';

const props = {
  notepadId: notepadId,
  notepadPathName: '/notepads/1',
  params: new URLSearchParams(),
};

const getUseTasksMockWithRender = (
  isError = false,
  updateTask = vi.fn(),
  deleteTask = vi.fn(),
  tasks = [MOCK_TASK],
) => {
  vi.spyOn(useTaskHook, 'useTasks').mockReturnValue({
    tasks,
    isError,
    isLoading: false,
    methods: {
      updateTask,
      deleteTask,
    },
  });

  renderWithRouter(<TasksBody {...props} />, {
    initialEntries: ['/notepads/1'],
    path: '/notepads/:notepadId',
  });
};

const getElements = (
  element: 'menu' | 'delete' | 'rename' | 'input' | string,
) => {
  switch (element) {
    case 'menu':
      return screen.getAllByLabelText('Дополнительное меню')[0];
    case 'delete':
      return screen.getByText('Удалить');
    case 'rename':
      return screen.getByText('Переименовать');
    case 'input':
      return screen.getByRole('textbox');
    default:
      return screen.getByLabelText(element);
  }
};

describe('TasksBody component', () => {
  const user = userEvent.setup();
  const updateTaskMock = vi.fn();
  const deleteTaskMock = vi.fn();
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('вызов метода handleModalId открывает подменю', async () => {
    getUseTasksMockWithRender();

    const menuButton = getElements('menu');
    await user.click(menuButton);

    await user.click(getElements('rename'));

    const input = getElements('input');
    expect(input).toHaveValue(MOCK_TASK.title);
    expect(input).not.toHaveAttribute('readOnly');
  });

  test('вызывается метод updateTaskStatus', async () => {
    getUseTasksMockWithRender(false, updateTaskMock);

    const button = getElements('Отметить выполненной');
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(updateTaskMock).toHaveBeenCalledWith(
      { isCompleted: true },
      MOCK_TASK._id,
    );
  });

  test('Описание кнопки меняется в зависимости от статуса задачи - Снять отметку о выполнении', async () => {
    const tasksWithCompletedField = [{ ...MOCK_TASK, isCompleted: true }];
    getUseTasksMockWithRender(
      false,
      updateTaskMock,
      deleteTaskMock,
      tasksWithCompletedField,
    );

    const button = getElements('Снять отметку о выполнении');
    expect(button).toBeInTheDocument();
  });

  test('вызывается updateTask при указании нового названия', async () => {
    getUseTasksMockWithRender(false, updateTaskMock);

    const menuButton = getElements('menu');
    await user.click(menuButton);
    await user.click(getElements('rename'));

    const input = getElements('input');
    await user.clear(input);
    await user.type(input, 'Новое название{enter}');

    expect(updateTaskMock).toHaveBeenCalledWith(
      { title: 'Новое название' },
      MOCK_TASK._id,
    );
  });

  test('не вызывается updateTask при сохранении того же названия', async () => {
    getUseTasksMockWithRender(false, updateTaskMock);

    const menuButton = getElements('menu');
    await user.click(menuButton);
    await user.click(getElements('rename'));

    const input = getElements('input');
    await user.type(input, '{enter}');
    expect(updateTaskMock).not.toHaveBeenCalled();
  });

  test('вызывается метод methods.deleteTask', async () => {
    getUseTasksMockWithRender(false, updateTaskMock, deleteTaskMock);

    const menuButton = getElements('menu');
    await user.click(menuButton);

    const deleteButton = getElements('delete');
    await user.click(deleteButton);
    expect(deleteTaskMock).toHaveBeenCalled();
  });
});
