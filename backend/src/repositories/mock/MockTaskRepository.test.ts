import { describe, test, expect, beforeEach } from 'vitest';
import {
  COMMON_NOTEPAD_ID,
  PAGINATION,
  USER_ID,
  type Task,
  type TaskQueryParams,
} from '@sharedCommon/schemas';
import { MockTaskRepository } from './MockTaskRepository';
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
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;

      return order === 'asc' ? cmp : -cmp;
    })
    .splice(0, PAGINATION.DEFAULT_LIMIT);

describe('MockTaskRepository', () => {
  let repository: MockTaskRepository;
  const updatedTask: Partial<Task> = { title: 'new' };
  const updatedTaskWithoutTitle: Partial<Task> = { isCompleted: true };

  beforeEach(() => {
    repository = new MockTaskRepository(NOTEPADS);
  });

  test('method createNotepad', async () => {
    const newNotepad = await repository.createNotepad(newTitleNotepad, USER_ID);

    expect(newNotepad).toEqual(
      expect.objectContaining({
        tasks: [],
        title: newTitleNotepad.title,
      }),
    );

    await expect(
      repository.createNotepad(newTitleNotepad, USER_ID),
    ).rejects.toThrow(
      `Notebook with title ${newTitleNotepad.title} already exists`,
    );
  });

  test('method createTask', async () => {
    const newTaskData = await repository.createTask(newTask, realId, USER_ID);

    expect(newTaskData).toEqual(
      expect.objectContaining({
        title: newTask.title,
        createdDate: new Date(),
        notepadId: realId,
        progress: '',
        isCompleted: false,
      }),
    );

    await expect(
      repository.createTask(newTask, notepadId, USER_ID),
    ).rejects.toThrow(`Notebook ${notepadId} not found`);
  });

  test('method createTask and common notepad', async () => {
    const newTaskData = await repository.createTask(
      newTask,
      COMMON_NOTEPAD_ID,
      USER_ID,
    );

    expect(newTaskData).toEqual(
      expect.objectContaining({
        title: newTask.title,
        notepadId: COMMON_NOTEPAD_ID,
        progress: '',
        isCompleted: false,
        createdDate: expect.any(Date),
      }),
    );
  });

  test('method getAllNotepads', async () => {
    const allNotepads = await repository.getAllNotepads(USER_ID);

    const notepadsWithoutTasks = [
      { title: 'Задачи', _id: COMMON_NOTEPAD_ID, userId: USER_ID },
    ].concat(NOTEPADS.map(({ tasks: _, ...rest }) => rest));

    expect(notepadsWithoutTasks).toEqual(allNotepads);
  });

  test('method getAllTasks', async () => {
    const response = await repository.getAllTasks(USER_ID);

    const meta = getMetaMock(allTasks);

    expect(response).toEqual({
      meta,
      tasks: paginatedTasks,
    });
  });

  test('method getAllTasks with filter`s params', async () => {
    const params: TaskQueryParams = {
      isCompleted: 'true',
      hasDueDate: 'false',
    };

    const response = await repository.getAllTasks(USER_ID, params);

    const allTasksFiltered = allTasks
      .filter(task => task.isCompleted && !task.dueDate)
      .slice(0, PAGINATION.DEFAULT_LIMIT);

    const meta = getMetaMock(allTasksFiltered);

    expect(response).toEqual({
      meta,
      tasks: allTasksFiltered,
    });

    const responseGetWithDueDate = await repository.getAllTasks(USER_ID, {
      hasDueDate: 'true',
    });

    const allTasksWithDueDate = allTasks.filter(task => !!task.dueDate);
    const metaAllTasksWithDueDate = getMetaMock(allTasksWithDueDate);

    expect(responseGetWithDueDate).toEqual({
      meta: metaAllTasksWithDueDate,
      tasks: allTasksWithDueDate,
    });

    const responseGetWithIsCompletedFalse = await repository.getAllTasks(
      USER_ID,
      {
        hasDueDate: 'false',
        isCompleted: 'false',
      },
    );

    const allTasksFilteredWithIsCompletedFalse = allTasks
      .filter(task => !task.isCompleted && !task.dueDate)
      .slice(0, PAGINATION.DEFAULT_LIMIT);

    expect(responseGetWithIsCompletedFalse.tasks).toEqual(
      allTasksFilteredWithIsCompletedFalse,
    );
  });

  test('method getAllTasks with sort`s params - createdDate', async () => {
    const params: TaskQueryParams = {
      sortBy: 'createdDate',
      order: 'asc',
    };

    const responseGetAsc = await repository.getAllTasks(USER_ID, params);
    const dataAsc = getSortedAllTasks(params.order, 'createdDate', allTasks);
    const meta = getMetaMock(allTasks);

    expect(responseGetAsc).toEqual({
      meta,
      tasks: dataAsc,
    });

    const responseGetDesc = await repository.getAllTasks(USER_ID, {
      sortBy: 'createdDate',
      order: 'desc',
    });

    const dataDesc = getSortedAllTasks('desc', 'createdDate', allTasks);

    expect(responseGetDesc).toEqual({
      meta,
      tasks: dataDesc,
    });
  });

  test('method getAllTasks with sort`s params - dueDate', async () => {
    const params: TaskQueryParams = {
      sortBy: 'dueDate',
      order: 'asc',
    };

    const responseGetAsc = await repository.getAllTasks(USER_ID, params);
    const dataAsc = getSortedAllTasks(params.order, 'dueDate', allTasks);
    const meta = getMetaMock(allTasks);

    expect(responseGetAsc).toStrictEqual({
      meta,
      tasks: dataAsc,
    });

    const responseGetDesc = await repository.getAllTasks(USER_ID, {
      ...params,
      order: 'desc',
    });

    const dataDesc = getSortedAllTasks('desc', 'dueDate', allTasks);

    expect(responseGetDesc).toStrictEqual({
      meta,
      tasks: dataDesc,
    });
  });

  test('method getAllTasks with sort - undefined values', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: realId,
        userId: USER_ID,
        tasks: tasksWithUndefined,
      },
    ]);

    const responseAsc = await repository.getAllTasks(USER_ID, {
      sortBy: 'dueDate',
      order: 'asc',
    });

    expect(responseAsc.tasks?.[0].dueDate).toBeDefined();
    expect(responseAsc.tasks?.[1].dueDate).toBeUndefined();
    expect(responseAsc.tasks?.[2].dueDate).toBeUndefined();

    const responseDesc = await repository.getAllTasks(USER_ID, {
      sortBy: 'dueDate',
      order: 'desc',
    });

    expect(responseDesc.tasks?.[0].dueDate).toBeUndefined();
    expect(responseDesc.tasks?.[1].dueDate).toBeUndefined();
    expect(responseDesc.tasks?.[2].dueDate).toBeDefined();
  });

  test('method getAllTasks with sort - equal values', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: realId,
        userId: USER_ID,
        tasks: tasksWithEqualDates,
      },
    ]);

    const response = await repository.getAllTasks(USER_ID, {
      sortBy: 'dueDate',
      order: 'asc',
    });

    expect(response.tasks?.[0]._id).toBe('1');
    expect(response.tasks?.[1]._id).toBe('2');
  });

  test('method getAllTasks with sort - value comparison', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: realId,
        userId: USER_ID,
        tasks: tasksWithDifferentDates,
      },
    ]);

    const responseAsc = await repository.getAllTasks(USER_ID, {
      sortBy: 'dueDate',
      order: 'asc',
    });

    expect(responseAsc.tasks?.[0].dueDate).toEqual(date1);
    expect(responseAsc.tasks?.[1].dueDate).toEqual(date2);
    expect(responseAsc.tasks?.[2].dueDate).toEqual(date3);

    const responseDesc = await repository.getAllTasks(USER_ID, {
      sortBy: 'dueDate',
      order: 'desc',
    });

    expect(responseDesc.tasks?.[0].dueDate).toEqual(date3);
    expect(responseDesc.tasks?.[1].dueDate).toEqual(date2);
    expect(responseDesc.tasks?.[2].dueDate).toEqual(date1);
  });

  test('method getAllTasks with search', async () => {
    const params: TaskQueryParams = {
      search: '  TasK  ',
    };

    const responseGet = await repository.getAllTasks(USER_ID, params);

    const allTasksSearched = allTasks.filter(
      task =>
        task.title.toLowerCase().includes('task') ||
        task.description?.toLowerCase().includes('task'),
    );

    const meta = getMetaMock(allTasksSearched);

    expect(responseGet).toEqual({
      meta,
      tasks: allTasksSearched,
    });

    const responseGetAgain = await repository.getAllTasks(USER_ID, {
      search: '',
    });
    const metaAllTask = getMetaMock(allTasks);
    const paginatedTasks = allTasks.slice(0, PAGINATION.DEFAULT_LIMIT);

    expect(responseGetAgain).toEqual({
      meta: metaAllTask,
      tasks: paginatedTasks,
    });
  });

  test('method getSingleTask', async () => {
    const responseGet = await repository.getSingleTask(realId, realId, USER_ID);

    expect(responseGet).toEqual(NOTEPADS[0].tasks[0]);

    await expect(
      repository.getSingleTask(realId, taskId, USER_ID),
    ).rejects.toThrow(`Task ${taskId} not found`);
  });

  test('method getSingleNotepadTasks', async () => {
    const responseGet = await repository.getSingleNotepadTasks(realId, USER_ID);

    const meta = getMetaMock(NOTEPADS[0].tasks);
    const singleNotepadTasks = NOTEPADS[0].tasks.slice(
      0,
      PAGINATION.DEFAULT_LIMIT,
    );

    expect(responseGet).toEqual({
      meta,
      tasks: singleNotepadTasks,
    });

    await expect(
      repository.getSingleNotepadTasks(notepadId, USER_ID),
    ).rejects.toThrow(`Notepad ${notepadId} not found`);
  });

  test('method updateNotepad', async () => {
    const responseUpdate = await repository.updateNotepad(
      realId,
      newTitleNotepad,
      USER_ID,
    );

    expect(responseUpdate).toEqual({
      _id: realId,
      title: newTitleNotepad.title,
      tasks: NOTEPADS[0].tasks,
      userId: USER_ID,
    });

    await expect(
      repository.updateNotepad(realId, newTitleNotepad, USER_ID),
    ).rejects.toThrow(`The title ${newTitleNotepad.title} is already in use`);

    await expect(
      repository.updateNotepad(notepadId, newTitleNotepad, USER_ID),
    ).rejects.toThrow(`Notepad ${notepadId} not found`);
  });

  test('method updateTask', async () => {
    const responseUpdate = await repository.updateTask(
      realId,
      updatedTask,
      USER_ID,
    );

    expect(responseUpdate).toEqual({
      ...NOTEPADS[0].tasks[0],
      title: updatedTask.title,
    });

    await expect(
      repository.updateTask(taskId, newTitleNotepad, USER_ID),
    ).rejects.toThrow('Task not found');
  });

  test('method updateTask without Title', async () => {
    const responseUpdate = await repository.updateTask(
      realId,
      updatedTaskWithoutTitle,
      USER_ID,
    );

    expect(responseUpdate).toEqual({
      ...NOTEPADS[0].tasks[0],
      ...updatedTaskWithoutTitle,
    });
  });

  test('method updateTask and undefined dueDate', async () => {
    const responseUpdate = await repository.updateTask(
      realId,
      { ...updatedTask, dueDate: null },
      USER_ID,
    );

    const updatedData = { ...NOTEPADS[0].tasks[0] };
    delete updatedData.dueDate;

    expect(responseUpdate).toEqual({
      ...updatedData,
      notepadId: realId,
      title: updatedTask.title,
    });
  });

  test('method updateTask and not undefined dueDate', async () => {
    const newDueDate = new Date();
    const responseUpdate = await repository.updateTask(
      realId,
      { ...updatedTask, dueDate: newDueDate },
      USER_ID,
    );

    const updatedData = { ...NOTEPADS[0].tasks[0], dueDate: newDueDate };

    expect(responseUpdate).toEqual({
      ...updatedData,
      notepadId: realId,
      title: updatedTask.title,
    });
  });

  test('method updateTask and notepadError', async () => {
    await expect(
      repository.updateTask(
        realId,
        { ...updatedTask, notepadId: notepadId },
        USER_ID,
      ),
    ).rejects.toThrow(`Notebook ${notepadId} not found`);
  });

  test('method updateTask and common notepad', async () => {
    const responseUpdate = await repository.updateTask(
      realId,
      { ...updatedTask, notepadId: COMMON_NOTEPAD_ID },
      USER_ID,
    );

    expect(responseUpdate).toStrictEqual({
      ...NOTEPADS[0].tasks[0],
      title: updatedTask.title,
      notepadId: COMMON_NOTEPAD_ID,
    });
  });

  test('method updateTask and switch task to another notepad', async () => {
    const anotherRealTaskId = '2';

    const responseUpdate = await repository.updateTask(
      realId,
      { ...updatedTask, notepadId: anotherRealTaskId },
      USER_ID,
    );

    expect(responseUpdate.notepadId).toBe(anotherRealTaskId);
  });

  test('should calculate progress when no subtasks completed', async () => {
    const updatedTask = {
      title: 'Updated title',
      subtasks: [{ isCompleted: false, title: 'Выучить Java', _id: '7' }],
    };

    const response = await repository.updateTask(realId, updatedTask, USER_ID);
    expect(response.progress).toBe(
      `${updatedTask.subtasks.filter(task => task.isCompleted).length}/${updatedTask.subtasks.length}`,
    );
  });

  test('should handle empty subtasks with empty progress', async () => {
    const response = await repository.updateTask(
      realId,
      { title: 'Updated title', subtasks: [] },
      USER_ID,
    );

    expect(response.progress).toBe('');
  });

  test('should default finishedSubtasks and totalSubtasks to 0', async () => {
    const repo = new MockTaskRepository(customNotepad);

    const updatedTask = await repo.updateTask(
      realId,
      { title: 'New title' },
      USER_ID,
    );

    expect(updatedTask.progress).toBe('');
  });

  test('method deleteNotepad', async () => {
    await expect(
      repository.deleteNotepad(realId, USER_ID),
    ).resolves.toBeUndefined();

    await expect(
      repository.deleteNotepad(notepadId, USER_ID),
    ).rejects.toThrow();
  });

  test('method deleteTask', async () => {
    await expect(
      repository.deleteTask(realId, USER_ID),
    ).resolves.toBeUndefined();

    await expect(repository.deleteTask(taskId, USER_ID)).rejects.toThrow();
  });

  test('method deleteTask with common notepad and unreal notepadId', async () => {
    const repository = new MockTaskRepository([
      {
        title: 'Test Notepad',
        _id: COMMON_NOTEPAD_ID,
        userId: USER_ID,
        tasks: tasksWithCommonAndUnrealNotepadIds,
      },
    ]);

    await expect(repository.deleteTask('1', USER_ID)).resolves.toBeUndefined();
    await expect(repository.deleteTask('2', USER_ID)).resolves.toBeUndefined();
  });
});
