import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dbConfigs from "src/config/database";
import envVariables from "src/config/environment";
import * as schema from "src/db/schema/index";

const pool = new Pool({
  ...dbConfigs[envVariables.nodeEnv],
});

export const db = drizzle(pool, { schema });
