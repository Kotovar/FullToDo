import { Router } from 'express';
import { authRouter } from './authRoutes';
import { notepadRouter } from './notepadRoutes';
import { swaggerRouter } from './swaggerRoutes';
import { taskRouter } from './taskRoutes';

export const expressRouter = Router();

expressRouter.use(swaggerRouter);
expressRouter.use(notepadRouter);
expressRouter.use(taskRouter);
expressRouter.use(authRouter);
