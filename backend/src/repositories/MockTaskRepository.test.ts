import { describe, test, expect, beforeEach } from 'vitest';
import {
  commonNotepadId,
  type TaskQueryParams,
  type Task,
  PAGINATION,
} from '@sharedCommon/schemas';
import taskRepository, { MockTaskRepository } from './MockTaskRepository';
import { NOTEPADS } from '@db/mock/mock-db';
import {
  allTasks,
  customNotepad,
  tasksWithCommonAndUnrealNotepadIds,
  tasksWithDifferentDates,
  tasksWithEqualDates,
  tasksWithUndefined,
  dates,
  newTask,
  realId,
  paginatedTasks,
} from '@tests/mocks';
import { getMetaMock } from '@tests/utils';

const newTitleNotepad = { title: 'Test Notepad' };
const notepadId = '999';
const taskId = '999';
const { date1, date2, date3 } = dates;

const getSortedAllTasks = (
  order: TaskQueryParams['order'],
  type: TaskQueryParams['sortBy'],
  task: Task[],
) =>
  type &&
  task
    .toSorted((a, b) => {
      const valA = a[type];
      const valB = b[type];

      if (valA === undefined || valA === null) return order === 'asc' ? 1 : -1;
      if (valB === undefined || valB === null) return order === 'asc' ? -1 : 1;
      if (valA === valB) return 0;

      return order === 'asc' ? (valA < valB ? -1 : 1) : valA < valB ? 1 : -1;
    })
    .splice(0, PAGINATION.DEFAULT_LIMIT);

