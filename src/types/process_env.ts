declare global {
  type NodeEnv = "development" | "test";
  namespace NodeJS {
    interface ProcessEnv {
      DB_USER: string;
      PORT: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      DB_PORT: string;
      DB_DATABASE: string;
      DB_TEST_USER: string;
      DB_TEST_PASSWORD: string;
      DB_TEST_HOST: string;
      DB_TEST_PORT: string;
      DB_TEST_DATABASE: string;
      NODE_ENV: NodeEnv;
      SALT_ROUNDS: string;
      JWT_ACCESS_TOKEN_SECRET: string;
      JWT_REFRESH_TOKEN_SECRET: string;
    }
  }
}

export {};
