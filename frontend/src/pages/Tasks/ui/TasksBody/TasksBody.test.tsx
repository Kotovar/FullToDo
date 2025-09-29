import { screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { renderWithRouter, setupMockServer } from '@shared/testing';
import { MOCK_TASK } from '@shared/mocks/';
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
  fetchNextPage = vi.fn(),
  tasks = [MOCK_TASK],
) => {
  vi.spyOn(useTaskHook, 'useTasks').mockReturnValue({
    tasks,
    isError,
    isLoading: false,
    hasNextPage: false,
    methods: {
      updateTask,
      deleteTask,
      fetchNextPage,
    },
  });

  renderWithRouter(<TasksBody {...props} />, {
    initialEntries: ['/notepads/1'],
    path: '/notepads/:notepadId',
  });
};

// TODO: переписать тесты после перехода на виртуализацию

// const getElements = (
//   element: 'menu' | 'delete' | 'rename' | 'input' | string,
// ) => {
//   switch (element) {
//     case 'menu':
//       return screen.getAllByLabelText('card.additionalMenu')[0];
//     case 'delete':
//       return screen.getByText('delete');
//     case 'rename':
//       return screen.getByText('rename');
//     case 'input':
//       return screen.getByRole('textbox');
//     default:
//       return screen.getByLabelText(element);
//   }
// };

describe('TasksBody component', () => {
  // const user = userEvent.setup();
  const updateTaskMock = vi.fn();
  const deleteTaskMock = vi.fn();
  const fetchNextPageMock = vi.fn();
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // test('calling the handleModalId method opens a submenu', async () => {
  //   getUseTasksMockWithRender();

  //   const menuButton = getElements('menu');
  //   await user.click(menuButton);

  //   await user.click(getElements('rename'));

  //   const input = getElements('input');
  //   expect(input).toHaveValue(MOCK_TASK.title);
  //   expect(input).not.toHaveAttribute('readOnly');
  // });

  // test('the updateTaskStatus method should be called', async () => {
  //   getUseTasksMockWithRender(false, updateTaskMock);

  //   const button = getElements('tasks.actions.complete');
  //   expect(button).toBeInTheDocument();

  //   await user.click(button);
  //   expect(updateTaskMock).toHaveBeenCalledWith(
  //     { isCompleted: true },
  //     MOCK_TASK._id,
  //   );
  // });

  // test('the button description changes depending on the task status - unmark as completed', async () => {
  //   const tasksWithCompletedField = [{ ...MOCK_TASK, isCompleted: true }];
  //   getUseTasksMockWithRender(
  //     false,
  //     updateTaskMock,
  //     deleteTaskMock,
  //     fetchNextPageMock,
  //     tasksWithCompletedField,
  //   );

  //   const button = getElements('tasks.actions.incomplete');
  //   expect(button).toBeInTheDocument();
  // });

  // test('updateTask should be called when a new name is specified', async () => {
  //   getUseTasksMockWithRender(false, updateTaskMock);

  //   const menuButton = getElements('menu');
  //   await user.click(menuButton);
  //   await user.click(getElements('rename'));

  //   const input = getElements('input');
  //   await user.clear(input);
  //   await user.type(input, 'Новое название{enter}');

  //   expect(updateTaskMock).toHaveBeenCalledWith(
  //     { title: 'Новое название' },
  //     MOCK_TASK._id,
  //   );
  // });

  // test('updateTask should not be called while keeping the same name', async () => {
  //   getUseTasksMockWithRender(false, updateTaskMock);

  //   const menuButton = getElements('menu');
  //   await user.click(menuButton);
  //   await user.click(getElements('rename'));

  //   const input = getElements('input');
  //   await user.type(input, '{enter}');
  //   expect(updateTaskMock).not.toHaveBeenCalled();
  // });

  // test('the methods.deleteTask method should be called', async () => {
  //   getUseTasksMockWithRender(false, updateTaskMock, deleteTaskMock);

  //   const menuButton = getElements('menu');
  //   await user.click(menuButton);

  //   const deleteButton = getElements('delete');
  //   await user.click(deleteButton);
  //   expect(deleteTaskMock).toHaveBeenCalled();
  // });

  test('a message should be displayed when the task list is empty', async () => {
    getUseTasksMockWithRender(
      false,
      updateTaskMock,
      deleteTaskMock,
      fetchNextPageMock,
      [],
    );

    const message = screen.getByText('common.notFound');
    expect(message).toBeInTheDocument();
  });
});
