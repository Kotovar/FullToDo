import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, expect, test, vi, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { TaskService } from '@services';
import { MockTaskRepository } from '@repositories/mock';
import { COMMON_NOTEPAD_ID } from '@sharedCommon/schemas';
import { generateAccessToken } from '@utils';
import { NEST_TASK_REPOSITORY } from '../common/provider-tokens';
import { AuthGuard } from '../common/auth.guard';
import { AppErrorFilter } from '../common/app-error.filter';
import { NotepadTasksController, TasksController } from './tasks.controller';

const authHeader = (userId: number) => `Bearer ${generateAccessToken(userId)}`;

describe('TasksController — unit-like (TestingModule + mock сервис)', () => {
  const mockService = {
    createTask: vi.fn(),
    getAllTasks: vi.fn(),
    getSingleTask: vi.fn(),
    getSingleNotepadTasks: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  };

  const createControllers = async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController, NotepadTasksController],
      providers: [
        {
          provide: TaskService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    return {
      tasks: moduleRef.get(TasksController),
      notepadTasks: moduleRef.get(NotepadTasksController),
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('create — вызывает сервис с common notepad и возвращает ответ', async () => {
    const { tasks } = await createControllers();
    const task = {
      _id: 't1',
      title: 'Test',
      userId: 1,
      notepadId: COMMON_NOTEPAD_ID,
      createdDate: new Date(),
      progress: '0',
      isCompleted: false,
    };
    mockService.createTask.mockResolvedValue(task);

    const result = await tasks.create({ title: 'Test' }, 1);

    expect(mockService.createTask).toHaveBeenCalledWith(
      { title: 'Test' },
      COMMON_NOTEPAD_ID,
      1,
    );
    expect(result).toEqual({
      message: 'Task "Test" created',
      task,
    });
  });

  test('findAll — возвращает задачи с мета-информацией', async () => {
    const { tasks } = await createControllers();
    const paginated = {
      tasks: [
        {
          _id: 't1',
          title: 'A',
          userId: 1,
          notepadId: COMMON_NOTEPAD_ID,
          createdDate: new Date(),
          progress: '0',
          isCompleted: false,
        },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    mockService.getAllTasks.mockResolvedValue(paginated);

    const result = await tasks.findAll({}, 1);

    expect(mockService.getAllTasks).toHaveBeenCalledWith(1, {});
    expect(result).toEqual({
      message: 'Success',
      data: paginated.tasks,
      meta: paginated.meta,
    });
  });

  test('findOne — передает common notepad, taskId и userId', async () => {
    const { tasks } = await createControllers();
    const task = {
      _id: 't1',
      title: 'A',
      userId: 1,
      notepadId: COMMON_NOTEPAD_ID,
      createdDate: new Date(),
      progress: '0',
      isCompleted: false,
    };
    mockService.getSingleTask.mockResolvedValue(task);

    const result = await tasks.findOne('t1', 1);

    expect(mockService.getSingleTask).toHaveBeenCalledWith(
      COMMON_NOTEPAD_ID,
      't1',
      1,
    );
    expect(result).toEqual({ message: 'Success', data: task });
  });

  test('update — передает id, данные и userId в сервис', async () => {
    const { tasks } = await createControllers();
    const updated = {
      _id: 't1',
      title: 'Updated',
      userId: 1,
      notepadId: COMMON_NOTEPAD_ID,
      createdDate: new Date(),
      progress: '0',
      isCompleted: false,
    };
    mockService.updateTask.mockResolvedValue(updated);

    const result = await tasks.update('t1', { title: 'Updated' }, 1);

    expect(mockService.updateTask).toHaveBeenCalledWith('t1', { title: 'Updated' }, 1);
    expect(result).toEqual({
      message: 'A task with the _id t1 has been successfully updated',
      data: updated,
    });
  });

  test('remove — вызывает deleteTask и возвращает сообщение', async () => {
    const { tasks } = await createControllers();
    mockService.deleteTask.mockResolvedValue(undefined);

    const result = await tasks.remove('t1', 1);

    expect(mockService.deleteTask).toHaveBeenCalledWith('t1', 1);
    expect(result).toEqual({ message: 'Task deleted successfully' });
  });

  test('NotepadTasksController.create — создает задачу в указанном блокноте', async () => {
    const { notepadTasks } = await createControllers();
    const task = {
      _id: 't1',
      title: 'Test',
      userId: 1,
      notepadId: 'np1',
      createdDate: new Date(),
      progress: '0',
      isCompleted: false,
    };
    mockService.createTask.mockResolvedValue(task);

    const result = await notepadTasks.create('np1', { title: 'Test' }, 1);

    expect(mockService.createTask).toHaveBeenCalledWith(
      { title: 'Test' },
      'np1',
      1,
    );
    expect(result).toEqual({
      message: 'Task "Test" created',
      task,
    });
  });

  test('NotepadTasksController.findAll — возвращает задачи блокнота с мета', async () => {
    const { notepadTasks } = await createControllers();
    const paginated = {
      tasks: [
        {
          _id: 't1',
          title: 'A',
          userId: 1,
          notepadId: 'np1',
          createdDate: new Date(),
          progress: '0',
          isCompleted: false,
        },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };
    mockService.getSingleNotepadTasks.mockResolvedValue(paginated);

    const result = await notepadTasks.findAll('np1', {}, 1);

    expect(mockService.getSingleNotepadTasks).toHaveBeenCalledWith('np1', 1, {});
    expect(result).toEqual({
      message: 'Success',
      data: paginated.tasks,
      meta: paginated.meta,
    });
  });

  test('NotepadTasksController.findOne — передает notepadId, taskId и userId', async () => {
    const { notepadTasks } = await createControllers();
    const task = {
      _id: 't1',
      title: 'A',
      userId: 1,
      notepadId: 'np1',
      createdDate: new Date(),
      progress: '0',
      isCompleted: false,
    };
    mockService.getSingleTask.mockResolvedValue(task);

    const result = await notepadTasks.findOne('np1', 't1', 1);

    expect(mockService.getSingleTask).toHaveBeenCalledWith('np1', 't1', 1);
    expect(result).toEqual({ message: 'Success', data: task });
  });
});

describe('TasksController — HTTP интеграционные', () => {
  let app: INestApplication;
  let mockRepo: MockTaskRepository;

  beforeEach(async () => {
    mockRepo = new MockTaskRepository([]);

    const moduleRef = await Test.createTestingModule({
      controllers: [TasksController, NotepadTasksController],
      providers: [
        {
          provide: TaskService,
          inject: [NEST_TASK_REPOSITORY],
          useFactory: (repo) => new TaskService(repo),
        },
        {
          provide: NEST_TASK_REPOSITORY,
          useValue: mockRepo,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new AppErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /tasks без заголовка Authorization → 401', async () => {
    const response = await request(app.getHttpServer()).get('/tasks');
    expect(response.status).toBe(401);
  });

  test('POST /tasks — создает задачу в common notepad', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', authHeader(1))
      .send({ title: 'New Task' })
      .expect(201);

    expect(response.body.message).toBe('Task "New Task" created');
    expect(response.body.task.title).toBe('New Task');
    expect(response.body.task.notepadId).toBe(COMMON_NOTEPAD_ID);
  });

  test('POST /tasks с невалидным body → 400 (ZodValidationPipe)', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', authHeader(1))
      .send({ title: '' })
      .expect(400);

    expect(response.body.message).toBe('Invalid data');
    expect(response.body.errors).toBeDefined();
  });

  test('GET /tasks — возвращает задачи пользователя с пагинацией', async () => {
    await mockRepo.createTask({ title: 'Task 1' }, COMMON_NOTEPAD_ID, 1);
    await mockRepo.createTask({ title: 'Task 2' }, COMMON_NOTEPAD_ID, 1);
    await mockRepo.createTask({ title: 'Task 3' }, COMMON_NOTEPAD_ID, 2);

    const response = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', authHeader(1))
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta).toBeDefined();
    expect(response.body.meta.total).toBe(2);
  });

  test('GET /tasks?page=2&limit=1 — поддерживает query-параметры', async () => {
    await mockRepo.createTask({ title: 'Task 1' }, COMMON_NOTEPAD_ID, 1);
    await mockRepo.createTask({ title: 'Task 2' }, COMMON_NOTEPAD_ID, 1);
    await mockRepo.createTask({ title: 'Task 3' }, COMMON_NOTEPAD_ID, 1);

    const response = await request(app.getHttpServer())
      .get('/tasks?page=2&limit=1')
      .set('Authorization', authHeader(1))
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.meta.page).toBe(2);
    expect(response.body.meta.limit).toBe(1);
  });

  test('GET /tasks/:taskId — возвращает конкретную задачу', async () => {
    const task = await mockRepo.createTask(
      { title: 'Specific' },
      COMMON_NOTEPAD_ID,
      1,
    );

    const response = await request(app.getHttpServer())
      .get(`/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .expect(200);

    expect(response.body.data.title).toBe('Specific');
  });

  test('PATCH /tasks/:taskId — обновляет задачу', async () => {
    const task = await mockRepo.createTask(
      { title: 'Old' },
      COMMON_NOTEPAD_ID,
      1,
    );

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .send({ title: 'New' })
      .expect(200);

    expect(response.body.message).toContain('successfully updated');
    expect(response.body.data.title).toBe('New');
  });

  test('DELETE /tasks/:taskId — удаляет задачу', async () => {
    const task = await mockRepo.createTask(
      { title: 'To delete' },
      COMMON_NOTEPAD_ID,
      1,
    );

    await request(app.getHttpServer())
      .delete(`/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .expect(200);

    const list = await mockRepo.getAllTasks(1);
    expect(list.tasks).toHaveLength(0);
  });

  test('DELETE /tasks/:taskId чужого пользователя → 404 (ownership)', async () => {
    const task = await mockRepo.createTask(
      { title: 'Secret' },
      COMMON_NOTEPAD_ID,
      2,
    );

    const response = await request(app.getHttpServer())
      .delete(`/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .expect(404);

    expect(response.body.error.statusCode).toBe(404);
  });

  test('POST /notepads/:notepadId/tasks — создает задачу в блокноте', async () => {
    const notepad = await mockRepo.createNotepad({ title: 'My Notepad' }, 1);

    const response = await request(app.getHttpServer())
      .post(`/notepads/${notepad._id}/tasks`)
      .set('Authorization', authHeader(1))
      .send({ title: 'Notepad Task' })
      .expect(201);

    expect(response.body.message).toBe('Task "Notepad Task" created');
    expect(response.body.task.notepadId).toBe(notepad._id);
  });

  test('GET /notepads/:notepadId/tasks — возвращает задачи блокнота', async () => {
    const notepad = await mockRepo.createNotepad({ title: 'My Notepad' }, 1);
    await mockRepo.createTask({ title: 'Task 1' }, notepad._id, 1);
    await mockRepo.createTask({ title: 'Task 2' }, notepad._id, 1);

    const response = await request(app.getHttpServer())
      .get(`/notepads/${notepad._id}/tasks`)
      .set('Authorization', authHeader(1))
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta.total).toBe(2);
  });

  test('GET /notepads/:notepadId/tasks/:taskId — возвращает задачу', async () => {
    const notepad = await mockRepo.createNotepad({ title: 'My Notepad' }, 1);
    const task = await mockRepo.createTask(
      { title: 'Deep Task' },
      notepad._id,
      1,
    );

    const response = await request(app.getHttpServer())
      .get(`/notepads/${notepad._id}/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .expect(200);

    expect(response.body.data.title).toBe('Deep Task');
  });

  test('PATCH /notepads/:notepadId/tasks/:taskId — обновляет задачу', async () => {
    const notepad = await mockRepo.createNotepad({ title: 'My Notepad' }, 1);
    const task = await mockRepo.createTask(
      { title: 'Old' },
      notepad._id,
      1,
    );

    const response = await request(app.getHttpServer())
      .patch(`/notepads/${notepad._id}/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .send({ title: 'Updated' })
      .expect(200);

    expect(response.body.data.title).toBe('Updated');
  });

  test('DELETE /notepads/:notepadId/tasks/:taskId — удаляет задачу', async () => {
    const notepad = await mockRepo.createNotepad({ title: 'My Notepad' }, 1);
    const task = await mockRepo.createTask(
      { title: 'To delete' },
      notepad._id,
      1,
    );

    await request(app.getHttpServer())
      .delete(`/notepads/${notepad._id}/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .expect(200);

    const list = await mockRepo.getSingleNotepadTasks(notepad._id, 1);
    expect(list.tasks).toHaveLength(0);
  });

  test('GET /notepads/:notepadId/tasks/:taskId чужой задачи → 404 (ownership)', async () => {
    const notepad = await mockRepo.createNotepad({ title: 'My Notepad' }, 2);
    const task = await mockRepo.createTask(
      { title: 'Secret' },
      notepad._id,
      2,
    );

    const response = await request(app.getHttpServer())
      .get(`/notepads/${notepad._id}/tasks/${task._id}`)
      .set('Authorization', authHeader(1))
      .expect(404);

    expect(response.body.error.statusCode).toBe(404);
  });
});
