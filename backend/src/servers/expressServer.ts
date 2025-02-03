import express from 'express';

export const createExpressServer = (port: number) => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello from Express server!');
  });

  app.listen(port);
};
