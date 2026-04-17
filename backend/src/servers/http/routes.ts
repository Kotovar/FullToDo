import { OAuth2Client } from 'google-auth-library';
import { OAuthService } from '@services/OAuthService';
import {
  TaskService,
  NotepadService,
  AuthService,
  EmailService,
} from '@services';
import { ROUTES } from '@sharedCommon/routes';
import { ROUTE_REGEX } from './routeRegex';
import {
  createNotepad,
  createTask,
  deleteNotepad,
  deleteTask,
  getAllNotepads,
  getAllTasks,
  getSingleNotepadTasks,
  getSingleTask,
  handleNotFound,
  updateNotepad,
  updateTask,
  registerWithEmail,
  loginWithEmail,
  authWithGoogle,
  logout,
  refresh,
  getCurrentUser,
  verifyEmail,
  resendVerification,
  changePassword,
  deleteUser,
} from '@controllers';
import {
  refreshTokenRepository,
  taskRepository,
  userRepository,
} from '@repositories';
import { handleSwaggerSpec, handleSwaggerUI } from '@swagger/handler';
import { config } from '@configs';
import type { HttpContext } from '@controllers/types';

const oauthClient = new OAuth2Client(config.googleClientId);
const oauthService = new OAuthService(oauthClient);
const emailService = new EmailService();
const authService = new AuthService(
  userRepository,
  refreshTokenRepository,
  emailService,
  oauthService,
);

const taskService = new TaskService(taskRepository);
const notepadService = new NotepadService(taskRepository);

type RouteHandler = (ctx: HttpContext) => Promise<void>;

export const BASE_ROUTES: Record<string, RouteHandler> = {
  [`POST ${ROUTES.notepads.base}`]: ctx => createNotepad(ctx, notepadService),
  [`POST ${ROUTES.tasks.base}`]: ctx => createTask(ctx, taskService),
  [`GET ${ROUTES.notepads.base}`]: ctx => getAllNotepads(ctx, notepadService),
  [`GET ${ROUTES.tasks.base}`]: ctx => getAllTasks(ctx, taskService),

  [`POST ${ROUTES.auth.register}`]: ctx => registerWithEmail(ctx, authService),
  [`POST ${ROUTES.auth.login}`]: ctx => loginWithEmail(ctx, authService),
  [`POST ${ROUTES.auth.logout}`]: ctx => logout(ctx, authService),
  [`POST ${ROUTES.auth.refresh}`]: ctx => refresh(ctx, authService),
  [`GET ${ROUTES.auth.me}`]: ctx => getCurrentUser(ctx, authService),
  [`POST ${ROUTES.auth.google}`]: ctx => authWithGoogle(ctx, authService),
  [`GET ${ROUTES.auth.verifyEmail}`]: ctx => verifyEmail(ctx, authService),
  [`POST ${ROUTES.auth.resendVerification}`]: ctx =>
    resendVerification(ctx, authService),
  [`POST ${ROUTES.auth.changePassword}`]: ctx =>
    changePassword(ctx, authService),
  [`POST ${ROUTES.auth.deleteUser}`]: ctx => deleteUser(ctx, authService),
};

export const handleRoute = (ctx: HttpContext, url?: string): boolean => {
  if (!url) return false;

  const { req, res } = ctx;

  if (url === '/api-docs' && req.method === 'GET') {
    handleSwaggerUI(req, res);
    return true;
  }

  if (url === '/api-docs/spec.json' && req.method === 'GET') {
    handleSwaggerSpec(req, res);
    return true;
  }

  const routeKey = `${ctx.req.method} ${url}`;

  if (BASE_ROUTES[routeKey]) {
    BASE_ROUTES[routeKey](ctx);
    return true;
  }

  if (url.match(ROUTE_REGEX.NOTEPAD_TASKS)) {
    switch (req.method) {
      case 'POST':
        createTask(ctx, taskService);
        break;
      case 'GET':
        getSingleNotepadTasks(ctx, taskService);
        break;
      default:
        handleNotFound(res);
    }

    return true;
  }

  if (url.match(ROUTE_REGEX.COMMON_TASK_DETAIL)) {
    switch (req.method) {
      case 'GET':
        getSingleTask(ctx, taskService);
        break;
      case 'PATCH':
        updateTask(ctx, taskService);
        break;
      case 'DELETE':
        deleteTask(ctx, taskService);
        break;
      default:
        handleNotFound(res);
    }

    return true;
  }

  if (url.match(ROUTE_REGEX.TASK_DETAIL)) {
    switch (req.method) {
      case 'GET':
        getSingleTask(ctx, taskService);
        break;
      case 'PATCH':
        updateTask(ctx, taskService);
        break;
      case 'DELETE':
        deleteTask(ctx, taskService);
        break;
      default:
        handleNotFound(res);
    }

    return true;
  }

  if (url.match(ROUTE_REGEX.NOTEPAD_ID)) {
    switch (req.method) {
      case 'PATCH':
        updateNotepad(ctx, notepadService);
        break;
      case 'DELETE':
        deleteNotepad(ctx, notepadService);
        break;
      default:
        handleNotFound(res);
    }
    return true;
  }

  return false;
};
