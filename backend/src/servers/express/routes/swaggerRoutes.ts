import { Router } from 'express';
import { ROUTES } from '@sharedCommon/routes';
import { handleSwaggerSpec, handleSwaggerUI } from '@swagger/handler';

export const swaggerRouter = Router();

swaggerRouter.get(ROUTES.swagger.ui, (req, res) => handleSwaggerUI(req, res));
swaggerRouter.get(ROUTES.swagger.spec, (req, res) =>
  handleSwaggerSpec(req, res),
);
