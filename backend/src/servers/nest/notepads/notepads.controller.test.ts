import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { describe, expect, test, vi, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { NotepadService } from '@services';
import { MockTaskRepository } from '@repositories/mock';
import { COMMON_NOTEPAD_ID } from '@sharedCommon/schemas';
import { generateAccessToken } from '@utils';
import { NEST_TASK_REPOSITORY } from '../common/provider-tokens';
import { AuthGuard } from '../common/auth.guard';
import { AppErrorFilter } from '../common/app-error.filter';
import { NotepadsController } from './notepads.controller';

/**
 * Генерация валидного Bearer-заголовка для тестов.
 *
 * `generateAccessToken` читает секрет из `config`, который в тестах
 * использует fallback-значение, поэтому токен будет валидным для
 * реального {@link AuthGuard}.
 */
const authHeader = (userId: number) => `Bearer ${generateAccessToken(userId)}`;

describe('NotepadsController — unit-like (TestingModule + mock сервис)', () => {
  const mockService = {
    createNotepad: vi.fn(),
    getAllNotepads: vi.fn(),
    updateNotepad: vi.fn(),
    deleteNotepad: vi.fn(),
  };

  const createController = async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [NotepadsController],
      providers: [
        {
          provide: NotepadService,
          useValue: mockService,
        },
      ],
    })
      // Заменяем AuthGuard, чтобы не зависеть от JWT в unit-тестах:
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    return moduleRef.get(NotepadsController);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('create — вызывает сервис и возвращает ответ в нужном формате', async () => {
    const controller = await createController();
    const notepad = {
      _id: 'np-1',
      title: 'Learn Nest',
      userId: 1,
      tasks: [],
    };
    mockService.createNotepad.mockResolvedValue(notepad);

    const result = await controller.create({ title: 'Learn Nest' }, 1);

    expect(mockService.createNotepad).toHaveBeenCalledWith(
      { title: 'Learn Nest' },
      1,
    );
    expect(result).toEqual({
      message: 'Notepad "Learn Nest" created',
      notepad,
    });
  });

  test('findAll — возвращает массив блокнотов', async () => {
    const controller = await createController();
    const notepads = [
      { _id: 'np-1', title: 'A', userId: 1 },
      { _id: 'np-2', title: 'B', userId: 1 },
    ];
    mockService.getAllNotepads.mockResolvedValue(notepads);

    const result = await controller.findAll(1);

    expect(mockService.getAllNotepads).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      message: 'Success',
      data: notepads,
    });
  });

  test('update — передает id, данные и userId в сервис', async () => {
    const controller = await createController();
    const updated = {
      _id: 'np-1',
      title: 'Updated',
      userId: 1,
      tasks: [],
    };
    mockService.updateNotepad.mockResolvedValue(updated);

    const result = await controller.update('np-1', { title: 'Updated' }, 1);

    expect(mockService.updateNotepad).toHaveBeenCalledWith(
      'np-1',
      { title: 'Updated' },
      1,
    );
    expect(result).toEqual({
      message: 'A notepad with the id np-1 has been successfully updated',
      data: updated,
    });
  });

  test('remove — вызывает deleteNotepad и возвращает сообщение', async () => {
    const controller = await createController();
    mockService.deleteNotepad.mockResolvedValue(undefined);

    const result = await controller.remove('np-1', 1);

    expect(mockService.deleteNotepad).toHaveBeenCalledWith('np-1', 1);
    expect(result).toEqual({ message: 'Notepad deleted successfully' });
  });
});

