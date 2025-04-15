import mongoose from 'mongoose';
import { Config } from '@infrastructure/configuration/env/dotenv.config';

export class DatabaseConnect {
  private static instance: DatabaseConnect;
  private connection!: typeof mongoose;

  private constructor(private readonly configService: Config) {}

  public static getInstance(configService: Config): DatabaseConnect {
    if (!DatabaseConnect.instance) {
      DatabaseConnect.instance = new DatabaseConnect(configService);
    }
    return DatabaseConnect.instance;
  }

  public async connect(): Promise<void> {
    if (!this.connection) {
      try {
        this.connection = await mongoose.connect(this.configService.databaseUrl);
        console.log('MongoDB connected successfully!');
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      console.log('MongoDB disconnected.');
    }
  }
}
