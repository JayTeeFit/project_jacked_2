import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { NodePgDatabase } from "drizzle-orm/node-postgres/driver";
import { Client } from "pg";
import { NewUserSchema, users } from "src/db/schema";
import { setupDockerTestDb } from "src/test_helpers/setup_docker_test_db";

describe("Users", () => {
  const defaultTimeout = 60 * 1000;
  let container: StartedPostgreSqlContainer;
  let db: NodePgDatabase<Record<string, never>>;
  let client: Client;

  beforeAll(async () => {
    ({ container, db, client } = await setupDockerTestDb());
  }, defaultTimeout);

  it("can insert a user", async () => {
    const newUser: NewUserSchema = {
      username: "test",
      email: "test@email.com",
      premiumness: "coach",
    };

    const result = await db.insert(users).values(newUser).returning();
    const user = result.at(0);

    expect(user?.email).toBe("test@email.com");
    expect(user?.premiumness).toBe("coach");
    expect(user?.username).toBe("test");
  });

  afterAll(async () => {
    client.end();
    container.stop();
  });
});
