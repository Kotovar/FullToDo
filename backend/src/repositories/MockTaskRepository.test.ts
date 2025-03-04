import { describe, test, expect, beforeEach } from 'vitest';
import taskRepository, { MockTaskRepository } from './MockTaskRepository';
import { NOTEPADS } from '../db/mock/mock-db';

const newTitleNotepad = { title: 'Test Notepad' };
const notepadId = '999';

const newTask = {
  title: 'Task title',
  _id: '999',
  createdDate: new Date(),
  isCompleted: false,
  notepadId: notepadId,
  dueDate: new Date(),
  description: 'Task description',
  subtasks: [],
};

describe('MockTaskRepository', () => {
  let repository: typeof taskRepository;

  beforeEach(() => {
    repository = new MockTaskRepository(NOTEPADS);
  });

  test('method createNotepad', async () => {
    const responseCreate = await repository.createNotepad(newTitleNotepad);

    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `A notebook with the title ${newTitleNotepad.title} has been successfully created`,
    });

    const responseCreateDOuble =
      await repository.createNotepad(newTitleNotepad);

    expect(responseCreateDOuble).toStrictEqual({
      status: 409,
      message: `A notebook with the title ${newTitleNotepad.title} already exists`,
    });
  });

  test('method createTask', async () => {
    const responseCreate = await repository.createTask(newTask, notepadId);

    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `A task with the title ${newTask.title} has been successfully created`,
    });
  });

  test('method getAllNotepads', async () => {
    const responseCreate = await repository.getAllNotepads();

    const notepadsWithoutTasks = [
      { title: 'Сегодня', _id: 'today' },
      { title: 'Задачи', _id: 'all' },
    ].concat(NOTEPADS.map(({ tasks: _, ...rest }) => rest));

    expect(responseCreate).toStrictEqual({
      status: 200,
      message: 'Success',
      data: notepadsWithoutTasks,
    });
  });
});