describe('MockTaskRepository', () => {
  let repository: typeof taskRepository;
  const updatedTask: Partial<Task> = { title: 'new' };
  const updatedTaskWithoutTitle: Partial<Task> = { isCompleted: true };

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
    const responseCreate = await repository.createTask(newTask, realId);
    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `Task with the title ${newTask.title} has been successfully created`,
    });

    const badResponseCreate = await repository.createTask(newTask, notepadId);

    expect(badResponseCreate).toStrictEqual({
      status: 404,
      message: 'Notepad not found',
    });
  });

  test('method createTask and common notepad', async () => {
    const responseCreate = await repository.createTask(
      newTask,
      commonNotepadId,
    );

    expect(responseCreate).toStrictEqual({
      status: 201,
      message: `Task with the title ${newTask.title} has been successfully created`,
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

    const meta = getMetaMock(allTasks);

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      meta,
      data: paginatedTasks,
    });
  });

  test('method getAllTasks with filter`s params', async () => {
    const params: TaskQueryParams = {
      isCompleted: 'true',
      hasDueDate: 'false',
    };
    const responseGet = await repository.getAllTasks(params);

    const allTasksFiltered = allTasks.filter(
      task => task.isCompleted && !task.dueDate,
    );

    expect(responseGet.data).toEqual(expect.arrayContaining(allTasksFiltered));
    expect(responseGet.data).toHaveLength(allTasksFiltered.length);

    const responseGetWithDueDate = await repository.getAllTasks({
      hasDueDate: 'true',
    });
    const allTasksWithDueDate = allTasks.filter(task => !!task.dueDate);

    const metaAllTasksWithDueDate = getMetaMock(allTasksWithDueDate);

    expect(responseGetWithDueDate).toStrictEqual({
      status: 200,
      message: 'Success',
      meta: metaAllTasksWithDueDate,
      data: allTasksWithDueDate,
    });

    const responseGetWithIsCompletedFalse = await repository.getAllTasks({
      ...params,
      isCompleted: 'false',
    });

    const allTasksFilteredWithIsCompletedFalse = allTasks
      .filter(task => !task.isCompleted && !task.dueDate)
      .toReversed()
      .slice(0, PAGINATION.DEFAULT_LIMIT);

    expect(responseGetWithIsCompletedFalse.data).toEqual(
      expect.arrayContaining(allTasksFilteredWithIsCompletedFalse),
    );

    expect(responseGetWithIsCompletedFalse.data).toHaveLength(
      allTasksFilteredWithIsCompletedFalse.length,
    );
  });

  test('method getAllTasks with sort`s params - createdDate', async () => {
    const params: TaskQueryParams = {
      sortBy: 'createdDate',
      order: 'asc',
    };

    const responseGetAsc = await repository.getAllTasks(params);
    const dataAsc = getSortedAllTasks(params.order, 'createdDate', allTasks);
    const meta = getMetaMock(allTasks);

    expect(responseGetAsc).toStrictEqual({
      status: 200,
      message: 'Success',
      meta,
      data: dataAsc,
    });

    const responseGetDesc = await repository.getAllTasks({
      ...params,
      order: 'desc',
    });
    const dataDesc = getSortedAllTasks('desc', 'createdDate', allTasks);

    expect(responseGetDesc).toStrictEqual({
      status: 200,
      message: 'Success',
      meta,
      data: dataDesc,
    });
  });

  test('method getAllTasks with sort`s params - dueDate', async () => {
    const params: TaskQueryParams = {
      sortBy: 'dueDate',
      order: 'asc',
    };

    const responseGetAsc = await repository.getAllTasks(params);
    const dataAsc = getSortedAllTasks(params.order, 'dueDate', allTasks);
    const meta = getMetaMock(allTasks);

    expect(responseGetAsc).toStrictEqual({
      status: 200,
      message: 'Success',
      meta,
      data: dataAsc,
    });

    const responseGetDesc = await repository.getAllTasks({
      ...params,
      order: 'desc',
    });
    const dataDesc = getSortedAllTasks('desc', 'dueDate', allTasks);
    expect(responseGetDesc).toStrictEqual({
      status: 200,
      message: 'Success',
      meta,
      data: dataDesc,
    });
  });

  test('method getAllTasks with sort - undefined values', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: realId,
        tasks: tasksWithUndefined,
      },
    ]);

    const responseAsc = await repository.getAllTasks({
      sortBy: 'dueDate',
      order: 'asc',
    });

    expect(responseAsc.data?.[0].dueDate).toBeDefined();
    expect(responseAsc.data?.[1].dueDate).toBeUndefined();
    expect(responseAsc.data?.[2].dueDate).toBeUndefined();

    const responseDesc = await repository.getAllTasks({
      sortBy: 'dueDate',
      order: 'desc',
    });

    expect(responseDesc.data?.[0].dueDate).toBeUndefined();
    expect(responseDesc.data?.[1].dueDate).toBeUndefined();
    expect(responseDesc.data?.[2].dueDate).toBeDefined();
  });

  test('method getAllTasks with sort - equal values', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: realId,
        tasks: tasksWithEqualDates,
      },
    ]);

    const response = await repository.getAllTasks({
      sortBy: 'dueDate',
      order: 'asc',
    });

    expect(response.data?.[0]._id).toBe('1');
    expect(response.data?.[1]._id).toBe('2');
  });

  test('method getAllTasks with sort - value comparison', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: realId,
        tasks: tasksWithDifferentDates,
      },
    ]);

    const responseAsc = await repository.getAllTasks({
      sortBy: 'dueDate',
      order: 'asc',
    });

    expect(responseAsc.data?.[0].dueDate).toEqual(date1);
    expect(responseAsc.data?.[1].dueDate).toEqual(date2);
    expect(responseAsc.data?.[2].dueDate).toEqual(date3);

    const responseDesc = await repository.getAllTasks({
      sortBy: 'dueDate',
      order: 'desc',
    });

    expect(responseDesc.data?.[0].dueDate).toEqual(date3);
    expect(responseDesc.data?.[1].dueDate).toEqual(date2);
    expect(responseDesc.data?.[2].dueDate).toEqual(date1);
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

    const meta = getMetaMock(allTasksSearched);

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      meta,
      data: allTasksSearched,
    });

    const responseGetAgain = await repository.getAllTasks({ search: '' });
    const metaAllTask = getMetaMock(allTasks);
    const paginatedTasks = allTasks
      .toReversed()
      .slice(0, PAGINATION.DEFAULT_LIMIT);

    expect(responseGetAgain).toStrictEqual({
      status: 200,
      message: 'Success',
      meta: metaAllTask,
      data: paginatedTasks,
    });
  });

  test('method getSingleTask', async () => {
    const responseGet = await repository.getSingleTask(realId, realId);

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      data: NOTEPADS[0].tasks[0],
    });

    const incorrectResponseGet = await repository.getSingleTask(realId, taskId);

    expect(incorrectResponseGet).toStrictEqual({
      status: 404,
      message: `Task ${taskId} not found`,
      data: undefined,
    });
  });

  test('method getSingleNotepadTasks', async () => {
    const responseGet = await repository.getSingleNotepadTasks(realId);

    const singleNotepadTasks = NOTEPADS[0].tasks;
    const meta = getMetaMock(singleNotepadTasks);

    expect(responseGet).toStrictEqual({
      status: 200,
      message: 'Success',
      meta,
      data: singleNotepadTasks.slice(0, PAGINATION.DEFAULT_LIMIT),
    });

    const incorrectResponseGet =
      await repository.getSingleNotepadTasks(notepadId);

    const metaEmpty = getMetaMock([]);

    expect(incorrectResponseGet).toStrictEqual({
      status: 404,
      message: `Notepad ${notepadId} not found`,
      meta: metaEmpty,
      data: [],
    });
  });

  test('method updateNotepad', async () => {
    const responseUpdate = await repository.updateNotepad(
      realId,
      newTitleNotepad,
    );

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A notepad with the id ${realId} has been successfully updated`,
      data: {
        title: newTitleNotepad.title,
        _id: realId,
        tasks: NOTEPADS[0].tasks,
      },
    });

    const responseUpdateDouble = await repository.updateNotepad(
      realId,
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
    const responseUpdate = await repository.updateTask(realId, updatedTask);

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A task with the _id ${realId} has been successfully updated`,
      data: { ...NOTEPADS[0].tasks[0], ...updatedTask },
    });

    const badResponseUpdateDouble = await repository.updateTask(
      taskId,
      newTitleNotepad,
    );

    expect(badResponseUpdateDouble).toStrictEqual({
      status: 404,
      message: 'Task not found',
    });
  });

  test('method updateTask without Title', async () => {
    const responseUpdate = await repository.updateTask(
      realId,
      updatedTaskWithoutTitle,
    );

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A task with the _id ${realId} has been successfully updated`,
      data: { ...NOTEPADS[0].tasks[0], ...updatedTaskWithoutTitle },
    });
  });

  test('method updateTask and undefined dueDate', async () => {
    const responseUpdate = await repository.updateTask(realId, {
      ...updatedTask,
      dueDate: null,
    });

    const updatedData = { ...NOTEPADS[0].tasks[0] };
    delete updatedData.dueDate;

    expect(responseUpdate).toEqual({
      status: 200,
      message: `A task with the _id ${realId} has been successfully updated`,
      data: { ...updatedData, notepadId: realId, title: updatedTask.title },
    });
  });

  test('method updateTask and not undefined dueDate', async () => {
    const newDueDate = new Date();
    const responseUpdate = await repository.updateTask(realId, {
      ...updatedTask,
      dueDate: newDueDate,
    });

    const updatedData = { ...NOTEPADS[0].tasks[0], dueDate: newDueDate };

    expect(responseUpdate).toEqual({
      status: 200,
      message: `A task with the _id ${realId} has been successfully updated`,
      data: { ...updatedData, notepadId: realId, title: updatedTask.title },
    });
  });

  test('method updateTask and notepadError', async () => {
    const responseUpdate = await repository.updateTask(realId, {
      ...updatedTask,
      notepadId: notepadId,
    });

    expect(responseUpdate).toEqual({
      status: 404,
      message: 'Notepad not found',
    });
  });

  test('method updateTask and common notepad', async () => {
    const responseUpdate = await repository.updateTask(realId, {
      ...updatedTask,
      notepadId: commonNotepadId,
    });

    expect(responseUpdate).toStrictEqual({
      status: 200,
      message: `A task with the _id ${realId} has been successfully updated`,
      data: {
        ...NOTEPADS[0].tasks[0],
        title: updatedTask.title,
        notepadId: commonNotepadId,
      },
    });
  });

  test('method updateTask and switch task to another notepad', async () => {
    const anotherRealTaskId = '2';

    const responseUpdate = await repository.updateTask(realId, {
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

    const response = await repository.updateTask(realId, updatedTask);
    expect(response?.data?.progress).toBe(
      `${updatedTask.subtasks.filter(task => task.isCompleted).length}/${updatedTask.subtasks.length}`,
    );
  });

  test('should handle empty subtasks with empty progress', async () => {
    const response = await repository.updateTask(realId, {
      title: 'Updated title',
      subtasks: [],
    });

    expect(response?.data?.progress).toBe('');
  });

  test('should default finishedSubtasks and totalSubtasks to 0', async () => {
    const repo = new MockTaskRepository(customNotepad);

    const response = await repo.updateTask(realId, {
      title: 'New title',
    });

    expect(response.status).toBe(200);
    expect(response.data?.progress).toBe('');
  });

  test('method deleteNotepad', async () => {
    const responseDelete = await repository.deleteNotepad(realId);

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
    const responseDelete = await repository.deleteTask(realId);
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

  test('method deleteTask with common notepad and unreal notepadId', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: commonNotepadId,
        tasks: tasksWithCommonAndUnrealNotepadIds,
      },
    ]);

    const successResponse = {
      status: 200,
      message: 'Task deleted successfully',
    };
    const responseDeleteCommonNotepad = await repository.deleteTask('1');
    const responseDeleteUnrealNotepad = await repository.deleteTask('2');

    expect([responseDeleteCommonNotepad, responseDeleteUnrealNotepad]).toEqual([
      successResponse,
      successResponse,
    ]);
  });
});
