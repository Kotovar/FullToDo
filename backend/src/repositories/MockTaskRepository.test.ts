import { describe, test, expect, beforeEach } from 'vitest';
import taskRepository, { MockTaskRepository } from './MockTaskRepository';
import { NOTEPADS } from '../db/mock/mock-db';
import { commonNotepads } from './const';
import type { Notepad } from '@shared/schemas';

const newTitleNotepad = { title: 'Test Notepad' };
const notepadId = '999';
const taskId = '999';
const realNotepadId = '1';
const realNotepadTitle = 'Рабочее';
const realTaskId = '1';
const newTask = {
  title: 'Task title',
  createdDate: new Date(),
  isCompleted: false,
  notepadId: realNotepadId,
  dueDate: new Date(),
  description: 'Task description',
};
const customNotepad: Notepad[] = [
  {
    title: 'Рабочее',
    _id: realNotepadId,
    tasks: [{ ...newTask, progress: '', _id: realTaskId }],
  },
];

describe('MockTaskRepository', () => {
  let repository: typeof taskRepository;
  const updatedTask = { title: 'new' };

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

    const secondResponseCreate = await repository.createTask(
      newTask,
      realNotepadId,
    );

    expect(secondResponseCreate).toStrictEqual({
      status: 409,
      message: `A task with the title ${newTask.title} already exists in notepad '${realNotepadTitle}'`,
    });
  });

  test('method createTask and common id', async () => {
    const responseCreate = await repository.createTask(
      newTask,
      commonNotepads[0]._id,
    );

    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `A task with the title ${newTask.title} has been successfully created`,
    });
  });

  test('method createTask and common notepad with second Response', async () => {
    const responseCreate = await repository.createTask(newTask, realNotepadId);

    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `A task with the title ${newTask.title} has been successfully created`,
    });

    const secondResponseCreate = await repository.createTask(
      newTask,
      commonNotepads[0]._id,
    );

    expect(secondResponseCreate).toStrictEqual({
      status: 409,
      message: `A task with the title ${newTask.title} already exists in notepad 'All'`,
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
    const responseUpdate = await repository.updateTask(
      realNotepadId,
      realTaskId,
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

    const responseUpdateSecond = await repository.updateTask(
      realNotepadId,
      realNotepadId,
      updatedTask,
    );

    expect(responseUpdateSecond).toStrictEqual({
      status: 409,
      message: `A task with the title ${updatedTask.title} already exists in notepad '${realNotepadTitle}'`,
    });
  });

  test('method updateTask and common id', async () => {
    const responseUpdate = await repository.updateTask(
      commonNotepads[0]._id,
      realNotepadId,
      updatedTask,
    );

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A task with the _id ${realTaskId} has been successfully updated`,
      data: { ...NOTEPADS[0].tasks[0], title: updatedTask.title },
    });
  });

  test('should calculate progress when no subtasks completed', async () => {
    const updatedTask = {
      title: 'Updated title',
      subtasks: [{ isCompleted: false, title: 'Выучить Java', _id: '7' }],
    };

    const response = await repository.updateTask(
      realNotepadId,
      realTaskId,
      updatedTask,
    );
    expect(response?.data?.progress).toBe(
      `${updatedTask.subtasks.filter(task => task.isCompleted).length} из ${updatedTask.subtasks.length}`,
    );
  });

  test('should handle empty subtasks with empty progress', async () => {
    const response = await repository.updateTask(realNotepadId, realTaskId, {
      title: 'Updated title',
      subtasks: [],
    });

    expect(response?.data?.progress).toBe('');
  });

  test('should default finishedSubtasks and totalSubtasks to 0', async () => {
    const repo = new MockTaskRepository(customNotepad);

    const response = await repo.updateTask(realNotepadId, realTaskId, {
      title: 'New title',
    });

    expect(response.status).toBe(200);
    expect(response.data?.progress).toBe('');
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
