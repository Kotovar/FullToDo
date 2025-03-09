import { describe, test, expect, beforeEach } from 'vitest';
import taskRepository, { MockTaskRepository } from './MockTaskRepository';
import { NOTEPADS } from '../db/mock/mock-db';

const newTitleNotepad = { title: 'Test Notepad' };
const notepadId = '999';
const taskId = '999';
const realNotepadId = '1';
const realNotepadTitle = 'Рабочее';
const realTaskId = '1';
const newTask = {
  title: 'Task title',
  _id: taskId,
  createdDate: new Date(),
  isCompleted: false,
  notepadId: notepadId,
  dueDate: new Date(),
  description: 'Task description',
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

    const responseCreateDouble =
      await repository.createNotepad(newTitleNotepad);

    expect(responseCreateDouble).toStrictEqual({
      status: 409,
      message: `A notebook with the title ${newTitleNotepad.title} already exists`,
    });
  });

  test('method createTask', async () => {
    const responseCreate = await repository.createTask(newTask, realNotepadId);

    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `A task with the title ${newTask.title} has been successfully created`,
    });

    const badResponseCreate = await repository.createTask(newTask, notepadId);

    expect(badResponseCreate).toStrictEqual({
      status: 404,
      message: 'Notepad not found',
    });

    const doubleResponseCreate = await repository.createTask(
      newTask,
      realNotepadId,
    );

    expect(doubleResponseCreate).toStrictEqual({
      status: 409,
      message: `A task with the title ${newTask.title} already exists in notepad '${realNotepadTitle}'`,
    });
  });

  test('method getAllNotepads', async () => {
    const responseGet = await repository.getAllNotepads();

    const notepadsWithoutTasks = [
      { title: 'Сегодня', _id: 'today' },
      { title: 'Задачи', _id: 'all' },
    ].concat(NOTEPADS.map(({ tasks: _, ...rest }) => rest));

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: notepadsWithoutTasks,
    });
  });

  test('method getAllTasks', async () => {
    const responseGet = await repository.getAllTasks();

    const allTasks = NOTEPADS.flatMap(notepad => notepad.tasks);

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: allTasks,
    });
  });

  test('method getSingleTask', async () => {
    const responseGet = await repository.getSingleTask(
      realTaskId,
      realNotepadId,
    );

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: NOTEPADS[0].tasks[0],
    });

    const incorrectResponseGet = await repository.getSingleTask(
      taskId,
      notepadId,
    );

    expect(incorrectResponseGet).toStrictEqual({
      status: 404,
      message: `Task ${taskId} not found`,
      data: null,
    });
  });

  test('method getSingleNotepadTasks', async () => {
    const responseGet = await repository.getSingleNotepadTasks(realNotepadId);

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: NOTEPADS[0].tasks,
    });

    const incorrectResponseGet =
      await repository.getSingleNotepadTasks(notepadId);

    expect(incorrectResponseGet).toStrictEqual({
      status: 404,
      message: `Notepad ${notepadId} not found`,
      data: [],
    });
  });

  test('method getTodayTasks', async () => {
    const responseGet = await repository.getTodayTasks();

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: [NOTEPADS[0].tasks[0]],
    });
  });

  test('method updateNotepad', async () => {
    const responseUpdate = await repository.updateNotepad(
      realNotepadId,
      newTitleNotepad,
    );

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A notepad with the id ${realNotepadId} has been successfully updated`,
      data: [
        {
          title: newTitleNotepad.title,
          _id: realNotepadId,
          tasks: NOTEPADS[0].tasks,
        },
      ],
    });

    const responseUpdateDouble = await repository.updateNotepad(
      realNotepadId,
      newTitleNotepad,
    );

    expect(responseUpdateDouble).toStrictEqual({
      status: 409,
      message: `The title ${newTitleNotepad.title} is already in use`,
    });

    const badResponseUpdateDouble = await repository.updateNotepad(
      notepadId,
      newTitleNotepad,
    );

    expect(badResponseUpdateDouble).toStrictEqual({
      status: 404,
      message: 'Notepad not found',
    });
  });

  test('method updateTask', async () => {
    const updatedTask = { title: 'new' };

    const responseUpdate = await repository.updateTask(
      realTaskId,
      realNotepadId,
      updatedTask,
    );

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A task with the _id ${realTaskId} has been successfully updated`,
      data: { ...NOTEPADS[0].tasks[0], title: updatedTask.title },
    });

    const badResponseUpdateDouble = await repository.updateTask(
      taskId,
      notepadId,
      newTitleNotepad,
    );

    expect(badResponseUpdateDouble).toStrictEqual({
      status: 404,
      message: 'Task not found',
    });
  });

  test('method deleteNotepad', async () => {
    const responseDelete = await repository.deleteNotepad(realNotepadId);

    expect(responseDelete).toStrictEqual({
      status: 200,
      message: 'Notepad deleted successfully',
    });

    const badResponseDelete = await repository.deleteNotepad(notepadId);

    expect(badResponseDelete).toStrictEqual({
      status: 404,
      message: 'Notepad not found',
    });
  });

  test('method deleteTask', async () => {
    const responseDelete = await repository.deleteTask(realTaskId);
    expect(responseDelete).toStrictEqual({
      status: 200,
      message: 'Task deleted successfully',
    });

    const badResponseDelete = await repository.deleteTask(taskId);
    expect(badResponseDelete).toStrictEqual({
      status: 404,
      message: 'Task not found',
    });
  });
});
