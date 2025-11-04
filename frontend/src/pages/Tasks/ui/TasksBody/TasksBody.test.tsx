import { screen } from '@testing-library/react';
import { renderWithRouter, setupMockServer } from '@shared/testing';
import { MOCK_TASK } from '@shared/mocks/';
import { notepadId } from 'shared/schemas';
import { TasksBody } from './TasksBody';
import * as useTaskHook from '@shared/lib';

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

describe('TasksBody component', () => {
  const updateTaskMock = vi.fn();
  const deleteTaskMock = vi.fn();
  const fetchNextPageMock = vi.fn();
  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
