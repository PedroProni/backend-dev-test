import express from 'express';
import { createExpressApp } from '@infrastructure/web/express/express.app';
import { DatabaseConnect } from '@infrastructure/database/connection/database.connect';
import { Config } from '@infrastructure/configuration/env/dotenv.config';

const app = express();

const startServer = async () => {
  try {
    const configService = Config.getInstance();
    const db = DatabaseConnect.getInstance(configService);

    await db.connect();
    createExpressApp(app);
    console.log('Server started successfully.');
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
};

startServer();

export { app };
