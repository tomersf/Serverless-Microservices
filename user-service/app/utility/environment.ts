import dotenv from "dotenv";
dotenv.config();

interface EnvVars {
  ACCOUNT_SID: string;
  AUTH_TOKEN: string;
  JWT_SECRET: string;
}

export class Environment {
  private static getEnvVariable<T extends keyof EnvVars>(name: T): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }

  public static get accountSid(): string {
    return Environment.getEnvVariable("ACCOUNT_SID");
  }

  public static get authToken(): string {
    return Environment.getEnvVariable("AUTH_TOKEN");
  }

  public static get jwtSecret(): string {
    return Environment.getEnvVariable("JWT_SECRET");
  }
}
