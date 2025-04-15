import express, { Application } from 'express';
import userRoutes from './routes/user.routes'

const createExpressApp = (app: Application): void => {
  app.use(express.json());
  app.use('/users', userRoutes);
};

export { createExpressApp };
