import { Dialect } from "sequelize";
export interface DbConfig {
  username: string;
  password: string;
  host: string;
  port: number;
  database: string;
  dialect: Dialect;
}

export type DbConfigs = Record<NodeEnv, DbConfig>;

const development: DbConfig = {
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_DATABASE || "postgres",
  dialect: "postgres",
};

const test: DbConfig = {
  username: process.env.DB_TEST_USERNAME || "postgres",
  password: process.env.DB_TEST_PASSWORD || "postgres",
  host: process.env.DB_TEST_HOST || "localhost",
  port: parseInt(process.env.DB_TEST_PORT || "5433"),
  database: process.env.DB_TEST_DATABASE || "postgres",
  dialect: "postgres",
};

// TODO: set up a production database with the correct information here. for now this mimics the development database
const production: DbConfig = {
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_DATABASE || "postgres",
  dialect: "postgres",
};

const dbConfigs: DbConfigs = {
  development,
  test,
  production,
};

export default dbConfigs;
