import { screen } from '@testing-library/react';
import { renderWithRouter, setupMockServer } from '@shared/testing';
import { MOCK_TASK } from '@shared/mocks/';
import { notepadId } from 'shared/schemas';
import { TaskItem } from './TaskItem';
import userEvent from '@testing-library/user-event';

const updateTaskMock = vi.fn();
const deleteTaskMock = vi.fn();
const handleModalIdMock = vi.fn();
const renameTaskMock = vi.fn();
const handleSaveTitleMock = vi.fn();

const props = {
  notepadId: notepadId,
  notepadPathName: '/notepads/1',
  currentModalId: '1',
  editingTaskId: '1',
  deleteTask: deleteTaskMock,
  updateTaskStatus: updateTaskMock,
  handleModalId: handleModalIdMock,
  renameTask: renameTaskMock,
  handleSaveTitle: handleSaveTitleMock,
  task: MOCK_TASK,
};

describe('TaskItem component', () => {
  const user = userEvent.setup();

  setupMockServer();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should change status correctly', async () => {
    renderWithRouter(<TaskItem {...props} />, {
      initialEntries: ['/notepads/1'],
      path: '/notepads/:notepadId',
    });

    const changeStatusButton = screen.getByLabelText('tasks.actions.complete');
    await user.click(changeStatusButton);

    expect(updateTaskMock).toHaveBeenCalled();
  });
});