describe('NotepadsController — HTTP интеграционные', () => {
  let app: INestApplication;
  let mockRepo: MockTaskRepository;

  /**
   * Собираем Nest-приложение вручную с реальным сервисом и mock-репозиторием.
   *
   * Вместо импорта `AppModule` (который читает `.env` и может выбрать Mongo/Postgres),
   * мы явно регистрируем:
   * - контроллер,
   * - `NotepadService` через фабрику (как в `nestProviders`),
   * - `MockTaskRepository` под токеном `NEST_TASK_REPOSITORY`.
   *
   * Это дает реальный HTTP-стек (AuthGuard → ZodValidationPipe → controller),
   * но с быстрым in-memory хранилищем.
   */
  beforeEach(async () => {
    mockRepo = new MockTaskRepository([]);

    const moduleRef = await Test.createTestingModule({
      controllers: [NotepadsController],
      providers: [
        {
          provide: NotepadService,
          inject: [NEST_TASK_REPOSITORY],
          useFactory: repo => new NotepadService(repo),
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

  test('GET /notepads без заголовка Authorization → 401', async () => {
    const response = await request(app.getHttpServer()).get('/notepads');

    expect(response.status).toBe(401);
  });

  test('POST /notepads — создает блокнот с валидным токеном', async () => {
    const response = await request(app.getHttpServer())
      .post('/notepads')
      .set('Authorization', authHeader(1))
      .send({ title: 'Nest Notes' })
      .expect(201);

    expect(response.body.message).toBe('Notepad "Nest Notes" created');
    expect(response.body.notepad.title).toBe('Nest Notes');
    expect(response.body.notepad.userId).toBe(1);
  });

  test('POST /notepads с невалидным body → 400 (ZodValidationPipe)', async () => {
    const response = await request(app.getHttpServer())
      .post('/notepads')
      .set('Authorization', authHeader(1))
      .send({ title: '' })
      .expect(400);

    expect(response.body.message).toBe('Invalid data');
    expect(response.body.errors).toBeDefined();
  });

  test('GET /notepads — возвращает список блокнотов пользователя', async () => {
    await mockRepo.createNotepad({ title: 'First' }, 1);
    await mockRepo.createNotepad({ title: 'Second' }, 1);
    await mockRepo.createNotepad({ title: 'Alien' }, 2);

    const response = await request(app.getHttpServer())
      .get('/notepads')
      .set('Authorization', authHeader(1))
      .expect(200);

    // MockTaskRepository всегда автоматически добавляет common notepad 'Задачи'
    expect(response.body.data).toHaveLength(3);
    expect(response.body.data.map((n: { title: string }) => n.title)).toEqual([
      'Задачи',
      'First',
      'Second',
    ]);
  });

  test('PATCH /notepads/:id — обновляет заголовок', async () => {
    const created = await mockRepo.createNotepad({ title: 'Old' }, 1);

    const response = await request(app.getHttpServer())
      .patch(`/notepads/${created._id}`)
      .set('Authorization', authHeader(1))
      .send({ title: 'New' })
      .expect(200);

    expect(response.body.message).toContain('successfully updated');
    expect(response.body.data.title).toBe('New');
  });

  test('DELETE /notepads/:id — удаляет блокнот', async () => {
    const created = await mockRepo.createNotepad({ title: 'To delete' }, 1);

    await request(app.getHttpServer())
      .delete(`/notepads/${created._id}`)
      .set('Authorization', authHeader(1))
      .expect(200);

    const list = await mockRepo.getAllNotepads(1);
    // common notepad 'Задачи' нельзя удалить, поэтому он остается
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('Задачи');
  });

  test('DELETE /notepads/:id чужого пользователя → 404 (ownership)', async () => {
    const created = await mockRepo.createNotepad({ title: 'Secret' }, 2);

    const response = await request(app.getHttpServer())
      .delete(`/notepads/${created._id}`)
      .set('Authorization', authHeader(1))
      .expect(404);

    expect(response.body.error.statusCode).toBe(404);
  });

  test('DELETE /notepads/all → 403 (common notepad)', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/notepads/${COMMON_NOTEPAD_ID}`)
      .set('Authorization', authHeader(1))
      .expect(403);

    expect(response.body.error.statusCode).toBe(403);
  });
});
