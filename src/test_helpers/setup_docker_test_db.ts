import "src/config/index";
import dbConfigs from "src/config/database";
import { Client } from "pg";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export const DEFAULT_TEST_TIMEOUT = 60 * 1000;

export async function setupDockerTestDb() {
  const dbConfig = dbConfigs["test"];

  const POSTGRES_USER = dbConfig.user;
  const POSTGRES_PASSWORD = dbConfig.password;
  const POSTGRES_DB = dbConfig.database;

  console.log("setting up docker container...");
  const container = await new PostgreSqlContainer("postgres:15.5")
    .withEnvironment({ POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB })
    .start();

  const client = new Client({
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
  });

  console.log("connecting to db...");
  await client.connect();
  const db = drizzle(client);

  console.log("starting migration...");
  await migrate(db, { migrationsFolder: "drizzle" });

  return { container, db, client };
}
