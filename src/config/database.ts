export interface DbConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

export type DbConfigs = Record<NodeEnv, DbConfig>;

const development: DbConfig = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_DATABASE || "jayteeDB",
};

const test: DbConfig = {
  user: process.env.DB_TEST_USER || "test",
  password: process.env.DB_TEST_PASSWORD || "test",
  host: process.env.DB_TEST_HOST || "localhost",
  port: parseInt(process.env.DB_TEST_PORT || "5433"),
  database: process.env.DB_TEST_DATABASE || "test",
};

const dbConfigs: DbConfigs = {
  development,
  test,
};

export default dbConfigs;
