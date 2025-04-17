import express, { Application } from 'express';
import userRoutes from './routes/user.routes'
import twoFaRoutes from './routes/2fa.routes';
import cors from 'cors';

const createExpressApp = (app: Application): void => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use('/users', userRoutes);
  app.use('/2fa', twoFaRoutes);
};

export { createExpressApp };
