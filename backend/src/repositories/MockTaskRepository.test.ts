import { describe, test, expect, beforeEach } from 'vitest';
import taskRepository, { MockTaskRepository } from './MockTaskRepository';
import { NOTEPADS } from '../db/mock/mock-db';
import {
  commonNotepadId,
  type TaskQueryParams,
  type Notepad,
} from '@shared/schemas';

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

const allTasks = NOTEPADS.flatMap(notepad => notepad.tasks);

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
      message: `Task with title ${newTask.title} already exists in ${realNotepadTitle}`,
    });
  });

  test('method createTask and common id', async () => {
    const responseCreate = await repository.createTask(
      newTask,
      commonNotepadId,
    );

    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `A task with the title ${newTask.title} has been successfully created`,
    });
  });

  test('method getAllNotepads', async () => {
    const responseGet = await repository.getAllNotepads();

    const notepadsWithoutTasks = [
      { title: 'Задачи', _id: commonNotepadId },
    ].concat(NOTEPADS.map(({ tasks: _, ...rest }) => rest));

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: notepadsWithoutTasks,
    });
  });

  test('method getAllTasks', async () => {
    const responseGet = await repository.getAllTasks();

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: allTasks,
    });
  });

  test('method getAllTasks with filter`s params', async () => {
    const params: TaskQueryParams = {
      isCompleted: true,
      hasDueDate: false,
      priority: 'low',
    };
    const responseGet = await repository.getAllTasks(params);

    const allTasksFiltered = allTasks.filter(
      task => task.isCompleted && !task.dueDate && task.priority === 'low',
    );

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: allTasksFiltered,
    });
  });

  test('method getAllTasks with sort`s params - createdDate', async () => {
    const params: TaskQueryParams = {
      sortBy: 'createdDate',
      order: 'asc',
    };
    const responseGet = await repository.getAllTasks(params);

    const allTasksSorted = allTasks.toSorted((a, b) => {
      const valA = a.createdDate;
      const valB = b.createdDate;

      return valA < valB ? -1 : 1;
    });

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: allTasksSorted,
    });
  });

  test('method getAllTasks with sort`s params - priority', async () => {
    const params: TaskQueryParams = {
      sortBy: 'priority',
      order: 'desc',
    };
    const responseGet = await repository.getAllTasks(params);

    const allTasksSorted = allTasks.toSorted((a, b) => {
      const priorityOrder = { low: 0, medium: 1, high: 2 };
      const aVal = a.priority ? priorityOrder[a.priority] : -1;
      const bVal = b.priority ? priorityOrder[b.priority] : -1;
      return bVal - aVal;
    });

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: allTasksSorted,
    });
  });

  test('method getAllTasks with search', async () => {
    const params: TaskQueryParams = {
      search: '  TasK  ',
    };

    const responseGet = await repository.getAllTasks(params);

    const allTasksSearched = allTasks.filter(
      task =>
        task.title.toLowerCase().includes('task') ||
        task.description?.toLowerCase().includes('task'),
    );

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: allTasksSearched,
    });

    const responseGetAgain = await repository.getAllTasks({ search: '' });

    expect(responseGetAgain).toStrictEqual({
      status: 200,
      message: 'Success',
      data: allTasks,
    });
  });

  test('method getSingleTask', async () => {
    const responseGet = await repository.getSingleTask(realTaskId);

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: NOTEPADS[0].tasks[0],
    });

    const incorrectResponseGet = await repository.getSingleTask(taskId);

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
    const responseUpdate = await repository.updateTask(realTaskId, updatedTask);

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A task with the _id ${realTaskId} has been successfully updated`,
      data: { ...NOTEPADS[0].tasks[0], title: updatedTask.title },
    });

    const badResponseUpdateDouble = await repository.updateTask(
      taskId,
      newTitleNotepad,
    );

    expect(badResponseUpdateDouble).toStrictEqual({
      status: 404,
      message: 'Task not found',
    });

    const responseUpdateSecond = await repository.updateTask(
      realTaskId,
      updatedTask,
    );

    expect(responseUpdateSecond).toStrictEqual({
      status: 409,
      message: `Task with title ${updatedTask.title} already exists`,
    });
  });

  test('method updateTask and undefined notepad', async () => {
    const responseUpdate = await repository.updateTask(realTaskId, {
      ...updatedTask,
      notepadId: 'undefined',
    });

    expect(responseUpdate).toEqual({
      status: 404,
      message: 'Notepad not found',
    });
  });

  test('method updateTask and common notepad', async () => {
    const responseUpdate = await repository.updateTask(realTaskId, {
      ...updatedTask,
      notepadId: commonNotepadId,
    });

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A task with the _id ${realTaskId} has been successfully updated`,
      data: {
        ...NOTEPADS[0].tasks[0],
        title: updatedTask.title,
        notepadId: commonNotepadId,
      },
    });
  });

  test('method updateTask and switch task to another notepad', async () => {
    const anotherRealTaskId = '2';

    const responseUpdate = await repository.updateTask(realTaskId, {
      ...updatedTask,
      notepadId: anotherRealTaskId,
    });

    expect(responseUpdate.data?.notepadId).toBe(anotherRealTaskId);
  });

  test('should calculate progress when no subtasks completed', async () => {
    const updatedTask = {
      title: 'Updated title',
      subtasks: [{ isCompleted: false, title: 'Выучить Java', _id: '7' }],
    };

    const response = await repository.updateTask(realTaskId, updatedTask);
    expect(response?.data?.progress).toBe(
      `${updatedTask.subtasks.filter(task => task.isCompleted).length} из ${updatedTask.subtasks.length}`,
    );
  });

  test('should handle empty subtasks with empty progress', async () => {
    const response = await repository.updateTask(realTaskId, {
      title: 'Updated title',
      subtasks: [],
    });

    expect(response?.data?.progress).toBe('');
  });

  test('should default finishedSubtasks and totalSubtasks to 0', async () => {
    const repo = new MockTaskRepository(customNotepad);

    const response = await repo.updateTask(realTaskId, {
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
