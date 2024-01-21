import "src/config/index";
import "src/utils/error_handling_helpers";
import dbConfigs from "src/config/database";
import { Client } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "src/db/schema";
import { sql } from "drizzle-orm";

export const DEFAULT_TEST_TIMEOUT = 60 * 1000;

export async function setupDockerTestContainer(): Promise<StartedPostgreSqlContainer> {
  const dbConfig = dbConfigs["test"];

  const POSTGRES_USER = dbConfig.user;
  const POSTGRES_PASSWORD = dbConfig.password;
  const POSTGRES_DB = dbConfig.database;

  console.log("setting up docker container...");
  const container = await new PostgreSqlContainer("postgres:15.5")
    .withEnvironment({ POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB })
    .start();

  return container;
}

export async function setupTestDb(
  container: StartedPostgreSqlContainer
): Promise<Client> {
  const client = new Client({
    host: container.getHost(),
    port: container.getPort(),
    database: container.getDatabase(),
    user: container.getUsername(),
    password: container.getPassword(),
  });

  client.connect();
  const db = drizzle(client, { schema });

  await migrate(db, { migrationsFolder: "drizzle" });

  global.db = db;

  return client;
}

export function dbTestSuite(suiteName: string, testBlock: () => void) {
  describe(suiteName, () => {
    let container: StartedPostgreSqlContainer;
    let client: Client;

    beforeAll(async () => {
      container = await setupDockerTestContainer();
    }, DEFAULT_TEST_TIMEOUT);

    beforeEach(async () => {
      client = await setupTestDb(container);
    });

    afterEach(async () => {
      await db.execute(sql`DROP SCHEMA public CASCADE;`);
      await db.execute(sql`DROP SCHEMA drizzle CASCADE;`);
      await db.execute(sql`CREATE SCHEMA public;`);
      await db.execute(sql`GRANT ALL ON SCHEMA public TO test;`);
      await db.execute(sql`GRANT ALL ON SCHEMA public TO public;`);
      await db.execute(
        sql`COMMENT ON SCHEMA public IS 'standard public schema';`
      );
      await client.end();
    });

    afterAll(async () => {
      container.stop();
    });

    testBlock();
  });
}
