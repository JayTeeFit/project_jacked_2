import { Pool } from "pg";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import dbConfigs from "src/config/database";
import envVariables from "src/config/environment";
import * as schema from "src/db/schema/index";

const pool = new Pool({
  ...dbConfigs[envVariables.nodeEnv],
});

const database = drizzle(pool, { schema });

// For jest test units, the database implementation is in setupDockerTestDb()
// just piggybacking off this type declaration since I don't know how to make it better for now
declare global {
  var db: typeof database;
}

global.db = database;
