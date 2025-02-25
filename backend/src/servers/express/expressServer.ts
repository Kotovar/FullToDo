import express from 'express';

export const createExpressServer = () => {
  const app = express();

  // app.listen(port);
  return app;
};
