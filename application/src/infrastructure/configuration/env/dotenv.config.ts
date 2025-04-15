import dotenv from 'dotenv';

export class Config {
  private static instance: Config;
  private readonly _port: number;
  private readonly _databaseUrl: string;

  private constructor() {
    dotenv.config();
    this._port = parseInt(process.env.PORT || '3000', 10);
    this._databaseUrl = process.env.MONGO_CONNECTION || '';
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public get port(): number {
    return this._port;
  }

  public get databaseUrl(): string {
    return this._databaseUrl;
  }
}
