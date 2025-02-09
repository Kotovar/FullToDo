import express from 'express';

export const createExpressServer = (port: number) => {
  const app = express();

  app.listen(port);
};
